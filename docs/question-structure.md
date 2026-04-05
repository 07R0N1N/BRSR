# Question structure ledger

Plain reference: how panels map to question codes, assignment blocks, and calculated fields. The **authoritative enum of saved input codes** is `lib/brsr/questionCodes.ts` (`GDATA_CODES`, `GEN_CODES`, `SB_CODES`, `P1_CODES`…`P9_CODES`, `ALL_QUESTION_CODES`). This document explains structure and patterns; it does not duplicate every line of those arrays.

Panel metadata: `lib/brsr/panels.ts` (`PANELS`).

Assignment blocks (admin UI / export labels): `getAssignmentBlocksForPanel` in `lib/brsr/assignmentBlocks.ts`, with static prefix tables for migrated principles in `lib/brsr/principleBlocksConfig.ts`.

Catalogue table `brsr_questions` is seeded by `scripts/seed-brsr-questions.ts` from the same block decomposition — run `npm run seed:questions` after adding codes to `questionCodes.ts`.

---

## General Data Gathering (panel id: `generaldata`)

### Turnover & PPP (for intensity calculations)

- **Question codes:** `gdata_turnover_cy`, `gdata_turnover_py`, `gdata_ppp_cy`, `gdata_ppp_py`
- **Type:** single fields
- **Prefix:** `gdata_`
- **Calculated from:** read-only `gdata_rev_ppp_cy_display`, `gdata_rev_ppp_py_display` in `calcRules.ts` (formulas on turnover/PPP)

### Employee & worker counts

- **Question codes:** remaining `GDATA_CODES` entries (`gdata_emp_*`, `gdata_wrk_*`)
- **Type:** single fields (matrix of categories)
- **Prefix:** `gdata_`
- **Calculated from:** `gdata_emp_perm_sum`, `gdata_emp_oth_sum`, `gdata_wrk_perm_sum`, `gdata_wrk_oth_sum` (`sum` rules)

---

## General Disclosures — Section A (panel id: `general`)

Per-block layout from `getAssignmentBlocksForPanel('general')` and `GENERAL_LABELS` in `assignmentBlocks.ts`.


### 1. Corporate Identity Number (CIN)
- **Prefix:** `gen_1_`
- **Codes:** `gen_1_cin`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Name of the Listed Entity
- **Prefix:** `gen_2_`
- **Codes:** `gen_2_name`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Date of Incorporation
- **Prefix:** `gen_3_`
- **Codes:** `gen_3_year_inc`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Registered office address
- **Prefix:** `gen_4_`
- **Codes:** `gen_4_registered_addr`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Corporate address
- **Prefix:** `gen_5_`
- **Codes:** `gen_5_corporate_addr`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 6. E-mail address
- **Prefix:** `gen_6_`
- **Codes:** `gen_6_email`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 7. Telephone No.
- **Prefix:** `gen_7_`
- **Codes:** `gen_7_telephone`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 8. Website
- **Prefix:** `gen_8_`
- **Codes:** `gen_8_website`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 9. Financial year for which reporting is being done
- **Prefix:** `gen_9_`
- **Codes:** `gen_9_fy`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 10. Name of the Stock Exchange(s) where shares are listed
- **Prefix:** `gen_10_`
- **Codes:** `gen_10_row_count`, `gen_10_1_exchange`, `gen_10_1_description`, `gen_10_1_country`, `gen_10_2_exchange`, `gen_10_2_description`, `gen_10_2_country`, `gen_10_3_exchange`, `gen_10_3_description`, `gen_10_3_country`, `gen_10_4_exchange`, `gen_10_4_description`, `gen_10_4_country`, `gen_10_5_exchange`, `gen_10_5_description`, `gen_10_5_country`, `gen_10_6_exchange`, `gen_10_6_description`, `gen_10_6_country`, `gen_10_7_exchange`, `gen_10_7_description`, `gen_10_7_country`, `gen_10_8_exchange`, `gen_10_8_description`, `gen_10_8_country`, `gen_10_9_exchange`, `gen_10_9_description`, `gen_10_9_country`, `gen_10_10_exchange`, `gen_10_10_description`, `gen_10_10_country`
- **Type:** table (multi-record)
- **If table:** Rows `gen_10_{n}_exchange|description|country`; `gen_10_row_count`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 11. Paid-up Capital (in INR)
- **Prefix:** `gen_11_`
- **Codes:** `gen_11_paidup_capital`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 12. Name and contact details of the person who may be contacted in case of any queries on the BRSR report
- **Prefix:** `gen_12_`
- **Codes:** `gen_12_contact`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 13. Reporting boundary
- **Prefix:** `gen_13_`
- **Codes:** `gen_13_boundary`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 14. Details of Assurer(s)
- **Prefix:** `gen_14_`
- **Codes:** `gen_14_row_count`, `gen_14_1_company`, `gen_14_1_id`, `gen_14_1_assurer_name`, `gen_14_1_designation`, `gen_14_1_date`, `gen_14_2_company`, `gen_14_2_id`, `gen_14_2_assurer_name`, `gen_14_2_designation`, `gen_14_2_date`, `gen_14_3_company`, `gen_14_3_id`, `gen_14_3_assurer_name`, `gen_14_3_designation`, `gen_14_3_date`, `gen_14_4_company`, `gen_14_4_id`, `gen_14_4_assurer_name`, `gen_14_4_designation`, `gen_14_4_date`, `gen_14_5_company`, `gen_14_5_id`, `gen_14_5_assurer_name`, `gen_14_5_designation`, `gen_14_5_date`, `gen_14_6_company`, `gen_14_6_id`, `gen_14_6_assurer_name`, `gen_14_6_designation`, `gen_14_6_date`, `gen_14_7_company`, `gen_14_7_id`, `gen_14_7_assurer_name`, `gen_14_7_designation`, `gen_14_7_date`, `gen_14_8_company`, `gen_14_8_id`, `gen_14_8_assurer_name`, `gen_14_8_designation`, `gen_14_8_date`, `gen_14_9_company`, `gen_14_9_id`, `gen_14_9_assurer_name`, `gen_14_9_designation`, `gen_14_9_date`, `gen_14_10_company`, `gen_14_10_id`, `gen_14_10_assurer_name`, `gen_14_10_designation`, `gen_14_10_date`
- **Type:** table (multi-record)
- **If table:** Rows `gen_14_{n}_*`; `gen_14_row_count`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 15. Type of assurance obtained
- **Prefix:** `gen_15_`
- **Codes:** `gen_15_assurance_type`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 16. Details of business activities (accounting for 90% of turnover)
- **Prefix:** `gen_16_`
- **Codes:** `gen_16_1_main`, `gen_16_1_activity`, `gen_16_1_pct`, `gen_16_2_main`, `gen_16_2_activity`, `gen_16_2_pct`, `gen_16_3_main`, `gen_16_3_activity`, `gen_16_3_pct`, `gen_16_4_main`, `gen_16_4_activity`, `gen_16_4_pct`, `gen_16_5_main`, `gen_16_5_activity`, `gen_16_5_pct`, `gen_16_row_count`
- **Type:** table (multi-record)
- **If table:** Template `gen_16_1_*`; instances `gen_16_{n}_*`; `gen_16_row_count`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 17. Products/Services sold (accounting for 90% of turnover)
- **Prefix:** `gen_17_`
- **Codes:** `gen_17_1_product`, `gen_17_1_nic`, `gen_17_1_pct`, `gen_17_2_product`, `gen_17_2_nic`, `gen_17_2_pct`, `gen_17_3_product`, `gen_17_3_nic`, `gen_17_3_pct`, `gen_17_4_product`, `gen_17_4_nic`, `gen_17_4_pct`, `gen_17_5_product`, `gen_17_5_nic`, `gen_17_5_pct`, `gen_17_row_count`
- **Type:** table (multi-record)
- **If table:** Rows `gen_17_{n}_*`; `gen_17_row_count`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 18. Number of locations where plants and/or operations/offices of the entity are situated
- **Prefix:** `gen_18_`
- **Codes:** `gen_18_nat_plants`, `gen_18_nat_offices`, `gen_18_int_plants`, `gen_18_int_offices`
- **Type:** table (multi-record)
- **Calculated from (read-only `CALC_RULES`):** […2 ids…] → `gen_18_nat_sum` (sum); […2 ids…] → `gen_18_int_sum` (sum)

### 19. Markets served by the entity
- **Prefix:** `gen_19_`
- **Codes:** `gen_19_nat_states`, `gen_19_int_countries`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 19(b). Contribution of exports as % of total turnover
- **Prefix:** `gen_19b_`
- **Codes:** `gen_19b_export_pct`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 19(c). Brief on types of customers
- **Prefix:** `gen_19c_`
- **Codes:** `gen_19c_customers`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 20. Details as at the end of Financial Year – i. Employees, ii. Workers
- **Prefix:** `gen_20a_`
- **Codes:** `gen_20a_emp_perm_m`, `gen_20a_emp_perm_f`, `gen_20a_emp_perm_o`, `gen_20a_emp_other_m`, `gen_20a_emp_other_f`, `gen_20a_emp_other_o`, `gen_20a_wrk_perm_m`, `gen_20a_wrk_perm_f`, `gen_20a_wrk_perm_o`, `gen_20a_wrk_other_m`, `gen_20a_wrk_other_f`, `gen_20a_wrk_other_o`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […3 ids…] → `gen_20a_emp_perm_total` (sum); […3 ids…] → `gen_20a_emp_other_total` (sum); […3 ids…] → `gen_20a_wrk_perm_total` (sum); […3 ids…] → `gen_20a_wrk_other_total` (sum); […2 ids…] → `gen_20a_emp_total` (sum); […2 ids…] → `gen_20a_emp_total_m` (sum); […2 ids…] → `gen_20a_emp_total_f` (sum); […2 ids…] → `gen_20a_emp_total_o` (sum) … +22 more rules in `calcRules.ts`

### 20. Details as at the end of Financial Year – iii. Differently abled Employees, iv. Differently abled Workers
- **Prefix:** `gen_20b_`
- **Codes:** `gen_20b_emp_perm_m`, `gen_20b_emp_perm_f`, `gen_20b_emp_perm_o`, `gen_20b_emp_other_m`, `gen_20b_emp_other_f`, `gen_20b_emp_other_o`, `gen_20b_wrk_perm_m`, `gen_20b_wrk_perm_f`, `gen_20b_wrk_perm_o`, `gen_20b_wrk_other_m`, `gen_20b_wrk_other_f`, `gen_20b_wrk_other_o`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […3 ids…] → `gen_20b_emp_perm_total` (sum); […3 ids…] → `gen_20b_emp_other_total` (sum); […3 ids…] → `gen_20b_wrk_perm_total` (sum); […3 ids…] → `gen_20b_wrk_other_total` (sum); […2 ids…] → `gen_20b_emp_total` (sum); […2 ids…] → `gen_20b_emp_total_m` (sum); […2 ids…] → `gen_20b_emp_total_f` (sum); […2 ids…] → `gen_20b_emp_total_o` (sum) … +22 more rules in `calcRules.ts`

### 21. Participation/Inclusion/Representation of women
- **Prefix:** `gen_21_`
- **Codes:** `gen_21_bod_total`, `gen_21_bod_f`, `gen_21_kmp_total`, `gen_21_kmp_f`
- **Type:** table (multi-record)
- **Calculated from (read-only `CALC_RULES`):** `gen_21_bod_f` / `gen_21_bod_total` → `gen_21_bod_pct` (pct); `gen_21_kmp_f` / `gen_21_kmp_total` → `gen_21_kmp_pct` (pct)

### 22. Turnover rate for permanent employees and workers
- **Prefix:** `gen_22_`
- **Codes:** `gen_22_emp_cy_m`, `gen_22_emp_cy_f`, `gen_22_emp_cy_t`, `gen_22_emp_py_m`, `gen_22_emp_py_f`, `gen_22_emp_py_t`, `gen_22_emp_pp_m`, `gen_22_emp_pp_f`, `gen_22_emp_pp_t`, `gen_22_emp_cy_o`, `gen_22_emp_py_o`, `gen_22_emp_pp_o`, `gen_22_wrk_cy_m`, `gen_22_wrk_cy_f`, `gen_22_wrk_cy_t`, `gen_22_wrk_py_m`, `gen_22_wrk_py_f`, `gen_22_wrk_py_t`, `gen_22_wrk_pp_m`, `gen_22_wrk_pp_f`, `gen_22_wrk_pp_t`, `gen_22_wrk_cy_o`, `gen_22_wrk_py_o`, `gen_22_wrk_pp_o`
- **Type:** table (multi-record)
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 23. Names of holding / subsidiary / associate companies / joint ventures
- **Prefix:** `gen_23_`
- **Codes:** `gen_23_1_name`, `gen_23_1_type`, `gen_23_1_pct`, `gen_23_1_br`, `gen_23_2_name`, `gen_23_2_type`, `gen_23_2_pct`, `gen_23_2_br`, `gen_23_3_name`, `gen_23_3_type`, `gen_23_3_pct`, `gen_23_3_br`, `gen_23_4_name`, `gen_23_4_type`, `gen_23_4_pct`, `gen_23_4_br`, `gen_23_5_name`, `gen_23_5_type`, `gen_23_5_pct`, `gen_23_5_br`, `gen_23_row_count`
- **Type:** table (multi-record)
- **If table:** Rows `gen_23_{n}_*`; `gen_23_row_count`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 24. CSR applicability, turnover, and net worth
- **Prefix:** `gen_24_`
- **Codes:** `gen_24_csr_applicable`, `gen_24_turnover`, `gen_24_networth`
- **Type:** table (multi-record)
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 25. Complaints on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct.
- **Prefix:** `gen_25_`
- **Codes:** `gen_25_comm_mech`, `gen_25_comm_cy_f`, `gen_25_comm_cy_p`, `gen_25_comm_cy_rem`, `gen_25_comm_py_f`, `gen_25_comm_py_p`, `gen_25_comm_py_rem`, `gen_25_comm_weblink`, `gen_25_inv_mech`, `gen_25_inv_cy_f`, `gen_25_inv_cy_p`, `gen_25_inv_cy_rem`, `gen_25_inv_py_f`, `gen_25_inv_py_p`, `gen_25_inv_py_rem`, `gen_25_inv_weblink`, `gen_25_sha_mech`, `gen_25_sha_cy_f`, `gen_25_sha_cy_p`, `gen_25_sha_cy_rem`, `gen_25_sha_py_f`, `gen_25_sha_py_p`, `gen_25_sha_py_rem`, `gen_25_sha_weblink`, `gen_25_emp_mech`, `gen_25_emp_cy_f`, `gen_25_emp_cy_p`, `gen_25_emp_cy_rem`, `gen_25_emp_py_f`, `gen_25_emp_py_p`, `gen_25_emp_py_rem`, `gen_25_emp_weblink`, `gen_25_cust_mech`, `gen_25_cust_cy_f`, `gen_25_cust_cy_p`, `gen_25_cust_cy_rem`, `gen_25_cust_py_f`, `gen_25_cust_py_p`, `gen_25_cust_py_rem`, `gen_25_cust_weblink`, `gen_25_vc_mech`, `gen_25_vc_cy_f`, `gen_25_vc_cy_p`, `gen_25_vc_cy_rem`, `gen_25_vc_py_f`, `gen_25_vc_py_p`, `gen_25_vc_py_rem`, `gen_25_vc_weblink`, `gen_25_oth_mech`, `gen_25_oth_cy_f`, `gen_25_oth_cy_p`, `gen_25_oth_cy_rem`, `gen_25_oth_py_f`, `gen_25_oth_py_p`, `gen_25_oth_py_rem`, `gen_25_oth_weblink`
- **Type:** table (multi-record)
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 26. Overview of the entity's material responsible business conduct issues
- **Prefix:** `gen_26_`
- **Codes:** `gen_26_1_issue`, `gen_26_1_ro`, `gen_26_1_rationale`, `gen_26_1_approach`, `gen_26_1_fin`, `gen_26_2_issue`, `gen_26_2_ro`, `gen_26_2_rationale`, `gen_26_2_approach`, `gen_26_2_fin`, `gen_26_3_issue`, `gen_26_3_ro`, `gen_26_3_rationale`, `gen_26_3_approach`, `gen_26_3_fin`, `gen_26_4_issue`, `gen_26_4_ro`, `gen_26_4_rationale`, `gen_26_4_approach`, `gen_26_4_fin`, `gen_26_5_issue`, `gen_26_5_ro`, `gen_26_5_rationale`, `gen_26_5_approach`, `gen_26_5_fin`, `gen_26_row_count`
- **Type:** table (multi-record)
- **If table:** Rows `gen_26_{n}_*`; `gen_26_row_count`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)


