import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ATTACHMENTS_BUCKET,
  attachmentPublicFields,
  buildStoragePath,
  isAllowedAttachmentMime,
  MAX_ATTACHMENT_BYTES,
  type AttachmentRow,
} from "@/lib/collaboration/attachments";
import { ensureThreadRow, isRlsForbidden } from "@/lib/collaboration/threads";

/**
 * POST /api/attachments
 * multipart/form-data: file, org_id, reporting_year, block_id
 */
export async function POST(request: Request) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user } = access;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const org_id = formData.get("org_id");
  const reporting_year =
    typeof formData.get("reporting_year") === "string"
      ? (formData.get("reporting_year") as string).trim()
      : "";
  const block_id =
    typeof formData.get("block_id") === "string"
      ? (formData.get("block_id") as string).trim()
      : "";
  const comment_id =
    typeof formData.get("comment_id") === "string"
      ? (formData.get("comment_id") as string).trim()
      : null;

  if (!org_id || typeof org_id !== "string") {
    return NextResponse.json({ error: "org_id is required" }, { status: 400 });
  }
  if (!reporting_year) {
    return NextResponse.json({ error: "reporting_year is required" }, { status: 400 });
  }
  if (!block_id) {
    return NextResponse.json({ error: "block_id is required" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 400 });
  }

  const mimeType = file.type || "application/octet-stream";
  if (!isAllowedAttachmentMime(mimeType)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  const ensured = await ensureThreadRow(supabase, {
    orgId: org_id,
    reportingYear: reporting_year,
    blockId: block_id,
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

  const storagePath = buildStoragePath({
    orgId: org_id,
    reportingYear: reporting_year,
    blockId: block_id,
    fileName: file.name,
  });

  const bytes = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(storagePath, bytes, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data: inserted, error: insertError } = await supabase
    .from("question_attachments")
    .insert({
      thread_id: ensured.data.id,
      org_id,
      question_code: ensured.data.question_code,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: mimeType,
      size_bytes: file.size,
      uploaded_by: user.id,
      ...(comment_id ? { comment_id } : {}),
    })
    .select("*")
    .single();

  if (insertError) {
    // No metadata row yet → storage DELETE RLS (uploader join) cannot succeed.
    // Service role compensates so orphaned bytes are not left behind.
    try {
      await createAdminClient().storage.from(ATTACHMENTS_BUCKET).remove([storagePath]);
    } catch {
      /* best-effort; purge:attachments --reconcile will catch leftovers */
    }
    if (isRlsForbidden(insertError)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  return NextResponse.json({
    attachment: attachmentPublicFields(inserted as AttachmentRow),
  });
}
