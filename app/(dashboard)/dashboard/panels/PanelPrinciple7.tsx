"use client";

import { useEffect } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { blockAllowed } from "@/lib/brsr/visibilityUtils";

const MAX_TABLE_ROWS = 20;
const MAX_L1_ROWS = 20;

const P7_L1_FIELDS = ["policy", "method", "freq", "public", "link"] as const;

const FREQUENCY_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Annually", label: "Annually" },
  { value: "Half Yearly", label: "Half Yearly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Any other", label: "Any other" },
];

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

const REACH_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "State", label: "State" },
  { value: "National", label: "National" },
  { value: "International", label: "International" },
];

function inp(code: string, values: AnswersState, onChange: (code: string, value: string) => void, placeholder = "") {
  return (
    <input
      type="text"
      value={values[code] ?? ""}
      onChange={(e) => onChange(code, e.target.value)}
      placeholder={placeholder}
      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
    />
  );
}

function rowCount(values: AnswersState, code: string): number {
  const n = parseInt(values[code] || "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, MAX_L1_ROWS);
}

/** Normalize public: Y/N -> Yes/No for backward compatibility */
function getPublicValue(values: AnswersState, rowKey: string): string {
  const v = values[`${rowKey}_public`] ?? "";
  if (v === "Y" || v === "y") return "Yes";
  if (v === "N" || v === "n") return "No";
  return v;
}

export function P7EssentialContent({ values, onChange, allowedSet }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  return (
    <>
      {(sb("p7_e1a_") || sb("p7_e1b_")) && <div data-testid="qblock-p7_e1">
        <h3 className="text-sm font-semibold text-teal-400">1. Trade and industry chambers / associations</h3>
        <p className="mt-2 text-sm font-medium text-gray-700">i. Number of affiliations with trade and industry chambers / associations</p>
        <div className="mt-1">{inp("p7_e1a_count", values, onChange, "Number")}</div>
        <p className="mt-4 text-sm font-medium text-gray-700">ii. List the top 10 trade and industry chambers/ associations (determined based on the total members of such body) the entity is a member of/ affiliated to.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">Sr No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Name of the trade and industry chambers/ associations</th>
                <th className="border border-gray-200 px-2 py-1.5">Reach of trade and industry chambers/ associations</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(
                { length: Math.min(Math.max(1, parseInt(values["p7_e1a_count"] ?? "1", 10) || 1), 10) },
                (_, i) => i + 1
              ).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_e1b_${i}_name`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <select
                      value={values[`p7_e1b_${i}_reach`] ?? ""}
                      onChange={(e) => onChange(`p7_e1b_${i}_reach`, e.target.value)}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      {REACH_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      {sb("p7_e2_") && <div data-testid="qblock-p7_e2">
        <h3 className="text-sm font-semibold text-teal-400">2. Provide details of corrective action taken or underway on any issues related to Anti-competitive conduct by the entity, based on adverse orders from regulatory authorities.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Name of authority</th>
                <th className="border border-gray-200 px-2 py-1.5">Brief of the Case</th>
                <th className="border border-gray-200 px-2 py-1.5">Corrective action taken</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const n = Math.min(
                  Math.max(1, parseInt(values["p7_e2_rowcount"] ?? "1", 10) || 1),
                  MAX_TABLE_ROWS
                );
                const rows: JSX.Element[] = [];
                for (let i = 0; i < n; i++) {
                  const authCode = i === 0 ? "p7_e2_auth" : `p7_e2_row${i}_auth`;
                  const briefCode = i === 0 ? "p7_e2_brief" : `p7_e2_row${i}_brief`;
                  const actionCode = i === 0 ? "p7_e2_action" : `p7_e2_row${i}_action`;
                  rows.push(
                    <tr key={i}>
                      <td className="border border-gray-200 px-2 py-1">{inp(authCode, values, onChange)}</td>
                      <td className="border border-gray-200 px-2 py-1">{inp(briefCode, values, onChange)}</td>
                      <td className="border border-gray-200 px-2 py-1">{inp(actionCode, values, onChange)}</td>
                    </tr>
                  );
                }
                return rows;
              })()}
            </tbody>
          </table>
          <button
            type="button"
            onClick={() => {
              const n = Math.min(
                Math.max(1, parseInt(values["p7_e2_rowcount"] ?? "1", 10) || 1),
                MAX_TABLE_ROWS
              );
              if (n < MAX_TABLE_ROWS) onChange("p7_e2_rowcount", String(n + 1));
            }}
            disabled={
              Math.min(
                Math.max(1, parseInt(values["p7_e2_rowcount"] ?? "1", 10) || 1),
                MAX_TABLE_ROWS
              ) >= MAX_TABLE_ROWS
            }
            className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
          >
            +ADD
          </button>
        </div>
      </div>}
    </>
  );
}

export function P7LeadershipContent({ values, onChange, allowedSet }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const n = rowCount(values, "p7_l1_rowcount");

  // Migrate p7_l1_1_* / p7_l1_2_* to p7_l1_row0_* / p7_l1_row1_* for backward compatibility
  useEffect(() => {
    const row0HasData = (values["p7_l1_row0_policy"] ?? "").trim() || (values["p7_l1_row0_method"] ?? "").trim();
    const old1HasData = (values["p7_l1_1_policy"] ?? "").trim() || (values["p7_l1_1_method"] ?? "").trim();
    if (old1HasData && !row0HasData) {
      onChange("p7_l1_row0_policy", values["p7_l1_1_policy"] ?? "");
      onChange("p7_l1_row0_method", values["p7_l1_1_method"] ?? "");
      onChange("p7_l1_row0_freq", values["p7_l1_1_freq"] ?? "");
      onChange("p7_l1_row0_public", values["p7_l1_1_public"] ?? "");
      onChange("p7_l1_rowcount", "1");
    }
    const row1HasData = (values["p7_l1_row1_policy"] ?? "").trim() || (values["p7_l1_row1_method"] ?? "").trim();
    const old2HasData = (values["p7_l1_2_policy"] ?? "").trim() || (values["p7_l1_2_method"] ?? "").trim();
    if (old2HasData && !row1HasData) {
      onChange("p7_l1_row1_policy", values["p7_l1_2_policy"] ?? "");
      onChange("p7_l1_row1_method", values["p7_l1_2_method"] ?? "");
      onChange("p7_l1_row1_freq", values["p7_l1_2_freq"] ?? "");
      onChange("p7_l1_row1_public", values["p7_l1_2_public"] ?? "");
      onChange("p7_l1_rowcount", "2");
    }
  }, [onChange, values]);

  function addRow() {
    onChange("p7_l1_rowcount", String(n + 1));
  }
  function removeRow(i: number) {
    if (n <= 1) return;
    for (let j = i; j < n - 1; j++) {
      for (const field of P7_L1_FIELDS) {
        onChange(`p7_l1_row${j}_${field}`, values[`p7_l1_row${j + 1}_${field}`] ?? "");
      }
    }
    for (const field of P7_L1_FIELDS) {
      onChange(`p7_l1_row${n - 1}_${field}`, "");
    }
    onChange("p7_l1_rowcount", String(n - 1));
  }

  return (
    <>
      {sb("p7_l1_") && <div data-testid="qblock-p7_l1">
        <h3 className="text-sm font-semibold text-teal-400">1. Details of public policy positions advocated by the entity.</h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: n }, (_, i) => {
            const rowKey = `p7_l1_row${i}`;
            const publicVal = getPublicValue(values, rowKey);

            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {n > 1 && i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeRow(i);
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div>
                    <label className="block text-xs text-gray-500">Public policy advocated</label>
                    {inp(`${rowKey}_policy`, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Method resorted for such advocacy</label>
                    {inp(`${rowKey}_method`, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Frequency of Review by Board</label>
                    <select
                      value={values[`${rowKey}_freq`] ?? ""}
                      onChange={(e) => onChange(`${rowKey}_freq`, e.target.value)}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      {FREQUENCY_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Whether information available in public domain?</label>
                    <div className="mt-1 flex gap-4">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`${rowKey}_public`}
                          checked={publicVal === "Yes"}
                          onChange={() => onChange(`${rowKey}_public`, "Yes")}
                          className="rounded-full"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`${rowKey}_public`}
                          checked={publicVal === "No"}
                          onChange={() => onChange(`${rowKey}_public`, "No")}
                          className="rounded-full"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Web Link, if available</label>
                    {inp(`${rowKey}_link`, values, onChange, "https://")}
                  </div>
                </div>
              </details>
            );
          })}
          <button
            type="button"
            onClick={addRow}
            disabled={n >= MAX_L1_ROWS}
            className="add-row-btn w-fit rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
          >
            +ADD
          </button>
        </div>
      </div>}
    </>
  );
}
