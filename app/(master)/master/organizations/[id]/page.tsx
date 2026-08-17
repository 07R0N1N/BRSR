import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrgUsersWithStats } from "@/lib/master/orgStats";
import { OrgDetailClient } from "./OrgDetailClient";

export default async function OrgDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: org } = await supabase
    .from("organizations")
    .select(
      "id, name, plan_tier, reporting_year, company_type, industry, hq_city, country, cin, website, onboarding_complete"
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!org) notFound();

  const users = await getOrgUsersWithStats(supabase, org.id, org.reporting_year);

  return <OrgDetailClient org={org} users={users} />;
}
