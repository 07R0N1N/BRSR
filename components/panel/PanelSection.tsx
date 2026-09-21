"use client";

import { useMemo, useState, type ReactNode } from "react";
import { usePanelAnswersOptional } from "./AnswersContext";
import { PanelSectionProvider, usePanelSectionBlocks } from "./PanelSectionContext";
import { computeSectionProgress } from "./sectionProgress";

type Props = {
  /** Roman numeral or section number label, e.g. "I" or "1" */
  label?: string;
  title: string;
  children: ReactNode;
  /** Start expanded (default true). */
  defaultOpen?: boolean;
  className?: string;
};

function SectionProgressMeta() {
  const blockIds = usePanelSectionBlocks();
  const answersCtx = usePanelAnswersOptional();
  const progress = useMemo(() => {
    if (!answersCtx || blockIds.length === 0) return null;
    return computeSectionProgress(blockIds, answersCtx.answers);
  }, [answersCtx, blockIds]);

  if (!progress || progress.total === 0) return null;

  return (
    <span className="text-[12px] font-semibold text-[var(--text-muted)]">
      {progress.answered} of {progress.total} answered
    </span>
  );
}

function PanelSectionInner({
  label,
  title,
  children,
  defaultOpen = true,
  className = "",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className={`panel-section mt-6 border-t border-[var(--border-soft)] pt-5 first:mt-5 first:border-t-0 first:pt-0 ${className}`}>
      <button
        type="button"
        className="panel-section__head flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <h2 className="text-[15px] font-bold text-[var(--ink)]">
          {label != null && (
            <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--teal)]">
              {label}
            </span>
          )}
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-2">
          <SectionProgressMeta />
          <span
            className="text-[var(--text-muted)] transition-transform duration-150"
            style={{ transform: open ? undefined : "rotate(-90deg)" }}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>
      {open && <div className="panel-section__body mt-4 space-y-3.5">{children}</div>}
    </section>
  );
}

export function PanelSection(props: Props) {
  return (
    <PanelSectionProvider>
      <PanelSectionInner {...props} />
    </PanelSectionProvider>
  );
}
