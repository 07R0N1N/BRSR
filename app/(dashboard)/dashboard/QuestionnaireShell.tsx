"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PanelId } from "@/lib/brsr/types";
import type { AnswersState } from "@/lib/brsr/types";
import { PANELS, getQuestionCodesForPanel } from "@/lib/brsr/questionConfig";
import { runCalculations } from "@/lib/brsr/calcEngine";
import { flowGeneralDataToPrinciple6 } from "@/lib/brsr/flowGeneralDataToP6";
import { PanelGeneralData } from "./panels/PanelGeneralData";
import { PanelGeneral } from "./panels/PanelGeneral";
import { PanelSectionB } from "./panels/PanelSectionB";
import { PanelPrinciple } from "./panels/PanelPrinciple";

const REPORTING_YEARS = ["2024-25", "2023-24", "2022-23"];
const SAVE_DEBOUNCE_MS = 800;

export function QuestionnaireShell({ orgId }: { orgId: string }) {
  const [reportingYear, setReportingYear] = useState(REPORTING_YEARS[0]);
  const [activePanel, setActivePanel] = useState<PanelId>("generaldata");
  const [answers, setAnswers] = useState<AnswersState>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const answersRef = useRef<AnswersState>(answers);
  answersRef.current = answers;

  const load = useCallback(async () => {
    if (!orgId || !reportingYear) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/answers?org_id=${encodeURIComponent(orgId)}&reporting_year=${encodeURIComponent(reportingYear)}`
      );
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setAnswers(data.answers ?? {});
    } finally {
      setLoading(false);
    }
  }, [orgId, reportingYear]);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async () => {
    const current = answersRef.current;
    if (!orgId || !reportingYear) return;
    setSaving(true);
    try {
      const res = await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          org_id: orgId,
          reporting_year: reportingYear,
          answers: current,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
    } finally {
      setSaving(false);
    }
  }, [orgId, reportingYear]);

  const scheduleSave = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveTimeoutRef.current = null;
      save();
    }, SAVE_DEBOUNCE_MS);
  }, [save]);

  const onChange = useCallback(
    (questionCode: string, value: string) => {
      setAnswers((prev) => {
        const next = { ...prev, [questionCode]: value };
        const gdataKeys = ["gdata_turnover_cy", "gdata_turnover_py", "gdata_ppp_cy", "gdata_ppp_py"];
        if (gdataKeys.includes(questionCode)) {
          const p6Updates = flowGeneralDataToPrinciple6(next);
          Object.assign(next, p6Updates);
        }
        return next;
      });
      scheduleSave();
    },
    [scheduleSave]
  );

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
              {PANELS.filter((p) => p.group === group).map((p) => (
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
        {saving && (
          <p className="mt-2 text-xs text-gray-500">Saving…</p>
        )}
      </aside>
      <div className="brsr-dark min-w-0 flex-1 overflow-auto bg-[#0a0f12] p-6">
        {activePanel === "generaldata" && (
          <PanelGeneralData
            values={answers}
            calcDisplay={calcDisplay}
            onChange={onChange}
          />
        )}
        {activePanel === "general" && (
          <PanelGeneral
            values={answers}
            calcDisplay={calcDisplay}
            onChange={onChange}
          />
        )}
        {activePanel === "sectionb" && (
          <PanelSectionB values={answers} onChange={onChange} />
        )}
        {activePanel.startsWith("p") && (
          <PanelPrinciple
            principleNum={parseInt(activePanel.slice(1), 10)}
            values={answers}
            calcDisplay={calcDisplay}
            onChange={onChange}
          />
        )}
      </div>
    </div>
  );
}
