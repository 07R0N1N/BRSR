"use client";

import { useEffect } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { QuestionInput } from "@/components/QuestionInput";
import { getFYLabelsFromReportingYear } from "@/lib/brsr/fyLabels";

type P6Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
  reportingYear?: string;
};

function inp(code: string, values: AnswersState, onChange: (code: string, value: string) => void, placeholder = "") {
  return <QuestionInput code={code} values={values} onChange={onChange} placeholder={placeholder} />;
}

/** Normalize Y/N to Yes/No for backward compatibility */
function getYesNoValue(values: AnswersState, code: string): string {
  const v = values[code] ?? "";
  if (v === "Y" || v === "y") return "Yes";
  if (v === "N" || v === "n") return "No";
  return v;
}

const ENERGY_UNITS = [
  { value: "J", label: "Joule (J)" },
  { value: "kJ", label: "Kilojoule (kJ)" },
  { value: "MJ", label: "Megajoule (MJ)" },
  { value: "GJ", label: "Gigajoule (GJ)" },
  { value: "TJ", label: "Terajoule (TJ)" },
];

const ZLD_OPTIONS = [
  { value: "", label: "Choose option" },
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "NA", label: "NA" },
];

const AIR_EMISSION_UNITS = [
  { value: "", label: "Choose option" },
  { value: "tonne", label: "Tonne" },
  { value: "kilotonne", label: "Kilotonne" },
  { value: "mg/m3", label: "mg/m3" },
  { value: "ug/m3", label: "ug/m3" },
  { value: "kg/Day", label: "kg/Day" },
  { value: "kg", label: "kg" },
  { value: "mg/Nm3", label: "mg/Nm3" },
  { value: "kgSOxe", label: "kgSOxe" },
  { value: "tonnes/year", label: "Tonnes/Year" },
  { value: "ppm", label: "Parts Per Million (PPM)" },
  { value: "tCO2e", label: "tCO2e" },
  { value: "kg/year", label: "kg/year" },
];

const GHG_EMISSION_UNITS = [
  { value: "", label: "Choose option" },
  { value: "tCO2e", label: "tCO2e" },
  { value: "ktCO2e", label: "ktCO2e" },
  { value: "MtCO2e", label: "MtCO2e" },
  { value: "GtCO2e", label: "GtCO2e" },
];

const MAX_P6_ROWS = 10;

function rowCount(values: AnswersState, code: string, max: number): number {
  const n = parseInt(values[code] || "1", 10);
  if (Number.isNaN(n) || n < 1) return 1;
  return Math.min(n, max);
}

const P6_E11_FIELDS = ["loc", "type", "yn", "correct"] as const;
const P6_E12_FIELDS = ["name", "notif", "date", "ind", "pub", "link"] as const;
const P6_E13_FIELDS = ["law", "detail", "fines", "correct"] as const;

