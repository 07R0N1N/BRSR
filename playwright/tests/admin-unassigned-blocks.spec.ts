/**
 * @testfile
 * Suite:    Admin Workspace — org-wide unassigned blocks
 * Breaker:  VISIBILITY
 * Covers:   "Show only unassigned blocks" hides a block for every user in the
 *            org once anyone is assigned any of its codes. If this test did
 *            not exist, a per-user filter could ship and User B (zero
 *            assignments) would see blocks that User A already owns.
 * Run:      npx playwright test admin-unassigned-blocks
 * Depends:  SUPABASE_SERVICE_ROLE_KEY, app running, Supabase running.
 *           Creates and destroys its own org/admin/users via TestFactory.
 */

import { test, expect } from "@playwright/test";
import {
  TestFactory,
  type TestContext,
  type TestUser,
} from "./helpers/testFactory";

test.describe.configure({ mode: "serial" });

// Start logged out so loginAs hits the factory admin, not a leftover session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Admin Workspace — unassigned blocks are org-wide", () => {
  // Regression: "Show only unassigned blocks" must be org-wide, not per
  // selected user — 15 Aug 2026

  let ctx!: TestContext;
  let userA!: TestUser;
  let userB!: TestUser;

  test.beforeAll(async () => {
    ctx = await TestFactory.createTestContext({ withUser: true });
    userA = ctx.user!;
    userB = await TestFactory.createTestUser(ctx.org.orgId);
    ctx.extraUsers = [userB];
  });

  test.afterAll(async () => {
    await TestFactory.cleanupTestContext(ctx);
  });

  test("assigning a block to User A hides it for User B when unassigned-only is on", async ({
    page,
  }) => {
    await TestFactory.loginAs(page, ctx.admin);
    await page.goto("/dashboard/admin-workspace");
    await expect(page).toHaveURL(/admin-workspace/, { timeout: 10_000 });

    await page.getByTestId("workspace-tab-assign").click();
    await expect(
      page.getByRole("heading", { name: "Assign users to questions" })
    ).toBeVisible();

    await page.getByTestId("user-select").selectOption(userA.userId);
    await expect(page.getByText("Loading assignments...")).toBeHidden({
      timeout: 10_000,
    });

    await page.getByTestId("section-general").click();
    await expect(page.getByTestId("unassigned-only")).toBeEnabled({
      timeout: 10_000,
    });
    await page.getByText("Show only unassigned blocks").click();

    const assurer = page.getByTestId("block-general_14");
    await expect(assurer).toBeVisible({ timeout: 8_000 });

    await assurer.click();
    await page.getByTestId("confirm-assignment").click();
    await expect(page.getByTestId("assignment-success")).toHaveText(
      "Assignments updated.",
      { timeout: 10_000 }
    );

    // Coverage reload should drop Assurer from the unassigned list for User A.
    await expect(assurer).toBeHidden({ timeout: 10_000 });

    // Switch to User B without reload — if the filter were per-user, Assurer
    // would reappear because User B has zero assignments.
    await page.getByTestId("user-select").selectOption(userB.userId);
    await expect(page.getByText("Loading assignments...")).toBeHidden({
      timeout: 10_000,
    });
    await expect(page.getByTestId("unassigned-only")).toBeEnabled({
      timeout: 10_000,
    });
    await expect(page.getByTestId("block-general_14")).toHaveCount(0);
  });
});
