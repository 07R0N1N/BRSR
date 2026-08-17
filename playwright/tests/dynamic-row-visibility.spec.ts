/**
 * @testfile
 * Suite:    E2E — dynamic row visibility and data persistence (Principle 8)
 * Breaker:  BOTH
 * Covers:   Restricted user sees only assigned blocks (p8_e1, not p8_e2).
 *            Template row and added records (row1+) are editable, not just
 *            visible. Values persist after page reload (data safety check).
 *            Direct API POST with unassigned code returns 403 (DB-layer block,
 *            not just UI suppression).
 *            Regression: add-record must produce editable inputs — the bug
 *            that prompted prefix-based access (fixed in migrations 010/011).
 * Run:      npx playwright test dynamic-row-visibility
 * Depends:  Local app running. playwright/.auth/ state present (run setup
 *            project first). Admin + restricted user seeded with p8_e1_*
 *            assignments only.
 */

import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import path from "node:path";

const ADMIN_AUTH = path.join(__dirname, "../.auth/admin.json");
const USER_AUTH = path.join(__dirname, "../.auth/user.json");

test.describe.configure({ mode: "serial" });

let browser: Browser;
let adminCtx: BrowserContext;
let userCtx: BrowserContext;
let adminPage: Page;
let userPage: Page;
let testUserId: string;
let orgId: string;
let reportingYear: string;

async function resolveTestUserId(): Promise<string> {
  const userEmail = process.env.E2E_USER_EMAIL ?? "";
  const res = await adminPage.request.get("/api/assignments");
  if (!res.ok()) throw new Error(`GET /api/assignments failed: ${await res.text()}`);
  const data = await res.json();
  orgId = data.org_id as string;
  const users: { id: string; email: string | null }[] = data.users ?? [];
  const match = users.find((u) => u.email === userEmail);
  if (!match) throw new Error(`E2E user not found: ${userEmail}`);
  return match.id;
}

async function setAssignments(codes: readonly string[]) {
  const res = await adminPage.request.put("/api/assignments", {
    data: { user_id: testUserId, question_codes: [...codes] },
  });
  if (!res.ok()) throw new Error(`PUT /api/assignments failed: ${await res.text()}`);
}

async function readReportingYearFromShell(page: Page): Promise<string> {
  const text = await page.getByTestId("reporting-year-value").textContent();
  return (text ?? "").trim() || "2024-25";
}

async function postAnswersAsAdmin(answers: Record<string, string>) {
  const res = await adminPage.request.post("/api/answers", {
    data: {
      org_id: orgId,
      reporting_year: reportingYear,
      answers,
    },
  });
  if (!res.ok()) throw new Error(`POST /api/answers (admin seed) failed: ${await res.text()}`);
}

async function waitForAnswersSave(page: Page) {
  const resp = page.waitForResponse(
    (r) => r.url().includes("/api/answers") && r.request().method() === "POST" && r.ok()
  );
  await resp;
}

test.beforeAll(async ({ browser: b }) => {
  browser = b;
  adminCtx = await browser.newContext({ storageState: ADMIN_AUTH });
  userCtx = await browser.newContext({ storageState: USER_AUTH });
  adminPage = await adminCtx.newPage();
  userPage = await userCtx.newPage();
  await adminPage.goto("/dashboard");
  await adminPage.waitForLoadState("networkidle");
  reportingYear = await readReportingYearFromShell(adminPage);
  testUserId = await resolveTestUserId();
});

test.afterAll(async () => {
  await setAssignments([]).catch(() => {});
  await adminCtx.close();
  await userCtx.close();
});

