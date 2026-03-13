"use client";

import type { AnswersState } from "@/lib/brsr/types";
import { QuestionInput } from "@/components/QuestionInput";

type P6Props = {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

function inp(code: string, values: AnswersState, onChange: (code: string, value: string) => void, placeholder = "") {
  return <QuestionInput code={code} values={values} onChange={onChange} placeholder={placeholder} />;
}

export function P6EssentialContent({ values, calcDisplay, onChange, allowedSet: _allowedSet = null }: P6Props) {
  const d = (code: string) => calcDisplay[code] ?? "";
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Energy consumption (renewable / non-renewable) and intensity</h3>
        <p className="mt-1 text-xs text-slate-400">Revenue from operations and PPP-adjusted revenue are auto-filled from General Data.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Renewable – Electricity</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_el_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_el_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Renewable – Fuel</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_fuel_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_fuel_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Renewable – Other</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_oth_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_oth_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total renewable (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_re_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_re_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Non-renewable – Electricity</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_el_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_el_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Non-renewable – Fuel</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_fuel_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_fuel_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Non-renewable – Other</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_oth_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_oth_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total non-renewable (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_nre_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_nre_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Energy intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Energy intensity / revenue PPP</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_ppp_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_ppp_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Energy intensity (physical)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_phys_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_phys_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. PAT scheme</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Designated consumer (Y/N)</label>{inp("p6_e2_pat", values, onChange, "Y/N")}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Targets achieved</label>{inp("p6_e2_targets", values, onChange)}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Remedial action</label>{inp("p6_e2_remedial", values, onChange)}</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Water – withdrawal, consumption, intensity</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Surface water (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_surf_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_surf_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Groundwater (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_grnd_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_grnd_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Third party (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_3p_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_3p_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Others (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_oth_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_oth_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total withdrawal (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_with_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_with_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total consumption (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_cons_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_cons_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Water discharge (kL)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Destination</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Surface water – no treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_nt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_nt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Surface water – with treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Third party / Others</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Zero liquid discharge (Y/N)</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          {inp("p6_e5_zld", values, onChange, "Y/N")}
          {inp("p6_e5_zld_detail", values, onChange, "Coverage/details")}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Air emissions (NOx, SOx, PM, VOC, etc.)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Unit</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">NOx</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_unit", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">SOx</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_unit", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Particulate matter (PM)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_unit", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">VOC</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_unit", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. GHG – Scope 1 and Scope 2 (tCO2e) and intensity</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Scope 1 emissions (tCO2e)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s1_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s1_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Scope 2 emissions (tCO2e)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s2_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s2_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1+2 (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_s1s2_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_s1s2_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Emission intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">8. Projects for reducing GHG (Y/N). Details</h3>
        <div className="mt-2 flex flex-wrap gap-4">{inp("p6_e8_ghg_yn", values, onChange, "Y/N")} {inp("p6_e8_ghg_detail", values, onChange, "Details")}</div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">9. Waste generated (metric tonnes) and intensity</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Plastic waste</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_plast_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_plast_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">E-waste</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ew_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ew_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Bio-medical</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_bio_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_bio_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">C&D waste</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_cd_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_cd_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Battery</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_batt_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_batt_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Radioactive</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_radio_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_radio_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other hazardous</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ohaz_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ohaz_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other non-hazardous</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_onh_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_onh_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Waste intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_py", values, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_ppp_cy", values, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_ppp_py", values, onChange, "Rs.")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs font-medium text-slate-400">Recovery (recycled, re-used, other) – mt</p>
        <div className="mt-1 flex flex-wrap gap-4">
          {inp("p6_e9_rec_recy_cy", values, onChange)} / {inp("p6_e9_rec_recy_py", values, onChange)} (recycled)
          {inp("p6_e9_rec_reuse_cy", values, onChange)} / {inp("p6_e9_rec_reuse_py", values, onChange)} (re-used)
          {inp("p6_e9_rec_oth_cy", values, onChange)} / {inp("p6_e9_rec_oth_py", values, onChange)} (other) — Total: {d("p6_e9_rec_total_cy")} / {d("p6_e9_rec_total_py")}
        </div>
        <p className="mt-2 text-xs font-medium text-slate-400">Disposal (incineration, landfilling, other) – mt</p>
        <div className="mt-1 flex flex-wrap gap-4">
          {inp("p6_e9_disp_inc_cy", values, onChange)} / {inp("p6_e9_disp_inc_py", values, onChange)} (incineration)
          {inp("p6_e9_disp_land_cy", values, onChange)} / {inp("p6_e9_disp_land_py", values, onChange)} (landfilling)
          {inp("p6_e9_disp_oth_cy", values, onChange)} / {inp("p6_e9_disp_oth_py", values, onChange)} (other) — Total: {d("p6_e9_disp_total_cy")} / {d("p6_e9_disp_total_py")}
        </div>
        <div className="mt-2 flex flex-wrap gap-4">
          {inp("p6_e9_assess_yn", values, onChange, "Independent assessment Y/N")}
          {inp("p6_e9_assess_agency", values, onChange, "Agency name")}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">10. Waste management practices and strategy</h3>
        <textarea value={values["p6_e10_waste"] ?? ""} onChange={(e) => onChange("p6_e10_waste", e.target.value)} placeholder="Details" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">11. Operations in ecologically sensitive areas</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5">S. No.</th><th className="border border-gray-200 px-2 py-1.5">Location</th><th className="border border-gray-200 px-2 py-1.5">Type</th><th className="border border-gray-200 px-2 py-1.5">Complied (Y/N)</th><th className="border border-gray-200 px-2 py-1.5">Corrective action</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">1</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_loc", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_type", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_yn", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_correct", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">2</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_loc", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_type", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_yn", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_correct", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">12. EIA of projects</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5">Project name</th><th className="border border-gray-200 px-2 py-1.5">Notification no.</th><th className="border border-gray-200 px-2 py-1.5">Date</th><th className="border border-gray-200 px-2 py-1.5">Independent (Y/N)</th><th className="border border-gray-200 px-2 py-1.5">Public (Y/N)</th><th className="border border-gray-200 px-2 py-1.5">Weblink</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_name", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_notif", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_date", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_ind", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_pub", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_link", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">13. Environmental compliance (Y/N). Non-compliances</h3>
        <div className="mt-2 flex flex-wrap gap-4">{inp("p6_e13_comp", values, onChange, "Y/N")}</div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Law/regulation</th><th className="border border-gray-200 px-2 py-1.5">Details</th><th className="border border-gray-200 px-2 py-1.5">Fines/action</th><th className="border border-gray-200 px-2 py-1.5">Corrective action</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_law", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_detail", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_fines", values, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_correct", values, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function P6LeadershipContent({
  values,
  onChange,
  allowedSet: _allowedSet = null,
}: Omit<P6Props, "calcDisplay">) {
  return (
    <>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">1. Water in areas of water stress (kL)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Facility/area name</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_area_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_area_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water withdrawal (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_with_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_with_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water consumption (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_cons_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_cons_py", values, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water discharge (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_disp_cy", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_disp_py", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">2. Scope 3 emissions (tCO2e) and intensity</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          {inp("p6_l2_s3_cy", values, onChange)} / {inp("p6_l2_s3_py", values, onChange)} (Scope 3 tCO2e)
          {inp("p6_l2_int_cy", values, onChange)} / {inp("p6_l2_int_py", values, onChange)} (intensity)
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">3. Biodiversity impact in ecologically sensitive areas</h3>
        <textarea value={values["p6_l3_bio"] ?? ""} onChange={(e) => onChange("p6_l3_bio", e.target.value)} placeholder="Prevention and remediation" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">4. Initiatives / innovative technology – resource efficiency, emissions/effluent/waste</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Initiative</th><th className="border border-gray-200 px-2 py-1.5">Details (weblink/summary)</th><th className="border border-gray-200 px-2 py-1.5">Outcome</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">{inp("p6_l4_init", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l4_detail", values, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l4_outcome", values, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">5. Business continuity and disaster management plan</h3>
        <textarea value={values["p6_l5_bcp"] ?? ""} onChange={(e) => onChange("p6_l5_bcp", e.target.value)} placeholder="Details/weblink" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">6. Adverse impact from value chain – mitigation measures</h3>
        <textarea value={values["p6_l6_value"] ?? ""} onChange={(e) => onChange("p6_l6_value", e.target.value)} placeholder="Details" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-teal-400">7. % value chain partners assessed for environmental impacts</h3>
        <div className="mt-2">{inp("p6_l7_pct", values, onChange, "%")}</div>
      </div>
    </>
  );
}
