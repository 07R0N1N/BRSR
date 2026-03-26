import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./playwright/tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [["html", { open: "never" }], ["list"], ["json", { outputFile: "playwright/results.json" }]],
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    // ── Auth setup (must run first) ──────────────────────────────────────────
    {
      name: "auth-setup",
      testMatch: /global-setup\.ts/,
    },

    // ── Panel checklist (admin assigns + user verifies) ──────────────────────
    // No storageState here — the tests open two browser contexts manually.
    {
      name: "panel-checklist",
      testMatch: /panel-checklist\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: { ...devices["Desktop Chrome"] },
    },

    // ── Admin workspace standalone tests ────────────────────────────────────
    {
      name: "admin",
      testMatch: /admin-.*\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/admin.json",
      },
    },

    // ── User visibility standalone tests ────────────────────────────────────
    {
      name: "user-visibility",
      testMatch: /user-.*\.spec\.ts/,
      dependencies: ["auth-setup"],
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 45_000,
  },
});
