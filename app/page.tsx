import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canUseApp, redirectForIncompleteApp } from "@/lib/auth/accessPolicy";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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

  if (roleSlug === "master") {
    redirect("/master");
  }

  let onboardingComplete: boolean | null = null;
  if (orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .select("onboarding_complete")
      .eq("id", orgId)
      .single();
    onboardingComplete = (org as { onboarding_complete?: boolean } | null)?.onboarding_complete ?? null;
  }

  const ctx = {
    roleSlug: roleSlug ?? null,
    orgId,
    onboardingComplete: orgId ? onboardingComplete : null,
  };

  if (!canUseApp(ctx)) {
    redirect(redirectForIncompleteApp(ctx));
  }

  redirect("/dashboard");
}
