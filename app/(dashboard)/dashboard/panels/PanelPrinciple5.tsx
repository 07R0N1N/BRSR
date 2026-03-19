"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { CalcCell } from "@/components/CalcCell";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";

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

/** Shorthand for a 6-col training coverage row: Total(A), Covered(B), %(cy), Total(A), Covered(B), %(py) */
function TrainingRow({
  label, prefix, calcCy, calcPy, values, calcDisplay, onChange,
}: {
  label: string;
  prefix: string;
  calcCy: string;
  calcPy: string;
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
}) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <tr>
      <td className="border border-gray-200 px-2 py-1">{label}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_t_cy`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_c_cy`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcCy)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_t_py`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_c_py`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcPy)}</td>
    </tr>
  );
}

/** Total row (calculated from perm + oth) */
function TrainingRowTotal({
  label, totTCy, totTPy, totCCy, totCPy, calcCy, calcPy, calcDisplay,
}: {
  label: string;
  totTCy: string;
  totTPy: string;
  totCCy: string;
  totCPy: string;
  calcCy: string;
  calcPy: string;
  calcDisplay: Record<string, string>;
}) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <tr>
      <td className="border border-gray-200 px-2 py-1 font-semibold">{label}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totTCy)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totCCy)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcCy)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totTPy)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totCPy)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcPy)}</td>
    </tr>
  );
}

/** Min-wage row for a single FY (6 cols: Total, Eq No., % B/A, More No., % C/A) */
function MinWageRowFY({
  label, prefix, suffix, calcEq, calcMore, values, calcDisplay, onChange,
}: {
  label: string;
  prefix: string;
  suffix: "cy" | "py";
  calcEq: string;
  calcMore: string;
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
}) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  const t = `${prefix}_t_${suffix}`;
  const eq = `${prefix}_eq_${suffix}`;
  const more = `${prefix}_more_${suffix}`;
  return (
    <tr>
      <td className="border border-gray-200 px-2 py-1">{label}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(t, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(eq, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcEq)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(more, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcMore)}</td>
    </tr>
  );
}

/** Min-wage Total row (calculated) for a single FY */
function MinWageRowTotalFY({
  label, totT, totEq, totMore, calcEq, calcMore, calcDisplay,
}: {
  label: string;
  totT: string;
  totEq: string;
  totMore: string;
  calcEq: string;
  calcMore: string;
  calcDisplay: Record<string, string>;
}) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <tr>
      <td className="border border-gray-200 px-2 py-1 font-semibold">{label}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totT)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totEq)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcEq)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(totMore)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcMore)}</td>
    </tr>
  );
}