test.describe("Principle 8 dynamic rows — restricted user", () => {
  test.beforeAll(async () => {
    await setAssignments(["p8_e1_name"]);
    await postAnswersAsAdmin({
      p8_e1_rowcount: "2",
      p8_e1_name: "E2E seed row0",
      p8_e1_notif: "n0",
      p8_e1_row1_name: "E2E seed row1",
      p8_e1_row1_notif: "n1",
    });
  });

  test("restricted user sees p8_e1 block; p8_e2 block is not in DOM", async () => {
    await userPage.goto("/dashboard");
    await userPage.getByTestId("sidebar").waitFor({ state: "visible", timeout: 12_000 });
    await userPage.getByTestId("panel-p8").click();
    await expect(userPage.getByTestId("qblock-p8_e1")).toBeVisible({ timeout: 8_000 });
    await expect(userPage.getByTestId("qblock-p8_e2")).toHaveCount(0);
  });

  test("restricted user can edit template row (p8_e1_name) and value persists", async () => {
    await userPage.goto("/dashboard");
    await userPage.getByTestId("panel-p8").click();
    const block = userPage.getByTestId("qblock-p8_e1");
    // template row — uses base codes e.g. p8_e1_name (no rowN segment)
    const row0Name = block.locator("details").first().locator('input[type="text"]').first();
    await row0Name.fill("Row0 edited by user");
    await waitForAnswersSave(userPage);
    await userPage.reload();
    await userPage.getByTestId("panel-p8").click();
    await expect(userPage.getByTestId("qblock-p8_e1").locator("details").first().locator('input[type="text"]').first()).toHaveValue(
      "Row0 edited by user"
    );
  });

  test("restricted user can edit row1 (first added record, p8_e1_row1_name) and value persists", async () => {
    await postAnswersAsAdmin({
      p8_e1_rowcount: "1",
      p8_e1_name: "E2E row1 template",
      p8_e1_notif: "n0",
    });

    await userPage.goto("/dashboard");
    await userPage.getByTestId("sidebar").waitFor({ state: "visible", timeout: 12_000 });
    await userPage.getByTestId("panel-p8").click();
    const block = userPage.getByTestId("qblock-p8_e1");
    await block.getByRole("button", { name: "+ADD" }).click();
    const row1Name = block.locator("details").nth(1).locator('input[type="text"]').first();
    await expect(row1Name).toBeVisible({ timeout: 8_000 });
    // first added record — uses p8_e1_row1_name (rowN segment)
    await row1Name.fill("Row1 added record E2E");
    await waitForAnswersSave(userPage);
    await userPage.reload();
    await userPage.getByTestId("panel-p8").click();
    await expect(userPage.getByTestId("qblock-p8_e1").locator("details").nth(1).locator('input[type="text"]').first()).toHaveValue(
      "Row1 added record E2E"
    );
  });

  test("regression: restricted user can edit row2 after +ADD and value persists", async () => {
    await userPage.goto("/dashboard");
    await userPage.getByTestId("panel-p8").click();
    const block = userPage.getByTestId("qblock-p8_e1");
    await block.getByRole("button", { name: "+ADD" }).click();
    const row2Name = block.locator("details").nth(2).locator('input[type="text"]').first();
    await expect(row2Name).toBeEnabled();
    await row2Name.fill("Row2 dynamic E2E");
    await waitForAnswersSave(userPage);
    await userPage.reload();
    await userPage.getByTestId("panel-p8").click();
    await expect(userPage.getByTestId("qblock-p8_e1").locator("details").nth(2).locator('input[type="text"]').first()).toHaveValue(
      "Row2 dynamic E2E"
    );
  });

  test("direct API POST with unassigned p8_e2 code returns error for restricted user", async () => {
    const res = await userPage.request.post("/api/answers", {
      data: {
        org_id: orgId,
        reporting_year: reportingYear,
        answers: { p8_e2_row0_name: "nope" },
      },
    });
    // RLS / can_access_question denial returns 403 (forbidden), not 400.
    // Confirmed at DB layer — the upsert is blocked by can_access_question().
    expect(res.status()).toBe(403);
  });

  test("Add record yields enabled inputs and successful save", async () => {
    await setAssignments(["p8_e1_name"]);
    await postAnswersAsAdmin({ p8_e1_rowcount: "1", p8_e1_name: "single" });

    await userPage.goto("/dashboard");
    await userPage.getByTestId("panel-p8").click();
    const block = userPage.getByTestId("qblock-p8_e1");
    await block.getByRole("button", { name: "+ADD" }).click();
    const inp = block.locator("details").nth(1).locator('input[type="text"]').first();
    await expect(inp).toBeEnabled();
    const savePromise = waitForAnswersSave(userPage);
    await inp.fill("new row save check");
    await savePromise;
    const res = await userPage.request.get(
      `/api/answers?org_id=${encodeURIComponent(orgId)}&reporting_year=${encodeURIComponent(reportingYear)}`
    );
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.answers?.p8_e1_row1_name).toBe("new row save check");
  });
});
