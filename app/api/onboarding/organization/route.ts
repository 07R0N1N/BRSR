import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const rolesData = profileData?.roles;
  const slug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  const orgId = profileData?.org_id ?? null;

  if (slug !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (orgId) return NextResponse.json({ error: "Already has organization" }, { status: 400 });

  const body = await request.json();
  const name = (body.name as string)?.trim();
  const reporting_year = (body.reporting_year as string)?.trim() || null;
  const company_type = (body.company_type as string)?.trim() || null;
  const industry = (body.industry as string)?.trim() || null;
  const hq_city = (body.hq_city as string)?.trim() || null;
  const country = (body.country as string)?.trim() || "India";
  const cin = (body.cin as string)?.trim() || null;
  const website = (body.website as string)?.trim() || null;

  if (!name?.trim()) return NextResponse.json({ error: "Organisation name is required" }, { status: 400 });
  if (!company_type) return NextResponse.json({ error: "Company type is required" }, { status: 400 });

  const admin = createAdminClient();
  const { data: newOrg, error: orgError } = await admin
    .from("organizations")
    .insert({
      name,
      reporting_year,
      company_type,
      industry,
      hq_city,
      country,
      cin,
      website,
      onboarding_complete: false,
    })
    .select("id")
    .single();

  if (orgError) return NextResponse.json({ error: orgError.message }, { status: 400 });
  if (!newOrg?.id) return NextResponse.json({ error: "Failed to create organization" }, { status: 500 });

  const { error: profileError } = await admin
    .from("profiles")
    .update({ org_id: newOrg.id })
    .eq("id", user.id);

  if (profileError) {
    await admin.from("organizations").delete().eq("id", newOrg.id);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, org_id: newOrg.id });
}
