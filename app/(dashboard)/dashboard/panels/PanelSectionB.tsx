"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { getQuestionCodesForPanel } from "@/lib/brsr/questionConfig";

type Props = {
  values: AnswersState;
  onChange: (code: string, value: string) => void;
};

/** Full disclosure text from reference (brsr-data-entry 2.html) */
const DISCLOSURE_ROW_LABELS: Record<string, string> = {
  "1a": "1(a). Policy/policies cover each principle and core elements (Y/N)",
  "1b": "1(b). Policy approved by Board? (Y/N)",
  "1c": "1(c). Web link of policies",
  "2": "2. Policy translated into procedures? (Y/N)",
  "3": "3. Policies extend to value chain partners? (Y/N)",
  "4": "4. National/international codes/certifications/labels/standards adopted (mapped to each principle)",
  "5": "5. Specific commitments, goals, targets with timelines",
  "6": "6. Performance against commitments/goals/targets; reasons if not met",
  "9": "9. Committee of Board/Director for sustainability issues? (Y/N). If yes, details",
  "10a": "10. Review of NGRBCs – Performance vs policies (Director/Committee; Frequency)",
  "10b": "10. Compliance with statutory requirements; rectification of non-compliances",
  "11": "11. Independent assessment by external agency? (Y/N). If yes, name of agency",
};

/** Q12 reason rows – second table */
const REASON_ROW_LABELS: Record<string, string> = {
  "12a": "Principles not material to business (Y/N)",
  "12b": "Not in position to formulate/implement (Y/N)",
  "12c": "Lack of financial/human/technical resources (Y/N)",
  "12d": "Planned in next FY (Y/N)",
};

const PRINCIPLES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const rowOrder = (key: string) => {
  const n = parseInt(key.replace(/[a-z]/g, ""), 10) || 0;
  const s = key.replace(/^\d+/, "") || " ";
  return n * 10 + (s === "a" ? 1 : s === "b" ? 2 : s === "c" ? 3 : s === "d" ? 4 : s === "e" ? 5 : 0);
};

export function PanelSectionB({ values, onChange }: Props) {
  const v = (code: string) => values[code] ?? "";
  const codes = getQuestionCodesForPanel("sectionb");

  const mainRows = codes
    .filter((c) => !c.includes("statement") && !c.includes("authority") && !c.includes("12"))
    .reduce<{ rowKey: string; cells: { code: string; principle: number }[] }[]>((acc, code) => {
      const match = code.match(/^sb_(\d+[a-z]?)_p(\d+)$/);
      if (!match) return acc;
      const [, rowKey, p] = match;
      let row = acc.find((r) => r.rowKey === rowKey);
      if (!row) {
        row = { rowKey, cells: [] };
        acc.push(row);
      }
      row.cells.push({ code, principle: parseInt(p, 10) });
      return acc;
    }, [])
    .sort((a, b) => rowOrder(a.rowKey) - rowOrder(b.rowKey));

  return (
    <section>
      <h1 className="text-xl font-semibold text-gray-900">Section B: Management and Process Disclosures</h1>
      <p className="mt-1 text-sm text-gray-500">Structures, policies and processes towards NGRBC Principles (Annexure II)</p>
      <p className="mt-2 text-xs font-semibold text-gray-700">Disclosure questions – indicate Yes/No or provide details for each principle (P1–P9)</p>

      {/* Table 1: Disclosures 1(a)–11 */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-2 text-left font-medium">Disclosure</th>
              {PRINCIPLES.map((p) => (
                <th key={p} className="border border-gray-200 px-2 py-2 text-center">P{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mainRows.map(({ rowKey, cells }) => (
              <tr key={rowKey}>
                <td className="border border-gray-200 px-2 py-1.5 text-gray-700">
                  {DISCLOSURE_ROW_LABELS[rowKey] ?? rowKey}
                </td>
                {PRINCIPLES.map((p) => {
                  const cell = cells.find((c) => c.principle === p);
                  return (
                    <td key={p} className="border border-gray-200 px-2 py-1">
                      {cell ? (
                        <input
                          type="text"
                          value={v(cell.code)}
                          onChange={(e) => onChange(cell.code, e.target.value)}
                          placeholder="Y/N"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm"
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">7. Statement by director on ESG challenges, targets, achievements</td>
              <td colSpan={9} className="border border-gray-200 px-2 py-1">
                <input
                  type="text"
                  value={v("sb_7_statement")}
                  onChange={(e) => onChange("sb_7_statement", e.target.value)}
                  placeholder="Details / weblink"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">8. Highest authority for implementation & oversight of BR policy</td>
              <td colSpan={9} className="border border-gray-200 px-2 py-1">
                <input
                  type="text"
                  value={v("sb_8_authority")}
                  onChange={(e) => onChange("sb_8_authority", e.target.value)}
                  placeholder="Details"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Table 2: Q12 – If not all Principles covered by policy – reasons */}
      <p className="mt-6 text-xs font-semibold text-gray-700">12. If not all Principles covered by policy – reasons</p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-2 py-2 text-left font-medium">Reason</th>
              {PRINCIPLES.map((p) => (
                <th key={p} className="border border-gray-200 px-2 py-2 text-center">P{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["12a", "12b", "12c", "12d"] as const).map((rowKey) => (
              <tr key={rowKey}>
                <td className="border border-gray-200 px-2 py-1.5 text-gray-700">{REASON_ROW_LABELS[rowKey]}</td>
                {PRINCIPLES.map((p) => (
                  <td key={p} className="border border-gray-200 px-2 py-1">
                    <input
                      type="text"
                      value={v(`sb_${rowKey}_p${p}`)}
                      onChange={(e) => onChange(`sb_${rowKey}_p${p}`, e.target.value)}
                      placeholder="Y/N"
                      className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm"
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">Any other reason (specify)</td>
              <td colSpan={9} className="border border-gray-200 px-2 py-1">
                <input
                  type="text"
                  value={v("sb_12e_other")}
                  onChange={(e) => onChange("sb_12e_other", e.target.value)}
                  placeholder="Specify"
                  className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">Data is saved automatically.</p>
    </section>
  );
}
