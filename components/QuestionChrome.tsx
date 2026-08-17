"use client";

import type { ReactNode } from "react";

type Props = {
  /** Optional title shown in the card header. Omit when the child already renders its own heading. */
  title?: ReactNode;
  /** Reserved for future notes / attachments / authorship controls. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  "data-testid"?: string;
};

/**
 * Per-question chrome: title row + optional actions slot + body.
 * Used to wrap questionnaire blocks without rewriting table markup.
 * Actions stay empty for now so notes/files/avatar can land later without a layout rewrite.
 */
export function QuestionChrome({
  title,
  actions,
  children,
  className = "",
  "data-testid": testId,
}: Props) {
  return (
    <div
      data-testid={testId}
      className={`question-chrome rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface)] p-4 shadow-[var(--shadow-sm)] ${className}`}
    >
      {(title != null || actions != null) && (
        <div className="question-chrome__head mb-3 flex items-start justify-between gap-3">
          {title != null ? (
            <div className="question-chrome__title min-w-0 text-sm font-bold leading-snug text-[var(--ink)]">
              {title}
            </div>
          ) : (
            <span />
          )}
          <div className="question-chrome__actions flex shrink-0 gap-1.5">{actions}</div>
        </div>
      )}
      <div className="question-chrome__body">{children}</div>
    </div>
  );
}
