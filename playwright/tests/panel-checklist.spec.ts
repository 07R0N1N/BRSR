/**
 * Panel Visibility Checklist
 * ─────────────────────────────────────────────────────────────────────────────
 * For every panel, this spec:
 *   1. Uses the admin API to set the test user's assignments to a known state.
 *   2. Reloads the user's dashboard and asserts what they see.
 *
 * Test matrix (one test per row):
 *
 *  Panel             | Scenario                          | Expected sidebar
 * ───────────────────┼───────────────────────────────────┼──────────────────
 *  General Data      | all blocks assigned               | panel-generaldata ✓
 *  General Data      | no assignments                    | panel-generaldata ✗
 *  Section A         | block assigned                    | panel-general     ✓
 *  Section A         | no assignments                    | panel-general     ✗
 *  Section B         | block assigned                    | panel-sectionb    ✓
 *  Section B         | no assignments                    | panel-sectionb    ✗
 *  Principle 1–9     | essential codes assigned          | panel-p{n}        ✓
 *  Principle 1–9     | leadership codes assigned         | panel-p{n}        ✓
 *  Principle 1–9     | no assignments                    | panel-p{n}        ✗
 *
 * Setup:  E2E_ADMIN_EMAIL / E2E_ADMIN_PASSWORD   (admin account, same org)
 *         E2E_USER_EMAIL  / E2E_USER_PASSWORD    (user-role account)
 *
 * Run:    npm run test:e2e -- --project=panel-checklist
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { test, expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import path from "path";

// ── Auth state files ──────────────────────────────────────────────────────────
const ADMIN_AUTH = path.join(__dirname, "../.auth/admin.json");
const USER_AUTH  = path.join(__dirname, "../.auth/user.json");

// ── Representative question codes per panel / indicator type ─────────────────
// These are real codes from lib/brsr/questionCodes.ts. One probe code per block
// type is enough to make a panel visible in the sidebar.
const PROBE_CODES = {
  generaldata: {
    all: ["gdata_turnover_cy", "gdata_emp_perm_m"],
  },
  general: {
    all: ["gen_1_cin", "gen_2_name"],
  },
  sectionb: {
    all: ["sb_1a_p1", "sb_1b_p1"],
  },
  p1: {
    essential:   ["p1_e1_bod_prog"],
    leadership:  ["p1_l1_row0_prog"],
  },
  p2: {
    essential:   ["p2_e1_rd_cy"],
    leadership:  ["p2_l1_yn"],
  },
  p3: {
    essential:   ["p3_e1a_perm_m_t"],
    leadership:  ["p3_l1_emp"],
  },
  p4: {
    essential:   ["p4_e1_process"],
    leadership:  ["p4_l1_consult"],
  },
  p5: {
    essential:   ["p5_e1_emp_perm_t_cy"],
    leadership:  ["p5_l1_process"],
  },
  p6: {
    essential:   ["p6_e1_applicable"],
    leadership:  ["p6_l1_with_cy"],
  },
  p7: {
    essential:   ["p7_e1a_count"],
    leadership:  ["p7_l1_row0_policy"],
  },
  p8: {
    essential:   ["p8_e1_name"],
    leadership:  ["p8_l1_impact"],
  },
  p9: {
    essential:   ["p9_e1_mech"],
    leadership:  ["p9_l1_channels"],
  },
} as const;

// ── Shared state ──────────────────────────────────────────────────────────────
test.describe.configure({ mode: "serial" });

let browser: Browser;
let adminCtx: BrowserContext;
let userCtx:  BrowserContext;
let adminPage: Page;
let userPage:  Page;
let testUserId: string;

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Set the test user's assignments via admin API. Pass [] to clear. */
async function setAssignments(codes: readonly string[]) {
  const res = await adminPage.request.put("/api/assignments", {
    data: { user_id: testUserId, question_codes: [...codes] },
  });
  if (!res.ok()) {
    const body = await res.text();
    throw new Error(`PUT /api/assignments failed (${res.status()}): ${body}`);
  }
}

/** Reload the user's dashboard and wait until the shell has settled. */
async function reloadUserDashboard() {
  await userPage.goto("/dashboard");
  // Wait for either the sidebar (has assignments) or the empty-state (none)
  await Promise.race([
    userPage.getByTestId("sidebar").waitFor({ state: "visible", timeout: 12_000 }),
    userPage.getByTestId("empty-assignments").waitFor({ state: "visible", timeout: 12_000 }),
  ]);
}

/**
 * Assert a panel button IS visible in the sidebar and attach a diagnostic
 * screenshot if the assertion fails.
 */
async function assertPanelVisible(panelId: string, label: string) {
  const btn = userPage.getByTestId(`panel-${panelId}`);
  await expect(btn, `[FAIL] Panel "${label}" (panel-${panelId}) should be VISIBLE but is NOT found in sidebar`).toBeVisible({ timeout: 8_000 });
}

