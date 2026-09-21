"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCollaboration } from "@/components/CollaborationContext";
import { getBlock } from "@/lib/brsr/blockIndex";
import { useThreads } from "../hooks/useThreads";

type Props = {
  orgId: string;
  reportingYear: string;
};

export function InboxClient({ orgId, reportingYear }: Props) {
  const { summaries, refresh } = useThreads(orgId, reportingYear);
  const { openThread } = useCollaboration();

  const items = useMemo(() => {
    return Object.entries(summaries)
      .map(([blockId, summary]) => ({
        blockId,
        summary,
        block: getBlock(blockId),
      }))
      .filter(
        (item) =>
          item.summary.commentCount > 0 ||
          item.summary.unreadCount > 0 ||
          item.summary.hasNote ||
          item.summary.attachmentCount > 0
      )
      .sort((a, b) => {
        if (a.summary.unreadCount !== b.summary.unreadCount) {
          return b.summary.unreadCount - a.summary.unreadCount;
        }
        return b.summary.commentCount - a.summary.commentCount;
      });
  }, [summaries]);

  const unreadTotal = items.reduce((n, i) => n + i.summary.unreadCount, 0);
  const notesTotal = items.filter((i) => i.summary.hasNote).length;
  const attachTotal = items.reduce((n, i) => n + i.summary.attachmentCount, 0);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--ink)]">My inbox</h1>
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">
          Threads across your assigned questions.{" "}
          <Link href="/dashboard" className="font-semibold text-[var(--brand)] hover:underline">
            Back to questionnaire
          </Link>
        </p>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
          <p className="text-[12px] font-semibold text-[var(--text-muted)]">Unread threads</p>
          <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{unreadTotal}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
          <p className="text-[12px] font-semibold text-[var(--text-muted)]">Blocks with notes</p>
          <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{notesTotal}</p>
        </div>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
          <p className="text-[12px] font-semibold text-[var(--text-muted)]">Attachments</p>
          <p className="mt-1 text-2xl font-bold text-[var(--ink)]">{attachTotal}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => refresh()}
        className="mb-4 text-[12px] font-semibold text-[var(--brand)] hover:underline"
      >
        Refresh
      </button>

      {items.length === 0 ? (
        <p className="text-[13px] text-[var(--text-muted)]">No active threads yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map(({ blockId, summary, block }) => (
            <li key={blockId}>
              <button
                type="button"
                onClick={() => openThread(blockId)}
                className="flex w-full items-start justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-left hover:border-[var(--border)] hover:bg-[var(--surface-2)]"
              >
                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[var(--ink)]">
                    {block?.label ?? blockId}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
                    {summary.commentCount} comment{summary.commentCount === 1 ? "" : "s"}
                    {summary.hasNote ? " · has note" : ""}
                    {summary.attachmentCount > 0
                      ? ` · ${summary.attachmentCount} attachment(s)`
                      : ""}
                    {summary.resolved ? " · resolved" : ""}
                  </p>
                </div>
                {summary.unreadCount > 0 && (
                  <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] px-1.5 text-[10px] font-bold text-white">
                    {summary.unreadCount}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
