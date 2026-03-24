import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";

function toPct(completed: number, assigned: number) {
  if (!assigned) return 0;
  return Math.round((completed / assigned) * 10000) / 100;
}

export async function GET(request: Request) {
  const access = await requireAppAccess("data");
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

  const [{ data: users, error: usersError }, { data: assignments, error: assignmentsError }, { data: answers, error: answersError }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, email, display_name")
        .eq("org_id", targetOrgId)
        .order("email"),
      supabase
        .from("user_question_assignments")
        .select("user_id, question_code")
        .eq("org_id", targetOrgId),
      supabase
        .from("answers")
        .select("question_code, value")
        .eq("org_id", targetOrgId)
        .eq("reporting_year", reportingYear),
    ]);

  if (usersError || assignmentsError || answersError) {
    return NextResponse.json(
      { error: usersError?.message ?? assignmentsError?.message ?? answersError?.message ?? "Failed to load stats" },
      { status: 400 }
    );
  }

  const answeredSet = new Set(
    (answers ?? [])
      .filter((row) => (row.value ?? "").trim().length > 0)
      .map((row) => row.question_code)
  );

  const assignmentsByUser = new Map<string, Set<string>>();
  for (const row of assignments ?? []) {
    const existing = assignmentsByUser.get(row.user_id) ?? new Set<string>();
    existing.add(row.question_code);
    assignmentsByUser.set(row.user_id, existing);
  }

  const perUser = (users ?? []).map((u) => {
    const assigned = assignmentsByUser.get(u.id) ?? new Set<string>();
    let completedCount = 0;
    for (const code of Array.from(assigned)) {
      if (answeredSet.has(code)) completedCount += 1;
    }
    return {
      user_id: u.id,
      email: u.email,
      display_name: u.display_name,
      assigned_count: assigned.size,
      completed_count: completedCount,
      completion_pct: toPct(completedCount, assigned.size),
    };
  });

  const totalAssigned = perUser.reduce((acc, item) => acc + item.assigned_count, 0);
  const totalCompleted = perUser.reduce((acc, item) => acc + item.completed_count, 0);

  return NextResponse.json({
    reporting_year: reportingYear,
    org_id: targetOrgId,
    totals: {
      assigned_count: totalAssigned,
      completed_count: totalCompleted,
      completion_pct: toPct(totalCompleted, totalAssigned),
    },
    per_user: perUser,
  });
}
