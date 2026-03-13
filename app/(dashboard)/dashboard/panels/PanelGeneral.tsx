"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { isAllowed } from "@/lib/brsr/visibilityUtils";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

const v = (values: AnswersState, code: string) => values[code] ?? "";
const d = (calcDisplay: Record<string, string>, code: string) => calcDisplay[code] ?? "";

const ANNEXURE_II_URL = "https://www.sebi.gov.in/sebi_data/commondocs/jul-2023/Annexure_II-Updated-BRSR_p.PDF";
const MAX_TABLE_ROWS = 20;

function rowCount(values: AnswersState, code: string): number {
  const n = parseInt(values[code] || "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, MAX_TABLE_ROWS);
}

export function PanelGeneral({ values, calcDisplay, onChange, allowedSet = null }: Props) {
  const val = (code: string) => v(values, code);
  const disp = (code: string) => d(calcDisplay, code);
  const show = (code: string) => isAllowed(code, allowedSet);
  /** Show a subsection (e.g. table) if any question code with this prefix is allowed */
  const showBlock = (prefix: string) =>
    allowedSet === null || Array.from(allowedSet).some((c) => c.startsWith(prefix));

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">Section A: General Disclosures</h1>
      <p className="mt-1 text-xs text-slate-400">
        As per SEBI{" "}
        <a href={ANNEXURE_II_URL} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
          Annexure II – BRSR Format
        </a>
      </p>

      {/* I. Details of the listed entity */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-teal-400">I. Details of the listed entity</h3>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {show("gen_1_cin") && (
            <div>
              <label className="block text-xs text-gray-500">1. Corporate Identity Number (CIN)</label>
              <input type="text" value={val("gen_1_cin")} onChange={(e) => onChange("gen_1_cin", e.target.value)} placeholder="CIN" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_2_name") && (
            <div>
              <label className="block text-xs text-gray-500">2. Name of the Listed Entity</label>
              <input type="text" value={val("gen_2_name")} onChange={(e) => onChange("gen_2_name", e.target.value)} placeholder="Name" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_3_year_inc") && (
            <div>
              <label className="block text-xs text-gray-500">3. Year of incorporation</label>
              <input type="text" value={val("gen_3_year_inc")} onChange={(e) => onChange("gen_3_year_inc", e.target.value)} placeholder="Year" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
        {show("gen_4_registered_addr") && (
          <div className="mt-3">
            <label className="block text-xs text-gray-500">4. Registered office address</label>
            <input type="text" value={val("gen_4_registered_addr")} onChange={(e) => onChange("gen_4_registered_addr", e.target.value)} placeholder="Address" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        )}
        {show("gen_5_corporate_addr") && (
          <div className="mt-3">
            <label className="block text-xs text-gray-500">5. Corporate address</label>
            <input type="text" value={val("gen_5_corporate_addr")} onChange={(e) => onChange("gen_5_corporate_addr", e.target.value)} placeholder="Address" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        )}
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {show("gen_6_email") && (
            <div>
              <label className="block text-xs text-gray-500">6. E-mail</label>
              <input type="email" value={val("gen_6_email")} onChange={(e) => onChange("gen_6_email", e.target.value)} placeholder="Email" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_7_telephone") && (
            <div>
              <label className="block text-xs text-gray-500">7. Telephone</label>
              <input type="text" value={val("gen_7_telephone")} onChange={(e) => onChange("gen_7_telephone", e.target.value)} placeholder="Telephone" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_8_website") && (
            <div>
              <label className="block text-xs text-gray-500">8. Website</label>
              <input type="text" value={val("gen_8_website")} onChange={(e) => onChange("gen_8_website", e.target.value)} placeholder="Website" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {show("gen_9_fy") && (
            <div>
              <label className="block text-xs text-gray-500">9. Financial year for which reporting is being done</label>
              <input type="text" value={val("gen_9_fy")} onChange={(e) => onChange("gen_9_fy", e.target.value)} placeholder="e.g. FY 2024-25" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_10_stock_exchange") && (
            <div>
              <label className="block text-xs text-gray-500">10. Name of the Stock Exchange(s) where shares are listed</label>
              <input type="text" value={val("gen_10_stock_exchange")} onChange={(e) => onChange("gen_10_stock_exchange", e.target.value)} placeholder="Stock exchange(s)" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {show("gen_11_paidup_capital") && (
            <div>
              <label className="block text-xs text-gray-500">11. Paid-up Capital (Rs.)</label>
              <input type="text" value={val("gen_11_paidup_capital")} onChange={(e) => onChange("gen_11_paidup_capital", e.target.value)} placeholder="Amount" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_12_contact") && (
            <div>
              <label className="block text-xs text-gray-500">12. Name and contact (telephone, email) for BRSR queries</label>
              <input type="text" value={val("gen_12_contact")} onChange={(e) => onChange("gen_12_contact", e.target.value)} placeholder="Contact details" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {show("gen_13_boundary") && (
            <div>
              <label className="block text-xs text-gray-500">13. Reporting boundary</label>
              <select value={val("gen_13_boundary")} onChange={(e) => onChange("gen_13_boundary", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="">—</option>
                <option value="Standalone">Standalone</option>
                <option value="Consolidated">Consolidated</option>
              </select>
            </div>
          )}
          {show("gen_14_assurance_provider") && (
            <div>
              <label className="block text-xs text-gray-500">14. Name of assurance provider</label>
              <input type="text" value={val("gen_14_assurance_provider")} onChange={(e) => onChange("gen_14_assurance_provider", e.target.value)} placeholder="Name" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_15_assurance_type") && (
            <div>
              <label className="block text-xs text-gray-500">15. Type of assurance obtained</label>
              <select value={val("gen_15_assurance_type")} onChange={(e) => onChange("gen_15_assurance_type", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="">—</option>
                <option value="Limited">Limited</option>
                <option value="Reasonable">Reasonable</option>
                <option value="None">None</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* II. Products / Services */}
      {(showBlock("gen_16_") || showBlock("gen_17_")) && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">II. Products / Services</h3>
          {showBlock("gen_16_") && (
            <>
              <p className="mt-2 text-xs font-semibold text-gray-700">16. Details of business activities (accounting for 90% of turnover)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">S. No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Description of Main Activity</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Description of Business Activity</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">% of Turnover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rowCount(values, "gen_16_row_count") }, (_, i) => i + 1).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1.5">{i}</td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_16_${i}_main`)} onChange={(e) => onChange(`gen_16_${i}_main`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder={i === 1 ? "Main activity" : ""} /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_16_${i}_activity`)} onChange={(e) => onChange(`gen_16_${i}_activity`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder={i === 1 ? "Business activity" : ""} /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_16_${i}_pct`)} onChange={(e) => onChange(`gen_16_${i}_pct`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="%" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => onChange("gen_16_row_count", String(rowCount(values, "gen_16_row_count") + 1))}
                  disabled={rowCount(values, "gen_16_row_count") >= MAX_TABLE_ROWS}
                  className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add row
                </button>
              </div>
            </>
          )}
          {showBlock("gen_17_") && (
            <>
              <p className="mt-3 text-xs font-semibold text-gray-700">17. Products/Services sold (accounting for 90% of turnover)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">S. No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Product/Service</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">NIC Code</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">% of total Turnover</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rowCount(values, "gen_17_row_count") }, (_, i) => i + 1).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1.5">{i}</td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_17_${i}_product`)} onChange={(e) => onChange(`gen_17_${i}_product`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder={i === 1 ? "Product/Service" : ""} /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_17_${i}_nic`)} onChange={(e) => onChange(`gen_17_${i}_nic`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder={i === 1 ? "NIC" : ""} /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_17_${i}_pct`)} onChange={(e) => onChange(`gen_17_${i}_pct`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="%" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => onChange("gen_17_row_count", String(rowCount(values, "gen_17_row_count") + 1))}
                  disabled={rowCount(values, "gen_17_row_count") >= MAX_TABLE_ROWS}
                  className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add row
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* III. Operations */}
      {(showBlock("gen_18_") || showBlock("gen_19_") || show("gen_19b_export_pct") || show("gen_19c_customers")) && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">III. Operations</h3>
          {showBlock("gen_18_") && (
            <>
              <p className="mt-2 text-xs font-semibold text-gray-700">18. Number of locations (plants / operations / offices)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full max-w-xl border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Location</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Number of plants</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Number of offices</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total (calc)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">National</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_18_nat_plants")} onChange={(e) => onChange("gen_18_nat_plants", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_18_nat_offices")} onChange={(e) => onChange("gen_18_nat_offices", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                      <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_18_nat_sum") || "—"}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">International</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_18_int_plants")} onChange={(e) => onChange("gen_18_int_plants", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_18_int_offices")} onChange={(e) => onChange("gen_18_int_offices", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                      <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_18_int_sum") || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {showBlock("gen_19_") && (
            <>
              <p className="mt-3 text-xs font-semibold text-gray-700">19. Markets served</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full max-w-md border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Locations</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">National (No. of States)</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_19_nat_states")} onChange={(e) => onChange("gen_19_nat_states", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">International (No. of Countries)</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_19_int_countries")} onChange={(e) => onChange("gen_19_int_countries", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {show("gen_19b_export_pct") && (
            <div className="mt-3">
              <label className="block text-xs text-gray-500">19(b). Contribution of exports as % of total turnover</label>
              <input type="text" value={val("gen_19b_export_pct")} onChange={(e) => onChange("gen_19b_export_pct", e.target.value)} placeholder="%" className="mt-1 max-w-xs rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_19c_customers") && (
            <div className="mt-3">
              <label className="block text-xs text-gray-500">19(c). Brief on types of customers</label>
              <textarea value={val("gen_19c_customers")} onChange={(e) => onChange("gen_19c_customers", e.target.value)} rows={3} placeholder="Types of customers" className="mt-1 w-full max-w-xl rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
        </div>
      )}

      {/* IV. Employees */}
      {(showBlock("gen_20a_") || showBlock("gen_20b_")) && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">IV. Employees</h3>
          {showBlock("gen_20a_") && (
            <>
              <p className="mt-2 text-xs font-semibold text-gray-700">20(a). Employees and workers (including differently abled) – as at end of FY</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left">Particulars</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Male No.</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Male % (calc)</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Female No.</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Female % (calc)</th>
              </tr>
            </thead>
            <tbody>
              {[
                { row: "EMPLOYEES – Permanent (D)", total: "gen_20a_emp_perm_total", m: "gen_20a_emp_perm_m", f: "gen_20a_emp_perm_f", mPct: "gen_20a_emp_perm_m_pct", fPct: "gen_20a_emp_perm_f_pct" },
                { row: "Other than Permanent (E)", total: "gen_20a_emp_other_total", m: "gen_20a_emp_other_m", f: "gen_20a_emp_other_f", mPct: "gen_20a_emp_other_m_pct", fPct: "gen_20a_emp_other_f_pct" },
                { row: "Total employees (D+E)", total: "gen_20a_emp_total", m: "gen_20a_emp_total_m", f: "gen_20a_emp_total_f", noPct: true },
                { row: "WORKERS – Permanent (F)", total: "gen_20a_wrk_perm_total", m: "gen_20a_wrk_perm_m", f: "gen_20a_wrk_perm_f", mPct: "gen_20a_wrk_perm_m_pct", fPct: "gen_20a_wrk_perm_f_pct" },
                { row: "Other than Permanent (G)", total: "gen_20a_wrk_other_total", m: "gen_20a_wrk_other_m", f: "gen_20a_wrk_other_f", mPct: "gen_20a_wrk_other_m_pct", fPct: "gen_20a_wrk_other_f_pct" },
              ].map(({ row, total, m, f, mPct, fPct, noPct }) => (
                <tr key={row}>
                  <td className="border border-gray-200 px-2 py-1.5">{row}</td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(total)} onChange={(e) => onChange(total, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(m)} onChange={(e) => onChange(m, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{noPct ? "—" : (mPct && disp(mPct) ? `${disp(mPct)}%` : "—")}</td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(f)} onChange={(e) => onChange(f, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{noPct ? "—" : (fPct && disp(fPct) ? `${disp(fPct)}%` : "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
            </>
          )}
          {showBlock("gen_20b_") && (
            <>
              <p className="mt-3 text-xs font-semibold text-gray-700">20(b). Differently abled – Employees and workers</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Particulars</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male % (calc)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female % (calc)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Differently abled employees – Permanent", total: "gen_20b_emp_perm_total", m: "gen_20b_emp_perm_m", f: "gen_20b_emp_perm_f", mPct: "gen_20b_emp_perm_m_pct", fPct: "gen_20b_emp_perm_f_pct" },
                      { label: "Other than Permanent", total: "gen_20b_emp_other_total", m: "gen_20b_emp_other_m", f: "gen_20b_emp_other_f", mPct: "gen_20b_emp_other_m_pct", fPct: "gen_20b_emp_other_f_pct" },
                      { label: "Total differently abled employees", total: "gen_20b_emp_total", m: "", f: "", mPct: "", fPct: "" },
                      { label: "Differently abled workers – Permanent", total: "gen_20b_wrk_perm_total", m: "gen_20b_wrk_perm_m", f: "gen_20b_wrk_perm_f", mPct: "gen_20b_wrk_perm_m_pct", fPct: "gen_20b_wrk_perm_f_pct" },
                      { label: "Other than permanent", total: "gen_20b_wrk_other_total", m: "gen_20b_wrk_other_m", f: "gen_20b_wrk_other_f", mPct: "gen_20b_wrk_other_m_pct", fPct: "gen_20b_wrk_other_f_pct" },
                      { label: "Total differently abled workers", total: "gen_20b_wrk_total", m: "", f: "", mPct: "", fPct: "" },
                    ].map((r, i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1.5">{r.label}</td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(r.total)} onChange={(e) => onChange(r.total, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1">{r.m ? <input type="text" value={val(r.m)} onChange={(e) => onChange(r.m, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /> : "—"}</td>
                  <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{r.mPct ? (disp(r.mPct) ? `${disp(r.mPct)}%` : "—") : "—"}</td>
                  <td className="border border-gray-200 px-2 py-1">{r.f ? <input type="text" value={val(r.f)} onChange={(e) => onChange(r.f, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /> : "—"}</td>
                  <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{r.fPct ? (disp(r.fPct) ? `${disp(r.fPct)}%` : "—") : "—"}</td>
                </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {showBlock("gen_21_") && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-teal-400">21. Participation/Inclusion of women</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full max-w-2xl border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left"></th>
                <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                <th className="border border-gray-200 px-2 py-2 text-left">No. of Females (B)</th>
                <th className="border border-gray-200 px-2 py-2 text-left">% (B/A) (calc)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1.5">Board of Directors</td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_21_bod_total")} onChange={(e) => onChange("gen_21_bod_total", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_21_bod_f")} onChange={(e) => onChange("gen_21_bod_f", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_21_bod_pct") ? `${disp("gen_21_bod_pct")}%` : "—"}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1.5">Key Management Personnel</td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_21_kmp_total")} onChange={(e) => onChange("gen_21_kmp_total", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" value={val("gen_21_kmp_f")} onChange={(e) => onChange("gen_21_kmp_f", e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_21_kmp_pct") ? `${disp("gen_21_kmp_pct")}%` : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      )}

      {showBlock("gen_22_") && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-teal-400">22. Turnover rate for permanent employees and workers (past 3 years)</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left"></th>
                <th colSpan={3} className="border border-gray-200 px-2 py-2 text-center">Current FY</th>
                <th colSpan={3} className="border border-gray-200 px-2 py-2 text-center">Previous FY</th>
                <th colSpan={3} className="border border-gray-200 px-2 py-2 text-center">Year prior</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left"></th>
                <th className="border border-gray-200 px-2 py-2 text-center">Male</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Female</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Total</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Male</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Female</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Total</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Male</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Female</th>
                <th className="border border-gray-200 px-2 py-2 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1.5">Permanent Employees</td>
                {["gen_22_emp_cy_m", "gen_22_emp_cy_f", "gen_22_emp_cy_t", "gen_22_emp_py_m", "gen_22_emp_py_f", "gen_22_emp_py_t", "gen_22_emp_pp_m", "gen_22_emp_pp_f", "gen_22_emp_pp_t"].map((code) => (
                  <td key={code} className="border border-gray-200 px-2 py-1"><input type="text" value={val(code)} onChange={(e) => onChange(code, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                ))}
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1.5">Permanent Workers</td>
                {["gen_22_wrk_cy_m", "gen_22_wrk_cy_f", "gen_22_wrk_cy_t", "gen_22_wrk_py_m", "gen_22_wrk_py_f", "gen_22_wrk_py_t", "gen_22_wrk_pp_m", "gen_22_wrk_pp_f", "gen_22_wrk_pp_t"].map((code) => (
                  <td key={code} className="border border-gray-200 px-2 py-1"><input type="text" value={val(code)} onChange={(e) => onChange(code, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      )}

      {showBlock("gen_23_") && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">V. Holding, Subsidiary, Associate, Joint Ventures</h3>
          <p className="mt-2 text-xs font-semibold text-gray-700">23(a). Names of holding / subsidiary / associate / JVs</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left">S. No.</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Name (A)</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Holding/Subsidiary/Associate/JV</th>
                <th className="border border-gray-200 px-2 py-2 text-left">% shares held by listed entity</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Participates in BR initiatives? (Y/N)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount(values, "gen_23_row_count") }, (_, i) => i + 1).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1.5">{i}</td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_23_${i}_name`)} onChange={(e) => onChange(`gen_23_${i}_name`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_23_${i}_type`)} onChange={(e) => onChange(`gen_23_${i}_type`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder={i === 1 ? "e.g. Subsidiary" : ""} /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_23_${i}_pct`)} onChange={(e) => onChange(`gen_23_${i}_pct`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_23_${i}_br`)} onChange={(e) => onChange(`gen_23_${i}_br`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-2 flex justify-start">
          <button
            type="button"
            onClick={() => onChange("gen_23_row_count", String(rowCount(values, "gen_23_row_count") + 1))}
            disabled={rowCount(values, "gen_23_row_count") >= MAX_TABLE_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add row
          </button>
        </div>
        </div>
      )}

      {showBlock("gen_24_") && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">VI. CSR Details</h3>
          <p className="mt-2 text-xs font-semibold text-gray-700">24.</p>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-500">(i) CSR applicable u/s 135 Companies Act 2013?</label>
            <select value={val("gen_24_csr_applicable")} onChange={(e) => onChange("gen_24_csr_applicable", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="">—</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">(ii) Turnover (Rs.)</label>
            <input type="text" value={val("gen_24_turnover")} onChange={(e) => onChange("gen_24_turnover", e.target.value)} placeholder="Amount" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500">(iii) Net worth (Rs.)</label>
            <input type="text" value={val("gen_24_networth")} onChange={(e) => onChange("gen_24_networth", e.target.value)} placeholder="Amount" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
          </div>
        </div>
        </div>
      )}

      {showBlock("gen_25_") && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">VII. Transparency and Disclosures – Complaints/Grievances (Principles 1–9)</h3>
          <p className="mt-2 text-xs font-semibold text-gray-700">25. Complaints/Grievances by stakeholder group</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left">Stakeholder group</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Grievance mechanism (Y/N). If Yes, weblink</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Current FY – Filed</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Current FY – Pending</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Remarks</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Previous FY – Filed</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Previous FY – Pending</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Communities", p: "comm" },
                { label: "Investors (other than shareholders)", p: "inv" },
                { label: "Shareholders", p: "sha" },
                { label: "Employees and workers", p: "emp" },
                { label: "Customers", p: "cust" },
                { label: "Value Chain Partners", p: "vc" },
                { label: "Other (specify)", p: "oth" },
              ].map(({ label, p }) => (
                <tr key={p}>
                  <td className="border border-gray-200 px-2 py-1.5">{label}</td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_mech`)} onChange={(e) => onChange(`gen_25_${p}_mech`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_cy_f`)} onChange={(e) => onChange(`gen_25_${p}_cy_f`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_cy_p`)} onChange={(e) => onChange(`gen_25_${p}_cy_p`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_cy_rem`)} onChange={(e) => onChange(`gen_25_${p}_cy_rem`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_py_f`)} onChange={(e) => onChange(`gen_25_${p}_py_f`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_py_p`)} onChange={(e) => onChange(`gen_25_${p}_py_p`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_py_rem`)} onChange={(e) => onChange(`gen_25_${p}_py_rem`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          {showBlock("gen_26_") && (
            <>
              <p className="mt-3 text-xs font-semibold text-gray-700">26. Material responsible business conduct issues (environmental & social)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">S. No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Material issue</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Risk or Opportunity (R/O)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Rationale</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Approach to adapt/mitigate</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Financial implications (+/-)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rowCount(values, "gen_26_row_count") }, (_, i) => i + 1).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1.5">{i}</td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_issue`)} onChange={(e) => onChange(`gen_26_${i}_issue`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_ro`)} onChange={(e) => onChange(`gen_26_${i}_ro`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder={i === 1 ? "R/O" : ""} /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_rationale`)} onChange={(e) => onChange(`gen_26_${i}_rationale`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_approach`)} onChange={(e) => onChange(`gen_26_${i}_approach`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_fin`)} onChange={(e) => onChange(`gen_26_${i}_fin`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex justify-start">
                <button
                  type="button"
                  onClick={() => onChange("gen_26_row_count", String(rowCount(values, "gen_26_row_count") + 1))}
                  disabled={rowCount(values, "gen_26_row_count") >= MAX_TABLE_ROWS}
                  className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add row
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">Data is saved automatically.</p>
    </section>
  );
}
