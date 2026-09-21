"use client";

import { useCallback, useEffect, useState } from "react";

export type ThreadAuthor = {
  id: string;
  email: string | null;
  display_name: string | null;
};

export type ThreadComment = {
  id: string;
  thread_id: string;
  org_id: string;
  author_id: string | null;
  author_label?: string | null;
  body: string;
  created_at: string;
  edited_at: string | null;
};

export type ThreadRow = {
  id: string | null;
  org_id: string;
  reporting_year: string;
  block_id: string;
  panel_id: string;
  question_code: string;
  note_body: string | null;
  note_updated_by: string | null;
  note_updated_at: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string | null;
};

type ThreadDetailResponse = {
  thread: ThreadRow;
  comments: ThreadComment[];
  authors: Record<string, ThreadAuthor>;
  attachments?: ThreadAttachment[];
  virtual: boolean;
};

export type ThreadAttachment = {
  id: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string | null;
  uploader_label?: string | null;
  created_at: string;
  comment_id?: string | null;
};

async function uploadAttachment(params: {
  file: File;
  orgId: string;
  reportingYear: string;
  blockId: string;
  commentId?: string;
}): Promise<{ ok: true; attachment: ThreadAttachment } | { ok: false; error: string }> {
  const form = new FormData();
  form.append("file", params.file);
  form.append("org_id", params.orgId);
  form.append("reporting_year", params.reportingYear);
  form.append("block_id", params.blockId);
  if (params.commentId) form.append("comment_id", params.commentId);

  const res = await fetch("/api/attachments", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, error: (data.error as string) ?? "Upload failed" };
  }
  return { ok: true, attachment: data.attachment as ThreadAttachment };
}

export function useThread(
  blockId: string | null,
  orgId: string,
  reportingYear: string,
  onMutated?: () => void
) {
  const [thread, setThread] = useState<ThreadRow | null>(null);
  const [comments, setComments] = useState<ThreadComment[]>([]);
  const [authors, setAuthors] = useState<Record<string, ThreadAuthor>>({});
  const [attachments, setAttachments] = useState<ThreadAttachment[]>([]);
  const [virtual, setVirtual] = useState(true);
  const [loading, setLoading] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [resolving, setResolving] = useState(false);

  const refresh = useCallback(async () => {
    if (!blockId) {
      setThread(null);
      setComments([]);
      setAuthors({});
      setAttachments([]);
      setVirtual(true);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        org_id: orgId,
        reporting_year: reportingYear,
      });
      const res = await fetch(
        `/api/threads/${encodeURIComponent(blockId)}?${params.toString()}`
      );
      const data = (await res.json().catch(() => ({}))) as ThreadDetailResponse & {
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "Failed to load thread");
      setThread(data.thread);
      setComments(data.comments ?? []);
      setAuthors(data.authors ?? {});
      setAttachments(data.attachments ?? []);
      setVirtual(Boolean(data.virtual));
    } catch {
      setThread(null);
      setComments([]);
      setAuthors({});
      setAttachments([]);
      setVirtual(true);
    } finally {
      setLoading(false);
    }
  }, [blockId, orgId, reportingYear]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const postComment = useCallback(
    async (body: string) => {
      if (!blockId || !body.trim()) return null;
      const res = await fetch(`/api/threads/${encodeURIComponent(blockId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, reporting_year: reportingYear, body: body.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Failed to post comment");
      return data.comment as ThreadComment;
    },
    [blockId, orgId, reportingYear]
  );

  const postCommentWithAttachments = useCallback(
    async (body: string, files: File[]) => {
      if (!blockId) return false;
      const trimmed = body.trim();
      if (!trimmed && files.length === 0) return false;

      setPostingComment(true);
      try {
        let commentId: string | undefined;
        if (trimmed) {
          const comment = await postComment(trimmed);
          if (!comment) return false;
          commentId = comment.id;
        } else if (files.length > 0) {
          const comment = await postComment("(attachment)");
          if (!comment) return false;
          commentId = comment.id;
        }

        const failed: string[] = [];
        for (const file of files) {
          const result = await uploadAttachment({
            file,
            orgId,
            reportingYear,
            blockId,
            commentId,
          });
          if (!result.ok) failed.push(`${file.name}: ${result.error}`);
        }

        await refresh();
        onMutated?.();
        return failed.length === 0;
      } catch {
        return false;
      } finally {
        setPostingComment(false);
      }
    },
    [blockId, orgId, reportingYear, postComment, refresh, onMutated]
  );

  const saveNote = useCallback(
    async (noteBody: string) => {
      if (!blockId) return false;
      setSavingNote(true);
      try {
        const res = await fetch(`/api/threads/${encodeURIComponent(blockId)}/note`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            org_id: orgId,
            reporting_year: reportingYear,
            note_body: noteBody,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Failed to save note");
        if (data.thread) setThread(data.thread as ThreadRow);
        onMutated?.();
        return true;
      } catch {
        return false;
      } finally {
        setSavingNote(false);
      }
    },
    [blockId, orgId, reportingYear, onMutated]
  );

  const markRead = useCallback(async () => {
    if (!blockId) return;
    try {
      await fetch(`/api/threads/${encodeURIComponent(blockId)}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ org_id: orgId, reporting_year: reportingYear }),
      });
      onMutated?.();
    } catch {
      /* non-blocking */
    }
  }, [blockId, orgId, reportingYear, onMutated]);

  const setResolved = useCallback(
    async (resolved: boolean) => {
      if (!blockId) return false;
      setResolving(true);
      try {
        const res = await fetch(`/api/threads/${encodeURIComponent(blockId)}/resolve`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ org_id: orgId, reporting_year: reportingYear, resolved }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Failed to update resolve state");
        if (data.thread) setThread(data.thread as ThreadRow);
        onMutated?.();
        return true;
      } catch {
        return false;
      } finally {
        setResolving(false);
      }
    },
    [blockId, orgId, reportingYear, onMutated]
  );

  return {
    thread,
    comments,
    authors,
    attachments,
    setAttachments,
    virtual,
    loading,
    savingNote,
    postingComment,
    resolving,
    refresh,
    postComment,
    postCommentWithAttachments,
    saveNote,
    markRead,
    setResolved,
  };
}
