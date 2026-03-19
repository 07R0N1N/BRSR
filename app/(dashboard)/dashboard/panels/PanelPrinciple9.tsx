"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";

type Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
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

/** Normalize Y/N to Yes/No for backward compatibility */
function getYesNoValue(values: AnswersState, code: string): string {
  const v = values[code] ?? "";
  if (v === "Y" || v === "y") return "Yes";
  if (v === "N" || v === "n") return "No";
  return v;
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

const FRAMEWORK_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];

export function P9EssentialContent({ values, onChange, reportingYear }: Props) {
  const [fyCurr, fyPrev] = reportingYear ? getFYLabelsFromReportingYear(reportingYear) : ["Current FY", "Previous FY"];
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Describe the mechanisms in place to receive and respond to consumer complaints and feedback.</h3>
        <textarea
          value={values["p9_e1_mech"] ?? ""}
          onChange={(e) => onChange("p9_e1_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Turnover of products and / services as a percentage of turnover from all products/service that carry information about</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Category</th><th className="border border-gray-200 px-2 py-1.5">Percentage to total turnover</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Environmental And Social Parameters Relevant To The Product</td><td className="border border-gray-200 px-2 py-1">{pctInp("p9_e2_env", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Safe And Responsible Usage</td><td className="border border-gray-200 px-2 py-1">{pctInp("p9_e2_safe", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Recycling And/Or Safe Disposal</td><td className="border border-gray-200 px-2 py-1">{pctInp("p9_e2_recycle", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Number of consumer complaints in respect of the following:</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th colSpan={3} className="border border-gray-200 px-2 py-1.5 text-center">{fyCurr}</th>
                <th colSpan={3} className="border border-gray-200 px-2 py-1.5 text-center">{fyPrev}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left"></th>
                <th className="border border-gray-200 px-2 py-1.5">Received during the year</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending resolution at end of year</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
                <th className="border border-gray-200 px-2 py-1.5">Received during the year</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending resolution at end of year</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Data Privacy", "dp"],
                ["Advertising", "adv"],
                ["Cyber-Security", "cs"],
                ["Delivery Of Essential Services", "del"],
                ["Restrictive Trade Practices", "rtp"],
                ["Unfair Trade Practices", "utp"],
                ["Other", "oth"],
              ].map(([label, k]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p9_e3_${k}_cy_f`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p9_e3_${k}_cy_p`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p9_e3_${k}_cy_r`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p9_e3_${k}_py_f`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p9_e3_${k}_py_p`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p9_e3_${k}_py_r`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Details of instances of product recalls on account of safety issues.</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Number</th><th className="border border-gray-200 px-2 py-1.5">Reasons for recall</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Voluntary Recalls</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_vol_num", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_vol_reason", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Forced Recalls</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_for_num", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_for_reason", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Does the entity have a framework/ policy on cyber security and risks related to data privacy?</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">Framework</label>
            <select
              value={getYesNoValue(values, "p9_e5_framework")}
              onChange={(e) => onChange("p9_e5_framework", e.target.value)}
              className="rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {FRAMEWORK_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Web link</label>{inp("p9_e5_link", values, onChange, "Web link")}</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Provide details of any corrective actions taken or underway on issues relating to advertising, and delivery of essential services; cyber security and data privacy of customers; re-occurrence of instances of product recalls; penalty / action taken by regulatory authorities on safety of products / services.</h3>
        <textarea
          value={values["p9_e6_corrective"] ?? ""}
          onChange={(e) => onChange("p9_e6_corrective", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Provide the following information relating to data breaches</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">(i) Number of instances of data breaches along-with impact</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7a_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7a_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">(ii) Percentage of data breaches involving personally identifiable information of customers</td><td className="border border-gray-200 px-2 py-1">{pctInp("p9_e7b_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{pctInp("p9_e7b_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">(iii) Impact, if any, of the data breaches</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7c_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7c_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function P9LeadershipContent({ values, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Channels / platforms where information on products and services of the entity can be accessed (provide web link, if available).</h3>
        <textarea
          value={values["p9_l1_channels"] ?? ""}
          onChange={(e) => onChange("p9_l1_channels", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Steps taken to inform and educate consumers about safe and responsible usage of products and/or services.</h3>
        <textarea
          value={values["p9_l2_steps"] ?? ""}
          onChange={(e) => onChange("p9_l2_steps", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Mechanisms in place to inform consumers of any risk of disruption/discontinuation of essential services.</h3>
        <textarea
          value={values["p9_l3_mech"] ?? ""}
          onChange={(e) => onChange("p9_l3_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Entity display product information</h3>
        <div className="mt-2 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">i. Does the entity display product information on the product over and above what is mandated as per local laws?</label>
            <select
              value={getYesNoValue(values, "p9_l4_beyond")}
              onChange={(e) => onChange("p9_l4_beyond", e.target.value)}
              className="w-full max-w-xs rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {FRAMEWORK_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-500">ii. Did your entity carry out any survey with regard to consumer satisfaction relating to the major products / services of the entity, significant locations of operation of the entity or the entity as a whole?</label>
            <select
              value={getYesNoValue(values, "p9_l4_survey")}
              onChange={(e) => onChange("p9_l4_survey", e.target.value)}
              className="w-full max-w-xs rounded border border-gray-300 px-2 py-1 text-sm"
            >
              {FRAMEWORK_OPTIONS.map((o) => (
                <option key={o.value || "empty"} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
