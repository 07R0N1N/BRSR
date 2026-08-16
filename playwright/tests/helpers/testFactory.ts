/**
 * @testfile
 * Suite:    Test data factory
 * Breaker:  N/A
 * Covers:   Programmatic creation and teardown of test orgs, admins,
 *           users, assignments, and answers for E2E tests.
 *           Every test using this factory is fully isolated from
 *           pre-existing DB state and from other tests.
 * Run:      Not run directly — imported by Playwright spec files
 * Depends:  SUPABASE_SERVICE_ROLE_KEY in .env.local.
 *           NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 *           Supabase project must have all migrations applied.
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { ALL_QUESTION_CODES } from "@/lib/brsr/questionCodes";
import type { Page } from "@playwright/test";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TestOrg {
  orgId: string;
  name: string;
  reportingYear: string;
}

export interface TestUser {
  userId: string;
  email: string;
  password: string;
  orgId: string;
  role: "admin" | "user";
}

export interface TestContext {
  org: TestOrg;
  admin: TestUser;
  user?: TestUser;
  /** Extra factory users (e.g. a second assignable user). Cleaned up with the context. */
  extraUsers?: TestUser[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

/** Default password used for all factory-created test accounts. */
const TEST_PASSWORD = "TestPass123!";

/** Pre-built set for O(1) code validation. */
const VALID_CODE_SET = new Set(ALL_QUESTION_CODES);

// ─── Generators ───────────────────────────────────────────────────────────────

/**
 * Returns a unique email address that cannot collide across parallel runs.
 * Format: test_<timestamp>_<4-char hex>@e2e-brsr.test
 */
function generateTestEmail(): string {
  const rand = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  return `test_${Date.now()}_${rand}@e2e-brsr.test`;
}

/** Returns a unique org name suitable for test runs. */
function generateOrgName(): string {
  return `E2E Org ${Date.now()}`;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Looks up the `id` of the first role matching any of the provided slugs.
 * Accepts multiple slugs to handle the migration-009 rename
 * ("normal" → "user") gracefully on both old and new databases.
 */
async function getRoleId(...slugs: string[]): Promise<string> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("roles")
    .select("id")
    .in("slug", slugs)
    .limit(1);

  if (error) {
    throw new Error(
      `getRoleId: query failed for slugs [${slugs.join(", ")}] — ${error.message}`
    );
  }

  const id = (data as { id: string }[] | null)?.[0]?.id;
  if (!id) {
    throw new Error(
      `getRoleId: no role found with slug in [${slugs.join(", ")}]`
    );
  }

  return id;
}

/** Validates that every code in the array is a known BRSR question code. */
function validateCodes(codes: string[], callerName: string): void {
  const invalid = codes.filter((c) => !VALID_CODE_SET.has(c));
  if (invalid.length > 0) {
    throw new Error(
      `${callerName}: invalid question codes: ${invalid.join(", ")}`
    );
  }
}

// ─── Organization ─────────────────────────────────────────────────────────────

/**
 * Creates a new organization row directly via the admin client.
 * `onboarding_complete` starts as `false`; call `completeOnboarding` to flip it.
 */
async function createTestOrg(
  name?: string,
  reportingYear = "2024-25"
): Promise<TestOrg> {
  const supabase = createAdminClient();
  const orgName = name ?? generateOrgName();

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name: orgName,
      reporting_year: reportingYear,
      plan_tier: "standard",
      onboarding_complete: false,
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(
      `createTestOrg: failed to insert org "${orgName}" — ${error?.message ?? "no id returned"}`
    );
  }

  return { orgId: data.id as string, name: orgName, reportingYear };
}

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Creates a Supabase auth user and a matching `profiles` row with role=admin.
 * `email_confirm: true` is set so the account can sign in immediately without
 * going through an email-confirmation flow.
 */
async function createTestAdmin(orgId: string): Promise<TestUser> {
  const supabase = createAdminClient();
  const email = generateTestEmail();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    throw new Error(
      `createTestAdmin: auth user creation failed for "${email}" — ${authError?.message ?? "no user returned"}`
    );
  }

  const userId = authData.user.id;
  const roleId = await getRoleId("admin");

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email,
    org_id: orgId,
    role_id: roleId,
  });

  if (profileError) {
    // Roll back the orphaned auth user so we don't leak it.
    await supabase.auth.admin.deleteUser(userId).catch(() => {});
    throw new Error(
      `createTestAdmin: profile insert failed for "${email}" — ${profileError.message}`
    );
  }

  return { userId, email, password: TEST_PASSWORD, orgId, role: "admin" };
}

/**
 * Creates a Supabase auth user and a matching `profiles` row with role=user.
 * Queries both "user" and "normal" slugs to handle the migration-009 rename
 * ("normal" → "user") — whichever exists in the target DB is accepted.
 */
