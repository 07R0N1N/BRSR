"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { CalcCell } from "@/components/CalcCell";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";
import { blockAllowed } from "@/lib/brsr/visibilityUtils";

const MAX_ROWS = 20;

const YES_NO_NA_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
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

/** Integer-only input (no decimals) */
function intInp(code: string, values: AnswersState, onChange: (code: string, value: string) => void) {
  const v = values[code] ?? "";
  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={v}
      onChange={(e) => {
        const next = e.target.value.replace(/[^0-9]/g, "");
        onChange(code, next);
      }}
      placeholder="0"
      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
    />
  );
}

/** Numeric input (allows decimals) */
function numInp(code: string, values: AnswersState, onChange: (code: string, value: string) => void, placeholder = "") {
  const v = values[code] ?? "";
  return (
    <input
      type="text"
      inputMode="decimal"
      value={v}
      onChange={(e) => {
        const raw = e.target.value.replace(/[^0-9.]/g, "");
        onChange(code, raw);
      }}
      placeholder={placeholder}
      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
    />
  );
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

function rowCount(values: AnswersState, code: string): number {
  const n = parseInt(values[code] ?? "1", 10);
  return Number.isNaN(n) || n < 1 ? 1 : Math.min(n, MAX_ROWS);
}

export function P1EssentialContent({ values, calcDisplay, onChange, allowedSet, reportingYear = "2024-25" }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  const [fyCurrent, fyPrevious] = getFYLabelsFromReportingYear(reportingYear);
  const segments: [string, string][] = [
    ["Board Of Directors", "bod"],
    ["Key Managerial Personnel", "kmp"],
    ["Employees Other Than BoD And KMPs", "emp"],
    ["Workers", "wrk"],
  ];
  return (
    <>
      {sb("p1_e1_") && <div data-testid="qblock-p1_e1">
        <h3 className="text-sm font-semibold text-teal-400">
          1. Percentage coverage by training and awareness programmes on any of the Principles during the financial year:
        </h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Segment</th>
                <th className="border border-gray-200 px-2 py-1.5">Total number of training and awareness programmes held</th>
                <th className="border border-gray-200 px-2 py-1.5">Topics/Principles covered under the training and its impact</th>
                <th className="border border-gray-200 px-2 py-1.5">%age of persons in respective category covered by awareness programmes</th>
              </tr>
            </thead>
            <tbody>
              {segments.map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{intInp(`p1_e1_${k}_prog`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_e1_${k}_topics`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p1_e1_${k}_pct`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      {sb("p1_e2_") && <div data-testid="qblock-p1_e2">
        <h3 className="text-sm font-semibold text-teal-400">
          2. Details of fines / penalties / punishment / award / compounding fees / settlement amount paid in proceedings (by the entity or by directors / KMPs) with regulators / law enforcement agencies / judicial institutions, in the financial year
        </h3>
        {[
          { label: "I. Monetary: Penalty/ Fine", prefix: "p1_e2_pf", hasAmt: true },
          { label: "II. Monetary: Settlement", prefix: "p1_e2_set", hasAmt: true },
          { label: "iii. Monetary: Compounding fee", prefix: "p1_e2_cmp", hasAmt: true },
          { label: "iv. Non-Monetary: Imprisonment", prefix: "p1_e2_imp", hasAmt: false },
          { label: "v. Non-Monetary: Punishment", prefix: "p1_e2_pun", hasAmt: false },
        ].map(({ label, prefix, hasAmt }) => {
          const n = rowCount(values, `${prefix}_rowcount`);
          return (
            <div key={prefix} className="mt-6 border-t border-slate-600 pt-6">
              <h4 className="text-xs font-semibold text-gray-700">{label}</h4>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                      <th className="border border-gray-200 px-2 py-1.5">NGRBC Principle</th>
                      <th className="border border-gray-200 px-2 py-1.5">Name of the Regulatory/ enforcement agencies/ judicial institutions</th>
                      {hasAmt && <th className="border border-gray-200 px-2 py-1.5">Amount (in INR)</th>}
                      <th className="border border-gray-200 px-2 py-1.5">Brief of the Case</th>
                      <th className="border border-gray-200 px-2 py-1.5">Has an appeal been preferred?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: n }, (_, i) => i).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i + 1}</td>
                        <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_row${i}_principle`, values, onChange)}</td>
                        <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_row${i}_agency`, values, onChange)}</td>
                        {hasAmt && <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_row${i}_amt`, values, onChange)}</td>}
                        <td className="border border-gray-200 px-2 py-1">
                          <textarea
                            value={values[`${prefix}_row${i}_brief`] ?? ""}
                            onChange={(e) => onChange(`${prefix}_row${i}_brief`, e.target.value)}
                            rows={2}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <span className="flex gap-3">
                            <label className="inline-flex items-center gap-1">
                              <input type="radio" name={`${prefix}_row${i}_appeal`} checked={(values[`${prefix}_row${i}_appeal`] ?? "") === "Yes"} onChange={() => onChange(`${prefix}_row${i}_appeal`, "Yes")} />
                              Yes
                            </label>
                            <label className="inline-flex items-center gap-1">
                              <input type="radio" name={`${prefix}_row${i}_appeal`} checked={(values[`${prefix}_row${i}_appeal`] ?? "") === "No"} onChange={() => onChange(`${prefix}_row${i}_appeal`, "No")} />
                              No
                            </label>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() => onChange(`${prefix}_rowcount`, String(n + 1))}
                  disabled={n >= MAX_ROWS}
                  className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + ADD
                </button>
                {n > 1 && (
                  <button
                    type="button"
                    onClick={() => onChange(`${prefix}_rowcount`, String(n - 1))}
                    className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
                  >
                    − REMOVE
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>}
      {sb("p1_e3_") && <div data-testid="qblock-p1_e3">
        <h3 className="text-sm font-semibold text-teal-400">
          3. Of the instances disclosed in Question 2 above, details of the Appeal/ Revision preferred in cases where monetary or non-monetary action has been appealed.
        </h3>
        {Array.from({ length: rowCount(values, "p1_e3_rowcount") }, (_, i) => i).map((i) => (
          <div key={i} className="mt-4 rounded border border-gray-200 p-3">
            <h4 className="mb-2 text-xs font-medium text-gray-600">Record {i + 1}</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500">Case Details</label>
                <input
                  type="text"
                  value={values[`p1_e3_row${i}_case`] ?? ""}
                  onChange={(e) => onChange(`p1_e3_row${i}_case`, e.target.value)}
                  className="mt-0.5 w-full max-w-2xl rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500">Name of the regulatory/enforcement agencies/judicial institutions</label>
                <textarea
                  value={values[`p1_e3_row${i}_agency`] ?? ""}
                  onChange={(e) => onChange(`p1_e3_row${i}_agency`, e.target.value)}
                  rows={2}
                  className="mt-0.5 w-full max-w-2xl rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onChange("p1_e3_rowcount", String(rowCount(values, "p1_e3_rowcount") + 1))}
            disabled={rowCount(values, "p1_e3_rowcount") >= MAX_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            + ADD
          </button>
          {rowCount(values, "p1_e3_rowcount") > 1 && (
            <button
              type="button"
              onClick={() => onChange("p1_e3_rowcount", String(rowCount(values, "p1_e3_rowcount") - 1))}
              className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
            >
              − REMOVE
            </button>
          )}
        </div>
      </div>}
      {sb("p1_e4_") && <div data-testid="qblock-p1_e4">
        <h3 className="text-sm font-semibold text-teal-400">4. Does the entity have an anti-corruption policy or anti-bribery policy?</h3>
        <div className="mt-2">
          <select
            value={values["p1_e4_anticorr"] ?? ""}
            onChange={(e) => onChange("p1_e4_anticorr", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {YES_NO_NA_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>}
      {sb("p1_e5_") && <div data-testid="qblock-p1_e5">
        <h3 className="text-sm font-semibold text-teal-400">
          5. Number of Directors/KMPs/employees/workers against whom disciplinary action was taken by any law enforcement agency for the charges of bribery/ corruption
        </h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Directors</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_dir_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_dir_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">KMPs</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_kmp_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_kmp_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Employees</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_emp_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_emp_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Workers</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_wrk_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e5_wrk_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>}
      {sb("p1_e6_") && <div data-testid="qblock-p1_e6">
        <h3 className="text-sm font-semibold text-teal-400">6. Details of complaints with regard to conflict of interest:</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyPrevious}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Number</th>
                <th className="border border-gray-200 px-2 py-1.5">Remark</th>
                <th className="border border-gray-200 px-2 py-1.5">Number</th>
                <th className="border border-gray-200 px-2 py-1.5">Remark</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Number Of Complaints Received In Relation To Issues Of Conflict Of Interest Of The Directors</td>
                <td className="border border-gray-200 px-2 py-1">{intInp("p1_e6_dir_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_dir_cy_rem", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{intInp("p1_e6_dir_py", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_dir_py_rem", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Number Of Complaints Received In Relation To Issues Of Conflict Of Interest Of The KMPs</td>
                <td className="border border-gray-200 px-2 py-1">{intInp("p1_e6_kmp_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_kmp_cy_rem", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{intInp("p1_e6_kmp_py", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_kmp_py_rem", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>}
      {sb("p1_e7_") && <div data-testid="qblock-p1_e7">
        <h3 className="text-sm font-semibold text-teal-400">
          7. Provide details of any corrective action taken or under way on issues related to fines / penalties / action taken by regulators/ law enforcement agencies/ judicial institutions, on cases of corruption and conflicts of interest.
        </h3>
        <textarea
          value={values["p1_e7_corrective"] ?? ""}
          onChange={(e) => onChange("p1_e7_corrective", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>}
      {sb("p1_e8_") && <div data-testid="qblock-p1_e8">
        <h3 className="text-sm font-semibold text-teal-400">8. Number of days of accounts payables</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">I. Account payable x 365 days</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_ap_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_ap_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">II. Cost of goods/services procured</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_cost_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_cost_py", values, onChange)}</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">III. Number of days of accounts payables</td><td className="border border-gray-200 px-2 py-1"><CalcCell code="calc_p1_formula_1" calcDisplay={calcDisplay} dash /></td><td className="border border-gray-200 px-2 py-1"><CalcCell code="calc_p1_formula_2" calcDisplay={calcDisplay} dash /></td></tr>
            </tbody>
          </table>
        </div>
      </div>}
      {sb("p1_e9_") && <div data-testid="qblock-p1_e9">
        <h3 className="text-sm font-semibold text-teal-400">9. Open-ness of business - Provide details of concentration of purchases and sales with trading houses, dealers, and related parties along-with loans and advances & investments, with related parties, in the following format</h3>
        <div className="mt-2 space-y-4">
          <div>
            <h4 className="mb-1 text-xs font-medium text-gray-600">I. Concentration of Purchases</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
                <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th></tr></thead>
                <tbody>
                  <tr><td className="border border-gray-200 px-2 py-1">a.i Purchases from trading houses</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_i_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_i_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">a.II Total Purchases</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_total_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_total_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">a.III Purchases from trading houses as % of total purchases</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_purch_pct_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_purch_pct_py")}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">b Number of trading houses where purchases are made from</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e9_purch_num_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e9_purch_num_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">c.i Purchases from top 10 trading houses</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_top10_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_top10_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">c.II Total purchases from trading houses</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_total_th_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_purch_total_th_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">c.III Purchases from top 10 trading houses as % of total purchases from trading houses</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_purch_top10_pct_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_purch_top10_pct_py")}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="mb-1 text-xs font-medium text-gray-600">II. Concentration of Sales</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
                <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th></tr></thead>
                <tbody>
                  <tr><td className="border border-gray-200 px-2 py-1">a.i Sales to dealer / distributors</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_i_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_i_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">a.II Total Sales</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_total_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_total_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">a.III Sales to dealer / distributors as % of total sales</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_sales_pct_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_sales_pct_py")}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">b Number of dealers / distributors to whom sales are made</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e9_sales_num_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{intInp("p1_e9_sales_num_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">c.i Sales to top 10 dealers / distributors</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_top10_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_top10_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">c.II Total Sales to dealer / distributors</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_total_dd_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_sales_total_dd_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">c.III Sales to top 10 dealers / distributors as % of total sales to dealer / distributors</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_sales_top10_pct_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_sales_top10_pct_py")}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h4 className="mb-1 text-xs font-medium text-gray-600">III. Share of RPTs In</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
                <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th></tr></thead>
                <tbody>
                  <tr><td className="border border-gray-200 px-2 py-1">a.i Purchases with related parties</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_purch_i_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_purch_i_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">a.II Total Purchases</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_purch_total_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_purch_total_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">a.III Purchases with related parties as % of Total Purchases</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_purch_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_purch_py")}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">b.i Sales to related parties</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_sales_i_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_sales_i_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">b.II Total Sales</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_sales_total_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_sales_total_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">b.III Sales to related parties as % of Total Sales</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_sales_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_sales_py")}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">c.i Loans & advances given to related parties</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_loans_i_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_loans_i_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">c.II Total loans & advances</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_loans_total_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_loans_total_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">c.III Loans & advances as % of Total</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_loans_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_loans_py")}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">d.i Investments in related parties</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_inv_i_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_inv_i_py", values, onChange)}</td></tr>
                  <tr><td className="border border-gray-200 px-2 py-1">d.II Total Investments made</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_inv_total_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{numInp("p1_e9_rpt_inv_total_py", values, onChange)}</td></tr>
                  <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1">d.III Investments as % of Total Investments</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_inv_cy")}</td><td className="border border-gray-200 px-2 py-1">{d("calc_p1_e9_rpt_inv_py")}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
}

export function P1LeadershipContent({ values, calcDisplay, onChange, allowedSet }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const rc = rowCount(values, "p1_l1_rowcount");
  return (
    <>
      {sb("p1_l1_") && <div data-testid="qblock-p1_l1">
        <h3 className="text-sm font-semibold text-teal-400">1. Awareness programmes conducted for value chain partners on any of the Principles during the financial year.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">Total number of awareness programmes held</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Topics / Principles covered under the training</th>
                <th className="border border-gray-200 px-2 py-1.5">Percentage of value chain partners covered (by value of business done with such partners) under the awareness programmes</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rc }, (_, i) => i).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1">{intInp(`p1_l1_row${i}_prog`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_l1_row${i}_topics`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p1_l1_row${i}_pct`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onChange("p1_l1_rowcount", String(rc + 1))}
            disabled={rc >= MAX_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            + ADD
          </button>
          {rc > 1 && (
            <button
              type="button"
              onClick={() => onChange("p1_l1_rowcount", String(rc - 1))}
              className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
            >
              − REMOVE
            </button>
          )}
        </div>
      </div>}
      {sb("p1_l2_") && <div data-testid="qblock-p1_l2">
        <h3 className="text-sm font-semibold text-teal-400">2. Does the entity have processes in place to avoid / manage conflict of interests involving members of the Board?</h3>
        <div className="mt-2">
          <select
            value={values["p1_l2_conflict"] ?? ""}
            onChange={(e) => onChange("p1_l2_conflict", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {YES_NO_NA_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>}
    </>
  );
}
