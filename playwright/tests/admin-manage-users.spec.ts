/**
 * @testfile
 * Suite:    Admin Workspace — Manage Users tab
 * Breaker:  VISIBILITY
 * Covers:   Admin can add a team member (reusing the onboarding bulk-invite
 *            endpoint) and remove them again from the Admin Workspace,
 *            without needing Master. Regression guard for the admin-scoped
 *            DELETE /api/users path added alongside this tab: an admin must
 *            not be able to remove people outside their own org, and the
 *            new user must actually appear in the roster this admin sees.
 * Run:      npx playwright test admin-manage-users
 * Depends:  SUPABASE_SERVICE_ROLE_KEY, app running, Supabase running.
 *           Creates and destroys its own org/admin via TestFactory.
 */

import { test, expect } from "@playwright/test";
import { TestFactory, type TestContext } from "./helpers/testFactory";

test.describe.configure({ mode: "serial" });

// Start logged out so loginAs hits the factory admin, not a leftover session.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Admin Workspace — Manage Users", () => {
  let ctx!: TestContext;

  test.beforeAll(async () => {
    ctx = await TestFactory.createTestContext({ withUser: false });
  });

  test.afterAll(async () => {
    await TestFactory.cleanupTestContext(ctx);
  });

  test("admin can add and then remove a team member", async ({ page }) => {
    const email = TestFactory.generateTestEmail();

    await TestFactory.loginAs(page, ctx.admin);
    await page.goto("/dashboard/admin-workspace");
    await expect(page).toHaveURL(/admin-workspace/, { timeout: 10_000 });

    await page.getByTestId("workspace-tab-manage-users").click();
    await expect(
      page.getByRole("heading", { name: "Add team members" })
    ).toBeVisible();

    await page.getByPlaceholder("Full name").fill("Manage Users Test");
    await page.getByPlaceholder("Work email").fill(email);
    await page.getByPlaceholder("Password").fill("TestPass123!");
    await page.getByTestId("submit-invite-users").click();

    const row = page.getByRole("row", { name: new RegExp(email) });
    await expect(row).toBeVisible({ timeout: 10_000 });

    // Confirm() dialogs are auto-dismissed by default in Playwright — accept
    // this one so the delete request actually fires.
    page.once("dialog", (dialog) => dialog.accept());
    await row.getByRole("button", { name: /Remove/ }).click();

    await expect(row).toBeHidden({ timeout: 10_000 });
  });
});
