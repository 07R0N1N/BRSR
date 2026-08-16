import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { NextResponse } from "next/server";

const PAGE_SIZE = 1000;

/**
 * Org-wide assignment coverage for the Admin Workspace "unassigned blocks" toggle.
 *
 * Returns distinct `question_code` values that have at least one row in
 * `user_question_assignments` for the admin's org (any user). Read-only.
 *
 * `user_question_assignments` is not partitioned by reporting year (CONTEXT.md §4);
 * `reporting_year` is required so the workspace can request this in the same
 * context as stats, and is echoed in the response.
 */
export async function GET(request: Request) {
  const access = await requireAppAccess("assignments");
  if (!access.ok) return access.response;
  const { supabase, ctx } = access;

  const roleSlug = ctx.roleSlug;
  if (roleSlug !== "admin" && roleSlug !== "master") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const reportingYear = (searchParams.get("reporting_year") ?? "").trim();
  if (!reportingYear) {
    return NextResponse.json({ error: "reporting_year is required" }, { status: 400 });
  }

  const requestedOrgId = (searchParams.get("org_id") ?? "").trim();
  const targetOrgId = roleSlug === "master" ? requestedOrgId : ctx.orgId ?? null;
  if (!targetOrgId) {
    return NextResponse.json({ error: "Organization not available" }, { status: 400 });
  }

  const assignedCodes = new Set<string>();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("user_question_assignments")
      .select("question_code")
      .eq("org_id", targetOrgId)
      .range(from, from + PAGE_SIZE - 1);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const rows = data ?? [];
    for (const row of rows) {
      if (row.question_code) assignedCodes.add(row.question_code);
    }
    if (rows.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return NextResponse.json({
    reporting_year: reportingYear,
    org_id: targetOrgId,
    assigned_question_codes: Array.from(assignedCodes),
  });
}
