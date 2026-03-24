import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";

function getRoleSlug(roles: { slug: string } | { slug: string }[] | null | undefined) {
  return Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
}

export async function GET() {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;

  const { supabase, user, ctx } = access;
  const roleSlug = ctx.roleSlug;
  const orgId = ctx.orgId ?? null;

  if (roleSlug === "master" || roleSlug === "admin") {
    return NextResponse.json({ mode: "all", question_codes: [] as string[] });
  }
  if (!orgId) {
    return NextResponse.json({ mode: "restricted", question_codes: [] as string[] });
  }

  const { data, error } = await supabase
    .from("user_question_assignments")
    .select("question_code")
    .eq("org_id", orgId)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    mode: "restricted",
    question_codes: (data ?? []).map((row) => row.question_code),
  });
}
