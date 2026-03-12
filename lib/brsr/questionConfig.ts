import type { PanelId, CalcRule } from "./types";

/** General Data input question codes (from brsr-data-entry 2.html) */
const GDATA_CODES = [
  "gdata_turnover_cy",
  "gdata_turnover_py",
  "gdata_ppp_cy",
  "gdata_ppp_py",
  "gdata_emp_perm_m",
  "gdata_emp_perm_f",
  "gdata_emp_perm_o",
  "gdata_emp_oth_m",
  "gdata_emp_oth_f",
  "gdata_emp_oth_o",
  "gdata_wrk_perm_m",
  "gdata_wrk_perm_f",
  "gdata_wrk_perm_o",
  "gdata_wrk_oth_m",
  "gdata_wrk_oth_f",
  "gdata_wrk_oth_o",
] as const;

/** Section A General input question codes */
const GEN_CODES = [
  "gen_1_cin",
  "gen_2_name",
  "gen_3_year_inc",
  "gen_4_registered_addr",
  "gen_5_corporate_addr",
  "gen_6_email",
  "gen_7_telephone",
  "gen_8_website",
  "gen_9_fy",
  "gen_10_stock_exchange",
  "gen_11_paidup_capital",
  "gen_12_contact",
  "gen_13_boundary",
  "gen_14_assurance_provider",
  "gen_15_assurance_type",
  "gen_16_1_main",
  "gen_16_1_activity",
  "gen_16_1_pct",
  "gen_16_2_main",
  "gen_16_2_activity",
  "gen_16_2_pct",
  "gen_16_3_main",
  "gen_16_3_activity",
  "gen_16_3_pct",
  "gen_16_4_main",
  "gen_16_4_activity",
  "gen_16_4_pct",
  "gen_16_5_main",
  "gen_16_5_activity",
  "gen_16_5_pct",
  "gen_17_1_product",
  "gen_17_1_nic",
  "gen_17_1_pct",
  "gen_17_2_product",
  "gen_17_2_nic",
  "gen_17_2_pct",
  "gen_17_3_product",
  "gen_17_3_nic",
  "gen_17_3_pct",
  "gen_17_4_product",
  "gen_17_4_nic",
  "gen_17_4_pct",
  "gen_17_5_product",
  "gen_17_5_nic",
  "gen_17_5_pct",
  "gen_18_nat_plants",
  "gen_18_nat_offices",
  "gen_18_int_plants",
  "gen_18_int_offices",
  "gen_19_nat_states",
  "gen_19_int_countries",
  "gen_19b_export_pct",
  "gen_19c_customers",
  "gen_20a_emp_perm_total",
  "gen_20a_emp_perm_m",
  "gen_20a_emp_perm_f",
  "gen_20a_emp_other_total",
  "gen_20a_emp_other_m",
  "gen_20a_emp_other_f",
  "gen_20a_emp_total",
  "gen_20a_emp_total_m",
  "gen_20a_emp_total_f",
  "gen_20a_wrk_perm_total",
  "gen_20a_wrk_perm_m",
  "gen_20a_wrk_perm_f",
  "gen_20a_wrk_other_total",
  "gen_20a_wrk_other_m",
  "gen_20a_wrk_other_f",
  "gen_20b_emp_perm_total",
  "gen_20b_emp_perm_m",
  "gen_20b_emp_perm_f",
  "gen_20b_emp_other_total",
  "gen_20b_emp_other_m",
  "gen_20b_emp_other_f",
  "gen_20b_emp_total",
  "gen_20b_wrk_perm_total",
  "gen_20b_wrk_perm_m",
  "gen_20b_wrk_perm_f",
  "gen_20b_wrk_other_total",
  "gen_20b_wrk_other_m",
  "gen_20b_wrk_other_f",
  "gen_20b_wrk_total",
  "gen_21_bod_total",
  "gen_21_bod_f",
  "gen_21_kmp_total",
  "gen_21_kmp_f",
  "gen_22_emp_cy_m",
  "gen_22_emp_cy_f",
  "gen_22_emp_cy_t",
  "gen_22_emp_py_m",
  "gen_22_emp_py_f",
  "gen_22_emp_py_t",
  "gen_22_emp_pp_m",
  "gen_22_emp_pp_f",
  "gen_22_emp_pp_t",
  "gen_22_wrk_cy_m",
  "gen_22_wrk_cy_f",
  "gen_22_wrk_cy_t",
  "gen_22_wrk_py_m",
  "gen_22_wrk_py_f",
  "gen_22_wrk_py_t",
  "gen_22_wrk_pp_m",
  "gen_22_wrk_pp_f",
  "gen_22_wrk_pp_t",
  "gen_23_1_name",
  "gen_23_1_type",
  "gen_23_1_pct",
  "gen_23_1_br",
  "gen_23_2_name",
  "gen_23_2_type",
  "gen_23_2_pct",
  "gen_23_2_br",
  "gen_23_3_name",
  "gen_23_3_type",
  "gen_23_3_pct",
  "gen_23_3_br",
  "gen_23_4_name",
  "gen_23_4_type",
  "gen_23_4_pct",
  "gen_23_4_br",
  "gen_23_5_name",
  "gen_23_5_type",
  "gen_23_5_pct",
  "gen_23_5_br",
  "gen_24_csr_applicable",
  "gen_24_turnover",
  "gen_24_networth",
  "gen_25_comm_mech",
  "gen_25_comm_cy_f",
  "gen_25_comm_cy_p",
  "gen_25_comm_cy_rem",
  "gen_25_comm_py_f",
  "gen_25_comm_py_p",
  "gen_25_comm_py_rem",
  "gen_25_inv_mech",
  "gen_25_inv_cy_f",
  "gen_25_inv_cy_p",
  "gen_25_inv_cy_rem",
  "gen_25_inv_py_f",
  "gen_25_inv_py_p",
  "gen_25_inv_py_rem",
  "gen_25_sha_mech",
  "gen_25_sha_cy_f",
  "gen_25_sha_cy_p",
  "gen_25_sha_cy_rem",
  "gen_25_sha_py_f",
  "gen_25_sha_py_p",
  "gen_25_sha_py_rem",
  "gen_25_emp_mech",
  "gen_25_emp_cy_f",
  "gen_25_emp_cy_p",
  "gen_25_emp_cy_rem",
  "gen_25_emp_py_f",
  "gen_25_emp_py_p",
  "gen_25_emp_py_rem",
  "gen_25_cust_mech",
  "gen_25_cust_cy_f",
  "gen_25_cust_cy_p",
  "gen_25_cust_cy_rem",
  "gen_25_cust_py_f",
  "gen_25_cust_py_p",
  "gen_25_cust_py_rem",
  "gen_25_vc_mech",
  "gen_25_vc_cy_f",
  "gen_25_vc_cy_p",
  "gen_25_vc_cy_rem",
  "gen_25_vc_py_f",
  "gen_25_vc_py_p",
  "gen_25_vc_py_rem",
  "gen_25_oth_mech",
  "gen_25_oth_cy_f",
  "gen_25_oth_cy_p",
  "gen_25_oth_cy_rem",
  "gen_25_oth_py_f",
  "gen_25_oth_py_p",
  "gen_25_oth_py_rem",
  "gen_26_1_issue",
  "gen_26_1_ro",
  "gen_26_1_rationale",
  "gen_26_1_approach",
  "gen_26_1_fin",
  "gen_26_2_issue",
  "gen_26_2_ro",
  "gen_26_2_rationale",
  "gen_26_2_approach",
  "gen_26_2_fin",
  "gen_26_3_issue",
  "gen_26_3_ro",
  "gen_26_3_rationale",
  "gen_26_3_approach",
  "gen_26_3_fin",
  "gen_26_4_issue",
  "gen_26_4_ro",
  "gen_26_4_rationale",
  "gen_26_4_approach",
  "gen_26_4_fin",
  "gen_26_5_issue",
  "gen_26_5_ro",
  "gen_26_5_rationale",
  "gen_26_5_approach",
  "gen_26_5_fin",
  "gen_16_row_count",
  "gen_17_row_count",
  "gen_23_row_count",
  "gen_26_row_count",
] as const;

