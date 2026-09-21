"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AvatarChip, userLabel } from "@/components/Avatar";
import type { AnswerMeta, OrgMember } from "@/components/CollaborationContext";
import { getBlock } from "@/lib/brsr/blockIndex";
import { useThread, type ThreadAttachment } from "../hooks/useThread";

type Props = {
  orgId: string;
  reportingYear: string;
  roleSlug: string | null | undefined;
  open: boolean;
  onClose: () => void;
  activeBlockId: string | null;
  membersById: Record<string, OrgMember>;
  onRefreshSummaries: () => void;
};

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function isAdminRole(roleSlug: string | null | undefined): boolean {
  return roleSlug === "admin" || roleSlug === "master";
}

export function ChatPanel({
  orgId,
  reportingYear,
  roleSlug,
  open,
  onClose,
  activeBlockId,
  membersById,
  onRefreshSummaries,
}: Props) {
  const [commentDraft, setCommentDraft] = useState("");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const block = activeBlockId ? getBlock(activeBlockId) : undefined;
  const isAdmin = isAdminRole(roleSlug);

  const {
    thread,
    comments,
    authors,
    attachments,
    loading: threadLoading,
    postingComment,
    resolving,
    postCommentWithAttachments,
    markRead,
    setResolved,
  } = useThread(activeBlockId, orgId, reportingYear, onRefreshSummaries);

  useEffect(() => {
    if (!open || !activeBlockId) return;
    void markRead();
  }, [open, activeBlockId, markRead]);

  const attachmentsByComment = useMemo(() => {
    const map = new Map<string, ThreadAttachment[]>();
    for (const a of attachments) {
      if (!a.comment_id) continue;
      const list = map.get(a.comment_id) ?? [];
      list.push(a);
      map.set(a.comment_id, list);
    }
    return map;
  }, [attachments]);

  const handlePost = useCallback(async () => {
    const ok = await postCommentWithAttachments(commentDraft, pendingFiles);
    if (ok) {
      setCommentDraft("");
      setPendingFiles([]);
    }
  }, [commentDraft, pendingFiles, postCommentWithAttachments]);

  const handleDownload = useCallback(async (id: string) => {
    const res = await fetch(`/api/attachments/${id}`);
    const data = await res.json();
    if (res.ok && data.url) {
      window.open(data.url as string, "_blank", "noopener,noreferrer");
    }
  }, []);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 xl:hidden"
        aria-hidden
        onClick={onClose}
      />
      <aside
        data-testid="chat-panel"
        className="fixed inset-y-0 right-0 z-50 flex w-[min(100vw,340px)] flex-col border-l border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-md)] xl:static xl:z-auto xl:h-auto xl:min-h-[calc(100vh-100px)] xl:shrink-0 xl:shadow-none"
      >
        <header className="flex items-center justify-between border-b border-[var(--border-soft)] px-4 py-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
              Comments
            </p>
            <p className="text-[15px] font-bold text-[var(--ink)]">
              {block?.label ?? "Select a question"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat panel"
            className="inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {!activeBlockId ? (
            <p className="text-[13px] text-[var(--text-muted)]">
              Click the chat icon on a question to start a thread.
            </p>
          ) : threadLoading ? (
            <p className="text-[13px] text-[var(--text-muted)]">Loading…</p>
          ) : comments.length === 0 ? (
            <p className="text-[13px] text-[var(--text-muted)]">No comments yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {comments.map((comment) => {
                const profile = comment.author_id
                  ? authors[comment.author_id] ?? membersById[comment.author_id]
                  : undefined;
                const snap = (comment.author_label ?? "").trim();
                let label: string;
                if (profile) {
                  label = userLabel({ ...profile, id: comment.author_id! });
                } else if (snap) {
                  label = comment.author_id ? snap : `${snap} (removed)`;
                } else if (comment.author_id) {
                  label = comment.author_id.slice(0, 8);
                } else {
                  label = "Removed user";
                }
                const avatarSeed = comment.author_id ?? `removed:${snap || comment.id}`;
                const commentAttachments = attachmentsByComment.get(comment.id) ?? [];
                return (
                  <li
                    key={comment.id}
                    className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2.5"
                  >
                    <div className="mb-1.5 flex items-center gap-2">
                      <AvatarChip seed={avatarSeed} label={label} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-[var(--ink)]">{label}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">
                          {formatTime(comment.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="whitespace-pre-wrap text-[13px] text-[var(--ink)]">{comment.body}</p>
                    {commentAttachments.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {commentAttachments.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => void handleDownload(a.id)}
                            className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--ink)] hover:border-[var(--border)]"
                          >
                            📎 {a.file_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {activeBlockId && (
          <div className="border-t border-[var(--border-soft)] px-4 py-3">
            {isAdmin && thread && (
              <div className="mb-2">
                <button
                  type="button"
                  disabled={resolving}
                  onClick={() => void setResolved(!thread.resolved_at)}
                  className={`rounded-[var(--radius-sm)] border px-2.5 py-1 text-[11px] font-semibold ${
                    thread.resolved_at
                      ? "border-[var(--border-soft)] bg-[var(--surface-2)] text-[var(--ink)]"
                      : "border-[var(--brand)] bg-[var(--brand)] text-white"
                  }`}
                >
                  {thread.resolved_at ? "Reopen" : "Resolve"}
                </button>
              </div>
            )}
            {pendingFiles.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {pendingFiles.map((f, i) => (
                  <span
                    key={`${f.name}-${i}`}
                    className="inline-flex items-center gap-1 rounded-full border border-[var(--border-soft)] bg-[var(--surface-2)] px-2 py-0.5 text-[11px]"
                  >
                    {f.name}
                    <button
                      type="button"
                      aria-label={`Remove ${f.name}`}
                      className="text-[var(--text-muted)] hover:text-[var(--ink)]"
                      onClick={() =>
                        setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <textarea
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
              rows={3}
              placeholder="Write a comment…"
              className="w-full resize-y rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-2 text-[13px] text-[var(--ink)] placeholder:text-[var(--text-muted)] focus:border-[var(--brand)] focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-[var(--radius-sm)] border border-[var(--border-soft)] px-2.5 py-1 text-[12px] font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)]"
                >
                  Attach
                </button>
                <span className="text-[11px] text-[var(--text-muted)]">Max 10 MB</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.webp,.xlsx,.xls,.csv,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPendingFiles((prev) => [...prev, file]);
                    e.target.value = "";
                  }}
                />
              </div>
              <button
                type="button"
                disabled={
                  postingComment || (!commentDraft.trim() && pendingFiles.length === 0)
                }
                onClick={() => void handlePost()}
                className="rounded-[var(--radius-sm)] bg-[var(--brand)] px-3 py-1.5 text-[12px] font-semibold text-white disabled:opacity-50"
              >
                {postingComment ? "Posting…" : "Post"}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
