"use client";

import { useEffect, useMemo, useState } from "react";
import type { PanelId } from "@/lib/brsr/types";
import { PANELS, getQuestionCodesForPanel } from "@/lib/brsr/questionConfig";
import { runCalculations } from "@/lib/brsr/calcEngine";
import { useAnswers } from "./hooks/useAnswers";
import { PanelGeneralData } from "./panels/PanelGeneralData";
import { PanelGeneral } from "./panels/PanelGeneral";
import { PanelSectionB } from "./panels/PanelSectionB";
import { PanelPrinciple } from "./panels/PanelPrinciple";

const PRINCIPLES_GROUP = "Section C – Principles";

type NavGroupId = "generaldata" | "general" | "sectionb" | "principles";

const ADMIN_GROUPS: { id: NavGroupId; label: string; panelId?: PanelId }[] = [
  { id: "generaldata", label: "General Data", panelId: "generaldata" },
  { id: "general", label: "Section A", panelId: "general" },
  { id: "sectionb", label: "Section B", panelId: "sectionb" },
  { id: "principles", label: "Principles" },
];

function groupForPanel(panelId: PanelId): NavGroupId {
  if (panelId === "generaldata") return "generaldata";
  if (panelId === "general") return "general";
  if (panelId === "sectionb") return "sectionb";
  return "principles";
}

function pillClass(active: boolean, small?: boolean) {
  return `rounded-full font-semibold ${small ? "px-3 py-1.5 text-[12.5px]" : "px-3.5 py-2 text-[13px]"} ${
    active
      ? "bg-[var(--brand)] text-white"
      : "bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)]"
  }`;
}

export function QuestionnaireShell({
  orgId,
  reportingYear,
  canViewAll,
  allowedQuestionCodes,
}: {
  orgId: string;
  reportingYear: string;
  canViewAll?: boolean;
  allowedQuestionCodes?: string[] | null;
}) {
  const [activePanel, setActivePanel] = useState<PanelId>("generaldata");

  const allowedSet = useMemo(
    () => (!canViewAll && Array.isArray(allowedQuestionCodes) ? new Set(allowedQuestionCodes) : null),
    [allowedQuestionCodes, canViewAll]
  );

  const isContributor = allowedSet !== null;

  const { answers, loading, saving, onChange } = useAnswers({ orgId, reportingYear, allowedSet });

  const visiblePanels = PANELS.filter(
    (panel) => !allowedSet || getQuestionCodesForPanel(panel.id).some((code) => allowedSet.has(code))
  );

  const visiblePrinciples = visiblePanels.filter((p) => p.group === PRINCIPLES_GROUP);
  const activeGroup = groupForPanel(activePanel);

  useEffect(() => {
    if (visiblePanels.length === 0) return;
    if (!visiblePanels.some((panel) => panel.id === activePanel)) {
      setActivePanel(visiblePanels[0].id);
    }
  }, [activePanel, visiblePanels]);

  const calcDisplay = runCalculations(answers);

  function selectAdminGroup(groupId: NavGroupId) {
    if (groupId === "principles") {
      const first =
        visiblePrinciples.find((p) => p.id === activePanel) ??
        visiblePrinciples[0] ??
        PANELS.find((p) => p.group === PRINCIPLES_GROUP);
      if (first) setActivePanel(first.id);
      return;
    }
    const meta = ADMIN_GROUPS.find((g) => g.id === groupId);
    if (meta?.panelId) setActivePanel(meta.panelId);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-[var(--text-muted)]">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col gap-4">
      <nav
        data-testid="sidebar"
        className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] px-[18px] py-4 shadow-[var(--shadow-sm)]"
      >
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-bold text-[var(--ink)]">
              {isContributor ? "My questions" : "Questionnaire"}
            </p>
            {visiblePanels.length > 0 && isContributor && (
              <p data-testid="restricted-banner" className="mt-1 text-[13px] text-[var(--text-muted)]">
                You can view and update only assigned questions.
              </p>
            )}
            {!isContributor && (
              <p className="mt-1 text-[13px] text-[var(--text-muted)]">
                Navigate by section. Principles open a second row.
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {saving && <p className="text-xs font-semibold text-[var(--text-muted)]">Saving…</p>}
            <div className="rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Reporting year
              </p>
              <p data-testid="reporting-year-value" className="text-[13px] font-bold text-[var(--ink)]">
                {reportingYear}
              </p>
            </div>
          </div>
        </div>

        {visiblePanels.length > 0 && isContributor && (
          <div className="flex flex-wrap gap-1.5">
            {visiblePanels.map((p) => (
              <button
                key={p.id}
                type="button"
                data-testid={`panel-${p.id}`}
                onClick={() => setActivePanel(p.id)}
                className={pillClass(activePanel === p.id)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {visiblePanels.length > 0 && !isContributor && (
          <>
            <div className="flex flex-wrap gap-1.5">
              {ADMIN_GROUPS.map((group) => {
                const active = activeGroup === group.id;
                const panelTestId = group.panelId ? `panel-${group.panelId}` : "nav-group-principles";
                return (
                  <button
                    key={group.id}
                    type="button"
                    data-testid={panelTestId}
                    onClick={() => selectAdminGroup(group.id)}
                    className={pillClass(active)}
                  >
                    {group.label}
                  </button>
                );
              })}
            </div>
            {activeGroup === "principles" && (
              <div className="mt-2.5 flex flex-wrap gap-1.5 border-t border-[var(--border-soft)] pt-2.5">
                {PANELS.filter((p) => p.group === PRINCIPLES_GROUP).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    data-testid={`panel-${p.id}`}
                    onClick={() => setActivePanel(p.id)}
                    className={pillClass(activePanel === p.id, true)}
                  >
                    {p.label.replace("Principle ", "P")}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </nav>

      <div className="app-panels min-w-0 flex-1 overflow-auto rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-6 shadow-[var(--shadow-sm)]">
        {visiblePanels.length === 0 && (
          <p data-testid="empty-assignments" className="text-sm text-[var(--text-muted)]">
            No questions assigned. Contact your administrator.
          </p>
        )}
        {visiblePanels.length > 0 && activePanel === "generaldata" && (
          <PanelGeneralData
            values={answers}
            calcDisplay={calcDisplay}
            onChange={onChange}
            allowedSet={allowedSet ?? undefined}
          />
        )}
        {visiblePanels.length > 0 && activePanel === "general" && (
          <PanelGeneral
            values={answers}
            calcDisplay={calcDisplay}
            onChange={onChange}
            allowedSet={allowedSet ?? undefined}
            reportingYear={reportingYear}
          />
        )}
        {visiblePanels.length > 0 && activePanel === "sectionb" && (
          <PanelSectionB values={answers} onChange={onChange} allowedSet={allowedSet ?? undefined} />
        )}
        {visiblePanels.length > 0 && activePanel.startsWith("p") && (
          <PanelPrinciple
            principleNum={parseInt(activePanel.slice(1), 10)}
            values={answers}
            calcDisplay={calcDisplay}
            onChange={onChange}
            allowedSet={allowedSet ?? undefined}
            reportingYear={reportingYear}
          />
        )}
      </div>
    </div>
  );
}
