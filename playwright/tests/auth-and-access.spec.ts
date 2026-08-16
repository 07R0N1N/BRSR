/**
 * @testfile
 * Suite:    Authentication, onboarding gate, route protection
 * Breaker:  VISIBILITY
 * Covers:   Admin and user can log in and reach the correct destination.
 *           Onboarding gate blocks /dashboard until onboarding_complete.
 *           User cannot reach /dashboard/admin-workspace.
 *           Guests may visit "/" (marketing) and "/login"; other matched
 *           routes still redirect unauthenticated users to /login.
 *           All tests create and destroy their own data via TestFactory.
 * Run:      npx playwright test auth-and-access
 * Depends:  SUPABASE_SERVICE_ROLE_KEY, app running, Supabase running.
 *           No pre-existing users or DB state required.
 */

import { test, expect } from "@playwright/test";
import {
  TestFactory,
  type TestContext,
  type TestOrg,
  type TestUser,
} from "./helpers/testFactory";

// All tests in this file run sequentially so describe-level beforeAll/afterAll
// data is never shared across parallel workers.
test.describe.configure({ mode: "serial" });

// ═══════════════════════════════════════════════════════════════════════════════
// LOGIN AND LANDING
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("Login and landing", () => {
  // Shared context for completed-onboarding tests (admin + user).
  let ctx!: TestContext;

  // Incomplete-onboarding tests create their own data inline; tracked here
  // so afterAll can clean them up regardless of whether the test passed.
  const partialContexts: Array<{
    org: TestOrg;
    admin: TestUser;
    user?: TestUser;
  }> = [];

  test.beforeAll(async () => {
    ctx = await TestFactory.createTestContext({ withUser: true });
  });

  test.afterAll(async () => {
    await TestFactory.cleanupTestContext(ctx);
    for (const partial of partialContexts) {
      await TestFactory.cleanupTestContext(partial);
    }
  });

  test("admin with completed onboarding lands on /dashboard after login", async ({
    page,
  }) => {
    await TestFactory.loginAs(page, ctx.admin);
    // loginAs waits for URL to leave /login; middleware may still be mid-redirect
    // so use an explicit timeout for the final destination assertion.
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page).not.toHaveURL(/\/onboarding/);
  });

  test("restricted user with completed onboarding lands on /dashboard after login", async ({
    page,
  }) => {
    await TestFactory.loginAs(page, ctx.user!);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
  });

  test("admin whose onboarding is NOT complete is redirected to /onboarding", async ({
    page,
  }) => {
    const org = await TestFactory.createTestOrg();
    const admin = await TestFactory.createTestAdmin(org.orgId);
    // Intentionally do NOT call completeOnboarding — this is the test condition.
    partialContexts.push({ org, admin });

    await TestFactory.loginAs(page, admin);
    // accessPolicy.redirectForIncompleteApp: admin with org → /onboarding
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/\/dashboard/);
  });

  test("restricted user whose onboarding is NOT complete sees pending screen", async ({
    page,
  }) => {
    const org = await TestFactory.createTestOrg();
    const admin = await TestFactory.createTestAdmin(org.orgId);
    const user = await TestFactory.createTestUser(org.orgId);
    // Intentionally do NOT call completeOnboarding.
    partialContexts.push({ org, admin, user });

    await TestFactory.loginAs(page, user);
    // shouldShowOrgPendingOnly: non-admin with org + incomplete onboarding →
    // lands on /onboarding but rendered in "pending" mode, not the admin wizard.
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10_000 });
    await expect(page).not.toHaveURL(/\/dashboard/);
    // Pending screen text rendered by OnboardingClient when mode="pending"
    // (app/onboarding/OnboardingClient.tsx line 977)
    await expect(
      page.getByText("Organisation setup in progress")
    ).toBeVisible({ timeout: 8_000 });
  });

  test("wrong password shows error and stays on /login", async ({ page }) => {
    // Do NOT use TestFactory.loginAs here — that waits for the URL to leave
    // /login, which never happens on auth failure and would time out.
    await page.goto("/login");
    await page.getByLabel("Username").fill(ctx.admin.email);
    await page.locator("#password").fill("wrongpassword123");
    await page.getByRole("button", { name: "Sign in" }).click();
    // Auth failure keeps the user on /login.
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
    // Login page renders <p role="alert"> when signInError is set
    // (app/login/page.tsx line 111)
    await expect(page.getByRole("alert")).toBeVisible({ timeout: 8_000 });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ONBOARDING GATE — DIRECT NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("Onboarding gate — direct navigation", () => {
  // No shared ctx — every test in this block creates its own partial context.
  const partialContexts: Array<{
    org: TestOrg;
    admin: TestUser;
    user?: TestUser;
  }> = [];

  test.afterAll(async () => {
    for (const partial of partialContexts) {
      await TestFactory.cleanupTestContext(partial);
    }
  });

  test("admin without completed onboarding cannot reach /dashboard by direct URL", async ({
    page,
  }) => {
    const org = await TestFactory.createTestOrg();
    const admin = await TestFactory.createTestAdmin(org.orgId);
    partialContexts.push({ org, admin });

    await TestFactory.loginAs(page, admin);
    // Confirm we landed on /onboarding.
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 10_000 });

    // Attempt a direct navigation to /dashboard.
    await page.goto("/dashboard");
    // Middleware rule (middleware.ts line 104):
    //   isDashboard && !isMaster && !canUseApp(ctx) → redirectForIncompleteApp(ctx)
    // With org present: → /onboarding
    await expect(page).not.toHaveURL(/\/dashboard/, { timeout: 8_000 });
    await expect(page).toHaveURL(/\/onboarding/);
  });

  test("admin with completed onboarding cannot be stuck on /onboarding", async ({
    page,
  }) => {
    const org = await TestFactory.createTestOrg();
    const admin = await TestFactory.createTestAdmin(org.orgId);
    await TestFactory.completeOnboarding(org.orgId);
    partialContexts.push({ org, admin });

    await TestFactory.loginAs(page, admin);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    // Attempt a direct navigation to /onboarding.
    await page.goto("/onboarding");
    // Middleware rule (middleware.ts line 98):
    //   isOnboarding && canUseApp(ctx) → /dashboard
    await expect(page).not.toHaveURL(/\/onboarding/, { timeout: 8_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE PROTECTION
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("Route protection", () => {
  // Shared context for tests that need an authenticated session.
  let ctx!: TestContext;

  test.beforeAll(async () => {
    ctx = await TestFactory.createTestContext({ withUser: true });
  });

  test.afterAll(async () => {
    await TestFactory.cleanupTestContext(ctx);
  });

  test("unauthenticated user navigating to / stays on marketing landing", async ({
    page,
  }) => {
    // Middleware: guests pass through when isRoot || isLogin; app/page.tsx
    // renders LandingPage when there is no session.
    await page.goto("/");
    await expect(page).toHaveURL((url) => url.pathname === "/", {
      timeout: 10_000,
    });
    // Stable copy from Hero (app/(marketing)/components/Hero.tsx)
    await expect(
      page.getByRole("heading", { name: /BRSR reporting/i })
    ).toBeVisible({ timeout: 8_000 });
    // Header Sign in → /login (app/(marketing)/components/Header.tsx)
    const signIn = page.getByRole("link", { name: "Sign in", exact: true });
    await expect(signIn).toBeVisible();
    await signIn.click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("unauthenticated user navigating to /dashboard is redirected to /login", async ({
    page,
  }) => {
    // The page fixture starts with no stored auth state — no login needed.
    // Middleware: guests pass through only for isRoot || isLogin; otherwise → /login.
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("unauthenticated user navigating to /master is redirected to /login", async ({
    page,
  }) => {
    // /master/:path* is in the middleware matcher — same guest guard applies
    // (not isRoot / isLogin → redirect to /login).
    await page.goto("/master");
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });
  });

  test("restricted user cannot access /dashboard/admin-workspace", async ({
    page,
  }) => {
    await TestFactory.loginAs(page, ctx.user!);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });

    // Attempt direct navigation to admin-workspace.
    await page.goto("/dashboard/admin-workspace");
    // admin-workspace/page.tsx (line 27): if (roleSlug !== "admin") redirect("/dashboard")
    // This is a Next.js server-component redirect, not a middleware redirect.
    await expect(page).not.toHaveURL(/admin-workspace/, { timeout: 8_000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("admin can access /dashboard/admin-workspace", async ({ page }) => {
    await TestFactory.loginAs(page, ctx.admin);
    await page.goto("/dashboard/admin-workspace");
    await expect(page).toHaveURL(/admin-workspace/, { timeout: 10_000 });
    // Heading rendered in admin-workspace/page.tsx:
    // <h1 className="text-[17px] font-bold text-[var(--ink)]">Admin Workspace</h1>
    await expect(
      page.getByRole("heading", { name: "Admin Workspace" })
    ).toBeVisible({ timeout: 8_000 });
  });
});
