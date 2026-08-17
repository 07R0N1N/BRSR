import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Completion helpers for the Master dashboard (Overview stat cards,
 * Organizations list, Org detail Users tab). Master needs cross-org
 * visibility that the per-org `/api/assignment-stats` route intentionally
 * doesn't provide (it's scoped to one org + reporting year at a time), so
 * these read `answers` / `user_question_assignments` directly instead of
 * calling that route over HTTP from a server component.
 *
 * These do full-table reads across all orgs (no per-org pagination) — fine
 * at this tool's current scale (tens of orgs), but revisit with a DB view
 * or per-org RPC if the org count grows large enough for this to matter.
 */

type Supabase = SupabaseClient;

export type OrgWithStats = {
  id: string;
  name: string;
  plan_tier: string | null;
  reporting_year: string | null;
  company_type: string | null;
  industry: string | null;
  hq_city: string | null;
  country: string | null;
  cin: string | null;
  website: string | null;
  onboarding_complete: boolean;
  created_at: string;
  user_count: number;
  assigned_count: number;
  completed_count: number;
  /** null when the org has no question assignments yet (nothing to divide by). */
  completion_pct: number | null;
};

function toPct(completed: number, assigned: number): number | null {
  if (!assigned) return null;
  return Math.round((completed / assigned) * 100);
}

/** All organizations, each annotated with user_count and assignment-based completion for its own reporting_year. */
export async function getOrganizationsWithStats(supabase: Supabase): Promise<OrgWithStats[]> {
  const [{ data: orgs }, { data: profiles }, { data: assignments }, { data: answers }] = await Promise.all([
    supabase
      .from("organizations")
      .select(
        "id, name, plan_tier, reporting_year, company_type, industry, hq_city, country, cin, website, onboarding_complete, created_at"
      )
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, org_id").not("org_id", "is", null),
    supabase.from("user_question_assignments").select("org_id, question_code"),
    supabase.from("answers").select("org_id, reporting_year, question_code, value"),
  ]);

  const userCountByOrg = new Map<string, number>();
  for (const row of profiles ?? []) {
    if (!row.org_id) continue;
    userCountByOrg.set(row.org_id, (userCountByOrg.get(row.org_id) ?? 0) + 1);
  }

  const assignedByOrg = new Map<string, string[]>();
  for (const row of assignments ?? []) {
    const list = assignedByOrg.get(row.org_id) ?? [];
    list.push(row.question_code);
    assignedByOrg.set(row.org_id, list);
  }

  // question_code -> set of reporting_years it has a non-empty answer for, per org.
  const answeredByOrg = new Map<string, Map<string, Set<string>>>();
  for (const row of answers ?? []) {
    if (!(row.value ?? "").trim()) continue;
    const byYear = answeredByOrg.get(row.org_id) ?? new Map<string, Set<string>>();
    const codes = byYear.get(row.reporting_year) ?? new Set<string>();
    codes.add(row.question_code);
    byYear.set(row.reporting_year, codes);
    answeredByOrg.set(row.org_id, byYear);
  }

  return (orgs ?? []).map((org) => {
    const assignedCodes = assignedByOrg.get(org.id) ?? [];
    const answeredCodes = org.reporting_year
      ? answeredByOrg.get(org.id)?.get(org.reporting_year) ?? new Set<string>()
      : new Set<string>();
    const completedCount = assignedCodes.filter((code) => answeredCodes.has(code)).length;
    return {
      ...org,
      user_count: userCountByOrg.get(org.id) ?? 0,
      assigned_count: assignedCodes.length,
      completed_count: completedCount,
      completion_pct: toPct(completedCount, assignedCodes.length),
    };
  });
}

export type OrgUserStat = {
  id: string;
  email: string | null;
  display_name: string | null;
  role_slug: string;
  role_name: string;
  /** "all" for admin/master (they aren't restricted by user_question_assignments). */
  assigned_label: string;
  completion_pct: number | null;
};

/** Per-user completion for one org's Users tab. Admin rows use total active question codes as the denominator (they see/save everything, so `user_question_assignments` doesn't apply to them). */
export async function getOrgUsersWithStats(
  supabase: Supabase,
  orgId: string,
  reportingYear: string | null
): Promise<OrgUserStat[]> {
  const [{ data: profiles }, { data: assignments }, { data: answers }, { count: activeCodeCount }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, display_name, roles(name, slug)")
        .eq("org_id", orgId)
        .order("email"),
      supabase.from("user_question_assignments").select("user_id, question_code").eq("org_id", orgId),
      reportingYear
        ? supabase.from("answers").select("question_code, value").eq("org_id", orgId).eq("reporting_year", reportingYear)
        : Promise.resolve({ data: [] as { question_code: string; value: string | null }[] }),
      supabase.from("brsr_questions").select("question_code", { count: "exact", head: true }).eq("is_active", true),
    ]);

  const answeredCodes = new Set(
    (answers ?? []).filter((row) => (row.value ?? "").trim().length > 0).map((row) => row.question_code)
  );

  const assignedByUser = new Map<string, string[]>();
  for (const row of assignments ?? []) {
    const list = assignedByUser.get(row.user_id) ?? [];
    list.push(row.question_code);
    assignedByUser.set(row.user_id, list);
  }

  const totalActiveCodes = activeCodeCount ?? 0;

  return (profiles ?? []).map((p) => {
    const rolesData = p.roles as { name: string; slug: string } | { name: string; slug: string }[] | null;
    const roleObj = Array.isArray(rolesData) ? rolesData[0] : rolesData;
    const roleSlug = roleObj?.slug ?? "";
    const roleName = roleObj?.name ?? "—";

    if (roleSlug === "admin" || roleSlug === "master") {
      return {
        id: p.id,
        email: p.email,
        display_name: p.display_name,
        role_slug: roleSlug,
        role_name: roleName,
        assigned_label: "All",
        completion_pct: toPct(answeredCodes.size, totalActiveCodes),
      };
    }

    const assignedCodes = assignedByUser.get(p.id) ?? [];
    const completedCount = assignedCodes.filter((code) => answeredCodes.has(code)).length;
    return {
      id: p.id,
      email: p.email,
      display_name: p.display_name,
      role_slug: roleSlug,
      role_name: roleName,
      assigned_label: String(assignedCodes.length),
      completion_pct: toPct(completedCount, assignedCodes.length),
    };
  });
}
