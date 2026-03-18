"use client";

import type { AnswersState } from "@/lib/brsr/types";

type Props = {
  values: AnswersState;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

const PRINCIPLES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Yes/No/NA dropdown options */
const YES_NO_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
];

/** Review Oversight dropdown options (10a, 10b) */
const REVIEW_OVERSIGHT_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Director", label: "Director" },
  { value: "Committee of the Board", label: "Committee of the Board" },
  { value: "Any other Committee", label: "Any other Committee" },
];

/** Frequency dropdown options (10a, 10b) */
const FREQUENCY_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Annually", label: "Annually" },
  { value: "Half Yearly", label: "Half Yearly" },
  { value: "Quarterly", label: "Quarterly" },
  { value: "Any other", label: "Any other" },
];

function YesNoSelect({
  value,
  onChange,
  show,
  className = "w-full rounded border border-gray-300 px-2 py-1 text-sm",
}: {
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  className?: string;
}) {
  if (!show) return <span className="text-gray-300">—</span>;
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
      {YES_NO_OPTIONS.map((o) => (
        <option key={o.value || "empty"} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function SelectOptions({
  value,
  onChange,
  options,
  show,
  className = "w-full rounded border border-gray-300 px-2 py-1 text-sm",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  show: boolean;
  className?: string;
}) {
  if (!show) return <span className="text-gray-300">—</span>;
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={className}>
      {options.map((o) => (
        <option key={o.value || "empty"} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function PanelSectionB({ values, onChange, allowedSet = null }: Props) {
  const v = (code: string) => values[code] ?? "";
  const show = (code: string) => allowedSet === null || allowedSet.has(code);
  const showBlock = (prefixes: string[]) =>
    allowedSet === null ||
    prefixes.some((p) =>
      Array.from(allowedSet).some((c) => c.startsWith(p) || c === p)
    );

  return (
    <section>
      <h1 className="text-2xl font-bold text-gray-900">
        Section B: Management and Process Disclosures
      </h1>
      <p className="mt-1 text-xs text-slate-400">
        Structures, policies and processes towards NGRBC Principles (Annexure II)
      </p>

      <h3 className="mt-6 text-sm font-semibold text-teal-400">
        I. Policy and management processes
      </h3>

      {/* Subsection 1: Policy (1a, 1b, 1c) */}
      {(showBlock(["sb_1a_", "sb_1b_", "sb_1c_"]) ||
        PRINCIPLES.some(
          (p) =>
            show(`sb_1a_p${p}`) || show(`sb_1b_p${p}`) || show(`sb_1c_p${p}`)
        )) && (
        <div className="mt-6 border-t border-slate-600 pt-6">
          <h4 className="text-xs font-semibold text-gray-700">1. Policy</h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Principle
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Whether your entity&apos;s policy/policies cover each
                    principle and its core elements of the NGRBCS
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Has the policy been approved by the Board?
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Weblink of the policy, if available
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRINCIPLES.map((p) => (
                  <tr key={p}>
                    <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">
                      Principle {p}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <YesNoSelect
                        value={v(`sb_1a_p${p}`)}
                        onChange={(val) => onChange(`sb_1a_p${p}`, val)}
                        show={show(`sb_1a_p${p}`)}
                      />
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <YesNoSelect
                        value={v(`sb_1b_p${p}`)}
                        onChange={(val) => onChange(`sb_1b_p${p}`, val)}
                        show={show(`sb_1b_p${p}`)}
                      />
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      {show(`sb_1c_p${p}`) ? (
                        <input
                          type="text"
                          value={v(`sb_1c_p${p}`)}
                          onChange={(e) =>
                            onChange(`sb_1c_p${p}`, e.target.value)
                          }
                          placeholder="Weblink"
                          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subsection 2: Policy translated into procedures */}
      {showBlock(["sb_2_"]) && (
        <div className="mt-6 border-t border-slate-600 pt-6">
          <h4 className="text-xs font-semibold text-gray-700">
            2. Whether the entity has translated the policy into procedures.
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Principle
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRINCIPLES.map((p) => (
                  <tr key={p}>
                    <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">
                      Principle {p}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <YesNoSelect
                        value={v(`sb_2_p${p}`)}
                        onChange={(val) => onChange(`sb_2_p${p}`, val)}
                        show={show(`sb_2_p${p}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subsection 3: Policies extend to value chain partners */}
      {showBlock(["sb_3_"]) && (
        <div className="mt-6 border-t border-slate-600 pt-6">
          <h4 className="text-xs font-semibold text-gray-700">
            3. Do the enlisted policies extend to your value chain partners?
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Principle
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Response
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRINCIPLES.map((p) => (
                  <tr key={p}>
                    <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">
                      Principle {p}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      <YesNoSelect
                        value={v(`sb_3_p${p}`)}
                        onChange={(val) => onChange(`sb_3_p${p}`, val)}
                        show={show(`sb_3_p${p}`)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subsection 4: National/international codes */}
      {showBlock(["sb_4_"]) && (
        <div className="mt-6 border-t border-slate-600 pt-6">
          <h4 className="text-xs font-semibold text-gray-700">
            4. Name of the national and international codes / certifications /
            labels / standards (e.g. Forest Stewardship Council, Fairtrade,
            Rainforest Alliance, Trustee) standards (e.g. SA 8000, OHSAS, ISO,
            BIS) adopted by your entity and mapped to each principle.
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Principle
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Enter Text
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRINCIPLES.map((p) => (
                  <tr key={p}>
                    <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700 align-top">
                      Principle {p}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      {show(`sb_4_p${p}`) ? (
                        <textarea
                          value={v(`sb_4_p${p}`)}
                          onChange={(e) =>
                            onChange(`sb_4_p${p}`, e.target.value)
                          }
                          placeholder="Enter Text"
                          rows={3}
                          className="w-full resize-y rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subsection 5: Specific commitments, goals, targets */}
      {showBlock(["sb_5_"]) && (
        <div className="mt-6 border-t border-slate-600 pt-6">
          <h4 className="text-xs font-semibold text-gray-700">
            5. Specific commitments, goals and targets set by the entity with
            defined timelines, if any.
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Principle
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Enter Text
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRINCIPLES.map((p) => (
                  <tr key={p}>
                    <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700 align-top">
                      Principle {p}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      {show(`sb_5_p${p}`) ? (
                        <textarea
                          value={v(`sb_5_p${p}`)}
                          onChange={(e) =>
                            onChange(`sb_5_p${p}`, e.target.value)
                          }
                          placeholder="Enter Text"
                          rows={3}
                          className="w-full resize-y rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subsection 6: Performance against commitments */}
      {showBlock(["sb_6_"]) && (
        <div className="mt-6 border-t border-slate-600 pt-6">
          <h4 className="text-xs font-semibold text-gray-700">
            6. Performance of the entity against the specific commitments, goals
            and targets along-with reasons in case the same are not met.
          </h4>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Principle
                  </th>
                  <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                    Enter Text
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRINCIPLES.map((p) => (
                  <tr key={p}>
                    <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700 align-top">
                      Principle {p}
                    </td>
                    <td className="border border-gray-200 px-2 py-1">
                      {show(`sb_6_p${p}`) ? (
                        <textarea
                          value={v(`sb_6_p${p}`)}
                          onChange={(e) =>
                            onChange(`sb_6_p${p}`, e.target.value)
                          }
                          placeholder="Enter Text"
                          rows={3}
                          className="w-full resize-y rounded border border-gray-300 px-2 py-1 text-sm"
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* II. Governance, leadership and oversight */}
      {(show("sb_7_statement") ||
        show("sb_8_authority") ||
        showBlock(["sb_9_"]) ||
        showBlock(["sb_10a_"]) ||
        showBlock(["sb_10b_"]) ||
        showBlock(["sb_11_"])) && (
        <>
          <h3 className="mt-6 text-sm font-semibold text-teal-400">
            II. Governance, leadership and oversight
          </h3>

          {/* Subsection 7: Statement by director */}
          {show("sb_7_statement") && (
            <div className="mt-6 border-t border-slate-600 pt-6">
              <h4 className="text-xs font-semibold text-gray-700">
                7. Statement by director responsible for the business
                responsibility report, highlighting ESG related challenges,
                targets and achievements
              </h4>
              <div className="mt-2">
                <textarea
                  value={v("sb_7_statement")}
                  onChange={(e) => onChange("sb_7_statement", e.target.value)}
                  placeholder="Enter Text"
                  rows={4}
                  className="w-full resize-y rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}

          {/* Subsection 8: Highest authority */}
          {show("sb_8_authority") && (
            <div className="mt-6 border-t border-slate-600 pt-6">
              <h4 className="text-xs font-semibold text-gray-700">
                8. Details of the highest authority responsible for
                implementation and oversight of the Business Responsibility
                policy (ies)
              </h4>
              <div className="mt-2">
                <textarea
                  value={v("sb_8_authority")}
                  onChange={(e) => onChange("sb_8_authority", e.target.value)}
                  placeholder="Enter Text"
                  rows={4}
                  className="w-full resize-y rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
            </div>
          )}

          {/* Subsection 9: Committee of Board/Director (single dropdown) */}
          {showBlock(["sb_9_"]) && (
            <div className="mt-6 border-t border-slate-600 pt-6">
              <h4 className="text-xs font-semibold text-gray-700">
                9. Does the entity have a specified Committee of the Board/
                Director responsible for decision making on Sustainability
                related issues?
              </h4>
              <div className="mt-2 max-w-xs">
                <YesNoSelect
                  value={v("sb_9_p1")}
                  onChange={(val) => {
                    for (let p = 1; p <= 9; p++) {
                      onChange(`sb_9_p${p}`, val);
                    }
                  }}
                  show={show("sb_9_p1")}
                />
              </div>
            </div>
          )}

          {/* Subsection 10: Details of Review of NGRBCs */}
          {showBlock(["sb_10a_"]) && (
            <div className="mt-6 border-t border-slate-600 pt-6">
              <h4 className="text-xs font-semibold text-gray-700">
                10. Details of Review of NGRBCs by the Company
              </h4>
              <h5 className="mt-2 text-xs font-medium text-gray-600">
                i. Performance against above policies and follow up action
              </h5>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Principle
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Review Oversight
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Frequency
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRINCIPLES.map((p) => (
                      <tr key={p}>
                        <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">
                          Principle {p}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <SelectOptions
                            value={v(`sb_10a_p${p}_review`)}
                            onChange={(val) =>
                              onChange(`sb_10a_p${p}_review`, val)
                            }
                            options={REVIEW_OVERSIGHT_OPTIONS}
                            show={show(`sb_10a_p${p}_review`)}
                          />
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <SelectOptions
                            value={v(`sb_10a_p${p}_freq`)}
                            onChange={(val) =>
                              onChange(`sb_10a_p${p}_freq`, val)
                            }
                            options={FREQUENCY_OPTIONS}
                            show={show(`sb_10a_p${p}_freq`)}
                          />
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {show(`sb_10a_p${p}`) ? (
                            <input
                              type="text"
                              value={v(`sb_10a_p${p}`)}
                              onChange={(e) =>
                                onChange(`sb_10a_p${p}`, e.target.value)
                              }
                              placeholder="Description"
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subsection 10b: Compliance with statutory requirements */}
          {showBlock(["sb_10b_"]) && (
            <div className="mt-6 border-t border-slate-600 pt-6">
              <h5 className="text-xs font-semibold text-gray-700">
                ii. Compliance with statutory requirements of relevance to the
                principles and rectification of any non-compliances
              </h5>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Principle
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Review Oversight
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Frequency
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRINCIPLES.map((p) => (
                      <tr key={p}>
                        <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">
                          Principle {p}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <SelectOptions
                            value={v(`sb_10b_p${p}_review`)}
                            onChange={(val) =>
                              onChange(`sb_10b_p${p}_review`, val)
                            }
                            options={REVIEW_OVERSIGHT_OPTIONS}
                            show={show(`sb_10b_p${p}_review`)}
                          />
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <SelectOptions
                            value={v(`sb_10b_p${p}_freq`)}
                            onChange={(val) =>
                              onChange(`sb_10b_p${p}_freq`, val)
                            }
                            options={FREQUENCY_OPTIONS}
                            show={show(`sb_10b_p${p}_freq`)}
                          />
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {show(`sb_10b_p${p}`) ? (
                            <input
                              type="text"
                              value={v(`sb_10b_p${p}`)}
                              onChange={(e) =>
                                onChange(`sb_10b_p${p}`, e.target.value)
                              }
                              placeholder="Description"
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subsection 11: Independent assessment */}
          {showBlock(["sb_11_"]) && (
            <div className="mt-6 border-t border-slate-600 pt-6">
              <h4 className="text-xs font-semibold text-gray-700">
                11. Has the entity carried out independent assessment/
                evaluation of the working of its policies by an external agency?
              </h4>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Principle
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Has the entity carried out independent assessment/
                        evaluation of the working
                      </th>
                      <th className="border border-gray-200 px-2 py-2 text-left font-medium">
                        Name of agency
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRINCIPLES.map((p) => (
                      <tr key={p}>
                        <td className="border border-gray-200 px-2 py-1.5 font-medium text-gray-700">
                          Principle {p}
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          <YesNoSelect
                            value={v(`sb_11_p${p}`)}
                            onChange={(val) => onChange(`sb_11_p${p}`, val)}
                            show={show(`sb_11_p${p}`)}
                          />
                        </td>
                        <td className="border border-gray-200 px-2 py-1">
                          {show(`sb_11_p${p}_agency`) ? (
                            <input
                              type="text"
                              value={v(`sb_11_p${p}_agency`)}
                              onChange={(e) =>
                                onChange(`sb_11_p${p}_agency`, e.target.value)
                              }
                              placeholder="Name of agency"
                              className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                            />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <p className="mt-6 text-xs text-slate-400">Data is saved automatically.</p>
    </section>
  );
}
