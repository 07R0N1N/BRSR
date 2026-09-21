import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { ensureThreadRow, isRlsForbidden } from "@/lib/collaboration/threads";

type RouteContext = { params: { blockId: string } };

/**
 * POST /api/threads/[blockId]/comments
 * Body: { org_id, reporting_year, body }
 * Ensures thread row, then inserts comment. panel_id / question_code from block index.
 */
export async function POST(request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;

  const blockId = decodeURIComponent(context.params.blockId);

  const body = await request.json();
  const org_id = body.org_id as string | undefined;
  const reporting_year = (body.reporting_year as string | undefined)?.trim();
  const commentBody = typeof body.body === "string" ? body.body.trim() : "";

  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }
  if (!commentBody) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
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

  const { data: comment, error } = await supabase
    .from("question_comments")
    .insert({
      thread_id: ensured.data.id,
      org_id,
      author_id: user.id,
      body: commentBody,
    })
    .select("id, thread_id, org_id, author_id, author_label, body, created_at, edited_at, deleted_at")
    .single();

  if (error) {
    if (isRlsForbidden(error)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ comment });
}
