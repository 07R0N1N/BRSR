/**
 * @testfile
 * Suite:    Thread API access
 * Breaker:  VISIBILITY
 * Covers:   Restricted users cannot post comments on threads for assignment
 *            blocks they are not assigned to; an admin comment on an assigned
 *            block is visible to the assigned user via GET thread detail.
 * Run:      npx playwright test thread-access
 * Depends:  SUPABASE_SERVICE_ROLE_KEY, app running, Supabase running.
 */

import { test, expect } from "@playwright/test";
import {
  TestFactory,
  type TestContext,
} from "./helpers/testFactory";

test.describe.configure({ mode: "serial" });

test.describe("Thread API access", () => {
  let ctx!: TestContext;

  test.beforeAll(async () => {
    ctx = await TestFactory.createTestContext({ withUser: true });
    // Assign only Principle 1 block 1 (prefix p1_e1_)
    await TestFactory.assignQuestions(ctx.user!.userId, ctx.org.orgId, ["p1_e1_bod_prog"]);
  });

  test.afterAll(async () => {
    await TestFactory.cleanupTestContext(ctx);
  });

  test("restricted user cannot POST comment on unassigned block", async ({ page }) => {
    await TestFactory.loginAs(page, ctx.user!);
    const res = await page.request.post("/api/threads/p6_e1/comments", {
      data: {
        org_id: ctx.org.orgId,
        reporting_year: ctx.org.reportingYear,
        body: "should be forbidden",
      },
    });
    expect(res.status()).toBe(403);
  });

  test("admin comment on assigned block is visible to assigned user", async ({
    browser,
  }) => {
    const adminContext = await browser.newContext();
    const userContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    const userPage = await userContext.newPage();

    try {
      await TestFactory.loginAs(adminPage, ctx.admin);
      const postRes = await adminPage.request.post("/api/threads/p1_1/comments", {
        data: {
          org_id: ctx.org.orgId,
          reporting_year: ctx.org.reportingYear,
          body: "Admin reply on assigned block",
        },
      });
      expect(postRes.ok()).toBeTruthy();

      await TestFactory.loginAs(userPage, ctx.user!);
      const getRes = await userPage.request.get(
        `/api/threads/p1_1?org_id=${encodeURIComponent(ctx.org.orgId)}&reporting_year=${encodeURIComponent(ctx.org.reportingYear)}`
      );
      expect(getRes.ok()).toBeTruthy();
      const body = await getRes.json();
      const texts = (body.comments ?? []).map((c: { body: string }) => c.body);
      expect(texts).toContain("Admin reply on assigned block");
    } finally {
      await adminContext.close();
      await userContext.close();
    }
  });

  test("attachment upload can be scoped to a comment", async ({ browser }) => {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();

    try {
      await TestFactory.loginAs(adminPage, ctx.admin);
      const postRes = await adminPage.request.post("/api/threads/p1_1/comments", {
        data: {
          org_id: ctx.org.orgId,
          reporting_year: ctx.org.reportingYear,
          body: "Comment with attachment anchor",
        },
      });
      expect(postRes.ok()).toBeTruthy();
      const { comment } = await postRes.json();
      expect(comment?.id).toBeTruthy();

      const pdfBytes = Buffer.from("%PDF-1.4 test attachment");
      const uploadRes = await adminPage.request.post("/api/attachments", {
        multipart: {
          file: {
            name: "test-comment-attach.pdf",
            mimeType: "application/pdf",
            buffer: pdfBytes,
          },
          org_id: ctx.org.orgId,
          reporting_year: ctx.org.reportingYear,
          block_id: "p1_1",
          comment_id: comment.id,
        },
      });
      expect(uploadRes.ok()).toBeTruthy();
      const uploadBody = await uploadRes.json();
      expect(uploadBody.attachment?.comment_id).toBe(comment.id);

      const getRes = await adminPage.request.get(
        `/api/threads/p1_1?org_id=${encodeURIComponent(ctx.org.orgId)}&reporting_year=${encodeURIComponent(ctx.org.reportingYear)}`
      );
      expect(getRes.ok()).toBeTruthy();
      const threadBody = await getRes.json();
      const linked = (threadBody.attachments ?? []).find(
        (a: { comment_id?: string }) => a.comment_id === comment.id
      );
      expect(linked).toBeTruthy();
    } finally {
      await adminContext.close();
    }
  });
});
