"use client";

import { PanelHeader } from "@/components/panel/PanelHeader";
import { useEffect, useState } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { NGRBC_PRINCIPLE_TITLES } from "@/lib/brsr/questionConfig";
import { P1EssentialContent, P1LeadershipContent } from "./PanelPrinciple1";
import { P2EssentialContent, P2LeadershipContent } from "./PanelPrinciple2";
import { P3EssentialContent, P3LeadershipContent } from "./PanelPrinciple3";
import { P4EssentialContent, P4LeadershipContent } from "./PanelPrinciple4";
import { P5EssentialContent, P5LeadershipContent } from "./PanelPrinciple5";
import { P6EssentialContent, P6LeadershipContent } from "./PanelPrinciple6";
import { P7EssentialContent, P7LeadershipContent } from "./PanelPrinciple7";
import { P8EssentialContent, P8LeadershipContent } from "./PanelPrinciple8";
import { P9EssentialContent, P9LeadershipContent } from "./PanelPrinciple9";

type Props = {
  principleNum: number;
  values: AnswersState;
  calcDisplay?: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
};

type Tab = "essential" | "leadership";

function TabBar({
  activeTab,
  onChange,
  hasEssential,
  hasLeadership,
}: {
  activeTab: Tab;
  onChange: (t: Tab) => void;
  hasEssential: boolean;
  hasLeadership: boolean;
}) {
  const tabs: { key: Tab; label: string; has: boolean }[] = [
    { key: "essential", label: "Essential indicators", has: hasEssential },
    { key: "leadership", label: "Leadership indicators", has: hasLeadership },
  ];
  return (
    <div className="mt-4 inline-flex w-fit gap-1 rounded-full bg-[var(--surface-3)] p-1">
      {tabs.map(({ key, label, has }) =>
        has ? (
          <button
            key={key}
            type="button"
            data-testid={`tab-${key}`}
            onClick={() => onChange(key)}
            className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold ${
              activeTab === key
                ? "bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ) : null
      )}
    </div>
  );
}

type ContentProps = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
};

function PrincipleContent({
  principleNum,
  tab,
  values,
  calcDisplay,
  onChange,
  allowedSet,
  reportingYear,
}: ContentProps & { principleNum: number; tab: Tab }) {
  const p: ContentProps = { values, calcDisplay, onChange, allowedSet, reportingYear };
  if (tab === "essential") {
    switch (principleNum) {
      case 1: return <P1EssentialContent {...p} />;
      case 2: return <P2EssentialContent {...p} />;
      case 3: return <P3EssentialContent {...p} />;
      case 4: return <P4EssentialContent {...p} />;
      case 5: return <P5EssentialContent {...p} />;
      case 6: return <P6EssentialContent {...p} />;
      case 7: return <P7EssentialContent {...p} />;
      case 8: return <P8EssentialContent {...p} />;
      case 9: return <P9EssentialContent {...p} />;
    }
  } else {
    switch (principleNum) {
      case 1: return <P1LeadershipContent {...p} />;
      case 2: return <P2LeadershipContent {...p} />;
      case 3: return <P3LeadershipContent {...p} />;
      case 4: return <P4LeadershipContent {...p} />;
      case 5: return <P5LeadershipContent {...p} />;
      case 6: return <P6LeadershipContent {...p} />;
      case 7: return <P7LeadershipContent {...p} />;
      case 8: return <P8LeadershipContent {...p} />;
      case 9: return <P9LeadershipContent {...p} />;
    }
  }
  return null;
}

export function PanelPrinciple({
  principleNum,
  values,
  calcDisplay = {},
  onChange,
  allowedSet = null,
  reportingYear,
}: Props) {
  const prefix = `p${principleNum}`;
  const hasEssential =
    allowedSet === null || Array.from(allowedSet).some((c) => c.startsWith(`${prefix}_e`));
  const hasLeadership =
    allowedSet === null || Array.from(allowedSet).some((c) => c.startsWith(`${prefix}_l`));

  const defaultTab: Tab = hasEssential ? "essential" : "leadership";
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  useEffect(() => {
    if (!hasEssential && activeTab === "essential") setActiveTab("leadership");
    else if (!hasLeadership && activeTab === "leadership") setActiveTab("essential");
  }, [hasEssential, hasLeadership, activeTab]);

  const notesCode = `p${principleNum}_notes`;
  const v = (code: string) => values[code] ?? "";
  const show = (code: string) => allowedSet === null || allowedSet.has(code);
  const title = NGRBC_PRINCIPLE_TITLES[principleNum] ?? "";

  const notesValue = v(notesCode);
  const [notesOpen, setNotesOpen] = useState(() => notesValue.trim().length > 0);
  const notesField = show(notesCode) ? (
    <details
      key={notesCode}
      className="mt-8 border-t border-[var(--border-soft)] pt-6"
      open={notesOpen}
      onToggle={(e) => setNotesOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer text-sm font-medium text-[var(--text)]">
        BRSR narrative notes (exports with the report)
      </summary>
      <textarea
        value={notesValue}
        onChange={(e) => onChange(notesCode, e.target.value)}
        placeholder="Additional narrative for this principle"
        rows={4}
        className="mt-2 w-full max-w-2xl rounded border border-gray-300 px-3 py-2 text-sm"
      />
    </details>
  ) : null;

  const p6Note =
    principleNum === 6 ? (
      <p className="mt-1 text-xs text-slate-400">
        Revenue and PPP-adjusted revenue fields below are auto-filled from General Data when you enter turnover and PPP factor there.
      </p>
    ) : null;

  return (
    <section>
      <PanelHeader title={`Principle ${principleNum}`} subtitle={title} />
      {p6Note}
      <TabBar
        activeTab={activeTab}
        onChange={setActiveTab}
        hasEssential={hasEssential}
        hasLeadership={hasLeadership}
      />
      <div className="app-qblocks mt-6">
        {((activeTab === "essential" && !hasEssential) ||
          (activeTab === "leadership" && !hasLeadership)) ? (
          <p data-testid="tab-no-questions" className="text-sm text-gray-400">
            No questions assigned for this section.
          </p>
        ) : (
          <PrincipleContent
            principleNum={principleNum}
            tab={activeTab}
            values={values}
            calcDisplay={calcDisplay}
            onChange={onChange}
            allowedSet={allowedSet}
            reportingYear={reportingYear}
          />
        )}
      </div>
      {notesField}
    </section>
  );
}
