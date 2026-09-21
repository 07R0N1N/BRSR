"use client";

import { useCallback, useState } from "react";
import {
  uploaderDisplayLabel,
  type AttachmentRow,
} from "@/lib/collaboration/attachments";

export type AttachmentListItem = Pick<
  AttachmentRow,
  "id" | "file_name" | "mime_type" | "size_bytes" | "uploaded_by" | "uploader_label" | "created_at"
>;

type Props = {
  orgId: string;
  reportingYear: string;
  blockId: string;
  attachments: AttachmentListItem[];
  onAttachmentsChange?: (attachments: AttachmentListItem[]) => void;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentList({
  orgId,
  reportingYear,
  blockId,
  attachments,
  onAttachmentsChange,
}: Props) {
  const [items, setItems] = useState(attachments);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncItems = useCallback(
    (next: AttachmentListItem[]) => {
      setItems(next);
      onAttachmentsChange?.(next);
    },
    [onAttachmentsChange]
  );

  async function handleUpload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("org_id", orgId);
      form.append("reporting_year", reportingYear);
      form.append("block_id", blockId);

      const res = await fetch("/api/attachments", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      const attachment = data.attachment as AttachmentListItem;
      syncItems([...items, attachment]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(id: string) {
    setError(null);
    const res = await fetch(`/api/attachments/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Download failed");
      return;
    }
    window.open(data.url as string, "_blank", "noopener,noreferrer");
  }

  async function handleDelete(id: string) {
    setError(null);
    const res = await fetch(`/api/attachments/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Delete failed");
      return;
    }
    syncItems(items.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded border border-[var(--border)] px-2 py-1 text-xs text-[var(--ink-muted)] hover:bg-[var(--surface-2)]">
          {uploading ? "Uploading…" : "Add file"}
          <input
            type="file"
            className="hidden"
            disabled={uploading}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.csv,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleUpload(file);
              e.target.value = "";
            }}
          />
        </label>
        <span className="text-xs text-[var(--ink-muted)]">Max 10 MB</span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {items.length === 0 ? (
        <p className="text-xs text-[var(--ink-muted)]">No attachments yet.</p>
      ) : (
        <ul className="space-y-1">
          {items.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-2 rounded border border-[var(--border)] px-2 py-1 text-xs"
            >
              <button
                type="button"
                className="truncate text-left text-[var(--ink)] hover:underline"
                onClick={() => void handleDownload(a.id)}
                title={uploaderDisplayLabel(a)}
              >
                {a.file_name}
              </button>
              <span className="shrink-0 text-[var(--ink-muted)]" title={uploaderDisplayLabel(a)}>
                {formatBytes(a.size_bytes)}
              </span>
              <button
                type="button"
                className="shrink-0 text-[var(--ink-muted)] hover:text-red-500"
                onClick={() => void handleDelete(a.id)}
                aria-label={`Delete ${a.file_name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
