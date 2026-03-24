import { describe, expect, it } from "vitest";
import {
  canAccessAssignmentEndpoints,
  canUseAdminOnboardingWizard,
  canUseApp,
  isMaster,
  redirectForIncompleteApp,
  resolveOrgSaveMode,
  shouldShowOrgPendingOnly,
} from "@/lib/auth/accessPolicy";

describe("isMaster", () => {
  it("is true only for master", () => {
    expect(isMaster("master")).toBe(true);
    expect(isMaster("admin")).toBe(false);
    expect(isMaster(null)).toBe(false);
  });
});

describe("canUseApp", () => {
  it("allows master regardless of org", () => {
    expect(canUseApp({ roleSlug: "master", orgId: null, onboardingComplete: null })).toBe(true);
    expect(canUseApp({ roleSlug: "master", orgId: "x", onboardingComplete: false })).toBe(true);
  });

  it("denies admin with null org", () => {
    expect(canUseApp({ roleSlug: "admin", orgId: null, onboardingComplete: null })).toBe(false);
  });

  it("denies admin with org but incomplete onboarding", () => {
    expect(canUseApp({ roleSlug: "admin", orgId: "o1", onboardingComplete: false })).toBe(false);
    expect(canUseApp({ roleSlug: "admin", orgId: "o1", onboardingComplete: null })).toBe(false);
  });

  it("allows admin when org onboarding complete", () => {
    expect(canUseApp({ roleSlug: "admin", orgId: "o1", onboardingComplete: true })).toBe(true);
  });

  it("denies normal with org incomplete", () => {
    expect(canUseApp({ roleSlug: "normal", orgId: "o1", onboardingComplete: false })).toBe(false);
  });

  it("allows normal when org complete", () => {
    expect(canUseApp({ roleSlug: "normal", orgId: "o1", onboardingComplete: true })).toBe(true);
  });

  it("denies normal with null org", () => {
    expect(canUseApp({ roleSlug: "normal", orgId: null, onboardingComplete: null })).toBe(false);
  });
});

describe("redirectForIncompleteApp", () => {
  it("sends admin without org to onboarding", () => {
    expect(redirectForIncompleteApp({ roleSlug: "admin", orgId: null, onboardingComplete: null })).toBe(
      "/onboarding"
    );
  });

  it("sends non-admin without org to login", () => {
    expect(redirectForIncompleteApp({ roleSlug: "normal", orgId: null, onboardingComplete: null })).toBe(
      "/login"
    );
  });

  it("sends users with incomplete org to onboarding", () => {
    expect(redirectForIncompleteApp({ roleSlug: "admin", orgId: "o1", onboardingComplete: false })).toBe(
      "/onboarding"
    );
    expect(redirectForIncompleteApp({ roleSlug: "normal", orgId: "o1", onboardingComplete: false })).toBe(
      "/onboarding"
    );
  });
});

describe("canUseAdminOnboardingWizard", () => {
  it("is true for admin only", () => {
    expect(canUseAdminOnboardingWizard({ roleSlug: "admin", orgId: null, onboardingComplete: null })).toBe(
      true
    );
    expect(canUseAdminOnboardingWizard({ roleSlug: "normal", orgId: "o1", onboardingComplete: false })).toBe(
      false
    );
  });
});

describe("shouldShowOrgPendingOnly", () => {
  it("is true for normal with org and incomplete onboarding", () => {
    expect(
      shouldShowOrgPendingOnly({ roleSlug: "normal", orgId: "o1", onboardingComplete: false })
    ).toBe(true);
  });

  it("is false for admin in same situation (they use wizard)", () => {
    expect(shouldShowOrgPendingOnly({ roleSlug: "admin", orgId: "o1", onboardingComplete: false })).toBe(
      false
    );
  });

  it("is false when complete", () => {
    expect(shouldShowOrgPendingOnly({ roleSlug: "normal", orgId: "o1", onboardingComplete: true })).toBe(
      false
    );
  });
});

describe("canAccessAssignmentEndpoints", () => {
  it("allows admin with org before onboarding complete", () => {
    expect(
      canAccessAssignmentEndpoints({
        roleSlug: "admin",
        orgId: "o1",
        onboardingComplete: false,
      })
    ).toBe(true);
  });

  it("denies normal user before onboarding complete", () => {
    expect(
      canAccessAssignmentEndpoints({
        roleSlug: "normal",
        orgId: "o1",
        onboardingComplete: false,
      })
    ).toBe(false);
  });
});

describe("resolveOrgSaveMode", () => {
  it("create when no org id", () => {
    expect(resolveOrgSaveMode(null)).toBe("create");
    expect(resolveOrgSaveMode("")).toBe("create");
    expect(resolveOrgSaveMode(undefined)).toBe("create");
  });

  it("update when org id present", () => {
    expect(resolveOrgSaveMode("uuid-here")).toBe("update");
  });
});
