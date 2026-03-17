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

export function P8EssentialContent({ values, calcDisplay, onChange }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Social Impact Assessments (SIA) of projects</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Project name / details</th>
                <th className="border border-gray-200 px-2 py-1.5">SIA notification no.</th>
                <th className="border border-gray-200 px-2 py-1.5">Date</th>
                <th className="border border-gray-200 px-2 py-1.5">Independent agency (Y/N)</th>
                <th className="border border-gray-200 px-2 py-1.5">Public domain (Y/N)</th>
                <th className="border border-gray-200 px-2 py-1.5">Weblink</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_e1_name", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_e1_notif", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_e1_date", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_e1_ind", values, onChange, "Y/N")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_e1_pub", values, onChange, "Y/N")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_e1_link", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Rehabilitation and Resettlement (R&amp;R) – ongoing projects</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">S. No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Project name</th>
                <th className="border border-gray-200 px-2 py-1.5">State</th>
                <th className="border border-gray-200 px-2 py-1.5">District</th>
                <th className="border border-gray-200 px-2 py-1.5">No. of PAFs</th>
                <th className="border border-gray-200 px-2 py-1.5">% PAFs covered by R&amp;R</th>
                <th className="border border-gray-200 px-2 py-1.5">Amount paid to PAFs in FY (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e2_${i}_name`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e2_${i}_state`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e2_${i}_dist`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e2_${i}_paf`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e2_${i}_pct`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e2_${i}_amt`, values, onChange, "Rs.")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Grievance mechanism for community</h3>
        <textarea
          value={values["p8_e3_griev"] ?? ""}
          onChange={(e) => onChange("p8_e3_griev", e.target.value)}
          rows={3}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. % input material sourced from MSMEs/small producers and from within India</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left"></th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Directly from MSMEs/small producers (% of total inputs by value)</td><td className="border border-gray-200 px-2 py-1">{inp("p8_e4_msme_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p8_e4_msme_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Directly from within India (% of total inputs)</td><td className="border border-gray-200 px-2 py-1">{inp("p8_e4_india_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p8_e4_india_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Job creation in smaller towns – wages as % of total wage cost (Rural, Semi-urban, Urban, Metropolitan)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Location</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Wages (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">Current FY – Total wage cost (Rs.)</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Wages</th>
                <th className="border border-gray-200 px-2 py-1.5">Previous FY – Total</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Rural", "rural", "calc_p8_pct_1", "calc_p8_pct_2"],
                ["Semi-urban", "semi", "calc_p8_pct_3", "calc_p8_pct_4"],
                ["Urban", "urb", "calc_p8_pct_5", "calc_p8_pct_6"],
                ["Metropolitan", "metro", "calc_p8_pct_7", "calc_p8_pct_8"],
              ].map(([label, k, calcCy, calcPy]) => (
                <tr key={k}>
                  <td className="border border-gray-200 px-2 py-1">{label}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_w_cy`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_t_cy`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcCy)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_w_py`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_e5_${k}_t_py`, values, onChange, "Rs.")}</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{d(calcPy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function P8LeadershipContent({ values, calcDisplay, onChange }: Props) {
  const d = (code: string) => <CalcCell code={code} calcDisplay={calcDisplay} />;
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Mitigation of negative social impacts (from SIA)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Negative impact identified</th><th className="border border-gray-200 px-2 py-1.5">Corrective action taken</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l1_impact", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l1_action", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. CSR in designated aspirational districts</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">S. No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">State</th>
                <th className="border border-gray-200 px-2 py-1.5">Aspirational district</th>
                <th className="border border-gray-200 px-2 py-1.5">Amount spent (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_l2_${i}_state`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_l2_${i}_dist`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p8_l2_${i}_amt`, values, onChange, "Rs.")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Preferential procurement from marginalized/vulnerable groups (Y/N). Groups. % of total procurement (calc)</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Preferential procurement (Y/N)</label>{inp("p8_l3_yn", values, onChange, "Y/N")}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Groups</label>{inp("p8_l3_groups", values, onChange, "Groups")}</div>
        </div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5">Total procurement (Rs.)</th><th className="border border-gray-200 px-2 py-1.5">From preferred groups (Rs.)</th><th className="border border-gray-200 px-2 py-1.5">% (calc)</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l3_total", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l3_pref", values, onChange, "Rs.")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p8_pct_9")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Benefits from IP based on traditional knowledge – Owned/Acquired, Benefit shared (Y/N), Basis</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">S. No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">IP (traditional knowledge)</th>
                <th className="border border-gray-200 px-2 py-1.5">Owned/Acquired</th>
                <th className="border border-gray-200 px-2 py-1.5">Benefit shared (Y/N)</th>
                <th className="border border-gray-200 px-2 py-1.5">Basis of benefit share</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1 text-center">1</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l4_1_ip", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l4_1_own", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l4_1_ben", values, onChange, "Y/N")}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l4_1_basis", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Corrective action on IP disputes (adverse orders)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Authority</th><th className="border border-gray-200 px-2 py-1.5">Brief of case</th><th className="border border-gray-200 px-2 py-1.5">Corrective action</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l5_auth", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l5_brief", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l5_action", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Beneficiaries of CSR projects – No. benefitted, % from vulnerable/marginalized (calc)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">S. No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">CSR project</th>
                <th className="border border-gray-200 px-2 py-1.5">No. benefitted</th>
                <th className="border border-gray-200 px-2 py-1.5">Total beneficiaries (A)</th>
                <th className="border border-gray-200 px-2 py-1.5">From vulnerable/marginalized (B)</th>
                <th className="border border-gray-200 px-2 py-1.5">% (calc)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1 text-center">1</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l6_1_proj", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l6_1_num", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l6_1_tot", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p8_l6_1_vuln", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-500">{d("calc_p8_pct_10")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
