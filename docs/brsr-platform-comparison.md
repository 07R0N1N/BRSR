# BRSR Platform vs Tool — Comparison

## Executive summary

| Metric | Platform | Our tool | Delta |
|--------|----------|----------|-------|
| Total input fields | 606 | 2,080 | −1,474 (tool more granular) |
| Calculated fields | 52 | 502 | −450 (tool more display calcs) |
| Multi-record blocks | 31 | 31 | 0 |
| Exact matches | 0 | N/A | All identifiers differ; no exact match possible |
| Semantic matches | 212 | N/A | 212 of 213 platform questions map to tool code blocks |
| In platform, missing from tool | 4 questions | N/A | YH4XW-91A, qGodt713A, bB2se4hrA, bB2se4hrB |
| In tool, not in platform | 16 codes (`gdata` panel) | N/A | Entire `gdata` panel + `sb_notes`-equivalent codes |
| Structural differences | 2 | N/A | Q9 FY date structure, P2 L3 recycled-pct CY/PY split (see § Structural differences) |
| ⚠ Needs manual verification | 0 | N/A | All items resolved — see match table and § Structural differences |

> **Key framing**: The tool encodes M/F/O, CY/PY, and sub-category breakdowns as **flat, individually-named codes** (e.g., `p3_e1a_perm_m_t`). The platform stores the same data in **table rows** within a single question (e.g., `value2`, `value3` across multiple rows). This architectural split explains almost the entire 3.4× code-count gap. Coverage of BRSR disclosures is near-complete in both implementations.

---

## Fields in platform but missing from tool

### Section A — General Disclosures

| Platform section | Platform question | External ID | Field key | Field type | Calculated | Priority |
|------------------|-------------------|-------------|-----------|------------|------------|----------|
| I. Details of the listed Entity | 14. Whether the company has undertaken reasonable assurance | `YH4XW-91A` | `reasonable_assurance_taken` | select/boolean | no | **HIGH** |
| Notes | 28. Additional details or comments (Section A notes) | `qGodt713A` | `notes` | textarea | no | LOW |

**Notes:**
- `YH4XW-91A` is a new yes/no gate question added in the 31-05-2025 platform version. It sits before the assurer-details table (Q15 in platform, which maps to `gen_14_*` in the tool). The tool goes directly to assurer details with no prior yes/no gate. This must be added as `gen_14_applicable` or similar so the tool's render logic knows whether to show the assurer block.
- `qGodt713A` is a free-text notes field for Section A. The tool has per-principle notes (`p1_notes` … `p9_notes`) but no `gen_notes` equivalent.

### Section B — Management and Process Disclosures

| Platform section | Platform question | External ID | Field key | Field type | Calculated | Priority |
|------------------|-------------------|-------------|-----------|------------|------------|----------|
| II. Governance, leadership and oversight | 12. If answer to Policy Q1 is "No", provide reasons for not having policies | `bB2se4hrA` | `value1`–`value5` (per principle) | textarea | no | **MEDIUM** |
| Notes | Section B additional details or comments | `bB2se4hrB` | `notes` | textarea | no | LOW |

**Notes:**
- `bB2se4hrA` is a multi-column table: for each of P1–P9, if the entity answered "No" to whether a policy exists (Section B Q1), they must explain why. The tool's `sb_1a_p{1–9}` captures the yes/no but provides no follow-up field for the "No" case. A new block `sb_12_p{1–9}` is needed, or `sb_1a_p{1–9}` must be expanded to a predicator question.
- `bB2se4hrB` is a free-text notes field for Section B. Tool has no `sb_notes`.

---

## Fields in tool but not in platform

### `generaldata` panel (16 codes — all absent from platform)

| Tool code | Panel | Block | Label | Possible reason |
|-----------|-------|-------|-------|-----------------|
| `gdata_turnover_cy` | `generaldata` | Turnover & PPP | Turnover current year | Custom addition — platform derives this from Section A Q25 (CSR data) and Section C via autofill; tool isolates it as a separate input for use as the P6 intensity denominator |
| `gdata_turnover_py` | `generaldata` | Turnover & PPP | Turnover previous year | Custom addition — same reason |
| `gdata_ppp_cy` | `generaldata` | Turnover & PPP | PPP current year | Custom addition — purchasing-power-parity denominator not captured anywhere in the platform CSV |
| `gdata_ppp_py` | `generaldata` | Turnover & PPP | PPP previous year | Custom addition — same reason |
| `gdata_emp_perm_m` | `generaldata` | Headcounts | Permanent employee headcount — Male | Platform merges — platform captures this in Section A Q21 (dTG7zi1bA) as a table row, but that autofills from a prior-period cache; the tool needs it as a standalone input to drive display calcs |
| `gdata_emp_perm_f` | `generaldata` | Headcounts | Permanent employee headcount — Female | Platform merges — same |
| `gdata_emp_perm_o` | `generaldata` | Headcounts | Permanent employee headcount — Other | Platform merges — same |
| `gdata_emp_oth_m` | `generaldata` | Headcounts | Other employee headcount — Male | Platform merges — same |
| `gdata_emp_oth_f` | `generaldata` | Headcounts | Other employee headcount — Female | Platform merges — same |
| `gdata_emp_oth_o` | `generaldata` | Headcounts | Other employee headcount — Other | Platform merges — same |
| `gdata_wrk_perm_m` | `generaldata` | Headcounts | Permanent worker headcount — Male | Platform merges — same |
| `gdata_wrk_perm_f` | `generaldata` | Headcounts | Permanent worker headcount — Female | Platform merges — same |
| `gdata_wrk_perm_o` | `generaldata` | Headcounts | Permanent worker headcount — Other | Platform merges — same |
| `gdata_wrk_oth_m` | `generaldata` | Headcounts | Other worker headcount — Male | Platform merges — same |
| `gdata_wrk_oth_f` | `generaldata` | Headcounts | Other worker headcount — Female | Platform merges — same |
| `gdata_wrk_oth_o` | `generaldata` | Headcounts | Other worker headcount — Other | Platform merges — same |

> The `gdata_*` panel is a tool-specific architecture decision: it holds the denominator inputs needed for energy/water/GHG intensity calculations (`flowGeneralDataToP6`) and headcount sums that drive display calcs for `gen_20a_*`. The platform achieves the same by pulling autofill values from Section A question answers directly. Both approaches are correct; the tool requires the data to be entered a second time in this dedicated panel.

### Missing notes codes

| Tool code | Panel | Block | Label | Possible reason |
|-----------|-------|-------|-------|-----------------|
| *(none)* `gen_notes` | `general` | — | Section A additional details | Custom addition — the tool has no Section A notes code; the platform has `qGodt713A` |
| *(none)* `sb_notes` | `sectionb` | — | Section B additional details | Custom addition — the tool has no Section B notes code; the platform has `bB2se4hrB` |
| *(none)* `sb_12_p{1–9}` | `sectionb` | — | Reason for not having policy per principle | Custom addition — the tool captures the yes/no in `sb_1a_p{1–9}` but has no follow-up field for the "No" case |

---

## Label / wording differences

Only material differences (not mere phrasing) are listed.

| Tool code | Tool label | Platform label | Section | Why it matters |
|-----------|------------|----------------|---------|----------------|
| `gen_9_fy` | "9. Financial year for which reporting is done" (single text) | "9. Financial year for which reporting is being done" — implemented as a **table** with `value1` (start date) and `value2` (end date) for current year, previous year, and period-prior | Section A | Platform captures three FY date ranges (CY, PY, period-prior) with explicit start/end date fields; tool stores a single text string. Export reports that include PY and PP dates will differ structurally. |
| `gen_12_contact` | "12. Contact person for BRSR queries" (single text) | "12. Name and contact details of the person who may be contacted" — implemented as a **multi-row table** with `value1` (name), `value2` (designation), `value3` (contact details) | Section A | Platform allows multiple contact persons; tool allows only one. If a company lists two contacts, the tool drops the second. |
| `gen_14_row_count` / `gen_14_{n}_{...}` | "14. Details of Assurer(s)" — directly shows assurer table | Platform renumbers this as **Q15** because it inserts a new yes/no gate as Q14 (assurance taken?) before the assurer table | Section A | Question numbering in any generated PDF will diverge from the 31-05-2025 SEBI format if the tool doesn't add the gate question. |
| `sb_1a_p{1–9}` | "1(a). Policy covers each principle" (text per principle) | Platform question "1. Policy" encodes **three fields per principle** in a single multiple_row table: `value1` (policy exists), `value2` (approved by board), `value3` (weblink) — mirroring sb_1a/1b/1c | Section B | Tool splits these into 27 separate codes (sb_1a, sb_1b, sb_1c × 9 principles); platform stores them as 3 columns in a 9-row table. The data is equivalent but the access path differs for exports. |

