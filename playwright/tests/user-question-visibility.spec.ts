/**
 * User Question Visibility — standalone user-context smoke tests.
 * These run with the user's saved storageState (no admin interaction).
 * They verify whatever assignment state already exists in the DB, so
 * they are intentionally adaptive (skip gracefully on no assignments).
 *
 * For the full deterministic panel-by-panel test matrix, run:
 *   npm run test:e2e -- --project=panel-checklist
 */

import { test, expect } from "@playwright/test";

test.describe("User dashboard visibility (smoke)", () => {
  test("dashboard loads without error", async ({ page }) => {
    await page.goto("/dashboard");

    // Should not land on login (redirected away = auth failure)
    await expect(page).not.toHaveURL(/\/login/);

    // Either empty state or questionnaire shell must appear
    const empty   = page.getByTestId("empty-assignments");
    const sidebar = page.getByTestId("sidebar");

    const resolved = await Promise.race([
      empty.waitFor({ state: "visible", timeout: 12_000 }).then(() => "empty" as const),
      sidebar.waitFor({ state: "visible", timeout: 12_000 }).then(() => "sidebar" as const),
    ]);

    console.log(`[smoke] Dashboard resolved to: ${resolved}`);
    expect(["empty", "sidebar"]).toContain(resolved);
  });

  test("empty state — no panels shown and correct message", async ({ page }) => {
    await page.goto("/dashboard");

    const empty = page.getByTestId("empty-assignments");
    const hasEmpty = await empty
      .waitFor({ state: "visible", timeout: 8_000 })
      .then(() => true)
      .catch(() => false);

    if (!hasEmpty) {
      test.skip(true, "User has assignments — empty-state test not applicable");
      return;
    }

    await expect(empty).toHaveText("No questions assigned. Contact your administrator.");

    const sidebar    = page.getByTestId("sidebar");
    const panelBtns  = sidebar.locator("button[data-testid^='panel-']");
    await expect(panelBtns).toHaveCount(0);

    const banner = page.getByTestId("restricted-banner");
    await expect(banner).not.toBeVisible();

    console.log("[smoke] PASS – empty state shown correctly");
  });

  test("with assignments — restricted banner and panel buttons appear", async ({ page }) => {
    await page.goto("/dashboard");

    const sidebar = page.getByTestId("sidebar");
    const hasSidebar = await sidebar
      .waitFor({ state: "visible", timeout: 8_000 })
      .then(() => true)
      .catch(() => false);

    if (!hasSidebar) {
      test.skip(true, "No assignments yet — restricted view test not applicable");
      return;
    }

    const empty = page.getByTestId("empty-assignments");
    await expect(empty).not.toBeVisible();

    const banner = page.getByTestId("restricted-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toHaveText("You can view and update only assigned questions.");

    const panelBtns = sidebar.locator("button[data-testid^='panel-']");
    const count     = await panelBtns.count();

    console.log(`[smoke] Visible panels: ${count}`);
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(13);
  });

  test("clicking a visible panel button navigates to that panel", async ({ page }) => {
    await page.goto("/dashboard");

    const sidebar = page.getByTestId("sidebar");
    const hasSidebar = await sidebar
      .waitFor({ state: "visible", timeout: 8_000 })
      .then(() => true)
      .catch(() => false);

    if (!hasSidebar) {
      test.skip(true, "No assignments — panel navigation test not applicable");
      return;
    }

    const firstBtn = sidebar.locator("button[data-testid^='panel-']").first();
    const panelId  = await firstBtn.getAttribute("data-testid");
    console.log(`[smoke] Clicking first visible panel: ${panelId}`);

    await firstBtn.click();

    // After click the button should have the active (blue) class
    await expect(firstBtn).toHaveClass(/bg-blue-600/);
  });
});
