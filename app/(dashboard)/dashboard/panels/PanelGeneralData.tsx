"use client";

import { QuestionBlock } from "@/components/QuestionBlock";
import { PanelHeader } from "@/components/panel/PanelHeader";
import { PanelSection } from "@/components/panel/PanelSection";
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
} from "@/components/panel/DataTable";

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
    <DataTableTd numeric className="font-mono calc-cell">
      {displayValue || "—"}
    </DataTableTd>
  );

  return (
    <section>
      <PanelHeader
        title="General Data Gathering"
        subtitle="Enter once; values flow to intensity calculations and Principle 6."
      />

      <PanelSection title="Turnover & PPP (for intensity calculations)">
        {showBlock(["gdata_turnover_", "gdata_ppp_"]) && (
          <QuestionBlock blockId="generaldata_turnover_ppp" data-testid="qblock-generaldata_turnover_ppp">
            <DataTable maxWidth="3xl">
              <DataTableHead>
                <DataTableTh>Parameter</DataTableTh>
                <DataTableTh>Current FY</DataTableTh>
                <DataTableTh>Previous FY</DataTableTh>
              </DataTableHead>
              <DataTableBody>
                <DataTableRow>
                  <DataTableTd>Revenue from operations (Rs.)</DataTableTd>
                  <DataTableTd>
                    <input
                      type="text"
                      value={v("gdata_turnover_cy")}
                      onChange={(e) => onChange("gdata_turnover_cy", e.target.value)}
                      placeholder="Rs."
                      className="w-full rounded border border-gray-300 px-2 py-1.5"
                    />
                  </DataTableTd>
                  <DataTableTd>
                    <input
                      type="text"
                      value={v("gdata_turnover_py")}
                      onChange={(e) => onChange("gdata_turnover_py", e.target.value)}
                      placeholder="Rs."
                      className="w-full rounded border border-gray-300 px-2 py-1.5"
                    />
                  </DataTableTd>
                </DataTableRow>
                <DataTableRow>
                  <DataTableTd>PPP factor</DataTableTd>
                  <DataTableTd>
                    <input
                      type="text"
                      value={v("gdata_ppp_cy")}
                      onChange={(e) => onChange("gdata_ppp_cy", e.target.value)}
                      placeholder="e.g. 1.2"
                      className="w-full rounded border border-gray-300 px-2 py-1.5"
                    />
                  </DataTableTd>
                  <DataTableTd>
                    <input
                      type="text"
                      value={v("gdata_ppp_py")}
                      onChange={(e) => onChange("gdata_ppp_py", e.target.value)}
                      placeholder="e.g. 1.2"
                      className="w-full rounded border border-gray-300 px-2 py-1.5"
                    />
                  </DataTableTd>
                </DataTableRow>
                <DataTableRow>
                  <DataTableTd>
                    Revenue adjusted for PPP (Rs.)
                    <br />
                    <small className="text-xs text-slate-400">Revenue ÷ PPP factor</small>
                  </DataTableTd>
                  {calcCell(d("gdata_rev_ppp_cy_display"))}
                  {calcCell(d("gdata_rev_ppp_py_display"))}
                </DataTableRow>
              </DataTableBody>
            </DataTable>
            <p className="mt-2 text-xs text-slate-400">
              These values auto-fill Principle 6 revenue and PPP-adjusted revenue fields.
            </p>
          </QuestionBlock>
        )}
      </PanelSection>

      <PanelSection title="Employee & worker counts (for use across principles)">
        {showBlock(["gdata_emp_", "gdata_wrk_"]) && (
          <QuestionBlock blockId="generaldata_emp_worker" data-testid="qblock-generaldata_emp_worker">
            <p className="mb-2 text-xs text-slate-400">
              Total headcount by gender and contract type. Use in Principle 3 and elsewhere.
            </p>
            <DataTable maxWidth="3xl">
              <DataTableHead>
                <DataTableTh>Category</DataTableTh>
                <DataTableTh>Male</DataTableTh>
                <DataTableTh>Female</DataTableTh>
                <DataTableTh>Others</DataTableTh>
                <DataTableTh numeric>Total (calc)</DataTableTh>
              </DataTableHead>
              <DataTableBody>
                <DataTableRow>
                  <DataTableTd>Employees – Permanent</DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_emp_perm_m")} onChange={(e) => onChange("gdata_emp_perm_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_emp_perm_f")} onChange={(e) => onChange("gdata_emp_perm_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_emp_perm_o")} onChange={(e) => onChange("gdata_emp_perm_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  {calcCell(d("gdata_emp_perm_sum"))}
                </DataTableRow>
                <DataTableRow>
                  <DataTableTd>Employees – Other than permanent</DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_emp_oth_m")} onChange={(e) => onChange("gdata_emp_oth_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_emp_oth_f")} onChange={(e) => onChange("gdata_emp_oth_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_emp_oth_o")} onChange={(e) => onChange("gdata_emp_oth_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  {calcCell(d("gdata_emp_oth_sum"))}
                </DataTableRow>
                <DataTableRow>
                  <DataTableTd>Workers – Permanent</DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_wrk_perm_m")} onChange={(e) => onChange("gdata_wrk_perm_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_wrk_perm_f")} onChange={(e) => onChange("gdata_wrk_perm_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_wrk_perm_o")} onChange={(e) => onChange("gdata_wrk_perm_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  {calcCell(d("gdata_wrk_perm_sum"))}
                </DataTableRow>
                <DataTableRow>
                  <DataTableTd>Workers – Other than permanent</DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_wrk_oth_m")} onChange={(e) => onChange("gdata_wrk_oth_m", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_wrk_oth_f")} onChange={(e) => onChange("gdata_wrk_oth_f", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  <DataTableTd><input type="text" value={v("gdata_wrk_oth_o")} onChange={(e) => onChange("gdata_wrk_oth_o", e.target.value)} className="w-full rounded border px-2 py-1.5" placeholder="No." /></DataTableTd>
                  {calcCell(d("gdata_wrk_oth_sum"))}
                </DataTableRow>
              </DataTableBody>
            </DataTable>
          </QuestionBlock>
        )}
      </PanelSection>

      <p className="mt-5 text-xs text-slate-400">
        Data is saved automatically. Changes here flow to Principle 6.
      </p>
    </section>
  );
}
