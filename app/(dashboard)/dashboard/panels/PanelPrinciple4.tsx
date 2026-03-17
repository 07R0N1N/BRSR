"use client";

import type { AnswersState } from "@/lib/brsr/types";

const MAX_TABLE_ROWS = 20;

function rowCount(values: AnswersState, code: string): number {
  const n = parseInt(values[code] || "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, MAX_TABLE_ROWS);
}

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

export function P4EssentialContent({ values, onChange }: Props) {
  const n = rowCount(values, "p4_e2_rowcount");

  function addRow() {
    onChange("p4_e2_rowcount", String(n + 1));
  }
  function removeRow(i: number) {
    if (n <= 1) return;
    // Shift rows down
    for (let j = i; j < n - 1; j++) {
      for (const field of ["name", "vuln", "chan", "freq", "purpose"]) {
        onChange(`p4_e2_row${j}_${field}`, values[`p4_e2_row${j + 1}_${field}`] ?? "");
      }
    }
    // Clear last row
    for (const field of ["name", "vuln", "chan", "freq", "purpose"]) {
      onChange(`p4_e2_row${n - 1}_${field}`, "");
    }
    onChange("p4_e2_rowcount", String(n - 1));
  }

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Processes for identifying key stakeholder groups</h3>
        <textarea
          value={values["p4_e1_process"] ?? ""}
          onChange={(e) => onChange("p4_e1_process", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Stakeholder groups – engagement</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Stakeholder group</th>
                <th className="border border-gray-200 px-2 py-1.5">Vulnerable &amp; marginalized (Y/N)</th>
                <th className="border border-gray-200 px-2 py-1.5">Channels of communication</th>
                <th className="border border-gray-200 px-2 py-1.5">Frequency of engagement</th>
                <th className="border border-gray-200 px-2 py-1.5">Purpose and scope / key topics</th>
                <th className="border border-gray-200 px-2 py-1.5 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: n }, (_, i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p4_e2_row${i}_name`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p4_e2_row${i}_vuln`, values, onChange, "Y/N")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p4_e2_row${i}_chan`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p4_e2_row${i}_freq`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p4_e2_row${i}_purpose`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center">
                    {n > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(i)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-2 rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          + Add row
        </button>
      </div>
    </>
  );
}

export function P4LeadershipContent({ values, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Consultation between stakeholders and Board on economic, environmental, social topics (or how feedback to Board)</h3>
        <textarea
          value={values["p4_l1_consult"] ?? ""}
          onChange={(e) => onChange("p4_l1_consult", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Stakeholder consultation for environmental/social topics (Y/N). Instances of inputs incorporated</h3>
        <div className="mt-2 flex flex-col gap-2 max-w-2xl">
          <input
            type="text"
            value={values["p4_l2_yn"] ?? ""}
            onChange={(e) => onChange("p4_l2_yn", e.target.value)}
            placeholder="Y/N"
            className="rounded border border-gray-300 px-2 py-1 text-sm"
          />
          <textarea
            value={values["p4_l2_instances"] ?? ""}
            onChange={(e) => onChange("p4_l2_instances", e.target.value)}
            rows={2}
            placeholder="Instances of inputs incorporated"
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Engagement with vulnerable/marginalized groups – actions taken</h3>
        <textarea
          value={values["p4_l3_engagement"] ?? ""}
          onChange={(e) => onChange("p4_l3_engagement", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
    </>
  );
}