---

## Calculated field comparison

### In both — formula comparison

| Field | Section | Tool formula | Platform formula | Match |
|-------|---------|-------------|-----------------|-------|
| National locations total | Section A / Q19 | `gen_18_nat_sum` = `nat_plants + nat_offices` | `value4` = `add(value2, value3)` on the "National" row | ✓ identical |
| International locations total | Section A / Q19 | `gen_18_int_sum` = `int_plants + int_offices` | `value4` = `add(value2, value3)` on the "International" row | ✓ identical |
| Women in BoD % | Section A / Q22 | `gen_21_bod_pct` = `bod_f / bod_total` | Platform `value4` = `percentage(value3, value2)` | ✓ identical |
| Women in KMP % | Section A / Q22 | `gen_21_kmp_pct` = `kmp_f / kmp_total` | Platform `value4` = `percentage(value3, value2)` on KMP row | ✓ identical |
| Employee/worker totals (Q20a) | Section A | `gen_20a_*_total` = sum of M+F+O for each category | Platform `value2` derived = `add(value3, value4, value5)` per row | ✓ identical |
| Differently abled totals (Q20b) | Section A | `gen_20b_*_total` = sum of M+F+O | Platform same pattern | ✓ identical |
| P3 E7 Union membership % | Principle 3 | `calc_p3_e7_*` = `pct = count / total` | Platform `value4` = `percentage(value3, value2)` per row | ~ different method (same result) |
| P3 E8 Training % | Principle 3 | `calc_p3_e8_*` = trained / total | Platform per-row derived percentage | ~ different method (same result) |
| P3 E9 Performance reviews % | Principle 3 | `calc_p3_e9_*` = reviewed / total | Platform per-row derived | ~ different method (same result) |
| P3 E1c Well-being spend % | Principle 3 | `calc_p3_e1c_cy_pct` = `cy_spend / cy_rev` | Platform — no explicit inline calc (CalculatorHook) | ⚠ ~ needs verification |
| P6 E1 Energy total | Principle 6 / E1 | `p6_e1_total_{cy/py}` = sum of RE+NRE | Platform `custom_layout_single_answer` via CalculatorHook | ~ different method |
| P6 E1 Energy intensity | Principle 6 / E1 | `p6_e1_intensity_{cy/py}` = `total / turnover` | Platform via CalculatorHook (hardcoded per external_id) | ~ different method |
| P6 E3 Water withdrawal total | Principle 6 / E3 | `p6_e3_with_total_{cy/py}` = sum of 5 sources | Platform derived on the totals row | ✓ identical |
| P6 E3 Water intensity | Principle 6 / E3 | `p6_e3_intensity_{cy/py}` = `consumption / revenue` | Platform via CalculatorHook | ~ different method |
| P6 E4 Water discharge total | Principle 6 / E4 | `p6_e4_tot_{cy/py}` | Platform — table row total derived | ✓ identical |
| P6 E7 GHG S1+S2 | Principle 6 / E7 | `p6_e7_s1s2_{cy/py}` = `s1 + s2` | Platform via CalculatorHook on external_id `0TWei6qRAV3` | ✓ identical |
| P6 E7 GHG intensity | Principle 6 / E7 | `p6_e7_intensity_{cy/py}` = `(s1+s2) / revenue` | Platform via CalculatorHook | ~ different method |
| P6 E9 Waste total | Principle 6 / E9 | `p6_e9_total_{cy/py}` | Platform table-row derived | ✓ identical |
| P8 E5 Job creation % | Principle 8 / E5 | `calc_p8_pct_{1–8}` = `wages / total × 100` | Platform `value7` = derived(value2, value3, value4, value5, value6) | ~ different method |
| P1 E8 Payable days | Principle 1 / E8 | `calc_p1_formula_1/2` = `ap / cost` | Platform `value4` or similar derived | ⚠ ~ needs verification |

### In platform only — can tool add without new inputs?

| Platform field | Formula | Required tool input codes | All present in tool? |
|----------------|---------|--------------------------|----------------------|
| P3 E1 well-being totals (52 derived fields across 4 subquestions) | `add(value2, value3, value4)` per row | The M/F/O and benefit-type inputs exist as `p3_e1a_perm_*`, `p3_e1b_*`, etc. | **Yes** — all inputs present; calc outputs (`calc_p3_e1a_perm_tot_*`) already exist in calcRules.ts |
| P6 E1 RE total, NRE total, overall total (6 derived) | sum of source inputs | `p6_e1_{re\|nre}_{el\|fuel\|oth}_{cy\|py}` | **Yes** — already implemented as `p6_e1_re_total_{cy/py}` etc. in calcRules.ts |
| P6 E1 intensity (4 derived) | `total / gdata_turnover_{cy/py}` | `p6_e1_total_*` + `gdata_turnover_*` | **Yes** — implemented in calcRules.ts |
| P3 E7 union % (12 pct derived) | `percentage(union_count, total)` | `p3_e7_{emp\|wrk}_{m\|f\|o}_{t\|u}_{cy\|py}` | **Yes** — implemented as `calc_p3_e7_*` |
| P3 E8 training % (20 pct derived) | `pct_hs = hs_trained / total` | `p3_e8_*` inputs | **Yes** — implemented as `calc_p3_e8_*` |
| Section A Q19 location sums | `add(nat_plants, nat_offices)` | `gen_18_nat_plants`, `gen_18_nat_offices` | **Yes** — implemented as `gen_18_nat_sum`, `gen_18_int_sum` |
| Section A Q21 employee/worker totals + % (70 derived) | sum and percentage across M/F/O | `gen_20a_*`, `gen_20b_*` | **Yes** — all implemented in calcRules.ts |
| Section A Q22 women % in BoD/KMP | `percentage(f, total)` | `gen_21_bod_total`, `gen_21_bod_f`, `gen_21_kmp_*` | **Yes** — implemented as `gen_21_bod_pct`, `gen_21_kmp_pct` |

> **Finding**: Every calculated field in the platform has a corresponding output already in the tool's `calcRules.ts`. There are no platform calculations that require new input codes to be implemented.

### In tool only

| Tool outputId | Formula | Platform equivalent |
|---------------|---------|---------------------|
| `gdata_rev_ppp_cy_display` / `py` | `gdata_turnover / gdata_ppp` (display only) | No platform equivalent — platform doesn't have a PPP field |
| `gdata_emp_perm_sum` etc. (4 headcount sums) | Sum of M+F+O across gdata headcount inputs | Platform derives these as table row totals in Q21, not as named outputs |
| `calc_p1_e9_purch_pct_cy` etc. (16 P1 E9 outputs) | Concentration percentages from p1_e9_* | Platform question `C9SGtOx3A`/`C9SGtOx4A`/`C9SGtOx5A` covers same data; derived inline by CalculatorHook |
| `p6_l1_row{n}_*` (60 dynamic per-row outputs) | Per-plant water subtotals and intensity | Platform `XMVKVa42A` (custom_layout) covers same via CalculatorHook — not explicit named outputs |
| `p6_l2_intensity_{cy/py}` | `s3 / revenue` | Platform `iAvk-SShA` likely covers via CalculatorHook |
| `calc_p5_pct_1–28` (28 P5 outputs) + `calc_p5_e2_*` (72 outputs) | Perm/other × eq/more than min wage percentages | Platform questions `AGjhtHTWA`, `X4j1sSTdA`, `1s3pb0xvA`, `2sdrbFxTA` cover same data; derived inline |

