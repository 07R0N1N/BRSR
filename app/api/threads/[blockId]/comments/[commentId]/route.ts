import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { isMaster } from "@/lib/auth/accessPolicy";
import { getBlock } from "@/lib/brsr/blockIndex";
import { isRlsForbidden } from "@/lib/collaboration/threads";

type RouteContext = {
  params: { blockId: string; commentId: string };
};

/**
 * PATCH /api/threads/[blockId]/comments/[commentId]
 * Body: { body?: string, deleted?: boolean }
 * Edit own comment body, or soft-delete (author or admin/master).
 */
export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user, ctx } = access;

  const blockId = decodeURIComponent(context.params.blockId);
  const commentId = context.params.commentId;
  if (!getBlock(blockId)) {
    return NextResponse.json({ error: "Unknown block" }, { status: 404 });
  }

  const payload = await request.json();
  const hasBody = typeof payload.body === "string";
  const deleted = payload.deleted === true;

  if (!hasBody && !deleted) {
    return NextResponse.json(
      { error: "body or deleted is required" },
      { status: 400 }
    );
  }

  const { data: existing, error: loadError } = await supabase
    .from("question_comments")
    .select("id, author_id, thread_id, deleted_at")
    .eq("id", commentId)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 400 });
  }
  if (!existing || existing.deleted_at) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  // Confirm comment belongs to this block's thread (when thread exists).
  const { data: thread, error: threadError } = await supabase
    .from("question_threads")
    .select("id, block_id")
    .eq("id", existing.thread_id)
    .maybeSingle();

  if (threadError) {
    return NextResponse.json({ error: threadError.message }, { status: 400 });
  }
  if (!thread || thread.block_id !== blockId) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  const isAuthor = existing.author_id === user.id;
  const isAdminOrMaster =
    isMaster(ctx.roleSlug) || ctx.roleSlug === "admin";

  if (deleted) {
    if (!isAuthor && !isAdminOrMaster) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const { data: updated, error } = await supabase
      .from("question_comments")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", commentId)
      .select("id, thread_id, org_id, author_id, author_label, body, created_at, edited_at, deleted_at")
      .single();

    if (error) {
      if (isRlsForbidden(error)) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ comment: updated });
  }

  // Edit body: author only
  if (!isAuthor) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const newBody = (payload.body as string).trim();
  if (!newBody) {
    return NextResponse.json({ error: "body must not be empty" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("question_comments")
    .update({
      body: newBody,
      edited_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .select("id, thread_id, org_id, author_id, author_label, body, created_at, edited_at, deleted_at")
    .single();

  if (error) {
    if (isRlsForbidden(error)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ comment: updated });
}
