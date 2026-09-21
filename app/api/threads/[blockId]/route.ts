import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { resolveBlockMeta } from "@/lib/collaboration/threads";

type AuthorInfo = {
  id: string;
  email: string | null;
  display_name: string | null;
};

type RouteContext = { params: { blockId: string } };

/**
 * GET /api/threads/[blockId]?org_id=&reporting_year=
 * Returns thread + non-deleted comments. If no row exists, returns a virtual
 * empty thread (does not insert until first note/comment).
 */
export async function GET(request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase } = access;

  const blockId = decodeURIComponent(context.params.blockId);
  const meta = resolveBlockMeta(blockId);
  if (!meta) {
    return NextResponse.json({ error: "Unknown block" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const org_id = searchParams.get("org_id");
  const reporting_year = searchParams.get("reporting_year")?.trim();
  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }

  const { data: thread, error: threadError } = await supabase
    .from("question_threads")
    .select("*")
    .eq("org_id", org_id)
    .eq("reporting_year", reporting_year)
    .eq("block_id", blockId)
    .maybeSingle();

  if (threadError) {
    return NextResponse.json({ error: threadError.message }, { status: 400 });
  }

  if (!thread) {
    return NextResponse.json({
      thread: {
        id: null,
        org_id,
        reporting_year,
        block_id: blockId,
        panel_id: meta.panelId,
        question_code: meta.questionCode,
        note_body: null,
        note_updated_by: null,
        note_updated_at: null,
        resolved_at: null,
        resolved_by: null,
        created_at: null,
      },
      comments: [],
      attachments: [],
      authors: {} as Record<string, AuthorInfo>,
      virtual: true,
    });
  }

  const [
    { data: comments, error: commentsError },
    { data: attachments, error: attachmentsError },
  ] = await Promise.all([
    supabase
      .from("question_comments")
      .select("id, thread_id, org_id, author_id, author_label, body, created_at, edited_at")
      .eq("thread_id", thread.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true }),
    supabase
      .from("question_attachments")
      .select(
        "id, thread_id, org_id, file_name, mime_type, size_bytes, uploaded_by, uploader_label, created_at, comment_id"
      )
      .eq("thread_id", thread.id)
      .order("created_at", { ascending: true }),
  ]);

  if (commentsError) {
    return NextResponse.json({ error: commentsError.message }, { status: 400 });
  }
  if (attachmentsError) {
    return NextResponse.json({ error: attachmentsError.message }, { status: 400 });
  }

  const commentRows = comments ?? [];
  const attachmentRows = attachments ?? [];
  const authorIds = Array.from(
    new Set(
      [
        ...commentRows.map((c) => c.author_id as string | null),
        ...attachmentRows.map((a) => a.uploaded_by as string | null),
        thread.note_updated_by as string | null,
        thread.resolved_by as string | null,
      ].filter((id): id is string => Boolean(id))
    )
  );

  const authors: Record<string, AuthorInfo> = {};
  if (authorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, email, display_name")
      .in("id", authorIds);

    if (profilesError) {
      return NextResponse.json({ error: profilesError.message }, { status: 400 });
    }

    for (const p of profiles ?? []) {
      authors[p.id as string] = {
        id: p.id as string,
        email: (p.email as string | null) ?? null,
        display_name: (p.display_name as string | null) ?? null,
      };
    }
  }

  return NextResponse.json({
    thread,
    comments: commentRows,
    attachments: attachmentRows,
    authors,
    virtual: false,
  });
}
