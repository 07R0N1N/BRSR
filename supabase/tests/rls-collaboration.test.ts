/**
 * @testfile
 * Suite:    RLS — collaboration threads + attachment storage (hardened)
 * Breaker:  VISIBILITY
 * Covers:   After hardening 014/015: (1) poison insert denied; (2) legitimate
 *            foreign-block insert by admin succeeds; (3) non-admin may edit note
 *            but not resolve; (4–5) storage list empty / download+delete denied
 *            for unassigned block; plus identity freeze, non-uploader storage
 *            delete denial, admin cannot rewrite comment body.
 * Run:      SUPABASE_RLS_INTEGRATION=1 npx vitest run --config vitest.rls.config.ts supabase/tests/rls-collaboration.test.ts
 * Depends:  Migrations 014+015 applied (016 optional).
 *            SUPABASE_RLS_INTEGRATION=1 and vars from .env.local.example
 *            matching rlsIntegrationEnabled() in this file.
 */

import { resolve } from "node:path";
import { config } from "dotenv";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

config({ path: resolve(process.cwd(), ".env.local") });

function rlsIntegrationEnabled(): boolean {
  if (process.env.SUPABASE_RLS_INTEGRATION !== "1") return false;
  const need = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "E2E_USER_EMAIL",
    "E2E_USER_PASSWORD",
    "E2E_ADMIN_EMAIL",
    "E2E_ADMIN_PASSWORD",
  ];
  return need.every((k) => !!process.env[k]?.trim());
}

/** Code the restricted user is assigned — unlocks assignment block p8_1. */
const ASSIGNED_CODE = "p8_e1_name";
/** Legitimate block for ASSIGNED_CODE (principleBlocksConfig). */
const ASSIGNED_BLOCK = "p8_1";
/** Foreign block the user is NOT assigned — target of poison / storage tests. */
const FOREIGN_BLOCK = "p6_e1";
/** Representative code for FOREIGN_BLOCK (first p6_e1_* in questionCodes). */
const FOREIGN_REP_CODE = "p6_e1_rev_cy";
const ATTACHMENTS_BUCKET = "brsr-attachments";

function isDenied(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();
  return (
    code === "42501" ||
    code === "PGRST116" ||
    msg.includes("row-level security") ||
    msg.includes("permission denied") ||
    msg.includes("immutable") ||
    msg.includes("only admin") ||
    msg.includes("only the author")
  );
}

