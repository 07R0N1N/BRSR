import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { isRlsForbidden, resolveBlockMeta } from "@/lib/collaboration/threads";

type RouteContext = { params: { blockId: string } };

/**
 * POST /api/threads/[blockId]/read
 * Body: { org_id, reporting_year }
 * Upserts question_comment_reads.last_read_at = now().
 * No-op (does not insert a thread) when no thread row exists yet.
 */
export async function POST(request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;

  const blockId = decodeURIComponent(context.params.blockId);
  if (!resolveBlockMeta(blockId)) {
    return NextResponse.json({ error: "Unknown block" }, { status: 404 });
  }

  const body = await request.json();
  const org_id = body.org_id as string | undefined;
  const reporting_year = (body.reporting_year as string | undefined)?.trim();
  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }

  const { data: thread, error: threadError } = await supabase
    .from("question_threads")
    .select("id")
    .eq("org_id", org_id)
    .eq("reporting_year", reporting_year)
    .eq("block_id", blockId)
    .maybeSingle();

  if (threadError) {
    return NextResponse.json({ error: threadError.message }, { status: 400 });
  }
  if (!thread) {
    return NextResponse.json({ read: null });
  }

  const now = new Date().toISOString();
  const { data: read, error } = await supabase
    .from("question_comment_reads")
    .upsert(
      {
        thread_id: thread.id,
        user_id: user.id,
        last_read_at: now,
      },
      { onConflict: "thread_id,user_id" }
    )
    .select("thread_id, user_id, last_read_at")
    .single();

  if (error) {
    if (isRlsForbidden(error)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ read });
}
