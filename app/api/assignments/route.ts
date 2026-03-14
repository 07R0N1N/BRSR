import { createClient } from "@/lib/supabase/server";
import { ALL_QUESTION_CODES } from "@/lib/brsr/questionConfig";
import { NextResponse } from "next/server";

function getRoleSlug(roles: { slug: string } | { slug: string }[] | null | undefined) {
  return Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
}

async function getRequestContext() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };

  const profile = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile.data as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const roleSlug = getRoleSlug(profileData?.roles ?? null);
  if (roleSlug !== "admin" && roleSlug !== "master") {
    return { supabase, error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return {
    supabase,
    roleSlug,
    orgId: profileData?.org_id ?? null,
    userId: user.id,
  };
}

export async function GET(request: Request) {
  const ctx = await getRequestContext();
  if ("error" in ctx) return ctx.error;
  const { supabase, roleSlug, orgId } = ctx;

  const { searchParams } = new URL(request.url);
  const selectedUserId = searchParams.get("user_id");
  const requestedOrgId = searchParams.get("org_id");
  const targetOrgId = roleSlug === "master" ? requestedOrgId : orgId;

  if (!targetOrgId) {
    return NextResponse.json({ error: "Organization not available" }, { status: 400 });
  }

  const { data: users, error: usersError } = await supabase
    .from("profiles")
    .select("id, email, display_name, roles(slug)")
    .eq("org_id", targetOrgId)
    .order("email");
  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 400 });
  }

  let assignedQuestionCodes: string[] = [];
  if (selectedUserId) {
    const { data: assignments, error: assignmentsError } = await supabase
      .from("user_question_assignments")
      .select("question_code")
      .eq("org_id", targetOrgId)
      .eq("user_id", selectedUserId);
    if (assignmentsError) {
      return NextResponse.json({ error: assignmentsError.message }, { status: 400 });
    }
    assignedQuestionCodes = (assignments ?? []).map((a) => a.question_code);
  }

  return NextResponse.json({
    org_id: targetOrgId,
    users: users ?? [],
    selected_user_id: selectedUserId,
    assigned_question_codes: assignedQuestionCodes,
  });
}

export async function PUT(request: Request) {
  const ctx = await getRequestContext();
  if ("error" in ctx) return ctx.error;
  const { supabase, roleSlug, orgId } = ctx;

  const body = await request.json();
  const userId = (body.user_id as string | undefined)?.trim();
  const requestedOrgId = (body.org_id as string | undefined)?.trim();
  const questionCodesRaw = Array.isArray(body.question_codes) ? body.question_codes : [];
  const validCodeSet = new Set(ALL_QUESTION_CODES);
  const questionCodes = Array.from(
    new Set(
      questionCodesRaw
        .filter((v: unknown): v is string => typeof v === "string")
        .map((v: string) => v.trim())
        .filter((code: string) => code.length > 0 && validCodeSet.has(code))
    )
  );

  const targetOrgId = roleSlug === "master" ? requestedOrgId ?? null : orgId;
  if (!targetOrgId || !userId) {
    return NextResponse.json({ error: "org_id and user_id are required" }, { status: 400 });
  }

  const { data: userProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .eq("org_id", targetOrgId)
    .single();
  if (!userProfile) {
    return NextResponse.json({ error: "Selected user is not in this organization" }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from("user_question_assignments")
    .delete()
    .eq("org_id", targetOrgId)
    .eq("user_id", userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  if (questionCodes.length > 0) {
    const rows = questionCodes.map((question_code) => ({
      org_id: targetOrgId,
      user_id: userId,
      question_code,
    }));
    const { error: insertError } = await supabase
      .from("user_question_assignments")
      .insert(rows);
    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true, assigned_count: questionCodes.length });
}
