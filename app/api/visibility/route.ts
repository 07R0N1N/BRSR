import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";

export async function POST(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;
  const profile = await supabase
    .from("profiles")
    .select("roles(slug)")
    .eq("id", user.id)
    .single();
  const slug = (profile.data as { roles?: { slug: string } } | null)?.roles?.slug;
  if (slug !== "master" && slug !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const role_id = body.role_id as string;
  const section = (body.section as string)?.trim() || "A";
  const principle_no = (body.principle_no as string)?.trim() || "1";
  const question_code = (body.question_code as string)?.trim() || "default";
  if (!role_id) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }
  const { error } = await supabase.from("brsr_questions_visibility").insert({
    org_id: null,
    role_id,
    section,
    principle_no,
    question_code,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