async function createTestUser(orgId: string): Promise<TestUser> {
  const supabase = createAdminClient();
  const email = generateTestEmail();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: TEST_PASSWORD,
      email_confirm: true,
    });

  if (authError || !authData.user) {
    throw new Error(
      `createTestUser: auth user creation failed for "${email}" — ${authError?.message ?? "no user returned"}`
    );
  }

  const userId = authData.user.id;
  // "user" is the current slug (migration 009); "normal" is the legacy slug.
  const roleId = await getRoleId("user", "normal");

  const { error: profileError } = await supabase.from("profiles").insert({
    id: userId,
    email,
    org_id: orgId,
    role_id: roleId,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(userId).catch(() => {});
    throw new Error(
      `createTestUser: profile insert failed for "${email}" — ${profileError.message}`
    );
  }

  return { userId, email, password: TEST_PASSWORD, orgId, role: "user" };
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

/**
 * Marks the organization's onboarding as complete so that admin and user
 * accounts tied to it can reach `/dashboard` and use the data APIs.
 */
async function completeOnboarding(orgId: string): Promise<void> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("organizations")
    .update({ onboarding_complete: true })
    .eq("id", orgId)
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(
      `completeOnboarding: failed to mark org ${orgId} complete — ${error?.message ?? "org not found"}`
    );
  }
}

// ─── Composite context ────────────────────────────────────────────────────────

/**
 * One-call setup that most specs should use.
 * Creates an org, an admin, marks onboarding complete, and optionally
 * a restricted user — all in a fresh, isolated environment.
 *
 * Usage:
 *   const ctx = await TestFactory.createTestContext({ withUser: true });
 *   // ... test ...
 *   await TestFactory.cleanupTestContext(ctx);
 */
async function createTestContext(options?: {
  withUser?: boolean;
}): Promise<TestContext> {
  const org = await createTestOrg();
  const admin = await createTestAdmin(org.orgId);
  await completeOnboarding(org.orgId);

  const user = options?.withUser
    ? await createTestUser(org.orgId)
    : undefined;

  return { org, admin, ...(user !== undefined ? { user } : {}) };
}

// ─── Assignments ──────────────────────────────────────────────────────────────

/**
 * Replaces the user's assignments with exactly `codes` (delete-then-insert).
 * Matches the semantics of PUT /api/assignments.
 * Throws immediately if any code is not a valid BRSR question code.
 */
async function assignQuestions(
  userId: string,
  orgId: string,
  codes: string[]
): Promise<void> {
  validateCodes(codes, "assignQuestions");

  const supabase = createAdminClient();

  const { error: deleteError } = await supabase
    .from("user_question_assignments")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error(
      `assignQuestions: failed to clear existing assignments — ${deleteError.message}`
    );
  }

  if (codes.length === 0) return;

  const rows = codes.map((question_code) => ({
    org_id: orgId,
    user_id: userId,
    question_code,
  }));

  const { error: insertError } = await supabase
    .from("user_question_assignments")
    .insert(rows);

  if (insertError) {
    throw new Error(
      `assignQuestions: failed to insert assignments — ${insertError.message}`
    );
  }
}

/**
 * Adds codes to the user's existing assignments without removing current ones.
 * Uses upsert with ignoreDuplicates so calling this twice is safe.
 * Throws if any code is not a valid BRSR question code.
 */
async function addAssignments(
  userId: string,
  orgId: string,
  codes: string[]
): Promise<void> {
  validateCodes(codes, "addAssignments");

  if (codes.length === 0) return;

  const supabase = createAdminClient();
  const rows = codes.map((question_code) => ({
    org_id: orgId,
    user_id: userId,
    question_code,
  }));

  const { error } = await supabase
    .from("user_question_assignments")
    .upsert(rows, {
      onConflict: "org_id,user_id,question_code",
      ignoreDuplicates: true,
    });

  if (error) {
    throw new Error(
      `addAssignments: failed to upsert assignments — ${error.message}`
    );
  }
}

/**
 * Removes specific codes (or all codes) from the user's assignments.
 * Idempotent — does not throw if the codes do not exist.
 */
async function removeAssignments(
  userId: string,
  orgId: string,
  codes?: string[]
): Promise<void> {
  const supabase = createAdminClient();

  const base = supabase
    .from("user_question_assignments")
    .delete()
    .eq("org_id", orgId)
    .eq("user_id", userId);

  const { error } =
    codes && codes.length > 0 ? await base.in("question_code", codes) : await base;

  if (error) {
    throw new Error(
      `removeAssignments: failed to delete assignments — ${error.message}`
    );
  }
}

/** Returns the current list of assigned question codes for a user. */
async function getAssignments(userId: string, orgId: string): Promise<string[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("user_question_assignments")
    .select("question_code")
    .eq("org_id", orgId)
    .eq("user_id", userId);

  if (error) {
    throw new Error(`getAssignments: query failed — ${error.message}`);
  }

  return (data ?? []).map((row: { question_code: string }) => row.question_code);
}

// ─── Answers ──────────────────────────────────────────────────────────────────

/**
 * Seeds a single answer directly via the admin client, bypassing RLS.
 * Use this to put the DB in a known state before tests that check persistence.
 */
