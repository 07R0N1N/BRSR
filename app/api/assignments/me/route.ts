import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function getRoleSlug(roles: { slug: string } | { slug: string }[] | null | undefined) {
  return Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile.data as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const roleSlug = getRoleSlug(profileData?.roles ?? null);
  const orgId = profileData?.org_id ?? null;

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
