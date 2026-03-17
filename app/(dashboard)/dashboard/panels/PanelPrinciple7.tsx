"use client";

import type { AnswersState } from "@/lib/brsr/types";

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

export function P7EssentialContent({ values, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1(a). Number of affiliations with trade and industry chambers/associations</h3>
        <div className="mt-2">{inp("p7_e1a_count", values, onChange, "Number")}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1(b). Top 10 trade and industry chambers/associations (by membership)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">S. No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Name of chamber/association</th>
                <th className="border border-gray-200 px-2 py-1.5">Reach (State/National)</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3,4,5,6,7,8,9,10].map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_e1b_${i}_name`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_e1b_${i}_reach`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Corrective action on anti-competitive conduct (adverse orders)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Name of authority</th>
                <th className="border border-gray-200 px-2 py-1.5">Brief of case</th>
                <th className="border border-gray-200 px-2 py-1.5">Corrective action taken</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p7_e2_auth", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p7_e2_brief", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p7_e2_action", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function P7LeadershipContent({ values, onChange }: Props) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Public policy positions advocated</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5">S. No.</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Public policy advocated</th>
                <th className="border border-gray-200 px-2 py-1.5">Method for advocacy</th>
                <th className="border border-gray-200 px-2 py-1.5">In public domain (Y/N)</th>
                <th className="border border-gray-200 px-2 py-1.5">Frequency of review by Board</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((i) => (
                <tr key={i}>
                  <td className="border border-gray-200 px-2 py-1 text-center">{i}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_l1_${i}_policy`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_l1_${i}_method`, values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_l1_${i}_public`, values, onChange, "Y/N")}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp(`p7_l1_${i}_freq`, values, onChange)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
