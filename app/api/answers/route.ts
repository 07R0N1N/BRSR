import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get("org_id");
  const reporting_year = searchParams.get("reporting_year");
  if (!org_id || !reporting_year?.trim()) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }
  const { data, error } = await supabase
    .from("answers")
    .select("question_code, value")
    .eq("org_id", org_id)
    .eq("reporting_year", reporting_year.trim());
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const answers: Record<string, string> = {};
  for (const row of data ?? []) {
    answers[row.question_code] = row.value ?? "";
  }
  return NextResponse.json({ answers });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const org_id = body.org_id as string;
  const reporting_year = (body.reporting_year as string)?.trim();
  const answers = body.answers as Record<string, string | null> | undefined;
  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }
  if (!answers || typeof answers !== "object") {
    return NextResponse.json(
      { error: "answers object is required" },
      { status: 400 }
    );
  }
  const rows = Object.entries(answers).map(([question_code, value]) => ({
    org_id,
    reporting_year,
    question_code,
    value: value ?? null,
    updated_by: user.id,
  }));
  const { error } = await supabase.from("answers").upsert(rows, {
    onConflict: "org_id,reporting_year,question_code",
    ignoreDuplicates: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
