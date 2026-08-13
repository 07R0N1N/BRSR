/**
 * @testfile
 * Suite:    Email/password normalization
 * Breaker:  N/A
 * Covers:   Every user-creation and login path must lowercase+trim email
 *            (so casing/whitespace never causes a duplicate account or a
 *            failed login) while leaving password case completely
 *            untouched (only trimmed) — mixing these up silently changes
 *            the credential a user ends up needing to log in with.
 * Run:      npx vitest run lib/auth/normalize.test.ts
 * Depends:  none — pure unit
 */

import { describe, expect, it } from "vitest";
import { normalizeEmail, normalizePassword } from "./normalize";

describe("normalizeEmail", () => {
  it("lowercases mixed-case email", () => {
    expect(normalizeEmail("Jane@Co.COM")).toBe("jane@co.com");
  });

  it("strips leading/trailing whitespace", () => {
    expect(normalizeEmail("  jane@co.com  ")).toBe("jane@co.com");
  });

  it("strips whitespace and lowercases together", () => {
    expect(normalizeEmail("  Jane@Co.COM  ")).toBe("jane@co.com");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(normalizeEmail("   ")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeEmail("")).toBe("");
  });

  it("returns empty string for null/undefined", () => {
    expect(normalizeEmail(null)).toBe("");
    expect(normalizeEmail(undefined)).toBe("");
  });
});

describe("normalizePassword", () => {
  it("strips leading/trailing whitespace", () => {
    expect(normalizePassword("  secret123  ")).toBe("secret123");
  });

  // Regression: Master's single-user create (app/api/users/route.ts) used
  // the password verbatim with no trim, while the bulk onboarding path
  // trimmed inconsistently — an admin-typed trailing space silently became
  // part of the stored credential and never matched what was shared.
  it("never changes internal case", () => {
    expect(normalizePassword("Secret123")).toBe("Secret123");
    expect(normalizePassword("  Secret123  ")).toBe("Secret123");
    expect(normalizePassword("SeCrEt123")).not.toBe("secret123");
  });

  it("returns empty string for whitespace-only input", () => {
    expect(normalizePassword("   ")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(normalizePassword("")).toBe("");
  });

  it("returns empty string for null/undefined", () => {
    expect(normalizePassword(null)).toBe("");
    expect(normalizePassword(undefined)).toBe("");
  });
});
