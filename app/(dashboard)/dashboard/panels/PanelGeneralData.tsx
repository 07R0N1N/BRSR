"use client";

import type { AnswersState } from "@/lib/brsr/types";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

export function PanelGeneralData({ values, calcDisplay, onChange, allowedSet = null }: Props) {
  const v = (code: string) => values[code] ?? "";
  const d = (code: string) => calcDisplay[code] ?? "";
  const showBlock = (prefixes: string[]) =>
    allowedSet === null || Array.from(allowedSet).some((code) => prefixes.some((p) => code.startsWith(p)));

  const calcCell = (displayValue: string) => (
    <td
      className="border border-gray-200 px-3 py-2 font-mono calc-cell"
      role="status"
      aria-readonly="true"
    >
      {displayValue || "—"}
    </td>
  );

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">General Data Gathering</h1>
      <p className="mt-1 text-xs text-slate-400">
        Enter once; values flow to intensity calculations and Principle 6.
      </p>

      <div className="mt-6">
        {showBlock(["gdata_turnover_", "gdata_ppp_"]) && (
          <>
            <h3 className="text-sm font-semibold text-teal-400">Turnover & PPP (for intensity calculations)</h3>
        <table className="mt-2 w-full max-w-3xl border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-3 py-2.5 text-left">Parameter</th>
              <th className="border border-gray-200 px-3 py-2.5 text-left">Current FY</th>
              <th className="border border-gray-200 px-3 py-2.5 text-left">Previous FY</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-2.5">Revenue from operations (Rs.)</td>
              <td className="border border-gray-200 px-3 py-2.5">
                <input
                  type="text"
                  value={v("gdata_turnover_cy")}
                  onChange={(e) => onChange("gdata_turnover_cy", e.target.value)}
                  placeholder="Rs."
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                />
              </td>
              <td className="border border-gray-200 px-3 py-2.5">
                <input
                  type="text"
                  value={v("gdata_turnover_py")}
                  onChange={(e) => onChange("gdata_turnover_py", e.target.value)}
                  placeholder="Rs."
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2.5">PPP factor</td>
              <td className="border border-gray-200 px-3 py-2.5">
                <input
                  type="text"
                  value={v("gdata_ppp_cy")}
                  onChange={(e) => onChange("gdata_ppp_cy", e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                />
              </td>
              <td className="border border-gray-200 px-3 py-2.5">
                <input
                  type="text"
                  value={v("gdata_ppp_py")}
                  onChange={(e) => onChange("gdata_ppp_py", e.target.value)}
                  placeholder="e.g. 1.2"
                  className="w-full rounded border border-gray-300 px-2 py-1.5"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2.5">
                Revenue adjusted for PPP (Rs.)
                <br />
                <small className="text-xs text-slate-400">Revenue ÷ PPP factor</small>
              </td>
              {calcCell(d("gdata_rev_ppp_cy_display"))}
              {calcCell(d("gdata_rev_ppp_py_display"))}
            </tr>
          </tbody>
        </table>
        <p className="mt-2 text-xs text-slate-400">
          These values auto-fill Principle 6 (Energy, Water, GHG, Waste) revenue and PPP-adjusted revenue fields so all intensity columns are calculated in one shot.
        </p>
          </>
        )}
      </div>

      <div className="mt-6 border-t border-slate-600 pt-6">
        {showBlock(["gdata_emp_", "gdata_wrk_"]) && (
          <>
        <h3 className="text-sm font-semibold text-teal-400">Employee & worker counts (for use across principles)</h3>
        <p className="mt-1 text-xs text-slate-400">
          Total headcount by gender and contract type. Use in Principle 3 and elsewhere.
        </p>
        <table className="mt-2 w-full max-w-3xl border-collapse border border-gray-200 text-sm">
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
                <input type="text" value={v("gdata_emp_perm_m")} onChange={(e) => onChange("gdata_emp_perm_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_perm_f")} onChange={(e) => onChange("gdata_emp_perm_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_perm_o")} onChange={(e) => onChange("gdata_emp_perm_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              {calcCell(d("gdata_emp_perm_sum"))}
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Employees – Other than permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_oth_m")} onChange={(e) => onChange("gdata_emp_oth_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_oth_f")} onChange={(e) => onChange("gdata_emp_oth_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_emp_oth_o")} onChange={(e) => onChange("gdata_emp_oth_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              {calcCell(d("gdata_emp_oth_sum"))}
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Workers – Permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_perm_m")} onChange={(e) => onChange("gdata_wrk_perm_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_perm_f")} onChange={(e) => onChange("gdata_wrk_perm_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_perm_o")} onChange={(e) => onChange("gdata_wrk_perm_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              {calcCell(d("gdata_wrk_perm_sum"))}
            </tr>
            <tr>
              <td className="border border-gray-200 px-3 py-2">Workers – Other than permanent</td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_oth_m")} onChange={(e) => onChange("gdata_wrk_oth_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_oth_f")} onChange={(e) => onChange("gdata_wrk_oth_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              <td className="border border-gray-200 px-3 py-2">
                <input type="text" value={v("gdata_wrk_oth_o")} onChange={(e) => onChange("gdata_wrk_oth_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." />
              </td>
              {calcCell(d("gdata_wrk_oth_sum"))}
            </tr>
          </tbody>
        </table>
          </>
        )}
      </div>
      <p className="mt-5 text-xs text-slate-400">
        Data is saved automatically. Changes here flow to Principle 6.
      </p>
    </section>
  );
}
