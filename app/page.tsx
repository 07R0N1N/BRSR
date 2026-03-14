import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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
  let orgId = profileData?.org_id ?? null;

  // Admin with no org: create one and assign before onboarding
  if (roleSlug === "admin" && !orgId) {
    const admin = createAdminClient();
    const { data: newOrg, error: orgError } = await admin
      .from("organizations")
      .insert({ name: "" })
      .select("id")
      .single();
    if (!orgError && newOrg?.id) {
      await admin.from("profiles").update({ org_id: newOrg.id }).eq("id", user.id);
      orgId = newOrg.id;
    }
  }

  if (roleSlug === "master") {
    redirect("/master");
  }

  // For admins, check if onboarding is complete
  if (roleSlug === "admin" && orgId) {
    const { data: org } = await supabase
      .from("organizations")
      .select("onboarding_complete")
      .eq("id", orgId)
      .single();
    const onboardingComplete = (org as { onboarding_complete?: boolean } | null)?.onboarding_complete;
    if (!onboardingComplete) {
      redirect("/onboarding");
    }
  }

  redirect("/dashboard");
}