---

## Management & Process — Section B (panel id: `sectionb`)

Per-block layout from `getAssignmentBlocksForPanel('sectionb')` and `SECTION_B_LABELS` in `assignmentBlocks.ts`.


### 1(a). Policy/policies cover each principle and core elements
- **Prefix:** `sb_1a_`
- **Codes:** `sb_1a_p1`, `sb_1a_p2`, `sb_1a_p3`, `sb_1a_p4`, `sb_1a_p5`, `sb_1a_p6`, `sb_1a_p7`, `sb_1a_p8`, `sb_1a_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 1(b). Policy approved by Board
- **Prefix:** `sb_1b_`
- **Codes:** `sb_1b_p1`, `sb_1b_p2`, `sb_1b_p3`, `sb_1b_p4`, `sb_1b_p5`, `sb_1b_p6`, `sb_1b_p7`, `sb_1b_p8`, `sb_1b_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 1(c). Web link of policies
- **Prefix:** `sb_1c_`
- **Codes:** `sb_1c_p1`, `sb_1c_p2`, `sb_1c_p3`, `sb_1c_p4`, `sb_1c_p5`, `sb_1c_p6`, `sb_1c_p7`, `sb_1c_p8`, `sb_1c_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 2. Policy translated into procedures
- **Prefix:** `sb_2_`
- **Codes:** `sb_2_p1`, `sb_2_p2`, `sb_2_p3`, `sb_2_p4`, `sb_2_p5`, `sb_2_p6`, `sb_2_p7`, `sb_2_p8`, `sb_2_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 3. Policies extend to value chain partners
- **Prefix:** `sb_3_`
- **Codes:** `sb_3_p1`, `sb_3_p2`, `sb_3_p3`, `sb_3_p4`, `sb_3_p5`, `sb_3_p6`, `sb_3_p7`, `sb_3_p8`, `sb_3_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 4. National/international codes/certifications/labels/standards adopted
- **Prefix:** `sb_4_`
- **Codes:** `sb_4_p1`, `sb_4_p2`, `sb_4_p3`, `sb_4_p4`, `sb_4_p5`, `sb_4_p6`, `sb_4_p7`, `sb_4_p8`, `sb_4_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 5. Specific commitments, goals, targets with timelines
- **Prefix:** `sb_5_`
- **Codes:** `sb_5_p1`, `sb_5_p2`, `sb_5_p3`, `sb_5_p4`, `sb_5_p5`, `sb_5_p6`, `sb_5_p7`, `sb_5_p8`, `sb_5_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 6. Performance against commitments/goals/targets
- **Prefix:** `sb_6_`
- **Codes:** `sb_6_p1`, `sb_6_p2`, `sb_6_p3`, `sb_6_p4`, `sb_6_p5`, `sb_6_p6`, `sb_6_p7`, `sb_6_p8`, `sb_6_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 7. Statement by director on ESG challenges, targets, achievements
- **Prefix:** `sb_7_`
- **Codes:** `sb_7_statement`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 8. Highest authority for implementation and oversight of BR policy
- **Prefix:** `sb_8_`
- **Codes:** `sb_8_authority`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 9. Committee of Board/Director for sustainability issues
- **Prefix:** `sb_9_`
- **Codes:** `sb_9_p1`, `sb_9_p2`, `sb_9_p3`, `sb_9_p4`, `sb_9_p5`, `sb_9_p6`, `sb_9_p7`, `sb_9_p8`, `sb_9_p9`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 10(a). Review of NGRBCs – Performance vs policies
- **Prefix:** `sb_10a_`
- **Codes:** `sb_10a_p1`, `sb_10a_p1_review`, `sb_10a_p1_freq`, `sb_10a_p2`, `sb_10a_p2_review`, `sb_10a_p2_freq`, `sb_10a_p3`, `sb_10a_p3_review`, `sb_10a_p3_freq`, `sb_10a_p4`, `sb_10a_p4_review`, `sb_10a_p4_freq`, `sb_10a_p5`, `sb_10a_p5_review`, `sb_10a_p5_freq`, `sb_10a_p6`, `sb_10a_p6_review`, `sb_10a_p6_freq`, `sb_10a_p7`, `sb_10a_p7_review`, `sb_10a_p7_freq`, `sb_10a_p8`, `sb_10a_p8_review`, `sb_10a_p8_freq`, `sb_10a_p9`, `sb_10a_p9_review`, `sb_10a_p9_freq`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 10(b). Compliance with statutory requirements
- **Prefix:** `sb_10b_`
- **Codes:** `sb_10b_p1`, `sb_10b_p1_review`, `sb_10b_p1_freq`, `sb_10b_p2`, `sb_10b_p2_review`, `sb_10b_p2_freq`, `sb_10b_p3`, `sb_10b_p3_review`, `sb_10b_p3_freq`, `sb_10b_p4`, `sb_10b_p4_review`, `sb_10b_p4_freq`, `sb_10b_p5`, `sb_10b_p5_review`, `sb_10b_p5_freq`, `sb_10b_p6`, `sb_10b_p6_review`, `sb_10b_p6_freq`, `sb_10b_p7`, `sb_10b_p7_review`, `sb_10b_p7_freq`, `sb_10b_p8`, `sb_10b_p8_review`, `sb_10b_p8_freq`, `sb_10b_p9`, `sb_10b_p9_review`, `sb_10b_p9_freq`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

### 11. Independent assessment by external agency
- **Prefix:** `sb_11_`
- **Codes:** `sb_11_p1`, `sb_11_p1_agency`, `sb_11_p2`, `sb_11_p2_agency`, `sb_11_p3`, `sb_11_p3_agency`, `sb_11_p4`, `sb_11_p4_agency`, `sb_11_p5`, `sb_11_p5_agency`, `sb_11_p6`, `sb_11_p6_agency`, `sb_11_p7`, `sb_11_p7_agency`, `sb_11_p8`, `sb_11_p8_agency`, `sb_11_p9`, `sb_11_p9_agency`
- **Type:** matrix (per-principle grid)
- **Calculated from (read-only `CALC_RULES`):** (none — Section B cells are inputs; no `CALC_RULES` for `sb_*`)

---

## Businesses should conduct and govern themselves with integrity, and in a manner that is ethical, transparent and accountable. (panel id: `p1`)

Assignment blocks from `getStaticPrincipleBlocks(1, …)` / `getAssignmentBlocksForPanel('p1')`.

### 1. Percentage coverage by training and awareness programmes on any of the Principles during the financial year
- **Prefix:** `p1_e1_`
- **Codes:** `p1_e1_bod_prog`, `p1_e1_bod_topics`, `p1_e1_bod_pct`, `p1_e1_kmp_prog`, `p1_e1_kmp_topics`, `p1_e1_kmp_pct`, `p1_e1_emp_prog`, `p1_e1_emp_topics`, `p1_e1_emp_pct`, `p1_e1_wrk_prog`, `p1_e1_wrk_topics`, `p1_e1_wrk_pct`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Details of fines / penalties / punishment / award / compounding fees / settlement amount paid in proceedings
- **Prefix:** `p1_e2_`
- **Codes:** `p1_e2_pf_rowcount`, `p1_e2_pf_row0_principle`, `p1_e2_pf_row0_agency`, `p1_e2_pf_row0_amt`, `p1_e2_pf_row0_brief`, `p1_e2_pf_row0_appeal`, `p1_e2_set_rowcount`, `p1_e2_set_row0_principle`, `p1_e2_set_row0_agency`, `p1_e2_set_row0_amt`, `p1_e2_set_row0_brief`, `p1_e2_set_row0_appeal`, `p1_e2_cmp_rowcount`, `p1_e2_cmp_row0_principle`, `p1_e2_cmp_row0_agency`, `p1_e2_cmp_row0_amt`, `p1_e2_cmp_row0_brief`, `p1_e2_cmp_row0_appeal`, `p1_e2_imp_rowcount`, `p1_e2_imp_row0_principle`, `p1_e2_imp_row0_agency`, `p1_e2_imp_row0_brief`, `p1_e2_imp_row0_appeal`, `p1_e2_pun_rowcount`, `p1_e2_pun_row0_principle`, `p1_e2_pun_row0_agency`, `p1_e2_pun_row0_brief`, `p1_e2_pun_row0_appeal`
- **Type:** table (multi-record)
- **If table:** Sub-tables: `p1_e2_pf_*`, `p1_e2_set_*`, `p1_e2_cmp_*`, `p1_e2_imp_*`, `p1_e2_pun_*` with `*_rowcount` / `*_row0_*` and optional extra rows.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Of the instances disclosed in Question 2 above, details of the Appeal/ Revision preferred
- **Prefix:** `p1_e3_row`
- **Codes:** `p1_e3_rowcount`, `p1_e3_row0_case`, `p1_e3_row0_agency`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Does the entity have an anti-corruption policy or anti-bribery policy?
- **Prefix:** `p1_e4_`
- **Codes:** `p1_e4_anticorr`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Number of Directors/KMPs/employees/workers against whom disciplinary action was taken (bribery/corruption)
- **Prefix:** `p1_e5_`
- **Codes:** `p1_e5_dir_cy`, `p1_e5_dir_py`, `p1_e5_kmp_cy`, `p1_e5_kmp_py`, `p1_e5_emp_cy`, `p1_e5_emp_py`, `p1_e5_wrk_cy`, `p1_e5_wrk_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 6. Details of complaints with regard to conflict of interest
- **Prefix:** `p1_e6_`
- **Codes:** `p1_e6_dir_cy`, `p1_e6_dir_cy_rem`, `p1_e6_dir_py`, `p1_e6_dir_py_rem`, `p1_e6_kmp_cy`, `p1_e6_kmp_cy_rem`, `p1_e6_kmp_py`, `p1_e6_kmp_py_rem`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 7. Provide details of any corrective action taken or under way on fines/penalties/corruption/conflicts of interest
- **Prefix:** `p1_e7_`
- **Codes:** `p1_e7_corrective`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 8. Number of days of accounts payables
- **Prefix:** `p1_e8_`
- **Codes:** `p1_e8_ap_cy`, `p1_e8_ap_py`, `p1_e8_cost_cy`, `p1_e8_cost_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p1_e8_ap_cy/p1_e8_cost_cy` → `calc_p1_formula_1` (2 dp); `p1_e8_ap_py/p1_e8_cost_py` → `calc_p1_formula_2` (2 dp)

### 9. Open-ness of business - Provide details of concentration of purchases and sales with trading houses, dealers, and related parties along-with loans and advances & investments, with related parties, in the following format
- **Prefix:** `p1_e9_`
- **Codes:** `p1_e9_purch_i_cy`, `p1_e9_purch_i_py`, `p1_e9_purch_total_cy`, `p1_e9_purch_total_py`, `p1_e9_purch_num_cy`, `p1_e9_purch_num_py`, `p1_e9_purch_top10_cy`, `p1_e9_purch_top10_py`, `p1_e9_purch_total_th_cy`, `p1_e9_purch_total_th_py`, `p1_e9_sales_i_cy`, `p1_e9_sales_i_py`, `p1_e9_sales_total_cy`, `p1_e9_sales_total_py`, `p1_e9_sales_num_cy`, `p1_e9_sales_num_py`, `p1_e9_sales_top10_cy`, `p1_e9_sales_top10_py`, `p1_e9_sales_total_dd_cy`, `p1_e9_sales_total_dd_py`, `p1_e9_rpt_purch_i_cy`, `p1_e9_rpt_purch_i_py`, `p1_e9_rpt_purch_total_cy`, `p1_e9_rpt_purch_total_py`, `p1_e9_rpt_sales_i_cy`, `p1_e9_rpt_sales_i_py`, `p1_e9_rpt_sales_total_cy`, `p1_e9_rpt_sales_total_py`, `p1_e9_rpt_loans_i_cy`, `p1_e9_rpt_loans_i_py`, `p1_e9_rpt_loans_total_cy`, `p1_e9_rpt_loans_total_py`, `p1_e9_rpt_inv_i_cy`, `p1_e9_rpt_inv_i_py`, `p1_e9_rpt_inv_total_cy`, `p1_e9_rpt_inv_total_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p1_e9_purch_i_cy` / `p1_e9_purch_total_cy` → `calc_p1_e9_purch_pct_cy` (pct); `p1_e9_purch_i_py` / `p1_e9_purch_total_py` → `calc_p1_e9_purch_pct_py` (pct); `p1_e9_purch_top10_cy` / `p1_e9_purch_total_th_cy` → `calc_p1_e9_purch_top10_pct_cy` (pct); `p1_e9_purch_top10_py` / `p1_e9_purch_total_th_py` → `calc_p1_e9_purch_top10_pct_py` (pct); `p1_e9_sales_i_cy` / `p1_e9_sales_total_cy` → `calc_p1_e9_sales_pct_cy` (pct); `p1_e9_sales_i_py` / `p1_e9_sales_total_py` → `calc_p1_e9_sales_pct_py` (pct); `p1_e9_sales_top10_cy` / `p1_e9_sales_total_dd_cy` → `calc_p1_e9_sales_top10_pct_cy` (pct); `p1_e9_sales_top10_py` / `p1_e9_sales_total_dd_py` → `calc_p1_e9_sales_top10_pct_py` (pct) … +8 more rules in `calcRules.ts`

### 1. Awareness programmes conducted for value chain partners on any of the Principles during the financial year
- **Prefix:** `p1_l1_row`
- **Codes:** `p1_l1_rowcount`, `p1_l1_row0_prog`, `p1_l1_row0_topics`, `p1_l1_row0_pct`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Does the entity have processes in place to avoid / manage conflict of interests involving members of the Board?
- **Prefix:** `p1_l2_`
- **Codes:** `p1_l2_conflict`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p1_notes`
- **Codes:** `p1_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should provide goods and services in a sustainable and safe manner. (panel id: `p2`)

Assignment blocks from `getStaticPrincipleBlocks(2, …)` / `getAssignmentBlocksForPanel('p2')`.

### 1. Percentage of R&D and capex investments for environmental and social impacts
- **Prefix:** `p2_e1_`
- **Codes:** `p2_e1_rd_cy`, `p2_e1_rd_py`, `p2_e1_rd_details`, `p2_e1_capex_cy`, `p2_e1_capex_py`, `p2_e1_capex_details`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Does the entity have procedures in place for sustainable sourcing?
- **Prefix:** `p2_e2_`
- **Codes:** `p2_e2_yn`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Describe the processes in place to safely reclaim your products for reusing, recycling and disposing at the end of life
- **Prefix:** `p2_e3_`
- **Codes:** `p2_e3_plastics`, `p2_e3_ewaste`, `p2_e3_hazardous`, `p2_e3_other`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Whether Extended Producer Responsibility (EPR) is applicable to the entity's activities (Yes / No).
- **Prefix:** `p2_e4_`
- **Codes:** `p2_e4_epr`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 1. Has the Company conducted Life Cycle Assessments (LCA) for its products /services?
- **Prefix:** `p2_l1_`
- **Codes:** `p2_l1_yn`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. If there are any significant social or environmental concerns and/or risks arising from production or disposal of your products / services, as identified in the Life Cycle Perspective / Assessments (LCA) or through any other means, briefly describe the same along-with action taken to mitigate the same
- **Prefix:** `p2_l2_row`
- **Codes:** `p2_l2_row0_product`, `p2_l2_row0_risk`, `p2_l2_row0_action`, `p2_l2_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Percentage of recycled or reused input material to total material (by value) used in production (for manufacturing industry) or providing services (for service industry).
- **Prefix:** `p2_l3_row`
- **Codes:** `p2_l3_row0_material`, `p2_l3_row0_pct_cy`, `p2_l3_row0_pct_py`, `p2_l3_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Of the products and packaging reclaimed at end of life of products, amount (in metric tonnes) reused, recycled, and safely disposed, as per the following format.
- **Prefix:** `p2_l4_`
- **Codes:** `p2_l4_plast_cy_re`, `p2_l4_plast_cy_rc`, `p2_l4_plast_cy_d`, `p2_l4_plast_py_re`, `p2_l4_plast_py_rc`, `p2_l4_plast_py_d`, `p2_l4_ew_cy_re`, `p2_l4_ew_cy_rc`, `p2_l4_ew_cy_d`, `p2_l4_ew_py_re`, `p2_l4_ew_py_rc`, `p2_l4_ew_py_d`, `p2_l4_haz_cy_re`, `p2_l4_haz_cy_rc`, `p2_l4_haz_cy_d`, `p2_l4_haz_py_re`, `p2_l4_haz_py_rc`, `p2_l4_haz_py_d`, `p2_l4_oth_cy_re`, `p2_l4_oth_cy_rc`, `p2_l4_oth_cy_d`, `p2_l4_oth_py_re`, `p2_l4_oth_py_rc`, `p2_l4_oth_py_d`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Reclaimed products and their packaging materials (as percentage of products sold) for each product category.
- **Prefix:** `p2_l5_row`
- **Codes:** `p2_l5_rowcount`, `p2_l5_row0_category`, `p2_l5_row0_pct`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p2_notes`
- **Codes:** `p2_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should respect and promote the well-being of all employees. (panel id: `p3`)

Assignment blocks from `getStaticPrincipleBlocks(3, …)` / `getAssignmentBlocksForPanel('p3')`.

### 1. Details of measures for well-being – Employees (% covered, Permanent/Other)
- **Prefix:** `p3_e1a_`
- **Codes:** `p3_e1a_perm_m_t`, `p3_e1a_perm_f_t`, `p3_e1a_perm_o_t`, `p3_e1a_perm_m_hi`, `p3_e1a_perm_f_hi`, `p3_e1a_perm_o_hi`, `p3_e1a_perm_m_ac`, `p3_e1a_perm_f_ac`, `p3_e1a_perm_o_ac`, `p3_e1a_perm_m_mat`, `p3_e1a_perm_f_mat`, `p3_e1a_perm_o_mat`, `p3_e1a_perm_m_pat`, `p3_e1a_perm_f_pat`, `p3_e1a_perm_o_pat`, `p3_e1a_perm_m_dc`, `p3_e1a_perm_f_dc`, `p3_e1a_perm_o_dc`, `p3_e1a_oth_m_t`, `p3_e1a_oth_f_t`, `p3_e1a_oth_o_t`, `p3_e1a_oth_m_hi`, `p3_e1a_oth_f_hi`, `p3_e1a_oth_o_hi`, `p3_e1a_oth_m_ac`, `p3_e1a_oth_f_ac`, `p3_e1a_oth_o_ac`, `p3_e1a_oth_m_mat`, `p3_e1a_oth_f_mat`, `p3_e1a_oth_o_mat`, `p3_e1a_oth_m_pat`, `p3_e1a_oth_f_pat`, `p3_e1a_oth_o_pat`, `p3_e1a_oth_m_dc`, `p3_e1a_oth_f_dc`, `p3_e1a_oth_o_dc`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […3 ids…] → `calc_p3_e1a_perm_tot_t` (sum); […3 ids…] → `calc_p3_e1a_perm_tot_hi` (sum); […3 ids…] → `calc_p3_e1a_perm_tot_ac` (sum); […3 ids…] → `calc_p3_e1a_perm_tot_mat` (sum); […3 ids…] → `calc_p3_e1a_perm_tot_pat` (sum); […3 ids…] → `calc_p3_e1a_perm_tot_dc` (sum); `p3_e1a_perm_m_hi` / `p3_e1a_perm_m_t` → `calc_p3_e1a_perm_m_hi_pct` (pct); `p3_e1a_perm_m_ac` / `p3_e1a_perm_m_t` → `calc_p3_e1a_perm_m_ac_pct` (pct) … +34 more rules in `calcRules.ts`

### 1. Details of measures for well-being – Workers (% covered, Permanent/Other)
- **Prefix:** `p3_e1b_`
- **Codes:** `p3_e1b_perm_m_t`, `p3_e1b_perm_f_t`, `p3_e1b_perm_o_t`, `p3_e1b_perm_m_hi`, `p3_e1b_perm_f_hi`, `p3_e1b_perm_o_hi`, `p3_e1b_perm_m_ac`, `p3_e1b_perm_f_ac`, `p3_e1b_perm_o_ac`, `p3_e1b_perm_m_mat`, `p3_e1b_perm_f_mat`, `p3_e1b_perm_o_mat`, `p3_e1b_perm_m_pat`, `p3_e1b_perm_f_pat`, `p3_e1b_perm_o_pat`, `p3_e1b_perm_m_dc`, `p3_e1b_perm_f_dc`, `p3_e1b_perm_o_dc`, `p3_e1b_oth_m_t`, `p3_e1b_oth_f_t`, `p3_e1b_oth_o_t`, `p3_e1b_oth_m_hi`, `p3_e1b_oth_f_hi`, `p3_e1b_oth_o_hi`, `p3_e1b_oth_m_ac`, `p3_e1b_oth_f_ac`, `p3_e1b_oth_o_ac`, `p3_e1b_oth_m_mat`, `p3_e1b_oth_f_mat`, `p3_e1b_oth_o_mat`, `p3_e1b_oth_m_pat`, `p3_e1b_oth_f_pat`, `p3_e1b_oth_o_pat`, `p3_e1b_oth_m_dc`, `p3_e1b_oth_f_dc`, `p3_e1b_oth_o_dc`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […3 ids…] → `calc_p3_e1b_perm_tot_t` (sum); […3 ids…] → `calc_p3_e1b_perm_tot_hi` (sum); […3 ids…] → `calc_p3_e1b_perm_tot_ac` (sum); […3 ids…] → `calc_p3_e1b_perm_tot_mat` (sum); […3 ids…] → `calc_p3_e1b_perm_tot_pat` (sum); […3 ids…] → `calc_p3_e1b_perm_tot_dc` (sum); `p3_e1b_perm_m_hi` / `p3_e1b_perm_m_t` → `calc_p3_e1b_perm_m_hi_pct` (pct); `p3_e1b_perm_m_ac` / `p3_e1b_perm_m_t` → `calc_p3_e1b_perm_m_ac_pct` (pct) … +34 more rules in `calcRules.ts`

### 1(c). Spending on measures towards well-being of employees and workers
- **Prefix:** `p3_e1c_`
- **Codes:** `p3_e1c_cy_spend`, `p3_e1c_cy_rev`, `p3_e1c_py_spend`, `p3_e1c_py_rev`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p3_e1c_cy_spend` / `p3_e1c_cy_rev` → `calc_p3_e1c_cy_pct` (pct); `p3_e1c_py_spend` / `p3_e1c_py_rev` → `calc_p3_e1c_py_pct` (pct)