async function saveAnswer(
  orgId: string,
  questionCode: string,
  value: string,
  reportingYear = "2024-25"
): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("answers").upsert(
    {
      org_id: orgId,
      reporting_year: reportingYear,
      question_code: questionCode,
      value,
    },
    { onConflict: "org_id,reporting_year,question_code" }
  );

  if (error) {
    throw new Error(
      `saveAnswer: failed to upsert "${questionCode}" — ${error.message}`
    );
  }
}

/**
 * Reads a single answer directly via the admin client.
 * Returns the string value, or null if no row exists for this code.
 */
async function getAnswer(
  orgId: string,
  questionCode: string,
  reportingYear = "2024-25"
): Promise<string | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("answers")
    .select("value")
    .eq("org_id", orgId)
    .eq("reporting_year", reportingYear)
    .eq("question_code", questionCode)
    .maybeSingle();

  if (error) {
    throw new Error(
      `getAnswer: query failed for "${questionCode}" — ${error.message}`
    );
  }

  return (data as { value?: string | null } | null)?.value ?? null;
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

/**
 * Destroys every resource created by `createTestContext` in the safe FK order:
 *
 *   1. answers            (FK: org_id → organizations CASCADE)
 *   2. user_question_assignments  (FK: org_id → organizations CASCADE,
 *                                      user_id → auth.users CASCADE)
 *   3. profiles           (FK: org_id → organizations ON DELETE SET NULL,
 *                               id   → auth.users   ON DELETE CASCADE)
 *   4. auth user (restricted)   (cascades residual profile rows if step 3 failed)
 *   5. auth user (admin)        (same)
 *   6. organizations      (all FKs to it resolved above; cascade cleans any
 *                           remaining child rows as a safety net)
 *
 * Every step is attempted regardless of previous failures — errors are
 * collected and emitted as a single console.warn so the test runner is not
 * blocked by partial cleanup. Callers should not rely on thrown errors here.
 */
async function cleanupTestContext(ctx: TestContext): Promise<void> {
  const supabase = createAdminClient();
  const warnings: string[] = [];

  // Runs one cleanup operation; logs but never throws.
  // PromiseLike: Supabase PostgrestFilterBuilder is awaitable but not a full Promise.
  async function attempt(
    label: string,
    fn: () => PromiseLike<{ error: { message: string } | null }>
  ): Promise<void> {
    try {
      const { error } = await fn();
      if (error) warnings.push(`${label}: ${error.message}`);
    } catch (e) {
      warnings.push(`${label}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // Step 1: answers
  await attempt("delete answers", () =>
    supabase.from("answers").delete().eq("org_id", ctx.org.orgId)
  );

  // Step 2: question assignments
  await attempt("delete user_question_assignments", () =>
    supabase
      .from("user_question_assignments")
      .delete()
      .eq("org_id", ctx.org.orgId)
  );

  // Step 3: profiles (covers both admin and user rows for this org)
  await attempt("delete profiles", () =>
    supabase.from("profiles").delete().eq("org_id", ctx.org.orgId)
  );

  // Step 4: restricted user auth record (cascade-deletes any residual profile)
  if (ctx.user) {
    await attempt(`deleteUser(user ${ctx.user.userId})`, () =>
      supabase.auth.admin.deleteUser(ctx.user!.userId)
    );
  }

  for (const extra of ctx.extraUsers ?? []) {
    await attempt(`deleteUser(extra ${extra.userId})`, () =>
      supabase.auth.admin.deleteUser(extra.userId)
    );
  }

  // Step 5: admin auth record
  await attempt(`deleteUser(admin ${ctx.admin.userId})`, () =>
    supabase.auth.admin.deleteUser(ctx.admin.userId)
  );

  // Step 6: organization (any remaining FK children cascade away here)
  await attempt("delete organization", () =>
    supabase.from("organizations").delete().eq("id", ctx.org.orgId)
  );

  if (warnings.length > 0) {
    console.warn(
      `[TestFactory] cleanupTestContext completed with non-fatal warnings:\n  ${warnings.join("\n  ")}`
    );
  }
}

// ─── Browser ──────────────────────────────────────────────────────────────────

/**
 * Navigates to /login and authenticates as the given user.
 * Does NOT assert where the browser lands after login — different roles
 * reach different pages (dashboard vs onboarding). Let the calling test
 * assert the destination.
 */
async function loginAs(page: Page, user: TestUser): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("Username").fill(user.email);
  await page.locator("#password").fill(user.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait for the browser to leave /login — destination is role-dependent.
  await page.waitForURL(
    (url) => !url.toString().includes("/login"),
    { timeout: 15_000 }
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const TestFactory = {
  generateTestEmail,
  generateOrgName,
  createTestOrg,
  createTestAdmin,
  createTestUser,
  completeOnboarding,
  createTestContext,
  assignQuestions,
  addAssignments,
  removeAssignments,
  getAssignments,
  saveAnswer,
  getAnswer,
  cleanupTestContext,
  loginAs,
};