/** Section B question codes */
const SB_CODES = [
  "sb_1a_p1", "sb_1a_p2", "sb_1a_p3", "sb_1a_p4", "sb_1a_p5", "sb_1a_p6", "sb_1a_p7", "sb_1a_p8", "sb_1a_p9",
  "sb_1b_p1", "sb_1b_p2", "sb_1b_p3", "sb_1b_p4", "sb_1b_p5", "sb_1b_p6", "sb_1b_p7", "sb_1b_p8", "sb_1b_p9",
  "sb_1c_p1", "sb_1c_p2", "sb_1c_p3", "sb_1c_p4", "sb_1c_p5", "sb_1c_p6", "sb_1c_p7", "sb_1c_p8", "sb_1c_p9",
  "sb_2_p1", "sb_2_p2", "sb_2_p3", "sb_2_p4", "sb_2_p5", "sb_2_p6", "sb_2_p7", "sb_2_p8", "sb_2_p9",
  "sb_3_p1", "sb_3_p2", "sb_3_p3", "sb_3_p4", "sb_3_p5", "sb_3_p6", "sb_3_p7", "sb_3_p8", "sb_3_p9",
  "sb_4_p1", "sb_4_p2", "sb_4_p3", "sb_4_p4", "sb_4_p5", "sb_4_p6", "sb_4_p7", "sb_4_p8", "sb_4_p9",
  "sb_5_p1", "sb_5_p2", "sb_5_p3", "sb_5_p4", "sb_5_p5", "sb_5_p6", "sb_5_p7", "sb_5_p8", "sb_5_p9",
  "sb_6_p1", "sb_6_p2", "sb_6_p3", "sb_6_p4", "sb_6_p5", "sb_6_p6", "sb_6_p7", "sb_6_p8", "sb_6_p9",
  "sb_7_statement",
  "sb_8_authority",
  "sb_9_p1", "sb_9_p2", "sb_9_p3", "sb_9_p4", "sb_9_p5", "sb_9_p6", "sb_9_p7", "sb_9_p8", "sb_9_p9",
  "sb_10a_p1", "sb_10a_p2", "sb_10a_p3", "sb_10a_p4", "sb_10a_p5", "sb_10a_p6", "sb_10a_p7", "sb_10a_p8", "sb_10a_p9",
  "sb_10b_p1", "sb_10b_p2", "sb_10b_p3", "sb_10b_p4", "sb_10b_p5", "sb_10b_p6", "sb_10b_p7", "sb_10b_p8", "sb_10b_p9",
  "sb_11_p1", "sb_11_p2", "sb_11_p3", "sb_11_p4", "sb_11_p5", "sb_11_p6", "sb_11_p7", "sb_11_p8", "sb_11_p9",
  "sb_12a_p1", "sb_12a_p2", "sb_12a_p3", "sb_12a_p4", "sb_12a_p5", "sb_12a_p6", "sb_12a_p7", "sb_12a_p8", "sb_12a_p9",
  "sb_12b_p1", "sb_12b_p2", "sb_12b_p3", "sb_12b_p4", "sb_12b_p5", "sb_12b_p6", "sb_12b_p7", "sb_12b_p8", "sb_12b_p9",
  "sb_12c_p1", "sb_12c_p2", "sb_12c_p3", "sb_12c_p4", "sb_12c_p5", "sb_12c_p6", "sb_12c_p7", "sb_12c_p8", "sb_12c_p9",
  "sb_12d_p1", "sb_12d_p2", "sb_12d_p3", "sb_12d_p4", "sb_12d_p5", "sb_12d_p6", "sb_12d_p7", "sb_12d_p8", "sb_12d_p9",
  "sb_12e_other",
] as const;

/** P6 revenue fields filled by General Data autofill (8 rev + 8 rev_ppp) */
export const P6_AUTOFILL_REV_IDS = [
  "p6_e1_rev_cy", "p6_e3_rev_cy", "p6_e7_rev_cy", "p6_e9_rev_cy",
  "p6_e1_rev_py", "p6_e3_rev_py", "p6_e7_rev_py", "p6_e9_rev_py",
] as const;
export const P6_AUTOFILL_REV_PPP_IDS = [
  "p6_e1_rev_ppp_cy", "p6_e3_rev_ppp_cy", "p6_e7_rev_ppp_cy", "p6_e9_rev_ppp_cy",
  "p6_e1_rev_ppp_py", "p6_e3_rev_ppp_py", "p6_e7_rev_ppp_py", "p6_e9_rev_ppp_py",
] as const;

/** Full NGRBC principle statements (reference / Annexure II) */
export const NGRBC_PRINCIPLE_TITLES: Record<number, string> = {
  1: "Businesses should conduct and govern themselves with integrity, and in a manner that is ethical, transparent and accountable.",
  2: "Businesses should provide goods and services in a sustainable and safe manner.",
  3: "Businesses should respect and promote the well-being of all employees.",
  4: "Businesses should respect the interests of and be responsive to all stakeholders.",
  5: "Businesses should respect and promote human rights.",
  6: "Businesses should respect and make efforts to protect and restore the environment.",
  7: "Businesses, when engaging in influencing public and regulatory policy, should do so in a responsible manner.",
  8: "Businesses should promote inclusive growth and equitable development.",
  9: "Businesses should engage with and provide value to consumers in a responsible manner.",
};

/** P6 Extended input codes (Essential + Leadership, excluding the 16 autofill rev/rev_ppp) */
const P6_EXTENDED_CODES = [
  "p6_e1_re_el_cy", "p6_e1_re_el_py", "p6_e1_re_fuel_cy", "p6_e1_re_fuel_py", "p6_e1_re_oth_cy", "p6_e1_re_oth_py",
  "p6_e1_nre_el_cy", "p6_e1_nre_el_py", "p6_e1_nre_fuel_cy", "p6_e1_nre_fuel_py", "p6_e1_nre_oth_cy", "p6_e1_nre_oth_py",
  "p6_e1_int_phys_cy", "p6_e1_int_phys_py", "p6_e1_int_opt_cy", "p6_e1_int_opt_py",
  "p6_e2_pat", "p6_e2_targets", "p6_e2_remedial",
  "p6_e3_surf_cy", "p6_e3_surf_py", "p6_e3_grnd_cy", "p6_e3_grnd_py", "p6_e3_3p_cy", "p6_e3_3p_py", "p6_e3_oth_cy", "p6_e3_oth_py",
  "p6_e3_cons_cy", "p6_e3_cons_py", "p6_e3_int_phys_cy", "p6_e3_int_phys_py", "p6_e3_int_opt_cy", "p6_e3_int_opt_py",
  "p6_e4_sw_nt_cy", "p6_e4_sw_nt_py", "p6_e4_sw_t_cy", "p6_e4_sw_t_py", "p6_e4_oth_cy", "p6_e4_oth_py", "p6_e4_tot_cy", "p6_e4_tot_py",
  "p6_e5_zld", "p6_e5_zld_detail",
  "p6_e6_nox_unit", "p6_e6_nox_cy", "p6_e6_nox_py", "p6_e6_sox_unit", "p6_e6_sox_cy", "p6_e6_sox_py", "p6_e6_pm_unit", "p6_e6_pm_cy", "p6_e6_pm_py", "p6_e6_voc_unit", "p6_e6_voc_cy", "p6_e6_voc_py", "p6_e6_oth_unit", "p6_e6_oth_cy", "p6_e6_oth_py",
  "p6_e7_s1_cy", "p6_e7_s1_py", "p6_e7_s2_cy", "p6_e7_s2_py", "p6_e7_int_phys_cy", "p6_e7_int_phys_py", "p6_e7_int_opt_cy", "p6_e7_int_opt_py",
  "p6_e8_ghg_yn", "p6_e8_ghg_detail",
  "p6_e9_plast_cy", "p6_e9_plast_py", "p6_e9_ew_cy", "p6_e9_ew_py", "p6_e9_bio_cy", "p6_e9_bio_py", "p6_e9_cd_cy", "p6_e9_cd_py", "p6_e9_batt_cy", "p6_e9_batt_py", "p6_e9_radio_cy", "p6_e9_radio_py", "p6_e9_ohaz_cy", "p6_e9_ohaz_py", "p6_e9_onh_cy", "p6_e9_onh_py",
  "p6_e9_int_phys_cy", "p6_e9_int_phys_py", "p6_e9_int_opt_cy", "p6_e9_int_opt_py",
  "p6_e9_rec_recy_cy", "p6_e9_rec_recy_py", "p6_e9_rec_reuse_cy", "p6_e9_rec_reuse_py", "p6_e9_rec_oth_cy", "p6_e9_rec_oth_py",
  "p6_e9_disp_inc_cy", "p6_e9_disp_inc_py", "p6_e9_disp_land_cy", "p6_e9_disp_land_py", "p6_e9_disp_oth_cy", "p6_e9_disp_oth_py",
  "p6_e9_assess_yn", "p6_e9_assess_agency", "p6_e10_waste",
  "p6_e11_1_loc", "p6_e11_1_type", "p6_e11_1_yn", "p6_e11_1_correct", "p6_e11_2_loc", "p6_e11_2_type", "p6_e11_2_yn", "p6_e11_2_correct",
  "p6_e12_name", "p6_e12_notif", "p6_e12_date", "p6_e12_ind", "p6_e12_pub", "p6_e12_link",
  "p6_e13_comp", "p6_e13_law", "p6_e13_detail", "p6_e13_fines", "p6_e13_correct",
  "p6_l1_area_cy", "p6_l1_area_py", "p6_l1_with_cy", "p6_l1_with_py", "p6_l1_cons_cy", "p6_l1_cons_py", "p6_l1_disp_cy", "p6_l1_disp_py",
  "p6_l2_s3_cy", "p6_l2_s3_py", "p6_l2_int_cy", "p6_l2_int_py", "p6_l3_bio", "p6_l4_init", "p6_l4_detail", "p6_l4_outcome", "p6_l5_bcp", "p6_l6_value", "p6_l7_pct",
] as const;