### 2. Details of retirement benefits (PF, Gratuity, ESI, Others)
- **Prefix:** `p3_e2_`
- **Codes:** `p3_e2_pf_emp_cy`, `p3_e2_pf_wrk_cy`, `p3_e2_pf_dep_cy`, `p3_e2_pf_emp_py`, `p3_e2_pf_wrk_py`, `p3_e2_pf_dep_py`, `p3_e2_gr_emp_cy`, `p3_e2_gr_wrk_cy`, `p3_e2_gr_dep_cy`, `p3_e2_gr_emp_py`, `p3_e2_gr_wrk_py`, `p3_e2_gr_dep_py`, `p3_e2_esi_emp_cy`, `p3_e2_esi_wrk_cy`, `p3_e2_esi_dep_cy`, `p3_e2_esi_emp_py`, `p3_e2_esi_wrk_py`, `p3_e2_esi_dep_py`, `p3_e2_oth_emp_cy`, `p3_e2_oth_wrk_cy`, `p3_e2_oth_dep_cy`, `p3_e2_oth_emp_py`, `p3_e2_oth_wrk_py`, `p3_e2_oth_dep_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Accessibility of workplaces for differently abled (Rights of Persons with Disabilities Act, 2016)
- **Prefix:** `p3_e3_`
- **Codes:** `p3_e3_access`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Equal opportunity policy (Rights of Persons with Disabilities Act, 2016)
- **Prefix:** `p3_e4_`
- **Codes:** `p3_e4_equal`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Return to work and retention rates (parental leave)
- **Prefix:** `p3_e5_`
- **Codes:** `p3_e5_m_emp_ret`, `p3_e5_m_emp_retn`, `p3_e5_m_wrk_ret`, `p3_e5_m_wrk_retn`, `p3_e5_f_emp_ret`, `p3_e5_f_emp_retn`, `p3_e5_f_wrk_ret`, `p3_e5_f_wrk_retn`, `p3_e5_o_emp_ret`, `p3_e5_o_emp_retn`, `p3_e5_o_wrk_ret`, `p3_e5_o_wrk_retn`, `p3_e5_tot_emp_ret`, `p3_e5_tot_emp_retn`, `p3_e5_tot_wrk_ret`, `p3_e5_tot_wrk_retn`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 6. Mechanism to receive and redress grievances
- **Prefix:** `p3_e6_`
- **Codes:** `p3_e6_yn`, `p3_e6_wrk_perm_yn`, `p3_e6_wrk_perm`, `p3_e6_wrk_oth_yn`, `p3_e6_wrk_oth`, `p3_e6_emp_perm_yn`, `p3_e6_emp_perm`, `p3_e6_emp_oth_yn`, `p3_e6_emp_oth`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 7. Membership of employees and workers in associations or unions
- **Prefix:** `p3_e7_`
- **Codes:** `p3_e7_emp_m_t_cy`, `p3_e7_emp_m_u_cy`, `p3_e7_emp_m_t_py`, `p3_e7_emp_m_u_py`, `p3_e7_emp_f_t_cy`, `p3_e7_emp_f_u_cy`, `p3_e7_emp_f_t_py`, `p3_e7_emp_f_u_py`, `p3_e7_emp_o_t_cy`, `p3_e7_emp_o_u_cy`, `p3_e7_emp_o_t_py`, `p3_e7_emp_o_u_py`, `p3_e7_wrk_m_t_cy`, `p3_e7_wrk_m_u_cy`, `p3_e7_wrk_m_t_py`, `p3_e7_wrk_m_u_py`, `p3_e7_wrk_f_t_cy`, `p3_e7_wrk_f_u_cy`, `p3_e7_wrk_f_t_py`, `p3_e7_wrk_f_u_py`, `p3_e7_wrk_o_t_cy`, `p3_e7_wrk_o_u_cy`, `p3_e7_wrk_o_t_py`, `p3_e7_wrk_o_u_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p3_e7_emp_m_u_cy` / `p3_e7_emp_m_t_cy` → `calc_p3_e7_emp_m_cy` (pct); `p3_e7_emp_m_u_py` / `p3_e7_emp_m_t_py` → `calc_p3_e7_emp_m_py` (pct); `p3_e7_emp_f_u_cy` / `p3_e7_emp_f_t_cy` → `calc_p3_e7_emp_f_cy` (pct); `p3_e7_emp_f_u_py` / `p3_e7_emp_f_t_py` → `calc_p3_e7_emp_f_py` (pct); `p3_e7_emp_o_u_cy` / `p3_e7_emp_o_t_cy` → `calc_p3_e7_emp_o_cy` (pct); `p3_e7_emp_o_u_py` / `p3_e7_emp_o_t_py` → `calc_p3_e7_emp_o_py` (pct); `p3_e7_wrk_m_u_cy` / `p3_e7_wrk_m_t_cy` → `calc_p3_e7_wrk_m_cy` (pct); `p3_e7_wrk_m_u_py` / `p3_e7_wrk_m_t_py` → `calc_p3_e7_wrk_m_py` (pct) … +12 more rules in `calcRules.ts`

### 8. Details of training given to employees and workers
- **Prefix:** `p3_e8_`
- **Codes:** `p3_e8_emp_m_t_cy`, `p3_e8_emp_m_hs_cy`, `p3_e8_emp_m_sk_cy`, `p3_e8_emp_m_t_py`, `p3_e8_emp_m_hs_py`, `p3_e8_emp_m_sk_py`, `p3_e8_emp_f_t_cy`, `p3_e8_emp_f_hs_cy`, `p3_e8_emp_f_sk_cy`, `p3_e8_emp_f_t_py`, `p3_e8_emp_f_hs_py`, `p3_e8_emp_f_sk_py`, `p3_e8_emp_o_t_cy`, `p3_e8_emp_o_hs_cy`, `p3_e8_emp_o_sk_cy`, `p3_e8_emp_o_t_py`, `p3_e8_emp_o_hs_py`, `p3_e8_emp_o_sk_py`, `p3_e8_wrk_m_t_cy`, `p3_e8_wrk_m_hs_cy`, `p3_e8_wrk_m_sk_cy`, `p3_e8_wrk_m_t_py`, `p3_e8_wrk_m_hs_py`, `p3_e8_wrk_m_sk_py`, `p3_e8_wrk_f_t_cy`, `p3_e8_wrk_f_hs_cy`, `p3_e8_wrk_f_sk_cy`, `p3_e8_wrk_f_t_py`, `p3_e8_wrk_f_hs_py`, `p3_e8_wrk_f_sk_py`, `p3_e8_wrk_o_t_cy`, `p3_e8_wrk_o_hs_cy`, `p3_e8_wrk_o_sk_cy`, `p3_e8_wrk_o_t_py`, `p3_e8_wrk_o_hs_py`, `p3_e8_wrk_o_sk_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p3_e8_emp_m_hs_cy` / `p3_e8_emp_m_t_cy` → `calc_p3_e8_emp_m_hs_cy` (pct); `p3_e8_emp_m_sk_cy` / `p3_e8_emp_m_t_cy` → `calc_p3_e8_emp_m_sk_cy` (pct); `p3_e8_emp_m_hs_py` / `p3_e8_emp_m_t_py` → `calc_p3_e8_emp_m_hs_py` (pct); `p3_e8_emp_m_sk_py` / `p3_e8_emp_m_t_py` → `calc_p3_e8_emp_m_sk_py` (pct); `p3_e8_emp_f_hs_cy` / `p3_e8_emp_f_t_cy` → `calc_p3_e8_emp_f_hs_cy` (pct); `p3_e8_emp_f_sk_cy` / `p3_e8_emp_f_t_cy` → `calc_p3_e8_emp_f_sk_cy` (pct); `p3_e8_emp_f_hs_py` / `p3_e8_emp_f_t_py` → `calc_p3_e8_emp_f_hs_py` (pct); `p3_e8_emp_f_sk_py` / `p3_e8_emp_f_t_py` → `calc_p3_e8_emp_f_sk_py` (pct) … +28 more rules in `calcRules.ts`

### 9. Details of performance and career development reviews of employees
- **Prefix:** `p3_e9_`
- **Codes:** `p3_e9_emp_m_t_cy`, `p3_e9_emp_m_r_cy`, `p3_e9_emp_m_t_py`, `p3_e9_emp_m_r_py`, `p3_e9_emp_f_t_cy`, `p3_e9_emp_f_r_cy`, `p3_e9_emp_f_t_py`, `p3_e9_emp_f_r_py`, `p3_e9_emp_o_t_cy`, `p3_e9_emp_o_r_cy`, `p3_e9_emp_o_t_py`, `p3_e9_emp_o_r_py`, `p3_e9_wrk_m_t_cy`, `p3_e9_wrk_m_r_cy`, `p3_e9_wrk_m_t_py`, `p3_e9_wrk_m_r_py`, `p3_e9_wrk_f_t_cy`, `p3_e9_wrk_f_r_cy`, `p3_e9_wrk_f_t_py`, `p3_e9_wrk_f_r_py`, `p3_e9_wrk_o_t_cy`, `p3_e9_wrk_o_r_cy`, `p3_e9_wrk_o_t_py`, `p3_e9_wrk_o_r_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p3_e9_emp_m_r_cy` / `p3_e9_emp_m_t_cy` → `calc_p3_e9_emp_m_cy` (pct); `p3_e9_emp_m_r_py` / `p3_e9_emp_m_t_py` → `calc_p3_e9_emp_m_py` (pct); `p3_e9_emp_f_r_cy` / `p3_e9_emp_f_t_cy` → `calc_p3_e9_emp_f_cy` (pct); `p3_e9_emp_f_r_py` / `p3_e9_emp_f_t_py` → `calc_p3_e9_emp_f_py` (pct); `p3_e9_emp_o_r_cy` / `p3_e9_emp_o_t_cy` → `calc_p3_e9_emp_o_cy` (pct); `p3_e9_emp_o_r_py` / `p3_e9_emp_o_t_py` → `calc_p3_e9_emp_o_py` (pct); `p3_e9_wrk_m_r_cy` / `p3_e9_wrk_m_t_cy` → `calc_p3_e9_wrk_m_cy` (pct); `p3_e9_wrk_m_r_py` / `p3_e9_wrk_m_t_py` → `calc_p3_e9_wrk_m_py` (pct) … +12 more rules in `calcRules.ts`

### 10. Health and safety management system
- **Prefix:** `p3_e10_`
- **Codes:** `p3_e10_impl_yn`, `p3_e10_processes`, `p3_e10_report_yn`, `p3_e10_medical_yn`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 11. Details of safety related incidents
- **Prefix:** `p3_e11_`
- **Codes:** `p3_e11_ltifr_emp_cy`, `p3_e11_ltifr_emp_py`, `p3_e11_ltifr_wrk_cy`, `p3_e11_ltifr_wrk_py`, `p3_e11_rec_emp_cy`, `p3_e11_rec_emp_py`, `p3_e11_rec_wrk_cy`, `p3_e11_rec_wrk_py`, `p3_e11_fat_emp_cy`, `p3_e11_fat_emp_py`, `p3_e11_fat_wrk_cy`, `p3_e11_fat_wrk_py`, `p3_e11_hc_emp_cy`, `p3_e11_hc_emp_py`, `p3_e11_hc_wrk_cy`, `p3_e11_hc_wrk_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 12. Measures for safe and healthy work place
- **Prefix:** `p3_e12_`
- **Codes:** `p3_e12_measures`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 13. Number of complaints (working conditions, health & safety)
- **Prefix:** `p3_e13_`
- **Codes:** `p3_e13_wc_cy_f`, `p3_e13_wc_cy_p`, `p3_e13_wc_cy_r`, `p3_e13_wc_py_f`, `p3_e13_wc_py_p`, `p3_e13_wc_py_r`, `p3_e13_hs_cy_f`, `p3_e13_hs_cy_p`, `p3_e13_hs_cy_r`, `p3_e13_hs_py_f`, `p3_e13_hs_py_p`, `p3_e13_hs_py_r`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 14. Assessments for the year (% plants/offices assessed)
- **Prefix:** `p3_e14_`
- **Codes:** `p3_e14_hs`, `p3_e14_wc`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 15. Corrective action (safety incidents, assessments)
- **Prefix:** `p3_e15_`
- **Codes:** `p3_e15_corrective`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 1. Life insurance / compensatory package (death)
- **Prefix:** `p3_l1_`
- **Codes:** `p3_l1_emp`, `p3_l1_wrk`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 2. Measures to ensure statutory dues deducted and deposited by value chain partners
- **Prefix:** `p3_l2_`
- **Codes:** `p3_l2_statutory`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 3. Rehabilitation (affected employees/workers or family placed)
- **Prefix:** `p3_l3_`
- **Codes:** `p3_l3_emp_cy_t`, `p3_l3_emp_py_t`, `p3_l3_emp_cy_r`, `p3_l3_emp_py_r`, `p3_l3_wrk_cy_t`, `p3_l3_wrk_py_t`, `p3_l3_wrk_cy_r`, `p3_l3_wrk_py_r`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 4. Transition assistance (retirement/termination)
- **Prefix:** `p3_l4_`
- **Codes:** `p3_l4_transition`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 5. Value chain partners assessed (%) – Health & safety, Working conditions
- **Prefix:** `p3_l5_`
- **Codes:** `p3_l5_hs`, `p3_l5_wc`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 6. Corrective actions (value chain – health & safety, working conditions)
- **Prefix:** `p3_l6_`
- **Codes:** `p3_l6_corrective`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p3_notes`
- **Codes:** `p3_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should respect the interests of and be responsive to all stakeholders. (panel id: `p4`)

