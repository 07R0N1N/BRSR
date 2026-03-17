"use client";

import React from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { REPORTING_YEARS } from "@/lib/brsr/constants";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";
import { isAllowed } from "@/lib/brsr/visibilityUtils";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
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

export function PanelGeneral({ values, calcDisplay, onChange, allowedSet = null, reportingYear = "2024-25" }: Props) {
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
              <label className="block text-xs text-gray-500">3. Date of Incorporation</label>
              <input type="date" value={val("gen_3_year_inc")} onChange={(e) => onChange("gen_3_year_inc", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
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
              <label className="block text-xs text-gray-500">6. E-mail address</label>
              <input type="email" value={val("gen_6_email")} onChange={(e) => onChange("gen_6_email", e.target.value)} placeholder="Email" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_7_telephone") && (
            <div>
              <label className="block text-xs text-gray-500">7. Telephone No.</label>
              <input type="tel" value={val("gen_7_telephone")} onChange={(e) => { const v = e.target.value; if (/^[0-9+ ]*$/.test(v)) onChange("gen_7_telephone", v); }} placeholder="e.g. +91 33 2288 9371" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
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
              <select value={val("gen_9_fy")} onChange={(e) => onChange("gen_9_fy", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="">Choose option</option>
                {REPORTING_YEARS.map((y) => (
                  <option key={y} value={y}>FY {y}</option>
                ))}
              </select>
            </div>
          )}
          {showBlock("gen_10_") && (
            <div className="col-span-full">
              <p className="text-xs font-semibold text-gray-700">10. Name of the Stock Exchange(s) where shares are listed</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Name of The Stock Exchange</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Description of other stock exchange</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Name of the Country</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rowCount(values, "gen_10_row_count") }, (_, i) => i + 1).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1">
                          <select value={val(`gen_10_${i}_exchange`)} onChange={(e) => onChange(`gen_10_${i}_exchange`, e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">
                            <option value="">Choose</option>
                            <option value="NSE">NSE</option>
                            <option value="BSE">BSE</option>
                            <option value="MSEI">MSEI</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_10_${i}_description`)} onChange={(e) => onChange(`gen_10_${i}_description`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="If Other" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_10_${i}_country`)} onChange={(e) => onChange(`gen_10_${i}_country`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="Country" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex justify-start">
                <button type="button" onClick={() => onChange("gen_10_row_count", String(rowCount(values, "gen_10_row_count") + 1))} disabled={rowCount(values, "gen_10_row_count") >= MAX_TABLE_ROWS} className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50">+ADD</button>
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {show("gen_11_paidup_capital") && (
            <div>
              <label className="block text-xs text-gray-500">11. Paid-up Capital (Rs.)</label>
              <input type="text" inputMode="decimal" value={val("gen_11_paidup_capital")} onChange={(e) => { const v = e.target.value; if (/^[0-9.]*$/.test(v)) onChange("gen_11_paidup_capital", v); }} placeholder="Amount" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
            </div>
          )}
          {show("gen_12_contact") && (
            <div className="col-span-full space-y-3">
              <p className="text-xs font-semibold text-gray-700">12. Name and contact details of the person who may be contacted in case of any queries on the BRSR report</p>
              {(() => {
                const raw = val("gen_12_contact");
                const parts = raw ? raw.split("\n") : [];
                const [name, number, email] = parts.length === 3 ? [parts[0], parts[1], parts[2]] : [raw ?? "", "", ""];
                const update = (n: string, num: string, e: string) => onChange("gen_12_contact", [n, num, e].join("\n"));
                return (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs text-gray-500">Name of the contact person</label>
                      <input type="text" value={name} onChange={(e) => update(e.target.value, number, email)} placeholder="Name" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Contact number of the contact person</label>
                      <input type="tel" value={number} onChange={(e) => { const v = e.target.value; if (/^[0-9+ ]*$/.test(v)) update(name, v, email); }} placeholder="e.g. +91 33 2288 9371" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500">Email of the contact person</label>
                      <input type="email" value={email} onChange={(e) => update(name, number, e.target.value)} placeholder="Email" className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm" />
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {show("gen_13_boundary") && (
            <div>
              <label className="block text-xs text-gray-500">13. Reporting boundary - Are the disclosures under this report made on a standalone basis (i.e. only for the entity) or on a consolidated basis (i.e. for the entity and all the entities which form a part of its consolidated financial statements, taken together).</label>
              <select value={val("gen_13_boundary")} onChange={(e) => onChange("gen_13_boundary", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm">
                <option value="">Choose option</option>
                <option value="Standalone Basis">Standalone Basis</option>
                <option value="Consolidated Basis">Consolidated Basis</option>
              </select>
            </div>
          )}
          {showBlock("gen_14_") && (
            <div className="col-span-full">
              <p className="text-xs font-semibold text-gray-700">14. Details of Assurer(s)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Company / LLP / Firm Name</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Company ID / LLP ID / Firm Registration No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Name of the Assurer</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Designation Of Assurer</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Date of signing by Assurer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rowCount(values, "gen_14_row_count") }, (_, i) => i + 1).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_14_${i}_company`)} onChange={(e) => onChange(`gen_14_${i}_company`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="Company/LLP/Firm" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_14_${i}_id`)} onChange={(e) => onChange(`gen_14_${i}_id`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="ID/Registration No." /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_14_${i}_assurer_name`)} onChange={(e) => onChange(`gen_14_${i}_assurer_name`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="Name" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_14_${i}_designation`)} onChange={(e) => onChange(`gen_14_${i}_designation`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" placeholder="Designation" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="date" value={val(`gen_14_${i}_date`)} onChange={(e) => onChange(`gen_14_${i}_date`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-2 flex justify-start">
                <button type="button" onClick={() => onChange("gen_14_row_count", String(rowCount(values, "gen_14_row_count") + 1))} disabled={rowCount(values, "gen_14_row_count") >= MAX_TABLE_ROWS} className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50">+ADD</button>
              </div>
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
                        <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="decimal" value={val(`gen_16_${i}_pct`)} onChange={(e) => { const v = e.target.value; if (v === "" || (/^\d*\.?\d*$/.test(v) && (() => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 100; })())) onChange(`gen_16_${i}_pct`, v); }} className="w-full rounded border px-2 py-1 text-sm" placeholder="0-100" /></td>
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
                        <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="decimal" value={val(`gen_17_${i}_pct`)} onChange={(e) => { const v = e.target.value; if (v === "" || (/^\d*\.?\d*$/.test(v) && (() => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 100; })())) onChange(`gen_17_${i}_pct`, v); }} className="w-full rounded border px-2 py-1 text-sm" placeholder="0-100" /></td>
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
              <p className="mt-2 text-xs font-semibold text-gray-700">18. Number of locations where plants and/or operations/offices of the entity are situated</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full max-w-xl border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Location</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Number of plants</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Number of offices</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">National</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_18_nat_plants")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_18_nat_plants", v); }} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_18_nat_offices")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_18_nat_offices", v); }} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                      <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_18_nat_sum") || "—"}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">International</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_18_int_plants")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_18_int_plants", v); }} className="w-full rounded border px-2 py-1 text-sm" /></td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_18_int_offices")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_18_int_offices", v); }} className="w-full rounded border px-2 py-1 text-sm" /></td>
                      <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_18_int_sum") || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {showBlock("gen_19_") && (
            <>
              <p className="mt-3 text-xs font-semibold text-gray-700">19. Markets served by the entity</p>
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
                      <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_19_nat_states")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_19_nat_states", v); }} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-2 py-1.5">International (No. of Countries)</td>
                      <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_19_int_countries")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_19_int_countries", v); }} className="w-full rounded border px-2 py-1 text-sm" placeholder="No." /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
          {show("gen_19b_export_pct") && (
            <div className="mt-3">
              <label className="block text-xs text-gray-500">19(b). Contribution of exports as % of total turnover</label>
              <input type="text" inputMode="decimal" value={val("gen_19b_export_pct")} onChange={(e) => { const v = e.target.value; if (v === "" || (/^\d*\.?\d*$/.test(v) && (() => { const n = parseFloat(v); return !isNaN(n) && n >= 0 && n <= 100; })())) onChange("gen_19b_export_pct", v); }} placeholder="0-100" className="mt-1 max-w-xs rounded border border-gray-300 px-3 py-2 text-sm" />
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

      {/* IV. Employees – 20. Details as at the end of Financial Year */}
      {(showBlock("gen_20a_") || showBlock("gen_20b_")) && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">IV. Employees</h3>
          <p className="mt-2 text-xs font-semibold text-gray-700">20. Details as at the end of Financial Year</p>

          {showBlock("gen_20a_") && (
            <>
              <p className="mt-3 text-xs font-medium text-gray-600">i. Employees (including differently abled)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Particulars</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male No. (B)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male % (B/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female No. (C)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female % (C/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender No. (D)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender % (D/A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { row: "Permanent (E)", total: "gen_20a_emp_perm_total", m: "gen_20a_emp_perm_m", f: "gen_20a_emp_perm_f", o: "gen_20a_emp_perm_o", mPct: "gen_20a_emp_perm_m_pct", fPct: "gen_20a_emp_perm_f_pct", oPct: "gen_20a_emp_perm_o_pct" },
                      { row: "Other Than Permanent (F)", total: "gen_20a_emp_other_total", m: "gen_20a_emp_other_m", f: "gen_20a_emp_other_f", o: "gen_20a_emp_other_o", mPct: "gen_20a_emp_other_m_pct", fPct: "gen_20a_emp_other_f_pct", oPct: "gen_20a_emp_other_o_pct" },
                      { row: "Total Employees (E+F)", total: "gen_20a_emp_total", m: "gen_20a_emp_total_m", f: "gen_20a_emp_total_f", o: "gen_20a_emp_total_o", mPct: "gen_20a_emp_total_m_pct", fPct: "gen_20a_emp_total_f_pct", oPct: "gen_20a_emp_total_o_pct", isCalc: true },
                    ].map((r) => (
                      <tr key={r.row}>
                        <td className="border border-gray-200 px-2 py-1.5">{r.row}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.total) || "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.m) || "—") : <input type="text" inputMode="numeric" value={val(r.m)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.m, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.mPct) ? `${disp(r.mPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.f) || "—") : <input type="text" inputMode="numeric" value={val(r.f)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.f, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.fPct) ? `${disp(r.fPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.o) || "—") : <input type="text" inputMode="numeric" value={val(r.o)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.o, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.oPct) ? `${disp(r.oPct)}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs font-medium text-gray-600">ii. Workers (including differently abled)</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Particulars</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male No. (B)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male % (B/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female No. (C)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female % (C/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender No. (D)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender % (D/A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { row: "Permanent (E)", total: "gen_20a_wrk_perm_total", m: "gen_20a_wrk_perm_m", f: "gen_20a_wrk_perm_f", o: "gen_20a_wrk_perm_o", mPct: "gen_20a_wrk_perm_m_pct", fPct: "gen_20a_wrk_perm_f_pct", oPct: "gen_20a_wrk_perm_o_pct" },
                      { row: "Other Than Permanent (F)", total: "gen_20a_wrk_other_total", m: "gen_20a_wrk_other_m", f: "gen_20a_wrk_other_f", o: "gen_20a_wrk_other_o", mPct: "gen_20a_wrk_other_m_pct", fPct: "gen_20a_wrk_other_f_pct", oPct: "gen_20a_wrk_other_o_pct" },
                      { row: "Total Workers (E+F)", total: "gen_20a_wrk_total", m: "gen_20a_wrk_total_m", f: "gen_20a_wrk_total_f", o: "gen_20a_wrk_total_o", mPct: "gen_20a_wrk_total_m_pct", fPct: "gen_20a_wrk_total_f_pct", oPct: "gen_20a_wrk_total_o_pct", isCalc: true },
                    ].map((r) => (
                      <tr key={r.row}>
                        <td className="border border-gray-200 px-2 py-1.5">{r.row}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.total) || "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.m) || "—") : <input type="text" inputMode="numeric" value={val(r.m)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.m, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.mPct) ? `${disp(r.mPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.f) || "—") : <input type="text" inputMode="numeric" value={val(r.f)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.f, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.fPct) ? `${disp(r.fPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.o) || "—") : <input type="text" inputMode="numeric" value={val(r.o)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.o, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.oPct) ? `${disp(r.oPct)}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {showBlock("gen_20b_") && (
            <>
              <p className="mt-4 text-xs font-medium text-gray-600">iii. Differently abled Employees</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Particulars</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male No. (B)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male % (B/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female No. (C)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female % (C/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender No. (D)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender % (D/A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { row: "Permanent (E)", total: "gen_20b_emp_perm_total", m: "gen_20b_emp_perm_m", f: "gen_20b_emp_perm_f", o: "gen_20b_emp_perm_o", mPct: "gen_20b_emp_perm_m_pct", fPct: "gen_20b_emp_perm_f_pct", oPct: "gen_20b_emp_perm_o_pct" },
                      { row: "Other Than Permanent (F)", total: "gen_20b_emp_other_total", m: "gen_20b_emp_other_m", f: "gen_20b_emp_other_f", o: "gen_20b_emp_other_o", mPct: "gen_20b_emp_other_m_pct", fPct: "gen_20b_emp_other_f_pct", oPct: "gen_20b_emp_other_o_pct" },
                      { row: "Total Employees (E+F)", total: "gen_20b_emp_total", m: "gen_20b_emp_total_m", f: "gen_20b_emp_total_f", o: "gen_20b_emp_total_o", mPct: "gen_20b_emp_total_m_pct", fPct: "gen_20b_emp_total_f_pct", oPct: "gen_20b_emp_total_o_pct", isCalc: true },
                    ].map((r) => (
                      <tr key={r.row}>
                        <td className="border border-gray-200 px-2 py-1.5">{r.row}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.total) || "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.m) || "—") : <input type="text" inputMode="numeric" value={val(r.m)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.m, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.mPct) ? `${disp(r.mPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.f) || "—") : <input type="text" inputMode="numeric" value={val(r.f)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.f, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.fPct) ? `${disp(r.fPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.o) || "—") : <input type="text" inputMode="numeric" value={val(r.o)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.o, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.oPct) ? `${disp(r.oPct)}` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-xs font-medium text-gray-600">iv. Differently abled Workers</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">Particulars</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male No. (B)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Male % (B/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female No. (C)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Female % (C/A)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender No. (D)</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Other Gender % (D/A)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { row: "Permanent (E)", total: "gen_20b_wrk_perm_total", m: "gen_20b_wrk_perm_m", f: "gen_20b_wrk_perm_f", o: "gen_20b_wrk_perm_o", mPct: "gen_20b_wrk_perm_m_pct", fPct: "gen_20b_wrk_perm_f_pct", oPct: "gen_20b_wrk_perm_o_pct" },
                      { row: "Other Than Permanent (F)", total: "gen_20b_wrk_other_total", m: "gen_20b_wrk_other_m", f: "gen_20b_wrk_other_f", o: "gen_20b_wrk_other_o", mPct: "gen_20b_wrk_other_m_pct", fPct: "gen_20b_wrk_other_f_pct", oPct: "gen_20b_wrk_other_o_pct" },
                      { row: "Total Workers (E+F)", total: "gen_20b_wrk_total", m: "gen_20b_wrk_total_m", f: "gen_20b_wrk_total_f", o: "gen_20b_wrk_total_o", mPct: "gen_20b_wrk_total_m_pct", fPct: "gen_20b_wrk_total_f_pct", oPct: "gen_20b_wrk_total_o_pct", isCalc: true },
                    ].map((r) => (
                      <tr key={r.row}>
                        <td className="border border-gray-200 px-2 py-1.5">{r.row}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.total) || "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.m) || "—") : <input type="text" inputMode="numeric" value={val(r.m)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.m, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.mPct) ? `${disp(r.mPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.f) || "—") : <input type="text" inputMode="numeric" value={val(r.f)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.f, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.fPct) ? `${disp(r.fPct)}` : "—"}</td>
                        <td className="border border-gray-200 px-2 py-1">{r.isCalc ? (disp(r.o) || "—") : <input type="text" inputMode="numeric" value={val(r.o)} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange(r.o, v); }} className="w-full rounded border px-2 py-1 text-sm" />}</td>
                        <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp(r.oPct) ? `${disp(r.oPct)}` : "—"}</td>
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
          <p className="text-sm font-semibold text-teal-400">21. Participation/Inclusion/Representation of women</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full max-w-2xl border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left"></th>
                <th className="whitespace-nowrap border border-gray-200 px-2 py-2 text-left">Total (A)</th>
                <th className="whitespace-nowrap border border-gray-200 px-2 py-2 text-left">No. of Female (B)</th>
                <th className="whitespace-nowrap border border-gray-200 px-2 py-2 text-left">% (B/A) of Females</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="whitespace-nowrap border border-gray-200 px-2 py-1.5">Board of Directors</td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_21_bod_total")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_21_bod_total", v); }} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_21_bod_f")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_21_bod_f", v); }} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_21_bod_pct") ? `${disp("gen_21_bod_pct")}%` : "—"}</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap border border-gray-200 px-2 py-1.5">Key Management Personnel</td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_21_kmp_total")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_21_kmp_total", v); }} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1"><input type="text" inputMode="numeric" value={val("gen_21_kmp_f")} onChange={(e) => { const v = e.target.value; if (/^\d*$/.test(v)) onChange("gen_21_kmp_f", v); }} className="w-full rounded border px-2 py-1 text-sm" /></td>
                <td className="border border-gray-200 px-2 py-1.5 font-mono calc-cell" role="status" aria-readonly="true">{disp("gen_21_kmp_pct") ? `${disp("gen_21_kmp_pct")}%` : "—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
      )}

      {showBlock("gen_22_") && (
        <div className="mt-8">
          <p className="text-sm font-semibold text-teal-400">22. Turnover rate for permanent employees and workers</p>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left"></th>
                  {getFYLabelsFromReportingYear(reportingYear).map((fy, i) => (
                    <th key={i} colSpan={2} className="border border-gray-200 px-2 py-2 text-center">{fy}</th>
                  ))}
                </tr>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left"></th>
                  {[1, 2, 3].map((i) => (
                    <React.Fragment key={i}>
                      <th className="border border-gray-200 px-2 py-2 text-center">Permanent Employees</th>
                      <th className="border border-gray-200 px-2 py-2 text-center">Permanent Workers</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Male %", codes: ["gen_22_emp_cy_m", "gen_22_wrk_cy_m", "gen_22_emp_py_m", "gen_22_wrk_py_m", "gen_22_emp_pp_m", "gen_22_wrk_pp_m"] },
                  { label: "Female %", codes: ["gen_22_emp_cy_f", "gen_22_wrk_cy_f", "gen_22_emp_py_f", "gen_22_wrk_py_f", "gen_22_emp_pp_f", "gen_22_wrk_pp_f"] },
                  { label: "Other Gender %", codes: ["gen_22_emp_cy_o", "gen_22_wrk_cy_o", "gen_22_emp_py_o", "gen_22_wrk_py_o", "gen_22_emp_pp_o", "gen_22_wrk_pp_o"] },
                  { label: "Total %", codes: ["gen_22_emp_cy_t", "gen_22_wrk_cy_t", "gen_22_emp_py_t", "gen_22_wrk_py_t", "gen_22_emp_pp_t", "gen_22_wrk_pp_t"] },
                ].map(({ label, codes }) => (
                  <tr key={label}>
                    <td className="border border-gray-200 px-2 py-1.5">{label}</td>
                    {codes.map((code) => (
                      <td key={code} className="border border-gray-200 px-2 py-1">
                        <span className="inline-flex items-center gap-1">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={val(code)}
                            onChange={(e) => {
                              const v = e.target.value;
                              if (/^\d*\.?\d*$/.test(v)) onChange(code, v);
                            }}
                            className="w-full min-w-0 rounded border px-2 py-1 text-sm"
                          />
                          <span className="shrink-0 text-gray-500">%</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showBlock("gen_23_") && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">Holding, Subsidiary & Assoc. Companies (including joint ventures)</h3>
          <p className="mt-2 text-xs font-semibold text-gray-700">23. Names of holding / subsidiary / associate companies / joint ventures</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left">Name of the holding / subsidiary / associate companies / joint ventures (A)</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Indicate whether holding/ Subsidiary/ Associate/ JointVenture</th>
                <th className="border border-gray-200 px-2 py-2 text-left">% of shares held by listed entity</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Entity indicated at col A, participate in the Business Responsibility initiatives of the listed entity?</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount(values, "gen_23_row_count") }, (_, i) => i + 1).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_23_${i}_name`)} onChange={(e) => onChange(`gen_23_${i}_name`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1">
                    <select value={val(`gen_23_${i}_type`)} onChange={(e) => onChange(`gen_23_${i}_type`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
                      <option value="">Choose option</option>
                      <option value="Holding">Holding</option>
                      <option value="Subsidiary">Subsidiary</option>
                      <option value="Associate">Associate</option>
                      <option value="Joint Venture">Joint Venture</option>
                    </select>
                  </td>
                  <td className="border border-gray-200 px-2 py-1">
                    <span className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={val(`gen_23_${i}_pct`)}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^\d*\.?\d*$/.test(v)) onChange(`gen_23_${i}_pct`, v);
                        }}
                        className="w-full min-w-0 rounded border px-2 py-1 text-sm"
                      />
                      <span className="shrink-0 text-gray-500">%</span>
                    </span>
                  </td>
                  <td className="border border-gray-200 px-2 py-1">
                    <select value={val(`gen_23_${i}_br`)} onChange={(e) => onChange(`gen_23_${i}_br`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
                      <option value="">Choose option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
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
            <label className="block text-xs text-gray-500">(i) Whether CSR is applicable as per section 135 of Companies Act, 2013</label>
            <select value={val("gen_24_csr_applicable")} onChange={(e) => onChange("gen_24_csr_applicable", e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="">—</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500">(ii) Turnover (Rs.)</label>
            <input
              type="text"
              inputMode="decimal"
              value={val("gen_24_turnover")}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*\.?\d*$/.test(v)) onChange("gen_24_turnover", v);
              }}
              placeholder="Amount"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">(iii) Net worth (Rs.)</label>
            <input
              type="text"
              inputMode="decimal"
              value={val("gen_24_networth")}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*\.?\d*$/.test(v)) onChange("gen_24_networth", v);
              }}
              placeholder="Amount"
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        </div>
      )}

      {showBlock("gen_25_") && (
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-teal-400">VII. Complaints on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct.</h3>
          <p className="mt-2 text-xs font-semibold text-gray-700">25. Complaints on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th rowSpan={2} className="border border-gray-200 px-2 py-2 text-left">Stakeholder group</th>
                <th rowSpan={2} className="border border-gray-200 px-2 py-2 text-left">Grievance Redressal Mechanism in place</th>
                <th rowSpan={2} className="border border-gray-200 px-2 py-2 text-left">Web-link for grievance redress policy</th>
                {(() => {
                  const [fy1, fy2] = getFYLabelsFromReportingYear(reportingYear);
                  return (
                    <>
                      <th colSpan={3} className="border border-gray-200 px-2 py-2 text-center">{fy1}</th>
                      <th colSpan={3} className="border border-gray-200 px-2 py-2 text-center">{fy2}</th>
                    </>
                  );
                })()}
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 text-left">No. of complaints filed during current year</th>
                <th className="border border-gray-200 px-2 py-2 text-left">No. of complaints pending resolution at close in current year</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Remark</th>
                <th className="border border-gray-200 px-2 py-2 text-left">No. of complaints filed during current year</th>
                <th className="border border-gray-200 px-2 py-2 text-left">No. of complaints pending resolution at close in current year</th>
                <th className="border border-gray-200 px-2 py-2 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Communities", p: "comm" },
                { label: "Shareholders", p: "sha" },
                { label: "Investors", p: "inv" },
                { label: "Employees And Workers", p: "emp" },
                { label: "Customers", p: "cust" },
                { label: "Value Chain Partners", p: "vc" },
                { label: "Others", p: "oth" },
              ].map(({ label, p }) => (
                <tr key={p}>
                  <td className="border border-gray-200 px-2 py-1.5">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <select value={val(`gen_25_${p}_mech`)} onChange={(e) => onChange(`gen_25_${p}_mech`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
                      <option value="">Choose option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_weblink`)} onChange={(e) => onChange(`gen_25_${p}_weblink`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val(`gen_25_${p}_cy_f`)}
                      onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) onChange(`gen_25_${p}_cy_f`, v); }}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val(`gen_25_${p}_cy_p`)}
                      onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) onChange(`gen_25_${p}_cy_p`, v); }}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_cy_rem`)} onChange={(e) => onChange(`gen_25_${p}_cy_rem`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                  <td className="border border-gray-200 px-2 py-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val(`gen_25_${p}_py_f`)}
                      onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) onChange(`gen_25_${p}_py_f`, v); }}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={val(`gen_25_${p}_py_p`)}
                      onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) onChange(`gen_25_${p}_py_p`, v); }}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  </td>
                  <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_25_${p}_py_rem`)} onChange={(e) => onChange(`gen_25_${p}_py_rem`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          {showBlock("gen_26_") && (
            <>
              <p className="mt-3 text-xs font-semibold text-gray-700">26. Overview of the entity&apos;s material responsible business conduct issues</p>
              <p className="mt-1 text-xs text-gray-500">Please indicate material responsible business conduct and sustainability issues pertaining to environmental and social matters that present a risk or an opportunity to your business, rationale for identifying the same, approach to adapt or mitigate the risk along-with its financial implications</p>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left">S. No.</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Material issue identified</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Indicate whether risk or opportunity</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Rationale for identifying risk/ opportunity</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">In case of risk, approach to adapt or mitigate</th>
                      <th className="border border-gray-200 px-2 py-2 text-left">Financial implications of the risk or opportunity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: rowCount(values, "gen_26_row_count") }, (_, i) => i + 1).map((i) => (
                      <tr key={i}>
                        <td className="border border-gray-200 px-2 py-1.5">{i}</td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_issue`)} onChange={(e) => onChange(`gen_26_${i}_issue`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                        <td className="border border-gray-200 px-2 py-1">
                          <select value={val(`gen_26_${i}_ro`)} onChange={(e) => onChange(`gen_26_${i}_ro`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
                            <option value="">Choose option</option>
                            <option value="Risk (R)">Risk (R)</option>
                            <option value="Opportunity (O)">Opportunity (O)</option>
                          </select>
                        </td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_rationale`)} onChange={(e) => onChange(`gen_26_${i}_rationale`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                        <td className="border border-gray-200 px-2 py-1"><input type="text" value={val(`gen_26_${i}_approach`)} onChange={(e) => onChange(`gen_26_${i}_approach`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm" /></td>
                        <td className="border border-gray-200 px-2 py-1">
                          <select value={val(`gen_26_${i}_fin`)} onChange={(e) => onChange(`gen_26_${i}_fin`, e.target.value)} className="w-full rounded border px-2 py-1 text-sm">
                            <option value="">Choose option</option>
                            <option value="Positive Implications">Positive Implications</option>
                            <option value="Negative Implications">Negative Implications</option>
                          </select>
                        </td>
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
