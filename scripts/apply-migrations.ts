/**
 * Apply migration SQL files via psql using DATABASE_URL / SUPABASE_DB_URL.
 *
 * Usage:
 *   DATABASE_URL='postgresql://…' npx tsx scripts/apply-migrations.ts 014 015 016
 *
 * Reads .env.local for DATABASE_URL if not already in the environment.
 * Prefer Supabase Dashboard → SQL Editor when you do not have the DB URI
 * (see README).
 */

import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

config({ path: resolve(process.cwd(), ".env.local") });

const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
if (args.length === 0) {
  console.error("Usage: npx tsx scripts/apply-migrations.ts 014 015 016");
  process.exit(1);
}

const url = process.env.DATABASE_URL?.trim() || process.env.SUPABASE_DB_URL?.trim();
if (!url) {
  console.error(
    "Missing DATABASE_URL (or SUPABASE_DB_URL). Copy the Postgres URI from Supabase → Settings → Database."
  );
  process.exit(1);
}

const dir = resolve(process.cwd(), "supabase/migrations");

for (const num of args) {
  const padded = num.padStart(3, "0");
  const files = readdirSync(dir).filter(
    (f) => f.startsWith(`${padded}_`) && f.endsWith(".sql")
  );
  if (files.length !== 1) {
    console.error(`Expected one migration for ${padded}, found: ${files.join(", ") || "(none)"}`);
    process.exit(1);
  }
  const path = resolve(dir, files[0]);
  if (!existsSync(path)) {
    console.error(`Missing ${path}`);
    process.exit(1);
  }
  console.log(`Applying ${files[0]}…`);
  const result = spawnSync("psql", [url, "-v", "ON_ERROR_STOP=1", "-f", path], {
    encoding: "utf8",
    env: process.env,
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    console.error(`Failed applying ${files[0]} (exit ${result.status})`);
    process.exit(result.status ?? 1);
  }
  console.log(`  ok`);
}
