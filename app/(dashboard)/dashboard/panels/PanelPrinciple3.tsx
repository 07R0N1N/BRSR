"use client";

import type { AnswersState } from "@/lib/brsr/types";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
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

/**
 * E1a / E1b – Benefits table (Employees / Workers)
 * Columns: Total, Health insurance, Accident coverage, Maternity, Paternity, Day-care
 */
function BenefitsTable({
  title, prefix, values, onChange,
}: {
  title: string;
  prefix: string; // e.g. "p3_e1a" or "p3_e1b"
  values: AnswersState;
  onChange: (code: string, value: string) => void;
}) {
  const cols = ["hi", "ac", "mat", "pat", "dc"];
  const colLabels = ["Health insurance", "Accident cover", "Maternity", "Paternity", "Day-care"];
  const rows = [
    ["Permanent – Male", "perm_m"],
    ["Permanent – Female", "perm_f"],
    ["Other than permanent – Male", "oth_m"],
    ["Other than permanent – Female", "oth_f"],
  ];
  return (
    <div>
      <h3 className="text-sm font-semibold text-teal-400">{title}</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
              <th className="border border-gray-200 px-2 py-1.5">Total</th>
              {colLabels.map((l) => (
                <th key={l} className="border border-gray-200 px-2 py-1.5">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, k]) => (
              <tr key={k}>
                <td className="border border-gray-200 px-2 py-1">{label}</td>
                <td className="border border-gray-200 px-2 py-1">{inp(`${prefix}_${k}_t`, values, onChange)}</td>
                {cols.map((c) => (
                  <td key={c} className="border border-gray-200 px-2 py-1">{inp(`${prefix}_${k}_${c}`, values, onChange)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * E7 / E8 / E9 – Turnover / Training / Hazard tables by gender × employee/worker
 */
function TurnoverTable({
  title, prefix, fields, fieldLabels, values, onChange,
}: {
  title: string;
  prefix: string; // e.g. "p3_e7"
  fields: string[];
  fieldLabels: string[];
  values: AnswersState;
  onChange: (code: string, value: string) => void;
}) {
  const rows = [
    ["Employees – Male (CY)", "emp_m", "cy"],
    ["Employees – Male (PY)", "emp_m", "py"],
    ["Employees – Female (CY)", "emp_f", "cy"],
    ["Employees – Female (PY)", "emp_f", "py"],
    ["Workers – Male (CY)", "wrk_m", "cy"],
    ["Workers – Female (CY)", "wrk_f", "cy"],
  ];
  return (
    <div>
      <h3 className="text-sm font-semibold text-teal-400">{title}</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
              {fieldLabels.map((l) => (
                <th key={l} className="border border-gray-200 px-2 py-1.5">{l}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, k, yr]) => (
              <tr key={`${k}_${yr}`}>
                <td className="border border-gray-200 px-2 py-1">{label}</td>
                {fields.map((f) => (
                  <td key={f} className="border border-gray-200 px-2 py-1">
                    {inp(`${prefix}_${k}_${f}_${yr}`, values, onChange)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function P3EssentialContent({ values, onChange }: Props) {
  return (
    <>
      <BenefitsTable title="1a. Employee benefits" prefix="p3_e1a" values={values} onChange={onChange} />
      <BenefitsTable title="1b. Worker benefits" prefix="p3_e1b" values={values} onChange={onChange} />

      <div>
        <h3 className="text-sm font-semibold text-teal-400">1c. Expenditure on well-being (CY / PY)</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {[
            ["CY spend (Rs.)", "p3_e1c_cy_spend"],
            ["CY % of revenue", "p3_e1c_cy_rev"],
            ["PY spend (Rs.)", "p3_e1c_py_spend"],
            ["PY % of revenue", "p3_e1c_py_rev"],
          ].map(([label, code]) => (
            <div key={code}>
              <label className="block text-xs text-gray-500">{label}</label>
              {inp(code, values, onChange)}
            </div>
          ))}
        </div>
      </div>

      {/* E2 – Retirement benefits */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Retirement benefits (PF, Gratuity, ESI, Others)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Benefit</th>
                <th className="border border-gray-200 px-2 py-1.5">Emp (CY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Wrk (CY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Dep (CY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Emp (PY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Wrk (PY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Dep (PY)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Provident Fund", "pf"],
                ["Gratuity", "gr"],
                ["ESI", "esi"],
                ["Others", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e2_${k}_emp_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e2_${k}_wrk_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e2_${k}_dep_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e2_${k}_emp_py`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e2_${k}_wrk_py`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e2_${k}_dep_py`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Accessibility of premises for differently abled</h3>
        <div className="mt-2">{inp("p3_e3_access", values, onChange, "Y/N or describe")}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Equal opportunity policy (Y/N)</h3>
        <div className="mt-2">{inp("p3_e4_equal", values, onChange, "Y/N")}</div>
      </div>

      {/* E5 – Return-to-work / retention rates */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Return-to-work and retention rates (parental leave)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Return-to-work rate (%)</th>
                <th className="border border-gray-200 px-2 py-1.5">Retention rate (%)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Male – Employees", "m_emp"],
                ["Male – Workers", "m_wrk"],
                ["Female – Employees", "f_emp"],
                ["Female – Workers", "f_wrk"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e5_${k}_ret`, values, onChange, "%")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e5_${k}_retn`, values, onChange, "%")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E6 – Membership of employee/worker associations */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Employee / worker associations / unions</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {[
            ["Workers – Permanent", "p3_e6_wrk_perm"],
            ["Workers – Other", "p3_e6_wrk_oth"],
            ["Employees – Permanent", "p3_e6_emp_perm"],
            ["Employees – Other", "p3_e6_emp_oth"],
          ].map(([label, code]) => (
            <div key={code}>
              <label className="block text-xs text-gray-500">{label}</label>
              {inp(code, values, onChange)}
            </div>
          ))}
        </div>
      </div>

      {/* E7 – Turnover */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Employee / worker turnover (Total, Union)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Total</th>
                <th className="border border-gray-200 px-2 py-1.5">Union</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Employees – Male (CY)", "emp_m", "cy"],
                ["Employees – Male (PY)", "emp_m", "py"],
                ["Employees – Female (CY)", "emp_f", "cy"],
                ["Employees – Female (PY)", "emp_f", "py"],
                ["Workers – Male (CY)", "wrk_m", "cy"],
                ["Workers – Female (CY)", "wrk_f", "cy"],
              ].map(([label, k, yr]) => (
                <tr key={`${k}_${yr}`}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e7_${k}_t_${yr}`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e7_${k}_u_${yr}`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E8 – Training */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Training (Total, Health &amp; Safety, Skill upgradation)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Total</th>
                <th className="border border-gray-200 px-2 py-1.5">H&amp;S</th>
                <th className="border border-gray-200 px-2 py-1.5">Skill</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Employees – Male (CY)", "emp_m", "cy"],
                ["Employees – Male (PY)", "emp_m", "py"],
                ["Employees – Female (CY)", "emp_f", "cy"],
                ["Employees – Female (PY)", "emp_f", "py"],
                ["Workers – Male (CY)", "wrk_m", "cy"],
                ["Workers – Male (PY)", "wrk_m", "py"],
                ["Workers – Female (CY)", "wrk_f", "cy"],
                ["Workers – Female (PY)", "wrk_f", "py"],
              ].map(([label, k, yr]) => (
                <tr key={`${k}_${yr}`}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e8_${k}_t_${yr}`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e8_${k}_hs_${yr}`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e8_${k}_sk_${yr}`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* E9 – Performance / career development */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Performance & career development reviews (Total, Reviewed)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Total</th>
                <th className="border border-gray-200 px-2 py-1.5">Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Employees – Male (CY)", "emp_m", "cy"],
                ["Employees – Male (PY)", "emp_m", "py"],
                ["Employees – Female (CY)", "emp_f", "cy"],
                ["Employees – Female (PY)", "emp_f", "py"],
                ["Workers – Male (CY)", "wrk_m", "cy"],
                ["Workers – Male (PY)", "wrk_m", "py"],
                ["Workers – Female (CY)", "wrk_f", "cy"],
                ["Workers – Female (PY)", "wrk_f", "py"],
              ].map(([label, k, yr]) => (
                <tr key={`${k}_${yr}`}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e9_${k}_t_${yr}`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e9_${k}_r_${yr}`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">10. Health and safety management system</h3>
        <div className="mt-2">{ta("p3_e10_hs", values, onChange)}</div>
      </div>

      {/* E11 – Safety statistics */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">11. Safety statistics (LTIFR, Recordable injuries, Fatalities, High-consequence cases)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Metric</th>
                <th className="border border-gray-200 px-2 py-1.5">Emp – CY</th>
                <th className="border border-gray-200 px-2 py-1.5">Emp – PY</th>
                <th className="border border-gray-200 px-2 py-1.5">Wrk – CY</th>
                <th className="border border-gray-200 px-2 py-1.5">Wrk – PY</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["LTIFR", "ltifr"],
                ["Recordable injuries", "rec"],
                ["Fatalities", "fat"],
                ["High-consequence cases", "hc"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_emp_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_emp_py`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_wrk_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_e11_${k}_wrk_py`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">12. Measures to prevent / recover from unsafe incidents</h3>
        <div className="mt-2">{ta("p3_e12_measures", values, onChange)}</div>
      </div>

      {/* E13 – Complaints */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">13. Complaints (working conditions / H&S)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">CY – Filed</th>
                <th className="border border-gray-200 px-2 py-1.5">CY – Pending</th>
                <th className="border border-gray-200 px-2 py-1.5">CY – Remarks</th>
                <th className="border border-gray-200 px-2 py-1.5">PY – Filed</th>
                <th className="border border-gray-200 px-2 py-1.5">PY – Pending</th>
                <th className="border border-gray-200 px-2 py-1.5">PY – Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Working conditions", "wc"],
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
        <h3 className="text-sm font-semibold text-teal-400">14. Assessments (% of plants/offices) – H&S, Working conditions</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">H&S (%)</label>
            {inp("p3_e14_hs", values, onChange, "%")}
          </div>
          <div>
            <label className="block text-xs text-gray-500">Working conditions (%)</label>
            {inp("p3_e14_wc", values, onChange, "%")}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">15. Corrective actions</h3>
        <div className="mt-2">{ta("p3_e15_corrective", values, onChange)}</div>
      </div>
    </>
  );
}

export function P3LeadershipContent({ values, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L1. Benefits not mandated by law (Employees / Workers)</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Employees</label>
            {ta("p3_l1_emp", values, onChange, 2)}
          </div>
          <div>
            <label className="block text-xs text-gray-500">Workers</label>
            {ta("p3_l1_wrk", values, onChange, 2)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">L2. Transport, canteen, housing – % statutory vs. non-statutory</h3>
        <div className="mt-2">{ta("p3_l2_statutory", values, onChange)}</div>
      </div>

      {/* L3 – Grievances */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L3. Grievances filed and resolved (Employees / Workers, CY / PY)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Filed (CY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Filed (PY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Resolved (CY)</th>
                <th className="border border-gray-200 px-2 py-1.5">Resolved (PY)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Employees", "emp"],
                ["Workers", "wrk"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_l3_${k}_cy_t`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_l3_${k}_py_t`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_l3_${k}_cy_r`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p3_l3_${k}_py_r`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">L4. Transition assistance for retirement / separation</h3>
        <div className="mt-2">{ta("p3_l4_transition", values, onChange)}</div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">L5. Assessments (value chain) – H&S / Working conditions</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">H&S (%)</label>
            {inp("p3_l5_hs", values, onChange, "%")}
          </div>
          <div>
            <label className="block text-xs text-gray-500">Working conditions (%)</label>
            {inp("p3_l5_wc", values, onChange, "%")}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-teal-400">L6. Corrective actions (value chain)</h3>
        <div className="mt-2">{ta("p3_l6_corrective", values, onChange)}</div>
      </div>
    </>
  );
}