export function P6EssentialContent({ values, calcDisplay, onChange, allowedSet: _allowedSet = null, reportingYear }: P6Props) {
  const d = (code: string) => calcDisplay[code] ?? "";
  const dOrDash = (code: string) => d(code) || "–";
  const [fyCurr, fyPrev] = reportingYear ? getFYLabelsFromReportingYear(reportingYear) : ["Current FY", "Previous FY"];
  const n11 = rowCount(values, "p6_e11_rowcount", MAX_P6_ROWS);
  const n12 = rowCount(values, "p6_e12_rowcount", MAX_P6_ROWS);
  const n13 = rowCount(values, "p6_e13_rowcount", MAX_P6_ROWS);

  // Migrate p6_e11_1_* / p6_e11_2_* to p6_e11_row0_* / p6_e11_row1_*
  useEffect(() => {
    const row0HasData = (values["p6_e11_row0_loc"] ?? "").trim();
    const old1HasData = (values["p6_e11_1_loc"] ?? "").trim();
    if (old1HasData && !row0HasData) {
      onChange("p6_e11_row0_loc", values["p6_e11_1_loc"] ?? "");
      onChange("p6_e11_row0_type", values["p6_e11_1_type"] ?? "");
      onChange("p6_e11_row0_yn", values["p6_e11_1_yn"] ?? "");
      onChange("p6_e11_row0_correct", values["p6_e11_1_correct"] ?? "");
      onChange("p6_e11_rowcount", "1");
    }
    const row1HasData = (values["p6_e11_row1_loc"] ?? "").trim();
    const old2HasData = (values["p6_e11_2_loc"] ?? "").trim();
    if (old2HasData && !row1HasData) {
      onChange("p6_e11_row1_loc", values["p6_e11_2_loc"] ?? "");
      onChange("p6_e11_row1_type", values["p6_e11_2_type"] ?? "");
      onChange("p6_e11_row1_yn", values["p6_e11_2_yn"] ?? "");
      onChange("p6_e11_row1_correct", values["p6_e11_2_correct"] ?? "");
      onChange("p6_e11_rowcount", "2");
    }
  }, [onChange, values]);

  // Migrate p6_e12_* to p6_e12_row0_*
  useEffect(() => {
    const row0HasData = (values["p6_e12_row0_name"] ?? "").trim();
    const oldHasData = (values["p6_e12_name"] ?? "").trim();
    if (oldHasData && !row0HasData) {
      onChange("p6_e12_row0_name", values["p6_e12_name"] ?? "");
      onChange("p6_e12_row0_notif", values["p6_e12_notif"] ?? "");
      onChange("p6_e12_row0_date", values["p6_e12_date"] ?? "");
      onChange("p6_e12_row0_ind", values["p6_e12_ind"] ?? "");
      onChange("p6_e12_row0_pub", values["p6_e12_pub"] ?? "");
      onChange("p6_e12_row0_link", values["p6_e12_link"] ?? "");
      onChange("p6_e12_rowcount", "1");
    }
  }, [onChange, values]);

  // Migrate p6_e13_law/detail/fines/correct to p6_e13_row0_*
  useEffect(() => {
    const row0HasData = (values["p6_e13_row0_law"] ?? "").trim();
    const oldHasData = (values["p6_e13_law"] ?? "").trim();
    if (oldHasData && !row0HasData) {
      onChange("p6_e13_row0_law", values["p6_e13_law"] ?? "");
      onChange("p6_e13_row0_detail", values["p6_e13_detail"] ?? "");
      onChange("p6_e13_row0_fines", values["p6_e13_fines"] ?? "");
      onChange("p6_e13_row0_correct", values["p6_e13_correct"] ?? "");
      onChange("p6_e13_rowcount", "1");
    }
  }, [onChange, values]);

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Total energy consumption</h3>
        <p className="mt-1 text-xs text-slate-400">Revenue from operations and PPP-adjusted revenue are auto-filled from General Data.</p>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-600">i. Revenue from operations (in Rs.)</p>
          <div className="mt-2 flex flex-wrap gap-4">
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">{fyCurr}</label>{inp("p6_e1_rev_cy", values, onChange, "Rs.")}</div>
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">{fyPrev}</label>{inp("p6_e1_rev_py", values, onChange, "Rs.")}</div>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-600">ii. Whether total energy consumption and energy intensity is applicable to the company?</p>
          <div className="mt-2 flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_e1_applicable" value={opt} checked={(values["p6_e1_applicable"] ?? "") === opt} onChange={() => onChange("p6_e1_applicable", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-600">iii. Details of total energy consumption (in Joules or multiples) and energy intensity</p>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Units:</span>
              <select value={values["p6_e1_unit"] ?? "J"} onChange={(e) => onChange("p6_e1_unit", e.target.value)} className="rounded border border-gray-300 px-2 py-1 text-sm">
                {ENERGY_UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
              <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Units</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th><th className="border border-gray-200 px-2 py-1.5 w-24"></th></tr></thead>
              <tbody>
                <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">From renewable sources</td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Total Electricity Consumption (A)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_el_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_el_py", values, onChange)}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Total Fuel Consumption (B)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_fuel_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_fuel_py", values, onChange)}</td><td></td></tr>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">Energy Consumption Through Other Sources (C)</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_oth_cy", values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_oth_py", values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <details className="inline"><summary className="cursor-pointer text-xs text-blue-600 hover:underline">ADD DETAILS</summary><div className="mt-1"><textarea value={values["p6_e1_re_oth_specify"] ?? ""} onChange={(e) => onChange("p6_e1_re_oth_specify", e.target.value)} placeholder="Specify other sources" rows={2} className="w-full rounded border border-gray-300 px-2 py-1 text-xs" /></div></details>
                  </td>
                </tr>
                <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Energy Consumed From Renewable Sources (A+B+C)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_re_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_re_total_py")}</td><td></td></tr>
                <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">From non-renewable sources</td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Total Electricity Consumption (D)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_el_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_el_py", values, onChange)}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Total Fuel Consumption (E)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_fuel_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_fuel_py", values, onChange)}</td><td></td></tr>
                <tr>
                  <td className="border border-gray-200 px-2 py-1">Energy Consumption Through Other Sources (F)</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_oth_cy", values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_oth_py", values, onChange)}</td>
                  <td className="border border-gray-200 px-2 py-1">
                    <details className="inline"><summary className="cursor-pointer text-xs text-blue-600 hover:underline">ADD DETAILS</summary><div className="mt-1"><textarea value={values["p6_e1_nre_oth_specify"] ?? ""} onChange={(e) => onChange("p6_e1_nre_oth_specify", e.target.value)} placeholder="Specify other sources" rows={2} className="w-full rounded border border-gray-300 px-2 py-1 text-xs" /></div></details>
                  </td>
                </tr>
                <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Energy Consumed From Non-Renewable Sources (D+E+F)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_nre_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_nre_total_py")}</td><td></td></tr>
                <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">Total and intensity metrics</td></tr>
                <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Energy Consumed (A+B+C+D+E+F)</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_total_py")}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Energy Intensity Per Rupee Of Turnover <small className="block text-gray-500">(Total Energy Consumed / Revenue From Operations)</small></td><td className="border border-gray-200 px-2 py-1 text-gray-500">GJ/Crore INR</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e1_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e1_intensity_py")}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Energy Intensity Per Rupee Adjusted For PPP <small className="block text-gray-500">(Total Energy Consumed / Revenue Adjusted For PPP)</small></td><td className="border border-gray-200 px-2 py-1 text-gray-500">GJ/Million USD</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e1_intensity_ppp_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e1_intensity_ppp_py")}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations adjusted for PPP (Rs.)</td><td></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_ppp_py", values, onChange, "Rs.")}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Energy Intensity In Terms Of Physical Output</td><td className="border border-gray-200 px-2 py-1 text-gray-500">GJ/tonne</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_phys_cy", values, onChange, "metric")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_phys_py", values, onChange, "metric")}</td><td></td></tr>
                <tr><td className="border border-gray-200 px-2 py-1">Energy Intensity (Optional) – relevant metric may be selected by entity</td><td className="border border-gray-200 px-2 py-1 text-gray-500">{values["p6_e1_unit"] ?? "J"}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_opt_cy", values, onChange, "Value")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_opt_py", values, onChange, "Value")}</td><td></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-600">iv. Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex gap-4">
              {(["Yes", "No"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input type="radio" name="p6_e1_assess_yn" value={opt} checked={(values["p6_e1_assess_yn"] ?? "") === opt} onChange={() => onChange("p6_e1_assess_yn", opt)} className="rounded border-gray-300" />
                  <span className="text-sm">{opt}</span>
                </label>
              ))}
            </div>
            {(values["p6_e1_assess_yn"] ?? "") === "Yes" && (
              <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Name of external agency</label>{inp("p6_e1_assess_agency", values, onChange, "Text")}</div>
            )}
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Does the entity have any sites / facilities identified as designated consumers (DCs) under the Performance, Achieve and Trade (PAT) Scheme of the Government of India?</h3>
        <div className="mt-2 flex gap-4">
          {(["Yes", "No"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="p6_e2_pat" value={opt} checked={getYesNoValue(values, "p6_e2_pat") === opt} onChange={() => onChange("p6_e2_pat", opt)} className="rounded border-gray-300" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        {getYesNoValue(values, "p6_e2_pat") === "Yes" && (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-xs text-slate-500">Disclose whether targets set under the PAT scheme have been achieved. In case targets have not been achieved, provide the remedial action taken, if any.</p>
            <textarea value={values["p6_e2_targets"] ?? ""} onChange={(e) => onChange("p6_e2_targets", e.target.value)} placeholder="Targets + remedial action" rows={4} className="w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Water related information.</h3>
        <p className="mt-1 text-xs font-medium text-slate-600">i. Provide details of the following disclosures related to water (Water withdrawal by source (in kilolitres))</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Surface Water (A)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_surf_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_surf_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Groundwater (B)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_grnd_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_grnd_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Third Party Water (C)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_3p_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_3p_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Seawater / Desalinated Water (D)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_seawater_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_seawater_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Others (E)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_oth_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_oth_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Volume Of Water Withdrawal (In Kilolitres) (A + B + C + D + E)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_with_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_with_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total Volume Of Water Consumption (In Kilolitres)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_cons_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_cons_py", values, onChange)}</td></tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Water Intensity Per Rupee Of Turnover (Total Water Consumption / Revenue From Operations)</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e3_intensity_cy")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e3_intensity_py")}</td>
              </tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_py", values, onChange, "Rs.")}</td></tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Water Intensity Per Rupee Of Turnover Adjusted For PPP</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e3_intensity_ppp_cy")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e3_intensity_ppp_py")}</td>
              </tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water Intensity In Terms Of Physical Output</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_int_phys_cy", values, onChange, "metric")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_int_phys_py", values, onChange, "metric")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water Intensity (Optional) – relevant metric may be selected by entity</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_int_opt_cy", values, onChange, "Value")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_int_opt_py", values, onChange, "Value")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">ii. Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_e3_assess_yn" value={opt} checked={getYesNoValue(values, "p6_e3_assess_yn") === opt} onChange={() => onChange("p6_e3_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_e3_assess_yn") === "Yes" && (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Name of external agency</label>{inp("p6_e3_assess_agency", values, onChange, "Agency name")}</div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Provide the following details related to water discharged.</h3>
        <p className="mt-1 text-xs font-medium text-slate-600">i. Water discharge by destination and level of treatment (in kilolitres)</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th>
                <th className="border border-gray-200 px-2 py-1.5 text-center" colSpan={2}>{fyCurr}</th>
                <th className="border border-gray-200 px-2 py-1.5 text-center" colSpan={2}>{fyPrev}</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1 text-left text-xs font-normal text-gray-600"></th>
                <th className="border border-gray-200 px-2 py-1 text-left text-xs font-normal text-gray-600">Level of treatment</th>
                <th className="border border-gray-200 px-2 py-1 text-left text-xs font-normal text-gray-600">Value</th>
                <th className="border border-gray-200 px-2 py-1 text-left text-xs font-normal text-gray-600">Level of treatment</th>
                <th className="border border-gray-200 px-2 py-1 text-left text-xs font-normal text-gray-600">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">To Surface Water (A)</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- No treatment</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_nt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_nt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- With treatment – please specify level of treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_level_cy", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_level_py", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_py", values, onChange)}</td></tr>
              <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">To Groundwater (B)</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- No treatment</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_grnd_nt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_grnd_nt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- With treatment – please specify level of treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_grnd_t_level_cy", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_grnd_t_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_grnd_t_level_py", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_grnd_t_py", values, onChange)}</td></tr>
              <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">To Seawater (C)</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- No treatment</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sea_nt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sea_nt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- With treatment – please specify level of treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sea_t_level_cy", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sea_t_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sea_t_level_py", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sea_t_py", values, onChange)}</td></tr>
              <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">Sent To Third-Parties (D)</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- No treatment</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_3p_nt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_3p_nt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- With treatment – please specify level of treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_3p_t_level_cy", values, onChange, "e.g. Tertiary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_3p_t_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_3p_t_level_py", values, onChange, "e.g. Tertiary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_3p_t_py", values, onChange)}</td></tr>
              <tr className="bg-gray-50"><td colSpan={5} className="border border-gray-200 px-2 py-1 font-medium">Others (E)</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- No treatment</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_nt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_nt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 pl-4">- With treatment – please specify level of treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_t_level_cy", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_t_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_t_level_py", values, onChange, "e.g. Secondary")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_t_py", values, onChange)}</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-200 px-2 py-1 font-medium">Total Water Discharged (In Kilolitres)</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e4_tot_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-400">–</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e4_tot_py")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">ii. Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_e4_assess_yn" value={opt} checked={getYesNoValue(values, "p6_e4_assess_yn") === opt} onChange={() => onChange("p6_e4_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_e4_assess_yn") === "Yes" && (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Name of external agency</label>{inp("p6_e4_assess_agency", values, onChange, "Agency name")}</div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Has the entity implemented a mechanism for Zero Liquid Discharge?</h3>
        <div className="mt-2 flex flex-col gap-2">
          <select value={getYesNoValue(values, "p6_e5_zld")} onChange={(e) => onChange("p6_e5_zld", e.target.value)} className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm">
            {ZLD_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>{o.label}</option>
            ))}
          </select>
          {getYesNoValue(values, "p6_e5_zld") === "Yes" && (
            <>
              <p className="text-xs text-slate-500">If yes, provide details of its coverage and implementation.</p>
              <textarea value={values["p6_e5_zld_detail"] ?? ""} onChange={(e) => onChange("p6_e5_zld_detail", e.target.value)} placeholder="Text" rows={3} className="w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
            </>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Air emissions (other than GHG emissions)</h3>
        <p className="mt-1 text-xs font-medium text-slate-600">i. Whether air emissions (other than GHG emissions) by the entity is applicable to the company?</p>
        <div className="mt-2 flex gap-4">
          {(["Yes", "No"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="p6_e6_applicable" value={opt} checked={(values["p6_e6_applicable"] ?? "") === opt} onChange={() => onChange("p6_e6_applicable", opt)} className="rounded border-gray-300" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">ii. Please provide details of air emissions (other than GHG emissions) by the entity.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Unit</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">NOx</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_nox_unit"] ?? ""} onChange={(e) => onChange("p6_e6_nox_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">SOx</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_sox_unit"] ?? ""} onChange={(e) => onChange("p6_e6_sox_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Particulate Matter (PM)</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_pm_unit"] ?? ""} onChange={(e) => onChange("p6_e6_pm_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Persistent Organic Pollutants (POP)</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_pop_unit"] ?? ""} onChange={(e) => onChange("p6_e6_pop_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pop_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pop_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Volatile Organic Compounds (VOC)</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_voc_unit"] ?? ""} onChange={(e) => onChange("p6_e6_voc_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Hazardous Air Pollutants (HAP)</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_hap_unit"] ?? ""} onChange={(e) => onChange("p6_e6_hap_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_hap_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_hap_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Others</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e6_oth_unit"] ?? ""} onChange={(e) => onChange("p6_e6_oth_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{AIR_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_oth_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_oth_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">iii. Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_e6_assess_yn" value={opt} checked={getYesNoValue(values, "p6_e6_assess_yn") === opt} onChange={() => onChange("p6_e6_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_e6_assess_yn") === "Yes" && (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">If yes, Name of the external agency</label>{inp("p6_e6_assess_agency", values, onChange, "Text")}</div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Greenhouse gas emissions.</h3>
        <p className="mt-1 text-xs font-medium text-slate-600">i. Whether greenhouse gas emissions (Scope 1 and Scope 2 emissions) & its intensity is applicable to the company?</p>
        <div className="mt-2 flex gap-4">
          {(["Yes", "No"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="p6_e7_applicable" value={opt} checked={(values["p6_e7_applicable"] ?? "") === opt} onChange={() => onChange("p6_e7_applicable", opt)} className="rounded border-gray-300" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">ii. Provide details of greenhouse gas emissions (Scope 1 and Scope 2 emissions) & its intensity</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Unit</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              {(() => {
                const ghgUnit = values["p6_e7_unit"] || "tCO2e";
                const ghgUnitLabel = GHG_EMISSION_UNITS.find((u) => u.value === ghgUnit)?.label || ghgUnit;
                return (
                  <>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1 Emissions (Break-Up Of The GHG Into CO2, CH4, N2O, HFCs, PFCs, SF6, NF3, If Available)</td><td className="border border-gray-200 px-2 py-1"><select value={ghgUnit} onChange={(e) => onChange("p6_e7_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{GHG_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s1_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s1_py", values, onChange)}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 2 Emissions (Break-Up Of The GHG Into CO2, CH4, HFCs, PFCs, SF6, NF3, If Available)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{ghgUnitLabel}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s2_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s2_py", values, onChange)}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1 And Scope 2 Emissions (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{ghgUnitLabel}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_s1s2_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_s1s2_py")}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1 And Scope 2 Emissions Per Rupee Of Turnover <small className="block text-gray-500">(Total Scope 1 And Scope 2 GHG Emissions / Revenue From Operations)</small></td><td className="border border-gray-200 px-2 py-1 text-gray-600">{ghgUnitLabel} / Rs.</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e7_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e7_intensity_py")}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1" /><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_py", values, onChange, "Rs.")}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1 And Scope 2 Emission Intensity Per Rupee Of Turnover Adjusted For PPP <small className="block text-gray-500">(Total Scope 1 And Scope 2 GHG Emissions / Revenue From Operations Adjusted For PPP)</small></td><td className="border border-gray-200 px-2 py-1 text-gray-600">{ghgUnitLabel}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e7_intensity_ppp_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e7_intensity_ppp_py")}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1" /><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1 And Scope 2 Emission Intensity In Terms Of Physical Output</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{ghgUnitLabel}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_int_phys_cy", values, onChange, "metric")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_int_phys_py", values, onChange, "metric")}</td></tr>
                    <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1 And Scope 2 Emission Intensity (Optional)-The Relevant Metric May Be Selected By The Entity</td><td className="border border-gray-200 px-2 py-1"><select value={values["p6_e7_int_opt_unit"] ?? ""} onChange={(e) => onChange("p6_e7_int_opt_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">{GHG_EMISSION_UNITS.map((u) => <option key={u.value || "empty"} value={u.value}>{u.label}</option>)}</select></td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_int_opt_cy", values, onChange, "Value")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_int_opt_py", values, onChange, "Value")}</td></tr>
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">iii. Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_e7_assess_yn" value={opt} checked={getYesNoValue(values, "p6_e7_assess_yn") === opt} onChange={() => onChange("p6_e7_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_e7_assess_yn") === "Yes" && (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">If yes, Name of the external agency</label>{inp("p6_e7_assess_agency", values, onChange, "Text")}</div>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Does the entity have any project related to reducing Green House Gas emission?</h3>
        <div className="mt-2">
          <select value={getYesNoValue(values, "p6_e8_ghg_yn")} onChange={(e) => onChange("p6_e8_ghg_yn", e.target.value)} className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm">
            {ZLD_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Provide details related to waste management by the entity</h3>
        <p className="mt-2 text-xs font-medium text-slate-600">i. Total Waste generated (in metric tonnes)</p>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Plastic Waste (A)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_plast_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_plast_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">E-Waste (B)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ew_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ew_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Bio-medical waste (C)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_bio_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_bio_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Construction and demolition waste (D)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_cd_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_cd_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Battery waste (E)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_batt_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_batt_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Radioactive waste (F)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_radio_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_radio_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other Hazardous waste. Please specify, if any. (G)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ohaz_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ohaz_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other Non-hazardous waste generated (H). Please specify, if any.</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_onh_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_onh_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total (A+B+C+D+E+F+G+H)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_total_py")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">Waste Intensity Metrics</p>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Waste intensity per rupee of turnover <small className="block text-gray-500">(Total waste generated / Revenue from operations)</small></td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e9_intensity_cy")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e9_intensity_py")}</td>
              </tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_py", values, onChange, "Rs.")}</td></tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Waste intensity per rupee of turnover adjusted for PPP <small className="block text-gray-500">(Total waste generated / Revenue adjusted for PPP)</small></td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e9_intensity_ppp_cy")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_e9_intensity_ppp_py")}</td>
              </tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Waste intensity in terms of physical output</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_int_phys_cy", values, onChange, "metric")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_int_phys_py", values, onChange, "metric")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Waste intensity (optional) – relevant metric selected by entity</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_int_opt_cy", values, onChange, "Value")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_int_opt_py", values, onChange, "Value")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">ii. For each category of waste generated, total waste recovered through recycling, re-using or other recovery operations (in metric tonnes)</p>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Category of waste</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Recycled</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rec_recy_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rec_recy_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Re-Used</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rec_reuse_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rec_reuse_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other Recovery Operations</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rec_oth_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rec_oth_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_rec_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_rec_total_py")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">iii. For each category of waste generated, total waste disposed by nature of disposal method (in metric tonnes)</p>
        <div className="mt-1 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Category of waste</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Incineration</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_disp_inc_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_disp_inc_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Landfilling</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_disp_land_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_disp_land_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other Disposal Operations</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_disp_oth_cy", values, onChange, "mt")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_disp_oth_py", values, onChange, "mt")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_disp_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_disp_total_py")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">iv. Indicate if any independent assessment/evaluation/assurance has been carried out by an external agency? If yes, name of the external agency.</p>
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_e9_assess_yn" value={opt} checked={getYesNoValue(values, "p6_e9_assess_yn") === opt} onChange={() => onChange("p6_e9_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_e9_assess_yn") === "Yes" ? (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Name of external agency</label>{inp("p6_e9_assess_agency", values, onChange, "Agency name")}</div>
          ) : null}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">10. Briefly describe the waste management practices adopted in your establishments. Describe the strategy adopted by your company to reduce usage of hazardous and toxic chemicals in your products and processes and the practices adopted to manage such wastes.</h3>
        <textarea value={values["p6_e10_waste"] ?? ""} onChange={(e) => onChange("p6_e10_waste", e.target.value)} placeholder="Details" rows={4} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">11. If the entity has operations/offices in/around ecologically sensitive areas (such as national parks, wildlife sanctuaries, biosphere reserves, wetlands, biodiversity hotspots, forests, coastal regulation zones etc.) where environmental approvals / clearances are required.</h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: n11 }, (_, i) => {
            const locCode = `p6_e11_row${i}_loc`;
            const typeCode = `p6_e11_row${i}_type`;
            const ynCode = `p6_e11_row${i}_yn`;
            const correctCode = `p6_e11_row${i}_correct`;
            const ynVal = getYesNoValue(values, ynCode);
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {n11 > 1 && i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (n11 <= 1) return;
                        for (let j = i; j < n11 - 1; j++) {
                          for (const f of P6_E11_FIELDS) {
                            onChange(`p6_e11_row${j}_${f}`, values[`p6_e11_row${j + 1}_${f}`] ?? "");
                          }
                        }
                        for (const f of P6_E11_FIELDS) {
                          onChange(`p6_e11_row${n11 - 1}_${f}`, "");
                        }
                        onChange("p6_e11_rowcount", String(n11 - 1));
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div>
                    <label className="block text-xs text-gray-400">Location of operations/offices</label>
                    {inp(locCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Type of operations</label>
                    {inp(typeCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Whether the conditions of environmental approval/clearance are being complied with?</label>
                    <div className="mt-1 flex gap-4">
                      {(["Yes", "No"] as const).map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input type="radio" name={ynCode} value={opt} checked={ynVal === opt} onChange={() => onChange(ynCode, opt)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {ynVal === "No" ? (
                    <div>
                      <label className="block text-xs text-gray-400">If no, the reasons thereof and corrective action taken, if any</label>
                      {inp(correctCode, values, onChange)}
                    </div>
                  ) : null}
                </div>
              </details>
            );
          })}
          {n11 < MAX_P6_ROWS && (
            <button type="button" onClick={() => onChange("p6_e11_rowcount", String(n11 + 1))} className="add-row-btn mt-2 rounded border px-3 py-1.5 text-sm">
              +ADD
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">12. Details of environmental impact assessments of projects undertaken by the entity based on applicable laws, in the current financial year</h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: n12 }, (_, i) => {
            const nameCode = `p6_e12_row${i}_name`;
            const notifCode = `p6_e12_row${i}_notif`;
            const dateCode = `p6_e12_row${i}_date`;
            const indCode = `p6_e12_row${i}_ind`;
            const pubCode = `p6_e12_row${i}_pub`;
            const linkCode = `p6_e12_row${i}_link`;
            const indVal = getYesNoValue(values, indCode);
            const pubVal = getYesNoValue(values, pubCode);
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {n12 > 1 && i > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (n12 <= 1) return;
                        for (let j = i; j < n12 - 1; j++) {
                          for (const f of P6_E12_FIELDS) {
                            onChange(`p6_e12_row${j}_${f}`, values[`p6_e12_row${j + 1}_${f}`] ?? "");
                          }
                        }
                        for (const f of P6_E12_FIELDS) {
                          onChange(`p6_e12_row${n12 - 1}_${f}`, "");
                        }
                        onChange("p6_e12_rowcount", String(n12 - 1));
                      }}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div>
                    <label className="block text-xs text-gray-400">Name and Brief of the project</label>
                    {inp(nameCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">EIA Notification no</label>
                    {inp(notifCode, values, onChange)}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Date (dd/mm/yyyy)</label>
                    {inp(dateCode, values, onChange, "dd/mm/yyyy")}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Whether conducted by independent external agency?</label>
                    <div className="mt-1 flex gap-4">
                      {(["Yes", "No"] as const).map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input type="radio" name={indCode} value={opt} checked={indVal === opt} onChange={() => onChange(indCode, opt)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Results communicated in public domain?</label>
                    <div className="mt-1 flex gap-4">
                      {(["Yes", "No"] as const).map((opt) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input type="radio" name={pubCode} value={opt} checked={pubVal === opt} onChange={() => onChange(pubCode, opt)} className="rounded border-gray-300" />
                          <span className="text-sm text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400">Relevant web link</label>
                    {inp(linkCode, values, onChange)}
                  </div>
                </div>
              </details>
            );
          })}
          {n12 < MAX_P6_ROWS && (
            <button type="button" onClick={() => onChange("p6_e12_rowcount", String(n12 + 1))} className="add-row-btn mt-2 rounded border px-3 py-1.5 text-sm">
              +ADD
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">13. Applicable environmental law/ regulations/ guidelines in India.</h3>
        <p className="mt-2 text-xs font-medium text-slate-600">i. Is the entity compliant with the applicable environmental law/ regulations/ guidelines in India; such as the Water (Prevention and Control of Pollution) Act, Air (Prevention and Control of Pollution) Act, Environment protection act and rules thereunder.</p>
        <div className="mt-2">
          <select value={getYesNoValue(values, "p6_e13_comp") || (values["p6_e13_comp"] ?? "")} onChange={(e) => onChange("p6_e13_comp", e.target.value)} className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm">
            {ZLD_OPTIONS.map((o) => (
              <option key={o.value || "empty"} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        {(values["p6_e13_comp"] ?? "") === "No" && (
          <>
            <p className="mt-4 text-xs font-medium text-slate-600">ii. If not, provide details of all such non-compliances</p>
            <div className="mt-2 flex flex-col gap-3">
              {Array.from({ length: n13 }, (_, i) => {
                const lawCode = `p6_e13_row${i}_law`;
                const detailCode = `p6_e13_row${i}_detail`;
                const finesCode = `p6_e13_row${i}_fines`;
                const correctCode = `p6_e13_row${i}_correct`;
                return (
                  <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#334155]">
                      <span>Record {i + 1}</span>
                      {n13 > 1 && i > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            if (n13 <= 1) return;
                            for (let j = i; j < n13 - 1; j++) {
                              for (const f of P6_E13_FIELDS) {
                                onChange(`p6_e13_row${j}_${f}`, values[`p6_e13_row${j + 1}_${f}`] ?? "");
                              }
                            }
                            for (const f of P6_E13_FIELDS) {
                              onChange(`p6_e13_row${n13 - 1}_${f}`, "");
                            }
                            onChange("p6_e13_rowcount", String(n13 - 1));
                          }}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          Remove
                        </button>
                      )}
                    </summary>
                    <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                      <div>
                        <label className="block text-xs text-gray-400">Specify the law/regulation/guidelines which was not complied with</label>
                        {inp(lawCode, values, onChange)}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Provide details of non-compliance</label>
                        {inp(detailCode, values, onChange)}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Any fines/penalties/action taken by regulatory agencies such as pollution control boards or by courts</label>
                        {inp(finesCode, values, onChange)}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400">Corrective action taken, if any</label>
                        {inp(correctCode, values, onChange)}
                      </div>
                    </div>
                  </details>
                );
              })}
              {n13 < MAX_P6_ROWS && (
                <button type="button" onClick={() => onChange("p6_e13_rowcount", String(n13 + 1))} className="add-row-btn mt-2 rounded border px-3 py-1.5 text-sm">
                  +ADD
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

const P6_L4_FIELDS = ["init", "detail", "outcome", "correct"] as const;

export function P6LeadershipContent({
  values,
  onChange,
  allowedSet: _allowedSet = null,
  reportingYear,
  calcDisplay = {},
}: P6Props) {
  const d = (code: string) => calcDisplay[code] ?? "";
  const dOrDash = (code: string) => d(code) || "–";
  const [fyCurr, fyPrev] = reportingYear ? getFYLabelsFromReportingYear(reportingYear) : ["Current FY", "Previous FY"];
  const nL1 = rowCount(values, "p6_l1_rowcount", MAX_P6_ROWS);
  const nL4 = rowCount(values, "p6_l4_rowcount", MAX_P6_ROWS);

  // Migrate p6_l1_area_cy etc to p6_l1_row0_*
  useEffect(() => {
    const row0HasData = (values["p6_l1_row0_area"] ?? "").trim();
    const oldArea = (values["p6_l1_area_cy"] ?? values["p6_l1_area_py"] ?? "").trim();
    if (oldArea && !row0HasData) {
      onChange("p6_l1_row0_area", values["p6_l1_area_cy"] ?? values["p6_l1_area_py"] ?? "");
      onChange("p6_l1_row0_surf_cy", values["p6_l1_with_cy"] ?? "");
      onChange("p6_l1_row0_surf_py", values["p6_l1_with_py"] ?? "");
      onChange("p6_l1_row0_cons_cy", values["p6_l1_cons_cy"] ?? "");
      onChange("p6_l1_row0_cons_py", values["p6_l1_cons_py"] ?? "");
      onChange("p6_l1_row0_surf_a_nt_cy", values["p6_l1_disp_cy"] ?? "");
      onChange("p6_l1_row0_surf_a_nt_py", values["p6_l1_disp_py"] ?? "");
      onChange("p6_l1_rowcount", "1");
    }
  }, [onChange, values]);

  // Migrate p6_l4_init etc to p6_l4_row0_*
  useEffect(() => {
    const row0HasData = (values["p6_l4_row0_init"] ?? "").trim();
    const oldHasData = (values["p6_l4_init"] ?? "").trim();
    if (oldHasData && !row0HasData) {
      onChange("p6_l4_row0_init", values["p6_l4_init"] ?? "");
      onChange("p6_l4_row0_detail", values["p6_l4_detail"] ?? "");
      onChange("p6_l4_row0_outcome", values["p6_l4_outcome"] ?? "");
      onChange("p6_l4_rowcount", "1");
    }
  }, [onChange, values]);

  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Water withdrawal, consumption and discharge in areas of water stress (in kilolitres)</h3>
        <p className="mt-2 text-xs font-medium text-slate-600">i. For each facility / plant located in areas of water stress.</p>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL1 }, (_, i) => {
            const r = `p6_l1_row${i}`;
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {nL1 > 1 && i > 0 && (
                    <button type="button" onClick={(e) => {
                      e.preventDefault();
                      if (nL1 <= 1) return;
                      const wf = ["surf", "grnd", "third", "sea", "oth"] as const;
                      const df = ["surf_a_nt", "surf_a_t_lev", "surf_a_t_val", "grnd_b_nt", "grnd_b_t_lev", "grnd_b_t_val", "sea_c_nt", "sea_c_t_lev", "sea_c_t_val", "third_d_nt", "third_d_t_lev", "third_d_t_val", "oth_e_nt", "oth_e_t_lev", "oth_e_t_val"] as const;
                      for (let j = i; j < nL1 - 1; j++) {
                        onChange(`p6_l1_row${j}_area`, values[`p6_l1_row${j + 1}_area`] ?? "");
                        onChange(`p6_l1_row${j}_nature`, values[`p6_l1_row${j + 1}_nature`] ?? "");
                        wf.forEach((f) => { onChange(`p6_l1_row${j}_${f}_cy`, values[`p6_l1_row${j + 1}_${f}_cy`] ?? ""); onChange(`p6_l1_row${j}_${f}_py`, values[`p6_l1_row${j + 1}_${f}_py`] ?? ""); });
                        onChange(`p6_l1_row${j}_cons_cy`, values[`p6_l1_row${j + 1}_cons_cy`] ?? ""); onChange(`p6_l1_row${j}_cons_py`, values[`p6_l1_row${j + 1}_cons_py`] ?? "");
                        onChange(`p6_l1_row${j}_int_opt_cy`, values[`p6_l1_row${j + 1}_int_opt_cy`] ?? ""); onChange(`p6_l1_row${j}_int_opt_py`, values[`p6_l1_row${j + 1}_int_opt_py`] ?? "");
                        df.forEach((f) => { onChange(`p6_l1_row${j}_${f}_cy`, values[`p6_l1_row${j + 1}_${f}_cy`] ?? ""); onChange(`p6_l1_row${j}_${f}_py`, values[`p6_l1_row${j + 1}_${f}_py`] ?? ""); });
                      }
                      wf.forEach((f) => { onChange(`p6_l1_row${nL1 - 1}_${f}_cy`, ""); onChange(`p6_l1_row${nL1 - 1}_${f}_py`, ""); });
                      onChange(`p6_l1_row${nL1 - 1}_cons_cy`, ""); onChange(`p6_l1_row${nL1 - 1}_cons_py`, "");
                      onChange(`p6_l1_row${nL1 - 1}_int_opt_cy`, ""); onChange(`p6_l1_row${nL1 - 1}_int_opt_py`, "");
                      df.forEach((f) => { onChange(`p6_l1_row${nL1 - 1}_${f}_cy`, ""); onChange(`p6_l1_row${nL1 - 1}_${f}_py`, ""); });
                      onChange("p6_l1_rowcount", String(nL1 - 1));
                    }} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </summary>
                <div className="space-y-4 border-t border-[#334155] px-3 py-3">
                  <div><label className="block text-xs text-gray-400">a. Name of the area</label>{inp(`${r}_area`, values, onChange, "Enter name of area")}</div>
                  <div><label className="block text-xs text-gray-400">b. Nature of operations</label>{inp(`${r}_nature`, values, onChange, "Nature of operations")}</div>
                  <div>
                    <label className="block text-xs text-gray-400">c. Water withdrawal, consumption and discharge</label>
                    <p className="mt-2 text-xs font-medium text-slate-500">Water withdrawal by source (in kl)</p>
                    <div className="mt-1 overflow-x-auto">
                      <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
                        <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
                        <tbody>
                          <tr><td className="border border-gray-200 px-2 py-1">Surface Water</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1">Groundwater</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1">Third Party Water</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1">Seawater / Desalinated Water</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1">Others</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Volume Of Water Withdrawal (In Kilolitres)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash(`${r}_total_with_cy`)}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash(`${r}_total_with_py`)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Volume Of Water Consumption (In Kilolitres)</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_cons_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_cons_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1">Water Intensity Per Rupee Of Turnover</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash(`${r}_intensity_cy`)}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash(`${r}_intensity_py`)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1">Water Intensity</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_int_opt_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_int_opt_py`, values, onChange)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-xs font-medium text-slate-500">Water discharge by destination and level of treatment (in kl)</p>
                    <div className="mt-1 overflow-x-auto">
                      <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
                        <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5" colSpan={2}>{fyPrev}</th></tr><tr className="bg-gray-50"><th></th><th className="border border-gray-200 px-2 py-1">Level of treatment</th><th className="border border-gray-200 px-2 py-1">Value</th><th className="border border-gray-200 px-2 py-1">Level of treatment</th><th className="border border-gray-200 px-2 py-1">Value</th></tr></thead>
                        <tbody>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">To Surface Water (A)</td><td colSpan={4}></td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Surface Water With No Treatment</td><td className="border border-gray-200 px-2 py-1"></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_a_nt_cy`, values, onChange)}</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_a_nt_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Surface Water With Treatment</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_a_t_lev_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_a_t_val_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_a_t_lev_py`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_surf_a_t_val_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">To Groundwater (B)</td><td colSpan={4}></td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Groundwater With No Treatment</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_b_nt_cy`, values, onChange)}</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_b_nt_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Groundwater With Treatment</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_b_t_lev_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_b_t_val_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_b_t_lev_py`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_grnd_b_t_val_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">To Seawater (C)</td><td colSpan={4}></td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Seawater With No Treatment</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_c_nt_cy`, values, onChange)}</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_c_nt_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Seawater With Treatment</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_c_t_lev_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_c_t_val_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_c_t_lev_py`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_sea_c_t_val_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">Sent To Third-Parties (D)</td><td colSpan={4}></td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Sent To Third-Parties With No Treatment</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_d_nt_cy`, values, onChange)}</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_d_nt_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Sent To Third-Parties With Treatment</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_d_t_lev_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_d_t_val_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_d_t_lev_py`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_third_d_t_val_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">Others (E)</td><td colSpan={4}></td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Others With No Treatment</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_e_nt_cy`, values, onChange)}</td><td></td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_e_nt_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 pl-4">- Others With Treatment</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_e_t_lev_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_e_t_val_cy`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_e_t_lev_py`, values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp(`${r}_oth_e_t_val_py`, values, onChange)}</td></tr>
                          <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total Water Discharged (In Kilolitres)</td><td colSpan={2} className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash(`${r}_total_disp_cy`)}</td><td colSpan={2} className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash(`${r}_total_disp_py`)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </details>
            );
          })}
          {nL1 < MAX_P6_ROWS && (
            <button type="button" onClick={() => onChange("p6_l1_rowcount", String(nL1 + 1))} className="add-row-btn mt-2 rounded border px-3 py-1.5 text-sm">
              +ADD
            </button>
          )}
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">ii. Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_l1_assess_yn" value={opt} checked={getYesNoValue(values, "p6_l1_assess_yn") === opt} onChange={() => onChange("p6_l1_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_l1_assess_yn") === "Yes" ? (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Name of external agency</label>{inp("p6_l1_assess_agency", values, onChange, "Agency name")}</div>
          ) : null}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Total Scope 3 emissions</h3>
        <p className="mt-2 text-xs font-medium text-slate-600">(i) Whether total Scope 3 emissions & its intensity is applicable to the company?</p>
        <div className="mt-2 flex gap-4">
          {(["Yes", "No"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="p6_l2_applicable" value={opt} checked={(values["p6_l2_applicable"] ?? "") === opt} onChange={() => onChange("p6_l2_applicable", opt)} className="rounded border-gray-300" />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">(ii) Please provide details of total Scope 3 emissions & its intensity.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Unit</th><th className="border border-gray-200 px-2 py-1.5">{fyCurr}</th><th className="border border-gray-200 px-2 py-1.5">{fyPrev}</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Total Scope 3 Emissions</td>
                <td className="border border-gray-200 px-2 py-1">
                  <select value={values["p6_l2_unit"] ?? "tCO2e"} onChange={(e) => onChange("p6_l2_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">
                    {GHG_EMISSION_UNITS.filter((o) => o.value).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_l2_s3_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_l2_s3_py", values, onChange)}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Total Scope 3 Emissions Per Rupee Of Turnover</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{(values["p6_l2_unit"] || "tCO2e")} / Rs.</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_l2_intensity_cy")}</td>
                <td className="border border-gray-200 px-2 py-1 text-gray-600">{dOrDash("p6_l2_intensity_py")}</td>
              </tr>
              <tr>
                <td className="border border-gray-200 px-2 py-1">Total Scope 3 Emission Intensity (Optional)</td>
                <td className="border border-gray-200 px-2 py-1">
                  <select value={values["p6_l2_int_opt_unit"] ?? ""} onChange={(e) => onChange("p6_l2_int_opt_unit", e.target.value)} className="w-full rounded border border-gray-300 px-2 py-1 text-sm">
                    {GHG_EMISSION_UNITS.map((o) => <option key={o.value || "empty"} value={o.value}>{o.label}</option>)}
                  </select>
                </td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_l2_int_cy", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_l2_int_py", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs font-medium text-slate-600">(iii) Indicate if any independent assessment/ evaluation/assurance has been carried out by an external agency? If yes, name of the external agency</p>
        <div className="mt-2 flex flex-col gap-3">
          <div className="flex gap-4">
            {(["Yes", "No"] as const).map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input type="radio" name="p6_l2_assess_yn" value={opt} checked={getYesNoValue(values, "p6_l2_assess_yn") === opt} onChange={() => onChange("p6_l2_assess_yn", opt)} className="rounded border-gray-300" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
          {getYesNoValue(values, "p6_l2_assess_yn") === "Yes" ? (
            <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Name of external agency</label>{inp("p6_l2_assess_agency", values, onChange, "Agency name")}</div>
          ) : null}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. With respect to the ecologically sensitive areas reported at Question 10 of Essential Indicators above, provide details of significant direct & indirect impact of the entity on biodiversity in such areas along-with prevention and remediation activities.</h3>
        <textarea value={values["p6_l3_bio"] ?? ""} onChange={(e) => onChange("p6_l3_bio", e.target.value)} placeholder="Text" rows={4} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. If the entity has undertaken any specific initiatives or used innovative technology or solutions to improve resource efficiency, or reduce impact due to emissions / effluent discharge / waste generated.</h3>
        <div className="mt-2 flex flex-col gap-3">
          {Array.from({ length: nL4 }, (_, i) => {
            const r = `p6_l4_row${i}`;
            return (
              <details key={i} open className="rounded border border-[#475569] bg-[#1e293b]">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:bg-[#334155]">
                  <span>Record {i + 1}</span>
                  {nL4 > 1 && i > 0 && (
                    <button type="button" onClick={(e) => { e.preventDefault(); if (nL4 <= 1) return; for (let j = i; j < nL4 - 1; j++) { for (const f of P6_L4_FIELDS) onChange(`p6_l4_row${j}_${f}`, values[`p6_l4_row${j + 1}_${f}`] ?? ""); } for (const f of P6_L4_FIELDS) onChange(`p6_l4_row${nL4 - 1}_${f}`, ""); onChange("p6_l4_rowcount", String(nL4 - 1)); }} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </summary>
                <div className="space-y-3 border-t border-[#334155] px-3 py-3">
                  <div><label className="block text-xs text-gray-400">Initiative Undertaken</label>{inp(`${r}_init`, values, onChange)}</div>
                  <div><label className="block text-xs text-gray-400">Details of the initiative (Web-link, if any, may be provided along-with summary)</label><textarea value={values[`${r}_detail`] ?? ""} onChange={(e) => onChange(`${r}_detail`, e.target.value)} placeholder="Enter Text" rows={3} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm" /></div>
                  <div><label className="block text-xs text-gray-400">Outcome of the initiative</label><textarea value={values[`${r}_outcome`] ?? ""} onChange={(e) => onChange(`${r}_outcome`, e.target.value)} placeholder="Enter Text" rows={2} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm" /></div>
                  <div><label className="block text-xs text-gray-400">Corrective action taken, if any</label><textarea value={values[`${r}_correct`] ?? ""} onChange={(e) => onChange(`${r}_correct`, e.target.value)} placeholder="Enter Text" rows={2} className="mt-1 w-full rounded border border-gray-300 px-2 py-1.5 text-sm" /></div>
                </div>
              </details>
            );
          })}
          {nL4 < MAX_P6_ROWS && (
            <button type="button" onClick={() => onChange("p6_l4_rowcount", String(nL4 + 1))} className="add-row-btn mt-2 rounded border px-3 py-1.5 text-sm">
              +ADD
            </button>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Does the entity have a business continuity and disaster management plan?</h3>
        <div className="mt-2">
          <select value={values["p6_l5_yn"] ?? ""} onChange={(e) => onChange("p6_l5_yn", e.target.value)} className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm">
            {ZLD_OPTIONS.map((o) => <option key={o.value || "empty"} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        {(values["p6_l5_yn"] ?? "") === "Yes" && (
          <div className="mt-3">
            <label className="block text-xs text-gray-500">Details of entity at which business continuity and disaster management plan is placed or weblink</label>
            <textarea value={values["p6_l5_bcp"] ?? ""} onChange={(e) => onChange("p6_l5_bcp", e.target.value)} placeholder="Details/weblink" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Disclose any significant adverse impact to the environment, arising from the value chain of the entity. What mitigation or adaptation measures have been taken by the entity in this regard?</h3>
        <textarea value={values["p6_l6_value"] ?? ""} onChange={(e) => onChange("p6_l6_value", e.target.value)} placeholder="Text" rows={4} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. Percentage of value chain partners (by value of business done with such partners) that were assessed for environmental impacts.</h3>
        <div className="mt-2 flex items-center gap-2">
          <input type="text" value={values["p6_l7_pct"] ?? ""} onChange={(e) => onChange("p6_l7_pct", e.target.value)} placeholder="0" className="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm" />
          <span className="rounded border border-gray-300 bg-gray-100 px-2 py-1.5 text-sm text-gray-600">%</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Green Credits</h3>
        <div className="mt-2 space-y-3">
          <div><label className="block text-xs text-gray-500">a) Green Credits Generated – Total number of credits generated</label>{inp("p6_l8_generated", values, onChange, "Total number of credits generated")}</div>
          <div><label className="block text-xs text-gray-500">b) Green Credits Procured – Credits purchased from third parties</label>{inp("p6_l8_procured", values, onChange, "Credits purchased from third parties")}</div>
        </div>
      </div>
    </>
  );
}