Assignment blocks from `getStaticPrincipleBlocks(4, …)` / `getAssignmentBlocksForPanel('p4')`.

### 1. Describe the processes for identifying key stakeholder groups of the entity.
- **Prefix:** `p4_e1_`
- **Codes:** `p4_e1_process`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. List stakeholder groups identified as key for your entity and the frequency of engagement with each stakeholder group.
- **Prefix:** `p4_e2_row`
- **Codes:** `p4_e2_row0_name`, `p4_e2_row0_vuln`, `p4_e2_row0_chan`, `p4_e2_row0_chan_other`, `p4_e2_row0_freq`, `p4_e2_row0_freq_other`, `p4_e2_row0_purpose`, `p4_e2_rowcount`
- **Type:** table (multi-record)
- **If table:** Template `p4_e2_row0_*`, `p4_e2_rowcount`; UI may add `p4_e2_row{n}_*`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 1. Provide the processes for consultation between stakeholders and the Board on economic, environmental, and social topics or if consultation is delegated, how is feedback from such consultations provided to the Board.
- **Prefix:** `p4_l1_`
- **Codes:** `p4_l1_consult`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 2. Whether stakeholder consultation is used to support the identification and management of environmental and social topics?
- **Prefix:** `p4_l2_`
- **Codes:** `p4_l2_yn`, `p4_l2_instances`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 3. Instances of engagement with and actions taken to address the concerns of vulnerable /marginalised stakeholder groups.
- **Prefix:** `p4_l3_`
- **Codes:** `p4_l3_engagement`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p4_notes`
- **Codes:** `p4_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should respect and promote human rights. (panel id: `p5`)

Assignment blocks from `getStaticPrincipleBlocks(5, …)` / `getAssignmentBlocksForPanel('p5')`.

### 1. Employees and workers who have been provided training on human rights issues and policy(ies) of the entity
- **Prefix:** `p5_e1_`
- **Codes:** `p5_e1_emp_perm_t_cy`, `p5_e1_emp_perm_c_cy`, `p5_e1_emp_perm_t_py`, `p5_e1_emp_perm_c_py`, `p5_e1_emp_oth_t_cy`, `p5_e1_emp_oth_c_cy`, `p5_e1_emp_oth_t_py`, `p5_e1_emp_oth_c_py`, `p5_e1_wrk_perm_t_cy`, `p5_e1_wrk_perm_c_cy`, `p5_e1_wrk_perm_t_py`, `p5_e1_wrk_perm_c_py`, `p5_e1_wrk_oth_t_cy`, `p5_e1_wrk_oth_c_cy`, `p5_e1_wrk_oth_t_py`, `p5_e1_wrk_oth_c_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p5_e1_emp_perm_c_cy` / `p5_e1_emp_perm_t_cy` → `calc_p5_pct_1` (pct); `p5_e1_emp_perm_c_py` / `p5_e1_emp_perm_t_py` → `calc_p5_pct_2` (pct); `p5_e1_emp_oth_c_cy` / `p5_e1_emp_oth_t_cy` → `calc_p5_pct_3` (pct); `p5_e1_emp_oth_c_py` / `p5_e1_emp_oth_t_py` → `calc_p5_pct_4` (pct); `p5_e1_wrk_perm_c_cy` / `p5_e1_wrk_perm_t_cy` → `calc_p5_pct_5` (pct); `p5_e1_wrk_perm_c_py` / `p5_e1_wrk_perm_t_py` → `calc_p5_pct_6` (pct); `p5_e1_wrk_oth_c_cy` / `p5_e1_wrk_oth_t_cy` → `calc_p5_pct_7` (pct); `p5_e1_wrk_oth_c_py` / `p5_e1_wrk_oth_t_py` → `calc_p5_pct_8` (pct) … +8 more rules in `calcRules.ts`

### 2. Details of minimum wages paid to employees and workers
- **Prefix:** `p5_e2_`
- **Codes:** `p5_e2_emp_pm_t_cy`, `p5_e2_emp_pm_eq_cy`, `p5_e2_emp_pm_more_cy`, `p5_e2_emp_pm_t_py`, `p5_e2_emp_pm_eq_py`, `p5_e2_emp_pm_more_py`, `p5_e2_emp_pf_t_cy`, `p5_e2_emp_pf_eq_cy`, `p5_e2_emp_pf_more_cy`, `p5_e2_emp_pf_t_py`, `p5_e2_emp_pf_eq_py`, `p5_e2_emp_pf_more_py`, `p5_e2_emp_po_t_cy`, `p5_e2_emp_po_eq_cy`, `p5_e2_emp_po_more_cy`, `p5_e2_emp_po_t_py`, `p5_e2_emp_po_eq_py`, `p5_e2_emp_po_more_py`, `p5_e2_emp_otp_m_t_cy`, `p5_e2_emp_otp_m_eq_cy`, `p5_e2_emp_otp_m_more_cy`, `p5_e2_emp_otp_m_t_py`, `p5_e2_emp_otp_m_eq_py`, `p5_e2_emp_otp_m_more_py`, `p5_e2_emp_otp_f_t_cy`, `p5_e2_emp_otp_f_eq_cy`, `p5_e2_emp_otp_f_more_cy`, `p5_e2_emp_otp_f_t_py`, `p5_e2_emp_otp_f_eq_py`, `p5_e2_emp_otp_f_more_py`, `p5_e2_emp_otp_o_t_cy`, `p5_e2_emp_otp_o_eq_cy`, `p5_e2_emp_otp_o_more_cy`, `p5_e2_emp_otp_o_t_py`, `p5_e2_emp_otp_o_eq_py`, `p5_e2_emp_otp_o_more_py`, `p5_e2_wrk_pm_t_cy`, `p5_e2_wrk_pm_eq_cy`, `p5_e2_wrk_pm_more_cy`, `p5_e2_wrk_pm_t_py`, `p5_e2_wrk_pm_eq_py`, `p5_e2_wrk_pm_more_py`, `p5_e2_wrk_pf_t_cy`, `p5_e2_wrk_pf_eq_cy`, `p5_e2_wrk_pf_more_cy`, `p5_e2_wrk_pf_t_py`, `p5_e2_wrk_pf_eq_py`, `p5_e2_wrk_pf_more_py`, `p5_e2_wrk_po_t_cy`, `p5_e2_wrk_po_eq_cy`, `p5_e2_wrk_po_more_cy`, `p5_e2_wrk_po_t_py`, `p5_e2_wrk_po_eq_py`, `p5_e2_wrk_po_more_py`, `p5_e2_wrk_otp_m_t_cy`, `p5_e2_wrk_otp_m_eq_cy`, `p5_e2_wrk_otp_m_more_cy`, `p5_e2_wrk_otp_m_t_py`, `p5_e2_wrk_otp_m_eq_py`, `p5_e2_wrk_otp_m_more_py`, `p5_e2_wrk_otp_f_t_cy`, `p5_e2_wrk_otp_f_eq_cy`, `p5_e2_wrk_otp_f_more_cy`, `p5_e2_wrk_otp_f_t_py`, `p5_e2_wrk_otp_f_eq_py`, `p5_e2_wrk_otp_f_more_py`, `p5_e2_wrk_otp_o_t_cy`, `p5_e2_wrk_otp_o_eq_cy`, `p5_e2_wrk_otp_o_more_cy`, `p5_e2_wrk_otp_o_t_py`, `p5_e2_wrk_otp_o_eq_py`, `p5_e2_wrk_otp_o_more_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p5_e2_emp_pm_eq_cy` / `p5_e2_emp_pm_t_cy` → `calc_p5_pct_9` (pct); `p5_e2_emp_pm_more_cy` / `p5_e2_emp_pm_t_cy` → `calc_p5_pct_10` (pct); `p5_e2_emp_pm_eq_py` / `p5_e2_emp_pm_t_py` → `calc_p5_pct_11` (pct); `p5_e2_emp_pm_more_py` / `p5_e2_emp_pm_t_py` → `calc_p5_pct_12` (pct); `p5_e2_emp_pf_eq_cy` / `p5_e2_emp_pf_t_cy` → `calc_p5_pct_13` (pct); `p5_e2_emp_pf_more_cy` / `p5_e2_emp_pf_t_cy` → `calc_p5_pct_14` (pct); `p5_e2_emp_pf_eq_py` / `p5_e2_emp_pf_t_py` → `calc_p5_pct_15` (pct); `p5_e2_emp_pf_more_py` / `p5_e2_emp_pf_t_py` → `calc_p5_pct_16` (pct) … +64 more rules in `calcRules.ts`