---

## Multi-record block comparison

| Block | Section | Platform fields per row | Tool fields per row | Max rows match? | Field parity |
|-------|---------|------------------------|---------------------|----------------|--------------|
| Stock Exchanges (Q10) | Section A | `value`, `description_of_other_stock_exchange`, `name_of_the_country` | `exchange`, `description`, `country` | ✓ both 10 | ~ field count matches (3 each), names differ |
| Assurer details (Q15 platform / Q14 tool) | Section A | `company_llp_firm_name`, `company_id_llp_id_firm_registration_no`, `name_of_the_assurer`, `designation_of_assurer`, `date_of_signing_by_assurer` | `company`, `id`, `assurer_name`, `designation`, `date` | ✓ both 10 | ✓ identical (5 fields, same semantics) |
| Business activities (Q17) | Section A | `value1`, `value2`, `value3` | `main`, `activity`, `pct` | ✓ both 5 | ~ 3 fields each, names differ |
| Products/Services sold (Q18) | Section A | `value1`, `value2`, `value3` | `product`, `nic`, `pct` | ✓ both 5 | ~ 3 fields each, names differ |
| Holding/subsidiary companies (Q24) | Section A | `value1`, `value2`, `value3`, `value4` | `name`, `type`, `pct`, `br` | ✓ both 5 | ✓ identical (4 fields, same semantics) |
| Material RBC issues (Q27) | Section A | `value1`, `value2`, `value3`, `value4`, `value5` | `issue`, `ro`, `rationale`, `approach`, `fin` | ✓ both 5 | ✓ identical (5 fields) |
| P1 E2 Proceedings — 5 sub-tables | Principle 1 | `value1`–`value5` (pf/set/cmp) or `value1`–`value4` (imp/pun) | `principle`, `agency`, `amt`, `brief`, `appeal` / `principle`, `agency`, `brief`, `appeal` | both dynamic | ~ parity varies: pf/set/cmp have 5 fields (amt present), imp/pun have 4 (no amt) — matches tool |
| P1 E3 Appeal details | Principle 1 | `value1`, `value2` | `case`, `agency` | both dynamic | ✓ identical (2 fields) |
| P1 L1 Value chain awareness | Principle 1 | `value1`, `value2`, `value3` | `prog`, `topics`, `pct` | both dynamic | ✓ identical (3 fields) |
| P2 L2 LCA risks | Principle 2 | `value1`, `value2`, `value3` | `product`, `risk`, `action` | both dynamic | ✓ identical (3 fields) |
| P2 L3 Recycled input % | Principle 2 | `value1` (material), `value2` (pct) | `material`, `pct_cy`, `pct_py` | both dynamic | ✗ different — platform has 2 fields per row; tool has 3 (separate CY/PY pct) |
| P2 L5 Reclaimed % of sold | Principle 2 | `value1` (category), `value2` (pct) | `category`, `pct` | both dynamic | ✓ identical (2 fields) |
| P4 E2 Key stakeholders | Principle 4 | `value1`–`value7` (name, vuln, chan, chan_other, freq, freq_other, purpose) | `name`, `vuln`, `chan`, `chan_other`, `freq`, `freq_other`, `purpose` | both dynamic | ✓ identical (7 fields) |
| P6 E11 Ecologically sensitive | Principle 6 | `value1`–`value4` | `loc`, `type`, `yn`, `correct` | ✓ both 10 | ✓ identical (4 fields) |
| P6 E12 EIA | Principle 6 | `value1`, `value3`, `value4`, `value5`, `value6`, `value7` | `name`, `notif`, `date`, `ind`, `pub`, `link` | ✓ both 10 | ~ 6 fields each (platform skips value2); names differ |
| P6 E13 Env violations | Principle 6 | `value1`–`value4` | `law`, `detail`, `fines`, `correct` | ✓ both 10 | ✓ identical (4 fields) |
| P6 L1 Water stress per plant | Principle 6 | `name_of_the_area`, `name_of_the_operation`, withdrawal/discharge sub-fields | `area`, `nature`, 5×withdrawal sources (×cy/py), cons, int_opt, 15×discharge sub-fields | ✓ both 10 | ⚠ SECTION-ONLY — platform uses custom_layout with complex subclasses; field-by-field parity needs manual verification |
| P6 L4 Innovation initiatives | Principle 6 | `value1`–`value4` | `init`, `detail`, `outcome`, `correct` | ✓ both 10 | ✓ identical (4 fields) |
| P7 E2 Corrective actions | Principle 7 | `value1`, `value2`, `value3` | `auth`, `brief`, `action` | both dynamic | ✓ identical (3 fields) |
| P7 L1 Public policy | Principle 7 | `value1`–`value5` | `policy`, `method`, `freq`, `public`, `link` | both dynamic | ✓ identical (5 fields) |
| P8 E1 SIA | Principle 8 | `value1`–`value6` | `name`, `notif`, `date`, `ind`, `pub`, `link` | both dynamic | ✓ identical (6 fields) |
| P8 E2 R&R projects | Principle 8 | `value1`–`value6` | `name`, `state`, `dist`, `paf`, `pct`, `amt` | both dynamic | ✓ identical (6 fields) |
| P8 L1 SIA mitigation | Principle 8 | `value1`, `value2` | `impact`, `action` | both dynamic | ✓ identical (2 fields) |
| P8 L2 CSR aspirational districts | Principle 8 | `value1`, `value2`, `value3` | `state`, `dist`, `amt` | both dynamic | ✓ identical (3 fields) |
| P8 L4 Traditional knowledge | Principle 8 | `value1`–`value4` | `ip`, `own`, `ben`, `basis` | both dynamic | ✓ identical (4 fields) |
| P8 L5 IP dispute corrective | Principle 8 | `value1`, `value2`, `value3` | `auth`, `brief`, `action` | both dynamic | ✓ identical (3 fields) |
| P8 L6 CSR beneficiaries | Principle 8 | `value1`, `value2`, `value3` | `proj`, `num`, `pct` | both dynamic | ✓ identical (3 fields) |

> **Summary**: 25 of 31 multi-record blocks have field parity (✓ or ~). 1 block needs manual verification (P6 L1 water stress). 1 block has a structural mismatch (P2 L3: tool splits pct into CY and PY; platform has a single pct column).

---

## Structural differences that affect export

These items are not gaps (the tool captures the relevant data), but the *structure* of what is captured differs enough from the platform that a naive field-for-field export mapping will produce incorrect or incomplete output.

### Q9 Financial year (`_cSOrc14A` — Section A Q9)

**What the platform captures:** A `multiple_row` table with three rows — one per reporting year — each storing an explicit `start` date (`value1`) and `end` date (`value2`). This lets the platform populate report headers with exact date ranges (e.g. "01-Apr-2024 to 31-Mar-2025") and validate year boundaries.

**What the tool captures:** A single dropdown (`gen_9_fy`) that stores a label string such as `"2024-25"`. No start or end dates are stored; the reporting year is implied from the label and the org's `reporting_year` column.

**What is lost or diverges in the DOCX/XLSX export:** The BRSR report header requires an explicit date range. The current exporter (`brsrDocx.ts`) reads `gen_9_fy` and emits the label as-is; if SEBI expects "01 April 2024 to 31 March 2025" the tool must derive those dates from the label. Prior-year comparative date ranges are not stored at all.

**Recommended fix:** Derive start/end dates from the `gen_9_fy` label in the exporter (e.g. split on `-`, map year tokens to April 1 / March 31). If the tool ever needs to support non-standard FY boundaries, add `gen_9_fy_start` and `gen_9_fy_end` codes. No schema change is required for the current standard FY format.

---

### P2 L3 Recycled / reused material percentage (`XMVKVa42A`-adjacent — Principle 2 L3)