/** Principle 6 question codes (autofill + extended + notes) */
const P6_CODES = [
  ...P6_AUTOFILL_REV_IDS,
  ...P6_AUTOFILL_REV_PPP_IDS,
  ...P6_EXTENDED_CODES,
] as const;

/** Principle 1 (Ethics, Transparency, Accountability) – Essential & Leadership codes from reference */
const P1_CODES = [
  "p1_e1_bod_prog", "p1_e1_bod_topics", "p1_e1_bod_total", "p1_e1_bod_covered", "p1_e1_kmp_prog", "p1_e1_kmp_topics", "p1_e1_kmp_total", "p1_e1_kmp_covered", "p1_e1_emp_prog", "p1_e1_emp_topics", "p1_e1_emp_total", "p1_e1_emp_covered", "p1_e1_wrk_prog", "p1_e1_wrk_topics", "p1_e1_wrk_total", "p1_e1_wrk_covered", "p1_e2_pf_principle", "p1_e2_pf_agency", "p1_e2_pf_amt", "p1_e2_pf_brief", "p1_e2_pf_appeal", "p1_e2_set_principle", "p1_e2_set_agency", "p1_e2_set_amt", "p1_e2_set_brief", "p1_e2_set_appeal", "p1_e2_cmp_principle", "p1_e2_cmp_agency", "p1_e2_cmp_amt", "p1_e2_cmp_brief", "p1_e2_cmp_appeal", "p1_e3_appeal", "p1_e4_anticorr", "p1_e5_dir_cy", "p1_e5_dir_py", "p1_e5_kmp_cy", "p1_e5_kmp_py", "p1_e5_emp_cy", "p1_e5_emp_py", "p1_e5_wrk_cy", "p1_e5_wrk_py", "p1_e6_dir_cy", "p1_e6_dir_cy_rem", "p1_e6_dir_py", "p1_e6_dir_py_rem", "p1_e6_kmp_cy", "p1_e6_kmp_cy_rem", "p1_e6_kmp_py", "p1_e6_kmp_py_rem", "p1_e7_corrective", "p1_e8_ap_cy", "p1_e8_ap_py", "p1_e8_cost_cy", "p1_e8_cost_py", "p1_e9_purch_cy", "p1_e9_purch_py", "p1_e9_sales_cy", "p1_e9_sales_py", "p1_e9_rpt_purch_cy", "p1_e9_rpt_purch_py", "p1_e9_rpt_sales_cy", "p1_e9_rpt_sales_py", "p1_l1_prog", "p1_l1_topics", "p1_l1_total_val", "p1_l1_covered_val", "p1_l2_conflict", "p1_notes",
] as const;

/** Principle 2 (Sustainable and Safe Goods/Services) – Essential & Leadership */
const P2_CODES = [
  "p2_e1_rd_cy", "p2_e1_rd_py", "p2_e1_rd_details", "p2_e1_rd_env_cy", "p2_e1_rd_env_py", "p2_e1_capex_cy", "p2_e1_capex_py", "p2_e1_capex_details", "p2_e1_capex_env_cy", "p2_e1_capex_env_py", "p2_e2_yn", "p2_e2_total", "p2_e2_sustainable", "p2_e3_plastics", "p2_e3_ewaste", "p2_e3_hazardous", "p2_e3_other", "p2_e4_epr", "p2_e4_steps", "p2_l1_row0_nic", "p2_l1_row0_product", "p2_l1_row0_pct", "p2_l1_row0_boundary", "p2_l1_row0_ext", "p2_l1_row0_public", "p2_l1_row0_link", "p2_l1_rowcount", "p2_l2_row0_product", "p2_l2_row0_risk", "p2_l2_row0_action", "p2_l2_rowcount", "p2_l3_row0_material", "p2_l3_row0_recycled", "p2_l3_row0_total", "p2_l3_rowcount", "p2_l4_plast_cy_re", "p2_l4_plast_cy_rc", "p2_l4_plast_cy_d", "p2_l4_plast_py_re", "p2_l4_plast_py_rc", "p2_l4_plast_py_d", "p2_l4_ew_cy_re", "p2_l4_ew_cy_rc", "p2_l4_ew_cy_d", "p2_l4_ew_py_re", "p2_l4_ew_py_rc", "p2_l4_ew_py_d", "p2_l4_haz_cy_re", "p2_l4_haz_cy_rc", "p2_l4_haz_cy_d", "p2_l4_haz_py_re", "p2_l4_haz_py_rc", "p2_l4_haz_py_d", "p2_l4_oth_cy_re", "p2_l4_oth_cy_rc", "p2_l4_oth_cy_d", "p2_l4_oth_py_re", "p2_l4_oth_py_rc", "p2_l4_oth_py_d", "p2_l5_category", "p2_l5_pct", "p2_notes",
] as const;

