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

/** Min-wage 10-col row */
function MinWageRow({
  label, prefix, calcEqCy, calcMoreCy, calcEqPy, calcMorePy, values, calcDisplay, onChange,
}: {
  label: string;
  prefix: string;
  calcEqCy: string;
  calcMoreCy: string;
  calcEqPy: string;
  calcMorePy: string;
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
}) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <tr>
      <td className="border border-gray-200 px-2 py-1">{label}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_t_cy`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_eq_cy`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcEqCy)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_more_cy`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcMoreCy)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_t_py`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_eq_py`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcEqPy)}</td>
      <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_more_py`, values, onChange)}</td>
      <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcMorePy)}</td>
    </tr>
  );
}

export function P5EssentialContent({ values, calcDisplay, onChange }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Training on human rights</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Total (A)</th>
                <th className="border border-gray-200 px-2 py-1.5">Covered (B)</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Total</th>
                <th className="border border-gray-200 px-2 py-1.5">Covered</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
              </tr>
            </thead>
            <tbody>
              <TrainingRow label="Employees – Permanent" prefix="p5_e1_emp_perm" calcCy="calc_p5_pct_1" calcPy="calc_p5_pct_2" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              <TrainingRow label="Employees – Other than permanent" prefix="p5_e1_emp_oth" calcCy="calc_p5_pct_3" calcPy="calc_p5_pct_4" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              <TrainingRow label="Workers – Permanent" prefix="p5_e1_wrk_perm" calcCy="calc_p5_pct_5" calcPy="calc_p5_pct_6" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              <TrainingRow label="Workers – Other than permanent" prefix="p5_e1_wrk_oth" calcCy="calc_p5_pct_7" calcPy="calc_p5_pct_8" values={values} calcDisplay={calcDisplay} onChange={onChange} />
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Minimum wages (Equal to / More than minimum)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Total (A)</th>
                <th className="border border-gray-200 px-2 py-1.5">Equal to min No.</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
                <th className="border border-gray-200 px-2 py-1.5">More than min No.</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Total</th>
                <th className="border border-gray-200 px-2 py-1.5">Equal No.</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
                <th className="border border-gray-200 px-2 py-1.5">More No.</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
              </tr>
            </thead>
            <tbody>
              <MinWageRow label="Employees – Permanent Male" prefix="p5_e2_emp_pm" calcEqCy="calc_p5_pct_9" calcMoreCy="calc_p5_pct_10" calcEqPy="calc_p5_pct_11" calcMorePy="calc_p5_pct_12" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              <MinWageRow label="Employees – Permanent Female" prefix="p5_e2_emp_pf" calcEqCy="calc_p5_pct_13" calcMoreCy="calc_p5_pct_14" calcEqPy="calc_p5_pct_15" calcMorePy="calc_p5_pct_16" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              <MinWageRow label="Workers – Permanent Male" prefix="p5_e2_wrk_pm" calcEqCy="calc_p5_pct_17" calcMoreCy="calc_p5_pct_18" calcEqPy="calc_p5_pct_19" calcMorePy="calc_p5_pct_20" values={values} calcDisplay={calcDisplay} onChange={onChange} />
              <MinWageRow label="Workers – Permanent Female" prefix="p5_e2_wrk_pf" calcEqCy="calc_p5_pct_21" calcMoreCy="calc_p5_pct_22" calcEqPy="calc_p5_pct_23" calcMorePy="calc_p5_pct_24" values={values} calcDisplay={calcDisplay} onChange={onChange} />
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3(a). Median remuneration (BoD, KMP, Employees, Workers – Male/Female)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Male – No.</th>
                <th className="border border-gray-200 px-2 py-1.5">Male – Median (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Female – No.</th>
                <th className="border border-gray-200 px-2 py-1.5">Female – Median (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Board of Directors", "bod"],
                ["KMP", "kmp"],
                ["Employees (other than BoD/KMP)", "emp"],
                ["Workers", "wrk"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_m_n`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_m_med`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_f_n`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p5_e3a_${k}_f_med`, values, onChange, "Rs.")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3(b). Gross wages to females as % of total wages</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Female wages (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Total wages (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Female</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Total</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Gross wages</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_cy_f", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_cy_t", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_25")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_py_f", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p5_e3b_py_t", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_26")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Focal point for human rights (Y/N)</h3>
        <div className="mt-2">{inp("p5_e4_focal", values, onChange, "Y/N")}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Internal mechanisms for human rights grievances</h3>
        <textarea
          value={values["p5_e5_mech"] ?? ""}
          onChange={(e) => onChange("p5_e5_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Complaints (sexual harassment, discrimination, child labour, forced labour, wages, other)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Filed</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Filed</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Sexual harassment", "sh"],
                ["Discrimination", "disc"],
                ["Child labour", "cl"],
                ["Forced/Involuntary labour", "fl"],
                ["Wages", "wg"],
                ["Other", "oth"],
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
        <h3 className="text-sm font-semibold text-teal-400">7. POSH – Total complaints, % of female employees/workers, Complaints upheld</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Total POSH complaints</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_tot_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_tot_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Female employees/workers (total)</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_f_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_f_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">POSH as % of female (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_27")}</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p5_pct_28")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Complaints upheld</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_up_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p5_e7_up_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Mechanisms to prevent adverse consequences (discrimination/harassment)</h3>
        <textarea
          value={values["p5_e8_mech"] ?? ""}
          onChange={(e) => onChange("p5_e8_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Human rights in business agreements/contracts (Y/N)</h3>
        <div className="mt-2">{inp("p5_e9_contracts", values, onChange, "Y/N")}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">10. Assessments (% plants/offices) – Child labour, Forced labour, Sexual harassment, Discrimination, Wages, Others</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Category</th><th className="border border-gray-200 px-2 py-1.5">% assessed</th></tr></thead>
            <tbody>
              {[
                ["Child labour", "cl"],
                ["Forced/Involuntary labour", "fl"],
                ["Sexual harassment", "sh"],
                ["Discrimination", "disc"],
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
        <h3 className="text-sm font-semibold text-teal-400">11. Corrective actions</h3>
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
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Business process modified due to human rights grievances</h3>
        <textarea
          value={values["p5_l1_process"] ?? ""}
          onChange={(e) => onChange("p5_l1_process", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Human rights due diligence – scope and coverage</h3>
        <textarea
          value={values["p5_l2_scope"] ?? ""}
          onChange={(e) => onChange("p5_l2_scope", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Premises accessible to differently abled visitors (Y/N)</h3>
        <div className="mt-2">
          <input
            type="text"
            value={values["p5_l3_access"] ?? ""}
            onChange={(e) => onChange("p5_l3_access", e.target.value)}
            placeholder="Y/N"
            className="w-full max-w-xs rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Value chain partners assessed (%) – Sexual harassment, Discrimination, Child labour, Forced labour, Wages, Others</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Category</th><th className="border border-gray-200 px-2 py-1.5">% assessed</th></tr></thead>
            <tbody>
              {[
                ["Sexual harassment", "sh"],
                ["Discrimination", "disc"],
                ["Child labour", "cl"],
                ["Forced labour", "fl"],
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
        <h3 className="text-sm font-semibold text-teal-400">5. Corrective actions (value chain assessments)</h3>
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
