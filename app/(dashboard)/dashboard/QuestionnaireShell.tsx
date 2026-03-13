"use client";

import { useEffect, useMemo, useState } from "react";
import type { PanelId } from "@/lib/brsr/types";
import { PANELS, getQuestionCodesForPanel } from "@/lib/brsr/questionConfig";
import { runCalculations } from "@/lib/brsr/calcEngine";
import { REPORTING_YEARS } from "@/lib/brsr/constants";
import { useAnswers } from "./hooks/useAnswers";
import { PanelGeneralData } from "./panels/PanelGeneralData";
import { PanelGeneral } from "./panels/PanelGeneral";
import { PanelSectionB } from "./panels/PanelSectionB";
import { PanelPrinciple } from "./panels/PanelPrinciple";

export function QuestionnaireShell({
  orgId,
  canViewAll,
  allowedQuestionCodes,
}: {
  orgId: string;
  canViewAll?: boolean;
  allowedQuestionCodes?: string[] | null;
}) {
  const [reportingYear, setReportingYear] = useState(REPORTING_YEARS[0]);
  const [activePanel, setActivePanel] = useState<PanelId>("generaldata");

  const allowedSet = useMemo(
    () => (!canViewAll && Array.isArray(allowedQuestionCodes) ? new Set(allowedQuestionCodes) : null),
    [allowedQuestionCodes, canViewAll]
  );

  const { answers, loading, saving, onChange } = useAnswers({ orgId, reportingYear, allowedSet });

  const visiblePanels = PANELS.filter(
    (panel) => !allowedSet || getQuestionCodesForPanel(panel.id).some((code) => allowedSet.has(code))
  );

  useEffect(() => {
    if (visiblePanels.length === 0) return;
    if (!visiblePanels.some((panel) => panel.id === activePanel)) {
      setActivePanel(visiblePanels[0].id);
    }
  }, [activePanel, visiblePanels]);

  const calcDisplay = runCalculations(answers);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-400">Loading…</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full">
      <aside className="w-56 shrink-0 border-r border-[#334155] bg-[#1a202c] p-3">
        <div className="mb-4">
          <label className="block text-xs font-medium uppercase text-gray-400">Reporting year</label>
          <select
            value={reportingYear}
            onChange={(e) => setReportingYear(e.target.value)}
            className="mt-1 w-full rounded border border-[#334155] bg-[#2d3748] px-2 py-1.5 text-sm text-white"
          >
            {REPORTING_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {["General Data", "Section A", "Section B", "Section C – Principles"].map((group) => (
          <div key={group} className="mb-3">
            <h2 className="text-xs font-semibold uppercase text-gray-400">{group}</h2>
            <ul className="mt-1 space-y-0.5">
              {visiblePanels.filter((p) => p.group === group).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setActivePanel(p.id)}
                    className={`w-full rounded px-2 py-1.5 text-left text-sm ${
                      activePanel === p.id
                        ? "bg-blue-600 font-medium text-white"
                        : "text-gray-300 hover:bg-[#2d3748]"
                    }`}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {saving && <p className="mt-2 text-xs text-gray-500">Saving…</p>}
      </aside>
      <div className="brsr-dark min-w-0 flex-1 overflow-auto bg-[#0a0f12] p-6">
        {visiblePanels.length === 0 && (
          <p className="text-sm text-gray-400">No questions assigned. Contact your administrator.</p>
        )}
        {visiblePanels.length > 0 && allowedSet && (
          <p className="mb-4 text-sm text-slate-400">You can view and update only assigned questions.</p>
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
          />
        )}
      </div>
    </div>
  );
}
