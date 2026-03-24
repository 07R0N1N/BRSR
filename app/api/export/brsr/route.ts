import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { mapAnswersToBRSR } from "@/lib/exporters/brsrDataMapper";
import type { OrgRow } from "@/types/brsr";

/**
 * GET /api/export/brsr?orgId=&year=
 * Returns BRSR export data (JSON). Auth required; RLS ensures org access.
 */
export async function GET(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, ctx } = access;

  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId") ?? searchParams.get("org_id");
  const year = (searchParams.get("year") ?? searchParams.get("reporting_year"))?.trim();

  if (!orgId || !year) {
    return NextResponse.json(
      { error: "orgId and year are required" },
      { status: 400 }
    );
  }

  const roleSlug = ctx.roleSlug;
  const userOrgId = ctx.orgId;

  if (roleSlug !== "admin" && roleSlug !== "master") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (roleSlug === "admin" && userOrgId !== orgId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("id, name, cin, company_type, industry, hq_city, country, website, reporting_year")
    .eq("id", orgId)
    .single();

  if (orgError || !org) {
    return NextResponse.json({ error: "Organization not found" }, { status: 404 });
  }

  const { data: answersRows, error: answersError } = await supabase
    .from("answers")
    .select("question_code, value")
    .eq("org_id", orgId)
    .eq("reporting_year", year);

  if (answersError) {
    return NextResponse.json({ error: answersError.message }, { status: 400 });
  }

  const answers: Record<string, string> = {};
  for (const row of answersRows ?? []) {
    answers[row.question_code] = row.value ?? "";
  }

  const orgRow: OrgRow = {
    id: org.id,
    name: org.name,
    cin: org.cin,
    company_type: org.company_type,
    industry: org.industry,
    hq_city: org.hq_city,
    country: org.country,
    website: org.website,
    reporting_year: org.reporting_year,
  };

  const data = mapAnswersToBRSR(answers, orgRow, year);
  return NextResponse.json(data);
}
