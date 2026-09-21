import { randomUUID } from "crypto";

export const ATTACHMENTS_BUCKET = "brsr-attachments";

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

/** Mirrors storage.buckets.allowed_mime_types in migration 015. */
export const ALLOWED_ATTACHMENT_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export type AttachmentRow = {
  id: string;
  thread_id: string;
  org_id: string;
  question_code: string;
  storage_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string | null;
  uploader_label?: string | null;
  created_at: string;
  comment_id?: string | null;
};

export function safeFileName(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? "file";
  const cleaned = base.replace(/[^\w.\-() ]+/g, "_").trim();
  return (cleaned.slice(0, 200) || "file");
}

export function buildStoragePath(params: {
  orgId: string;
  reportingYear: string;
  blockId: string;
  fileName: string;
  fileId?: string;
}): string {
  const fileId = params.fileId ?? randomUUID();
  return `${params.orgId}/${params.reportingYear}/${params.blockId}/${fileId}-${safeFileName(params.fileName)}`;
}

export function isAllowedAttachmentMime(mime: string): boolean {
  return ALLOWED_ATTACHMENT_MIME_TYPES.has(mime);
}

export function attachmentPublicFields(row: AttachmentRow) {
  return {
    id: row.id,
    thread_id: row.thread_id,
    org_id: row.org_id,
    file_name: row.file_name,
    mime_type: row.mime_type,
    size_bytes: row.size_bytes,
    uploaded_by: row.uploaded_by,
    uploader_label: row.uploader_label ?? null,
    created_at: row.created_at,
    comment_id: row.comment_id ?? null,
  };
}

/** Display label for an uploader; appends (removed) when the user no longer exists. */
export function uploaderDisplayLabel(row: {
  uploaded_by: string | null;
  uploader_label?: string | null;
}): string {
  const base = (row.uploader_label ?? "").trim() || "Unknown";
  if (!row.uploaded_by) return `${base} (removed)`;
  return base;
}
