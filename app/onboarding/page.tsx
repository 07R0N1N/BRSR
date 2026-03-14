import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingClient } from "./OnboardingClient";

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

  // Only admins with an org see this flow
  if (roleSlug !== "admin" || !orgId) {
    redirect("/dashboard");
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

  // Already onboarded — go to dashboard
  if (orgData?.onboarding_complete) {
    redirect("/dashboard");
  }

  // Fetch existing org users (already added before this session)
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
      org={orgData ?? { id: orgId, name: "", reporting_year: null, company_type: null, industry: null, hq_city: null, country: "India", cin: null, website: null, onboarding_complete: false }}
      initialUsers={users}
    />
  );
}