### 3. Details of remuneration/salary/wages – i. Median remuneration / wages
- **Prefix:** `p5_e3a_`
- **Codes:** `p5_e3a_bod_m_n`, `p5_e3a_bod_m_med`, `p5_e3a_bod_f_n`, `p5_e3a_bod_f_med`, `p5_e3a_bod_o_n`, `p5_e3a_bod_o_med`, `p5_e3a_kmp_m_n`, `p5_e3a_kmp_m_med`, `p5_e3a_kmp_f_n`, `p5_e3a_kmp_f_med`, `p5_e3a_kmp_o_n`, `p5_e3a_kmp_o_med`, `p5_e3a_emp_m_n`, `p5_e3a_emp_m_med`, `p5_e3a_emp_f_n`, `p5_e3a_emp_f_med`, `p5_e3a_emp_o_n`, `p5_e3a_emp_o_med`, `p5_e3a_wrk_m_n`, `p5_e3a_wrk_m_med`, `p5_e3a_wrk_f_n`, `p5_e3a_wrk_f_med`, `p5_e3a_wrk_o_n`, `p5_e3a_wrk_o_med`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Details of remuneration/salary/wages – ii. Gross wages paid to females
- **Prefix:** `p5_e3b_`
- **Codes:** `p5_e3b_cy_f`, `p5_e3b_cy_t`, `p5_e3b_py_f`, `p5_e3b_py_t`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p5_e3b_cy_f` / `p5_e3b_cy_t` → `calc_p5_pct_25` (pct); `p5_e3b_py_f` / `p5_e3b_py_t` → `calc_p5_pct_26` (pct)

### 4. Do you have a focal point (Individual/ Committee) responsible for addressing human rights impacts or issues caused or contributed to by the business?
- **Prefix:** `p5_e4_`
- **Codes:** `p5_e4_focal`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Describe the internal mechanisms in place to redress grievances related to human rights issues.
- **Prefix:** `p5_e5_`
- **Codes:** `p5_e5_mech`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 6. Number of Complaints on the following made by employees and workers
- **Prefix:** `p5_e6_`
- **Codes:** `p5_e6_sh_cy_f`, `p5_e6_sh_cy_p`, `p5_e6_sh_cy_r`, `p5_e6_sh_py_f`, `p5_e6_sh_py_p`, `p5_e6_sh_py_r`, `p5_e6_disc_cy_f`, `p5_e6_disc_cy_p`, `p5_e6_disc_cy_r`, `p5_e6_disc_py_f`, `p5_e6_disc_py_p`, `p5_e6_disc_py_r`, `p5_e6_cl_cy_f`, `p5_e6_cl_cy_p`, `p5_e6_cl_cy_r`, `p5_e6_cl_py_f`, `p5_e6_cl_py_p`, `p5_e6_cl_py_r`, `p5_e6_fl_cy_f`, `p5_e6_fl_cy_p`, `p5_e6_fl_cy_r`, `p5_e6_fl_py_f`, `p5_e6_fl_py_p`, `p5_e6_fl_py_r`, `p5_e6_wg_cy_f`, `p5_e6_wg_cy_p`, `p5_e6_wg_cy_r`, `p5_e6_wg_py_f`, `p5_e6_wg_py_p`, `p5_e6_wg_py_r`, `p5_e6_oth_cy_f`, `p5_e6_oth_cy_p`, `p5_e6_oth_cy_r`, `p5_e6_oth_py_f`, `p5_e6_oth_py_p`, `p5_e6_oth_py_r`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 7. Complaints filed under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, in the following format:
- **Prefix:** `p5_e7_`
- **Codes:** `p5_e7_tot_cy`, `p5_e7_tot_py`, `p5_e7_f_cy`, `p5_e7_f_py`, `p5_e7_up_cy`, `p5_e7_up_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p5_e7_tot_cy` / `p5_e7_f_cy` → `calc_p5_pct_27` (pct); `p5_e7_tot_py` / `p5_e7_f_py` → `calc_p5_pct_28` (pct)

### 8. Mechanisms to prevent adverse consequences to the complainant in discrimination and harassment cases.
- **Prefix:** `p5_e8_`
- **Codes:** `p5_e8_mech`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 9. Do human rights requirements form part of your business agreements and contracts?
- **Prefix:** `p5_e9_`
- **Codes:** `p5_e9_contracts`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 10. Assessment for the year
- **Prefix:** `p5_e10_`
- **Codes:** `p5_e10_cl`, `p5_e10_fl`, `p5_e10_sh`, `p5_e10_disc`, `p5_e10_wg`, `p5_e10_oth`, `p5_e10_oth_details`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 11. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 10 above.
- **Prefix:** `p5_e11_`
- **Codes:** `p5_e11_corrective`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 1. Details of a business process being modified / introduced as a result of addressing human rights grievances/complaints.
- **Prefix:** `p5_l1_`
- **Codes:** `p5_l1_process`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 2. Details of the scope and coverage of any Human rights due-diligence conducted.
- **Prefix:** `p5_l2_`
- **Codes:** `p5_l2_scope`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 3. Is the premise/office of the entity accessible to differently abled visitors, as per the requirements of the Rights of Persons with Disabilities Act, 2016?
- **Prefix:** `p5_l3_`
- **Codes:** `p5_l3_access`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 4. Details on assessment of value chain partners
- **Prefix:** `p5_l4_`
- **Codes:** `p5_l4_sh`, `p5_l4_disc`, `p5_l4_cl`, `p5_l4_fl`, `p5_l4_wg`, `p5_l4_oth`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 5. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 4 above.
- **Prefix:** `p5_l5_`
- **Codes:** `p5_l5_corrective`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p5_notes`
- **Codes:** `p5_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should respect and make efforts to protect and restore the environment. (panel id: `p6`)

Assignment blocks from `getAssignmentBlocksForPanel('p6')` (`P6_PREFIX_LABELS` / `makeP6Blocks`). Includes General Data autofill targets (`P6_AUTOFILL_*`) and many read-only intensities in `CALC_RULES`.


### 1. Total energy consumption
- **Prefix:** `p6_e1_`
- **Codes:** `p6_e1_rev_cy`, `p6_e1_rev_py`, `p6_e1_rev_ppp_cy`, `p6_e1_rev_ppp_py`, `p6_e1_applicable`, `p6_e1_assess_yn`, `p6_e1_assess_agency`, `p6_e1_re_el_cy`, `p6_e1_re_el_py`, `p6_e1_re_fuel_cy`, `p6_e1_re_fuel_py`, `p6_e1_re_oth_cy`, `p6_e1_re_oth_py`, `p6_e1_re_oth_specify`, `p6_e1_nre_el_cy`, `p6_e1_nre_el_py`, `p6_e1_nre_fuel_cy`, `p6_e1_nre_fuel_py`, `p6_e1_nre_oth_cy`, `p6_e1_nre_oth_py`, `p6_e1_nre_oth_specify`, `p6_e1_unit`, `p6_e1_int_phys_cy`, `p6_e1_int_phys_py`, `p6_e1_int_opt_cy`, `p6_e1_int_opt_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […3 ids…] → `p6_e1_re_total_cy` (sum); […3 ids…] → `p6_e1_re_total_py` (sum); […3 ids…] → `p6_e1_nre_total_cy` (sum); […3 ids…] → `p6_e1_nre_total_py` (sum); […6 ids…] → `p6_e1_total_cy` (sum); […6 ids…] → `p6_e1_total_py` (sum); `(p6_e1_re_el_cy+p6_e1_re_fuel_cy+p6_e1_re_oth_cy+p6_e1_nre_el_cy+p6_e1_nre_fuel_cy+p6_e1_nre_oth_cy)/p6_e1_rev_cy` → `p6_e1_intensity_cy` (6 dp); `(p6_e1_re_el_py+p6_e1_re_fuel_py+p6_e1_re_oth_py+p6_e1_nre_el_py+p6_e1_nre_fuel_py+p6_e1_nre_oth_py)/p6_e1_rev_py` → `p6_e1_intensity_py` (6 dp) … +2 more rules in `calcRules.ts`

