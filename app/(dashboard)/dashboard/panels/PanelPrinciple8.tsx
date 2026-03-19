"use client";

import { useEffect } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { CalcCell } from "@/components/CalcCell";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";

const MAX_E1_ROWS = 20;
const MAX_E2_ROWS = 20;
const MAX_L_ROWS = 20;

const P8_E1_FIELDS = ["name", "notif", "date", "ind", "pub", "link"] as const;
const P8_E2_FIELDS = ["name", "state", "dist", "paf", "pct", "amt"] as const;
const P8_L1_FIELDS = ["impact", "action"] as const;
const P8_L2_FIELDS = ["state", "dist", "amt"] as const;
const P8_L4_FIELDS = ["ip", "own", "ben", "basis"] as const;
const P8_L5_FIELDS = ["auth", "brief", "action"] as const;
const P8_L6_FIELDS = ["proj", "num", "pct"] as const;

const PREF_PROC_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
};

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

/** Normalize Y/N to Yes/No for backward compatibility */
function getYesNoValue(values: AnswersState, code: string): string {
  const v = values[code] ?? "";
  if (v === "Y" || v === "y") return "Yes";
  if (v === "N" || v === "n") return "No";
  return v;
}

/** Percentage-only input (0–100, displays with % suffix) */
function pctInp(code: string, values: AnswersState, onChange: (code: string, value: string) => void) {
  const v = values[code] ?? "";
  return (
    <span className="inline-flex items-center gap-1">
      <input
        type="text"
        inputMode="decimal"
        value={v}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, "");
          const num = parseFloat(raw);
          if (raw === "" || (!Number.isNaN(num) && num >= 0 && num <= 100)) {
            onChange(code, raw);
          }
        }}
        placeholder="0"
        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <span className="text-gray-500">%</span>
    </span>
  );
}

