/**
 * Pure access policy for onboarding gate + master exemption.
 * Used by middleware, API helpers, and tests.
 */

export type RoleSlug = "master" | "admin" | "user" | string;

export type AccessContext = {
  roleSlug: string | null;
  orgId: string | null;
  /** When orgId is set, whether that org finished onboarding. Ignored if no org. */
  onboardingComplete: boolean | null;
};

export function isMaster(roleSlug: string | null): boolean {
  return roleSlug === "master";
}

/**
 * User may use /dashboard and app APIs (answers, assignments, export, etc.).
 * Master always; others only when tied to an org and onboarding is complete.
 */
export function canUseApp(ctx: AccessContext): boolean {
  if (isMaster(ctx.roleSlug)) return true;
  if (!ctx.orgId) return false;
  return ctx.onboardingComplete === true;
}

/**
 * Where to send a non-master user who cannot use the app yet.
 */
export function redirectForIncompleteApp(ctx: AccessContext): "/onboarding" | "/login" {
  if (!ctx.orgId) {
    if (ctx.roleSlug === "admin") return "/onboarding";
    return "/login";
  }
  return "/onboarding";
}

/**
 * Admin may use the full onboarding wizard (create org + steps).
 */
export function canUseAdminOnboardingWizard(ctx: AccessContext): boolean {
  return ctx.roleSlug === "admin";
}

/**
 * Non-admin with org but incomplete onboarding: show pending UI, not the admin wizard.
 */
export function shouldShowOrgPendingOnly(ctx: AccessContext): boolean {
  if (isMaster(ctx.roleSlug)) return false;
  if (ctx.roleSlug !== "admin" && ctx.orgId && ctx.onboardingComplete !== true) {
    return true;
  }
  return false;
}

/**
 * Admin-only: assignment APIs during onboarding (before launch), after org exists.
 * Not for standard (User role) accounts until `canUseApp`.
 */
export function canAccessAssignmentEndpoints(ctx: AccessContext): boolean {
  if (isMaster(ctx.roleSlug)) return true;
  if (canUseApp(ctx)) return true;
  return (
    ctx.roleSlug === "admin" &&
    Boolean(ctx.orgId) &&
    ctx.onboardingComplete !== true
  );
}

/** StepOrgSetup: create org vs update existing. */
export type OrgSaveMode = "create" | "update";

export function resolveOrgSaveMode(orgId: string | null | undefined): OrgSaveMode {
  if (orgId == null || orgId === "") return "create";
  return "update";
}