/** Principle 3 (Well-being of Employees) – subset Essential & Leadership */
const P3_CODES = [
  "p3_e1a_perm_m_t", "p3_e1a_perm_m_hi", "p3_e1a_perm_m_ac", "p3_e1a_perm_m_mat", "p3_e1a_perm_m_pat", "p3_e1a_perm_m_dc", "p3_e1a_perm_f_t", "p3_e1a_perm_f_hi", "p3_e1a_perm_f_ac", "p3_e1a_perm_f_mat", "p3_e1a_perm_f_pat", "p3_e1a_perm_f_dc", "p3_e1a_oth_m_t", "p3_e1a_oth_m_hi", "p3_e1a_oth_m_ac", "p3_e1a_oth_m_mat", "p3_e1a_oth_m_pat", "p3_e1a_oth_m_dc", "p3_e1a_oth_f_t", "p3_e1a_oth_f_hi", "p3_e1a_oth_f_ac", "p3_e1a_oth_f_mat", "p3_e1a_oth_f_pat", "p3_e1a_oth_f_dc", "p3_e1b_perm_m_t", "p3_e1b_perm_m_hi", "p3_e1b_perm_m_ac", "p3_e1b_perm_m_mat", "p3_e1b_perm_m_pat", "p3_e1b_perm_m_dc", "p3_e1b_perm_f_t", "p3_e1b_perm_f_hi", "p3_e1b_perm_f_ac", "p3_e1b_perm_f_mat", "p3_e1b_perm_f_pat", "p3_e1b_perm_f_dc", "p3_e1b_oth_m_t", "p3_e1b_oth_m_hi", "p3_e1b_oth_m_ac", "p3_e1b_oth_m_mat", "p3_e1b_oth_m_pat", "p3_e1b_oth_m_dc", "p3_e1b_oth_f_t", "p3_e1b_oth_f_hi", "p3_e1b_oth_f_ac", "p3_e1b_oth_f_mat", "p3_e1b_oth_f_pat", "p3_e1b_oth_f_dc", "p3_e1c_cy_spend", "p3_e1c_cy_rev", "p3_e1c_py_spend", "p3_e1c_py_rev", "p3_e2_pf_emp_cy", "p3_e2_pf_wrk_cy", "p3_e2_pf_dep_cy", "p3_e2_pf_emp_py", "p3_e2_pf_wrk_py", "p3_e2_pf_dep_py", "p3_e2_gr_emp_cy", "p3_e2_gr_wrk_cy", "p3_e2_gr_dep_cy", "p3_e2_gr_emp_py", "p3_e2_gr_wrk_py", "p3_e2_gr_dep_py", "p3_e2_esi_emp_cy", "p3_e2_esi_wrk_cy", "p3_e2_esi_dep_cy", "p3_e2_esi_emp_py", "p3_e2_esi_wrk_py", "p3_e2_esi_dep_py", "p3_e2_oth_emp_cy", "p3_e2_oth_wrk_cy", "p3_e2_oth_dep_cy", "p3_e2_oth_emp_py", "p3_e2_oth_wrk_py", "p3_e2_oth_dep_py", "p3_e3_access", "p3_e4_equal", "p3_e5_m_emp_ret", "p3_e5_m_emp_retn", "p3_e5_m_wrk_ret", "p3_e5_m_wrk_retn", "p3_e5_f_emp_ret", "p3_e5_f_emp_retn", "p3_e5_f_wrk_ret", "p3_e5_f_wrk_retn", "p3_e6_wrk_perm", "p3_e6_wrk_oth", "p3_e6_emp_perm", "p3_e6_emp_oth", "p3_e7_emp_m_t_cy", "p3_e7_emp_m_u_cy", "p3_e7_emp_m_t_py", "p3_e7_emp_m_u_py", "p3_e7_emp_f_t_cy", "p3_e7_emp_f_u_cy", "p3_e7_emp_f_t_py", "p3_e7_emp_f_u_py", "p3_e7_wrk_m_t_cy", "p3_e7_wrk_m_u_cy", "p3_e7_wrk_f_t_cy", "p3_e7_wrk_f_u_cy", "p3_e8_emp_m_t_cy", "p3_e8_emp_m_hs_cy", "p3_e8_emp_m_sk_cy", "p3_e8_emp_m_t_py", "p3_e8_emp_m_hs_py", "p3_e8_emp_m_sk_py", "p3_e8_emp_f_t_cy", "p3_e8_emp_f_hs_cy", "p3_e8_emp_f_sk_cy", "p3_e8_emp_f_t_py", "p3_e8_emp_f_hs_py", "p3_e8_emp_f_sk_py", "p3_e8_wrk_m_t_cy", "p3_e8_wrk_m_hs_cy", "p3_e8_wrk_m_sk_cy", "p3_e8_wrk_m_t_py", "p3_e8_wrk_m_hs_py", "p3_e8_wrk_m_sk_py", "p3_e8_wrk_f_t_cy", "p3_e8_wrk_f_hs_cy", "p3_e8_wrk_f_sk_cy", "p3_e8_wrk_f_t_py", "p3_e8_wrk_f_hs_py", "p3_e8_wrk_f_sk_py", "p3_e9_emp_m_t_cy", "p3_e9_emp_m_r_cy", "p3_e9_emp_m_t_py", "p3_e9_emp_m_r_py", "p3_e9_emp_f_t_cy", "p3_e9_emp_f_r_cy", "p3_e9_emp_f_t_py", "p3_e9_emp_f_r_py", "p3_e9_wrk_m_t_cy", "p3_e9_wrk_m_r_cy", "p3_e9_wrk_m_t_py", "p3_e9_wrk_m_r_py", "p3_e9_wrk_f_t_cy", "p3_e9_wrk_f_r_cy", "p3_e9_wrk_f_t_py", "p3_e9_wrk_f_r_py", "p3_e10_hs", "p3_e11_ltifr_emp_cy", "p3_e11_ltifr_emp_py", "p3_e11_ltifr_wrk_cy", "p3_e11_ltifr_wrk_py", "p3_e11_rec_emp_cy", "p3_e11_rec_emp_py", "p3_e11_rec_wrk_cy", "p3_e11_rec_wrk_py", "p3_e11_fat_emp_cy", "p3_e11_fat_emp_py", "p3_e11_fat_wrk_cy", "p3_e11_fat_wrk_py", "p3_e11_hc_emp_cy", "p3_e11_hc_emp_py", "p3_e11_hc_wrk_cy", "p3_e11_hc_wrk_py", "p3_e12_measures", "p3_e13_wc_cy_f", "p3_e13_wc_cy_p", "p3_e13_wc_cy_r", "p3_e13_wc_py_f", "p3_e13_wc_py_p", "p3_e13_wc_py_r", "p3_e13_hs_cy_f", "p3_e13_hs_cy_p", "p3_e13_hs_cy_r", "p3_e13_hs_py_f", "p3_e13_hs_py_p", "p3_e13_hs_py_r", "p3_e14_hs", "p3_e14_wc", "p3_e15_corrective", "p3_l1_emp", "p3_l1_wrk", "p3_l2_statutory", "p3_l3_emp_cy_t", "p3_l3_emp_py_t", "p3_l3_emp_cy_r", "p3_l3_emp_py_r", "p3_l3_wrk_cy_t", "p3_l3_wrk_py_t", "p3_l3_wrk_cy_r", "p3_l3_wrk_py_r", "p3_l4_transition", "p3_l5_hs", "p3_l5_wc", "p3_l6_corrective", "p3_notes",
] as const;

/** Principle 4 (Stakeholders) */
const P4_CODES = [
  "p4_e1_process", "p4_e2_row0_name", "p4_e2_row0_vuln", "p4_e2_row0_chan", "p4_e2_row0_freq", "p4_e2_row0_purpose", "p4_e2_rowcount", "p4_l1_consult", "p4_l2_yn", "p4_l2_instances", "p4_l3_engagement", "p4_notes",
] as const;

/** Principle 5 (Human Rights) – subset */
const P5_CODES = [
  "p5_e1_emp_perm_t_cy", "p5_e1_emp_perm_c_cy", "p5_e1_emp_perm_t_py", "p5_e1_emp_perm_c_py", "p5_e1_emp_oth_t_cy", "p5_e1_emp_oth_c_cy", "p5_e1_emp_oth_t_py", "p5_e1_emp_oth_c_py", "p5_e1_wrk_perm_t_cy", "p5_e1_wrk_perm_c_cy", "p5_e1_wrk_perm_t_py", "p5_e1_wrk_perm_c_py", "p5_e1_wrk_oth_t_cy", "p5_e1_wrk_oth_c_cy", "p5_e1_wrk_oth_t_py", "p5_e1_wrk_oth_c_py", "p5_e2_emp_pm_t_cy", "p5_e2_emp_pm_eq_cy", "p5_e2_emp_pm_more_cy", "p5_e2_emp_pm_t_py", "p5_e2_emp_pm_eq_py", "p5_e2_emp_pm_more_py", "p5_e2_emp_pf_t_cy", "p5_e2_emp_pf_eq_cy", "p5_e2_emp_pf_more_cy", "p5_e2_emp_pf_t_py", "p5_e2_emp_pf_eq_py", "p5_e2_emp_pf_more_py", "p5_e2_wrk_pm_t_cy", "p5_e2_wrk_pm_eq_cy", "p5_e2_wrk_pm_more_cy", "p5_e2_wrk_pm_t_py", "p5_e2_wrk_pm_eq_py", "p5_e2_wrk_pm_more_py", "p5_e2_wrk_pf_t_cy", "p5_e2_wrk_pf_eq_cy", "p5_e2_wrk_pf_more_cy", "p5_e2_wrk_pf_t_py", "p5_e2_wrk_pf_eq_py", "p5_e2_wrk_pf_more_py", "p5_e3a_bod_m_n", "p5_e3a_bod_m_med", "p5_e3a_bod_f_n", "p5_e3a_bod_f_med", "p5_e3a_kmp_m_n", "p5_e3a_kmp_m_med", "p5_e3a_kmp_f_n", "p5_e3a_kmp_f_med", "p5_e3a_emp_m_n", "p5_e3a_emp_m_med", "p5_e3a_emp_f_n", "p5_e3a_emp_f_med", "p5_e3a_wrk_m_n", "p5_e3a_wrk_m_med", "p5_e3a_wrk_f_n", "p5_e3a_wrk_f_med", "p5_e3b_cy_f", "p5_e3b_cy_t", "p5_e3b_py_f", "p5_e3b_py_t", "p5_e4_focal", "p5_e5_mech", "p5_e6_sh_cy_f", "p5_e6_sh_cy_p", "p5_e6_sh_cy_r", "p5_e6_sh_py_f", "p5_e6_sh_py_p", "p5_e6_sh_py_r", "p5_e6_disc_cy_f", "p5_e6_disc_cy_p", "p5_e6_disc_cy_r", "p5_e6_disc_py_f", "p5_e6_disc_py_p", "p5_e6_disc_py_r", "p5_e6_cl_cy_f", "p5_e6_cl_cy_p", "p5_e6_cl_cy_r", "p5_e6_cl_py_f", "p5_e6_cl_py_p", "p5_e6_cl_py_r", "p5_e6_fl_cy_f", "p5_e6_fl_cy_p", "p5_e6_fl_cy_r", "p5_e6_fl_py_f", "p5_e6_fl_py_p", "p5_e6_fl_py_r", "p5_e6_wg_cy_f", "p5_e6_wg_cy_p", "p5_e6_wg_cy_r", "p5_e6_wg_py_f", "p5_e6_wg_py_p", "p5_e6_wg_py_r", "p5_e6_oth_cy_f", "p5_e6_oth_cy_p", "p5_e6_oth_cy_r", "p5_e6_oth_py_f", "p5_e6_oth_py_p", "p5_e6_oth_py_r", "p5_e7_tot_cy", "p5_e7_tot_py", "p5_e7_f_cy", "p5_e7_f_py", "p5_e7_up_cy", "p5_e7_up_py", "p5_e8_mech", "p5_e9_contracts", "p5_e10_cl", "p5_e10_fl", "p5_e10_sh", "p5_e10_disc", "p5_e10_wg", "p5_e10_oth", "p5_e11_corrective", "p5_l1_process", "p5_l2_scope", "p5_l3_access", "p5_l4_sh", "p5_l4_disc", "p5_l4_cl", "p5_l4_fl", "p5_l4_wg", "p5_l4_oth", "p5_l5_corrective", "p5_notes",
] as const;

