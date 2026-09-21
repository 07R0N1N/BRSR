import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { ensureThreadRow, isRlsForbidden } from "@/lib/collaboration/threads";

type RouteContext = { params: { blockId: string } };

/**
 * PUT /api/threads/[blockId]/note
 * Body: { org_id, reporting_year, note_body }
 * Ensures thread, sets note_body + note_updated_by/at.
 */
export async function PUT(request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;

  const blockId = decodeURIComponent(context.params.blockId);

  const body = await request.json();
  const org_id = body.org_id as string | undefined;
  const reporting_year = (body.reporting_year as string | undefined)?.trim();
  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }
  if (typeof body.note_body !== "string") {
    return NextResponse.json({ error: "note_body is required" }, { status: 400 });
  }

  const ensured = await ensureThreadRow(supabase, {
    orgId: org_id,
    reportingYear: reporting_year,
    blockId,
  });
  if (ensured.notFound) {
    return NextResponse.json({ error: "Unknown block" }, { status: 404 });
  }
  if (ensured.error || !ensured.data) {
    if (ensured.error && isRlsForbidden({ message: ensured.error })) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: ensured.error ?? "Failed to ensure thread" },
      { status: 400 }
    );
  }

  const note_body = body.note_body.trim() === "" ? null : body.note_body;
  const now = new Date().toISOString();

  const { data: thread, error } = await supabase
    .from("question_threads")
    .update({
      note_body,
      note_updated_by: user.id,
      note_updated_at: now,
    })
    .eq("id", ensured.data.id)
    .select("*")
    .single();

  if (error) {
    if (isRlsForbidden(error)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ thread });
}
