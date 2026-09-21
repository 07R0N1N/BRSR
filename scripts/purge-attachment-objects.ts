/**
 * Drain attachment_object_gc and optionally reconcile orphans in brsr-attachments.
 *
 * Usage:
 *   npx tsx scripts/purge-attachment-objects.ts
 *   npx tsx scripts/purge-attachment-objects.ts --dry-run
 *   npx tsx scripts/purge-attachment-objects.ts --reconcile
 *   npx tsx scripts/purge-attachment-objects.ts --reconcile --dry-run
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (e.g. .env.local).
 */

import { resolve } from "node:path";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { ATTACHMENTS_BUCKET } from "../lib/collaboration/attachments";
import {
  orphanPathsToEnqueue,
  pendingGcPaths,
} from "../lib/collaboration/attachmentGc";

config({ path: resolve(process.cwd(), ".env.local") });

const BATCH = 50;
const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const reconcile = args.has("--reconcile");

function requireEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

async function listAllStoragePaths(
  admin: { storage: ReturnType<typeof createClient>["storage"] }
): Promise<{ path: string; updatedAt: string | null }[]> {
  const out: { path: string; updatedAt: string | null }[] = [];

  async function walk(prefix: string) {
    const { data, error } = await admin.storage.from(ATTACHMENTS_BUCKET).list(prefix, {
      limit: 1000,
    });
    if (error) throw new Error(`list ${prefix}: ${error.message}`);
    for (const item of data ?? []) {
      const full = prefix ? `${prefix}/${item.name}` : item.name;
      // Folders have id null / no metadata in some SDK versions; treat missing
      // metadata as a directory and recurse.
      const isFile = item.id != null || (item.metadata && Object.keys(item.metadata).length > 0);
      if (!isFile && !item.metadata) {
        // Heuristic: if name has no extension-looking suffix and no id, recurse.
        // Safer: always try recurse when metadata is empty.
        await walk(full);
        continue;
      }
      if (item.id == null && (!item.metadata || item.metadata === null)) {
        await walk(full);
        continue;
      }
      out.push({
        path: full,
        updatedAt: (item.updated_at as string | null) ?? (item.created_at as string | null) ?? null,
      });
    }
  }

  // Top-level = org folders
  const { data: orgs, error } = await admin.storage.from(ATTACHMENTS_BUCKET).list("", {
    limit: 1000,
  });
  if (error) throw new Error(`list root: ${error.message}`);
  for (const org of orgs ?? []) {
    await walk(org.name);
  }
  return out;
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (reconcile) {
    console.log(dryRun ? "[dry-run] reconcile…" : "reconcile…");
    const storageObjects = await listAllStoragePaths(admin);
    const { data: metaRows, error: metaErr } = await admin
      .from("question_attachments")
      .select("storage_path");
    if (metaErr) throw new Error(metaErr.message);
    const metadataPaths = new Set((metaRows ?? []).map((r) => r.storage_path as string));

    const toEnqueue = orphanPathsToEnqueue({
      storagePaths: storageObjects,
      metadataPaths,
    });
    console.log(`orphans (age≥24h, no metadata): ${toEnqueue.length}`);

    if (!dryRun && toEnqueue.length > 0) {
      for (let i = 0; i < toEnqueue.length; i += BATCH) {
        const chunk = toEnqueue.slice(i, i + BATCH);
        const rows = chunk.map((storage_path) => {
          const orgId = storage_path.split("/")[0];
          return {
            storage_path,
            org_id: orgId,
            purged_at: null as string | null,
          };
        });
        const { error } = await admin.from("attachment_object_gc").upsert(rows, {
          onConflict: "storage_path",
        });
        if (error) throw new Error(`enqueue: ${error.message}`);
      }
    }
  }

  const { data: gcRows, error: gcErr } = await admin
    .from("attachment_object_gc")
    .select("storage_path, purged_at")
    .is("purged_at", null)
    .limit(500);
  if (gcErr) throw new Error(gcErr.message);

  const pending = pendingGcPaths(gcRows ?? []);
  console.log(`pending purge: ${pending.length}${dryRun ? " (dry-run)" : ""}`);

  if (dryRun || pending.length === 0) return;

  for (let i = 0; i < pending.length; i += BATCH) {
    const chunk = pending.slice(i, i + BATCH);
    const { error: remErr } = await admin.storage.from(ATTACHMENTS_BUCKET).remove(chunk);
    if (remErr) {
      console.warn(`remove warning: ${remErr.message}`);
    }
    const now = new Date().toISOString();
    const { error: markErr } = await admin
      .from("attachment_object_gc")
      .update({ purged_at: now })
      .in("storage_path", chunk);
    if (markErr) throw new Error(`mark purged: ${markErr.message}`);
    console.log(`purged ${chunk.length}`);
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
