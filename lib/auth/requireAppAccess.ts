import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import {
  canAccessAssignmentEndpoints,
  canUseApp,
  isMaster,
  type AccessContext,
} from "@/lib/auth/accessPolicy";

export type AppAccessMode = "data" | "assignments";

/**
 * Enforces onboarding gate for API routes. Master always passes.
 * - `data`: answers, exports, assignment-stats, assignments/me — requires completed onboarding (or master).
 * - `assignments`: GET/PUT /api/assignments — also allows admin mid-onboarding (org exists, not launched).
 */
export async function requireAppAccess(mode: AppAccessMode = "data"): Promise<
  | { ok: true; supabase: Awaited<ReturnType<typeof createClient>>; user: User; ctx: AccessContext }
  | { ok: false; response: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const rolesData = profileData?.roles;
  const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  const orgId = profileData?.org_id ?? null;

  let onboardingComplete: boolean | null = null;
  if (orgId) {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("onboarding_complete")
      .eq("id", orgId)
      .single();
    onboardingComplete = (orgRow as { onboarding_complete?: boolean } | null)?.onboarding_complete ?? null;
  }

  const ctx: AccessContext = {
    roleSlug: roleSlug ?? null,
    orgId,
    onboardingComplete: orgId ? onboardingComplete : null,
  };

  const allowed =
    mode === "data"
      ? isMaster(ctx.roleSlug ?? null) || canUseApp(ctx)
      : isMaster(ctx.roleSlug ?? null) || canAccessAssignmentEndpoints(ctx);

  if (!allowed) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true, supabase, user, ctx };
}
