"use client";

import { useEffect, type ReactNode } from "react";
import { QuestionChrome } from "@/components/QuestionChrome";
import { AvatarStack, userLabel } from "@/components/Avatar";
import { useCollaboration } from "@/components/CollaborationContext";
import { InlineBlockNote } from "@/components/InlineBlockNote";
import { usePanelSectionRegister } from "@/components/panel/PanelSectionContext";
import { usePanelRuntime } from "@/components/panel/PanelRuntimeContext";
import { getBlock } from "@/lib/brsr/blockIndex";

type Props = {
  blockId: string;
  children: ReactNode;
  /** Optional override; defaults to the assignment-block label. */
  title?: ReactNode;
  className?: string;
  "data-testid"?: string;
  orgId?: string;
  reportingYear?: string;
  /** Show inline internal note on the card (default true when orgId set). */
  showInlineNote?: boolean;
};

/**
 * Per-assignment-block wrapper: anchor id + quiet chrome + optional inline note.
 * Chat UI lives in ChatPanel; this opens it via a single hover-revealed affordance.
 */
export function QuestionBlock({
  blockId,
  children,
  title,
  className = "",
  "data-testid": testId,
  orgId,
  reportingYear,
  showInlineNote,
}: Props) {
  const { threadSummaries, answerMeta, membersById, openThread, activeBlockId } =
    useCollaboration();
  const registerBlock = usePanelSectionRegister();
  const runtime = usePanelRuntime();
  const resolvedOrgId = orgId ?? runtime?.orgId;
  const resolvedReportingYear = reportingYear ?? runtime?.reportingYear;
  const block = getBlock(blockId);
  const summary = threadSummaries[blockId];
  const commentCount = summary?.commentCount ?? 0;
  const unreadCount = summary?.unreadCount ?? 0;
  const attachmentCount = summary?.attachmentCount ?? 0;
  const activityCount = commentCount + attachmentCount;
  const hasActivity = activityCount > 0 || (summary?.hasNote ?? false);

  useEffect(() => {
    if (!registerBlock) return;
    return registerBlock(blockId);
  }, [registerBlock, blockId]);

  const authors = (() => {
    if (!block) return [];
    const seen = new Map<string, string>();
    for (const code of block.questionCodes) {
      const uid = answerMeta[code]?.updated_by;
      if (!uid || seen.has(uid)) continue;
      const member = membersById[uid];
      seen.set(uid, member ? userLabel(member) : uid.slice(0, 8));
    }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
  })();

  const isActive = activeBlockId === blockId;
  const displayTitle = title ?? block?.label;

  const actions = (
    <div
      className={`flex items-center gap-1 transition-opacity ${
        hasActivity ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
      }`}
    >
      {authors.length > 0 && <AvatarStack people={authors} />}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          openThread(blockId);
        }}
        title={`${commentCount} comment(s), ${attachmentCount} attachment(s)`}
        aria-label="Open comments"
        className="relative inline-flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
      >
        <CommentIcon />
        {activityCount > 0 && (
          <span
            className={`absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${
              unreadCount > 0 ? "bg-[var(--brand)]" : "bg-[var(--text-muted)]"
            }`}
          >
            {unreadCount > 0 ? unreadCount : activityCount}
          </span>
        )}
      </button>
    </div>
  );

  const noteVisible =
    showInlineNote !== false &&
    resolvedOrgId != null &&
    resolvedReportingYear != null;

  return (
    <div
      id={`block-${blockId}`}
      className={`group question-block ${isActive ? "ring-2 ring-[var(--brand-50)]" : ""} ${
        hasActivity ? "has-activity" : ""
      }`}
      data-block-id={blockId}
    >
      <QuestionChrome
        title={displayTitle}
        actions={actions}
        className={className}
        data-testid={testId}
      >
        {children}
        {noteVisible && (
          <InlineBlockNote
            blockId={blockId}
            orgId={resolvedOrgId!}
            reportingYear={resolvedReportingYear!}
          />
        )}
      </QuestionChrome>
    </div>
  );
}

function CommentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
