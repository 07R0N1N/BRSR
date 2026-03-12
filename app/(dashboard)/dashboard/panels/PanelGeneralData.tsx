"use client";

import type { AnswersState } from "@/lib/brsr/types";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
};

export function PanelGeneralData({ values, calcDisplay, onChange }: Props) {
  const v = (code: string) => values[code] ?? "";
  const d = (code: string) => calcDisplay[code] ?? "";

  return (
    <section>
      <h1 className="text-xl font-semibold text-gray-900">General Data Gathering</h1>
      <p className="mt-1 text-sm text-gray-500">
        Enter once; values flow to intensity calculations and Principle 6.
      </p>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-indigo-600">Turnover & PPP</h3>
        <table className="mt-2 w-full max-w-2xl border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-left">Parameter</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Current FY</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Previous FY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Revenue from operations (Rs.)</td>
              <td className="border border-gray-200 px-3 py-2">
                <input
                  type="text"
                  value={v("gdata_turnover_cy")}
                  onChange={(e) => onChange("gdata_turnover_cy", e.target.value)}
                  placeholder="Rs."
                  className="w-full rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input
                  type="text"
                  value={v("gdata_turnover_py")}
                  onChange={(e) => onChange("gdata_turnover_py", e.target.value)}
                  placeholder="Rs."
                  className="w-full rounded border border-gray-300 px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">PPP factor</td>
              <td className="border border-gray-200 px-3 py-2">
                <input
                  type="text"
                  value={v("gdata_ppp_cy")}
                  onChange={(e) => onChange("gdata_ppp_cy", e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input
                  type="text"
                  value={v("gdata_ppp_py")}
                  onChange={(e) => onChange("gdata_ppp_py", e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full rounded border border-gray-300 px-2 py-1"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">
                Revenue adjusted for PPP (Rs.) <span className="text-gray-400">Revenue ÷ PPP factor</span>
              </td>
              <td className="border border-gray-200 px-3 py-2 bg-gray-50 font-mono text-gray-700">
                {d("gdata_rev_ppp_cy_display") || "—"}
              </td>
              <td className="border border-gray-200 px-3 py-2 bg-gray-50 font-mono text-gray-700">
                {d("gdata_rev_ppp_py_display") || "—"}
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-gray-500">
          These values auto-fill Principle 6 revenue and PPP-adjusted revenue fields.
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-indigo-600">Employee & worker counts</h3>
        <table className="mt-2 w-full max-w-2xl border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2 text-left">Category</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Male</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Female</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Others</th>
              <th className="border border-gray-200 px-3 py-2 text-left">Total (calc)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Employees – Permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_perm_m")} onChange={(e) => onChange("gdata_emp_perm_m", e.target.value)} className="w-full rounded border px-2 py-1" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_perm_f")} onChange={(e) => onChange("gdata_emp_perm_f", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_perm_o")} onChange={(e) => onChange("gdata_emp_perm_o", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2 bg-gray-50 font-mono">{d("gdata_emp_perm_sum") || "—"}</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Employees – Other than permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_oth_m")} onChange={(e) => onChange("gdata_emp_oth_m", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_oth_f")} onChange={(e) => onChange("gdata_emp_oth_f", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_oth_o")} onChange={(e) => onChange("gdata_emp_oth_o", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2 bg-gray-50 font-mono">{d("gdata_emp_oth_sum") || "—"}</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Workers – Permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_perm_m")} onChange={(e) => onChange("gdata_wrk_perm_m", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_perm_f")} onChange={(e) => onChange("gdata_wrk_perm_f", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_perm_o")} onChange={(e) => onChange("gdata_wrk_perm_o", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2 bg-gray-50 font-mono">{d("gdata_wrk_perm_sum") || "—"}</td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Workers – Other than permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_oth_m")} onChange={(e) => onChange("gdata_wrk_oth_m", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_oth_f")} onChange={(e) => onChange("gdata_wrk_oth_f", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_oth_o")} onChange={(e) => onChange("gdata_wrk_oth_o", e.target.value)} className="w-full rounded border px-2 py-1" />
              </td>
              <td className="border border-gray-200 px-3 py-2 bg-gray-50 font-mono">{d("gdata_wrk_oth_sum") || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-gray-500">Data is saved automatically. Changes here flow to Principle 6.</p>
    </section>
  );
}
