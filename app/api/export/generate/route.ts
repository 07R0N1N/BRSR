import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { mapAnswersToBRSR } from "@/lib/exporters/brsrDataMapper";
import { buildBRSRDocx } from "@/lib/exporters/brsrDocx";
import { buildBRSRXlsx } from "@/lib/exporters/brsrXlsx";
import type { OrgRow, BRSRSectionId } from "@/types/brsr";

const DEFAULT_SECTIONS: BRSRSectionId[] = [
  "sectionA",
  "sectionB",
  "p1",
  "p2",
  "p3",
  "p4",
  "p5",
  "p6",
  "p7",
  "p8",
  "p9",
];

/**
 * POST /api/export/generate
 * Body: { orgId, year, format: "docx"|"xlsx"|"pdf"|"json", sections?: string[] }
 * Returns file stream or JSON. PDF returns 501.
 */
export async function POST(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, ctx } = access;

  let body: { orgId?: string; year?: string; format?: string; sections?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const orgId = body.orgId;
  const year = (body.year as string)?.trim();
  const format = (body.format as string)?.toLowerCase();
  const sections = (body.sections as string[] | undefined) ?? DEFAULT_SECTIONS;

  if (!orgId || !year) {
    return NextResponse.json({ error: "orgId and year are required" }, { status: 400 });
  }

  const validFormats = ["docx", "xlsx", "json"];
  if (!format || !validFormats.includes(format)) {
    if (format === "pdf") {
      return NextResponse.json(
        { error: "PDF export is not yet available. Please use DOCX or XLSX." },
        { status: 501 }
      );
    }
    return NextResponse.json(
      { error: `format must be one of: ${validFormats.join(", ")}, or pdf (coming soon)` },
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
  const safeOrgName = (org.name ?? "BRSR").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 50);
  const safeYear = year.replace(/[^a-zA-Z0-9-]/g, "_");

  if (format === "json") {
    return NextResponse.json(data);
  }

  if (format === "docx") {
    const buffer = await buildBRSRDocx(data, sections as BRSRSectionId[]);
    const filename = `BRSR_${safeOrgName}_${safeYear}.docx`;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  if (format === "xlsx") {
    const buffer = await buildBRSRXlsx(data, sections as BRSRSectionId[]);
    const filename = `BRSR_${safeOrgName}_${safeYear}.xlsx`;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  return NextResponse.json({ error: "Unsupported format" }, { status: 400 });
}