/** Principle 7 (Public and regulatory policy) */
const P7_CODES = [
  "p7_e1a_count", "p7_e1b_1_name", "p7_e1b_1_reach", "p7_e1b_2_name", "p7_e1b_2_reach", "p7_e1b_3_name", "p7_e1b_3_reach", "p7_e1b_4_name", "p7_e1b_4_reach", "p7_e1b_5_name", "p7_e1b_5_reach", "p7_e1b_6_name", "p7_e1b_6_reach", "p7_e1b_7_name", "p7_e1b_7_reach", "p7_e1b_8_name", "p7_e1b_8_reach", "p7_e1b_9_name", "p7_e1b_9_reach", "p7_e1b_10_name", "p7_e1b_10_reach", "p7_e2_auth", "p7_e2_brief", "p7_e2_action", "p7_l1_1_policy", "p7_l1_1_method", "p7_l1_1_public", "p7_l1_1_freq", "p7_l1_2_policy", "p7_l1_2_method", "p7_l1_2_public", "p7_l1_2_freq", "p7_notes",
] as const;

/** Principle 8 (Inclusive growth and equitable development) */
const P8_CODES = [
  "p8_e1_name", "p8_e1_notif", "p8_e1_date", "p8_e1_ind", "p8_e1_pub", "p8_e1_link", "p8_e2_1_name", "p8_e2_1_state", "p8_e2_1_dist", "p8_e2_1_paf", "p8_e2_1_pct", "p8_e2_1_amt", "p8_e2_2_name", "p8_e2_2_state", "p8_e2_2_dist", "p8_e2_2_paf", "p8_e2_2_pct", "p8_e2_2_amt", "p8_e3_griev", "p8_e4_msme_cy", "p8_e4_msme_py", "p8_e4_india_cy", "p8_e4_india_py", "p8_e5_rural_w_cy", "p8_e5_rural_t_cy", "p8_e5_rural_w_py", "p8_e5_rural_t_py", "p8_e5_semi_w_cy", "p8_e5_semi_t_cy", "p8_e5_semi_w_py", "p8_e5_semi_t_py", "p8_e5_urb_w_cy", "p8_e5_urb_t_cy", "p8_e5_urb_w_py", "p8_e5_urb_t_py", "p8_e5_metro_w_cy", "p8_e5_metro_t_cy", "p8_e5_metro_w_py", "p8_e5_metro_t_py", "p8_l1_impact", "p8_l1_action", "p8_l2_1_state", "p8_l2_1_dist", "p8_l2_1_amt", "p8_l2_2_state", "p8_l2_2_dist", "p8_l2_2_amt", "p8_l3_yn", "p8_l3_groups", "p8_l3_total", "p8_l3_pref", "p8_l4_1_ip", "p8_l4_1_own", "p8_l4_1_ben", "p8_l4_1_basis", "p8_l5_auth", "p8_l5_brief", "p8_l5_action", "p8_l6_1_proj", "p8_l6_1_num", "p8_l6_1_tot", "p8_l6_1_vuln", "p8_notes",
] as const;

/** Principle 9 (Consumers) – subset */
const P9_CODES = [
  "p9_e1_mech", "p9_e2_env", "p9_e2_safe", "p9_e2_recycle", "p9_e3_dp_cy_f", "p9_e3_dp_cy_p", "p9_e3_dp_cy_r", "p9_e3_dp_py_f", "p9_e3_dp_py_p", "p9_e3_dp_py_r", "p9_e3_adv_cy_f", "p9_e3_adv_cy_p", "p9_e3_adv_cy_r", "p9_e3_adv_py_f", "p9_e3_adv_py_p", "p9_e3_adv_py_r", "p9_e3_cs_cy_f", "p9_e3_cs_cy_p", "p9_e3_cs_cy_r", "p9_e3_cs_py_f", "p9_e3_cs_py_p", "p9_e3_cs_py_r", "p9_e3_del_cy_f", "p9_e3_del_cy_p", "p9_e3_del_cy_r", "p9_e3_del_py_f", "p9_e3_del_py_p", "p9_e3_del_py_r", "p9_e3_rtp_cy_f", "p9_e3_rtp_cy_p", "p9_e3_rtp_cy_r", "p9_e3_rtp_py_f", "p9_e3_rtp_py_p", "p9_e3_rtp_py_r", "p9_e3_utp_cy_f", "p9_e3_utp_cy_p", "p9_e3_utp_cy_r", "p9_e3_utp_py_f", "p9_e3_utp_py_p", "p9_e3_utp_py_r", "p9_e3_oth_cy_f", "p9_e3_oth_cy_p", "p9_e3_oth_cy_r", "p9_e3_oth_py_f", "p9_e3_oth_py_p", "p9_e3_oth_py_r", "p9_e4_vol_num", "p9_e4_vol_reason", "p9_e4_for_num", "p9_e4_for_reason", "p9_e5_framework", "p9_e5_link", "p9_e6_corrective", "p9_e7a_cy", "p9_e7a_py", "p9_e7b_cy", "p9_e7b_py", "p9_e7c_cy", "p9_e7c_py", "p9_l1_channels", "p9_l2_steps", "p9_l3_mech", "p9_l4_beyond", "p9_l4_detail", "p9_l4_survey", "p9_notes",
] as const;

/** Principle codes per panel. P6 includes P6_CODES + p6_notes. */
const PRINCIPLE_CODES: Record<number, readonly string[]> = {
  1: [...P1_CODES],
  2: [...P2_CODES],
  3: [...P3_CODES],
  4: [...P4_CODES],
  5: [...P5_CODES],
  6: [...P6_CODES, "p6_notes"],
  7: [...P7_CODES],
  8: [...P8_CODES],
  9: [...P9_CODES],
};

/** Panel metadata and question codes per panel (groups/labels match reference) */
export const PANELS: { id: PanelId; label: string; group: string }[] = [
  { id: "generaldata", label: "General Data Gathering", group: "General Data" },
  { id: "general", label: "General Disclosures", group: "Section A" },
  { id: "sectionb", label: "Management & Process", group: "Section B" },
  { id: "p1", label: "Principle 1", group: "Section C – Principles" },
  { id: "p2", label: "Principle 2", group: "Section C – Principles" },
  { id: "p3", label: "Principle 3", group: "Section C – Principles" },
  { id: "p4", label: "Principle 4", group: "Section C – Principles" },
  { id: "p5", label: "Principle 5", group: "Section C – Principles" },
  { id: "p6", label: "Principle 6", group: "Section C – Principles" },
  { id: "p7", label: "Principle 7", group: "Section C – Principles" },
  { id: "p8", label: "Principle 8", group: "Section C – Principles" },
  { id: "p9", label: "Principle 9", group: "Section C – Principles" },
];

function getPanelQuestionCodes(panelId: PanelId): string[] {
  switch (panelId) {
    case "generaldata":
      return [...GDATA_CODES];
    case "general":
      return [...GEN_CODES];
    case "sectionb":
      return [...SB_CODES];
    case "p1":
    case "p2":
    case "p3":
    case "p4":
    case "p5":
    case "p6":
    case "p7":
    case "p8":
    case "p9": {
      const n = parseInt(panelId.slice(1), 10);
      return [...(PRINCIPLE_CODES[n] ?? [])];
    }
    default:
      return [];
  }
}

/** All question codes that are saved (inputs only; no display-only calc cells) */
const _allCodes = new Set<string>([
  ...GDATA_CODES,
  ...GEN_CODES,
  ...SB_CODES,
  ...PANELS.filter((p) => p.id.startsWith("p")).flatMap((p) =>
    getPanelQuestionCodes(p.id)
  ),
]);
export const ALL_QUESTION_CODES: string[] = Array.from(_allCodes);
const ALL_SET = _allCodes;
export function isQuestionCode(code: string): boolean {
  return ALL_SET.has(code);
}

/** Question codes for a given panel */
export function getQuestionCodesForPanel(panelId: PanelId): string[] {
  return getPanelQuestionCodes(panelId);
}

