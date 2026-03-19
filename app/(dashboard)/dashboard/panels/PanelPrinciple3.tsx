"use client";

import React from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";

const YES_NO_NA_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
];

type Props = {
  values: AnswersState;
  calcDisplay?: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
};

function inp(
  code: string,
  values: AnswersState,
  onChange: (code: string, value: string) => void,
  placeholder = "",
) {
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

function ta(code: string, values: AnswersState, onChange: (code: string, value: string) => void, rows = 3) {
  return (
    <textarea
      value={values[code] ?? ""}
      onChange={(e) => onChange(code, e.target.value)}
      rows={rows}
      className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
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

function calcVal(calcDisplay: Record<string, string>, id: string): string {
  return calcDisplay[id] ?? "";
}

/**
 * Q1 – Well-being table: Male, Female, Other Gender, Total columns.
 * Rows: Total (A), then for each benefit: No. (B), % (B/A).
 */
function WellbeingTable({
  title,
  prefix,
  values,
  calcDisplay,
  onChange,
}: {
  title: string;
  prefix: string;
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
}) {
  const benefits = [
    ["Health Insurance", "hi", "B"],
    ["Accident Insurance", "ac", "C"],
    ["Maternity Benefits", "mat", "D"],
    ["Paternity Benefits", "pat", "E"],
    ["Day Care Facilities", "dc", "F"],
  ] as const;
  const genders = [
    ["Male", "m"],
    ["Female", "f"],
    ["Other Gender", "o"],
  ] as const;
  const totT = calcVal(calcDisplay, `calc_${prefix}_tot_t`);
  const totByBenefit: Record<string, string> = {
    hi: calcVal(calcDisplay, `calc_${prefix}_tot_hi`),
    ac: calcVal(calcDisplay, `calc_${prefix}_tot_ac`),
    mat: calcVal(calcDisplay, `calc_${prefix}_tot_mat`),
    pat: calcVal(calcDisplay, `calc_${prefix}_tot_pat`),
    dc: calcVal(calcDisplay, `calc_${prefix}_tot_dc`),
  };

  return (
    <div>
      <h3 className="text-sm font-semibold text-teal-400">{title}</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
              {genders.map(([l]) => (
                <th key={l} className="border border-gray-200 px-2 py-1.5">{l}</th>
              ))}
              <th className="border border-gray-200 px-2 py-1.5">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-2 py-1">Total (A)</td>
              {genders.map(([, k]) => (
                <td key={k} className="border border-gray-200 px-2 py-1">{inp(`${prefix}_${k}_t`, values, onChange)}</td>
              ))}
              <td className="border border-gray-200 px-2 py-1 font-mono calc-cell text-gray-600" role="status" aria-readonly="true">{totT}</td>
            </tr>
            {benefits.map(([label, b, letter]) => (
              <React.Fragment key={b}>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">{`${label} No. (${letter})`}</td>
                  {genders.map(([, k]) => (
                    <td key={k} className="border border-gray-200 px-2 py-1">{inp(`${prefix}_${k}_${b}`, values, onChange)}</td>
                  ))}
                  <td className="border border-gray-200 px-2 py-1 font-mono calc-cell text-gray-600" role="status" aria-readonly="true">{totByBenefit[b]}</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">{`${label} % (${letter}/A)`}</td>
                  {genders.map(([, k]) => (
                    <td key={k} className="border border-gray-200 px-2 py-1">
                      {calcVal(calcDisplay, `calc_${prefix}_${k}_${b}_pct`)}
                    </td>
                  ))}
                  <td className="border border-gray-200 px-2 py-1 font-mono calc-cell text-gray-600" role="status" aria-readonly="true">
                    {calcVal(calcDisplay, `calc_${prefix}_tot_${b}_pct`)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function P3EssentialContent({ values, calcDisplay = {}, onChange, reportingYear = "2024-25" }: Props) {
  const [fyCurrent, fyPrevious] = getFYLabelsFromReportingYear(reportingYear);

  return (
    <>
      <h3 className="text-sm font-semibold text-teal-400">1. Details of measures for the well-being of employees and workers</h3>
      <WellbeingTable title="a. i. % of employees covered - Permanent employees" prefix="p3_e1a_perm" values={values} calcDisplay={calcDisplay} onChange={onChange} />
      <WellbeingTable title="a. ii. % of employees covered - Other than Permanent employees" prefix="p3_e1a_oth" values={values} calcDisplay={calcDisplay} onChange={onChange} />
      <WellbeingTable title="b. i. % of workers covered - Permanent workers" prefix="p3_e1b_perm" values={values} calcDisplay={calcDisplay} onChange={onChange} />
      <WellbeingTable title="b. ii. % of workers covered - Other than Permanent workers" prefix="p3_e1b_oth" values={values} calcDisplay={calcDisplay} onChange={onChange} />

      <div>
        <h3 className="text-sm font-semibold text-teal-400">c. Spending on measures towards well-being of employees and workers</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">i. Cost incurred on wellbeing measures</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_e1c_cy_spend", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_e1c_py_spend", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">ii. Total revenue of the company</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_e1c_cy_rev", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_e1c_py_rev", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">iii. Cost incurred on wellbeing measures as a % of total revenue of the company</td>
                <td className="border border-gray-200 px-2 py-1">{calcVal(calcDisplay, "calc_p3_e1c_cy_pct")}</td>
                <td className="border border-gray-200 px-2 py-1">{calcVal(calcDisplay, "calc_p3_e1c_py_pct")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Details of retirement benefits</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Benefit</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">No. of employees covered as a % of total employees</th>
                <th className="border border-gray-200 px-2 py-1.5">No. of workers covered as a % of total workers</th>
                <th className="border border-gray-200 px-2 py-1.5">Deducted and deposited with the authority</th>
                <th className="border border-gray-200 px-2 py-1.5">No. of employees covered as a % of total employees</th>
                <th className="border border-gray-200 px-2 py-1.5">No. of workers covered as a % of total workers</th>
                <th className="border border-gray-200 px-2 py-1.5">Deducted and deposited with the authority</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["PF", "pf"],
                ["Gratuity", "gr"],
                ["ESI", "esi"],
                ["Others", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e2_${k}_emp_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e2_${k}_wrk_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <select value={values[`p3_e2_${k}_dep_cy`] ?? ""} onChange={(e) => onChange(`p3_e2_${k}_dep_cy`, e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">
                      {YES_NO_NA_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e2_${k}_emp_py`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e2_${k}_wrk_py`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <select value={values[`p3_e2_${k}_dep_py`] ?? ""} onChange={(e) => onChange(`p3_e2_${k}_dep_py`, e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">
                      {YES_NO_NA_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Accessibility of workplaces. Are the premises / offices of the entity accessible to differently abled employees and workers, as per the requirements of the Rights of Persons with Disabilities Act, 2016? If not, whether any steps are being taken by the entity in this regard.</h3>
        <div className="mt-2">
          <select value={values["p3_e3_access"] ?? ""} onChange={(e) => onChange("p3_e3_access", e.target.value)} className="rounded border border-gray-300 px-2 py-1.5 text-sm">
            {YES_NO_NA_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Does the entity have an equal opportunity policy as per the Rights of Persons with Disabilities Act, 2016?</h3>
        <div className="mt-2">
          <select value={values["p3_e4_equal"] ?? ""} onChange={(e) => onChange("p3_e4_equal", e.target.value)} className="rounded border border-gray-300 px-2 py-1.5 text-sm">
            {YES_NO_NA_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Return to work and Retention rates of permanent employees and workers that took parental leave.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Permanent Employees</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Permanent Workers</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Return to work rate</th>
                <th className="border border-gray-200 px-2 py-1.5">Retention rate</th>
                <th className="border border-gray-200 px-2 py-1.5">Return to work rate</th>
                <th className="border border-gray-200 px-2 py-1.5">Retention rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Male", "m"],
                ["Female", "f"],
                ["Other Gender", "o"],
                ["Total", "tot"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e5_${k}_emp_ret`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e5_${k}_emp_retn`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e5_${k}_wrk_ret`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p3_e5_${k}_wrk_retn`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Mechanism to receive and redress grievances</h3>
        <p className="mt-1 text-xs text-gray-600">i. Is there a mechanism available to receive and redress grievances for the following categories of employees and worker?</p>
        <div className="mt-2 flex gap-4">
          {["Yes", "No"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="p3_e6_yn" value={opt} checked={(values["p3_e6_yn"] ?? "") === opt} onChange={() => onChange("p3_e6_yn", opt)} className="rounded" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-600">ii. If yes, give details of the mechanism in brief.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Is mechanism available?</th>
                <th className="border border-gray-200 px-2 py-1.5">Details of Mechanism in brief</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Permanent Workers", "wrk_perm"],
                ["Other Than Permanent Workers", "wrk_oth"],
                ["Permanent Employees", "emp_perm"],
                ["Other Than Permanent Employees", "emp_oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <div className="flex gap-2">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex items-center gap-1">
                          <input type="radio" name={`p3_e6_${k}_yn`} value={opt} checked={(values[`p3_e6_${k}_yn`] ?? "") === opt} onChange={() => onChange(`p3_e6_${k}_yn`, opt)} className="rounded" />
                          <span className="text-xs">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e6_${k}`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Membership of employees and worker in association(s) or Unions recognised by the listed entity.</h3>
        <div className="mt-2 space-y-4">
          {[
            ["i. Total Permanent Employees", "emp"],
            ["ii. Total Permanent Workers", "wrk"],
          ].map(([title, grp]) => (
            <div key={grp}>
              <h4 className="text-xs font-medium text-gray-600">{title}</h4>
              <div className="mt-1 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                      <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                      <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                      <th className="border border-gray-200 px-2 py-1.5">Total</th>
                      <th className="border border-gray-200 px-2 py-1.5">No. in union</th>
                      <th className="border border-gray-200 px-2 py-1.5">%</th>
                      <th className="border border-gray-200 px-2 py-1.5">Total</th>
                      <th className="border border-gray-200 px-2 py-1.5">No. in union</th>
                      <th className="border border-gray-200 px-2 py-1.5">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Male", "m"],
                      ["Female", "f"],
                      ["Other Gender", "o"],
                      ["Total", "tot"],
                    ].map(([label, k]) => (
                      <tr key={k}>
                        <td className="border border-gray-200 px-2 py-1">{label}</td>
                        <td className="border border-gray-200 px-2 py-1">
                          {k === "tot" ? calcVal(calcDisplay, `calc_p3_e7_${grp}_tot_t_cy`) : inp(`p3_e7_${grp}_${k}_t_cy`, values, onChange)}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {k === "tot" ? calcVal(calcDisplay, `calc_p3_e7_${grp}_tot_u_cy`) : inp(`p3_e7_${grp}_${k}_u_cy`, values, onChange)}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">{calcVal(calcDisplay, `calc_p3_e7_${grp}_${k}_cy`)}</td>
                        <td className="border border-gray-200 px-2 py-1">
                          {k === "tot" ? calcVal(calcDisplay, `calc_p3_e7_${grp}_tot_t_py`) : inp(`p3_e7_${grp}_${k}_t_py`, values, onChange)}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {k === "tot" ? calcVal(calcDisplay, `calc_p3_e7_${grp}_tot_u_py`) : inp(`p3_e7_${grp}_${k}_u_py`, values, onChange)}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">{calcVal(calcDisplay, `calc_p3_e7_${grp}_${k}_py`)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Details of training given to employees and workers.</h3>
        <div className="mt-2 space-y-4">
          {[
            ["i. Employees", "emp", "cy", fyCurrent],
            ["ii. Employees", "emp", "py", fyPrevious],
            ["iii. Workers", "wrk", "cy", fyCurrent],
            ["iv. Workers", "wrk", "py", fyPrevious],
          ].map(([label, grp, yr, fyLabel]) => (
            <div key={`${grp}_${yr}`}>
              <h4 className="text-xs font-medium text-gray-600">{label} - {fyLabel}</h4>
              <div className="mt-1 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                      <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>On Health and safety measures</th>
                      <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>On Skill upgradation</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                      <th className="border border-gray-200 px-2 py-1.5"></th>
                      <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                      <th className="border border-gray-200 px-2 py-1.5">% (B/A)</th>
                      <th className="border border-gray-200 px-2 py-1.5">No. (C)</th>
                      <th className="border border-gray-200 px-2 py-1.5">% (C/A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Male", "m"],
                      ["Female", "f"],
                      ["Other Gender", "o"],
                      ["Total", "tot"],
                    ].map(([label, k]) => {
                      const yrSuffix = yr === "cy" ? "cy" : "py";
                      const isTot = k === "tot";
                      return (
                        <tr key={k}>
                          <td className="border border-gray-200 px-2 py-1">{label}</td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e8_${grp}_tot_t_${yrSuffix}`) : inp(`p3_e8_${grp}_${k}_t_${yr}`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e8_${grp}_tot_hs_${yrSuffix}`) : inp(`p3_e8_${grp}_${k}_hs_${yr}`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {calcVal(calcDisplay, isTot ? `calc_p3_e8_${grp}_tot_hs_${yrSuffix}_pct` : `calc_p3_e8_${grp}_${k}_hs_${yrSuffix}`)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e8_${grp}_tot_sk_${yrSuffix}`) : inp(`p3_e8_${grp}_${k}_sk_${yr}`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {calcVal(calcDisplay, isTot ? `calc_p3_e8_${grp}_tot_sk_${yrSuffix}_pct` : `calc_p3_e8_${grp}_${k}_sk_${yrSuffix}`)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Details of performance and career development reviews of employees</h3>
        <div className="mt-2 space-y-4">
          {[
            ["i. Employees", "emp"],
            ["ii. Workers", "wrk"],
          ].map(([title, grp]) => (
            <div key={grp}>
              <h4 className="text-xs font-medium text-gray-600">{title}</h4>
              <div className="mt-1 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                      <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                      <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
                    </tr>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                      <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                      <th className="border border-gray-200 px-2 py-1.5">% (B/A)</th>
                      <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                      <th className="border border-gray-200 px-2 py-1.5">% (B/A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Male", "m"],
                      ["Female", "f"],
                      ["Other Gender", "o"],
                      ["Total", "tot"],
                    ].map(([label, k]) => {
                      const isTot = k === "tot";
                      return (
                        <tr key={k}>
                          <td className="border border-gray-200 px-2 py-1">{label}</td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e9_${grp}_tot_t_cy`) : inp(`p3_e9_${grp}_${k}_t_cy`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e9_${grp}_tot_r_cy`) : inp(`p3_e9_${grp}_${k}_r_cy`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">{calcVal(calcDisplay, `calc_p3_e9_${grp}_${k}_cy`)}</td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e9_${grp}_tot_t_py`) : inp(`p3_e9_${grp}_${k}_t_py`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">
                            {isTot ? calcVal(calcDisplay, `calc_p3_e9_${grp}_tot_r_py`) : inp(`p3_e9_${grp}_${k}_r_py`, values, onChange)}
                          </td>
                          <td className="border border-gray-200 px-2 py-1">{calcVal(calcDisplay, `calc_p3_e9_${grp}_${k}_py`)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">10. Health and safety management system</h3>
        <div className="mt-2 space-y-4">
          <div>
            <p className="text-xs text-gray-600">i. Whether an occupational health and safety management system has been implemented by the entity?</p>
            <select value={values["p3_e10_impl_yn"] ?? ""} onChange={(e) => onChange("p3_e10_impl_yn", e.target.value)} className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm">
              {YES_NO_NA_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-600">ii. What are the processes used to identify work-related hazards and assess risks on a routine and non-routine basis by the entity?</p>
            <div className="mt-1">{ta("p3_e10_processes", values, onChange)}</div>
          </div>
          <div>
            <p className="text-xs text-gray-600">iii. Whether you have processes for workers to report the work related hazards and to remove themselves from such risks</p>
            <select value={values["p3_e10_report_yn"] ?? ""} onChange={(e) => onChange("p3_e10_report_yn", e.target.value)} className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm">
              {YES_NO_NA_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-600">iv. Do the employees/ worker of the entity have access to non-occupational medical and healthcare services?</p>
            <select value={values["p3_e10_medical_yn"] ?? ""} onChange={(e) => onChange("p3_e10_medical_yn", e.target.value)} className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm">
              {YES_NO_NA_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">11. Details of safety related incidents</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Metric</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyPrevious}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Employees</th>
                <th className="border border-gray-200 px-2 py-1.5">Workers</th>
                <th className="border border-gray-200 px-2 py-1.5">Employees</th>
                <th className="border border-gray-200 px-2 py-1.5">Workers</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Lost Time Injury Frequency Rate (LTIFR) (Per One Million Person Hours Worked)", "ltifr"],
                ["Total Recordable Work-Related Injuries", "rec"],
                ["No. Of Fatalities", "fat"],
                ["High Consequence Work-Related Injury Or Ill-Health (Excluding Fatalities)", "hc"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_emp_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_wrk_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_emp_py`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_wrk_py`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">12. Measures for safe and healthy work place</h3>
        <p className="mt-1 text-xs text-gray-600">Describe the measures taken by the entity to ensure a safe and healthy work place.</p>
        <div className="mt-2">{ta("p3_e12_measures", values, onChange)}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">13. Number of Complaints</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Filed during the year</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending resolution at the end of year</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
                <th className="border border-gray-200 px-2 py-1.5">Filed during the year</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending resolution at the end of year</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Working Conditions", "wc"],
                ["Health & Safety", "hs"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e13_${k}_cy_f`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e13_${k}_cy_p`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e13_${k}_cy_r`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e13_${k}_py_f`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e13_${k}_py_p`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e13_${k}_py_r`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">14. Assessments for the year</h3>
        <p className="mt-1 text-xs text-gray-600">% of your plants and offices that were assessed (by entity or statutory authorities or third parties)</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">% assessed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Health And Safety Practices</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p3_e14_hs", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Working Conditions</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p3_e14_wc", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">15. Corrective Action</h3>
        <p className="mt-1 text-xs text-gray-600">Provide details of any corrective action taken or underway to address safety-related incidents (if any) and on significant risks / concerns arising from assessments of health & safety practices and working conditions.</p>
        <div className="mt-2">{ta("p3_e15_corrective", values, onChange)}</div>
      </div>
    </>
  );
}

export function P3LeadershipContent({ values, onChange, reportingYear = "2024-25" }: Props) {
  const [fyCurrent, fyPrevious] = getFYLabelsFromReportingYear(reportingYear);

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Does the entity extend any life insurance or any compensatory package in the event of death.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[300px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Response</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Employees", "p3_l1_emp"],
                ["Workers", "p3_l1_wrk"],
              ].map(([label, code]) => (
                <tr key={code}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <div className="flex gap-4">
                      {["Yes", "No"].map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input type="radio" name={code} value={opt} checked={(values[code] ?? "") === opt} onChange={() => onChange(code, opt)} className="rounded" />
                          <span className="text-sm">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Provide the measures undertaken by the entity to ensure that statutory dues have been deducted and deposited by the value chain partners.</h3>
        <div className="mt-2">{ta("p3_l2_statutory", values, onChange)}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Provide the number of employees / workers having suffered high consequence work related injury / ill-health / fatalities (as reported in Q11 of Essential Indicators above), who have been rehabilitated and placed in suitable employment or whose family members have been placed in suitable employment</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyPrevious}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Employees</th>
                <th className="border border-gray-200 px-2 py-1.5">Workers</th>
                <th className="border border-gray-200 px-2 py-1.5">Employees</th>
                <th className="border border-gray-200 px-2 py-1.5">Workers</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Total No. Of Affected Employees/ Workers</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_emp_cy_t", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_wrk_cy_t", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_emp_py_t", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_wrk_py_t", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">No. Of Employees/Workers That Are Rehabilitated And Placed In Suitable Employment Or Whose Family Members Have Been Placed In Suitable Employment</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_emp_cy_r", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_wrk_cy_r", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_emp_py_r", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p3_l3_wrk_py_r", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Does the entity provide transition assistance programs to facilitate continued employability and the management of career endings resulting from retirement or termination of employment?</h3>
        <div className="mt-2">
          <select value={values["p3_l4_transition"] ?? ""} onChange={(e) => onChange("p3_l4_transition", e.target.value)} className="rounded border border-gray-300 px-2 py-1.5 text-sm">
            {YES_NO_NA_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Details on assessment of value chain partners.</h3>
        <p className="mt-1 text-xs text-gray-600">% of value chain partners (by value of business done with such partners) that were assessed</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">% assessed</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Health And Safety Practices</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p3_l5_hs", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Working Conditions</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p3_l5_wc", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from assessments of health and safety practices and working conditions of value chain partners.</h3>
        <div className="mt-2">{ta("p3_l6_corrective", values, onChange)}</div>
      </div>
    </>
  );
}