/**
 * Assert a panel button is NOT in the sidebar. If it is present that means
 * the visibility filter is broken.
 */
async function assertPanelHidden(panelId: string, label: string) {
  const btn = userPage.getByTestId(`panel-${panelId}`);
  const visible = await btn.isVisible().catch(() => false);
  expect(visible, `[FAIL] Panel "${label}" (panel-${panelId}) should be HIDDEN but appears in sidebar`).toBe(false);
}

/** Discover the test user's ID via the admin assignments API. */
async function resolveTestUserId(): Promise<string> {
  const userEmail = process.env.E2E_USER_EMAIL ?? "";
  const res = await adminPage.request.get("/api/assignments");
  if (!res.ok()) {
    throw new Error(`GET /api/assignments failed (${res.status()}): ${await res.text()}`);
  }
  const data = await res.json();
  const users: { id: string; email: string | null; display_name: string | null }[] = data.users ?? [];
  const match = users.find(
    (u) => u.email === userEmail || u.display_name === userEmail
  );
  if (!match) {
    throw new Error(
      `E2E test user "${userEmail}" not found in org. Available: ${users.map((u) => u.email).join(", ")}`
    );
  }
  return match.id;
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────

test.beforeAll(async ({ browser: b }) => {
  browser = b;

  adminCtx = await browser.newContext({ storageState: ADMIN_AUTH });
  adminPage = await adminCtx.newPage();

  userCtx  = await browser.newContext({ storageState: USER_AUTH });
  userPage = await userCtx.newPage();

  // Navigate admin to dashboard so request context has valid cookies
  await adminPage.goto("/dashboard");
  await adminPage.waitForLoadState("networkidle");

  testUserId = await resolveTestUserId();
  console.log(`[setup] E2E user ID resolved: ${testUserId}`);
});

test.afterAll(async () => {
  // Clean up: clear all assignments so other test runs start clean
  await setAssignments([]).catch(() => {});
  await adminCtx.close();
  await userCtx.close();
});

// ═══════════════════════════════════════════════════════════════════════════════
// GENERAL DATA PANEL
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("[ General Data ] panel visibility", () => {
  test("✓ assigned → panel is visible", async ({ }, testInfo) => {
    await test.step("Admin: assign General Data codes", async () => {
      await setAssignments(PROBE_CODES.generaldata.all);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: panel-generaldata is in sidebar", async () => {
      await assertPanelVisible("generaldata", "General Data Gathering");
      await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
    });
    testInfo.annotations.push({ type: "result", description: "PASS – panel visible" });
  });

  test("✗ no assignments → panel is hidden", async ({ }, testInfo) => {
    await test.step("Admin: clear all assignments", async () => {
      await setAssignments([]);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: empty-state message shown, panel hidden", async () => {
      await expect(userPage.getByTestId("empty-assignments")).toBeVisible();
      await assertPanelHidden("generaldata", "General Data Gathering");
    });
    testInfo.annotations.push({ type: "result", description: "PASS – panel hidden" });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION A — GENERAL DISCLOSURES
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("[ Section A ] General Disclosures panel visibility", () => {
  test("✓ assigned → panel is visible", async ({ }, testInfo) => {
    await test.step("Admin: assign Section A codes", async () => {
      await setAssignments(PROBE_CODES.general.all);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: panel-general is in sidebar", async () => {
      await assertPanelVisible("general", "General Disclosures");
      await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
    });
    testInfo.annotations.push({ type: "result", description: "PASS – panel visible" });
  });

  test("✗ no assignments → panel is hidden", async ({ }, testInfo) => {
    await test.step("Admin: clear all assignments", async () => {
      await setAssignments([]);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: panel hidden", async () => {
      await assertPanelHidden("general", "General Disclosures");
    });
    testInfo.annotations.push({ type: "result", description: "PASS – panel hidden" });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION B — MANAGEMENT & PROCESS
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("[ Section B ] Management & Process panel visibility", () => {
  test("✓ assigned → panel is visible", async ({ }, testInfo) => {
    await test.step("Admin: assign Section B codes", async () => {
      await setAssignments(PROBE_CODES.sectionb.all);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: panel-sectionb is in sidebar", async () => {
      await assertPanelVisible("sectionb", "Management & Process");
      await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
    });
    testInfo.annotations.push({ type: "result", description: "PASS – panel visible" });
  });

  test("✗ no assignments → panel is hidden", async ({ }, testInfo) => {
    await test.step("Admin: clear all assignments", async () => {
      await setAssignments([]);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: panel hidden", async () => {
      await assertPanelHidden("sectionb", "Management & Process");
    });
    testInfo.annotations.push({ type: "result", description: "PASS – panel hidden" });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FACTORY — builds principle tests for P1–P9
// ═══════════════════════════════════════════════════════════════════════════════

type PrincipleKey = "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8" | "p9";

function principleTests(num: number) {
  const key = `p${num}` as PrincipleKey;
  const label = `Principle ${num}`;
  const panelId = key;
  const codes = PROBE_CODES[key] as { essential: readonly string[]; leadership: readonly string[] };

  test.describe(`[ ${label} ] panel visibility`, () => {
    test(`✓ Essential indicators assigned → panel is visible`, async ({ }, testInfo) => {
      await test.step("Admin: assign Essential codes", async () => {
        await setAssignments(codes.essential);
      });
      await test.step("User: reload dashboard", async () => {
        await reloadUserDashboard();
      });
      await test.step(`Assert: panel-${panelId} visible (Essential only)`, async () => {
        await assertPanelVisible(panelId, `${label} — Essential`);
        await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
      });
      testInfo.annotations.push({ type: "indicator-type", description: "Essential" });
      testInfo.annotations.push({ type: "result", description: "PASS – panel visible" });
    });

    test(`✓ Leadership indicators assigned → panel is visible`, async ({ }, testInfo) => {
      await test.step("Admin: assign Leadership codes", async () => {
        await setAssignments(codes.leadership);
      });
      await test.step("User: reload dashboard", async () => {
        await reloadUserDashboard();
      });
      await test.step(`Assert: panel-${panelId} visible (Leadership only)`, async () => {
        await assertPanelVisible(panelId, `${label} — Leadership`);
        await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
      });
      testInfo.annotations.push({ type: "indicator-type", description: "Leadership" });
      testInfo.annotations.push({ type: "result", description: "PASS – panel visible" });
    });

    test(`✓ Both Essential + Leadership assigned → panel is visible`, async ({ }, testInfo) => {
      await test.step("Admin: assign both Essential and Leadership codes", async () => {
        await setAssignments([...codes.essential, ...codes.leadership]);
      });
      await test.step("User: reload dashboard", async () => {
        await reloadUserDashboard();
      });
      await test.step(`Assert: panel-${panelId} visible (both)`, async () => {
        await assertPanelVisible(panelId, `${label} — Both`);
        await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
      });
      testInfo.annotations.push({ type: "indicator-type", description: "Essential + Leadership" });
      testInfo.annotations.push({ type: "result", description: "PASS – panel visible" });
    });

    test(`✗ No assignments → panel is hidden`, async ({ }, testInfo) => {
      await test.step("Admin: clear all assignments", async () => {
        await setAssignments([]);
      });
      await test.step("User: reload dashboard", async () => {
        await reloadUserDashboard();
      });
      await test.step(`Assert: panel-${panelId} hidden`, async () => {
        await assertPanelHidden(panelId, label);
        await expect(userPage.getByTestId("empty-assignments")).toBeVisible();
      });
      testInfo.annotations.push({ type: "result", description: "PASS – panel hidden" });
    });
  });
}

// ── Register principle tests P1–P9 ────────────────────────────────────────────
principleTests(1);
principleTests(2);
principleTests(3);
principleTests(4);
principleTests(5);
principleTests(6);
principleTests(7);
principleTests(8);
principleTests(9);

// ═══════════════════════════════════════════════════════════════════════════════
// QUESTION-BLOCK VISIBILITY — only assigned blocks render inside a panel
// ═══════════════════════════════════════════════════════════════════════════════
//
// This covers the core bug: assigning only Leadership L1 should hide all
// Essential question blocks and show only the L1 question block.

/** Click a principle panel in the sidebar and wait for its content to load. */
async function openPrinciplePanel(panelTestId: string) {
  const btn = userPage.getByTestId(`panel-${panelTestId}`);
  await btn.click();
  // Wait for the tab bar (or the content area) to be present
  await userPage.waitForSelector(`[data-testid^="qblock-"]`, { timeout: 10_000 });
}

test.describe("[ Question-block visibility ] only assigned blocks are rendered", () => {
  // ── P1: Leadership-only → no essential blocks, only L1 block ──────────────
  test.describe("[ P1 ] Leadership-only assignment", () => {
    test("Essential tab button is hidden", async () => {
      await setAssignments(PROBE_CODES.p1.leadership);
      await reloadUserDashboard();
      await openPrinciplePanel("p1");
      // The Essential tab button should NOT be visible because no essential codes
      await expect(userPage.getByTestId("tab-essential")).not.toBeVisible();
      // The Leadership tab button SHOULD be visible
      await expect(userPage.getByTestId("tab-leadership")).toBeVisible();
    });

    test("Essential question blocks are hidden", async () => {
      // Re-use same assignment state from previous test (serial mode)
      await setAssignments(PROBE_CODES.p1.leadership);
      await reloadUserDashboard();
      await openPrinciplePanel("p1");
      // No essential blocks should be in the DOM
      await expect(userPage.getByTestId("qblock-p1_e1")).not.toBeVisible();
    });

    test("L1 question block is visible, L2 is hidden", async () => {
      await setAssignments(PROBE_CODES.p1.leadership); // ["p1_l1_row0_prog"]
      await reloadUserDashboard();
      await openPrinciplePanel("p1");
      // The L1 block that contains p1_l1_* codes must be visible
      await expect(userPage.getByTestId("qblock-p1_l1")).toBeVisible({ timeout: 8_000 });
      // The L2 block must NOT be visible (no code from p1_l2_ assigned)
      await expect(userPage.getByTestId("qblock-p1_l2")).not.toBeVisible();
    });
  });

  // ── P1: Essential-only → no leadership blocks, only E1 block ──────────────
  test.describe("[ P1 ] Essential-only assignment", () => {
    test("Leadership tab button is hidden", async () => {
      await setAssignments(PROBE_CODES.p1.essential);
      await reloadUserDashboard();
      await openPrinciplePanel("p1");
      await expect(userPage.getByTestId("tab-leadership")).not.toBeVisible();
      await expect(userPage.getByTestId("tab-essential")).toBeVisible();
    });

    test("E1 block is visible, E2 block is hidden", async () => {
      await setAssignments(PROBE_CODES.p1.essential); // ["p1_e1_bod_prog"]
      await reloadUserDashboard();
      await openPrinciplePanel("p1");
      await expect(userPage.getByTestId("qblock-p1_e1")).toBeVisible({ timeout: 8_000 });
      await expect(userPage.getByTestId("qblock-p1_e2")).not.toBeVisible();
    });
  });

  // ── P9: Same pattern — verifies the fix works end-to-end on a later principle
  test.describe("[ P9 ] Leadership-only assignment hides essential blocks", () => {
    test("P9 essential tab hidden, L1 block visible", async () => {
      await setAssignments(PROBE_CODES.p9.leadership); // ["p9_l1_channels"]
      await reloadUserDashboard();
      await openPrinciplePanel("p9");
      await expect(userPage.getByTestId("tab-essential")).not.toBeVisible();
      await expect(userPage.getByTestId("qblock-p9_l1")).toBeVisible({ timeout: 8_000 });
      await expect(userPage.getByTestId("qblock-p9_e1")).not.toBeVisible();
    });
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// CROSS-PANEL — multiple panels visible simultaneously
// ═══════════════════════════════════════════════════════════════════════════════

test.describe("[ Multi-panel ] cross-panel visibility", () => {
  test("Assign codes for 3 panels → exactly those 3 panels appear", async ({ }, testInfo) => {
    const codes = [
      ...PROBE_CODES.general.all,
      ...PROBE_CODES.p1.essential,
      ...PROBE_CODES.p3.leadership,
    ];

    await test.step("Admin: assign codes spanning Section A, P1, P3", async () => {
      await setAssignments(codes);
    });
    await test.step("User: reload dashboard", async () => {
      await reloadUserDashboard();
    });
    await test.step("Assert: panels general, p1, p3 visible", async () => {
      await assertPanelVisible("general", "General Disclosures");
      await assertPanelVisible("p1", "Principle 1");
      await assertPanelVisible("p3", "Principle 3");
    });
    await test.step("Assert: other panels hidden", async () => {
      await assertPanelHidden("generaldata", "General Data Gathering");
      await assertPanelHidden("sectionb", "Management & Process");
      await assertPanelHidden("p2", "Principle 2");
      await assertPanelHidden("p4", "Principle 4");
    });
    await test.step("Assert: restricted banner shown", async () => {
      await expect(userPage.getByTestId("restricted-banner")).toBeVisible();
    });
    testInfo.annotations.push({ type: "result", description: "PASS – only assigned panels visible" });
  });

  test("Admin has canViewAll — NO restricted banner shown", async ({ }, testInfo) => {
    await test.step("Open admin's own dashboard", async () => {
      await adminPage.goto("/dashboard");
      await adminPage.waitForLoadState("networkidle");
    });
    await test.step("Assert: admin sees all panels, no restricted banner", async () => {
      const sidebar = adminPage.getByTestId("sidebar");
      await expect(sidebar).toBeVisible();
      const banner = adminPage.getByTestId("restricted-banner");
      await expect(banner).not.toBeVisible();
      const empty = adminPage.getByTestId("empty-assignments");
      await expect(empty).not.toBeVisible();
      // All 13 panel buttons should be present
      const panelButtons = sidebar.locator("button[data-testid^='panel-']");
      await expect(panelButtons).toHaveCount(13);
    });
    testInfo.annotations.push({ type: "result", description: "PASS – admin sees all panels" });
  });
});