/** Calculation rules for display-only cells (General Data + General) */
export const CALC_RULES: CalcRule[] = [
  { type: "formula", outputId: "gdata_rev_ppp_cy_display", formula: "gdata_turnover_cy/gdata_ppp_cy", decimals: 2 },
  { type: "formula", outputId: "gdata_rev_ppp_py_display", formula: "gdata_turnover_py/gdata_ppp_py", decimals: 2 },
  { type: "sum", outputId: "gdata_emp_perm_sum", sumIds: ["gdata_emp_perm_m", "gdata_emp_perm_f", "gdata_emp_perm_o"], decimals: 0 },
  { type: "sum", outputId: "gdata_emp_oth_sum", sumIds: ["gdata_emp_oth_m", "gdata_emp_oth_f", "gdata_emp_oth_o"], decimals: 0 },
  { type: "sum", outputId: "gdata_wrk_perm_sum", sumIds: ["gdata_wrk_perm_m", "gdata_wrk_perm_f", "gdata_wrk_perm_o"], decimals: 0 },
  { type: "sum", outputId: "gdata_wrk_oth_sum", sumIds: ["gdata_wrk_oth_m", "gdata_wrk_oth_f", "gdata_wrk_oth_o"], decimals: 0 },
  { type: "sum", outputId: "gen_18_nat_sum", sumIds: ["gen_18_nat_plants", "gen_18_nat_offices"], decimals: 0 },
  { type: "sum", outputId: "gen_18_int_sum", sumIds: ["gen_18_int_plants", "gen_18_int_offices"], decimals: 0 },
  { type: "pct", outputId: "gen_20a_emp_perm_m_pct", num: "gen_20a_emp_perm_m", denom: "gen_20a_emp_perm_total" },
  { type: "pct", outputId: "gen_20a_emp_perm_f_pct", num: "gen_20a_emp_perm_f", denom: "gen_20a_emp_perm_total" },
  { type: "pct", outputId: "gen_20a_emp_other_m_pct", num: "gen_20a_emp_other_m", denom: "gen_20a_emp_other_total" },
  { type: "pct", outputId: "gen_20a_emp_other_f_pct", num: "gen_20a_emp_other_f", denom: "gen_20a_emp_other_total" },
  { type: "pct", outputId: "gen_20a_wrk_perm_m_pct", num: "gen_20a_wrk_perm_m", denom: "gen_20a_wrk_perm_total" },
  { type: "pct", outputId: "gen_20a_wrk_perm_f_pct", num: "gen_20a_wrk_perm_f", denom: "gen_20a_wrk_perm_total" },
  { type: "pct", outputId: "gen_20a_wrk_other_m_pct", num: "gen_20a_wrk_other_m", denom: "gen_20a_wrk_other_total" },
  { type: "pct", outputId: "gen_20a_wrk_other_f_pct", num: "gen_20a_wrk_other_f", denom: "gen_20a_wrk_other_total" },
  { type: "pct", outputId: "gen_20b_emp_perm_m_pct", num: "gen_20b_emp_perm_m", denom: "gen_20b_emp_perm_total" },
  { type: "pct", outputId: "gen_20b_emp_perm_f_pct", num: "gen_20b_emp_perm_f", denom: "gen_20b_emp_perm_total" },
  { type: "pct", outputId: "gen_20b_emp_other_m_pct", num: "gen_20b_emp_other_m", denom: "gen_20b_emp_other_total" },
  { type: "pct", outputId: "gen_20b_emp_other_f_pct", num: "gen_20b_emp_other_f", denom: "gen_20b_emp_other_total" },
  { type: "pct", outputId: "gen_20b_wrk_perm_m_pct", num: "gen_20b_wrk_perm_m", denom: "gen_20b_wrk_perm_total" },
  { type: "pct", outputId: "gen_20b_wrk_perm_f_pct", num: "gen_20b_wrk_perm_f", denom: "gen_20b_wrk_perm_total" },
  { type: "pct", outputId: "gen_20b_wrk_other_m_pct", num: "gen_20b_wrk_other_m", denom: "gen_20b_wrk_other_total" },
  { type: "pct", outputId: "gen_20b_wrk_other_f_pct", num: "gen_20b_wrk_other_f", denom: "gen_20b_wrk_other_total" },
  { type: "pct", outputId: "gen_21_bod_pct", num: "gen_21_bod_f", denom: "gen_21_bod_total" },
  { type: "pct", outputId: "gen_21_kmp_pct", num: "gen_21_kmp_f", denom: "gen_21_kmp_total" },
  // P6 – Energy (sums)
  { type: "sum", outputId: "p6_e1_re_total_cy", sumIds: ["p6_e1_re_el_cy", "p6_e1_re_fuel_cy", "p6_e1_re_oth_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e1_re_total_py", sumIds: ["p6_e1_re_el_py", "p6_e1_re_fuel_py", "p6_e1_re_oth_py"], decimals: 2 },
  { type: "sum", outputId: "p6_e1_nre_total_cy", sumIds: ["p6_e1_nre_el_cy", "p6_e1_nre_fuel_cy", "p6_e1_nre_oth_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e1_nre_total_py", sumIds: ["p6_e1_nre_el_py", "p6_e1_nre_fuel_py", "p6_e1_nre_oth_py"], decimals: 2 },
  { type: "formula", outputId: "p6_e1_intensity_cy", formula: "(p6_e1_re_el_cy+p6_e1_re_fuel_cy+p6_e1_re_oth_cy+p6_e1_nre_el_cy+p6_e1_nre_fuel_cy+p6_e1_nre_oth_cy)/p6_e1_rev_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e1_intensity_py", formula: "(p6_e1_re_el_py+p6_e1_re_fuel_py+p6_e1_re_oth_py+p6_e1_nre_el_py+p6_e1_nre_fuel_py+p6_e1_nre_oth_py)/p6_e1_rev_py", decimals: 6 },
  { type: "formula", outputId: "p6_e1_intensity_ppp_cy", formula: "(p6_e1_re_el_cy+p6_e1_re_fuel_cy+p6_e1_re_oth_cy+p6_e1_nre_el_cy+p6_e1_nre_fuel_cy+p6_e1_nre_oth_cy)/p6_e1_rev_ppp_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e1_intensity_ppp_py", formula: "(p6_e1_re_el_py+p6_e1_re_fuel_py+p6_e1_re_oth_py+p6_e1_nre_el_py+p6_e1_nre_fuel_py+p6_e1_nre_oth_py)/p6_e1_rev_ppp_py", decimals: 6 },
  // P6 – Water (sum + intensity)
  { type: "sum", outputId: "p6_e3_with_total_cy", sumIds: ["p6_e3_surf_cy", "p6_e3_grnd_cy", "p6_e3_3p_cy", "p6_e3_oth_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e3_with_total_py", sumIds: ["p6_e3_surf_py", "p6_e3_grnd_py", "p6_e3_3p_py", "p6_e3_oth_py"], decimals: 2 },
  { type: "formula", outputId: "p6_e3_intensity_cy", formula: "p6_e3_cons_cy/p6_e3_rev_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e3_intensity_py", formula: "p6_e3_cons_py/p6_e3_rev_py", decimals: 6 },
  { type: "formula", outputId: "p6_e3_intensity_ppp_cy", formula: "p6_e3_cons_cy/p6_e3_rev_ppp_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e3_intensity_ppp_py", formula: "p6_e3_cons_py/p6_e3_rev_ppp_py", decimals: 6 },
  // P6 – GHG (sum + intensity)
  { type: "sum", outputId: "p6_e7_s1s2_cy", sumIds: ["p6_e7_s1_cy", "p6_e7_s2_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e7_s1s2_py", sumIds: ["p6_e7_s1_py", "p6_e7_s2_py"], decimals: 2 },
  { type: "formula", outputId: "p6_e7_intensity_cy", formula: "(p6_e7_s1_cy+p6_e7_s2_cy)/p6_e7_rev_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e7_intensity_py", formula: "(p6_e7_s1_py+p6_e7_s2_py)/p6_e7_rev_py", decimals: 6 },
  { type: "formula", outputId: "p6_e7_intensity_ppp_cy", formula: "(p6_e7_s1_cy+p6_e7_s2_cy)/p6_e7_rev_ppp_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e7_intensity_ppp_py", formula: "(p6_e7_s1_py+p6_e7_s2_py)/p6_e7_rev_ppp_py", decimals: 6 },
  // P6 – Waste (total, recovery, disposal)
  { type: "sum", outputId: "p6_e9_total_cy", sumIds: ["p6_e9_plast_cy", "p6_e9_ew_cy", "p6_e9_bio_cy", "p6_e9_cd_cy", "p6_e9_batt_cy", "p6_e9_radio_cy", "p6_e9_ohaz_cy", "p6_e9_onh_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e9_total_py", sumIds: ["p6_e9_plast_py", "p6_e9_ew_py", "p6_e9_bio_py", "p6_e9_cd_py", "p6_e9_batt_py", "p6_e9_radio_py", "p6_e9_ohaz_py", "p6_e9_onh_py"], decimals: 2 },
  { type: "sum", outputId: "p6_e9_rec_total_cy", sumIds: ["p6_e9_rec_recy_cy", "p6_e9_rec_reuse_cy", "p6_e9_rec_oth_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e9_rec_total_py", sumIds: ["p6_e9_rec_recy_py", "p6_e9_rec_reuse_py", "p6_e9_rec_oth_py"], decimals: 2 },
  { type: "sum", outputId: "p6_e9_disp_total_cy", sumIds: ["p6_e9_disp_inc_cy", "p6_e9_disp_land_cy", "p6_e9_disp_oth_cy"], decimals: 2 },
  { type: "sum", outputId: "p6_e9_disp_total_py", sumIds: ["p6_e9_disp_inc_py", "p6_e9_disp_land_py", "p6_e9_disp_oth_py"], decimals: 2 },
  { type: "formula", outputId: "p6_e9_intensity_cy", formula: "(p6_e9_plast_cy+p6_e9_ew_cy+p6_e9_bio_cy+p6_e9_cd_cy+p6_e9_batt_cy+p6_e9_radio_cy+p6_e9_ohaz_cy+p6_e9_onh_cy)/p6_e9_rev_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e9_intensity_py", formula: "(p6_e9_plast_py+p6_e9_ew_py+p6_e9_bio_py+p6_e9_cd_py+p6_e9_batt_py+p6_e9_radio_py+p6_e9_ohaz_py+p6_e9_onh_py)/p6_e9_rev_py", decimals: 6 },
  { type: "formula", outputId: "p6_e9_intensity_ppp_cy", formula: "(p6_e9_plast_cy+p6_e9_ew_cy+p6_e9_bio_cy+p6_e9_cd_cy+p6_e9_batt_cy+p6_e9_radio_cy+p6_e9_ohaz_cy+p6_e9_onh_cy)/p6_e9_rev_ppp_cy", decimals: 6 },
  { type: "formula", outputId: "p6_e9_intensity_ppp_py", formula: "(p6_e9_plast_py+p6_e9_ew_py+p6_e9_bio_py+p6_e9_cd_py+p6_e9_batt_py+p6_e9_radio_py+p6_e9_ohaz_py+p6_e9_onh_py)/p6_e9_rev_ppp_py", decimals: 6 },
  // P1-P5, P7-P9 reference calc compatibility rules
  { type: "pct", outputId: "calc_p1_pct_1", num: "p1_e1_bod_covered", denom: "p1_e1_bod_total" },
  { type: "pct", outputId: "calc_p1_pct_2", num: "p1_e1_kmp_covered", denom: "p1_e1_kmp_total" },
  { type: "pct", outputId: "calc_p1_pct_3", num: "p1_e1_emp_covered", denom: "p1_e1_emp_total" },
  { type: "pct", outputId: "calc_p1_pct_4", num: "p1_e1_wrk_covered", denom: "p1_e1_wrk_total" },
  { type: "pct", outputId: "calc_p1_pct_5", num: "p1_l1_covered_val", denom: "p1_l1_total_val" },
  { type: "formula", outputId: "calc_p1_formula_1", formula: "p1_e8_ap_cy*365/p1_e8_cost_cy", decimals: 2 },
  { type: "formula", outputId: "calc_p1_formula_2", formula: "p1_e8_ap_py*365/p1_e8_cost_py", decimals: 2 },
  { type: "pct", outputId: "calc_p2_pct_1", num: "p2_e1_rd_env_cy", denom: "p2_e1_rd_cy" },
  { type: "pct", outputId: "calc_p2_pct_2", num: "p2_e1_rd_env_py", denom: "p2_e1_rd_py" },
  { type: "pct", outputId: "calc_p2_pct_3", num: "p2_e1_capex_env_cy", denom: "p2_e1_capex_cy" },
  { type: "pct", outputId: "calc_p2_pct_4", num: "p2_e1_capex_env_py", denom: "p2_e1_capex_py" },
  { type: "pct", outputId: "calc_p2_pct_5", num: "p2_e2_sustainable", denom: "p2_e2_total" },
  { type: "pct", outputId: "calc_p2_pct_6", num: "p2_l3_row0_recycled", denom: "p2_l3_row0_total" },
  { type: "pct", outputId: "calc_p3_pct_1", num: "p3_e1a_perm_m_hi", denom: "p3_e1a_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_2", num: "p3_e1a_perm_m_ac", denom: "p3_e1a_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_3", num: "p3_e1a_perm_m_mat", denom: "p3_e1a_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_4", num: "p3_e1a_perm_m_pat", denom: "p3_e1a_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_5", num: "p3_e1a_perm_m_dc", denom: "p3_e1a_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_6", num: "p3_e1a_perm_f_hi", denom: "p3_e1a_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_7", num: "p3_e1a_perm_f_ac", denom: "p3_e1a_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_8", num: "p3_e1a_perm_f_mat", denom: "p3_e1a_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_9", num: "p3_e1a_perm_f_pat", denom: "p3_e1a_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_10", num: "p3_e1a_perm_f_dc", denom: "p3_e1a_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_11", num: "p3_e1a_oth_m_hi", denom: "p3_e1a_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_12", num: "p3_e1a_oth_m_ac", denom: "p3_e1a_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_13", num: "p3_e1a_oth_m_mat", denom: "p3_e1a_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_14", num: "p3_e1a_oth_m_pat", denom: "p3_e1a_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_15", num: "p3_e1a_oth_m_dc", denom: "p3_e1a_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_16", num: "p3_e1a_oth_f_hi", denom: "p3_e1a_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_17", num: "p3_e1a_oth_f_ac", denom: "p3_e1a_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_18", num: "p3_e1a_oth_f_mat", denom: "p3_e1a_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_19", num: "p3_e1a_oth_f_pat", denom: "p3_e1a_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_20", num: "p3_e1a_oth_f_dc", denom: "p3_e1a_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_21", num: "p3_e1b_perm_m_hi", denom: "p3_e1b_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_22", num: "p3_e1b_perm_m_ac", denom: "p3_e1b_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_23", num: "p3_e1b_perm_m_mat", denom: "p3_e1b_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_24", num: "p3_e1b_perm_m_pat", denom: "p3_e1b_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_25", num: "p3_e1b_perm_m_dc", denom: "p3_e1b_perm_m_t" },
  { type: "pct", outputId: "calc_p3_pct_26", num: "p3_e1b_perm_f_hi", denom: "p3_e1b_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_27", num: "p3_e1b_perm_f_ac", denom: "p3_e1b_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_28", num: "p3_e1b_perm_f_mat", denom: "p3_e1b_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_29", num: "p3_e1b_perm_f_pat", denom: "p3_e1b_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_30", num: "p3_e1b_perm_f_dc", denom: "p3_e1b_perm_f_t" },
  { type: "pct", outputId: "calc_p3_pct_31", num: "p3_e1b_oth_m_hi", denom: "p3_e1b_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_32", num: "p3_e1b_oth_m_ac", denom: "p3_e1b_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_33", num: "p3_e1b_oth_m_mat", denom: "p3_e1b_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_34", num: "p3_e1b_oth_m_pat", denom: "p3_e1b_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_35", num: "p3_e1b_oth_m_dc", denom: "p3_e1b_oth_m_t" },
  { type: "pct", outputId: "calc_p3_pct_36", num: "p3_e1b_oth_f_hi", denom: "p3_e1b_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_37", num: "p3_e1b_oth_f_ac", denom: "p3_e1b_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_38", num: "p3_e1b_oth_f_mat", denom: "p3_e1b_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_39", num: "p3_e1b_oth_f_pat", denom: "p3_e1b_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_40", num: "p3_e1b_oth_f_dc", denom: "p3_e1b_oth_f_t" },
  { type: "pct", outputId: "calc_p3_pct_41", num: "p3_e1c_cy_spend", denom: "p3_e1c_cy_rev" },
  { type: "pct", outputId: "calc_p3_pct_42", num: "p3_e1c_py_spend", denom: "p3_e1c_py_rev" },
  { type: "pct", outputId: "calc_p3_pct_43", num: "p3_e7_emp_m_u_cy", denom: "p3_e7_emp_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_44", num: "p3_e7_emp_m_u_py", denom: "p3_e7_emp_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_45", num: "p3_e7_emp_f_u_cy", denom: "p3_e7_emp_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_46", num: "p3_e7_emp_f_u_py", denom: "p3_e7_emp_f_t_py" },
  { type: "pct", outputId: "calc_p3_pct_47", num: "p3_e7_wrk_m_u_cy", denom: "p3_e7_wrk_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_48", num: "p3_e7_wrk_f_u_cy", denom: "p3_e7_wrk_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_49", num: "p3_e8_emp_m_hs_cy", denom: "p3_e8_emp_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_50", num: "p3_e8_emp_m_sk_cy", denom: "p3_e8_emp_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_51", num: "p3_e8_emp_m_hs_py", denom: "p3_e8_emp_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_52", num: "p3_e8_emp_m_sk_py", denom: "p3_e8_emp_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_53", num: "p3_e8_emp_f_hs_cy", denom: "p3_e8_emp_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_54", num: "p3_e8_emp_f_sk_cy", denom: "p3_e8_emp_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_55", num: "p3_e8_emp_f_hs_py", denom: "p3_e8_emp_f_t_py" },
  { type: "pct", outputId: "calc_p3_pct_56", num: "p3_e8_emp_f_sk_py", denom: "p3_e8_emp_f_t_py" },
  { type: "pct", outputId: "calc_p3_pct_57", num: "p3_e8_wrk_m_hs_cy", denom: "p3_e8_wrk_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_58", num: "p3_e8_wrk_m_sk_cy", denom: "p3_e8_wrk_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_59", num: "p3_e8_wrk_m_hs_py", denom: "p3_e8_wrk_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_60", num: "p3_e8_wrk_m_sk_py", denom: "p3_e8_wrk_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_61", num: "p3_e8_wrk_f_hs_cy", denom: "p3_e8_wrk_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_62", num: "p3_e8_wrk_f_sk_cy", denom: "p3_e8_wrk_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_63", num: "p3_e8_wrk_f_hs_py", denom: "p3_e8_wrk_f_t_py" },
  { type: "pct", outputId: "calc_p3_pct_64", num: "p3_e8_wrk_f_sk_py", denom: "p3_e8_wrk_f_t_py" },
  { type: "pct", outputId: "calc_p3_pct_65", num: "p3_e9_emp_m_r_cy", denom: "p3_e9_emp_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_66", num: "p3_e9_emp_m_r_py", denom: "p3_e9_emp_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_67", num: "p3_e9_emp_f_r_cy", denom: "p3_e9_emp_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_68", num: "p3_e9_emp_f_r_py", denom: "p3_e9_emp_f_t_py" },
  { type: "pct", outputId: "calc_p3_pct_69", num: "p3_e9_wrk_m_r_cy", denom: "p3_e9_wrk_m_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_70", num: "p3_e9_wrk_m_r_py", denom: "p3_e9_wrk_m_t_py" },
  { type: "pct", outputId: "calc_p3_pct_71", num: "p3_e9_wrk_f_r_cy", denom: "p3_e9_wrk_f_t_cy" },
  { type: "pct", outputId: "calc_p3_pct_72", num: "p3_e9_wrk_f_r_py", denom: "p3_e9_wrk_f_t_py" },
  { type: "pct", outputId: "calc_p5_pct_1", num: "p5_e1_emp_perm_c_cy", denom: "p5_e1_emp_perm_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_2", num: "p5_e1_emp_perm_c_py", denom: "p5_e1_emp_perm_t_py" },
  { type: "pct", outputId: "calc_p5_pct_3", num: "p5_e1_emp_oth_c_cy", denom: "p5_e1_emp_oth_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_4", num: "p5_e1_emp_oth_c_py", denom: "p5_e1_emp_oth_t_py" },
  { type: "pct", outputId: "calc_p5_pct_5", num: "p5_e1_wrk_perm_c_cy", denom: "p5_e1_wrk_perm_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_6", num: "p5_e1_wrk_perm_c_py", denom: "p5_e1_wrk_perm_t_py" },
  { type: "pct", outputId: "calc_p5_pct_7", num: "p5_e1_wrk_oth_c_cy", denom: "p5_e1_wrk_oth_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_8", num: "p5_e1_wrk_oth_c_py", denom: "p5_e1_wrk_oth_t_py" },
  { type: "pct", outputId: "calc_p5_pct_9", num: "p5_e2_emp_pm_eq_cy", denom: "p5_e2_emp_pm_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_10", num: "p5_e2_emp_pm_more_cy", denom: "p5_e2_emp_pm_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_11", num: "p5_e2_emp_pm_eq_py", denom: "p5_e2_emp_pm_t_py" },
  { type: "pct", outputId: "calc_p5_pct_12", num: "p5_e2_emp_pm_more_py", denom: "p5_e2_emp_pm_t_py" },
  { type: "pct", outputId: "calc_p5_pct_13", num: "p5_e2_emp_pf_eq_cy", denom: "p5_e2_emp_pf_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_14", num: "p5_e2_emp_pf_more_cy", denom: "p5_e2_emp_pf_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_15", num: "p5_e2_emp_pf_eq_py", denom: "p5_e2_emp_pf_t_py" },
  { type: "pct", outputId: "calc_p5_pct_16", num: "p5_e2_emp_pf_more_py", denom: "p5_e2_emp_pf_t_py" },
  { type: "pct", outputId: "calc_p5_pct_17", num: "p5_e2_wrk_pm_eq_cy", denom: "p5_e2_wrk_pm_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_18", num: "p5_e2_wrk_pm_more_cy", denom: "p5_e2_wrk_pm_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_19", num: "p5_e2_wrk_pm_eq_py", denom: "p5_e2_wrk_pm_t_py" },
  { type: "pct", outputId: "calc_p5_pct_20", num: "p5_e2_wrk_pm_more_py", denom: "p5_e2_wrk_pm_t_py" },
  { type: "pct", outputId: "calc_p5_pct_21", num: "p5_e2_wrk_pf_eq_cy", denom: "p5_e2_wrk_pf_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_22", num: "p5_e2_wrk_pf_more_cy", denom: "p5_e2_wrk_pf_t_cy" },
  { type: "pct", outputId: "calc_p5_pct_23", num: "p5_e2_wrk_pf_eq_py", denom: "p5_e2_wrk_pf_t_py" },
  { type: "pct", outputId: "calc_p5_pct_24", num: "p5_e2_wrk_pf_more_py", denom: "p5_e2_wrk_pf_t_py" },
  { type: "pct", outputId: "calc_p5_pct_25", num: "p5_e3b_cy_f", denom: "p5_e3b_cy_t" },
  { type: "pct", outputId: "calc_p5_pct_26", num: "p5_e3b_py_f", denom: "p5_e3b_py_t" },
  { type: "pct", outputId: "calc_p5_pct_27", num: "p5_e7_tot_cy", denom: "p5_e7_f_cy" },
  { type: "pct", outputId: "calc_p5_pct_28", num: "p5_e7_tot_py", denom: "p5_e7_f_py" },
  { type: "pct", outputId: "calc_p8_pct_1", num: "p8_e5_rural_w_cy", denom: "p8_e5_rural_t_cy" },
  { type: "pct", outputId: "calc_p8_pct_2", num: "p8_e5_rural_w_py", denom: "p8_e5_rural_t_py" },
  { type: "pct", outputId: "calc_p8_pct_3", num: "p8_e5_semi_w_cy", denom: "p8_e5_semi_t_cy" },
  { type: "pct", outputId: "calc_p8_pct_4", num: "p8_e5_semi_w_py", denom: "p8_e5_semi_t_py" },
  { type: "pct", outputId: "calc_p8_pct_5", num: "p8_e5_urb_w_cy", denom: "p8_e5_urb_t_cy" },
  { type: "pct", outputId: "calc_p8_pct_6", num: "p8_e5_urb_w_py", denom: "p8_e5_urb_t_py" },
  { type: "pct", outputId: "calc_p8_pct_7", num: "p8_e5_metro_w_cy", denom: "p8_e5_metro_t_cy" },
  { type: "pct", outputId: "calc_p8_pct_8", num: "p8_e5_metro_w_py", denom: "p8_e5_metro_t_py" },
  { type: "pct", outputId: "calc_p8_pct_9", num: "p8_l3_pref", denom: "p8_l3_total" },
  { type: "pct", outputId: "calc_p8_pct_10", num: "p8_l6_1_vuln", denom: "p8_l6_1_tot" },
  { type: "pct", outputId: "calc_p9_pct_1", num: "p9_e7b_cy", denom: "p9_e7a_cy" },
  { type: "pct", outputId: "calc_p9_pct_2", num: "p9_e7b_py", denom: "p9_e7a_py" },

];