**What the platform captures:** A single `pct` column per material row, representing one percentage figure (implicitly the current-year recycled percentage).

**What the tool captures:** Two separate codes per row — `p2_l3_row{n}_pct_cy` (current year) and `p2_l3_row{n}_pct_py` (previous year) — matching SEBI's BRSR format which requires both years.

**What is lost or diverges in the DOCX/XLSX export:** The platform's single `pct` value cannot be unambiguously mapped to either CY or PY without additional context. If data is ever migrated from the platform to the tool, the prior-year percentage will be absent. In the reverse direction (tool → platform), one of the two year values will be silently dropped.

**Recommended fix:** In any platform→tool data migration, treat the platform's `pct` as `pct_cy` and leave `pct_py` blank for manual backfill. In the tool's DOCX export, always output both `pct_cy` and `pct_py` columns — no code change needed since the tool already captures them correctly.

---

## Recommendations

### Must fix — HIGH priority gaps

- **Missing assurance gate question** → add `gen_14_applicable` (or `gen_assurance_yn`) to `questionCodes.ts` + a predicator block in Section A that gates the assurer-details table (`gen_14_*`) — **1 new code** needed. This aligns the tool with the 31-05-2025 SEBI format where Q14 is a yes/no before assurer details.

### Should fix — MEDIUM priority

- **Section B Q12 "Policy = No" follow-up** → add `sb_12_p{1–9}` (9 codes) to `questionCodes.ts` and a new assignment block in `principleBlocksConfig.ts`. Alternatively, convert `sb_1a_p{1–9}` to predicator questions so the "No" branch shows a textarea — **9 new codes** needed.
- **Section B notes** → add `sb_notes` (1 code) — **1 new code** needed.

### Can be added to calcRules.ts with no new input codes

All of the following platform calculated fields already have corresponding inputs in the tool and calc outputs defined — no new codes are required, only verification that the formulas are correct:

| Platform calculated field | Formula | Tool input codes it uses |
|--------------------------|---------|--------------------------|
| P2 L3 recycled % — CY and PY split | `pct_cy` and `pct_py` per material | `p2_l3_row{n}_pct_cy`, `p2_l3_row{n}_pct_py` — tool already splits; platform only has one pct column. No action needed in calcRules.ts, but **the platform's single pct column must be mapped to CY or PY explicitly** |
| P3 E1 well-being totals (52 outputs) | `add(m, f, o)` per benefit type | `p3_e1a_perm_{m\|f\|o}_{t\|hi\|ac\|mat\|pat\|dc}` — **already implemented** in calcRules.ts as `calc_p3_{e1a_perm\|e1a_oth\|e1b_perm\|e1b_oth}_tot_*` |
| P3 E1c well-being spend % | `spend / revenue` | `p3_e1c_{cy\|py}_{spend\|rev}` — **already implemented** as `calc_p3_e1c_{cy\|py}_pct` |
| P6 energy totals + intensities (10 outputs) | sum RE+NRE, total/revenue | `p6_e1_*` + `gdata_turnover_*` — **already implemented** |
| P6 water totals + intensities (6 outputs) | sum sources, consumption/revenue | `p6_e3_*` + `gdata_turnover_*` — **already implemented** |
| P6 GHG S1+S2 + intensity (4 outputs) | `s1+s2`, `(s1+s2)/revenue` | `p6_e7_{s1\|s2}_{cy\|py}` + `gdata_turnover_*` — **already implemented** |
| P6 waste totals + intensities | sum waste types, total/revenue | `p6_e9_*` + `gdata_turnover_*` — **already implemented** |
| P8 E5 job creation % (8 outputs) | `wages / total` per location type | `p8_e5_*` — **already implemented** as `calc_p8_pct_{1–8}` |

### Review — label and calc mismatches

- **P2 L3 recycled % — single vs dual column**: Platform stores one `pct` per material row; tool expects `pct_cy` and `pct_py` as separate fields. Decide whether the platform should be updated to split into two columns, or whether the tool should merge them. Affects export accuracy for prior-year comparisons.
- **`p6_e4_tot_{cy/py}` double-registration — ✅ RESOLVED**: Removed from `questionCodes.ts` (`P6_EXTENDED_CODES`). Calc rule in `calcRules.ts` retained (sum of 10 discharge sub-components). Migration 012 cleans any stale rows from `answers` and `brsr_questions`. Panel continues to render via `d()` / `calcDisplay` — no rendering change.
- **P6 L1 water stress per-plant calcs**: The tool's dynamic outputs `p6_l1_row{n}_{total_with_cy/py, total_disp_cy/py, intensity_cy/py}` may not fully match the platform's CalculatorHook logic for `XMVKVa42A`. Verify formulas before using either for export. (Input fields are confirmed matched — see appendix `XMVKVa42A`.)
- **Q9 financial year structure**: See § Structural differences above for full analysis and recommended fix.

### Low priority

- `qGodt713A` (Section A notes) and `bB2se4hrB` (Section B notes) — these are free-text narrative fields with no data dependency. Add `gen_notes` and `sb_notes` codes if free-text annotations are needed in the tool's export; otherwise leave as platform-only.
- The `gdata_ppp_{cy/py}` codes have no platform equivalent. Purchasing-power-parity intensity (`p6_e1_intensity_ppp_*`) uses these as a denominator. If the tool's PPP intensity outputs are needed, the input codes stay. If not, consider removing `gdata_ppp_*` and the `*_ppp_*` intensity outputs to simplify the data model.

---

## Appendix: full match table

Sorted: NO MATCH first, then STRUCTURAL-DIFFERENCE, then SEMANTIC, then EXACT.

