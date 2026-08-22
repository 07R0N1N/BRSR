import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { NextResponse } from "next/server";

const PAGE_SIZE = 1000;

/**
 * Org-wide assignment coverage for the Admin Workspace "unassigned blocks" toggle
 * and per-block "also assigned to" indicators.
 *
 * Returns distinct `question_code` values that have at least one row in
 * `user_question_assignments` for the admin's org, plus a map of each code to
 * the user IDs assigned it — restricted to non-admin org members (same
 * `neq("roles.slug", "admin")` pattern as page.tsx / assignment-stats /
 * assignments route). Admins already see/save every code regardless of
 * `user_question_assignments`, so a row attributed to an admin (e.g. a stale
 * row left over from before that account was promoted) is not a real
 * "assignment" for this UI's purposes and must not count as one — otherwise
 * the "assigned to others" filter/badge and this table disagree, since the
 * admin-workspace `users` list (assignable users) excludes admins too.
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

  const { data: nonAdminProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, roles!inner(slug)")
    .eq("org_id", targetOrgId)
    .neq("roles.slug", "admin");
  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 400 });
  }
  const assignableUserIds = new Set((nonAdminProfiles ?? []).map((p) => p.id));

  const assignedCodes = new Set<string>();
  const usersByCode = new Map<string, Set<string>>();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("user_question_assignments")
      .select("user_id, question_code")
      .eq("org_id", targetOrgId)
      .range(from, from + PAGE_SIZE - 1);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const rows = data ?? [];
    for (const row of rows) {
      if (!row.question_code || !row.user_id || !assignableUserIds.has(row.user_id)) continue;
      assignedCodes.add(row.question_code);
      const set = usersByCode.get(row.question_code) ?? new Set<string>();
      set.add(row.user_id);
      usersByCode.set(row.question_code, set);
    }
    if (rows.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return NextResponse.json({
    reporting_year: reportingYear,
    org_id: targetOrgId,
    assigned_question_codes: Array.from(assignedCodes),
    assigned_user_ids_by_code: Object.fromEntries(
      Array.from(usersByCode.entries()).map(([code, ids]) => [code, Array.from(ids)])
    ),
  });
}