if (rlsIntegrationEnabled()) {
  describe.sequential("RLS — collaboration threads + attachment storage (hardened)", () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    let service: SupabaseClient;
    /** Signed in once in beforeAll — re-authenticating per test dominated runtime. */
    let userClient: SupabaseClient;
    let adminClient: SupabaseClient;
    let orgId: string;
    let reportingYear: string;
    let userId: string;
    let adminId: string;

    let plantedStoragePath: string | null = null;
    let assignedThreadId: string | null = null;

    async function cleanCollaborationFixtures() {
      const { data: threads } = await service
        .from("question_threads")
        .select("id")
        .eq("org_id", orgId)
        .eq("reporting_year", reportingYear)
        .in("block_id", [ASSIGNED_BLOCK, FOREIGN_BLOCK]);

      const threadIds = (threads ?? []).map((t) => t.id as string);
      if (threadIds.length > 0) {
        await service.from("question_attachments").delete().in("thread_id", threadIds);
        await service.from("question_comment_reads").delete().in("thread_id", threadIds);
        await service.from("question_comments").delete().in("thread_id", threadIds);
        await service.from("question_threads").delete().in("id", threadIds);
      }

      if (plantedStoragePath) {
        await service.storage.from(ATTACHMENTS_BUCKET).remove([plantedStoragePath]);
        plantedStoragePath = null;
      }
    }

    beforeAll(async () => {
      service = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { error: schemaErr } = await service.from("question_threads").select("id").limit(1);
      if (schemaErr) {
        throw new Error(
          `question_threads missing or inaccessible (${schemaErr.code}: ${schemaErr.message}). ` +
            "Apply supabase/migrations/014_question_collaboration.sql and 015_question_attachments.sql before running this suite."
        );
      }

      const { error: mapErr } = await service
        .from("brsr_assignment_blocks")
        .select("block_id")
        .eq("block_id", ASSIGNED_BLOCK)
        .maybeSingle();
      if (mapErr) {
        throw new Error(
          `brsr_assignment_blocks missing (${mapErr.message}). Re-apply hardened 014.`
        );
      }

      userClient = createClient(url, anonKey);
      const { data: userAuth, error: userErr } = await userClient.auth.signInWithPassword({
        email: process.env.E2E_USER_EMAIL!,
        password: process.env.E2E_USER_PASSWORD!,
      });
      if (userErr || !userAuth.user) throw new Error(`User sign-in failed: ${userErr?.message}`);
      userId = userAuth.user.id;

      const { data: profile, error: pErr } = await service
        .from("profiles")
        .select("org_id")
        .eq("id", userId)
        .single();
      if (pErr || !profile?.org_id) throw new Error(`Profile/org for user: ${pErr?.message}`);
      orgId = profile.org_id as string;

      const { data: orgRow } = await service
        .from("organizations")
        .select("reporting_year")
        .eq("id", orgId)
        .single();
      reportingYear =
        (orgRow as { reporting_year?: string } | null)?.reporting_year?.trim() || "2024-25";

      adminClient = createClient(url, anonKey);
      const { data: adminAuth, error: adminErr } = await adminClient.auth.signInWithPassword({
        email: process.env.E2E_ADMIN_EMAIL!,
        password: process.env.E2E_ADMIN_PASSWORD!,
      });
      if (adminErr || !adminAuth.user) throw new Error(`Admin sign-in failed: ${adminErr?.message}`);
      adminId = adminAuth.user.id;

      await service.from("user_question_assignments").delete().eq("user_id", userId);
      await service.from("user_question_assignments").insert({
        org_id: orgId,
        user_id: userId,
        question_code: ASSIGNED_CODE,
      });

      await cleanCollaborationFixtures();
    });

    afterAll(async () => {
      await cleanCollaborationFixtures();
      await service.from("user_question_assignments").delete().eq("user_id", userId);
    });

    function userAuthedClient(): SupabaseClient {
      return userClient;
    }

    function adminAuthedClient(): SupabaseClient {
      return adminClient;
    }

    // ── 1 + 2: poison insert denied; legitimate insert succeeds ───────────────

    it("poison insert: mismatched block_id + accessible question_code is DENIED", async () => {
      await cleanCollaborationFixtures();

      const u = userAuthedClient();
      const { data, error } = await u
        .from("question_threads")
        .insert({
          org_id: orgId,
          reporting_year: reportingYear,
          block_id: FOREIGN_BLOCK,
          panel_id: "p6",
          question_code: ASSIGNED_CODE,
        })
        .select("id, block_id, question_code")
        .single();

      expect(data).toBeNull();
      expect(error).not.toBeNull();
      expect(isDenied(error)).toBe(true);
    });

    it("legitimate insert for foreign block by admin SUCCEEDS", async () => {
      await cleanCollaborationFixtures();

      const a = adminAuthedClient();
      const { data, error } = await a
        .from("question_threads")
        .insert({
          org_id: orgId,
          reporting_year: reportingYear,
          block_id: FOREIGN_BLOCK,
          panel_id: "p6",
          question_code: FOREIGN_REP_CODE,
        })
        .select("id, block_id, question_code")
        .single();

      expect(error).toBeNull();
      expect(data?.block_id).toBe(FOREIGN_BLOCK);
      expect(data?.question_code).toBe(FOREIGN_REP_CODE);
    });

    // ── 3: note allowed; resolve denied for non-admin ─────────────────────────

    it("note UPDATE succeeds for assigned user; resolve UPDATE is DENIED", async () => {
      await cleanCollaborationFixtures();

      const { data: thread, error: insErr } = await service
        .from("question_threads")
        .insert({
          org_id: orgId,
          reporting_year: reportingYear,
          block_id: ASSIGNED_BLOCK,
          panel_id: "p8",
          question_code: ASSIGNED_CODE,
        })
        .select("id")
        .single();
      if (insErr || !thread?.id) {
        throw new Error(`Failed to seed assigned thread: ${insErr?.message}`);
      }
      assignedThreadId = thread.id as string;

      const u = userAuthedClient();

      const note = await u
        .from("question_threads")
        .update({ note_body: "rls_collab_user_wrote_note" })
        .eq("id", assignedThreadId)
        .select("note_body, resolved_at")
        .single();
      expect(note.error).toBeNull();
      expect(note.data?.note_body).toBe("rls_collab_user_wrote_note");
      expect(note.data?.resolved_at).toBeNull();

      const resolvedAt = new Date().toISOString();
      const resolve = await u
        .from("question_threads")
        .update({
          resolved_at: resolvedAt,
          resolved_by: userId,
        })
        .eq("id", assignedThreadId)
        .select("resolved_at")
        .single();

      // Trigger raises 42501; PostgREST may surface as error or empty update.
      if (resolve.error) {
        expect(isDenied(resolve.error)).toBe(true);
      } else {
        expect(resolve.data?.resolved_at).toBeNull();
      }

      const { data: check } = await service
        .from("question_threads")
        .select("resolved_at")
        .eq("id", assignedThreadId)
        .single();
      expect(check?.resolved_at).toBeNull();
    });

    it("identity freeze: re-pointing block_id / question_code is DENIED", async () => {
      if (!assignedThreadId) {
        const { data: thread } = await service
          .from("question_threads")
          .select("id")
          .eq("org_id", orgId)
          .eq("reporting_year", reportingYear)
          .eq("block_id", ASSIGNED_BLOCK)
          .maybeSingle();
        assignedThreadId = (thread?.id as string) ?? null;
      }
      expect(assignedThreadId).toBeTruthy();

      const u = userAuthedClient();
      const { error } = await u
        .from("question_threads")
        .update({
          block_id: FOREIGN_BLOCK,
          panel_id: "p6",
          question_code: FOREIGN_REP_CODE,
        })
        .eq("id", assignedThreadId!)
        .select("id")
        .single();

      expect(error).not.toBeNull();
      expect(isDenied(error)).toBe(true);
    });

    it("admin cannot rewrite another user's comment body", async () => {
      await cleanCollaborationFixtures();

      const { data: thread } = await service
        .from("question_threads")
        .insert({
          org_id: orgId,
          reporting_year: reportingYear,
          block_id: ASSIGNED_BLOCK,
          panel_id: "p8",
          question_code: ASSIGNED_CODE,
        })
        .select("id")
        .single();
      if (!thread?.id) throw new Error("thread seed failed");

      const { data: comment } = await service
        .from("question_comments")
        .insert({
          thread_id: thread.id,
          org_id: orgId,
          author_id: userId,
          body: "original body",
        })
        .select("id, body")
        .single();
      if (!comment?.id) throw new Error("comment seed failed");

      const a = adminAuthedClient();
      const { error } = await a
        .from("question_comments")
        .update({ body: "admin rewrite attempt" })
        .eq("id", comment.id)
        .select("body")
        .single();

      expect(error).not.toBeNull();
      expect(isDenied(error)).toBe(true);

      const { data: check } = await service
        .from("question_comments")
        .select("body")
        .eq("id", comment.id)
        .single();
      expect(check?.body).toBe("original body");
    });

    // ── 4 + 5: storage list empty; download/delete denied ─────────────────────

    it("storage list/download: non-assigned user is denied on foreign block path", async () => {
      const path = `${orgId}/${reportingYear}/${FOREIGN_BLOCK}/rls-collab-probe.pdf`;
      const pdfBytes = new Uint8Array(Buffer.from("%PDF-1.4 rls-collab-probe"));

      const { error: upErr } = await service.storage.from(ATTACHMENTS_BUCKET).upload(path, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (upErr) {
        throw new Error(
          `Failed to plant storage object (is bucket brsr-attachments created by 015?): ${upErr.message}`
        );
      }
      plantedStoragePath = path;

      const u = userAuthedClient();
      const folder = `${orgId}/${reportingYear}/${FOREIGN_BLOCK}`;

      const list = await u.storage.from(ATTACHMENTS_BUCKET).list(folder);
      // Storage list filters by RLS (empty) rather than always erroring.
      expect(list.error).toBeNull();
      const names = (list.data ?? []).map((f) => f.name);
      expect(names.some((n) => n.includes("rls-collab-probe"))).toBe(false);

      const dl = await u.storage.from(ATTACHMENTS_BUCKET).download(plantedStoragePath);
      expect(dl.error).not.toBeNull();
      expect(dl.data).toBeNull();
    });

    it("storage delete: non-assigned user is DENIED on foreign block object", async () => {
      if (!plantedStoragePath) {
        throw new Error("plantedStoragePath missing — previous storage test must run first");
      }

      const u = userAuthedClient();
      const rem = await u.storage.from(ATTACHMENTS_BUCKET).remove([plantedStoragePath]);

      // remove() may return empty error with no-op; confirm object still exists.
      const stillThere = await service.storage.from(ATTACHMENTS_BUCKET).download(plantedStoragePath);
      expect(stillThere.error).toBeNull();
      expect(stillThere.data).toBeTruthy();

      // Prefer explicit error when the SDK surfaces one.
      if (rem.error) {
        expect(rem.error).toBeTruthy();
      }
    });

    it("storage delete: assigned non-uploader cannot delete admin-planted file on assigned block", async () => {
      await cleanCollaborationFixtures();

      const { data: thread } = await service
        .from("question_threads")
        .insert({
          org_id: orgId,
          reporting_year: reportingYear,
          block_id: ASSIGNED_BLOCK,
          panel_id: "p8",
          question_code: ASSIGNED_CODE,
        })
        .select("id")
        .single();
      if (!thread?.id) throw new Error("thread seed failed");

      const path = `${orgId}/${reportingYear}/${ASSIGNED_BLOCK}/rls-admin-owned.pdf`;
      const pdfBytes = new Uint8Array(Buffer.from("%PDF-1.4 admin-owned"));
      const { error: upErr } = await service.storage.from(ATTACHMENTS_BUCKET).upload(path, pdfBytes, {
        contentType: "application/pdf",
        upsert: true,
      });
      if (upErr) throw new Error(upErr.message);
      plantedStoragePath = path;

      const { error: metaErr } = await service.from("question_attachments").insert({
        thread_id: thread.id,
        org_id: orgId,
        question_code: ASSIGNED_CODE,
        storage_path: path,
        file_name: "rls-admin-owned.pdf",
        mime_type: "application/pdf",
        size_bytes: pdfBytes.length,
        uploaded_by: adminId,
      });
      if (metaErr) throw new Error(metaErr.message);

      const u = userAuthedClient();
      await u.storage.from(ATTACHMENTS_BUCKET).remove([path]);

      const stillThere = await service.storage.from(ATTACHMENTS_BUCKET).download(path);
      expect(stillThere.error).toBeNull();
      expect(stillThere.data).toBeTruthy();
    });
  });
} else {
  describe.skip(
    "RLS — collaboration threads + attachment storage (set SUPABASE_RLS_INTEGRATION=1 + .env.local)",
    () => {
      it("skipped", () => {});
    }
  );
}