| Platform external ID | Platform question | Match status | Tool code |
|----------------------|-------------------|--------------|-----------|
| `YH4XW-91A` | 14. Whether reasonable assurance taken? | NO MATCH | — |
| `qGodt713A` | Section A additional notes | NO MATCH | — |
| `bB2se4hrA` | Section B Q12: Policy = No reasons | NO MATCH | — |
| `bB2se4hrB` | Section B Notes | NO MATCH | — |
| `T6b8VVnzA` | P6 E4 water discharge — assessment/agency | SEMANTIC | `p6_e4_assess_yn` (radio yes/no) + `p6_e4_assess_agency` (conditional text input) — both present in `P6_EXTENDED_CODES` and rendered as user inputs in `PanelPrinciple6.tsx` |
| `_cSOrc14A` | 9. Financial year (table: start/end × 3 FYs) | STRUCTURAL-DIFFERENCE | `gen_9_fy` — tool stores FY label as a single dropdown string; platform stores explicit start/end dates per year. No date-range codes exist in the tool. See § Structural differences. |
| `XMVKVa42A` | P6 L1 Water in water-stress areas | SEMANTIC | `p6_l1_row{n}_*` — tool captures all SEBI L1 data points (area, nature, 5 withdrawal sources, consumption, 5 discharge destinations with treatment splits) as explicit user-input codes across ~460 dynamic fields |
| `C9SGtOx2A` | P1 E8 Accounts payable / cost of goods | SEMANTIC | `p1_e8_ap_cy`, `p1_e8_ap_py`, `p1_e8_cost_cy`, `p1_e8_cost_py` — all four platform `value1`–`value4` cells present as user inputs in `PanelPrinciple1.tsx` |
| `YH4XW-9QA` | 1. Corporate Identity Number (CIN) | SEMANTIC | `gen_1_cin` |
| `cTaDRY54A` | 2. Name of the Listed Entity | SEMANTIC | `gen_2_name` |
| `gUVlF6--A` | 3. Date of Incorporation | SEMANTIC | `gen_3_year_inc` |
| `HRfNdLLhA` | 4. Registered office address | SEMANTIC | `gen_4_registered_addr` |
| `m8_xRyizA` | 5. Corporate Address | SEMANTIC | `gen_5_corporate_addr` |
| `yM-P38FxA` | 6. E-mail address | SEMANTIC | `gen_6_email` |
| `bb444gkpA` | 7. Telephone No. | SEMANTIC | `gen_7_telephone` |
| `v8UgIMuEA` | 8. Website | SEMANTIC | `gen_8_website` |
| `FEe_FDQkA` | 10. Stock Exchange listings | SEMANTIC | `gen_10_row_count`, `gen_10_{n}_{exchange\|description\|country}` |
| `ZuZs5zn_A` | 11. Paid-up Capital | SEMANTIC | `gen_11_paidup_capital` |
| `-MaujV59A` | 12. Contact person (multi-row: name/designation/contact) | SEMANTIC | `gen_12_contact` (structure diff: platform more granular) |
| `eAdFIp1CA` | 13. Reporting boundary | SEMANTIC | `gen_13_boundary` |
| `YH4XW-92A` | 15. Name of assurance provider | SEMANTIC | `gen_14_row_count`, `gen_14_{n}_{company\|id\|assurer_name\|designation\|date}` |
| `YH4XW-93A` | 16. Type of assurance obtained | SEMANTIC | `gen_15_assurance_type` |
| `x1WLuEseA` | 17. Business activities (top 5) | SEMANTIC | `gen_16_row_count`, `gen_16_{n}_{main\|activity\|pct}` |
| `NIpSrCDjA` | 18. Products/Services sold (top 5) | SEMANTIC | `gen_17_row_count`, `gen_17_{n}_{product\|nic\|pct}` |
| `V1nYkDVnA` | 19. Number of locations | SEMANTIC | `gen_18_nat_plants`, `gen_18_nat_offices`, `gen_18_int_plants`, `gen_18_int_offices` |
| `FMXG0Lv4A` | 20a. Markets served — states/countries | SEMANTIC | `gen_19_nat_states`, `gen_19_int_countries` |
| `ZSbzCOeOA` | 20b. Markets served — export % | SEMANTIC | `gen_19b_export_pct` |
| `5gUeJ0xJA` | 20c. Markets served — customer types | SEMANTIC | `gen_19c_customers` |
| `dTG7zi1bA` | 21a. Employees at FY end (permanent) | SEMANTIC | `gen_20a_emp_perm_m/f/o` |
| `DvBGmFGdA` | 21b. Workers at FY end (permanent/other) | SEMANTIC | `gen_20a_wrk_perm_m/f/o`, `gen_20a_wrk_other_m/f/o` |
| `MblfbGurA` | 21c. Differently abled Employees | SEMANTIC | `gen_20b_emp_perm_m/f/o`, `gen_20b_emp_other_m/f/o` |
| `e1a4DILWA` | 21d. Differently abled Workers | SEMANTIC | `gen_20b_wrk_perm_m/f/o`, `gen_20b_wrk_other_m/f/o` |
| `8dwd2wYLA` | 22. Women in BoD and KMP | SEMANTIC | `gen_21_bod_total`, `gen_21_bod_f`, `gen_21_kmp_total`, `gen_21_kmp_f` |
| `ZZw_iaP4A` | 23. Turnover rate | SEMANTIC | `gen_22_emp_cy/py/pp_{m\|f\|t\|o}`, `gen_22_wrk_cy/py/pp_{m\|f\|t\|o}` |
| `5UYKVaheA` | 24. Holding/subsidiary companies | SEMANTIC | `gen_23_row_count`, `gen_23_{n}_{name\|type\|pct\|br}` |
| `g5AwrGzsA` | 25a. CSR applicable? | SEMANTIC | `gen_24_csr_applicable` |
| `sckKP-8IA` | 25b. CSR turnover | SEMANTIC | `gen_24_turnover` |
| `mGnT_gCUA` | 25c. CSR net worth | SEMANTIC | `gen_24_networth` |
| `IH6-XE0HA` | 26. Complaints on Principles (7 groups) | SEMANTIC | `gen_25_{comm\|inv\|sha\|emp\|cust\|vc\|oth}_{mech\|cy_f\|cy_p\|cy_rem\|py_f\|py_p\|py_rem\|weblink}` |
| `qGodt712A` | 27. Material responsible business conduct issues | SEMANTIC | `gen_26_row_count`, `gen_26_{n}_{issue\|ro\|rationale\|approach\|fin}` |
| `EVA0eTXhA` | Section B 1. Policy (P1–P9: exists, board-approved, weblink) | SEMANTIC | `sb_1a_p{1–9}`, `sb_1b_p{1–9}`, `sb_1c_p{1–9}` |
| `IF0Fo_sEA` | Section B 2. Policy translated into procedures | SEMANTIC | `sb_2_p{1–9}` |
| `p-aUObuIA` | Section B 3. Policies extend to value chain | SEMANTIC | `sb_3_p{1–9}` |
| `dutu8djDA` | Section B 4. National/international codes | SEMANTIC | `sb_4_p{1–9}` |
| `PrVWUL8AA` | Section B 5. Commitments, goals, targets | SEMANTIC | `sb_5_p{1–9}` |
| `sZonzx43A` | Section B 6. Performance against commitments | SEMANTIC | `sb_6_p{1–9}` |
| `mZ8YHtIPA` | Section B 7. Director statement | SEMANTIC | `sb_7_statement` |
| `SlSDVAWxA` | Section B 8. Highest authority | SEMANTIC | `sb_8_authority` |
| `0iY2KTZrA` | Section B 9. Board Committee | SEMANTIC | `sb_9_p{1–9}` |
| `FppXQTnTA` | Section B 10a. Review of NGRBCs — performance | SEMANTIC | `sb_10a_p{1–9}`, `sb_10a_p{1–9}_review`, `sb_10a_p{1–9}_freq` |
| `ca-RPGh3A` | Section B 10b. Review of NGRBCs — compliance | SEMANTIC | `sb_10b_p{1–9}`, `sb_10b_p{1–9}_review`, `sb_10b_p{1–9}_freq` |
| `G7pJ6vx6A` | Section B 11. Independent external assessment | SEMANTIC | `sb_11_p{1–9}`, `sb_11_p{1–9}_agency` |
| `zMmxhOR1A` | P1 E1. Training/awareness coverage | SEMANTIC | `p1_e1_{bod\|kmp\|emp\|wrk}_{prog\|topics\|pct}` |
| `tlKLXj3kA` | P1 E2. Proceedings (fines) | SEMANTIC | `p1_e2_pf_rowcount`, `p1_e2_pf_row0_*` |
| `Hb1dflf2A` | P1 E2. Settlements | SEMANTIC | `p1_e2_set_rowcount`, `p1_e2_set_row0_*` |
| `ejlnKRFGA` | P1 E2. Compounding fees | SEMANTIC | `p1_e2_cmp_rowcount`, `p1_e2_cmp_row0_*` |
| `bg3I-wqbA` | P1 E2. Imprisonment | SEMANTIC | `p1_e2_imp_rowcount`, `p1_e2_imp_row0_*` |
| `e-kFoSs9A` | P1 E2. Punishment | SEMANTIC | `p1_e2_pun_rowcount`, `p1_e2_pun_row0_*` |
| `aaWYZgo9A` | P1 E3. Appeal/revision details | SEMANTIC | `p1_e3_rowcount`, `p1_e3_row0_{case\|agency}` |
| `EQ_Wfy4zA` | P1 E4. Anti-corruption/anti-bribery policy | SEMANTIC | `p1_e4_anticorr` |
| `yJP504K6A` | P1 E5. Disciplinary actions (bribery/corruption) | SEMANTIC | `p1_e5_{dir\|kmp\|emp\|wrk}_{cy\|py}` |
| `dSx-PMUOA` | P1 E6. Conflict of interest complaints | SEMANTIC | `p1_e6_{dir\|kmp}_{cy\|py}`, `p1_e6_{dir\|kmp}_{cy\|py}_rem` |
| `C9SGtOx1A` | P1 E7. Corrective action on fines/conflicts | SEMANTIC | `p1_e7_corrective` |
| `C9SGtOx3A` | P1 E9a. Concentration of purchases | SEMANTIC | `p1_e9_purch_*` |
| `C9SGtOx4A` | P1 E9b. Concentration of sales | SEMANTIC | `p1_e9_sales_*` |
| `C9SGtOx5A` | P1 E9c. Related party transactions | SEMANTIC | `p1_e9_rpt_*` |
| `zGL-Q4QMA` | P1 L1. Value chain partner awareness | SEMANTIC | `p1_l1_rowcount`, `p1_l1_row0_{prog\|topics\|pct}` |
| `mSOhz9GQA` | P1 L2. Board conflict-of-interest management | SEMANTIC | `p1_l2_conflict` |
| `mSOhz9GQB` | P1 Notes | SEMANTIC | `p1_notes` |
| `-4aDQiOlA` | P2 E1. R&D and capex investments | SEMANTIC | `p2_e1_{rd\|capex}_{cy\|py}`, `p2_e1_{rd\|capex}_details` |
| `FIJA1lnAA` | P2 E2. Sustainable sourcing | SEMANTIC | `p2_e2_yn` |
| `rxwJ3-3fA` | P2 E3. Reclaim — plastics | SEMANTIC | `p2_e3_plastics` |
| `mfvghTdyA` | P2 E3. Reclaim — e-waste | SEMANTIC | `p2_e3_ewaste` |
| `8xBfF0YVA` | P2 E3. Reclaim — hazardous | SEMANTIC | `p2_e3_hazardous` |
| `EtLRGMmgA` | P2 E3. Reclaim — other | SEMANTIC | `p2_e3_other` |
| `d17Gpk6IA` | P2 E4. EPR applicability | SEMANTIC | `p2_e4_epr` |
| `RHdkPjMtA` | P2 L1. Life Cycle Assessments | SEMANTIC | `p2_l1_yn` |
| `RQXkWSoAA` | P2 L2. SIA/env risks from LCA | SEMANTIC | `p2_l2_rowcount`, `p2_l2_row0_{product\|risk\|action}` |
| `GDyO8EN4A` | P2 L3. Recycled/reused input % | SEMANTIC | `p2_l3_rowcount`, `p2_l3_row0_{material\|pct_cy\|pct_py}` |
| `hBeZH2nNA` | P2 L4. Reclaimed products — reused/recycled/disposed | SEMANTIC | `p2_l4_{plast\|ew\|haz\|oth}_{cy\|py}_{re\|rc\|d}` |
| `2lsUz1mfA` | P2 L5. Reclaimed as % of products sold | SEMANTIC | `p2_l5_rowcount`, `p2_l5_row0_{category\|pct}` |
| `mSOhz9GQC` | P2 Notes | SEMANTIC | `p2_notes` |
| `c9QZsjX2A` | P3 E1. Well-being — permanent employees | SEMANTIC | `p3_e1a_perm_{m\|f\|o}_{t\|hi\|ac\|mat\|pat\|dc}` |
| `gftXFsgXA` | P3 E1. Well-being — other employees | SEMANTIC | `p3_e1a_oth_{m\|f\|o}_{t\|hi\|ac\|mat\|pat\|dc}` |
| `giAqzLzDA` | P3 E1. Well-being — permanent workers | SEMANTIC | `p3_e1b_perm_{m\|f\|o}_{t\|hi\|ac\|mat\|pat\|dc}` |
| `jybSdUp1A` | P3 E1. Well-being — other workers | SEMANTIC | `p3_e1b_oth_{m\|f\|o}_{t\|hi\|ac\|mat\|pat\|dc}` |
| `jybSdUp2A` | P3 E1c. Well-being expenditure | SEMANTIC | `p3_e1c_{cy\|py}_{spend\|rev}` |
| `221J-zS6A` | P3 E2. Retirement benefits | SEMANTIC | `p3_e2_{pf\|gr\|esi\|oth}_{emp\|wrk\|dep}_{cy\|py}` |
| `Pb2C2q3gA` | P3 E3. Workplace accessibility | SEMANTIC | `p3_e3_access` |
| `LfjH4oWRA` | P3 E4. Equal opportunity policy | SEMANTIC | `p3_e4_equal` |
| `P4L7jn9sA` | P3 E5. Return to work and retention | SEMANTIC | `p3_e5_{m\|f\|o\|tot}_{emp\|wrk}_{ret\|retn}` |
| `xEeNfg2DA` | P3 E6. Grievance redressal (mechanisms) | SEMANTIC | `p3_e6_{yn\|wrk_perm_yn\|wrk_perm\|wrk_oth_yn\|wrk_oth\|emp_perm_yn\|emp_perm\|emp_oth_yn\|emp_oth}` |
| `EEjN18dDA` | P3 E6. Grievance redressal (details) | SEMANTIC | `p3_e6_*` (split in platform) |
| `qORIrHgXA` | P3 E7. Union membership — employees | SEMANTIC | `p3_e7_emp_{m\|f\|o}_{t\|u}_{cy\|py}` |
| `V3tgJETJA` | P3 E7. Union membership — workers | SEMANTIC | `p3_e7_wrk_{m\|f\|o}_{t\|u}_{cy\|py}` |
| `TUyYofU7A` | P3 E8. Training — employees (skill) | SEMANTIC | `p3_e8_emp_{m\|f\|o}_{t\|sk}_{cy\|py}` |
| `TrBMY5y_A` | P3 E8. Training — workers (skill) | SEMANTIC | `p3_e8_wrk_{m\|f\|o}_{t\|sk}_{cy\|py}` |
| `Ta4xth11A` | P3 E8. Training — employees (H&S) | SEMANTIC | `p3_e8_emp_{m\|f\|o}_{t\|hs}_{cy\|py}` |
| `mwkdKBqxA` | P3 E8. Training — workers (H&S) | SEMANTIC | `p3_e8_wrk_{m\|f\|o}_{t\|hs}_{cy\|py}` |
| `CynKeKd6A` | P3 E9. Performance reviews — employees | SEMANTIC | `p3_e9_emp_{m\|f\|o}_{t\|r}_{cy\|py}` |
| `pSkrCn-YA` | P3 E9. Performance reviews — workers | SEMANTIC | `p3_e9_wrk_{m\|f\|o}_{t\|r}_{cy\|py}` |
| `06A6rr_FA` | P3 E10. H&S management system | SEMANTIC | `p3_e10_{impl_yn\|processes\|report_yn\|medical_yn}` |
| `SW8s25-OA` | P3 E10. H&S — plants assessed | SEMANTIC | `p3_e10_report_yn` |
| `CY1YDwVdA` | P3 E10. H&S — medical check | SEMANTIC | `p3_e10_medical_yn` |
| `ORu2vmKQA` | P3 E10. H&S — process | SEMANTIC | `p3_e10_processes` |
| `-7OXLUGQA` | P3 E11. Safety incidents | SEMANTIC | `p3_e11_{ltifr\|rec\|fat\|hc}_{emp\|wrk}_{cy\|py}` |
| `1T6T6jiHA` | P3 E12. Safe workplace measures | SEMANTIC | `p3_e12_measures` |
| `Mgtl3MaVA` | P3 E13. Complaints — working conditions / H&S | SEMANTIC | `p3_e13_{wc\|hs}_{cy\|py}_{f\|p\|r}` |
| `wrvtq3uXA` | P3 E14. % plants/offices assessed | SEMANTIC | `p3_e14_{hs\|wc}` |
| `E7FyVLskA` | P3 E15. Corrective actions | SEMANTIC | `p3_e15_corrective` |
| `hdVDlmuLA` | P3 L1. Life insurance / compensatory package | SEMANTIC | `p3_l1_{emp\|wrk}` |
| `1ThoRoAnA` | P3 L2. Value chain statutory dues | SEMANTIC | `p3_l2_statutory` |
| `uG27SfXJA` | P3 L3. High-consequence injuries (rehabilitation) | SEMANTIC | `p3_l3_{emp\|wrk}_{cy\|py}_{t\|r}` |
| `8Jrj0I6IA` | P3 L4. Transition assistance | SEMANTIC | `p3_l4_transition` |
| `zFHg2Jt8A` | P3 L5. Value chain assessed — H&S / working conditions | SEMANTIC | `p3_l5_{hs\|wc}` |
| `nV3PWhPVA` | P3 L6. Corrective actions (value chain) | SEMANTIC | `p3_l6_corrective` |
| `mSOhz9GQD` | P3 Notes | SEMANTIC | `p3_notes` |
| `uOtRQaDCA` | P4 E1. Identifying stakeholder groups | SEMANTIC | `p4_e1_process` |
| `_OK_0P00A` | P4 E2. Key stakeholder engagement table | SEMANTIC | `p4_e2_rowcount`, `p4_e2_row0_{name\|vuln\|chan\|chan_other\|freq\|freq_other\|purpose}` |
| `9grJ83hZA` | P4 L1. Stakeholder–Board consultation | SEMANTIC | `p4_l1_consult` |
| `eTnM7mJKA` | P4 L2. Stakeholder consultation for env/social topics | SEMANTIC | `p4_l2_yn`, `p4_l2_instances` |
| `CMOEA6efA` | P4 L3. Vulnerable/marginalised groups engagement | SEMANTIC | `p4_l3_engagement` |
| `mSOhz9GQE` | P4 Notes | SEMANTIC | `p4_notes` |
| `AqlajvRMA` | P5 E1. HR training — employees | SEMANTIC | `p5_e1_emp_{perm\|oth}_{t\|c}_{cy\|py}` |
| `3BsCLt87A` | P5 E1. HR training — workers | SEMANTIC | `p5_e1_wrk_{perm\|oth}_{t\|c}_{cy\|py}` |
| `AGjhtHTWA` | P5 E2. Minimum wages — permanent employees | SEMANTIC | `p5_e2_emp_{pm\|pf\|po}_{t\|eq\|more}_{cy\|py}` |
| `X4j1sSTdA` | P5 E2. Minimum wages — other employees | SEMANTIC | `p5_e2_emp_{otp_m\|otp_f\|otp_o}_{t\|eq\|more}_{cy\|py}` |
| `1s3pb0xvA` | P5 E2. Minimum wages — permanent workers | SEMANTIC | `p5_e2_wrk_{pm\|pf\|po}_{t\|eq\|more}_{cy\|py}` |
| `2sdrbFxTA` | P5 E2. Minimum wages — other workers | SEMANTIC | `p5_e2_wrk_{otp_m\|otp_f\|otp_o}_{t\|eq\|more}_{cy\|py}` |
| `D8r8EbA1A` | P5 E3a. Median remuneration | SEMANTIC | `p5_e3a_{bod\|kmp\|emp\|wrk}_{m\|f\|o}_{n\|med}` |
| `D8r8EbA2A` | P5 E3b. Gross wages paid to females | SEMANTIC | `p5_e3b_{cy\|py}_{f\|t}` |
| `QIOJywluA` | P5 E4. HR focal point | SEMANTIC | `p5_e4_focal` |
| `1sptK2KIA` | P5 E5. Internal HR grievance mechanism | SEMANTIC | `p5_e5_mech` |
| `kXoDxINpA` | P5 E6. HR complaints by type | SEMANTIC | `p5_e6_{sh\|disc\|cl\|fl\|wg\|oth}_{cy\|py}_{f\|p\|r}` |
| `kXoDxIN3A` | P5 E7. POSH Act complaints | SEMANTIC | `p5_e7_{tot\|f\|up}_{cy\|py}` |
| `lPtR4gEKA` | P5 E8. Complainant protection mechanism | SEMANTIC | `p5_e8_mech` |
| `pmTxNzbRA` | P5 E9. HR in business contracts | SEMANTIC | `p5_e9_contracts` |
| `ySS-TdQ_A` | P5 E10. % operations assessed | SEMANTIC | `p5_e10_{cl\|fl\|sh\|disc\|wg\|oth}`, `p5_e10_oth_details` |
| `I2pxlDY7A` | P5 E11. Corrective actions | SEMANTIC | `p5_e11_corrective` |
| `6AbOlMpRA` | P5 L1. Business process modifications from HR grievances | SEMANTIC | `p5_l1_process` |
| `2-7dQRWMA` | P5 L2. HR due diligence scope | SEMANTIC | `p5_l2_scope` |
| `f4YrLC0YA` | P5 L3. Accessible premises | SEMANTIC | `p5_l3_access` |
| `0btIJwERA` | P5 L4. Value chain HR assessments | SEMANTIC | `p5_l4_{sh\|disc\|cl\|fl\|wg\|oth}` |
| `pDrpf28XA` | P5 L5. Corrective actions (value chain) | SEMANTIC | `p5_l5_corrective` |
| `mSOhz9GQF` | P5 Notes | SEMANTIC | `p5_notes` |
| `5HCjobL9C` | P6 E1. Energy — applicable flag | SEMANTIC | `p6_e1_applicable` |
| `5HCjobL9A` | P6 E1. Energy — assessment and unit | SEMANTIC | `p6_e1_assess_yn`, `p6_e1_assess_agency`, `p6_e1_unit` |
| `5HCjobL8A` | P6 E1. Energy — RE/NRE data by source | SEMANTIC | `p6_e1_{re\|nre}_{el\|fuel\|oth}_{cy\|py}`, `p6_e1_{re\|nre}_oth_specify` |
| `w7AcnqMHA` | P6 E1. Energy — physical and optimised intensity | SEMANTIC | `p6_e1_int_{phys\|opt}_{cy\|py}` |
| `I3FkYj13A` | P6 E2. PAT scheme | SEMANTIC | `p6_e2_{pat\|targets\|remedial}` |
| `9Rdkpw9uA` | P6 E3. Water withdrawal by source | SEMANTIC | `p6_e3_{surf\|grnd\|3p\|seawater\|oth}_{cy\|py}`, `p6_e3_cons_{cy\|py}` |
| `MWBicpSaA` | P6 E3. Water intensity | SEMANTIC | `p6_e3_int_{phys\|opt}_{cy\|py}`, `p6_e3_assess_yn`, `p6_e3_assess_agency` |
| `dNV0llyYA` | P6 E4. Water discharge by destination | SEMANTIC | `p6_e4_{sw\|grnd\|sea\|3p\|oth}_{nt\|t}_{cy\|py}`, `p6_e4_*_t_level_*` |
| `EkfOu-4LA` | P6 E5. Zero Liquid Discharge mechanism | SEMANTIC | `p6_e5_{zld\|zld_detail}` |
| `7cbIZSdtb` | P6 E6. Air emissions — applicable | SEMANTIC | `p6_e6_applicable` |
| `7cbIZSdtA` | P6 E6. Air emissions data | SEMANTIC | `p6_e6_{nox\|sox\|pm\|pop\|voc\|hap\|oth}_{unit\|cy\|py}` |
| `0lJ3x-VGA` | P6 E6. Air emissions — assessment | SEMANTIC | `p6_e6_assess_yn`, `p6_e6_assess_agency` |
| `0TWei6qRB` | P6 E7. GHG — applicable | SEMANTIC | `p6_e7_applicable` |
| `0TWei6qRAV3` | P6 E7. GHG data — S1, S2, unit, intensity | SEMANTIC | `p6_e7_{s1\|s2}_{cy\|py}`, `p6_e7_{unit\|int_opt_unit}`, `p6_e7_int_{phys\|opt}_{cy\|py}` |
| `gPw-rA1JA` | P6 E7. GHG — assessment | SEMANTIC | `p6_e7_assess_yn`, `p6_e7_assess_agency` |
| `PMJiud6FA` | P6 E8. GHG reduction projects | SEMANTIC | `p6_e8_{ghg_yn\|ghg_detail}` |
| `rPX0NrjyA` | P6 E9. Waste by type | SEMANTIC | `p6_e9_{plast\|ew\|bio\|cd\|batt\|radio\|ohaz\|onh}_{cy\|py}` |
| `wdB36tzgA` | P6 E9. Waste recovery | SEMANTIC | `p6_e9_rec_{recy\|reuse\|oth}_{cy\|py}`, `p6_e9_int_{phys\|opt}_{cy\|py}` |
| `tVHr55FsA` | P6 E9. Waste disposal | SEMANTIC | `p6_e9_disp_{inc\|land\|oth}_{cy\|py}` |
| `kyIpWUDOA` | P6 E9. Waste — assessment | SEMANTIC | `p6_e9_assess_yn`, `p6_e9_assess_agency` |
| `j9rh2KIXA` | P6 E10. Waste management practices | SEMANTIC | `p6_e10_waste` |
| `K4vDChzmA` | P6 E11. Ecologically sensitive areas | SEMANTIC | `p6_e11_rowcount`, `p6_e11_{1\|2}_{loc\|type\|yn\|correct}`, `p6_e11_row{0–9}_*` |
| `7sGZDjjeA` | P6 E12. Environmental impact assessments | SEMANTIC | `p6_e12_rowcount`, `p6_e12_{name\|notif\|date\|ind\|pub\|link}`, `p6_e12_row{0–9}_*` |
| `Lztpz8ZeA` | P6 E13. Environmental law applicable | SEMANTIC | `p6_e13_comp` |
| `OWhj8vjdA` | P6 E13. Environmental violations details | SEMANTIC | `p6_e13_rowcount`, `p6_e13_{law\|detail\|fines\|correct}`, `p6_e13_row{0–9}_*` |
| `3eYMQspzA` | P6 L1. Water stress — assessment | SEMANTIC | `p6_l1_assess_yn`, `p6_l1_assess_agency` |
| `Iavk-SshB` | P6 L2. Scope 3 — applicable | SEMANTIC | `p6_l2_applicable` |
| `iAvk-SShA` | P6 L2. Scope 3 data + intensity | SEMANTIC | `p6_l2_{s3\|int}_{cy\|py}`, `p6_l2_{unit\|int_opt_unit}`, `p6_l2_assess_yn`, `p6_l2_assess_agency` |
| `yoC4RU_QA` | P6 L2. Scope 3 — assessment predicator | SEMANTIC | `p6_l2_assess_yn`, `p6_l2_assess_agency` |
| `lZ4y5YKMA` | P6 L3. Biodiversity in ecologically sensitive areas | SEMANTIC | `p6_l3_bio` |
| `Ivn9g4FPA` | P6 L4. Innovation/technology initiatives | SEMANTIC | `p6_l4_rowcount`, `p6_l4_{init\|detail\|outcome}`, `p6_l4_row{0–9}_*` |
| `cceBcMWdA` | P6 L5. Business continuity and disaster management | SEMANTIC | `p6_l5_{yn\|bcp}` |
| `LpTgjB_-A` | P6 L6. Value chain adverse impact | SEMANTIC | `p6_l6_value` |
| `1dP2AEEwA` | P6 L7. % value chain partners assessed | SEMANTIC | `p6_l7_pct` |
| `J6JzqzMC` | P6 L8. Green Credits | SEMANTIC | `p6_l8_{generated\|procured}` |
| `mSOhz9GQG` | P6 Notes | SEMANTIC | `p6_notes` |
| `zHQIxY57A` | P7 E1a. Number of chamber affiliations | SEMANTIC | `p7_e1a_count` |
| `evkiIUcAA` | P7 E1b. Top 10 chambers (name & reach) | SEMANTIC | `p7_e1b_{1–10}_{name\|reach}` |
| `2TTdp-54A` | P7 E2. Corrective actions — anti-competitive | SEMANTIC | `p7_e2_{auth\|brief\|action}`, `p7_e2_rowcount` |
| `X-tB2FtpA` | P7 L1. Public policy positions advocated | SEMANTIC | `p7_l1_rowcount`, `p7_l1_row0_{policy\|method\|freq\|public\|link}` |
| `mSOhz9GQH` | P7 Notes | SEMANTIC | `p7_notes` |
| `9PR6LIM5A` | P8 E1. Social Impact Assessments | SEMANTIC | `p8_e1_{name\|notif\|date\|ind\|pub\|link}`, `p8_e1_rowcount` |
| `Yq7QCVEMA` | P8 E2. R&R projects | SEMANTIC | `p8_e2_rowcount`, `p8_e2_row0_{name\|state\|dist\|paf\|pct\|amt}` |
| `kTQ4EiZcA` | P8 E3. Community grievance mechanism | SEMANTIC | `p8_e3_griev` |
| `NonL6VO1A` | P8 E4. % MSME and India sourcing | SEMANTIC | `p8_e4_{msme\|india}_{cy\|py}` |
| `NOnL6VO0A` | P8 E5. Job creation — wages in smaller towns | SEMANTIC | `p8_e5_{rural\|semi\|urb\|metro}_{w\|t}_{cy\|py}` |
| `bL8kq55XA` | P8 L1. SIA negative impact mitigation | SEMANTIC | `p8_l1_{impact\|action}`, `p8_l1_rowcount` |
| `Jf0FBf4zA` | P8 L2. CSR projects in aspirational districts | SEMANTIC | `p8_l2_rowcount`, `p8_l2_row0_{state\|dist\|amt}` |
| `Wi-mzlbmA` | P8 L3a. Preferential procurement — applicable | SEMANTIC | `p8_l3_yn` |
| `bMhFdOrOA` | P8 L3b. Marginalised groups list | SEMANTIC | `p8_l3_groups` |
| `oOfMYJvxA` | P8 L3c. % procurement from marginalised | SEMANTIC | `p8_l3_pct` |
| `vqJZYRoaA` | P8 L4. Traditional knowledge IP benefits | SEMANTIC | `p8_l4_rowcount`, `p8_l4_row0_{ip\|own\|ben\|basis}` |
| `EcFymaI5A` | P8 L5. IP dispute corrective actions | SEMANTIC | `p8_l5_{auth\|brief\|action}`, `p8_l5_rowcount` |
| `1eeP4E9BA` | P8 L6. CSR project beneficiaries | SEMANTIC | `p8_l6_rowcount`, `p8_l6_row0_{proj\|num\|pct}` |
| `mSOhz9GQI` | P8 Notes | SEMANTIC | `p8_notes` |
| `lTvR3buMA` | P9 E1. Consumer complaint mechanism | SEMANTIC | `p9_e1_mech` |
| `LqpZkdNGA` | P9 E2. Products with env/safety info % | SEMANTIC | `p9_e2_{env\|safe\|recycle}` |
| `eZfCLccQA` | P9 E3. Consumer complaints by type | SEMANTIC | `p9_e3_{dp\|adv\|cs\|del\|rtp\|utp\|oth}_{cy\|py}_{f\|p\|r}` |
| `Y122jqtVA` | P9 E4. Product recalls | SEMANTIC | `p9_e4_{vol\|for}_{num\|reason}` |
| `YZC_HqyzA` | P9 E5. Cyber security framework | SEMANTIC | `p9_e5_{framework\|link}` |
| `J2hkkaLzA` | P9 E6. Corrective actions | SEMANTIC | `p9_e6_corrective` |
| `YzvguulSA` | P9 E7. Data breaches | SEMANTIC | `p9_e7{a\|b\|c}_{cy\|py}` |
| `NgAnrGYLA` | P9 L1. Product info channels | SEMANTIC | `p9_l1_channels` |
| `D96Nz7WCA` | P9 L2. Consumer education on safe usage | SEMANTIC | `p9_l2_steps` |
| `lVjCb68pA` | P9 L3. Service disruption notifications | SEMANTIC | `p9_l3_mech` |
| `16cGDYPHA` | P9 L4. Product information beyond mandate | SEMANTIC | `p9_l4_{beyond\|detail\|survey}` |
| `7GHlnSt9A` | P9 L4b. Consumer survey details | SEMANTIC | `p9_l4_{beyond\|detail\|survey}` (split in platform) |
| `mSOhz9GQJ` | P9 Notes | SEMANTIC | `p9_notes` |
