"use client";

import { useEffect } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { blockAllowed } from "@/lib/brsr/visibilityUtils";

const MAX_TABLE_ROWS = 20;

const P4_E2_FIELDS = ["name", "vuln", "chan", "chan_other", "freq", "freq_other", "purpose"] as const;

const CHANNELS_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "E-mail", label: "E-mail" },
  { value: "SMS", label: "SMS" },
  { value: "Newspaper", label: "Newspaper" },
  { value: "Pamphlets", label: "Pamphlets" },
  { value: "Advertisement", label: "Advertisement" },
  { value: "Community Meetings", label: "Community Meetings" },
  { value: "Notice Board", label: "Notice Board" },
  { value: "Website", label: "Website" },
  { value: "Other", label: "Other" },
];

const FREQUENCY_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Annually", label: "Annually" },
  { value: "Half Yearly", label: "Half Yearly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Any other", label: "Any other" },
  { value: "Others", label: "Others" },
];

/** Values that trigger the "Details of Other Frequency" required field */
const FREQ_OTHER_VALUES = new Set(["Any other", "Others"]);

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

function requiredInp(
  code: string,
  values: AnswersState,
  onChange: (code: string, value: string) => void,
  placeholder = ""
) {
  const value = values[code] ?? "";
  const isEmpty = value.trim() === "";
  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(code, e.target.value)}
        placeholder={placeholder}
        required
        aria-required="true"
        aria-invalid={isEmpty}
        className={`w-full rounded border px-2 py-1 text-sm ${
          isEmpty ? "p4-required-invalid border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
      />
      {isEmpty && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          This field is required
        </p>
      )}
    </div>
  );
}

/** Normalize vuln: Y/N -> Yes/No for backward compatibility */
function getVulnValue(values: AnswersState, rowKey: string): string {
  const v = values[`${rowKey}_vuln`] ?? "";
  if (v === "Y" || v === "y") return "Yes";
  if (v === "N" || v === "n") return "No";
  return v;
}

/** If chan value is not in dropdown options, treat as Other and put value in chan_other */
function getChanDisplayValue(values: AnswersState, rowKey: string): { chan: string; chanOther: string } {
  const chan = values[`${rowKey}_chan`] ?? "";
  const chanOther = values[`${rowKey}_chan_other`] ?? "";
  const inOptions = CHANNELS_OPTIONS.some((o) => o.value && o.value === chan);
  if (chan && !inOptions) {
    return { chan: "Other", chanOther: chan };
  }
  return { chan, chanOther };
}

/** If freq value is not in dropdown options, treat as Any other and put value in freq_other */
function getFreqDisplayValue(values: AnswersState, rowKey: string): { freq: string; freqOther: string } {
  const freq = values[`${rowKey}_freq`] ?? "";
  const freqOther = values[`${rowKey}_freq_other`] ?? "";
  const inOptions = FREQUENCY_OPTIONS.some((o) => o.value && o.value === freq);
  if (freq && !inOptions) {
    return { freq: "Any other", freqOther: freq };
  }
  return { freq, freqOther };
}

function showFreqOtherField(freq: string): boolean {
  return FREQ_OTHER_VALUES.has(freq);
}

export function P4EssentialContent({ values, onChange, allowedSet }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const n = rowCount(values, "p4_e2_rowcount");

  // Migrate existing chan/freq free-text to dropdown + Other when value not in options
  useEffect(() => {
    for (let i = 0; i < n; i++) {
      const rowKey = `p4_e2_row${i}`;
      const chan = values[`${rowKey}_chan`] ?? "";
      const freq = values[`${rowKey}_freq`] ?? "";
      const chanInOptions = !chan || CHANNELS_OPTIONS.some((o) => o.value && o.value === chan);
      const freqInOptions = !freq || FREQUENCY_OPTIONS.some((o) => o.value && o.value === freq);
      if (chan && !chanInOptions) {
        onChange(`${rowKey}_chan`, "Other");
        onChange(`${rowKey}_chan_other`, chan);
      }
      if (freq && !freqInOptions) {
        onChange(`${rowKey}_freq`, "Any other");
        onChange(`${rowKey}_freq_other`, freq);
      }
    }
  }, [n, onChange, values]);

  function addRow() {
    onChange("p4_e2_rowcount", String(n + 1));
  }
  function removeRow(i: number) {
    if (n <= 1) return;
    // Shift rows down
    for (let j = i; j < n - 1; j++) {
      for (const field of P4_E2_FIELDS) {
        onChange(`p4_e2_row${j}_${field}`, values[`p4_e2_row${j + 1}_${field}`] ?? "");
      }
    }
    // Clear last row
    for (const field of P4_E2_FIELDS) {
      onChange(`p4_e2_row${n - 1}_${field}`, "");
    }
    onChange("p4_e2_rowcount", String(n - 1));
  }

  return (
    <>
      {sb("p4_e1_") && <div data-testid="qblock-p4_e1">
        <h3 className="text-sm font-semibold text-teal-400">
          1. Describe the processes for identifying key stakeholder groups of the entity.
        </h3>
        <textarea
          value={values["p4_e1_process"] ?? ""}
          onChange={(e) => onChange("p4_e1_process", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>}
      {sb("p4_e2_") && <div data-testid="qblock-p4_e2">
        <h3 className="text-sm font-semibold text-teal-400">
          2. List stakeholder groups identified as key for your entity and the frequency of engagement with each
          stakeholder group.
        </h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: n }, (_, i) => {
            const rowKey = `p4_e2_row${i}`;
            const { chan, chanOther } = getChanDisplayValue(values, rowKey);
            const { freq, freqOther } = getFreqDisplayValue(values, rowKey);
            const vulnValue = getVulnValue(values, rowKey);

            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {n > 1 && i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeRow(i);
                      }}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div>
                    <label className="block text-xs text-gray-500">Stakeholder Group</label>
                    {inp(`${rowKey}_name`, values, onChange, "Enter Stakeholder Group")}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Whether identified as Vulnerable &amp; Marginalised Group
                    </label>
                    <div className="mt-1 flex gap-4">
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`${rowKey}_vuln`}
                          checked={vulnValue === "Yes"}
                          onChange={() => onChange(`${rowKey}_vuln`, "Yes")}
                          className="rounded-full"
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5">
                        <input
                          type="radio"
                          name={`${rowKey}_vuln`}
                          checked={vulnValue === "No"}
                          onChange={() => onChange(`${rowKey}_vuln`, "No")}
                          className="rounded-full"
                        />
                        <span className="text-sm">No</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Channels of communication</label>
                    <select
                      value={chan}
                      onChange={(e) => onChange(`${rowKey}_chan`, e.target.value)}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      {CHANNELS_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {chan === "Other" && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500">
                          Details of Other Channels of communication <span className="text-red-500">*</span>
                        </label>
                        {requiredInp(`${rowKey}_chan_other`, values, onChange)}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Frequency of engagement</label>
                    <select
                      value={freq}
                      onChange={(e) => onChange(`${rowKey}_freq`, e.target.value)}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                    >
                      {FREQUENCY_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    {showFreqOtherField(freq) && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-500">
                          Details of Other Frequency of engagement <span className="text-red-500">*</span>
                        </label>
                        {requiredInp(`${rowKey}_freq_other`, values, onChange)}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Purpose and scope of engagement including key topics and concerns raised during such engagement
                    </label>
                    <textarea
                      value={values[`${rowKey}_purpose`] ?? ""}
                      onChange={(e) => onChange(`${rowKey}_purpose`, e.target.value)}
                      placeholder="Enter Text"
                      rows={3}
                      className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                    />
                  </div>
                </div>
              </details>
            );
          })}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="add-row-btn mt-2 rounded border px-3 py-1.5 text-sm"
        >
          +ADD
        </button>
      </div>}
    </>
  );
}

/** Normalize p4_l2_yn: Y/N -> Yes/No for backward compatibility */
function getL2YnValue(values: AnswersState): string {
  const v = values["p4_l2_yn"] ?? "";
  if (v === "Y" || v === "y") return "Yes";
  if (v === "N" || v === "n") return "No";
  return v;
}

export function P4LeadershipContent({ values, onChange, allowedSet }: Props) {
  const sb = (prefix: string) => blockAllowed(prefix, allowedSet);
  const l2Yn = getL2YnValue(values);

  return (
    <>
      {sb("p4_l1_") && <div data-testid="qblock-p4_l1">
        <h3 className="text-sm font-semibold text-teal-400">
          1. Provide the processes for consultation between stakeholders and the Board on economic, environmental, and
          social topics or if consultation is delegated, how is feedback from such consultations provided to the Board.
        </h3>
        <textarea
          value={values["p4_l1_consult"] ?? ""}
          onChange={(e) => onChange("p4_l1_consult", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>}
      {sb("p4_l2_") && <div data-testid="qblock-p4_l2">
        <h3 className="text-sm font-semibold text-teal-400">
          2. Whether stakeholder consultation is used to support the identification and management of environmental and
          social topics?
        </h3>
        <div className="mt-2 flex flex-col gap-2 max-w-2xl">
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-1.5">
              <input
                type="radio"
                name="p4_l2_yn"
                checked={l2Yn === "Yes"}
                onChange={() => onChange("p4_l2_yn", "Yes")}
                className="rounded-full"
              />
              <span className="text-sm">Yes</span>
            </label>
            <label className="inline-flex items-center gap-1.5">
              <input
                type="radio"
                name="p4_l2_yn"
                checked={l2Yn === "No"}
                onChange={() => onChange("p4_l2_yn", "No")}
                className="rounded-full"
              />
              <span className="text-sm">No</span>
            </label>
          </div>
          {l2Yn === "Yes" && (
            <>
              <label className="block text-xs text-gray-500">
                If so, provide details of instances as to how inputs received from stakeholders on these topics were
                incorporated into policies and activities of the entity.
              </label>
              <textarea
                value={values["p4_l2_instances"] ?? ""}
                onChange={(e) => onChange("p4_l2_instances", e.target.value)}
                rows={3}
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </>
          )}
        </div>
      </div>}
      {sb("p4_l3_") && <div data-testid="qblock-p4_l3">
        <h3 className="text-sm font-semibold text-teal-400">
          3. Instances of engagement with and actions taken to address the concerns of vulnerable /marginalised
          stakeholder groups.
        </h3>
        <textarea
          value={values["p4_l3_engagement"] ?? ""}
          onChange={(e) => onChange("p4_l3_engagement", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>}
    </>
  );
}
