import { test as setup, expect } from "@playwright/test";
import path from "path";

const ADMIN_AUTH_FILE = path.join(__dirname, "../.auth/admin.json");
const USER_AUTH_FILE = path.join(__dirname, "../.auth/user.json");

setup("authenticate as admin", async ({ page }) => {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD must be set in .env.local");
  }

  await page.goto("/login");
  await page.getByLabel("Username").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/dashboard**", { timeout: 15_000 });
  await expect(page.locator("h1")).toContainText("BRSR");

  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});

setup("authenticate as restricted user", async ({ page }) => {
  const email = process.env.E2E_USER_EMAIL;
  const password = process.env.E2E_USER_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_USER_EMAIL and E2E_USER_PASSWORD must be set in .env.local");
  }

  await page.goto("/login");
  await page.getByLabel("Username").fill(email);
  await page.locator("#password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await page.waitForURL("**/dashboard**", { timeout: 15_000 });
  await expect(page.locator("h1")).toContainText("BRSR");

  await page.context().storageState({ path: USER_AUTH_FILE });
});
