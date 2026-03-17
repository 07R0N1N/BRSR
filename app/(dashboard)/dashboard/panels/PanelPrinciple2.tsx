"use client";

import type { AnswersState } from "@/lib/brsr/types";

const MAX_ROWS = 20;

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

function rowCount(values: AnswersState, code: string): number {
  const n = parseInt(values[code] ?? "1", 10);
  return Number.isNaN(n) || n < 1 ? 1 : n;
}

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

export function P2EssentialContent({ values, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. R&D and Capital Expenditure (sustainability)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Type</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Details</th>
                <th className="border border-gray-200 px-2 py-1.5">Env/Social benefit (CY, Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Env/Social benefit (PY, Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">R&D</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_rd_cy", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_rd_py", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_rd_details", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_rd_env_cy", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_rd_env_py", values, onChange, "Rs.")}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Capex</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_capex_cy", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_capex_py", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_capex_details", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_capex_env_cy", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p2_e1_capex_env_py", values, onChange, "Rs.")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Sustainable sourcing (Y/N; % of inputs)</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-500">Sustainable sourcing (Y/N)</label>
            {inp("p2_e2_yn", values, onChange, "Y/N")}
          </div>
          <div>
            <label className="block text-xs text-gray-500">Total inputs</label>
            {inp("p2_e2_total", values, onChange)}
          </div>
          <div>
            <label className="block text-xs text-gray-500">Sustainable inputs</label>
            {inp("p2_e2_sustainable", values, onChange)}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Reclaimed products / packaging (% of total)</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          {[
            ["Plastics", "p2_e3_plastics"],
            ["E-waste", "p2_e3_ewaste"],
            ["Hazardous", "p2_e3_hazardous"],
            ["Other", "p2_e3_other"],
          ].map(([label, code]) => (
            <div key={code}>
              <label className="block text-xs text-gray-500">{label} (%)</label>
              {inp(code, values, onChange, "%")}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Extended Producer Responsibility (EPR)</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">EPR applicable (Y/N)</label>
            {inp("p2_e4_epr", values, onChange, "Y/N")}
          </div>
          <div>
            <label className="block text-xs text-gray-500">Steps taken if applicable</label>
            {inp("p2_e4_steps", values, onChange)}
          </div>
        </div>
      </div>
    </>
  );
}

export function P2LeadershipContent({ values, onChange }: Props) {
  const l1Count = rowCount(values, "p2_l1_rowcount");
  const l2Count = rowCount(values, "p2_l2_rowcount");
  const l3Count = rowCount(values, "p2_l3_rowcount");

  return (
    <>
      {/* L1 – Products/Services with environmental/social information */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L1. Products with specific env/social information on label / disclosed</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                <th className="border border-gray-200 px-2 py-1.5">NIC code</th>
                <th className="border border-gray-200 px-2 py-1.5">Product / service</th>
                <th className="border border-gray-200 px-2 py-1.5">% of total turnover</th>
                <th className="border border-gray-200 px-2 py-1.5">Boundary</th>
                <th className="border border-gray-200 px-2 py-1.5">Ext assessed?</th>
                <th className="border border-gray-200 px-2 py-1.5">Publicly available?</th>
                <th className="border border-gray-200 px-2 py-1.5">Link / reference</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: l1Count }, (_, i) => i + 1).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_nic`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_product`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_pct`, values, onChange, "%")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_boundary`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_ext`, values, onChange, "Y/N")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_public`, values, onChange, "Y/N")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l1_row${i}_link`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => onChange("p2_l1_rowcount", String(l1Count + 1))}
            disabled={l1Count >= MAX_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            +ADD
          </button>
          {l1Count > 1 && (
            <button
              type="button"
              onClick={() => onChange("p2_l1_rowcount", String(l1Count - 1))}
              className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
            >
              −REMOVE
            </button>
          )}
        </div>
      </div>

      {/* L2 – Products posing environmental/social risks */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L2. Products / services posing significant env or social risks</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                <th className="border border-gray-200 px-2 py-1.5">Product / service</th>
                <th className="border border-gray-200 px-2 py-1.5">Identified risk</th>
                <th className="border border-gray-200 px-2 py-1.5">Action taken</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: l2Count }, (_, i) => i + 1).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l2_row${i}_product`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l2_row${i}_risk`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l2_row${i}_action`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => onChange("p2_l2_rowcount", String(l2Count + 1))}
            disabled={l2Count >= MAX_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            +ADD
          </button>
          {l2Count > 1 && (
            <button
              type="button"
              onClick={() => onChange("p2_l2_rowcount", String(l2Count - 1))}
              className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
            >
              −REMOVE
            </button>
          )}
        </div>
      </div>

      {/* L3 – Recycled/reused materials */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L3. Percentage recycled / reused inputs (by material)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                <th className="border border-gray-200 px-2 py-1.5">Material type</th>
                <th className="border border-gray-200 px-2 py-1.5">Recycled / reused (MT)</th>
                <th className="border border-gray-200 px-2 py-1.5">Total input (MT)</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: l3Count }, (_, i) => i + 1).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l3_row${i}_material`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l3_row${i}_recycled`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l3_row${i}_total`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => onChange("p2_l3_rowcount", String(l3Count + 1))}
            disabled={l3Count >= MAX_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            +ADD
          </button>
          {l3Count > 1 && (
            <button
              type="button"
              onClick={() => onChange("p2_l3_rowcount", String(l3Count - 1))}
              className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
            >
              −REMOVE
            </button>
          )}
        </div>
      </div>

      {/* L4 – Reclaimed products / packaging materials (waste type breakdown) */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L4. Reclaimed products / packaging (current & previous FY, by waste type)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Waste type</th>
                <th className="border border-gray-200 px-2 py-1.5">CY – Reused</th>
                <th className="border border-gray-200 px-2 py-1.5">CY – Recycled</th>
                <th className="border border-gray-200 px-2 py-1.5">CY – Disposed</th>
                <th className="border border-gray-200 px-2 py-1.5">PY – Reused</th>
                <th className="border border-gray-200 px-2 py-1.5">PY – Recycled</th>
                <th className="border border-gray-200 px-2 py-1.5">PY – Disposed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Plastics", "plast"],
                ["E-waste", "ew"],
                ["Hazardous", "haz"],
                ["Others", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l4_${k}_cy_re`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l4_${k}_cy_rc`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l4_${k}_cy_d`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l4_${k}_py_re`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l4_${k}_py_rc`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l4_${k}_py_d`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* L5 – Sustainable packaging */}
      <div>
        <h3 className="text-sm font-semibold text-teal-400">L5. Sustainable packaging – category and percentage</h3>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <div>
            <label className="block text-xs text-gray-500">Category</label>
            {inp("p2_l5_category", values, onChange)}
          </div>
          <div>
            <label className="block text-xs text-gray-500">% of total packaging</label>
            {inp("p2_l5_pct", values, onChange, "%")}
          </div>
        </div>
      </div>
    </>
  );
}
