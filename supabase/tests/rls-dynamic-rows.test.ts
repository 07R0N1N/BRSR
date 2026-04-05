/**
 * @testfile
 * Suite:    RLS — dynamic row access on answers
 * Breaker:  BOTH
 * Covers:   can_access_question() enforces 3-tier access at DB layer.
 *            Restricted users can only read/write codes in assigned blocks
 *            including dynamic row codes. Admin bypasses per-code checks.
 *            Master bypasses all. Confirms UI-layer checks are backed by
 *            DB-layer RLS — UI hiding alone is not sufficient protection.
 * Run:      SUPABASE_RLS_INTEGRATION=1 npx vitest run --config vitest.rls.config.ts
 * Depends:  Local Supabase running, migrations applied, seed data present.
 *            SUPABASE_RLS_INTEGRATION=1 and vars from .env.local.example
 *            (Supabase URL/keys, E2E admin/user; optional E2E_MASTER_*)
 *            matching rlsIntegrationEnabled() in this file.
 *            Skip condition: tests are skipped automatically if env not set.
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

const TEST_CODES = [
  "p8_e1_row2_name",
  "p8_e2_row0_name",
  "p8_e1_row3_link",
] as const;

if (rlsIntegrationEnabled()) {
  describe.sequential("RLS — dynamic row access on answers", () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    let service: SupabaseClient;
    let orgId: string;
    let reportingYear: string;
    let userId: string;
    let adminId: string;

    async function cleanTestAnswers() {
      for (const code of TEST_CODES) {
        await service
          .from("answers")
          .delete()
          .eq("org_id", orgId)
          .eq("reporting_year", reportingYear)
          .eq("question_code", code);
      }
    }

    beforeAll(async () => {
      service = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const userClient = createClient(url, anonKey);
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
      reportingYear = (orgRow as { reporting_year?: string } | null)?.reporting_year?.trim() || "2024-25";

      const adminClient = createClient(url, anonKey);
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
        question_code: "p8_e1_name",
      });

      await cleanTestAnswers();
    });

    afterAll(async () => {
      await cleanTestAnswers();
      await service.from("user_question_assignments").delete().eq("user_id", userId);
    });

    async function userAuthedClient(): Promise<SupabaseClient> {
      const c = createClient(url, anonKey);
      const { error } = await c.auth.signInWithPassword({
        email: process.env.E2E_USER_EMAIL!,
        password: process.env.E2E_USER_PASSWORD!,
      });
      if (error) throw error;
      return c;
    }

    async function adminAuthedClient(): Promise<SupabaseClient> {
      const c = createClient(url, anonKey);
      const { error } = await c.auth.signInWithPassword({
        email: process.env.E2E_ADMIN_EMAIL!,
        password: process.env.E2E_ADMIN_PASSWORD!,
      });
      if (error) throw error;
      return c;
    }

    it("user assigned p8_e1_name can SELECT answer for p8_e1_row2_name when row exists", async () => {
      await cleanTestAnswers();
      await service.from("answers").upsert(
        {
          org_id: orgId,
          reporting_year: reportingYear,
          question_code: "p8_e1_row2_name",
          value: "rls_seed_row2",
          updated_by: userId,
        },
        { onConflict: "org_id,reporting_year,question_code" }
      );

      const u = await userAuthedClient();
      const { data, error } = await u
        .from("answers")
        .select("question_code, value")
        .eq("org_id", orgId)
        .eq("reporting_year", reportingYear)
        .eq("question_code", "p8_e1_row2_name");

      expect(error).toBeNull();
      expect(data?.length).toBe(1);
      expect(data![0].value).toBe("rls_seed_row2");
    });

    it("user assigned p8_e1_name cannot SELECT answer for p8_e2_row0_name when row exists", async () => {
      await cleanTestAnswers();
      await service.from("answers").upsert(
        {
          org_id: orgId,
          reporting_year: reportingYear,
          question_code: "p8_e2_row0_name",
          value: "secret_other_block",
          updated_by: adminId,
        },
        { onConflict: "org_id,reporting_year,question_code" }
      );

      const u = await userAuthedClient();
      const { data, error } = await u
        .from("answers")
        .select("question_code")
        .eq("org_id", orgId)
        .eq("reporting_year", reportingYear)
        .eq("question_code", "p8_e2_row0_name");

      expect(error).toBeNull();
      expect(data?.length ?? 0).toBe(0);
    });

    it("user assigned p8_e1_name can INSERT answer for p8_e1_row2_name", async () => {
      await cleanTestAnswers();

      const u = await userAuthedClient();
      const { error } = await u.from("answers").insert({
        org_id: orgId,
        reporting_year: reportingYear,
        question_code: "p8_e1_row2_name",
        value: "user_insert_row2",
        updated_by: userId,
      });

      expect(error).toBeNull();
    });

    it("user assigned p8_e1_name cannot INSERT answer for p8_e2_row0_name", async () => {
      await cleanTestAnswers();

      const u = await userAuthedClient();
      const { error } = await u.from("answers").insert({
        org_id: orgId,
        reporting_year: reportingYear,
        question_code: "p8_e2_row0_name",
        value: "should_fail",
        updated_by: userId,
      });

      expect(error).not.toBeNull();
    });

    it("admin can SELECT and INSERT any code in their org", async () => {
      await cleanTestAnswers();

      const a = await adminAuthedClient();
      const ins = await a.from("answers").insert({
        org_id: orgId,
        reporting_year: reportingYear,
        question_code: "p8_e2_row0_name",
        value: "admin_ok",
        updated_by: adminId,
      });
      expect(ins.error).toBeNull();

      const sel = await a
        .from("answers")
        .select("value")
        .eq("org_id", orgId)
        .eq("reporting_year", reportingYear)
        .eq("question_code", "p8_e2_row0_name")
        .maybeSingle();

      expect(sel.error).toBeNull();
      expect(sel.data?.value).toBe("admin_ok");
    });

    it.skipIf(!process.env.E2E_MASTER_EMAIL?.trim() || !process.env.E2E_MASTER_PASSWORD?.trim())(
      "master can SELECT and INSERT any code in any org",
      async () => {
        const serviceRole = createClient(url, serviceKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });

        const { data: orgPick } = await serviceRole.from("organizations").select("id").limit(1).maybeSingle();
        if (!orgPick?.id) return;
        const targetOrg = orgPick.id as string;

        const { data: orgRow } = await serviceRole
          .from("organizations")
          .select("reporting_year")
          .eq("id", targetOrg)
          .single();
        const ry = (orgRow as { reporting_year?: string } | null)?.reporting_year?.trim() || "2024-25";

        const code = `p8_e1_master_${Date.now()}`;

        const m = createClient(url, anonKey);
        const { error: signErr } = await m.auth.signInWithPassword({
          email: process.env.E2E_MASTER_EMAIL!,
          password: process.env.E2E_MASTER_PASSWORD!,
        });
        if (signErr) throw signErr;

        const uid = (await m.auth.getUser()).data.user?.id;
        const ins = await m.from("answers").upsert(
          {
            org_id: targetOrg,
            reporting_year: ry,
            question_code: code,
            value: "master_write",
            updated_by: uid,
          },
          { onConflict: "org_id,reporting_year,question_code" }
        );
        expect(ins.error).toBeNull();

        const sel = await m
          .from("answers")
          .select("value")
          .eq("org_id", targetOrg)
          .eq("reporting_year", ry)
          .eq("question_code", code)
          .maybeSingle();
        expect(sel.error).toBeNull();
        expect(sel.data?.value).toBe("master_write");

        await serviceRole.from("answers").delete().eq("org_id", targetOrg).eq("reporting_year", ry).eq("question_code", code);
      }
    );
  });
} else {
  describe.skip("RLS — dynamic row access on answers (set SUPABASE_RLS_INTEGRATION=1 + .env.local)", () => {
    it("skipped", () => {});
  });
}
