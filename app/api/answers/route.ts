import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";

function isAnswersRlsForbidden(error: { code?: string; message?: string }): boolean {
  const code = error.code ?? "";
  const msg = (error.message ?? "").toLowerCase();
  return (
    code === "42501" ||
    msg.includes("row-level security") ||
    msg.includes("permission denied")
  );
}

export type AnswerMeta = {
  updated_by: string | null;
  updated_at: string | null;
};

export async function GET(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase } = access;
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
    .select("question_code, value, updated_by, updated_at")
    .eq("org_id", org_id)
    .eq("reporting_year", reporting_year.trim());
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const answers: Record<string, string> = {};
  const meta: Record<string, AnswerMeta> = {};
  for (const row of data ?? []) {
    answers[row.question_code] = row.value ?? "";
    meta[row.question_code] = {
      updated_by: row.updated_by ?? null,
      updated_at: row.updated_at ?? null,
    };
  }
  return NextResponse.json({ answers, meta });
}

export async function POST(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;
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
  if (rows.length === 0) {
    return NextResponse.json({ ok: true });
  }
  const { error } = await supabase.from("answers").upsert(rows, {
    onConflict: "org_id,reporting_year,question_code",
    ignoreDuplicates: false,
  });
  if (error) {
    if (isAnswersRlsForbidden(error)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
