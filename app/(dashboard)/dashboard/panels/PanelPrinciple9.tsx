"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { CalcCell } from "@/components/CalcCell";

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

export function P9EssentialContent({ values, calcDisplay, onChange }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Mechanisms for consumer complaints and feedback</h3>
        <textarea
          value={values["p9_e1_mech"] ?? ""}
          onChange={(e) => onChange("p9_e1_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Turnover % with product information (environmental/social, safe usage, recycling/disposal)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Category</th><th className="border border-gray-200 px-2 py-1.5">% of total turnover</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Environmental and social parameters</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e2_env", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Safe and responsible usage</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e2_safe", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Recycling and/or safe disposal</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e2_recycle", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Consumer complaints (Data privacy, Advertising, Cybersecurity, Delivery, Restrictive/Unfair trade, Other)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Category</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Received</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Received</th>
                <th className="border border-gray-200 px-2 py-1.5">Pending</th>
                <th className="border border-gray-200 px-2 py-1.5">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Data privacy", "dp"],
                ["Advertising", "adv"],
                ["Cyber-security", "cs"],
                ["Delivery of essential services", "del"],
                ["Restrictive trade practices", "rtp"],
                ["Unfair trade practices", "utp"],
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
        <h3 className="text-sm font-semibold text-teal-400">4. Product recalls (safety) – Voluntary / Forced – Number, Reasons</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Number</th><th className="border border-gray-200 px-2 py-1.5">Reasons for recall</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Voluntary recalls</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_vol_num", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_vol_reason", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Forced recalls</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_for_num", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e4_for_reason", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Framework on cybersecurity and data privacy (Y/N). Weblink</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Framework (Y/N)</label>{inp("p9_e5_framework", values, onChange, "Y/N")}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Weblink</label>{inp("p9_e5_link", values, onChange, "Weblink")}</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Corrective actions (advertising, delivery, cybersecurity, data privacy, recalls, regulatory penalty)</h3>
        <textarea
          value={values["p9_e6_corrective"] ?? ""}
          onChange={(e) => onChange("p9_e6_corrective", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Data breaches – (a) Number (b) % involving PII (c) Impact</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">(a) Number of data breaches</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7a_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7a_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">(b) Breaches involving PII – Count</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7b_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7b_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">(b) % involving PII (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p9_pct_1")}</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p9_pct_2")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">(c) Impact of data breaches</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7c_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p9_e7c_py", values, onChange)}</td></tr>
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
        <h3 className="text-sm font-semibold text-teal-400">1. Channels/platforms for product information (weblink)</h3>
        <div className="mt-2">{inp("p9_l1_channels", values, onChange, "Weblink")}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Steps to inform and educate on safe and responsible usage</h3>
        <textarea
          value={values["p9_l2_steps"] ?? ""}
          onChange={(e) => onChange("p9_l2_steps", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Mechanisms for disruption/discontinuation of essential services</h3>
        <textarea
          value={values["p9_l3_mech"] ?? ""}
          onChange={(e) => onChange("p9_l3_mech", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Product information beyond legal requirement (Y/N). Details. Consumer satisfaction survey (Y/N)</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Beyond legal requirement (Y/N)</label>{inp("p9_l4_beyond", values, onChange, "Y/N")}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Details</label>{inp("p9_l4_detail", values, onChange, "Details")}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Consumer satisfaction survey (Y/N)</label>{inp("p9_l4_survey", values, onChange, "Y/N")}</div>
        </div>
      </div>
    </>
  );
}
