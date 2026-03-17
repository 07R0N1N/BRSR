"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { CalcCell } from "@/components/CalcCell";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
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

export function P1EssentialContent({ values, calcDisplay, onChange }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Percentage coverage by training and awareness programmes</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Segment</th>
                <th className="border border-gray-200 px-2 py-1.5">No. of programmes</th>
                <th className="border border-gray-200 px-2 py-1.5">Topics/principles &amp; impact</th>
                <th className="border border-gray-200 px-2 py-1.5">Total in category (A)</th>
                <th className="border border-gray-200 px-2 py-1.5">Covered (B)</th>
                <th className="border border-gray-200 px-2 py-1.5">% (B/A) calc</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Board of Directors</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_bod_prog", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_bod_topics", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_bod_total", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_bod_covered", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_pct_1")}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Key Managerial Personnel</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_kmp_prog", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_kmp_topics", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_kmp_total", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_kmp_covered", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_pct_2")}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Employees (other than BoD/KMP)</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_emp_prog", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_emp_topics", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_emp_total", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_emp_covered", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_pct_3")}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Workers</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_wrk_prog", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_wrk_topics", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_wrk_total", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e1_wrk_covered", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_pct_4")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Fines/penalties/punishment/award/compounding/settlement (monetary)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Type</th>
                <th className="border border-gray-200 px-2 py-1.5">NGRBC Principle</th>
                <th className="border border-gray-200 px-2 py-1.5">Regulator/agency</th>
                <th className="border border-gray-200 px-2 py-1.5">Amount (INR)</th>
                <th className="border border-gray-200 px-2 py-1.5">Brief of case</th>
                <th className="border border-gray-200 px-2 py-1.5">Appeal preferred? (Y/N)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Penalty/Fine", "pf"],
                ["Settlement", "set"],
                ["Compounding fee", "cmp"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_e2_${k}_principle`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_e2_${k}_agency`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_e2_${k}_amt`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_e2_${k}_brief`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p1_e2_${k}_appeal`, values, onChange, "Y/N")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Appeal/Revision details (where action appealed)</h3>
        <textarea
          value={values["p1_e3_appeal"] ?? ""}
          onChange={(e) => onChange("p1_e3_appeal", e.target.value)}
          rows={3}
          placeholder="Case details, authority"
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Anti-corruption / anti-bribery policy (Y/N). If yes, details and weblink</h3>
        <div className="mt-2">{inp("p1_e4_anticorr", values, onChange, "Y/N and weblink")}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Disciplinary action (law enforcement) – bribery/corruption</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Directors</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_dir_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_dir_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">KMPs</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_kmp_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_kmp_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Employees</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_emp_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_emp_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Workers</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_wrk_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e5_wrk_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Complaints – conflict of interest (Directors / KMPs)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – No.</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Remarks</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – No.</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Directors</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_dir_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_dir_cy_rem", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_dir_py", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_dir_py_rem", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">KMPs</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_kmp_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_kmp_cy_rem", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_kmp_py", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_e6_kmp_py_rem", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Corrective action on fines/penalties/corruption/conflict of interest</h3>
        <textarea
          value={values["p1_e7_corrective"] ?? ""}
          onChange={(e) => onChange("p1_e7_corrective", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Days of accounts payables (AP × 365 / Cost of goods procured)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Accounts payables (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_ap_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_ap_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Cost of goods/services procured (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_cost_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e8_cost_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Days (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_formula_1")}</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_formula_2")}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Open-ness – concentration of purchases/sales, RPTs</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Purchases from trading houses as % of total purchases</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_purch_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_purch_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Sales to dealers/distributors as % of total sales</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_sales_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_sales_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Related party – Purchases %</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_rpt_purch_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_rpt_purch_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Related party – Sales %</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_rpt_sales_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p1_e9_rpt_sales_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function P1LeadershipContent({ values, calcDisplay, onChange }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Awareness programmes for value chain partners</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">No. of programmes</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Topics/principles covered</th>
                <th className="border border-gray-200 px-2 py-1.5">Value chain partners – total business (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Partners covered (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">% covered (calc)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_l1_prog", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_l1_topics", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_l1_total_val", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p1_l1_covered_val", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p1_pct_5")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Processes to avoid/manage conflict of interests (Board)? (Y/N). If yes, details</h3>
        <div className="mt-2">{inp("p1_l2_conflict", values, onChange, "Y/N and details")}</div>
      </div>
    </>
  );
}
