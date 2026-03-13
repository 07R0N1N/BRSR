"use client";

import { useState } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import type { PanelId } from "@/lib/brsr/types";
import { getQuestionCodesForPanel, NGRBC_PRINCIPLE_TITLES } from "@/lib/brsr/questionConfig";
import { getPrincipleTemplate } from "@/lib/brsr/principleTemplates";
import { P6EssentialContent, P6LeadershipContent } from "./PanelPrinciple6";
import { LegacyPrincipleRenderer } from "./LegacyPrincipleRenderer";

type Props = {
  principleNum: number;
  values: AnswersState;
  calcDisplay?: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

type Tab = "essential" | "leadership";

function TabBar({ activeTab, onChange }: { activeTab: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="mt-4 flex gap-2 border-b border-gray-200">
      {(["essential", "leadership"] as Tab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={`border-b-2 px-3 py-2 text-sm font-medium capitalize ${
            activeTab === tab
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab === "essential" ? "Essential indicators" : "Leadership indicators"}
        </button>
      ))}
    </div>
  );
}

export function PanelPrinciple({
  principleNum,
  values,
  calcDisplay = {},
  onChange,
  allowedSet = null,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("essential");
  const panelId: PanelId = `p${principleNum}` as PanelId;
  const codes = getQuestionCodesForPanel(panelId).filter((c) => !c.endsWith("_notes"));
  const notesCode = `p${principleNum}_notes`;
  const v = (code: string) => values[code] ?? "";
  const show = (code: string) => allowedSet === null || allowedSet.has(code);
  const title = NGRBC_PRINCIPLE_TITLES[principleNum] ?? "";

  const notesField = show(notesCode) ? (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <label className="block text-sm font-medium text-gray-700">Notes (narrative)</label>
      <textarea
        value={v(notesCode)}
        onChange={(e) => onChange(notesCode, e.target.value)}
        placeholder="Additional narrative for this principle"
        rows={4}
        className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-3 py-2 text-sm"
      />
    </div>
  ) : null;

  // ---- Principle 6: custom JSX rendering ----
  if (principleNum === 6 && codes.length > 0) {
    return (
      <section>
        <h1 className="text-2xl font-bold text-gray-900">Principle 6: Environment</h1>
        <p className="mt-1 text-sm font-semibold text-teal-400">{title}</p>
        <p className="mt-1 text-xs text-slate-400">
          Revenue and PPP-adjusted revenue fields below are auto-filled from General Data when you enter turnover and PPP factor there.
        </p>
        <TabBar activeTab={activeTab} onChange={setActiveTab} />
        {activeTab === "essential" && (
          <div className="mt-6 space-y-8">
            <P6EssentialContent values={values} calcDisplay={calcDisplay} onChange={onChange} allowedSet={allowedSet} />
          </div>
        )}
        {activeTab === "leadership" && (
          <div className="mt-6 space-y-6">
            <P6LeadershipContent values={values} onChange={onChange} allowedSet={allowedSet} />
          </div>
        )}
        {notesField}
      </section>
    );
  }

  // ---- Principles 1-5 and 7-9: HTML template rendering ----
  const hasReferenceTemplate = principleNum !== 6 && getPrincipleTemplate(principleNum) !== null;
  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">Principle {principleNum}</h1>
      <p className="mt-1 text-sm font-semibold text-teal-400">{title}</p>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />

      {hasReferenceTemplate ? (
        <LegacyPrincipleRenderer
          principleNum={principleNum}
          activeTab={activeTab}
          values={values}
          onChange={onChange}
          allowedSet={allowedSet}
        />
      ) : (
        <div className="mt-6 space-y-3">
          {codes
            .filter((c) => (activeTab === "essential" ? c.includes("_e") : c.includes("_l")))
            .filter((c) => show(c))
            .map((code) => (
              <div key={code} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{code.replace(/^p\d+_/, "")}</label>
                <input
                  type="text"
                  value={v(code)}
                  onChange={(e) => onChange(code, e.target.value)}
                  className="max-w-md rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            ))}
        </div>
      )}

      {notesField}
    </section>
  );
}
