import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";

type ThreadSummary = {
  commentCount: number;
  unreadCount: number;
  hasNote: boolean;
  attachmentCount: number;
  resolved: boolean;
};

/**
 * GET /api/threads?org_id=&reporting_year=
 * Summary map keyed by block_id (RLS filters to accessible threads only).
 */
export async function GET(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;

  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get("org_id");
  const reporting_year = searchParams.get("reporting_year")?.trim();
  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }

  const { data: threads, error: threadsError } = await supabase
    .from("question_threads")
    .select("id, block_id, note_body, resolved_at")
    .eq("org_id", org_id)
    .eq("reporting_year", reporting_year);

  if (threadsError) {
    return NextResponse.json({ error: threadsError.message }, { status: 400 });
  }

  const threadRows = threads ?? [];
  if (threadRows.length === 0) {
    return NextResponse.json({ threads: {} as Record<string, ThreadSummary> });
  }

  const threadIds = threadRows.map((t) => t.id as string);

  const [
    { data: comments, error: commentsError },
    { data: reads, error: readsError },
    { data: attachmentRows, error: attachmentsError },
  ] = await Promise.all([
    supabase
      .from("question_comments")
      .select("thread_id, author_id, created_at, deleted_at")
      .in("thread_id", threadIds)
      .is("deleted_at", null),
    supabase
      .from("question_comment_reads")
      .select("thread_id, last_read_at")
      .eq("user_id", user.id)
      .in("thread_id", threadIds),
    supabase
      .from("question_attachments")
      .select("thread_id")
      .in("thread_id", threadIds),
  ]);

  if (commentsError) {
    return NextResponse.json({ error: commentsError.message }, { status: 400 });
  }
  if (readsError) {
    return NextResponse.json({ error: readsError.message }, { status: 400 });
  }
  if (attachmentsError) {
    return NextResponse.json({ error: attachmentsError.message }, { status: 400 });
  }

  const lastReadByThread = new Map<string, string>();
  for (const row of reads ?? []) {
    lastReadByThread.set(row.thread_id as string, row.last_read_at as string);
  }

  const commentsByThread = new Map<
    string,
    { author_id: string | null; created_at: string }[]
  >();
  for (const row of comments ?? []) {
    const tid = row.thread_id as string;
    const list = commentsByThread.get(tid) ?? [];
    list.push({
      author_id: (row.author_id as string | null) ?? null,
      created_at: row.created_at as string,
    });
    commentsByThread.set(tid, list);
  }

  const attachmentsByThread = new Map<string, number>();
  for (const row of attachmentRows ?? []) {
    const tid = row.thread_id as string;
    attachmentsByThread.set(tid, (attachmentsByThread.get(tid) ?? 0) + 1);
  }

  const result: Record<string, ThreadSummary> = {};
  for (const thread of threadRows) {
    const tid = thread.id as string;
    const blockId = thread.block_id as string;
    const threadComments = commentsByThread.get(tid) ?? [];
    const lastReadAt = lastReadByThread.get(tid);
    const lastReadMs = lastReadAt ? Date.parse(lastReadAt) : 0;

    let unreadCount = 0;
    for (const c of threadComments) {
      if (c.author_id === user.id) continue;
      if (Date.parse(c.created_at) > lastReadMs) unreadCount += 1;
    }

    const noteBody = thread.note_body as string | null;
    result[blockId] = {
      commentCount: threadComments.length,
      unreadCount,
      hasNote: Boolean(noteBody && noteBody.trim().length > 0),
      attachmentCount: attachmentsByThread.get(tid) ?? 0,
      resolved: thread.resolved_at != null,
    };
  }

  return NextResponse.json({ threads: result });
}