function rowCount(values: AnswersState, code: string, max: number): number {
  const n = parseInt(values[code] || "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, max);
}

export function P8EssentialContent({ values, calcDisplay, onChange, reportingYear }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  const n1 = rowCount(values, "p8_e1_rowcount", MAX_E1_ROWS);
  const n2 = rowCount(values, "p8_e2_rowcount", MAX_E2_ROWS);

  // Migrate p8_e2_1_* / p8_e2_2_* to p8_e2_row0_* / p8_e2_row1_* for backward compatibility
  useEffect(() => {
    const row0HasData = (values["p8_e2_row0_name"] ?? "").trim();
    const old1HasData = (values["p8_e2_1_name"] ?? "").trim();
    if (old1HasData && !row0HasData) {
      onChange("p8_e2_row0_name", values["p8_e2_1_name"] ?? "");
      onChange("p8_e2_row0_state", values["p8_e2_1_state"] ?? "");
      onChange("p8_e2_row0_dist", values["p8_e2_1_dist"] ?? "");
      onChange("p8_e2_row0_paf", values["p8_e2_1_paf"] ?? "");
      onChange("p8_e2_row0_pct", values["p8_e2_1_pct"] ?? "");
      onChange("p8_e2_row0_amt", values["p8_e2_1_amt"] ?? "");
      onChange("p8_e2_rowcount", "1");
    }
    const row1HasData = (values["p8_e2_row1_name"] ?? "").trim();
    const old2HasData = (values["p8_e2_2_name"] ?? "").trim();
    if (old2HasData && !row1HasData) {
      onChange("p8_e2_row1_name", values["p8_e2_2_name"] ?? "");
      onChange("p8_e2_row1_state", values["p8_e2_2_state"] ?? "");
      onChange("p8_e2_row1_dist", values["p8_e2_2_dist"] ?? "");
      onChange("p8_e2_row1_paf", values["p8_e2_2_paf"] ?? "");
      onChange("p8_e2_row1_pct", values["p8_e2_2_pct"] ?? "");
      onChange("p8_e2_row1_amt", values["p8_e2_2_amt"] ?? "");
      onChange("p8_e2_rowcount", "2");
    }
  }, [onChange, values]);

  function addRowE1() {
    onChange("p8_e1_rowcount", String(n1 + 1));
  }
  function removeRowE1(i: number) {
    if (n1 <= 1) return;
    for (let j = i; j < n1 - 1; j++) {
      for (const field of P8_E1_FIELDS) {
        const dstCode = j === 0 ? `p8_e1_${field}` : `p8_e1_row${j}_${field}`;
        const srcCode = j + 1 === 0 ? `p8_e1_${field}` : `p8_e1_row${j + 1}_${field}`;
        onChange(dstCode, values[srcCode] ?? "");
      }
    }
    for (const field of P8_E1_FIELDS) {
      const code = n1 - 1 === 0 ? `p8_e1_${field}` : `p8_e1_row${n1 - 1}_${field}`;
      onChange(code, "");
    }
    onChange("p8_e1_rowcount", String(n1 - 1));
  }

  function addRowE2() {
    onChange("p8_e2_rowcount", String(n2 + 1));
  }
  function removeRowE2(i: number) {
    if (n2 <= 1) return;
    for (let j = i; j < n2 - 1; j++) {
      for (const field of P8_E2_FIELDS) {
        onChange(`p8_e2_row${j}_${field}`, values[`p8_e2_row${j + 1}_${field}`] ?? "");
      }
    }
    for (const field of P8_E2_FIELDS) {
      onChange(`p8_e2_row${n2 - 1}_${field}`, "");
    }
    onChange("p8_e2_rowcount", String(n2 - 1));
  }

  const [fyCurr, fyPrev] = reportingYear ? getFYLabelsFromReportingYear(reportingYear) : ["Current FY", "Previous FY"];

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          1. Details of Social Impact Assessments (SIA) of projects undertaken by the Company based on applicable laws, in the current financial year.
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: n1 }, (_, i) => {
            const nameCode = i === 0 ? "p8_e1_name" : `p8_e1_row${i}_name`;
            const notifCode = i === 0 ? "p8_e1_notif" : `p8_e1_row${i}_notif`;
            const dateCode = i === 0 ? "p8_e1_date" : `p8_e1_row${i}_date`;
            const indCode = i === 0 ? "p8_e1_ind" : `p8_e1_row${i}_ind`;
            const pubCode = i === 0 ? "p8_e1_pub" : `p8_e1_row${i}_pub`;
            const linkCode = i === 0 ? "p8_e1_link" : `p8_e1_row${i}_link`;
            const indVal = getYesNoValue(values, indCode);
            const pubVal = getYesNoValue(values, pubCode);

            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {n1 > 1 && i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeRowE1(i);
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div>
                    <label className="block text-xs text-gray-500">Name and brief details of the project</label>
                    {inp(nameCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">SIA notification no.</label>
                    {inp(notifCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Date of notification</label>
                    <input
                      type="date"
                      value={values[dateCode] ?? ""}
                      onChange={(e) => onChange(dateCode, e.target.value)}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Whether conducted by independent external agency</label>
                    <div className="mt-1 flex gap-4">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={indCode}
                          checked={indVal === "Yes"}
                          onChange={() => onChange(indCode, "Yes")}
                          className="rounded-full"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={indCode}
                          checked={indVal === "No"}
                          onChange={() => onChange(indCode, "No")}
                          className="rounded-full"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Results communicated in public domain</label>
                    <div className="mt-1 flex gap-4">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={pubCode}
                          checked={pubVal === "Yes"}
                          onChange={() => onChange(pubCode, "Yes")}
                          className="rounded-full"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={pubCode}
                          checked={pubVal === "No"}
                          onChange={() => onChange(pubCode, "No")}
                          className="rounded-full"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Relevant Web link</label>
                    {inp(linkCode, values, onChange)}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addRowE1}
          disabled={n1 >= MAX_E1_ROWS}
          className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
        >
          +ADD
        </button>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          2. Provide information on project(s) for which ongoing Rehabilitation and Resettlement (R&amp;R) is being undertaken by your entity.
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: n2 }, (_, i) => (
            <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                <span>Record {i + 1}</span>
                {n2 > 1 && i > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeRowE2(i);
                    }}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </summary>
              <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                <div>
                  <label className="block text-xs text-gray-500">Name of Project for which R&amp;R is ongoing</label>
                  {inp(`p8_e2_row${i}_name`, values, onChange)}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">State</label>
                  {inp(`p8_e2_row${i}_state`, values, onChange)}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">District</label>
                  {inp(`p8_e2_row${i}_dist`, values, onChange)}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">No. of Project Affected Families (PAF)</label>
                  {inp(`p8_e2_row${i}_paf`, values, onChange)}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">% of PAFs covered by R&amp;R</label>
                  {pctInp(`p8_e2_row${i}_pct`, values, onChange)}
                </div>
                <div>
                  <label className="block text-xs text-gray-500">Amounts paid to PAFs in the FY (in INR)</label>
                  {inp(`p8_e2_row${i}_amt`, values, onChange, "INR")}
                </div>
              </div>
            </details>
          ))}
        </div>
        <button
          type="button"
          onClick={addRowE2}
          disabled={n2 >= MAX_E2_ROWS}
          className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50"
        >
          +ADD
        </button>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Describe the mechanisms to receive and redress grievances of the community.</h3>
        <textarea
          value={values["p8_e3_griev"] ?? ""}
          onChange={(e) => onChange("p8_e3_griev", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Percentage of input material (inputs to total inputs by value) sourced from suppliers.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Directly Sourced From MSMEs/ Small Producers</td><td className="border border-gray-200 px-2 py-1">{pctInp("p8_e4_msme_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{pctInp("p8_e4_msme_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Sourced Directly From Within The District And Neighbouring Districts</td><td className="border border-gray-200 px-2 py-1">{pctInp("p8_e4_india_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{pctInp("p8_e4_india_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          5. Job creation in smaller towns - Disclose wages paid to persons employed (including employees or workers employed on a permanent or non-permanent / on contract basis) in the following locations, as % of total wage cost
        </h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Location</th>
                <th colSpan={3} className="border border-gray-200 px-2 py-1.5 text-center">{fyCurr}</th>
                <th colSpan={3} className="border border-gray-200 px-2 py-1.5 text-center">{fyPrev}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Disclose wages paid to persons employed</th>
                <th className="border border-gray-200 px-2 py-1.5">Total Wage Cost</th>
                <th className="border border-gray-200 px-2 py-1.5">% of Job creation</th>
                <th className="border border-gray-200 px-2 py-1.5">Disclose wages paid to persons employed</th>
                <th className="border border-gray-200 px-2 py-1.5">Total Wage Cost</th>
                <th className="border border-gray-200 px-2 py-1.5">% of Job creation</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rural", "rural", "calc_p8_pct_1", "calc_p8_pct_2"],
                ["Semi-Urban", "semi", "calc_p8_pct_3", "calc_p8_pct_4"],
                ["Urban", "urb", "calc_p8_pct_5", "calc_p8_pct_6"],
                ["Metropolitan", "metro", "calc_p8_pct_7", "calc_p8_pct_8"],
              ].map(([label, k, calcCy, calcPy]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_w_cy`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_t_cy`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcCy)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_w_py`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_t_py`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcPy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function P8LeadershipContent({ values, onChange }: Props) {
  const nL1 = rowCount(values, "p8_l1_rowcount", MAX_L_ROWS);
  const nL2 = rowCount(values, "p8_l2_rowcount", MAX_L_ROWS);
  const nL4 = rowCount(values, "p8_l4_rowcount", MAX_L_ROWS);
  const nL5 = rowCount(values, "p8_l5_rowcount", MAX_L_ROWS);
  const nL6 = rowCount(values, "p8_l6_rowcount", MAX_L_ROWS);

  // Migrate p8_l2_1_* / p8_l2_2_* to p8_l2_row0_* / p8_l2_row1_*
  useEffect(() => {
    const row0HasData = (values["p8_l2_row0_state"] ?? "").trim();
    const old1HasData = (values["p8_l2_1_state"] ?? "").trim();
    if (old1HasData && !row0HasData) {
      onChange("p8_l2_row0_state", values["p8_l2_1_state"] ?? "");
      onChange("p8_l2_row0_dist", values["p8_l2_1_dist"] ?? "");
      onChange("p8_l2_row0_amt", values["p8_l2_1_amt"] ?? "");
      onChange("p8_l2_rowcount", "1");
    }
    const row1HasData = (values["p8_l2_row1_state"] ?? "").trim();
    const old2HasData = (values["p8_l2_2_state"] ?? "").trim();
    if (old2HasData && !row1HasData) {
      onChange("p8_l2_row1_state", values["p8_l2_2_state"] ?? "");
      onChange("p8_l2_row1_dist", values["p8_l2_2_dist"] ?? "");
      onChange("p8_l2_row1_amt", values["p8_l2_2_amt"] ?? "");
      onChange("p8_l2_rowcount", "2");
    }
  }, [onChange, values]);

  // Migrate p8_l4_1_* to p8_l4_row0_*
  useEffect(() => {
    const row0HasData = (values["p8_l4_row0_ip"] ?? "").trim();
    const old1HasData = (values["p8_l4_1_ip"] ?? "").trim();
    if (old1HasData && !row0HasData) {
      onChange("p8_l4_row0_ip", values["p8_l4_1_ip"] ?? "");
      onChange("p8_l4_row0_own", values["p8_l4_1_own"] ?? "");
      onChange("p8_l4_row0_ben", values["p8_l4_1_ben"] ?? "");
      onChange("p8_l4_row0_basis", values["p8_l4_1_basis"] ?? "");
      onChange("p8_l4_rowcount", "1");
    }
  }, [onChange, values]);

  // Migrate p8_l6_1_* to p8_l6_row0_* (proj, num; tot/vuln -> pct via pct = vuln/tot if both available)
  useEffect(() => {
    const row0HasData = (values["p8_l6_row0_proj"] ?? "").trim();
    const old1HasData = (values["p8_l6_1_proj"] ?? "").trim();
    if (old1HasData && !row0HasData) {
      onChange("p8_l6_row0_proj", values["p8_l6_1_proj"] ?? "");
      onChange("p8_l6_row0_num", values["p8_l6_1_num"] ?? "");
      const tot = parseFloat(values["p8_l6_1_tot"] ?? "");
      const vuln = parseFloat(values["p8_l6_1_vuln"] ?? "");
      if (!Number.isNaN(tot) && tot > 0 && !Number.isNaN(vuln)) {
        onChange("p8_l6_row0_pct", String((vuln / tot) * 100));
      }
      onChange("p8_l6_rowcount", "1");
    }
  }, [onChange, values]);

  // L1: add/remove
  function addRowL1() { onChange("p8_l1_rowcount", String(nL1 + 1)); }
  function removeRowL1(i: number) {
    if (nL1 <= 1) return;
    for (let j = i; j < nL1 - 1; j++) {
      for (const f of P8_L1_FIELDS) {
        const dst = j === 0 ? `p8_l1_${f}` : `p8_l1_row${j}_${f}`;
        const src = j + 1 === 0 ? `p8_l1_${f}` : `p8_l1_row${j + 1}_${f}`;
        onChange(dst, values[src] ?? "");
      }
    }
    for (const f of P8_L1_FIELDS) {
      onChange(nL1 - 1 === 0 ? `p8_l1_${f}` : `p8_l1_row${nL1 - 1}_${f}`, "");
    }
    onChange("p8_l1_rowcount", String(nL1 - 1));
  }

  // L2: add/remove
  function addRowL2() { onChange("p8_l2_rowcount", String(nL2 + 1)); }
  function removeRowL2(i: number) {
    if (nL2 <= 1) return;
    for (let j = i; j < nL2 - 1; j++) {
      for (const f of P8_L2_FIELDS) {
        onChange(`p8_l2_row${j}_${f}`, values[`p8_l2_row${j + 1}_${f}`] ?? "");
      }
    }
    for (const f of P8_L2_FIELDS) onChange(`p8_l2_row${nL2 - 1}_${f}`, "");
    onChange("p8_l2_rowcount", String(nL2 - 1));
  }

  // L4: add/remove
  function addRowL4() { onChange("p8_l4_rowcount", String(nL4 + 1)); }
  function removeRowL4(i: number) {
    if (nL4 <= 1) return;
    for (let j = i; j < nL4 - 1; j++) {
      for (const f of P8_L4_FIELDS) {
        onChange(`p8_l4_row${j}_${f}`, values[`p8_l4_row${j + 1}_${f}`] ?? "");
      }
    }
    for (const f of P8_L4_FIELDS) onChange(`p8_l4_row${nL4 - 1}_${f}`, "");
    onChange("p8_l4_rowcount", String(nL4 - 1));
  }

  // L5: add/remove
  function addRowL5() { onChange("p8_l5_rowcount", String(nL5 + 1)); }
  function removeRowL5(i: number) {
    if (nL5 <= 1) return;
    for (let j = i; j < nL5 - 1; j++) {
      for (const f of P8_L5_FIELDS) {
        const dst = j === 0 ? `p8_l5_${f}` : `p8_l5_row${j}_${f}`;
        const src = j + 1 === 0 ? `p8_l5_${f}` : `p8_l5_row${j + 1}_${f}`;
        onChange(dst, values[src] ?? "");
      }
    }
    for (const f of P8_L5_FIELDS) onChange(nL5 - 1 === 0 ? `p8_l5_${f}` : `p8_l5_row${nL5 - 1}_${f}`, "");
    onChange("p8_l5_rowcount", String(nL5 - 1));
  }

  // L6: add/remove
  function addRowL6() { onChange("p8_l6_rowcount", String(nL6 + 1)); }
  function removeRowL6(i: number) {
    if (nL6 <= 1) return;
    for (let j = i; j < nL6 - 1; j++) {
      for (const f of P8_L6_FIELDS) onChange(`p8_l6_row${j}_${f}`, values[`p8_l6_row${j + 1}_${f}`] ?? "");
    }
    for (const f of P8_L6_FIELDS) onChange(`p8_l6_row${nL6 - 1}_${f}`, "");
    onChange("p8_l6_rowcount", String(nL6 - 1));
  }

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          1. Provide details of actions taken to mitigate any negative social impacts identified in the Social Impact Assessments. (Reference: Question 1 of Essential Indicators above)
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL1 }, (_, i) => {
            const impactCode = i === 0 ? "p8_l1_impact" : `p8_l1_row${i}_impact`;
            const actionCode = i === 0 ? "p8_l1_action" : `p8_l1_row${i}_action`;
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {nL1 > 1 && i > 0 && (
                    <button type="button" onClick={(e) => { e.preventDefault(); removeRowL1(i); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div>
                    <label className="block text-xs text-gray-500">Details of negative social impact identified</label>
                    {inp(impactCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Corrective action taken</label>
                    <textarea
                      value={values[actionCode] ?? ""}
                      onChange={(e) => onChange(actionCode, e.target.value)}
                      rows={3}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
        <button type="button" onClick={addRowL1} disabled={nL1 >= MAX_L_ROWS} className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50">+ADD</button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          2. Provide the following information on CSR projects undertaken by your entity in designated aspirational districts as identified by government bodies.
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL2 }, (_, i) => (
            <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                <span>Record {i + 1}</span>
                {nL2 > 1 && i > 0 && (
                  <button type="button" onClick={(e) => { e.preventDefault(); removeRowL2(i); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                )}
              </summary>
              <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                <div><label className="block text-xs text-gray-500">State</label>{inp(`p8_l2_row${i}_state`, values, onChange)}</div>
                <div><label className="block text-xs text-gray-500">Aspirational District</label>{inp(`p8_l2_row${i}_dist`, values, onChange)}</div>
                <div><label className="block text-xs text-gray-500">Amount spent (in INR)</label>{inp(`p8_l2_row${i}_amt`, values, onChange, "INR")}</div>
              </div>
            </details>
          ))}
        </div>
        <button type="button" onClick={addRowL2} disabled={nL2 >= MAX_L_ROWS} className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50">+ADD</button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Preferential procurement from marginalized/vulnerable groups</h3>
        <div className="mt-2 space-y-4">
          <div>
            <label className="block text-xs text-gray-500">i. Do you have a preferential procurement policy where you give preference to purchase from suppliers comprising marginalized /vulnerable groups?</label>
            <select
              value={getYesNoValue(values, "p8_l3_yn")}
              onChange={(e) => onChange("p8_l3_yn", e.target.value)}
              className="mt-1 w-full max-w-md rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {PREF_PROC_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">ii. From which marginalized /vulnerable groups do you procure?</label>
            {inp("p8_l3_groups", values, onChange)}
          </div>
          <div>
            <label className="block text-xs text-gray-500">iii. What percentage of total procurement (by value) does it constitute?</label>
            {pctInp("p8_l3_pct", values, onChange)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          4. Details of the benefits derived and shared from the intellectual properties owned or acquired by your entity (in the current financial year), based on traditional knowledge.
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL4 }, (_, i) => {
            const ownCode = `p8_l4_row${i}_own`;
            const benCode = `p8_l4_row${i}_ben`;
            const ownVal = (v: string) => { const x = values[v] ?? ""; return x === "Y" || x === "y" ? "Yes" : x === "N" || x === "n" ? "No" : x; };
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {nL4 > 1 && i > 0 && (
                    <button type="button" onClick={(e) => { e.preventDefault(); removeRowL4(i); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div><label className="block text-xs text-gray-500">Intellectual Property based on traditional knowledge</label>{inp(`p8_l4_row${i}_ip`, values, onChange)}</div>
                  <div>
                    <label className="block text-xs text-gray-500">Owned/Acquired</label>
                    <div className="mt-1 flex gap-4">
                      <label className="inline-flex items-center gap-1.5"><input type="radio" name={ownCode} checked={ownVal(ownCode) === "Yes"} onChange={() => onChange(ownCode, "Yes")} className="rounded-full" /><span className="text-sm">Yes</span></label>
                      <label className="inline-flex items-center gap-1.5"><input type="radio" name={ownCode} checked={ownVal(ownCode) === "No"} onChange={() => onChange(ownCode, "No")} className="rounded-full" /><span className="text-sm">No</span></label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Benefit shared</label>
                    <div className="mt-1 flex gap-4">
                      <label className="inline-flex items-center gap-1.5"><input type="radio" name={benCode} checked={ownVal(benCode) === "Yes"} onChange={() => onChange(benCode, "Yes")} className="rounded-full" /><span className="text-sm">Yes</span></label>
                      <label className="inline-flex items-center gap-1.5"><input type="radio" name={benCode} checked={ownVal(benCode) === "No"} onChange={() => onChange(benCode, "No")} className="rounded-full" /><span className="text-sm">No</span></label>
                    </div>
                  </div>
                  <div><label className="block text-xs text-gray-500">Basis of calculating benefit share</label>{inp(`p8_l4_row${i}_basis`, values, onChange)}</div>
                </div>
              </details>
            );
          })}
        </div>
        <button type="button" onClick={addRowL4} disabled={nL4 >= MAX_L_ROWS} className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50">+ADD</button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">
          5. Details of corrective actions taken or underway, based on any adverse order in intellectual property related disputes wherein usage of traditional knowledge is involved.
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL5 }, (_, i) => {
            const authCode = i === 0 ? "p8_l5_auth" : `p8_l5_row${i}_auth`;
            const briefCode = i === 0 ? "p8_l5_brief" : `p8_l5_row${i}_brief`;
            const actionCode = i === 0 ? "p8_l5_action" : `p8_l5_row${i}_action`;
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {nL5 > 1 && i > 0 && (
                    <button type="button" onClick={(e) => { e.preventDefault(); removeRowL5(i); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div><label className="block text-xs text-gray-500">Name of authority</label>{inp(authCode, values, onChange)}</div>
                  <div><label className="block text-xs text-gray-500">Brief of the Case</label>{inp(briefCode, values, onChange)}</div>
                  <div><label className="block text-xs text-gray-500">Corrective action taken</label>{inp(actionCode, values, onChange)}</div>
                </div>
              </details>
            );
          })}
        </div>
        <button type="button" onClick={addRowL5} disabled={nL5 >= MAX_L_ROWS} className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50">+ADD</button>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Details of beneficiaries of CSR Projects.</h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL6 }, (_, i) => (
            <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
              <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                <span>Record {i + 1}</span>
                {nL6 > 1 && i > 0 && (
                  <button type="button" onClick={(e) => { e.preventDefault(); removeRowL6(i); }} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                )}
              </summary>
              <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                <div><label className="block text-xs text-gray-500">CSR Project</label>{inp(`p8_l6_row${i}_proj`, values, onChange)}</div>
                <div><label className="block text-xs text-gray-500">No. of persons benefitted from CSR Projects</label>{inp(`p8_l6_row${i}_num`, values, onChange)}</div>
                <div><label className="block text-xs text-gray-500">% of beneficiaries from vulnerable and marginalized groups</label>{pctInp(`p8_l6_row${i}_pct`, values, onChange)}</div>
              </div>
            </details>
          ))}
        </div>
        <button type="button" onClick={addRowL6} disabled={nL6 >= MAX_L_ROWS} className="add-row-btn mt-2 rounded border border-blue-500 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 disabled:pointer-events-none disabled:opacity-50">+ADD</button>
      </div>
    </>
  );
}