### 2. PAT scheme – designated consumers (DCs)
- **Prefix:** `p6_e2_`
- **Codes:** `p6_e2_pat`, `p6_e2_targets`, `p6_e2_remedial`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Water related information
- **Prefix:** `p6_e3_`
- **Codes:** `p6_e3_rev_cy`, `p6_e3_rev_py`, `p6_e3_rev_ppp_cy`, `p6_e3_rev_ppp_py`, `p6_e3_surf_cy`, `p6_e3_surf_py`, `p6_e3_grnd_cy`, `p6_e3_grnd_py`, `p6_e3_3p_cy`, `p6_e3_3p_py`, `p6_e3_seawater_cy`, `p6_e3_seawater_py`, `p6_e3_oth_cy`, `p6_e3_oth_py`, `p6_e3_assess_yn`, `p6_e3_assess_agency`, `p6_e3_cons_cy`, `p6_e3_cons_py`, `p6_e3_int_phys_cy`, `p6_e3_int_phys_py`, `p6_e3_int_opt_cy`, `p6_e3_int_opt_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […5 ids…] → `p6_e3_with_total_cy` (sum); […5 ids…] → `p6_e3_with_total_py` (sum); `p6_e3_cons_cy/p6_e3_rev_cy` → `p6_e3_intensity_cy` (6 dp); `p6_e3_cons_py/p6_e3_rev_py` → `p6_e3_intensity_py` (6 dp); `p6_e3_cons_cy/p6_e3_rev_ppp_cy` → `p6_e3_intensity_ppp_cy` (6 dp); `p6_e3_cons_py/p6_e3_rev_ppp_py` → `p6_e3_intensity_ppp_py` (6 dp)

### 4. Provide the following details related to water discharged
- **Prefix:** `p6_e4_`
- **Codes:** `p6_e4_sw_nt_cy`, `p6_e4_sw_nt_py`, `p6_e4_sw_t_cy`, `p6_e4_sw_t_py`, `p6_e4_sw_t_level_cy`, `p6_e4_sw_t_level_py`, `p6_e4_grnd_nt_cy`, `p6_e4_grnd_nt_py`, `p6_e4_grnd_t_cy`, `p6_e4_grnd_t_py`, `p6_e4_grnd_t_level_cy`, `p6_e4_grnd_t_level_py`, `p6_e4_sea_nt_cy`, `p6_e4_sea_nt_py`, `p6_e4_sea_t_cy`, `p6_e4_sea_t_py`, `p6_e4_sea_t_level_cy`, `p6_e4_sea_t_level_py`, `p6_e4_3p_nt_cy`, `p6_e4_3p_nt_py`, `p6_e4_3p_t_cy`, `p6_e4_3p_t_py`, `p6_e4_3p_t_level_cy`, `p6_e4_3p_t_level_py`, `p6_e4_oth_nt_cy`, `p6_e4_oth_nt_py`, `p6_e4_oth_t_cy`, `p6_e4_oth_t_py`, `p6_e4_oth_t_level_cy`, `p6_e4_oth_t_level_py`, `p6_e4_oth_cy`, `p6_e4_oth_py`, `p6_e4_tot_cy`, `p6_e4_tot_py`, `p6_e4_assess_yn`, `p6_e4_assess_agency`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […10 ids…] → `p6_e4_tot_cy` (sum); […10 ids…] → `p6_e4_tot_py` (sum)

### 5. Has the entity implemented a mechanism for Zero Liquid Discharge?
- **Prefix:** `p6_e5_`
- **Codes:** `p6_e5_zld`, `p6_e5_zld_detail`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 6. Air emissions (other than GHG emissions)
- **Prefix:** `p6_e6_`
- **Codes:** `p6_e6_applicable`, `p6_e6_nox_unit`, `p6_e6_nox_cy`, `p6_e6_nox_py`, `p6_e6_sox_unit`, `p6_e6_sox_cy`, `p6_e6_sox_py`, `p6_e6_pm_unit`, `p6_e6_pm_cy`, `p6_e6_pm_py`, `p6_e6_pop_unit`, `p6_e6_pop_cy`, `p6_e6_pop_py`, `p6_e6_voc_unit`, `p6_e6_voc_cy`, `p6_e6_voc_py`, `p6_e6_hap_unit`, `p6_e6_hap_cy`, `p6_e6_hap_py`, `p6_e6_oth_unit`, `p6_e6_oth_cy`, `p6_e6_oth_py`, `p6_e6_assess_yn`, `p6_e6_assess_agency`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 7. Greenhouse gas emissions
- **Prefix:** `p6_e7_`
- **Codes:** `p6_e7_rev_cy`, `p6_e7_rev_py`, `p6_e7_rev_ppp_cy`, `p6_e7_rev_ppp_py`, `p6_e7_applicable`, `p6_e7_unit`, `p6_e7_int_opt_unit`, `p6_e7_s1_cy`, `p6_e7_s1_py`, `p6_e7_s2_cy`, `p6_e7_s2_py`, `p6_e7_int_phys_cy`, `p6_e7_int_phys_py`, `p6_e7_int_opt_cy`, `p6_e7_int_opt_py`, `p6_e7_assess_yn`, `p6_e7_assess_agency`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […2 ids…] → `p6_e7_s1s2_cy` (sum); […2 ids…] → `p6_e7_s1s2_py` (sum); `(p6_e7_s1_cy+p6_e7_s2_cy)/p6_e7_rev_cy` → `p6_e7_intensity_cy` (6 dp); `(p6_e7_s1_py+p6_e7_s2_py)/p6_e7_rev_py` → `p6_e7_intensity_py` (6 dp); `(p6_e7_s1_cy+p6_e7_s2_cy)/p6_e7_rev_ppp_cy` → `p6_e7_intensity_ppp_cy` (6 dp); `(p6_e7_s1_py+p6_e7_s2_py)/p6_e7_rev_ppp_py` → `p6_e7_intensity_ppp_py` (6 dp)

### 8. Does the entity have any project related to reducing Green House Gas emission?
- **Prefix:** `p6_e8_`
- **Codes:** `p6_e8_ghg_yn`, `p6_e8_ghg_detail`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 9. Provide details related to waste management by the entity
- **Prefix:** `p6_e9_`
- **Codes:** `p6_e9_rev_cy`, `p6_e9_rev_py`, `p6_e9_rev_ppp_cy`, `p6_e9_rev_ppp_py`, `p6_e9_plast_cy`, `p6_e9_plast_py`, `p6_e9_ew_cy`, `p6_e9_ew_py`, `p6_e9_bio_cy`, `p6_e9_bio_py`, `p6_e9_cd_cy`, `p6_e9_cd_py`, `p6_e9_batt_cy`, `p6_e9_batt_py`, `p6_e9_radio_cy`, `p6_e9_radio_py`, `p6_e9_ohaz_cy`, `p6_e9_ohaz_py`, `p6_e9_onh_cy`, `p6_e9_onh_py`, `p6_e9_int_phys_cy`, `p6_e9_int_phys_py`, `p6_e9_int_opt_cy`, `p6_e9_int_opt_py`, `p6_e9_rec_recy_cy`, `p6_e9_rec_recy_py`, `p6_e9_rec_reuse_cy`, `p6_e9_rec_reuse_py`, `p6_e9_rec_oth_cy`, `p6_e9_rec_oth_py`, `p6_e9_disp_inc_cy`, `p6_e9_disp_inc_py`, `p6_e9_disp_land_cy`, `p6_e9_disp_land_py`, `p6_e9_disp_oth_cy`, `p6_e9_disp_oth_py`, `p6_e9_assess_yn`, `p6_e9_assess_agency`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** […8 ids…] → `p6_e9_total_cy` (sum); […8 ids…] → `p6_e9_total_py` (sum); […3 ids…] → `p6_e9_rec_total_cy` (sum); […3 ids…] → `p6_e9_rec_total_py` (sum); […3 ids…] → `p6_e9_disp_total_cy` (sum); […3 ids…] → `p6_e9_disp_total_py` (sum); `(p6_e9_plast_cy+p6_e9_ew_cy+p6_e9_bio_cy+p6_e9_cd_cy+p6_e9_batt_cy+p6_e9_radio_cy+p6_e9_ohaz_cy+p6_e9_onh_cy)/p6_e9_rev_cy` → `p6_e9_intensity_cy` (6 dp); `(p6_e9_plast_py+p6_e9_ew_py+p6_e9_bio_py+p6_e9_cd_py+p6_e9_batt_py+p6_e9_radio_py+p6_e9_ohaz_py+p6_e9_onh_py)/p6_e9_rev_py` → `p6_e9_intensity_py` (6 dp) … +24 more rules in `calcRules.ts`

### 10. Waste management practices and strategy (hazardous/toxic chemicals)
- **Prefix:** `p6_e10`
- **Codes:** `p6_e10_waste`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 11. Operations in ecologically sensitive areas (environmental approvals/clearances)
- **Prefix:** `p6_e11_`
- **Codes:** `p6_e11_rowcount`, `p6_e11_1_loc`, `p6_e11_1_type`, `p6_e11_1_yn`, `p6_e11_1_correct`, `p6_e11_2_loc`, `p6_e11_2_type`, `p6_e11_2_yn`, `p6_e11_2_correct`, `p6_e11_row0_loc`, `p6_e11_row0_type`, `p6_e11_row0_yn`, `p6_e11_row0_correct`, `p6_e11_row1_loc`, `p6_e11_row1_type`, `p6_e11_row1_yn`, `p6_e11_row1_correct`, `p6_e11_row2_loc`, `p6_e11_row2_type`, `p6_e11_row2_yn`, `p6_e11_row2_correct`, `p6_e11_row3_loc`, `p6_e11_row3_type`, `p6_e11_row3_yn`, `p6_e11_row3_correct`, `p6_e11_row4_loc`, `p6_e11_row4_type`, `p6_e11_row4_yn`, `p6_e11_row4_correct`, `p6_e11_row5_loc`, `p6_e11_row5_type`, `p6_e11_row5_yn`, `p6_e11_row5_correct`, `p6_e11_row6_loc`, `p6_e11_row6_type`, `p6_e11_row6_yn`, `p6_e11_row6_correct`, `p6_e11_row7_loc`, `p6_e11_row7_type`, `p6_e11_row7_yn`, `p6_e11_row7_correct`, `p6_e11_row8_loc`, `p6_e11_row8_type`, `p6_e11_row8_yn`, `p6_e11_row8_correct`, `p6_e11_row9_loc`, `p6_e11_row9_type`, `p6_e11_row9_yn`, `p6_e11_row9_correct`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 12. Details of environmental impact assessments of projects (current FY)
- **Prefix:** `p6_e12_`
- **Codes:** `p6_e12_rowcount`, `p6_e12_name`, `p6_e12_notif`, `p6_e12_date`, `p6_e12_ind`, `p6_e12_pub`, `p6_e12_link`, `p6_e12_row0_name`, `p6_e12_row0_notif`, `p6_e12_row0_date`, `p6_e12_row0_ind`, `p6_e12_row0_pub`, `p6_e12_row0_link`, `p6_e12_row1_name`, `p6_e12_row1_notif`, `p6_e12_row1_date`, `p6_e12_row1_ind`, `p6_e12_row1_pub`, `p6_e12_row1_link`, `p6_e12_row2_name`, `p6_e12_row2_notif`, `p6_e12_row2_date`, `p6_e12_row2_ind`, `p6_e12_row2_pub`, `p6_e12_row2_link`, `p6_e12_row3_name`, `p6_e12_row3_notif`, `p6_e12_row3_date`, `p6_e12_row3_ind`, `p6_e12_row3_pub`, `p6_e12_row3_link`, `p6_e12_row4_name`, `p6_e12_row4_notif`, `p6_e12_row4_date`, `p6_e12_row4_ind`, `p6_e12_row4_pub`, `p6_e12_row4_link`, `p6_e12_row5_name`, `p6_e12_row5_notif`, `p6_e12_row5_date`, `p6_e12_row5_ind`, `p6_e12_row5_pub`, `p6_e12_row5_link`, `p6_e12_row6_name`, `p6_e12_row6_notif`, `p6_e12_row6_date`, `p6_e12_row6_ind`, `p6_e12_row6_pub`, `p6_e12_row6_link`, `p6_e12_row7_name`, `p6_e12_row7_notif`, `p6_e12_row7_date`, `p6_e12_row7_ind`, `p6_e12_row7_pub`, `p6_e12_row7_link`, `p6_e12_row8_name`, `p6_e12_row8_notif`, `p6_e12_row8_date`, `p6_e12_row8_ind`, `p6_e12_row8_pub`, `p6_e12_row8_link`, `p6_e12_row9_name`, `p6_e12_row9_notif`, `p6_e12_row9_date`, `p6_e12_row9_ind`, `p6_e12_row9_pub`, `p6_e12_row9_link`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 13. Applicable environmental law/regulations/guidelines in India
- **Prefix:** `p6_e13_`
- **Codes:** `p6_e13_comp`, `p6_e13_rowcount`, `p6_e13_law`, `p6_e13_detail`, `p6_e13_fines`, `p6_e13_correct`, `p6_e13_row0_law`, `p6_e13_row0_detail`, `p6_e13_row0_fines`, `p6_e13_row0_correct`, `p6_e13_row1_law`, `p6_e13_row1_detail`, `p6_e13_row1_fines`, `p6_e13_row1_correct`, `p6_e13_row2_law`, `p6_e13_row2_detail`, `p6_e13_row2_fines`, `p6_e13_row2_correct`, `p6_e13_row3_law`, `p6_e13_row3_detail`, `p6_e13_row3_fines`, `p6_e13_row3_correct`, `p6_e13_row4_law`, `p6_e13_row4_detail`, `p6_e13_row4_fines`, `p6_e13_row4_correct`, `p6_e13_row5_law`, `p6_e13_row5_detail`, `p6_e13_row5_fines`, `p6_e13_row5_correct`, `p6_e13_row6_law`, `p6_e13_row6_detail`, `p6_e13_row6_fines`, `p6_e13_row6_correct`, `p6_e13_row7_law`, `p6_e13_row7_detail`, `p6_e13_row7_fines`, `p6_e13_row7_correct`, `p6_e13_row8_law`, `p6_e13_row8_detail`, `p6_e13_row8_fines`, `p6_e13_row8_correct`, `p6_e13_row9_law`, `p6_e13_row9_detail`, `p6_e13_row9_fines`, `p6_e13_row9_correct`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 1. Water withdrawal, consumption and discharge in areas of water stress
- **Prefix:** `p6_l1_`
- **Codes:** `p6_l1_rowcount`, `p6_l1_assess_yn`, `p6_l1_assess_agency`, `p6_l1_area_cy`, `p6_l1_area_py`, `p6_l1_with_cy`, `p6_l1_with_py`, `p6_l1_cons_cy`, `p6_l1_cons_py`, `p6_l1_disp_cy`, `p6_l1_disp_py`, `p6_l1_row0_area`, `p6_l1_row0_nature`, `p6_l1_row0_surf_cy`, `p6_l1_row0_surf_py`, `p6_l1_row0_grnd_cy`, `p6_l1_row0_grnd_py`, `p6_l1_row0_third_cy`, `p6_l1_row0_third_py`, `p6_l1_row0_sea_cy`, `p6_l1_row0_sea_py`, `p6_l1_row0_oth_cy`, `p6_l1_row0_oth_py`, `p6_l1_row0_cons_cy`, `p6_l1_row0_cons_py`, `p6_l1_row0_int_opt_cy`, `p6_l1_row0_int_opt_py`, `p6_l1_row0_surf_a_nt_cy`, `p6_l1_row0_surf_a_nt_py`, `p6_l1_row0_surf_a_t_lev_cy`, `p6_l1_row0_surf_a_t_lev_py`, `p6_l1_row0_surf_a_t_val_cy`, `p6_l1_row0_surf_a_t_val_py`, `p6_l1_row0_grnd_b_nt_cy`, `p6_l1_row0_grnd_b_nt_py`, `p6_l1_row0_grnd_b_t_lev_cy`, `p6_l1_row0_grnd_b_t_lev_py`, `p6_l1_row0_grnd_b_t_val_cy`, `p6_l1_row0_grnd_b_t_val_py`, `p6_l1_row0_sea_c_nt_cy`, `p6_l1_row0_sea_c_nt_py`, `p6_l1_row0_sea_c_t_lev_cy`, `p6_l1_row0_sea_c_t_lev_py`, `p6_l1_row0_sea_c_t_val_cy`, `p6_l1_row0_sea_c_t_val_py`, `p6_l1_row0_third_d_nt_cy`, `p6_l1_row0_third_d_nt_py`, `p6_l1_row0_third_d_t_lev_cy`, `p6_l1_row0_third_d_t_lev_py`, `p6_l1_row0_third_d_t_val_cy`, `p6_l1_row0_third_d_t_val_py`, `p6_l1_row0_oth_e_nt_cy`, `p6_l1_row0_oth_e_nt_py`, `p6_l1_row0_oth_e_t_lev_cy`, `p6_l1_row0_oth_e_t_lev_py`, `p6_l1_row0_oth_e_t_val_cy`, `p6_l1_row0_oth_e_t_val_py`, `p6_l1_row1_area`, `p6_l1_row1_nature`, `p6_l1_row1_surf_cy`, `p6_l1_row1_surf_py`, `p6_l1_row1_grnd_cy`, `p6_l1_row1_grnd_py`, `p6_l1_row1_third_cy`, `p6_l1_row1_third_py`, `p6_l1_row1_sea_cy`, `p6_l1_row1_sea_py`, `p6_l1_row1_oth_cy`, `p6_l1_row1_oth_py`, `p6_l1_row1_cons_cy`, `p6_l1_row1_cons_py`, `p6_l1_row1_int_opt_cy`, `p6_l1_row1_int_opt_py`, `p6_l1_row1_surf_a_nt_cy`, `p6_l1_row1_surf_a_nt_py`, `p6_l1_row1_surf_a_t_lev_cy`, `p6_l1_row1_surf_a_t_lev_py`, `p6_l1_row1_surf_a_t_val_cy`, `p6_l1_row1_surf_a_t_val_py`, `p6_l1_row1_grnd_b_nt_cy`, `p6_l1_row1_grnd_b_nt_py`, `p6_l1_row1_grnd_b_t_lev_cy`, `p6_l1_row1_grnd_b_t_lev_py`, `p6_l1_row1_grnd_b_t_val_cy`, `p6_l1_row1_grnd_b_t_val_py`, `p6_l1_row1_sea_c_nt_cy`, `p6_l1_row1_sea_c_nt_py`, `p6_l1_row1_sea_c_t_lev_cy`, `p6_l1_row1_sea_c_t_lev_py`, `p6_l1_row1_sea_c_t_val_cy`, `p6_l1_row1_sea_c_t_val_py`, `p6_l1_row1_third_d_nt_cy`, `p6_l1_row1_third_d_nt_py`, `p6_l1_row1_third_d_t_lev_cy`, `p6_l1_row1_third_d_t_lev_py`, `p6_l1_row1_third_d_t_val_cy`, `p6_l1_row1_third_d_t_val_py`, `p6_l1_row1_oth_e_nt_cy`, `p6_l1_row1_oth_e_nt_py`, `p6_l1_row1_oth_e_t_lev_cy`, `p6_l1_row1_oth_e_t_lev_py`, `p6_l1_row1_oth_e_t_val_cy`, `p6_l1_row1_oth_e_t_val_py`, `p6_l1_row2_area`, `p6_l1_row2_nature`, `p6_l1_row2_surf_cy`, `p6_l1_row2_surf_py`, `p6_l1_row2_grnd_cy`, `p6_l1_row2_grnd_py`, `p6_l1_row2_third_cy`, `p6_l1_row2_third_py`, `p6_l1_row2_sea_cy`, `p6_l1_row2_sea_py`, `p6_l1_row2_oth_cy`, `p6_l1_row2_oth_py`, `p6_l1_row2_cons_cy`, `p6_l1_row2_cons_py`, `p6_l1_row2_int_opt_cy`, `p6_l1_row2_int_opt_py`, `p6_l1_row2_surf_a_nt_cy`, `p6_l1_row2_surf_a_nt_py`, `p6_l1_row2_surf_a_t_lev_cy`, `p6_l1_row2_surf_a_t_lev_py`, `p6_l1_row2_surf_a_t_val_cy`, `p6_l1_row2_surf_a_t_val_py`, `p6_l1_row2_grnd_b_nt_cy`, `p6_l1_row2_grnd_b_nt_py`, `p6_l1_row2_grnd_b_t_lev_cy`, `p6_l1_row2_grnd_b_t_lev_py`, `p6_l1_row2_grnd_b_t_val_cy`, `p6_l1_row2_grnd_b_t_val_py`, `p6_l1_row2_sea_c_nt_cy`, `p6_l1_row2_sea_c_nt_py`, `p6_l1_row2_sea_c_t_lev_cy`, `p6_l1_row2_sea_c_t_lev_py`, `p6_l1_row2_sea_c_t_val_cy`, `p6_l1_row2_sea_c_t_val_py`, `p6_l1_row2_third_d_nt_cy`, `p6_l1_row2_third_d_nt_py`, `p6_l1_row2_third_d_t_lev_cy`, `p6_l1_row2_third_d_t_lev_py`, `p6_l1_row2_third_d_t_val_cy`, `p6_l1_row2_third_d_t_val_py`, `p6_l1_row2_oth_e_nt_cy`, `p6_l1_row2_oth_e_nt_py`, `p6_l1_row2_oth_e_t_lev_cy`, `p6_l1_row2_oth_e_t_lev_py`, `p6_l1_row2_oth_e_t_val_cy`, `p6_l1_row2_oth_e_t_val_py`, `p6_l1_row3_area`, `p6_l1_row3_nature`, `p6_l1_row3_surf_cy`, `p6_l1_row3_surf_py`, `p6_l1_row3_grnd_cy`, `p6_l1_row3_grnd_py`, `p6_l1_row3_third_cy`, `p6_l1_row3_third_py`, `p6_l1_row3_sea_cy`, `p6_l1_row3_sea_py`, `p6_l1_row3_oth_cy`, `p6_l1_row3_oth_py`, `p6_l1_row3_cons_cy`, `p6_l1_row3_cons_py`, `p6_l1_row3_int_opt_cy`, `p6_l1_row3_int_opt_py`, `p6_l1_row3_surf_a_nt_cy`, `p6_l1_row3_surf_a_nt_py`, `p6_l1_row3_surf_a_t_lev_cy`, `p6_l1_row3_surf_a_t_lev_py`, `p6_l1_row3_surf_a_t_val_cy`, `p6_l1_row3_surf_a_t_val_py`, `p6_l1_row3_grnd_b_nt_cy`, `p6_l1_row3_grnd_b_nt_py`, `p6_l1_row3_grnd_b_t_lev_cy`, `p6_l1_row3_grnd_b_t_lev_py`, `p6_l1_row3_grnd_b_t_val_cy`, `p6_l1_row3_grnd_b_t_val_py`, `p6_l1_row3_sea_c_nt_cy`, `p6_l1_row3_sea_c_nt_py`, `p6_l1_row3_sea_c_t_lev_cy`, `p6_l1_row3_sea_c_t_lev_py`, `p6_l1_row3_sea_c_t_val_cy`, `p6_l1_row3_sea_c_t_val_py`, `p6_l1_row3_third_d_nt_cy`, `p6_l1_row3_third_d_nt_py`, `p6_l1_row3_third_d_t_lev_cy`, `p6_l1_row3_third_d_t_lev_py`, `p6_l1_row3_third_d_t_val_cy`, `p6_l1_row3_third_d_t_val_py`, `p6_l1_row3_oth_e_nt_cy`, `p6_l1_row3_oth_e_nt_py`, `p6_l1_row3_oth_e_t_lev_cy`, `p6_l1_row3_oth_e_t_lev_py`, `p6_l1_row3_oth_e_t_val_cy`, `p6_l1_row3_oth_e_t_val_py`, `p6_l1_row4_area`, `p6_l1_row4_nature`, `p6_l1_row4_surf_cy`, `p6_l1_row4_surf_py`, `p6_l1_row4_grnd_cy`, `p6_l1_row4_grnd_py`, `p6_l1_row4_third_cy`, `p6_l1_row4_third_py`, `p6_l1_row4_sea_cy`, `p6_l1_row4_sea_py`, `p6_l1_row4_oth_cy`, `p6_l1_row4_oth_py`, `p6_l1_row4_cons_cy`, `p6_l1_row4_cons_py`, `p6_l1_row4_int_opt_cy`, `p6_l1_row4_int_opt_py`, `p6_l1_row4_surf_a_nt_cy`, `p6_l1_row4_surf_a_nt_py`, `p6_l1_row4_surf_a_t_lev_cy`, `p6_l1_row4_surf_a_t_lev_py`, `p6_l1_row4_surf_a_t_val_cy`, `p6_l1_row4_surf_a_t_val_py`, `p6_l1_row4_grnd_b_nt_cy`, `p6_l1_row4_grnd_b_nt_py`, `p6_l1_row4_grnd_b_t_lev_cy`, `p6_l1_row4_grnd_b_t_lev_py`, `p6_l1_row4_grnd_b_t_val_cy`, `p6_l1_row4_grnd_b_t_val_py`, `p6_l1_row4_sea_c_nt_cy`, `p6_l1_row4_sea_c_nt_py`, `p6_l1_row4_sea_c_t_lev_cy`, `p6_l1_row4_sea_c_t_lev_py`, `p6_l1_row4_sea_c_t_val_cy`, `p6_l1_row4_sea_c_t_val_py`, `p6_l1_row4_third_d_nt_cy`, `p6_l1_row4_third_d_nt_py`, `p6_l1_row4_third_d_t_lev_cy`, `p6_l1_row4_third_d_t_lev_py`, `p6_l1_row4_third_d_t_val_cy`, `p6_l1_row4_third_d_t_val_py`, `p6_l1_row4_oth_e_nt_cy`, `p6_l1_row4_oth_e_nt_py`, `p6_l1_row4_oth_e_t_lev_cy`, `p6_l1_row4_oth_e_t_lev_py`, `p6_l1_row4_oth_e_t_val_cy`, `p6_l1_row4_oth_e_t_val_py`, `p6_l1_row5_area`, `p6_l1_row5_nature`, `p6_l1_row5_surf_cy`, `p6_l1_row5_surf_py`, `p6_l1_row5_grnd_cy`, `p6_l1_row5_grnd_py`, `p6_l1_row5_third_cy`, `p6_l1_row5_third_py`, `p6_l1_row5_sea_cy`, `p6_l1_row5_sea_py`, `p6_l1_row5_oth_cy`, `p6_l1_row5_oth_py`, `p6_l1_row5_cons_cy`, `p6_l1_row5_cons_py`, `p6_l1_row5_int_opt_cy`, `p6_l1_row5_int_opt_py`, `p6_l1_row5_surf_a_nt_cy`, `p6_l1_row5_surf_a_nt_py`, `p6_l1_row5_surf_a_t_lev_cy`, `p6_l1_row5_surf_a_t_lev_py`, `p6_l1_row5_surf_a_t_val_cy`, `p6_l1_row5_surf_a_t_val_py`, `p6_l1_row5_grnd_b_nt_cy`, `p6_l1_row5_grnd_b_nt_py`, `p6_l1_row5_grnd_b_t_lev_cy`, `p6_l1_row5_grnd_b_t_lev_py`, `p6_l1_row5_grnd_b_t_val_cy`, `p6_l1_row5_grnd_b_t_val_py`, `p6_l1_row5_sea_c_nt_cy`, `p6_l1_row5_sea_c_nt_py`, `p6_l1_row5_sea_c_t_lev_cy`, `p6_l1_row5_sea_c_t_lev_py`, `p6_l1_row5_sea_c_t_val_cy`, `p6_l1_row5_sea_c_t_val_py`, `p6_l1_row5_third_d_nt_cy`, `p6_l1_row5_third_d_nt_py`, `p6_l1_row5_third_d_t_lev_cy`, `p6_l1_row5_third_d_t_lev_py`, `p6_l1_row5_third_d_t_val_cy`, `p6_l1_row5_third_d_t_val_py`, `p6_l1_row5_oth_e_nt_cy`, `p6_l1_row5_oth_e_nt_py`, `p6_l1_row5_oth_e_t_lev_cy`, `p6_l1_row5_oth_e_t_lev_py`, `p6_l1_row5_oth_e_t_val_cy`, `p6_l1_row5_oth_e_t_val_py`, `p6_l1_row6_area`, `p6_l1_row6_nature`, `p6_l1_row6_surf_cy`, `p6_l1_row6_surf_py`, `p6_l1_row6_grnd_cy`, `p6_l1_row6_grnd_py`, `p6_l1_row6_third_cy`, `p6_l1_row6_third_py`, `p6_l1_row6_sea_cy`, `p6_l1_row6_sea_py`, `p6_l1_row6_oth_cy`, `p6_l1_row6_oth_py`, `p6_l1_row6_cons_cy`, `p6_l1_row6_cons_py`, `p6_l1_row6_int_opt_cy`, `p6_l1_row6_int_opt_py`, `p6_l1_row6_surf_a_nt_cy`, `p6_l1_row6_surf_a_nt_py`, `p6_l1_row6_surf_a_t_lev_cy`, `p6_l1_row6_surf_a_t_lev_py`, `p6_l1_row6_surf_a_t_val_cy`, `p6_l1_row6_surf_a_t_val_py`, `p6_l1_row6_grnd_b_nt_cy`, `p6_l1_row6_grnd_b_nt_py`, `p6_l1_row6_grnd_b_t_lev_cy`, `p6_l1_row6_grnd_b_t_lev_py`, `p6_l1_row6_grnd_b_t_val_cy`, `p6_l1_row6_grnd_b_t_val_py`, `p6_l1_row6_sea_c_nt_cy`, `p6_l1_row6_sea_c_nt_py`, `p6_l1_row6_sea_c_t_lev_cy`, `p6_l1_row6_sea_c_t_lev_py`, `p6_l1_row6_sea_c_t_val_cy`, `p6_l1_row6_sea_c_t_val_py`, `p6_l1_row6_third_d_nt_cy`, `p6_l1_row6_third_d_nt_py`, `p6_l1_row6_third_d_t_lev_cy`, `p6_l1_row6_third_d_t_lev_py`, `p6_l1_row6_third_d_t_val_cy`, `p6_l1_row6_third_d_t_val_py`, `p6_l1_row6_oth_e_nt_cy`, `p6_l1_row6_oth_e_nt_py`, `p6_l1_row6_oth_e_t_lev_cy`, `p6_l1_row6_oth_e_t_lev_py`, `p6_l1_row6_oth_e_t_val_cy`, `p6_l1_row6_oth_e_t_val_py`, `p6_l1_row7_area`, `p6_l1_row7_nature`, `p6_l1_row7_surf_cy`, `p6_l1_row7_surf_py`, `p6_l1_row7_grnd_cy`, `p6_l1_row7_grnd_py`, `p6_l1_row7_third_cy`, `p6_l1_row7_third_py`, `p6_l1_row7_sea_cy`, `p6_l1_row7_sea_py`, `p6_l1_row7_oth_cy`, `p6_l1_row7_oth_py`, `p6_l1_row7_cons_cy`, `p6_l1_row7_cons_py`, `p6_l1_row7_int_opt_cy`, `p6_l1_row7_int_opt_py`, `p6_l1_row7_surf_a_nt_cy`, `p6_l1_row7_surf_a_nt_py`, `p6_l1_row7_surf_a_t_lev_cy`, `p6_l1_row7_surf_a_t_lev_py`, `p6_l1_row7_surf_a_t_val_cy`, `p6_l1_row7_surf_a_t_val_py`, `p6_l1_row7_grnd_b_nt_cy`, `p6_l1_row7_grnd_b_nt_py`, `p6_l1_row7_grnd_b_t_lev_cy`, `p6_l1_row7_grnd_b_t_lev_py`, `p6_l1_row7_grnd_b_t_val_cy`, `p6_l1_row7_grnd_b_t_val_py`, `p6_l1_row7_sea_c_nt_cy`, `p6_l1_row7_sea_c_nt_py`, `p6_l1_row7_sea_c_t_lev_cy`, `p6_l1_row7_sea_c_t_lev_py`, `p6_l1_row7_sea_c_t_val_cy`, `p6_l1_row7_sea_c_t_val_py`, `p6_l1_row7_third_d_nt_cy`, `p6_l1_row7_third_d_nt_py`, `p6_l1_row7_third_d_t_lev_cy`, `p6_l1_row7_third_d_t_lev_py`, `p6_l1_row7_third_d_t_val_cy`, `p6_l1_row7_third_d_t_val_py`, `p6_l1_row7_oth_e_nt_cy`, `p6_l1_row7_oth_e_nt_py`, `p6_l1_row7_oth_e_t_lev_cy`, `p6_l1_row7_oth_e_t_lev_py`, `p6_l1_row7_oth_e_t_val_cy`, `p6_l1_row7_oth_e_t_val_py`, `p6_l1_row8_area`, `p6_l1_row8_nature`, `p6_l1_row8_surf_cy`, `p6_l1_row8_surf_py`, `p6_l1_row8_grnd_cy`, `p6_l1_row8_grnd_py`, `p6_l1_row8_third_cy`, `p6_l1_row8_third_py`, `p6_l1_row8_sea_cy`, `p6_l1_row8_sea_py`, `p6_l1_row8_oth_cy`, `p6_l1_row8_oth_py`, `p6_l1_row8_cons_cy`, `p6_l1_row8_cons_py`, `p6_l1_row8_int_opt_cy`, `p6_l1_row8_int_opt_py`, `p6_l1_row8_surf_a_nt_cy`, `p6_l1_row8_surf_a_nt_py`, `p6_l1_row8_surf_a_t_lev_cy`, `p6_l1_row8_surf_a_t_lev_py`, `p6_l1_row8_surf_a_t_val_cy`, `p6_l1_row8_surf_a_t_val_py`, `p6_l1_row8_grnd_b_nt_cy`, `p6_l1_row8_grnd_b_nt_py`, `p6_l1_row8_grnd_b_t_lev_cy`, `p6_l1_row8_grnd_b_t_lev_py`, `p6_l1_row8_grnd_b_t_val_cy`, `p6_l1_row8_grnd_b_t_val_py`, `p6_l1_row8_sea_c_nt_cy`, `p6_l1_row8_sea_c_nt_py`, `p6_l1_row8_sea_c_t_lev_cy`, `p6_l1_row8_sea_c_t_lev_py`, `p6_l1_row8_sea_c_t_val_cy`, `p6_l1_row8_sea_c_t_val_py`, `p6_l1_row8_third_d_nt_cy`, `p6_l1_row8_third_d_nt_py`, `p6_l1_row8_third_d_t_lev_cy`, `p6_l1_row8_third_d_t_lev_py`, `p6_l1_row8_third_d_t_val_cy`, `p6_l1_row8_third_d_t_val_py`, `p6_l1_row8_oth_e_nt_cy`, `p6_l1_row8_oth_e_nt_py`, `p6_l1_row8_oth_e_t_lev_cy`, `p6_l1_row8_oth_e_t_lev_py`, `p6_l1_row8_oth_e_t_val_cy`, `p6_l1_row8_oth_e_t_val_py`, `p6_l1_row9_area`, `p6_l1_row9_nature`, `p6_l1_row9_surf_cy`, `p6_l1_row9_surf_py`, `p6_l1_row9_grnd_cy`, `p6_l1_row9_grnd_py`, `p6_l1_row9_third_cy`, `p6_l1_row9_third_py`, `p6_l1_row9_sea_cy`, `p6_l1_row9_sea_py`, `p6_l1_row9_oth_cy`, `p6_l1_row9_oth_py`, `p6_l1_row9_cons_cy`, `p6_l1_row9_cons_py`, `p6_l1_row9_int_opt_cy`, `p6_l1_row9_int_opt_py`, `p6_l1_row9_surf_a_nt_cy`, `p6_l1_row9_surf_a_nt_py`, `p6_l1_row9_surf_a_t_lev_cy`, `p6_l1_row9_surf_a_t_lev_py`, `p6_l1_row9_surf_a_t_val_cy`, `p6_l1_row9_surf_a_t_val_py`, `p6_l1_row9_grnd_b_nt_cy`, `p6_l1_row9_grnd_b_nt_py`, `p6_l1_row9_grnd_b_t_lev_cy`, `p6_l1_row9_grnd_b_t_lev_py`, `p6_l1_row9_grnd_b_t_val_cy`, `p6_l1_row9_grnd_b_t_val_py`, `p6_l1_row9_sea_c_nt_cy`, `p6_l1_row9_sea_c_nt_py`, `p6_l1_row9_sea_c_t_lev_cy`, `p6_l1_row9_sea_c_t_lev_py`, `p6_l1_row9_sea_c_t_val_cy`, `p6_l1_row9_sea_c_t_val_py`, `p6_l1_row9_third_d_nt_cy`, `p6_l1_row9_third_d_nt_py`, `p6_l1_row9_third_d_t_lev_cy`, `p6_l1_row9_third_d_t_lev_py`, `p6_l1_row9_third_d_t_val_cy`, `p6_l1_row9_third_d_t_val_py`, `p6_l1_row9_oth_e_nt_cy`, `p6_l1_row9_oth_e_nt_py`, `p6_l1_row9_oth_e_t_lev_cy`, `p6_l1_row9_oth_e_t_lev_py`, `p6_l1_row9_oth_e_t_val_cy`, `p6_l1_row9_oth_e_t_val_py`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** […5 ids…] → `p6_l1_row0_total_with_cy` (sum); […5 ids…] → `p6_l1_row0_total_with_py` (sum); […10 ids…] → `p6_l1_row0_total_disp_cy` (sum); […10 ids…] → `p6_l1_row0_total_disp_py` (sum); `p6_l1_row0_cons_cy/p6_e9_rev_cy` → `p6_l1_row0_intensity_cy` (6 dp); `p6_l1_row0_cons_py/p6_e9_rev_py` → `p6_l1_row0_intensity_py` (6 dp); […5 ids…] → `p6_l1_row1_total_with_cy` (sum); […5 ids…] → `p6_l1_row1_total_with_py` (sum) … +52 more rules in `calcRules.ts`

### Leadership 2. Total Scope 3 emissions
- **Prefix:** `p6_l2_`
- **Codes:** `p6_l2_applicable`, `p6_l2_unit`, `p6_l2_int_opt_unit`, `p6_l2_assess_yn`, `p6_l2_assess_agency`, `p6_l2_s3_cy`, `p6_l2_s3_py`, `p6_l2_int_cy`, `p6_l2_int_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p6_l2_s3_cy/p6_e9_rev_cy` → `p6_l2_intensity_cy` (6 dp); `p6_l2_s3_py/p6_e9_rev_py` → `p6_l2_intensity_py` (6 dp)

### Leadership 3. Biodiversity impact in ecologically sensitive areas
- **Prefix:** `p6_l3_`
- **Codes:** `p6_l3_bio`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 4. Initiatives and innovative technology
- **Prefix:** `p6_l4_`
- **Codes:** `p6_l4_rowcount`, `p6_l4_init`, `p6_l4_detail`, `p6_l4_outcome`, `p6_l4_row0_init`, `p6_l4_row0_detail`, `p6_l4_row0_outcome`, `p6_l4_row0_correct`, `p6_l4_row1_init`, `p6_l4_row1_detail`, `p6_l4_row1_outcome`, `p6_l4_row1_correct`, `p6_l4_row2_init`, `p6_l4_row2_detail`, `p6_l4_row2_outcome`, `p6_l4_row2_correct`, `p6_l4_row3_init`, `p6_l4_row3_detail`, `p6_l4_row3_outcome`, `p6_l4_row3_correct`, `p6_l4_row4_init`, `p6_l4_row4_detail`, `p6_l4_row4_outcome`, `p6_l4_row4_correct`, `p6_l4_row5_init`, `p6_l4_row5_detail`, `p6_l4_row5_outcome`, `p6_l4_row5_correct`, `p6_l4_row6_init`, `p6_l4_row6_detail`, `p6_l4_row6_outcome`, `p6_l4_row6_correct`, `p6_l4_row7_init`, `p6_l4_row7_detail`, `p6_l4_row7_outcome`, `p6_l4_row7_correct`, `p6_l4_row8_init`, `p6_l4_row8_detail`, `p6_l4_row8_outcome`, `p6_l4_row8_correct`, `p6_l4_row9_init`, `p6_l4_row9_detail`, `p6_l4_row9_outcome`, `p6_l4_row9_correct`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 5. Business continuity and disaster management plan
- **Prefix:** `p6_l5_`
- **Codes:** `p6_l5_yn`, `p6_l5_bcp`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 6. Value chain adverse impact mitigation
- **Prefix:** `p6_l6_`
- **Codes:** `p6_l6_value`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 7. % value chain partners assessed
- **Prefix:** `p6_l7_`
- **Codes:** `p6_l7_pct`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 8. Green Credits
- **Prefix:** `p6_l8_`
- **Codes:** `p6_l8_generated`, `p6_l8_procured`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p6_notes`
- **Codes:** `p6_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Principle 6 — autofill and revenue fields

- **Source inputs (General Data):** `gdata_turnover_cy`, `gdata_turnover_py`, `gdata_ppp_cy`, `gdata_ppp_py`
- **Autofill targets:** all codes in `P6_AUTOFILL_REV_IDS` and `P6_AUTOFILL_REV_PPP_IDS` (`questionCodes.ts`) — copied into `answers` as normal user-visible values.

---

## Businesses, when engaging in influencing public and regulatory policy, should do so in a responsible manner. (panel id: `p7`)

Assignment blocks from `getStaticPrincipleBlocks(7, …)` / `getAssignmentBlocksForPanel('p7')`.

### 1. Trade and industry chambers / associations – i. Number of affiliations with trade and industry chambers / associations
- **Prefix:** `p7_e1a_`
- **Codes:** `p7_e1a_count`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 1. Trade and industry chambers / associations – ii. List the top 10 trade and industry chambers/ associations (determined based on the total members of such body) the entity is a member of/ affiliated to.
- **Prefix:** `p7_e1b_`
- **Codes:** `p7_e1b_1_name`, `p7_e1b_1_reach`, `p7_e1b_2_name`, `p7_e1b_2_reach`, `p7_e1b_3_name`, `p7_e1b_3_reach`, `p7_e1b_4_name`, `p7_e1b_4_reach`, `p7_e1b_5_name`, `p7_e1b_5_reach`, `p7_e1b_6_name`, `p7_e1b_6_reach`, `p7_e1b_7_name`, `p7_e1b_7_reach`, `p7_e1b_8_name`, `p7_e1b_8_reach`, `p7_e1b_9_name`, `p7_e1b_9_reach`, `p7_e1b_10_name`, `p7_e1b_10_reach`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Provide details of corrective action taken or underway on any issues related to Anti-competitive conduct by the entity, based on adverse orders from regulatory authorities.
- **Prefix:** `p7_e2_`
- **Codes:** `p7_e2_auth`, `p7_e2_brief`, `p7_e2_action`, `p7_e2_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 1. Details of public policy positions advocated by the entity.
- **Prefix:** `p7_l1_row`
- **Codes:** `p7_l1_row0_policy`, `p7_l1_row0_method`, `p7_l1_row0_freq`, `p7_l1_row0_public`, `p7_l1_row0_link`, `p7_l1_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p7_notes`
- **Codes:** `p7_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should promote inclusive growth and equitable development. (panel id: `p8`)

Assignment blocks from `getStaticPrincipleBlocks(8, …)` / `getAssignmentBlocksForPanel('p8')`.

### 1. Details of Social Impact Assessments (SIA) of projects undertaken by the Company based on applicable laws, in the current financial year.
- **Prefix:** `p8_e1_`
- **Codes:** `p8_e1_name`, `p8_e1_notif`, `p8_e1_date`, `p8_e1_ind`, `p8_e1_pub`, `p8_e1_link`, `p8_e1_rowcount`
- **Type:** table (multi-record)
- **If table:** Template row: `p8_e1_name`, …; added rows: `p8_e1_row{k}_*` for `k >= 1`; `p8_e1_rowcount`. Dynamic codes may exist only in `answers` (see `docs/prefix-sync.md`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Provide information on project(s) for which ongoing Rehabilitation and Resettlement (R&R) is being undertaken by your entity.
- **Prefix:** `p8_e2_row`
- **Codes:** `p8_e2_row0_name`, `p8_e2_row0_state`, `p8_e2_row0_dist`, `p8_e2_row0_paf`, `p8_e2_row0_pct`, `p8_e2_row0_amt`, `p8_e2_rowcount`
- **Type:** table (multi-record)
- **If table:** Rows: `p8_e2_row{i}_*` for `i >= 0`; `p8_e2_rowcount`.
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Describe the mechanisms to receive and redress grievances of the community.
- **Prefix:** `p8_e3_`
- **Codes:** `p8_e3_griev`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Percentage of input material (inputs to total inputs by value) sourced from suppliers.
- **Prefix:** `p8_e4_`
- **Codes:** `p8_e4_msme_cy`, `p8_e4_msme_py`, `p8_e4_india_cy`, `p8_e4_india_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Job creation in smaller towns - Disclose wages paid to persons employed (including employees or workers employed on a permanent or non-permanent / on contract basis) in the following locations, as % of total wage cost
- **Prefix:** `p8_e5_`
- **Codes:** `p8_e5_rural_w_cy`, `p8_e5_rural_t_cy`, `p8_e5_rural_w_py`, `p8_e5_rural_t_py`, `p8_e5_semi_w_cy`, `p8_e5_semi_t_cy`, `p8_e5_semi_w_py`, `p8_e5_semi_t_py`, `p8_e5_urb_w_cy`, `p8_e5_urb_t_cy`, `p8_e5_urb_w_py`, `p8_e5_urb_t_py`, `p8_e5_metro_w_cy`, `p8_e5_metro_t_cy`, `p8_e5_metro_w_py`, `p8_e5_metro_t_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** `p8_e5_rural_w_cy` / `p8_e5_rural_t_cy` → `calc_p8_pct_1` (pct); `p8_e5_rural_w_py` / `p8_e5_rural_t_py` → `calc_p8_pct_2` (pct); `p8_e5_semi_w_cy` / `p8_e5_semi_t_cy` → `calc_p8_pct_3` (pct); `p8_e5_semi_w_py` / `p8_e5_semi_t_py` → `calc_p8_pct_4` (pct); `p8_e5_urb_w_cy` / `p8_e5_urb_t_cy` → `calc_p8_pct_5` (pct); `p8_e5_urb_w_py` / `p8_e5_urb_t_py` → `calc_p8_pct_6` (pct); `p8_e5_metro_w_cy` / `p8_e5_metro_t_cy` → `calc_p8_pct_7` (pct); `p8_e5_metro_w_py` / `p8_e5_metro_t_py` → `calc_p8_pct_8` (pct)

### Leadership 1. Provide details of actions taken to mitigate any negative social impacts identified in the Social Impact Assessments. (Reference: Question 1 of Essential Indicators above)
- **Prefix:** `p8_l1_`
- **Codes:** `p8_l1_impact`, `p8_l1_action`, `p8_l1_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 2. Provide the following information on CSR projects undertaken by your entity in designated aspirational districts as identified by government bodies.
- **Prefix:** `p8_l2_row`
- **Codes:** `p8_l2_row0_state`, `p8_l2_row0_dist`, `p8_l2_row0_amt`, `p8_l2_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 3. Preferential procurement from marginalized/vulnerable groups
- **Prefix:** `p8_l3_`
- **Codes:** `p8_l3_yn`, `p8_l3_groups`, `p8_l3_pct`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 4. Details of the benefits derived and shared from the intellectual properties owned or acquired by your entity (in the current financial year), based on traditional knowledge.
- **Prefix:** `p8_l4_row`
- **Codes:** `p8_l4_row0_ip`, `p8_l4_row0_own`, `p8_l4_row0_ben`, `p8_l4_row0_basis`, `p8_l4_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 5. Details of corrective actions taken or underway, based on any adverse order in intellectual property related disputes wherein usage of traditional knowledge is involved.
- **Prefix:** `p8_l5_`
- **Codes:** `p8_l5_auth`, `p8_l5_brief`, `p8_l5_action`, `p8_l5_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 6. Details of beneficiaries of CSR Projects.
- **Prefix:** `p8_l6_row`
- **Codes:** `p8_l6_row0_proj`, `p8_l6_row0_num`, `p8_l6_row0_pct`, `p8_l6_rowcount`
- **Type:** table (multi-record)
- **If table:** Multi-row pattern per `questionCodes.ts` (`*_rowcount`, `*_row0_*` / `*_row{n}_*`).
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p8_notes`
- **Codes:** `p8_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Businesses should engage with and provide value to consumers in a responsible manner. (panel id: `p9`)

Assignment blocks from `getStaticPrincipleBlocks(9, …)` / `getAssignmentBlocksForPanel('p9')`.

### 1. Describe the mechanisms in place to receive and respond to consumer complaints and feedback.
- **Prefix:** `p9_e1_`
- **Codes:** `p9_e1_mech`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 2. Turnover of products and / services as a percentage of turnover from all products/service that carry information about
- **Prefix:** `p9_e2_`
- **Codes:** `p9_e2_env`, `p9_e2_safe`, `p9_e2_recycle`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 3. Number of consumer complaints in respect of the following:
- **Prefix:** `p9_e3_`
- **Codes:** `p9_e3_dp_cy_f`, `p9_e3_dp_cy_p`, `p9_e3_dp_cy_r`, `p9_e3_dp_py_f`, `p9_e3_dp_py_p`, `p9_e3_dp_py_r`, `p9_e3_adv_cy_f`, `p9_e3_adv_cy_p`, `p9_e3_adv_cy_r`, `p9_e3_adv_py_f`, `p9_e3_adv_py_p`, `p9_e3_adv_py_r`, `p9_e3_cs_cy_f`, `p9_e3_cs_cy_p`, `p9_e3_cs_cy_r`, `p9_e3_cs_py_f`, `p9_e3_cs_py_p`, `p9_e3_cs_py_r`, `p9_e3_del_cy_f`, `p9_e3_del_cy_p`, `p9_e3_del_cy_r`, `p9_e3_del_py_f`, `p9_e3_del_py_p`, `p9_e3_del_py_r`, `p9_e3_rtp_cy_f`, `p9_e3_rtp_cy_p`, `p9_e3_rtp_cy_r`, `p9_e3_rtp_py_f`, `p9_e3_rtp_py_p`, `p9_e3_rtp_py_r`, `p9_e3_utp_cy_f`, `p9_e3_utp_cy_p`, `p9_e3_utp_cy_r`, `p9_e3_utp_py_f`, `p9_e3_utp_py_p`, `p9_e3_utp_py_r`, `p9_e3_oth_cy_f`, `p9_e3_oth_cy_p`, `p9_e3_oth_cy_r`, `p9_e3_oth_py_f`, `p9_e3_oth_py_p`, `p9_e3_oth_py_r`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 4. Details of instances of product recalls on account of safety issues.
- **Prefix:** `p9_e4_`
- **Codes:** `p9_e4_vol_num`, `p9_e4_vol_reason`, `p9_e4_for_num`, `p9_e4_for_reason`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 5. Does the entity have a framework/ policy on cyber security and risks related to data privacy?
- **Prefix:** `p9_e5_`
- **Codes:** `p9_e5_framework`, `p9_e5_link`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 6. Provide details of any corrective actions taken or underway on issues relating to advertising, and delivery of essential services; cyber security and data privacy of customers; re-occurrence of instances of product recalls; penalty / action taken by regulatory authorities on safety of products / services.
- **Prefix:** `p9_e6_`
- **Codes:** `p9_e6_corrective`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### 7. Provide the following information relating to data breaches
- **Prefix:** `p9_e7`
- **Codes:** `p9_e7a_cy`, `p9_e7a_py`, `p9_e7b_cy`, `p9_e7b_py`, `p9_e7c_cy`, `p9_e7c_py`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 1. Channels / platforms where information on products and services of the entity can be accessed (provide web link, if available).
- **Prefix:** `p9_l1_`
- **Codes:** `p9_l1_channels`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 2. Steps taken to inform and educate consumers about safe and responsible usage of products and/or services.
- **Prefix:** `p9_l2_`
- **Codes:** `p9_l2_steps`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 3. Mechanisms in place to inform consumers of any risk of disruption/discontinuation of essential services.
- **Prefix:** `p9_l3_`
- **Codes:** `p9_l3_mech`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Leadership 4. Entity display product information – (i) Beyond legal mandate, (ii) Consumer satisfaction survey
- **Prefix:** `p9_l4_`
- **Codes:** `p9_l4_beyond`, `p9_l4_detail`, `p9_l4_survey`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

### Notes (narrative)
- **Prefix:** `p9_notes`
- **Codes:** `p9_notes`
- **Type:** single field
- **Calculated from (read-only `CALC_RULES`):** (none — no `CALC_RULES` rows use this prefix)

---

## Naming conventions

- **`_cy` / `_py`:** Current financial year vs previous financial year (and analogous in P6 intensity columns).
- **`_e1`, `_e2`, …:** Essential indicator sections; **`_l1`, …:** Leadership indicator sections.
- **Row instances:** `{panel}_{section}_row{n}_{field}` or `{panel}_{section}_row{n}` (e.g. `p8_e1_row2_name`, `gen_16_3_main`). **Template row** may omit `_row0_` (e.g. `p8_e1_name` = record 1).
- **`_rowcount`:** Stringified count stored in `answers`, used by panel UI to render repeatable sections.

---

## Relationship: `questionCodes.ts` and `brsr_questions`

- New **static** inputs must appear in the appropriate `*_CODES` array (or `ALL_QUESTION_CODES` breaks, API assignment validation fails, seed is incomplete).
- After changing codes, run **`npm run seed:questions`** so `brsr_questions` stays aligned.
- **Dynamic row codes** (only appearing after users add rows) rely on **prefix** sync with RLS (`docs/prefix-sync.md`); they do not need a row in `brsr_questions` for save path if the prefix is already covered — but new **block families** need new prefixes everywhere in the four-way sync.

---

## Fields that must never be renamed

Renaming breaks autofill, calculations, export mapping, or RLS matching **without** TypeScript errors.

### `flowGeneralDataToP6.ts`

- **Inputs:** `gdata_turnover_cy`, `gdata_turnover_py`, `gdata_ppp_cy`, `gdata_ppp_py`
- **Outputs:** every id in **`P6_AUTOFILL_REV_IDS`** and **`P6_AUTOFILL_REV_PPP_IDS`**

### Autofill target ids (explicit)

`p6_e1_rev_cy`, `p6_e3_rev_cy`, `p6_e7_rev_cy`, `p6_e9_rev_cy`, `p6_e1_rev_py`, `p6_e3_rev_py`, `p6_e7_rev_py`, `p6_e9_rev_py`, `p6_e1_rev_ppp_cy`, `p6_e3_rev_ppp_cy`, `p6_e7_rev_ppp_cy`, `p6_e9_rev_ppp_cy`, `p6_e1_rev_ppp_py`, `p6_e3_rev_ppp_py`, `p6_e7_rev_ppp_py`, `p6_e9_rev_ppp_py`

### `CALC_RULES` outputIds (`lib/brsr/calcRules.ts`)

All `outputId` values are **display-only keys** in `calcDisplay`; many formulas reference **input** question codes by id (e.g. `p6_e1_rev_cy` in denominators). Do not rename:

- Any `outputId` string committed in `CALC_RULES`
- Any **input** code referenced inside a `formula`, or listed in `sumIds` / `num` / `denom` of a rule

Search `calcRules.ts` for your code before renaming. High-chaining examples: `gen_20a_*` / `gen_20b_*` totals and percentages; P6 `p6_e1_*`, `p6_e3_*`, `p6_e7_*`, `p6_e9_*` intensity outputs; optional waste stream blocks using `p6_e9_rev_cy` as denominator.

### Codes to avoid / retired

No separate retired list is maintained yet; use git history and `docs/question-codes.md` for future deprecation notes.

---

## Codes to avoid

- **Reserved / ambiguous:** Do not introduce codes that collide with another block’s prefix (longest-prefix wins in `BLOCK_ACCESS_PREFIXES` — order matters).
- **Legacy:** `LegacyPrincipleRenderer` and `principleTemplates.ts` use HTML `id` patterns; renaming template-bound ids without migrating JSX breaks old references.
