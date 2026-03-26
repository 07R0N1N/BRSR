"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";
import { blockAllowed } from "@/lib/brsr/visibilityUtils";

const MAX_ROWS = 20;

const YES_NO_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

const YES_NO_NA_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
];

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
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

/** Percentage-only input (0–100, displays with % suffix) */
function pctInp(code: string, values: AnswersState, onChange: (code: string, value: string) => void) {
  const v = values[code] ?? "";
  return (
    <span className="inline-flex items-center gap-1">
      <input
        type="text"
        inputMode="decimal"
        value={v}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^0-9.]/g, "");
          const num = parseFloat(raw);
          if (raw === "" || (!Number.isNaN(num) && num >= 0 && num <= 100)) {
            onChange(code, raw);
          }
        }}
        placeholder="0"
        className="w-20 rounded border border-gray-300 px-2 py-1 text-sm"
      />
      <span className="text-gray-500">%</span>
    </span>
  );
}

export function P2EssentialContent({ values, onChange, allowedSet, reportingYear = "2024-25" }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const [fyCurrent, fyPrevious] = getFYLabelsFromReportingYear(reportingYear);

  return (
    <>
      {sb("p2_e1_") && <div data-testid="qblock-p2_e1">
        <h3 className="text-sm font-semibold text-teal-400">
          1. Percentage of R&D and capital expenditure (capex) investments in specific technologies to improve the environmental and social impacts of product and processes to total R&D and capex investments made by the entity, respectively.
        </h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Type</th>
                <th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Details of improvements in environmental and social impacts</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">R&D</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p2_e1_rd_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p2_e1_rd_py", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">
                  <textarea
                    value={values["p2_e1_rd_details"] ?? ""}
                    onChange={(e) => onChange("p2_e1_rd_details", e.target.value)}
                    rows={2}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Capex</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p2_e1_capex_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{pctInp("p2_e1_capex_py", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">
                  <textarea
                    value={values["p2_e1_capex_details"] ?? ""}
                    onChange={(e) => onChange("p2_e1_capex_details", e.target.value)}
                    rows={2}
                    className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>}
      {sb("p2_e2_") && <div data-testid="qblock-p2_e2">
        <h3 className="text-sm font-semibold text-teal-400">2. Does the entity have procedures in place for sustainable sourcing?</h3>
        <div className="mt-2">
          <select
            value={values["p2_e2_yn"] ?? ""}
            onChange={(e) => onChange("p2_e2_yn", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {YES_NO_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>}
      {sb("p2_e3_") && <div data-testid="qblock-p2_e3">
        <h3 className="text-sm font-semibold text-teal-400">
          3. Describe the processes in place to safely reclaim your products for reusing, recycling and disposing at the end of life
        </h3>
        <div className="mt-2 space-y-4">
          {[
            ["I. Plastic (including packaging)", "p2_e3_plastics"],
            ["II. E-waste", "p2_e3_ewaste"],
            ["III. Hazardous waste", "p2_e3_hazardous"],
            ["IV. Other waste", "p2_e3_other"],
          ].map(([label, code]) => (
            <div key={code}>
              <label className="block text-xs font-medium text-gray-600">{label}</label>
              <textarea
                value={values[code] ?? ""}
                onChange={(e) => onChange(code, e.target.value)}
                rows={3}
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
          ))}
        </div>
      </div>}
      {sb("p2_e4_") && <div data-testid="qblock-p2_e4">
        <h3 className="text-sm font-semibold text-teal-400">4. Whether Extended Producer Responsibility (EPR) is applicable to the entity&apos;s activities (Yes / No).</h3>
        <div className="mt-2">
          <select
            value={values["p2_e4_epr"] ?? ""}
            onChange={(e) => onChange("p2_e4_epr", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {YES_NO_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>}
    </>
  );
}

export function P2LeadershipContent({ values, onChange, allowedSet, reportingYear = "2024-25" }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const l2Count = rowCount(values, "p2_l2_rowcount");
  const l3Count = rowCount(values, "p2_l3_rowcount");
  const l5Count = rowCount(values, "p2_l5_rowcount");
  const [fyCurrent, fyPrevious] = getFYLabelsFromReportingYear(reportingYear);

  return (
    <>
      {sb("p2_l1_") && <div data-testid="qblock-p2_l1">
        <h3 className="text-sm font-semibold text-teal-400">1. Has the Company conducted Life Cycle Assessments (LCA) for its products /services?</h3>
        <div className="mt-2">
          <select
            value={values["p2_l1_yn"] ?? ""}
            onChange={(e) => onChange("p2_l1_yn", e.target.value)}
            className="rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            {YES_NO_NA_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>}

      {sb("p2_l2_") && <div data-testid="qblock-p2_l2">
        <h3 className="text-sm font-semibold text-teal-400">2. If there are any significant social or environmental concerns and/or risks arising from production or disposal of your products / services, as identified in the Life Cycle Perspective / Assessments (LCA) or through any other means, briefly describe the same along-with action taken to mitigate the same</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Name of the Product/Service</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Description of the risk/concern</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Action Taken</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: l2Count }, (_, i) => i).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i + 1}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l2_row${i}_product`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l2_row${i}_risk`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <textarea
                      value={values[`p2_l2_row${i}_action`] ?? ""}
                      onChange={(e) => onChange(`p2_l2_row${i}_action`, e.target.value)}
                      rows={2}
                      className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    />
                  </td>
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
      </div>}

      {sb("p2_l3_") && <div data-testid="qblock-p2_l3">
        <h3 className="text-sm font-semibold text-teal-400">3. Percentage of recycled or reused input material to total material (by value) used in production (for manufacturing industry) or providing services (for service industry).</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Indicate Input material</th>
                <th className="border border-gray-200 px-2 py-1.5">{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5">{fyPrevious}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: l3Count }, (_, i) => i).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i + 1}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l3_row${i}_material`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p2_l3_row${i}_pct_cy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p2_l3_row${i}_pct_py`, values, onChange)}</td>
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
      </div>}

      {sb("p2_l4_") && <div data-testid="qblock-p2_l4">
        <h3 className="text-sm font-semibold text-teal-400">4. Of the products and packaging reclaimed at end of life of products, amount (in metric tonnes) reused, recycled, and safely disposed, as per the following format.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Particulars</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyCurrent}</th>
                <th className="border border-gray-200 px-2 py-1.5" colSpan={3}>{fyPrevious}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Re-used</th>
                <th className="border border-gray-200 px-2 py-1.5">Recycled</th>
                <th className="border border-gray-200 px-2 py-1.5">Safely Disposed</th>
                <th className="border border-gray-200 px-2 py-1.5">Re-used</th>
                <th className="border border-gray-200 px-2 py-1.5">Recycled</th>
                <th className="border border-gray-200 px-2 py-1.5">Safely Disposed</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Plastics (Including Packaging)", "plast"],
                ["E Waste", "ew"],
                ["Hazardous Waste", "haz"],
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
      </div>}

      {sb("p2_l5_") && <div data-testid="qblock-p2_l5">
        <h3 className="text-sm font-semibold text-teal-400">5. Reclaimed products and their packaging materials (as percentage of products sold) for each product category.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">#</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Indicate product category</th>
                <th className="border border-gray-200 px-2 py-1.5">Reclaimed products and their packaging materials as % of total products sold in respective category</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: l5Count }, (_, i) => i).map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center text-gray-400">{i + 1}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p2_l5_row${i}_category`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{pctInp(`p2_l5_row${i}_pct`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-1 flex gap-2">
          <button
            type="button"
            onClick={() => onChange("p2_l5_rowcount", String(l5Count + 1))}
            disabled={l5Count >= MAX_ROWS}
            className="add-row-btn rounded border px-3 py-1.5 text-sm font-mono disabled:cursor-not-allowed disabled:opacity-50"
          >
            +ADD
          </button>
          {l5Count > 1 && (
            <button
              type="button"
              onClick={() => onChange("p2_l5_rowcount", String(l5Count - 1))}
              className="rounded border px-3 py-1.5 text-sm font-mono text-red-500"
            >
              −REMOVE
            </button>
          )}
        </div>
      </div>}
    </>
  );
}
