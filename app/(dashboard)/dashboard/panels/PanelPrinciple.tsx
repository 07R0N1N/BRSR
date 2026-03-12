"use client";

import { useState } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import type { PanelId } from "@/lib/brsr/types";
import { getQuestionCodesForPanel, NGRBC_PRINCIPLE_TITLES, P6_AUTOFILL_REV_IDS, P6_AUTOFILL_REV_PPP_IDS } from "@/lib/brsr/questionConfig";

function inp(
  code: string,
  v: (c: string) => string,
  onChange: (code: string, value: string) => void,
  placeholder = "",
  className = "w-full rounded border border-gray-300 px-2 py-1 text-sm"
) {
  return (
    <input
      type="text"
      value={v(code)}
      onChange={(e) => onChange(code, e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}

function P6EssentialContent({
  values,
  calcDisplay,
  onChange,
  v,
  d,
}: {
  values: AnswersState;
  calcDisplay: Record<string, string>;
  onChange: (code: string, value: string) => void;
  v: (code: string) => string;
  d: (code: string) => string;
}) {
  const revCy = P6_AUTOFILL_REV_IDS.slice(0, 4);
  const revPy = P6_AUTOFILL_REV_IDS.slice(4, 8);
  const revPppCy = P6_AUTOFILL_REV_PPP_IDS.slice(0, 4);
  const revPppPy = P6_AUTOFILL_REV_PPP_IDS.slice(4, 8);
  return (
    <>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">1. Energy consumption (renewable / non-renewable) and intensity</h3>
        <p className="mt-1 text-xs text-gray-500">Revenue from operations and PPP-adjusted revenue are auto-filled from General Data.</p>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Renewable – Electricity</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_el_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_el_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Renewable – Fuel</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_fuel_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_fuel_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Renewable – Other</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_oth_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_re_oth_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total renewable (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_re_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_re_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Non-renewable – Electricity</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_el_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_el_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Non-renewable – Fuel</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_fuel_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_fuel_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Non-renewable – Other</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_oth_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_nre_oth_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total non-renewable (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_nre_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_nre_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Energy intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_py", v, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Energy intensity / revenue PPP</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_ppp_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e1_intensity_ppp_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_ppp_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_rev_ppp_py", v, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Energy intensity (physical)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_phys_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e1_int_phys_py", v, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">2. PAT scheme</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Designated consumer (Y/N)</label>{inp("p6_e2_pat", v, onChange, "Y/N")}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Targets achieved</label>{inp("p6_e2_targets", v, onChange)}</div>
          <div className="flex flex-col gap-1"><label className="text-xs text-gray-500">Remedial action</label>{inp("p6_e2_remedial", v, onChange)}</div>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">3. Water – withdrawal, consumption, intensity</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Surface water (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_surf_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_surf_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Groundwater (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_grnd_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_grnd_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Third party (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_3p_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_3p_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Others (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_oth_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_oth_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total withdrawal (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_with_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_with_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total consumption (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_cons_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_cons_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e3_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_py", v, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_ppp_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e3_rev_ppp_py", v, onChange, "Rs.")}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">4. Water discharge (kL)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Destination</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Surface water – no treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_nt_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_nt_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Surface water – with treatment</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_sw_t_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Third party / Others</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e4_oth_py", v, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">5. Zero liquid discharge (Y/N)</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          {inp("p6_e5_zld", v, onChange, "Y/N")}
          {inp("p6_e5_zld_detail", v, onChange, "Coverage/details")}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">6. Air emissions (NOx, SOx, PM, VOC, etc.)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Unit</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">NOx</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_unit", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_nox_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">SOx</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_unit", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_sox_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Particulate matter (PM)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_unit", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_pm_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">VOC</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_unit", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e6_voc_py", v, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">7. GHG – Scope 1 and Scope 2 (tCO2e) and intensity</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Scope 1 emissions (tCO2e)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s1_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s1_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Scope 2 emissions (tCO2e)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s2_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_s2_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Total Scope 1+2 (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_s1s2_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_s1s2_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Emission intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e7_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_py", v, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_ppp_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e7_rev_ppp_py", v, onChange, "Rs.")}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">8. Projects for reducing GHG (Y/N). Details</h3>
        <div className="mt-2 flex flex-wrap gap-4">{inp("p6_e8_ghg_yn", v, onChange, "Y/N")} {inp("p6_e8_ghg_detail", v, onChange, "Details")}</div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">9. Waste generated (metric tonnes) and intensity</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Plastic waste</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_plast_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_plast_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">E-waste</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ew_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ew_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Bio-medical</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_bio_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_bio_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">C&D waste</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_cd_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_cd_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Battery</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_batt_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_batt_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Radioactive</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_radio_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_radio_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other hazardous</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ohaz_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_ohaz_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Other non-hazardous</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_onh_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_onh_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1 font-medium">Total (calc)</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_total_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_total_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Waste intensity / revenue</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_intensity_cy")}</td><td className="border border-gray-200 px-2 py-1 text-gray-600">{d("p6_e9_intensity_py")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue from operations (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_py", v, onChange, "Rs.")}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Revenue adjusted for PPP (Rs.)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_ppp_cy", v, onChange, "Rs.")}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e9_rev_ppp_py", v, onChange, "Rs.")}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs font-medium text-gray-600">Recovery (recycled, re-used, other) – mt</p>
        <div className="mt-1 flex flex-wrap gap-4">
          {inp("p6_e9_rec_recy_cy", v, onChange)} / {inp("p6_e9_rec_recy_py", v, onChange)} (recycled)
          {inp("p6_e9_rec_reuse_cy", v, onChange)} / {inp("p6_e9_rec_reuse_py", v, onChange)} (re-used)
          {inp("p6_e9_rec_oth_cy", v, onChange)} / {inp("p6_e9_rec_oth_py", v, onChange)} (other) — Total: {d("p6_e9_rec_total_cy")} / {d("p6_e9_rec_total_py")}
        </div>
        <p className="mt-2 text-xs font-medium text-gray-600">Disposal (incineration, landfilling, other) – mt</p>
        <div className="mt-1 flex flex-wrap gap-4">
          {inp("p6_e9_disp_inc_cy", v, onChange)} / {inp("p6_e9_disp_inc_py", v, onChange)} (incineration)
          {inp("p6_e9_disp_land_cy", v, onChange)} / {inp("p6_e9_disp_land_py", v, onChange)} (landfilling)
          {inp("p6_e9_disp_oth_cy", v, onChange)} / {inp("p6_e9_disp_oth_py", v, onChange)} (other) — Total: {d("p6_e9_disp_total_cy")} / {d("p6_e9_disp_total_py")}
        </div>
        <div className="mt-2 flex flex-wrap gap-4">
          {inp("p6_e9_assess_yn", v, onChange, "Independent assessment Y/N")}
          {inp("p6_e9_assess_agency", v, onChange, "Agency name")}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">10. Waste management practices and strategy</h3>
        <textarea value={v("p6_e10_waste")} onChange={(e) => onChange("p6_e10_waste", e.target.value)} placeholder="Details" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">11. Operations in ecologically sensitive areas</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5">S. No.</th><th className="border border-gray-200 px-2 py-1.5">Location</th><th className="border border-gray-200 px-2 py-1.5">Type</th><th className="border border-gray-200 px-2 py-1.5">Complied (Y/N)</th><th className="border border-gray-200 px-2 py-1.5">Corrective action</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">1</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_loc", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_type", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_yn", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_1_correct", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">2</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_loc", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_type", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_yn", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_e11_2_correct", v, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">12. EIA of projects</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[500px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5">Project name</th><th className="border border-gray-200 px-2 py-1.5">Notification no.</th><th className="border border-gray-200 px-2 py-1.5">Date</th><th className="border border-gray-200 px-2 py-1.5">Independent (Y/N)</th><th className="border border-gray-200 px-2 py-1.5">Public (Y/N)</th><th className="border border-gray-200 px-2 py-1.5">Weblink</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_name", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_notif", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_date", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_ind", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_pub", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e12_link", v, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">13. Environmental compliance (Y/N). Non-compliances</h3>
        <div className="mt-2 flex flex-wrap gap-4">{inp("p6_e13_comp", v, onChange, "Y/N")}</div>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Law/regulation</th><th className="border border-gray-200 px-2 py-1.5">Details</th><th className="border border-gray-200 px-2 py-1.5">Fines/action</th><th className="border border-gray-200 px-2 py-1.5">Corrective action</th></tr></thead>
            <tbody>
              <tr>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_law", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_detail", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_fines", v, onChange)}</td>
                <td className="border border-gray-200 px-2 py-1">{inp("p6_e13_correct", v, onChange)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function P6LeadershipContent({ onChange, v }: { values: AnswersState; onChange: (code: string, value: string) => void; v: (code: string) => string }) {
  return (
    <>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">1. Water in areas of water stress (kL)</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Parameter</th><th className="border border-gray-200 px-2 py-1.5">Current FY</th><th className="border border-gray-200 px-2 py-1.5">Previous FY</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">Facility/area name</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_area_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_area_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water withdrawal (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_with_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_with_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water consumption (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_cons_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_cons_py", v, onChange)}</td></tr>
              <tr><td className="border border-gray-200 px-2 py-1">Water discharge (kL)</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_disp_cy", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l1_disp_py", v, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">2. Scope 3 emissions (tCO2e) and intensity</h3>
        <div className="mt-2 flex flex-wrap gap-4">
          {inp("p6_l2_s3_cy", v, onChange)} / {inp("p6_l2_s3_py", v, onChange)} (Scope 3 tCO2e)
          {inp("p6_l2_int_cy", v, onChange)} / {inp("p6_l2_int_py", v, onChange)} (intensity)
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">3. Biodiversity impact in ecologically sensitive areas</h3>
        <textarea value={v("p6_l3_bio")} onChange={(e) => onChange("p6_l3_bio", e.target.value)} placeholder="Prevention and remediation" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">4. Initiatives / innovative technology – resource efficiency, emissions/effluent/waste</h3>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full min-w-[400px] border-collapse border border-gray-200 text-sm">
            <thead><tr className="bg-gray-50"><th className="border border-gray-200 px-2 py-1.5 text-left">Initiative</th><th className="border border-gray-200 px-2 py-1.5">Details (weblink/summary)</th><th className="border border-gray-200 px-2 py-1.5">Outcome</th></tr></thead>
            <tbody>
              <tr><td className="border border-gray-200 px-2 py-1">{inp("p6_l4_init", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l4_detail", v, onChange)}</td><td className="border border-gray-200 px-2 py-1">{inp("p6_l4_outcome", v, onChange)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">5. Business continuity and disaster management plan</h3>
        <textarea value={v("p6_l5_bcp")} onChange={(e) => onChange("p6_l5_bcp", e.target.value)} placeholder="Details/weblink" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">6. Adverse impact from value chain – mitigation measures</h3>
        <textarea value={v("p6_l6_value")} onChange={(e) => onChange("p6_l6_value", e.target.value)} placeholder="Details" rows={3} className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-2 py-1.5 text-sm" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-indigo-600">7. % value chain partners assessed for environmental impacts</h3>
        <div className="mt-2">{inp("p6_l7_pct", v, onChange, "%")}</div>
      </div>
    </>
  );
}

type Props = {
  principleNum: number;
  values: AnswersState;
  calcDisplay?: Record<string, string>;
  onChange: (code: string, value: string) => void;
};

type Tab = "essential" | "leadership";

export function PanelPrinciple({ principleNum, values, calcDisplay = {}, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("essential");
  const panelId: PanelId = `p${principleNum}` as PanelId;
  const codes = getQuestionCodesForPanel(panelId).filter((c) => !c.endsWith("_notes"));
  const notesCode = `p${principleNum}_notes`;
  const v = (code: string) => values[code] ?? "";
  const d = (code: string) => calcDisplay[code] ?? "";
  const title = NGRBC_PRINCIPLE_TITLES[principleNum] ?? "";

  if (principleNum === 6 && codes.length > 0) {
    const revCy = P6_AUTOFILL_REV_IDS.slice(0, 4);
    const revPy = P6_AUTOFILL_REV_IDS.slice(4, 8);
    const revPppCy = P6_AUTOFILL_REV_PPP_IDS.slice(0, 4);
    const revPppPy = P6_AUTOFILL_REV_PPP_IDS.slice(4, 8);
    return (
      <section>
        <h1 className="text-xl font-semibold text-gray-900">Principle 6: Environment</h1>
        <p className="mt-1 text-sm text-gray-600">{title}</p>
        <p className="mt-1 text-xs text-gray-500">
          Revenue and PPP-adjusted revenue fields below are auto-filled from General Data when you enter turnover and PPP factor there.
        </p>

        <div className="mt-4 flex gap-2 border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab("essential")}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${activeTab === "essential" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Essential indicators
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("leadership")}
            className={`border-b-2 px-3 py-2 text-sm font-medium ${activeTab === "leadership" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Leadership indicators
          </button>
        </div>

        {activeTab === "essential" && (
          <div className="mt-6 space-y-8">
            <P6EssentialContent values={values} calcDisplay={calcDisplay} onChange={onChange} v={v} d={d} />
          </div>
        )}
        {activeTab === "leadership" && (
          <div className="mt-6 space-y-6">
            <P6LeadershipContent values={values} onChange={onChange} v={v} />
          </div>
        )}

        <div className="mt-8 border-t border-gray-200 pt-6">
          <label className="block text-sm font-medium text-gray-700">Notes (narrative)</label>
          <textarea
            value={v(notesCode)}
            onChange={(e) => onChange(notesCode, e.target.value)}
            placeholder="Additional narrative for this principle"
            rows={4}
            className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      </section>
    );
  }

  return (
    <section>
      <h1 className="text-xl font-semibold text-gray-900">Principle {principleNum}</h1>
      <p className="mt-1 text-sm text-gray-600">{title}</p>

      <div className="mt-4 flex gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("essential")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${activeTab === "essential" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Essential indicators
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("leadership")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${activeTab === "leadership" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
        >
          Leadership indicators
        </button>
      </div>

      {activeTab === "essential" && (
        <div className="mt-6 space-y-3">
          {codes.filter((c) => c.includes("_e")).map((code) => (
            <div key={code} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">{code.replace(/^p\d+_/, "")}</label>
              <input
                type="text"
                value={v(code)}
                onChange={(e) => onChange(code, e.target.value)}
                className="max-w-md rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          {codes.filter((c) => c.includes("_e")).length === 0 && (
            <p className="text-gray-500">No Essential indicators configured for this principle yet.</p>
          )}
        </div>
      )}
      {activeTab === "leadership" && (
        <div className="mt-6 space-y-3">
          {codes.filter((c) => c.includes("_l")).map((code) => (
            <div key={code} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">{code.replace(/^p\d+_/, "")}</label>
              <input
                type="text"
                value={v(code)}
                onChange={(e) => onChange(code, e.target.value)}
                className="max-w-md rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          {codes.filter((c) => c.includes("_l")).length === 0 && (
            <p className="text-gray-500">No Leadership indicators configured for this principle yet.</p>
          )}
        </div>
      )}

      <div className="mt-8 border-t border-gray-200 pt-6">
        <label className="block text-sm font-medium text-gray-700">Notes (narrative)</label>
        <textarea
          value={v(notesCode)}
          onChange={(e) => onChange(notesCode, e.target.value)}
          placeholder="Additional narrative for this principle"
          rows={4}
          className="mt-1 w-full max-w-2xl rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
    </section>
  );
}