export function P5EssentialContent({ values, calcDisplay, onChange, reportingYear = "2024-25" }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  const [fyCurrent, fyPrevious] = getFYLabelsFromReportingYear(reportingYear);
  const e4 = values["p5_e4_focal"] ?? "";
  const e4Yes = e4 === "Yes" || e4 === "Y" || e4 === "y";
  const e4No = e4 === "No" || e4 === "N" || e4 === "n";
  const e9 = values["p5_e9_contracts"] ?? "";
  const e9Val = e9 === "Y" || e9 === "y" ? "Yes" : e9 === "N" || e9 === "n" ? "No" : e9 === "NA" || e9 === "na" ? "NA" : e9;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Employees and workers who have been provided training on human rights issues and policy(ies) of the entity</h3>
        <div className="mt-2 space-y-4 overflow-x-auto">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">i. Employees</p>
            <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. of employees covered (B)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (B / A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (C)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. of employees covered (D)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (D / C)</th>
                </tr>
              </thead>
              <tbody>
                <TrainingRow label="Permanent" prefix="p5_e1_emp_perm" calcCy="calc_p5_pct_1" calcPy="calc_p5_pct_2" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <TrainingRow label="Other Than Permanent" prefix="p5_e1_emp_oth" calcCy="calc_p5_pct_3" calcPy="calc_p5_pct_4" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <TrainingRowTotal label="Total Employees" totTCy="calc_p5_e1_emp_tot_t_cy" totTPy="calc_p5_e1_emp_tot_t_py" totCCy="calc_p5_e1_emp_tot_c_cy" totCPy="calc_p5_e1_emp_tot_c_py" calcCy="calc_p5_e1_emp_tot_pct_cy" calcPy="calc_p5_e1_emp_tot_pct_py" calcDisplay={calcDisplay} />
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">ii. Workers</p>
            <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. of workers covered (B)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (B / A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (C)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. of workers covered (D)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (D / C)</th>
                </tr>
              </thead>
              <tbody>
                <TrainingRow label="Permanent" prefix="p5_e1_wrk_perm" calcCy="calc_p5_pct_5" calcPy="calc_p5_pct_6" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <TrainingRow label="Other Than Permanent" prefix="p5_e1_wrk_oth" calcCy="calc_p5_pct_7" calcPy="calc_p5_pct_8" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <TrainingRowTotal label="Total Workers" totTCy="calc_p5_e1_wrk_tot_t_cy" totTPy="calc_p5_e1_wrk_tot_t_py" totCCy="calc_p5_e1_wrk_tot_c_cy" totCPy="calc_p5_e1_wrk_tot_c_py" calcCy="calc_p5_e1_wrk_tot_pct_cy" calcPy="calc_p5_e1_wrk_tot_pct_py" calcDisplay={calcDisplay} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Details of minimum wages paid to employees and workers</h3>
        <div className="mt-2 space-y-4 overflow-x-auto">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">i. Employees – {fyCurrent}</p>
            <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Location</th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Equal to Minimum Wage</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>More than Minimum Wage</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5"></th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (B / A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (C)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (C / A)</th>
                </tr>
              </thead>
              <tbody>
                <MinWageRowTotalFY label="Total Permanent" totT="calc_p5_e2_emp_perm_tot_t_cy" totEq="calc_p5_e2_emp_perm_tot_eq_cy" totMore="calc_p5_e2_emp_perm_tot_more_cy" calcEq="calc_p5_e2_emp_perm_tot_eq_pct_cy" calcMore="calc_p5_e2_emp_perm_tot_more_pct_cy" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Permanent Male" prefix="p5_e2_emp_pm" suffix="cy" calcEq="calc_p5_pct_9" calcMore="calc_p5_pct_10" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Female" prefix="p5_e2_emp_pf" suffix="cy" calcEq="calc_p5_pct_13" calcMore="calc_p5_pct_14" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Other Gender" prefix="p5_e2_emp_po" suffix="cy" calcEq="calc_p5_e2_emp_po_eq_cy" calcMore="calc_p5_e2_emp_po_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowTotalFY label="Total Other Than Permanent" totT="calc_p5_e2_emp_otp_tot_t_cy" totEq="calc_p5_e2_emp_otp_tot_eq_cy" totMore="calc_p5_e2_emp_otp_tot_more_cy" calcEq="calc_p5_e2_emp_otp_tot_eq_pct_cy" calcMore="calc_p5_e2_emp_otp_tot_more_pct_cy" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Other than Permanent Male" prefix="p5_e2_emp_otp_m" suffix="cy" calcEq="calc_p5_e2_emp_otp_m_eq_cy" calcMore="calc_p5_e2_emp_otp_m_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Female" prefix="p5_e2_emp_otp_f" suffix="cy" calcEq="calc_p5_e2_emp_otp_f_eq_cy" calcMore="calc_p5_e2_emp_otp_f_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Other Gender" prefix="p5_e2_emp_otp_o" suffix="cy" calcEq="calc_p5_e2_emp_otp_o_eq_cy" calcMore="calc_p5_e2_emp_otp_o_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">ii. Employees – {fyPrevious}</p>
            <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Location</th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Equal to Minimum Wage</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>More than Minimum Wage</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5"></th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (B / A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (C)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (C / A)</th>
                </tr>
              </thead>
              <tbody>
                <MinWageRowTotalFY label="Total Permanent" totT="calc_p5_e2_emp_perm_tot_t_py" totEq="calc_p5_e2_emp_perm_tot_eq_py" totMore="calc_p5_e2_emp_perm_tot_more_py" calcEq="calc_p5_e2_emp_perm_tot_eq_pct_py" calcMore="calc_p5_e2_emp_perm_tot_more_pct_py" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Permanent Male" prefix="p5_e2_emp_pm" suffix="py" calcEq="calc_p5_pct_11" calcMore="calc_p5_pct_12" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Female" prefix="p5_e2_emp_pf" suffix="py" calcEq="calc_p5_pct_15" calcMore="calc_p5_pct_16" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Other Gender" prefix="p5_e2_emp_po" suffix="py" calcEq="calc_p5_e2_emp_po_eq_py" calcMore="calc_p5_e2_emp_po_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowTotalFY label="Total Other Than Permanent" totT="calc_p5_e2_emp_otp_tot_t_py" totEq="calc_p5_e2_emp_otp_tot_eq_py" totMore="calc_p5_e2_emp_otp_tot_more_py" calcEq="calc_p5_e2_emp_otp_tot_eq_pct_py" calcMore="calc_p5_e2_emp_otp_tot_more_pct_py" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Other than Permanent Male" prefix="p5_e2_emp_otp_m" suffix="py" calcEq="calc_p5_e2_emp_otp_m_eq_py" calcMore="calc_p5_e2_emp_otp_m_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Female" prefix="p5_e2_emp_otp_f" suffix="py" calcEq="calc_p5_e2_emp_otp_f_eq_py" calcMore="calc_p5_e2_emp_otp_f_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Other Gender" prefix="p5_e2_emp_otp_o" suffix="py" calcEq="calc_p5_e2_emp_otp_o_eq_py" calcMore="calc_p5_e2_emp_otp_o_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">iii. Workers – {fyCurrent}</p>
            <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Location</th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Equal to Minimum Wage</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>More than Minimum Wage</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5"></th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (B / A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (C)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (C / A)</th>
                </tr>
              </thead>
              <tbody>
                <MinWageRowTotalFY label="Total Permanent" totT="calc_p5_e2_wrk_perm_tot_t_cy" totEq="calc_p5_e2_wrk_perm_tot_eq_cy" totMore="calc_p5_e2_wrk_perm_tot_more_cy" calcEq="calc_p5_e2_wrk_perm_tot_eq_pct_cy" calcMore="calc_p5_e2_wrk_perm_tot_more_pct_cy" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Permanent Male" prefix="p5_e2_wrk_pm" suffix="cy" calcEq="calc_p5_pct_17" calcMore="calc_p5_pct_18" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Female" prefix="p5_e2_wrk_pf" suffix="cy" calcEq="calc_p5_pct_21" calcMore="calc_p5_pct_22" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Other Gender" prefix="p5_e2_wrk_po" suffix="cy" calcEq="calc_p5_e2_wrk_po_eq_cy" calcMore="calc_p5_e2_wrk_po_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowTotalFY label="Total Other Than Permanent" totT="calc_p5_e2_wrk_otp_tot_t_cy" totEq="calc_p5_e2_wrk_otp_tot_eq_cy" totMore="calc_p5_e2_wrk_otp_tot_more_cy" calcEq="calc_p5_e2_wrk_otp_tot_eq_pct_cy" calcMore="calc_p5_e2_wrk_otp_tot_more_pct_cy" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Other than Permanent Male" prefix="p5_e2_wrk_otp_m" suffix="cy" calcEq="calc_p5_e2_wrk_otp_m_eq_cy" calcMore="calc_p5_e2_wrk_otp_m_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Female" prefix="p5_e2_wrk_otp_f" suffix="cy" calcEq="calc_p5_e2_wrk_otp_f_eq_cy" calcMore="calc_p5_e2_wrk_otp_f_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Other Gender" prefix="p5_e2_wrk_otp_o" suffix="cy" calcEq="calc_p5_e2_wrk_otp_o_eq_cy" calcMore="calc_p5_e2_wrk_otp_o_more_cy" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">iv. Workers – {fyPrevious}</p>
            <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Location</th>
                  <th className="border border-gray-200 px-2 py-1.5">Total (A)</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Equal to Minimum Wage</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>More than Minimum Wage</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5"></th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (B)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (B / A)</th>
                  <th className="border border-gray-200 px-2 py-1.5">No. (C)</th>
                  <th className="border border-gray-200 px-2 py-1.5">% (C / A)</th>
                </tr>
              </thead>
              <tbody>
                <MinWageRowTotalFY label="Total Permanent" totT="calc_p5_e2_wrk_perm_tot_t_py" totEq="calc_p5_e2_wrk_perm_tot_eq_py" totMore="calc_p5_e2_wrk_perm_tot_more_py" calcEq="calc_p5_e2_wrk_perm_tot_eq_pct_py" calcMore="calc_p5_e2_wrk_perm_tot_more_pct_py" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Permanent Male" prefix="p5_e2_wrk_pm" suffix="py" calcEq="calc_p5_pct_19" calcMore="calc_p5_pct_20" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Female" prefix="p5_e2_wrk_pf" suffix="py" calcEq="calc_p5_pct_23" calcMore="calc_p5_pct_24" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Permanent Other Gender" prefix="p5_e2_wrk_po" suffix="py" calcEq="calc_p5_e2_wrk_po_eq_py" calcMore="calc_p5_e2_wrk_po_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowTotalFY label="Total Other Than Permanent" totT="calc_p5_e2_wrk_otp_tot_t_py" totEq="calc_p5_e2_wrk_otp_tot_eq_py" totMore="calc_p5_e2_wrk_otp_tot_more_py" calcEq="calc_p5_e2_wrk_otp_tot_eq_pct_py" calcMore="calc_p5_e2_wrk_otp_tot_more_pct_py" calcDisplay={calcDisplay} />
                <MinWageRowFY label="Other than Permanent Male" prefix="p5_e2_wrk_otp_m" suffix="py" calcEq="calc_p5_e2_wrk_otp_m_eq_py" calcMore="calc_p5_e2_wrk_otp_m_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Female" prefix="p5_e2_wrk_otp_f" suffix="py" calcEq="calc_p5_e2_wrk_otp_f_eq_py" calcMore="calc_p5_e2_wrk_otp_f_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
                <MinWageRowFY label="Other than Permanent Other Gender" prefix="p5_e2_wrk_otp_o" suffix="py" calcEq="calc_p5_e2_wrk_otp_o_eq_py" calcMore="calc_p5_e2_wrk_otp_o_more_py" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Details of remuneration/salary/wages</h3>
        <div className="mt-2 space-y-4 overflow-x-auto">
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">i. Median remuneration / wages</p>
            <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Male</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Female</th>
                  <th className="border border-gray-200 px-2 py-1.5" colSpan={2}>Other Gender</th>
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5">Number</th>
                  <th className="border border-gray-200 px-2 py-1.5">Median remuneration / salary / wages (in INR)</th>
                  <th className="border border-gray-200 px-2 py-1.5">Number</th>
                  <th className="border border-gray-200 px-2 py-1.5">Median remuneration / salary / wages (in INR)</th>
                  <th className="border border-gray-200 px-2 py-1.5">Number</th>
                  <th className="border border-gray-200 px-2 py-1.5">Median remuneration / salary / wages (in INR)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Board Of Directors (BoD)", "bod"],
                  ["Key Managerial Personnel", "kmp"],
                  ["Employees Other Than BoD And KMP", "emp"],
                  ["Workers", "wrk"],
                ].map(([label, k]) => (
                  <tr key={k}>
                    <td className="border border-gray-200 px-2 py-1">{label}</td>
                    <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_m_n`, values, onChange)}</td>
                    <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_m_med`, values, onChange, "Rs.")}</td>
                    <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_f_n`, values, onChange)}</td>
                    <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_f_med`, values, onChange, "Rs.")}</td>
                    <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_o_n`, values, onChange)}</td>
                    <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_o_med`, values, onChange, "Rs.")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-gray-500">ii. Gross wages paid to females</p>
            <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                  <th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th>
                  <th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">Gross Wages Paid To Females</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_cy_f", values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_py_f", values, onChange, "Rs.")}</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">Total Wages</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_cy_t", values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_py_t", values, onChange, "Rs.")}</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">Gross Wages Paid To Females As % Of Total Wages</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_25")}</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_26")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Do you have a focal point (Individual/ Committee) responsible for addressing human rights impacts or issues caused or contributed to by the business?</h3>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center gap-1.5">
            <input type="radio" name="p5_e4_focal" checked={e4Yes} onChange={() => onChange("p5_e4_focal", "Yes")} className="rounded-full" />
            <span className="text-sm">Yes</span>
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input type="radio" name="p5_e4_focal" checked={e4No} onChange={() => onChange("p5_e4_focal", "No")} className="rounded-full" />
            <span className="text-sm">No</span>
          </label>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Describe the internal mechanisms in place to redress grievances related to human rights issues.</h3>
        <textarea
          value={values["p5_e5_mech"] ?? ""}
          onChange={(e) => onChange("p5_e5_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Number of Complaints on the following made by employees and workers</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Particulars</th>
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
                ["Sexual Harassment", "sh"],
                ["Discrimination At Workplace", "disc"],
                ["Child Labour", "cl"],
                ["Forced Labour/ Involuntary Labour", "fl"],
                ["Wages", "wg"],
                ["Other Human Rights Related Issues", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e6_${k}_cy_f`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e6_${k}_cy_p`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e6_${k}_cy_r`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e6_${k}_py_f`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e6_${k}_py_p`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e6_${k}_py_r`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Complaints filed under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, in the following format:</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Total Complaints Reported Under Sexual Harassment On Of Women At Workplace (Prevention, Prohibition And Redressal) Act, 2013 (POSH)</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_tot_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_tot_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Female Employees/ Workers</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_f_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_f_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Complaints On POSH As A % Of Female Employees / Workers</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_27")}</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_28")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Complaints On POSH Upheld</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_up_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_up_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Mechanisms to prevent adverse consequences to the complainant in discrimination and harassment cases.</h3>
        <textarea
          value={values["p5_e8_mech"] ?? ""}
          onChange={(e) => onChange("p5_e8_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Do human rights requirements form part of your business agreements and contracts?</h3>
        <div className="mt-2">
          <select
            value={e9Val}
            onChange={(e) => onChange("p5_e9_contracts", e.target.value)}
            className="w-full max-w-xs rounded border border-gray-300 px-2 py-1 text-sm"
          >
            <option value="">Choose option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="NA">NA</option>
          </select>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">10. Assessment for the year</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">% of your plants and offices that were assessed(by entity or statutory authorities or third parties)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sexual Harassment", "sh"],
                ["Discrimination At Workplace", "disc"],
                ["Child Labour", "cl"],
                ["Forced Labour/Involuntary Labour", "fl"],
                ["Wages", "wg"],
                ["Others", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e10_${k}`, values, onChange, "%")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">11. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 10 above.</h3>
        <textarea
          value={values["p5_e11_corrective"] ?? ""}
          onChange={(e) => onChange("p5_e11_corrective", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
    </>
  );
}

export function P5LeadershipContent({ values, onChange }: Props) {
  const l3 = values["p5_l3_access"] ?? "";
  const l3Yes = l3 === "Yes" || l3 === "Y" || l3 === "y";
  const l3No = l3 === "No" || l3 === "N" || l3 === "n";
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Details of a business process being modified / introduced as a result of addressing human rights grievances/complaints.</h3>
        <textarea
          value={values["p5_l1_process"] ?? ""}
          onChange={(e) => onChange("p5_l1_process", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Details of the scope and coverage of any Human rights due-diligence conducted.</h3>
        <textarea
          value={values["p5_l2_scope"] ?? ""}
          onChange={(e) => onChange("p5_l2_scope", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Is the premise/office of the entity accessible to differently abled visitors, as per the requirements of the Rights of Persons with Disabilities Act, 2016?</h3>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center gap-1.5">
            <input type="radio" name="p5_l3_access" checked={l3Yes} onChange={() => onChange("p5_l3_access", "Yes")} className="rounded-full" />
            <span className="text-sm">Yes</span>
          </label>
          <label className="inline-flex items-center gap-1.5">
            <input type="radio" name="p5_l3_access" checked={l3No} onChange={() => onChange("p5_l3_access", "No")} className="rounded-full" />
            <span className="text-sm">No</span>
          </label>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Details on assessment of value chain partners</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">% of value chain partners (by value of business done with such partners) that were assessed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sexual Harassment", "sh"],
                ["Discrimination At Workplace", "disc"],
                ["Child Labour", "cl"],
                ["Forced Labour/Involuntary Labour", "fl"],
                ["Wages", "wg"],
                ["Others", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <input
                      type="text"
                      value={values[`p5_l4_${k}`] ?? ""}
                      onChange={(e) => onChange(`p5_l4_${k}`, e.target.value)}
                      placeholder="%"
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 4 above.</h3>
        <textarea
          value={values["p5_l5_corrective"] ?? ""}
          onChange={(e) => onChange("p5_l5_corrective", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
    </>
  );
}
