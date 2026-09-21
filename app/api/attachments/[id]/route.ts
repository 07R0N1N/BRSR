import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { isMaster } from "@/lib/auth/accessPolicy";
import { ATTACHMENTS_BUCKET } from "@/lib/collaboration/attachments";
import { isRlsForbidden } from "@/lib/collaboration/threads";

type RouteContext = { params: { id: string } };

/**
 * GET /api/attachments/[id]
 * Returns a short-lived signed URL for download.
 */
export async function GET(_request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase } = access;

  const { data: row, error: loadError } = await supabase
    .from("question_attachments")
    .select("id, storage_path, file_name, mime_type, size_bytes")
    .eq("id", context.params.id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 400 });
  }
  if (!row) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(row.storage_path as string, 60);

  if (signError || !signed?.signedUrl) {
    return NextResponse.json(
      { error: signError?.message ?? "Failed to create signed URL" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    url: signed.signedUrl,
    file_name: row.file_name,
    mime_type: row.mime_type,
    size_bytes: row.size_bytes,
  });
}

/**
 * DELETE /api/attachments/[id]
 * Uploader, admin, or master may delete storage object + metadata row.
 */
export async function DELETE(_request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user, ctx } = access;

  const { data: row, error: loadError } = await supabase
    .from("question_attachments")
    .select("id, storage_path, uploaded_by")
    .eq("id", context.params.id)
    .maybeSingle();

  if (loadError) {
    return NextResponse.json({ error: loadError.message }, { status: 400 });
  }
  if (!row) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }

  const isUploader = row.uploaded_by === user.id;
  const isAdminOrMaster = isMaster(ctx.roleSlug) || ctx.roleSlug === "admin";
  if (!isUploader && !isAdminOrMaster) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const storagePath = row.storage_path as string;
  const { error: storageError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .remove([storagePath]);

  if (storageError) {
    return NextResponse.json({ error: storageError.message }, { status: 400 });
  }

  const { error: deleteError } = await supabase
    .from("question_attachments")
    .delete()
    .eq("id", context.params.id);

  if (deleteError) {
    if (isRlsForbidden(deleteError)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
