import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingClient } from "./OnboardingClient";
import {
  canUseApp,
  isMaster,
  redirectForIncompleteApp,
  shouldShowOrgPendingOnly,
} from "@/lib/auth/accessPolicy";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, email, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile as {
    org_id: string | null;
    email: string | null;
    roles?: { slug: string } | { slug: string }[];
  } | null;

  const rolesData = profileData?.roles;
  const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  const orgId = profileData?.org_id ?? null;

  if (isMaster(roleSlug ?? null)) {
    redirect("/master");
  }

  let onboardingComplete: boolean | null = null;
  if (orgId) {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("onboarding_complete")
      .eq("id", orgId)
      .single();
    onboardingComplete = (orgRow as { onboarding_complete?: boolean } | null)?.onboarding_complete ?? null;
  }

  const ctx = {
    roleSlug: roleSlug ?? null,
    orgId,
    onboardingComplete: orgId ? onboardingComplete : null,
  };

  if (canUseApp(ctx)) {
    redirect("/dashboard");
  }

  if (shouldShowOrgPendingOnly(ctx)) {
    return (
      <OnboardingClient
        adminEmail={user.email ?? ""}
        org={{
          id: orgId ?? "",
          name: "",
          reporting_year: null,
          company_type: null,
          industry: null,
          hq_city: null,
          country: "India",
          cin: null,
          website: null,
          onboarding_complete: false,
        }}
        initialUsers={[]}
        mode="pending"
      />
    );
  }

  if (roleSlug !== "admin") {
    redirect(redirectForIncompleteApp(ctx));
  }

  if (!orgId) {
    return (
      <OnboardingClient
        adminEmail={user.email ?? ""}
        org={{
          id: "",
          name: "",
          reporting_year: null,
          company_type: null,
          industry: null,
          hq_city: null,
          country: "India",
          cin: null,
          website: null,
          onboarding_complete: false,
        }}
        initialUsers={[]}
        mode="wizard"
      />
    );
  }

  const { data: org } = await supabase
    .from("organizations")
    .select("id, name, reporting_year, company_type, industry, hq_city, country, cin, website, onboarding_complete")
    .eq("id", orgId)
    .single();

  const orgData = org as {
    id: string;
    name: string;
    reporting_year: string | null;
    company_type: string | null;
    industry: string | null;
    hq_city: string | null;
    country: string | null;
    cin: string | null;
    website: string | null;
    onboarding_complete: boolean;
  } | null;

  if (orgData?.onboarding_complete) {
    redirect("/dashboard");
  }

  const { data: existingUsers } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .eq("org_id", orgId)
    .neq("id", user.id)
    .order("email");

  const users = (existingUsers ?? []) as { id: string; email: string | null; display_name: string | null }[];

  return (
    <OnboardingClient
      adminEmail={user.email ?? ""}
      org={
        orgData ?? {
          id: orgId,
          name: "",
          reporting_year: null,
          company_type: null,
          industry: null,
          hq_city: null,
          country: "India",
          cin: null,
          website: null,
          onboarding_complete: false,
        }
      }
      initialUsers={users}
      mode="wizard"
    />
  );
}
