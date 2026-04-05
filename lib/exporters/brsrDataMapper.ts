/**
 * Maps answers + org to BRSRExportData for docx/xlsx export.
 * Uses runCalculations for computed fields; empty/null → "—".
 */
import { runCalculations } from "@/lib/brsr/calcEngine";
import {
  GENERAL_LABELS,
  SECTION_B_LABELS,
  P6_PREFIX_LABELS,
  getAssignmentBlocksForPanel,
} from "@/lib/brsr/assignmentBlocks";
import { getQuestionCodesForPanel, NGRBC_PRINCIPLE_TITLES } from "@/lib/brsr/questionConfig";
import type {
  BRSRComplaintsRow,
  BRSREmployeeRow,
  BRSREmployeesSection,
  BRSRExportData,
  BRSRHoldingRow,
  BRSRIndicator,
  BRSRMaterialRow,
  BRSROpsLocationRow,
  BRSROrg,
  BRSRPoliciesMatrixRow,
  BRSRPrinciple,
  BRSRProductsRow,
  BRSRReportingYear,
  BRSRSectionA,
  BRSRSectionB,
  BRSRSectionC,
  BRSRTurnoverRow,
  BRSRWomenParticipationRow,
  SBQ10Row,
  SBQ11Row,
  OrgRow,
  PrincipleBlock,
  StructuredTable,
} from "@/types/brsr";

const EMPTY = "—";

function val(v: string | undefined | null): string {
  const s = String(v ?? "").trim();
  return s === "" ? EMPTY : s;
}

function derivePreviousYear(current: string): string {
  // "2024-25" -> "2023-24"
  const m = current.match(/^(\d{4})-(\d{2})$/);
  if (!m) return current;
  const y1 = parseInt(m[1], 10);
  const y2 = parseInt(m[2], 10);
  return `${y1 - 1}-${String(y2 - 1).padStart(2, "0")}`;
}

function mapOrg(org: OrgRow, reportingYear: string): { org: BRSROrg; reportingYear: BRSRReportingYear } {
  const current = reportingYear || org.reporting_year || "2024-25";
  const previous = derivePreviousYear(current);
  return {
    org: {
      name: val(org.name),
      cin: val(org.cin),
      sector: val(org.industry),
      companyType: val(org.company_type),
      hqCity: val(org.hq_city),
      hqCountry: val(org.country),
      website: val(org.website),
    },
    reportingYear: { current, previous },
  };
}

/** Group gen codes by subsection (I=1-15, II=16-17, III=18-19c, IV=20a-22, V=23, VI=24, VII=25, VIII=26) */
function getGenSubsection(code: string): string {
  const m = code.match(/^gen_(\d+[a-z]?)_/);
  if (!m) return "details";
  const key = m[1];
  const n = parseInt(key, 10) || 0;
  if (n >= 1 && n <= 15) return "details";
  if (n === 16 || n === 17) return "productsServices";
  if (n === 18 || n === 19 || key === "19b" || key === "19c") return "operations";
  if (key === "20a" || key === "20b" || n === 21 || n === 22) return "employees";
  if (n === 23) return "holdingSubsidiary";
  if (n === 24) return "csr";
  if (n === 25) return "complaints";
  if (n === 26) return "materialIssues";
  return "details";
}

function getGenLabel(code: string): string {
  const m = code.match(/^gen_(\d+[a-z]?)(?:_(\d+))?(?:_(.+))?$/);
  if (!m) return code;
  const [, key, row, field] = m;
  const base = GENERAL_LABELS[key] ?? `${key}`;
  if (row && field) {
    const fieldLabel = field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${base} – Row ${row} – ${fieldLabel}`;
  }
  return base;
}

function mapProductsServices(answers: Record<string, string>): BRSRSectionA["productsServices"] {
  const get = (code: string) => val(answers[code]);
  const businessActivities: BRSRProductsRow[] = [];
  const productsSold: BRSRProductsRow[] = [];
  for (let i = 1; i <= 5; i++) {
    const main = get(`gen_16_${i}_main`);
    const activity = get(`gen_16_${i}_activity`);
    const pct = get(`gen_16_${i}_pct`);
    if (main || activity || pct) businessActivities.push({ main, activity, pct });
    const product = get(`gen_17_${i}_product`);
    const nic = get(`gen_17_${i}_nic`);
    const pct17 = get(`gen_17_${i}_pct`);
    if (product || nic || pct17) productsSold.push({ product, nic, pct: pct17 });
  }
  return { businessActivities, productsSold };
}

function mapOperations(answers: Record<string, string>): BRSRSectionA["operations"] {
  const get = (code: string) => val(answers[code]);
  const natPlants = get("gen_18_nat_plants");
  const natOffices = get("gen_18_nat_offices");
  const intPlants = get("gen_18_int_plants");
  const intOffices = get("gen_18_int_offices");
  const locations: BRSROpsLocationRow[] = [];
  if (natPlants || natOffices) {
    const p = natPlants || "0";
    const o = natOffices || "0";
    const tot = (parseFloat(p.replace(/,/g, "")) || 0) + (parseFloat(o.replace(/,/g, "")) || 0);
    locations.push({ location: "National", plants: p, offices: o, total: String(tot) });
  }
  if (intPlants || intOffices) {
    const p = intPlants || "0";
    const o = intOffices || "0";
    const tot = (parseFloat(p.replace(/,/g, "")) || 0) + (parseFloat(o.replace(/,/g, "")) || 0);
    locations.push({ location: "International", plants: p, offices: o, total: String(tot) });
  }
  const numberOfLocations: BRSRIndicator[] = [
    { label: "National (No. of States)", value: get("gen_19_nat_states") },
    { label: "International (No. of Countries)", value: get("gen_19_int_countries") },
  ];
  const markets: BRSRIndicator[] = [];
  const marketCodes = ["gen_19_nat_states", "gen_19_int_countries", "gen_19b_export_pct", "gen_19c_customers"];
  const marketLabels = ["19. Markets served – National (No. of States)", "19. Markets served – International (No. of Countries)", "19(b). Contribution of exports as % of total turnover", "19(c). Brief on types of customers"];
  marketCodes.forEach((code, i) => markets.push({ label: marketLabels[i], value: get(code) }));
  return { locations, numberOfLocations, markets };
}

function mapHoldingSubsidiary(answers: Record<string, string>): BRSRHoldingRow[] {
  const get = (code: string) => val(answers[code]);
  const rows: BRSRHoldingRow[] = [];
  for (let i = 1; i <= 5; i++) {
    const name = get(`gen_23_${i}_name`);
    const type = get(`gen_23_${i}_type`);
    const pct = get(`gen_23_${i}_pct`);
    const br = get(`gen_23_${i}_br`);
    if (name || type || pct || br) rows.push({ name, type, pct, br });
  }
  return rows;
}

function mapMaterialIssues(answers: Record<string, string>): BRSRMaterialRow[] {
  const get = (code: string) => val(answers[code]);
  const rows: BRSRMaterialRow[] = [];
  for (let i = 1; i <= 5; i++) {
    const issue = get(`gen_26_${i}_issue`);
    const riskOrOpp = get(`gen_26_${i}_ro`);
    const rationale = get(`gen_26_${i}_rationale`);
    const approach = get(`gen_26_${i}_approach`);
    const financial = get(`gen_26_${i}_fin`);
    if (issue || riskOrOpp || rationale || approach || financial) {
      rows.push({ issue, riskOrOpp, rationale, approach, financial });
    }
  }
  return rows;
}

const STAKEHOLDER_LABELS: Record<string, string> = {
  comm: "Communities",
  sha: "Shareholders",
  inv: "Investors",
  emp: "Employees And Workers",
  cust: "Customers",
  vc: "Value Chain Partners",
  oth: "Others",
};

function pct(num: string, denom: string): string {
  const n = parseFloat(String(num).replace(/,/g, ""));
  const d = parseFloat(String(denom).replace(/,/g, ""));
  if (!d || isNaN(n) || isNaN(d)) return "";
  const v = (n / d) * 100;
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}

function mapEmployees(answers: Record<string, string>): BRSREmployeesSection {
  const get = (code: string) => val(answers[code]);
  const mkEmp = (cat: string, tot: string, m: string, f: string, o: string, skipPct?: boolean): BRSREmployeeRow => ({
    category: cat,
    total: tot,
    male: m,
    malePct: skipPct ? "" : pct(m, tot),
    female: f,
    femalePct: skipPct ? "" : pct(f, tot),
    other: o || undefined,
    otherPct: skipPct ? undefined : (o && tot ? pct(o, tot) : undefined),
  });
  const empRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", get("gen_20a_emp_perm_total"), get("gen_20a_emp_perm_m"), get("gen_20a_emp_perm_f"), get("gen_20a_emp_perm_o")),
    mkEmp("Other than Permanent (F)", get("gen_20a_emp_other_total"), get("gen_20a_emp_other_m"), get("gen_20a_emp_other_f"), get("gen_20a_emp_other_o")),
    mkEmp("Total employees (E+F)", get("gen_20a_emp_total"), get("gen_20a_emp_total_m"), get("gen_20a_emp_total_f"), get("gen_20a_emp_total_o"), true),
  ];
  const wrkPermT = get("gen_20a_wrk_perm_total");
  const wrkOthT = get("gen_20a_wrk_other_total");
  const wrkTotal = get("gen_20a_wrk_total") || (wrkPermT && wrkOthT ? String((parseFloat(String(wrkPermT).replace(/,/g, "")) || 0) + (parseFloat(String(wrkOthT).replace(/,/g, "")) || 0)) : "");
  const wrkRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", wrkPermT, get("gen_20a_wrk_perm_m"), get("gen_20a_wrk_perm_f"), get("gen_20a_wrk_perm_o")),
    mkEmp("Other than Permanent (F)", wrkOthT, get("gen_20a_wrk_other_m"), get("gen_20a_wrk_other_f"), get("gen_20a_wrk_other_o")),
    mkEmp("Total workers (E+F)", wrkTotal, get("gen_20a_wrk_total_m") || "", get("gen_20a_wrk_total_f") || "", get("gen_20a_wrk_total_o") || "", true),
  ];
  const daEmpRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", get("gen_20b_emp_perm_total"), get("gen_20b_emp_perm_m"), get("gen_20b_emp_perm_f"), get("gen_20b_emp_perm_o")),
    mkEmp("Other than Permanent (F)", get("gen_20b_emp_other_total"), get("gen_20b_emp_other_m"), get("gen_20b_emp_other_f"), get("gen_20b_emp_other_o")),
    mkEmp("Total employees (E+F)", get("gen_20b_emp_total"), get("gen_20b_emp_total_m"), get("gen_20b_emp_total_f"), get("gen_20b_emp_total_o"), true),
  ];
  const daWrkRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", get("gen_20b_wrk_perm_total"), get("gen_20b_wrk_perm_m"), get("gen_20b_wrk_perm_f"), get("gen_20b_wrk_perm_o")),
    mkEmp("Other than Permanent (F)", get("gen_20b_wrk_other_total"), get("gen_20b_wrk_other_m"), get("gen_20b_wrk_other_f"), get("gen_20b_wrk_other_o")),
    mkEmp("Total workers (E+F)", get("gen_20b_wrk_total"), get("gen_20b_wrk_total_m"), get("gen_20b_wrk_total_f"), get("gen_20b_wrk_total_o"), true),
  ];
  const womenParticipation: BRSRWomenParticipationRow[] = [
    { category: "Board of Directors", total: get("gen_21_bod_total"), female: get("gen_21_bod_f"), femalePct: pct(get("gen_21_bod_f"), get("gen_21_bod_total")) },
    { category: "Key Management Personnel", total: get("gen_21_kmp_total"), female: get("gen_21_kmp_f"), femalePct: pct(get("gen_21_kmp_f"), get("gen_21_kmp_total")) },
  ];
  const turnoverEmployees: BRSRTurnoverRow[] = [
    { year: "Current Year", male: get("gen_22_emp_cy_m"), female: get("gen_22_emp_cy_f"), other: get("gen_22_emp_cy_o"), total: get("gen_22_emp_cy_t") },
    { year: "Previous Year", male: get("gen_22_emp_py_m"), female: get("gen_22_emp_py_f"), other: get("gen_22_emp_py_o"), total: get("gen_22_emp_py_t") },
    { year: "Prior to Previous Year", male: get("gen_22_emp_pp_m"), female: get("gen_22_emp_pp_f"), other: get("gen_22_emp_pp_o"), total: get("gen_22_emp_pp_t") },
  ];
  const turnoverWorkers: BRSRTurnoverRow[] = [
    { year: "Current Year", male: get("gen_22_wrk_cy_m"), female: get("gen_22_wrk_cy_f"), other: get("gen_22_wrk_cy_o"), total: get("gen_22_wrk_cy_t") },
    { year: "Previous Year", male: get("gen_22_wrk_py_m"), female: get("gen_22_wrk_py_f"), other: get("gen_22_wrk_py_o"), total: get("gen_22_wrk_py_t") },
    { year: "Prior to Previous Year", male: get("gen_22_wrk_pp_m"), female: get("gen_22_wrk_pp_f"), other: get("gen_22_wrk_pp_o"), total: get("gen_22_wrk_pp_t") },
  ];
  return {
    employees: empRows,
    workers: wrkRows,
    differentlyAbledEmployees: daEmpRows,
    differentlyAbledWorkers: daWrkRows,
    womenParticipation,
    turnoverEmployees,
    turnoverWorkers,
  };
}

function mapComplaints(answers: Record<string, string>): BRSRComplaintsRow[] {
  const get = (code: string) => val(answers[code]);
  const prefixes = ["comm", "sha", "inv", "emp", "cust", "vc", "oth"];
  const rows: BRSRComplaintsRow[] = [];
  for (const prefix of prefixes) {
    const stakeholder = STAKEHOLDER_LABELS[prefix] ?? prefix;
    const mechanism = get(`gen_25_${prefix}_mech`);
    const webLink = get(`gen_25_${prefix}_weblink`) || EMPTY;
    const cyFiled = get(`gen_25_${prefix}_cy_f`);
    const cyPending = get(`gen_25_${prefix}_cy_p`);
    const cyRemark = get(`gen_25_${prefix}_cy_rem`);
    const pyFiled = get(`gen_25_${prefix}_py_f`);
    const pyPending = get(`gen_25_${prefix}_py_p`);
    const pyRemark = get(`gen_25_${prefix}_py_rem`);
    rows.push({ stakeholder, mechanism, webLink: webLink || EMPTY, cyFiled, cyPending, cyRemark, pyFiled, pyPending, pyRemark });
  }
  return rows;
}

function mapStockExchangeTable(answers: Record<string, string>): string {
  const get = (code: string) => (answers[code] ?? "").trim();
  const rows: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const ex = get(`gen_10_${i}_exchange`);
    const desc = get(`gen_10_${i}_description`);
    const country = get(`gen_10_${i}_country`);
    if (ex || desc || country) {
      const parts = [ex || EMPTY, desc || EMPTY, country || EMPTY];
      rows.push(parts.join(" | "));
    }
  }
  return rows.length > 0 ? rows.join("\n") : "";
}

function mapAssurerTable(answers: Record<string, string>): string {
  const get = (code: string) => (answers[code] ?? "").trim();
  const rows: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const company = get(`gen_14_${i}_company`);
    const id = get(`gen_14_${i}_id`);
    const name = get(`gen_14_${i}_assurer_name`);
    const designation = get(`gen_14_${i}_designation`);
    const date = get(`gen_14_${i}_date`);
    if (company || id || name || designation || date) {
      const parts = [company || EMPTY, id || EMPTY, name || EMPTY, designation || EMPTY, date || EMPTY];
      rows.push(parts.join(" | "));
    }
  }
  return rows.length > 0 ? rows.join("\n") : "";
}

function mapSectionA(answers: Record<string, string>): BRSRSectionA {
  const get = (code: string) => val(answers[code]);
  const details: BRSRIndicator[] = [];
  const csr: BRSRIndicator[] = [];

  const blocks = getAssignmentBlocksForPanel("general");
  for (const block of blocks) {
    for (const code of block.questionCodes) {
      if (code.endsWith("_row_count")) continue;
      if (code.startsWith("gen_10_") && code !== "gen_10_row_count") continue;
      if (code.startsWith("gen_14_") && code !== "gen_14_row_count") continue;
      const sub = getGenSubsection(code);
      if (sub === "details") details.push({ label: getGenLabel(code), value: get(code) });
      else if (sub === "csr") csr.push({ label: getGenLabel(code), value: get(code) });
    }
  }
  const stockEx = mapStockExchangeTable(answers);
  const assurers = mapAssurerTable(answers);
  const idx11 = details.findIndex((d) => d.label.startsWith("11."));
  if (stockEx && idx11 >= 0) details.splice(idx11, 0, { label: GENERAL_LABELS["10"], value: val(stockEx) });
  else if (stockEx) details.push({ label: GENERAL_LABELS["10"], value: val(stockEx) });

  // Fold Q15 (assurance type) into Q14 value and override Q14 label per BRSR reference format.
  // Q14 becomes: "Whether the company has undertaken reasonable assurance of the BRSR Core?"
  // Q15 is removed as a standalone row.
  const assuranceType = (answers["gen_15_assurance_type"] ?? "").trim();
  const q14Value = [assurers, assuranceType].filter(Boolean).join("\nAssurance type: ");
  const q15IdxBefore = details.findIndex((d) => d.label.startsWith("15."));
  const q14Label = "14. Whether the company has undertaken reasonable assurance of the BRSR Core?";
  if (q15IdxBefore >= 0) {
    details.splice(q15IdxBefore, 0, { label: q14Label, value: q14Value || EMPTY });
  } else {
    details.push({ label: q14Label, value: q14Value || EMPTY });
  }
  // Remove the Q15 row that was separately added from the iteration (assurance type is now in Q14)
  const q15IdxAfter = details.findIndex((d) => d.label.startsWith("15."));
  if (q15IdxAfter >= 0) details.splice(q15IdxAfter, 1);

  const calcDisplay = runCalculations(answers);
  const answersWithCalc = { ...answers, ...Object.fromEntries(Object.entries(calcDisplay).map(([k, v]) => [k, v.replace(/%$/, "")])) };
  return {
    details,
    productsServices: mapProductsServices(answers),
    operations: mapOperations(answers),
    employees: mapEmployees(answersWithCalc),
    holdingSubsidiary: mapHoldingSubsidiary(answers),
    csr,
    complaints: mapComplaints(answers),
    materialIssues: mapMaterialIssues(answers),
  };
}

function getSbLabel(code: string): string {
  const m = code.match(/^sb_(\d+[a-z]?)(?:_p(\d+)|_statement|_authority|_other)$/);
  if (!m) return code;
  const [, key, principle] = m;
  const base = SECTION_B_LABELS[key] ?? key;
  if (principle) return `${base} – Principle ${principle}`;
  return base;
}

const POLICIES_MATRIX_KEYS = [
  "1a", "1b", "1c", "2", "3", "4", "5", "6", "9", "10a", "10b", "11",
] as const;

function format10Cell(review: string, freq: string, desc: string): string {
  const parts: string[] = [];
  if (review && review !== "—") parts.push(`Oversight: ${review}`);
  if (freq && freq !== "—") parts.push(`Freq: ${freq}`);
  if (desc && desc !== "—") parts.push(desc);
  return parts.length > 0 ? parts.join(" | ") : "—";
}

function format11Cell(yn: string, agency: string): string {
  if (!yn || yn === "—") return "—";
  if (yn === "No") return "No";
  if (agency && agency !== "—") return `Yes – ${agency}`;
  return "Yes";
}

const PRINCIPLE_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

function mapSectionB(answers: Record<string, string>): BRSRSectionB {
  const get = (code: string) => val(answers[code]);
  const policies: BRSRPoliciesMatrixRow[] = [];

  for (const key of POLICIES_MATRIX_KEYS) {
    const question = SECTION_B_LABELS[key] ?? key;
    let p1: string, p2: string, p3: string, p4: string, p5: string, p6: string, p7: string, p8: string, p9: string;
    if (key === "10a") {
      p1 = format10Cell(get("sb_10a_p1_review"), get("sb_10a_p1_freq"), get("sb_10a_p1"));
      p2 = format10Cell(get("sb_10a_p2_review"), get("sb_10a_p2_freq"), get("sb_10a_p2"));
      p3 = format10Cell(get("sb_10a_p3_review"), get("sb_10a_p3_freq"), get("sb_10a_p3"));
      p4 = format10Cell(get("sb_10a_p4_review"), get("sb_10a_p4_freq"), get("sb_10a_p4"));
      p5 = format10Cell(get("sb_10a_p5_review"), get("sb_10a_p5_freq"), get("sb_10a_p5"));
      p6 = format10Cell(get("sb_10a_p6_review"), get("sb_10a_p6_freq"), get("sb_10a_p6"));
      p7 = format10Cell(get("sb_10a_p7_review"), get("sb_10a_p7_freq"), get("sb_10a_p7"));
      p8 = format10Cell(get("sb_10a_p8_review"), get("sb_10a_p8_freq"), get("sb_10a_p8"));
      p9 = format10Cell(get("sb_10a_p9_review"), get("sb_10a_p9_freq"), get("sb_10a_p9"));
    } else if (key === "10b") {
      p1 = format10Cell(get("sb_10b_p1_review"), get("sb_10b_p1_freq"), get("sb_10b_p1"));
      p2 = format10Cell(get("sb_10b_p2_review"), get("sb_10b_p2_freq"), get("sb_10b_p2"));
      p3 = format10Cell(get("sb_10b_p3_review"), get("sb_10b_p3_freq"), get("sb_10b_p3"));
      p4 = format10Cell(get("sb_10b_p4_review"), get("sb_10b_p4_freq"), get("sb_10b_p4"));
      p5 = format10Cell(get("sb_10b_p5_review"), get("sb_10b_p5_freq"), get("sb_10b_p5"));
      p6 = format10Cell(get("sb_10b_p6_review"), get("sb_10b_p6_freq"), get("sb_10b_p6"));
      p7 = format10Cell(get("sb_10b_p7_review"), get("sb_10b_p7_freq"), get("sb_10b_p7"));
      p8 = format10Cell(get("sb_10b_p8_review"), get("sb_10b_p8_freq"), get("sb_10b_p8"));
      p9 = format10Cell(get("sb_10b_p9_review"), get("sb_10b_p9_freq"), get("sb_10b_p9"));
    } else if (key === "11") {
      p1 = format11Cell(get("sb_11_p1"), get("sb_11_p1_agency"));
      p2 = format11Cell(get("sb_11_p2"), get("sb_11_p2_agency"));
      p3 = format11Cell(get("sb_11_p3"), get("sb_11_p3_agency"));
      p4 = format11Cell(get("sb_11_p4"), get("sb_11_p4_agency"));
      p5 = format11Cell(get("sb_11_p5"), get("sb_11_p5_agency"));
      p6 = format11Cell(get("sb_11_p6"), get("sb_11_p6_agency"));
      p7 = format11Cell(get("sb_11_p7"), get("sb_11_p7_agency"));
      p8 = format11Cell(get("sb_11_p8"), get("sb_11_p8_agency"));
      p9 = format11Cell(get("sb_11_p9"), get("sb_11_p9_agency"));
    } else {
      p1 = get(`sb_${key}_p1`);
      p2 = get(`sb_${key}_p2`);
      p3 = get(`sb_${key}_p3`);
      p4 = get(`sb_${key}_p4`);
      p5 = get(`sb_${key}_p5`);
      p6 = get(`sb_${key}_p6`);
      p7 = get(`sb_${key}_p7`);
      p8 = get(`sb_${key}_p8`);
      p9 = get(`sb_${key}_p9`);
    }
    policies.push({ key, question, p1, p2, p3, p4, p5, p6, p7, p8, p9 });
  }

  const leadership: BRSRIndicator[] = [];
  for (let n = 1; n <= 9; n++) {
    leadership.push({ label: `9. Committee of Board – Principle ${n}`, value: get(`sb_9_p${n}`) });
  }

  const q10Performance: SBQ10Row[] = PRINCIPLE_NUMS.map((n) => ({
    principle: `P${n}`,
    review: get(`sb_10a_p${n}_review`),
    freq: get(`sb_10a_p${n}_freq`),
    desc: get(`sb_10a_p${n}`),
  }));

  const q10Compliance: SBQ10Row[] = PRINCIPLE_NUMS.map((n) => ({
    principle: `P${n}`,
    review: get(`sb_10b_p${n}_review`),
    freq: get(`sb_10b_p${n}_freq`),
    desc: get(`sb_10b_p${n}`),
  }));

  const q11Assessment: SBQ11Row[] = PRINCIPLE_NUMS.map((n) => ({
    principle: `P${n}`,
    yn: get(`sb_11_p${n}`),
    agency: get(`sb_11_p${n}_agency`),
  }));

  return {
    policies,
    directorStatement: get("sb_7_statement"),
    highestAuthority: get("sb_8_authority"),
    leadership,
    q10Performance,
    q10Compliance,
    q11Assessment,
  };
}

function getPrincipleLabel(code: string, principleNum: number): string {
  if (principleNum === 6) {
    const m = code.match(/^(p6_[el]\d+)/);
    return m ? (P6_PREFIX_LABELS[m[1]] ?? code) : code;
  }
  const blocks = getAssignmentBlocksForPanel(`p${principleNum}` as "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8" | "p9");
  for (const block of blocks) {
    if (block.questionCodes.includes(code)) return block.label;
  }
  const m = code.match(/^p\d+_(e\d+|l\d+)/);
  if (m) {
    const suffix = m[1];
    const isLeadership = suffix.startsWith("l");
    return `${isLeadership ? "Leadership" : "Essential"} ${suffix.slice(1)}`;
  }
  return code;
}

const P6_SUBSECTION_PREFIXES = [
  "p6_e1", "p6_e2", "p6_e3", "p6_e4", "p6_e5", "p6_e6", "p6_e7", "p6_e8", "p6_e9",
  "p6_e10", "p6_e11", "p6_e12", "p6_e13",
  "p6_l1", "p6_l2", "p6_l3", "p6_l4", "p6_l5", "p6_l6", "p6_l7", "p6_l8",
] as const;

/**
 * Dynamic table definitions: for each principle, the rowcount key and the list
 * of field suffixes for each dynamic table. At export time we enumerate all
 * rows 0..N-1 to ensure dynamic row answers (beyond row0) are included.
 */
const DYNAMIC_TABLES: Record<number, Array<{ rowcountKey: string; prefix: string; fields: string[] }>> = {
  1: [
    { rowcountKey: "p1_l1_rowcount", prefix: "p1_l1_row", fields: ["prog", "topics", "pct"] },
    { rowcountKey: "p1_e3_rowcount", prefix: "p1_e3_row", fields: ["case", "agency"] },
    { rowcountKey: "p1_e2_pf_rowcount", prefix: "p1_e2_pf_row", fields: ["principle", "agency", "amt", "brief", "appeal"] },
    { rowcountKey: "p1_e2_set_rowcount", prefix: "p1_e2_set_row", fields: ["principle", "agency", "amt", "brief", "appeal"] },
    { rowcountKey: "p1_e2_cmp_rowcount", prefix: "p1_e2_cmp_row", fields: ["principle", "agency", "amt", "brief", "appeal"] },
    { rowcountKey: "p1_e2_imp_rowcount", prefix: "p1_e2_imp_row", fields: ["principle", "agency", "brief", "appeal"] },
    { rowcountKey: "p1_e2_pun_rowcount", prefix: "p1_e2_pun_row", fields: ["principle", "agency", "brief", "appeal"] },
  ],
  2: [
    { rowcountKey: "p2_l2_rowcount", prefix: "p2_l2_row", fields: ["product", "risk", "action"] },
    { rowcountKey: "p2_l3_rowcount", prefix: "p2_l3_row", fields: ["material", "pct_cy", "pct_py"] },
    { rowcountKey: "p2_l5_rowcount", prefix: "p2_l5_row", fields: ["category", "pct"] },
  ],
  4: [
    { rowcountKey: "p4_e2_rowcount", prefix: "p4_e2_row", fields: ["name", "vuln", "chan", "chan_other", "freq", "freq_other", "purpose"] },
  ],
  7: [
    { rowcountKey: "p7_e2_rowcount", prefix: "p7_e2_row", fields: ["auth", "brief", "action"] },
    { rowcountKey: "p7_l1_rowcount", prefix: "p7_l1_row", fields: ["policy", "method", "freq", "public", "link"] },
  ],
  8: [
    { rowcountKey: "p8_e1_rowcount", prefix: "p8_e1_row", fields: ["name", "notif", "date", "ind", "pub", "link"] },
    { rowcountKey: "p8_e2_rowcount", prefix: "p8_e2_row", fields: ["name", "state", "dist", "paf", "pct", "amt"] },
    { rowcountKey: "p8_l1_rowcount", prefix: "p8_l1_row", fields: ["impact", "action"] },
    { rowcountKey: "p8_l2_rowcount", prefix: "p8_l2_row", fields: ["state", "dist", "amt"] },
    { rowcountKey: "p8_l4_rowcount", prefix: "p8_l4_row", fields: ["ip", "own", "ben", "basis"] },
    { rowcountKey: "p8_l5_rowcount", prefix: "p8_l5_row", fields: ["auth", "brief", "action"] },
    { rowcountKey: "p8_l6_rowcount", prefix: "p8_l6_row", fields: ["proj", "num", "pct"] },
  ],
};

/**
 * Enumerates dynamic row codes for a principle based on stored rowcount values.
 * Returns codes like p2_l1_row1_nic, p2_l1_row2_nic, ... that are not in the
 * static codes list but may have stored answers.
 */
function getDynamicRowCodes(principleNum: number, answers: Record<string, string>): string[] {
  const tables = DYNAMIC_TABLES[principleNum];
  if (!tables) return [];
  const extra: string[] = [];
  for (const table of tables) {
    const n = parseInt(answers[table.rowcountKey] || "1", 10);
    // row0 is in static codes; enumerate row1..n-1
    for (let i = 1; i < Math.min(n, 20); i++) {
      for (const field of table.fields) {
        extra.push(`${table.prefix}${i}_${field}`);
      }
    }
  }
  return extra;
}

// ─── Phase 3 helpers ─────────────────────────────────────────────────────────

/** Extract trimmed answer string or null for empty/missing. */
function av(answers: Record<string, string>, code: string): string | null {
  const v = (answers[code] ?? "").trim();
  return v || null;
}

/** Build a StructuredTable from a fixed set of row-code arrays. */
function staticTable(columns: string[], rowData: (string | null)[][]): StructuredTable {
  return { columns, rows: rowData.filter((r) => r.some((v) => v !== null)) };
}

/**
 * Build rows from dynamic (user-added) table entries.
 * Reads rowcount from `answers[rowcountKey]`, then constructs codes as
 * `${rowPrefix}${i}_${field}` for i in [0, rowcount).
 */
function dynamicRows(
  answers: Record<string, string>,
  rowcountKey: string,
  rowPrefix: string,
  fields: string[]
): (string | null)[][] {
  const n = Math.min(parseInt(answers[rowcountKey] || "1", 10), 20);
  const rows: (string | null)[][] = [];
  for (let i = 0; i < n; i++) {
    const row = fields.map((f) => av(answers, `${rowPrefix}${i}_${f}`));
    if (row.some((v) => v !== null)) rows.push(row);
  }
  return rows;
}

/** Convenience: build a PrincipleBlock with a StructuredTable. */
function tableBlock(title: string, columns: string[], rows: (string | null)[][]): PrincipleBlock {
  return { title, content: { columns, rows } };
}

/** Convenience: build a PrincipleBlock with prose content. */
function proseBlock(title: string, value: string | null): PrincipleBlock {
  return { title, content: value ?? "" };
}

// ─── P1 (Ethics, Transparency, Accountability) ───────────────────────────────

function buildP1DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);
  const fy = answers;

  const essential: PrincipleBlock[] = [
    // E1: Training coverage
    tableBlock(
      "1. Training and awareness programmes",
      ["Segment", "No. of programmes", "Topics / Impact", "% persons covered"],
      [
        ["Board of Directors", g("p1_e1_bod_prog"), g("p1_e1_bod_topics"), g("p1_e1_bod_pct")],
        ["Key Management Personnel (KMPs)", g("p1_e1_kmp_prog"), g("p1_e1_kmp_topics"), g("p1_e1_kmp_pct")],
        ["Employees other than BoD/KMPs", g("p1_e1_emp_prog"), g("p1_e1_emp_topics"), g("p1_e1_emp_pct")],
        ["Workers", g("p1_e1_wrk_prog"), g("p1_e1_wrk_topics"), g("p1_e1_wrk_pct")],
      ]
    ),
    // E2.i Monetary: Penalty/Fine
    tableBlock(
      "2(i). Fines / Penalties (Monetary)",
      ["NGRBC Principle", "Regulatory / judicial body", "Amount (INR)", "Brief of case", "Appeal preferred?"],
      dynamicRows(answers, "p1_e2_pf_rowcount", "p1_e2_pf_row", ["principle", "agency", "amt", "brief", "appeal"])
    ),
    // E2.ii Monetary: Settlement
    tableBlock(
      "2(ii). Settlements (Monetary)",
      ["NGRBC Principle", "Regulatory / judicial body", "Amount (INR)", "Brief of case", "Appeal preferred?"],
      dynamicRows(answers, "p1_e2_set_rowcount", "p1_e2_set_row", ["principle", "agency", "amt", "brief", "appeal"])
    ),
    // E2.iii Monetary: Compounding fee
    tableBlock(
      "2(iii). Compounding fees (Monetary)",
      ["NGRBC Principle", "Regulatory / judicial body", "Amount (INR)", "Brief of case", "Appeal preferred?"],
      dynamicRows(answers, "p1_e2_cmp_rowcount", "p1_e2_cmp_row", ["principle", "agency", "amt", "brief", "appeal"])
    ),
    // E2.iv Non-Monetary: Imprisonment
    tableBlock(
      "2(iv). Imprisonment (Non-Monetary)",
      ["NGRBC Principle", "Regulatory / judicial body", "Brief of case", "Appeal preferred?"],
      dynamicRows(answers, "p1_e2_imp_rowcount", "p1_e2_imp_row", ["principle", "agency", "brief", "appeal"])
    ),
    // E2.v Non-Monetary: Punishment
    tableBlock(
      "2(v). Punishment / Strictures (Non-Monetary)",
      ["NGRBC Principle", "Regulatory / judicial body", "Brief of case", "Appeal preferred?"],
      dynamicRows(answers, "p1_e2_pun_rowcount", "p1_e2_pun_row", ["principle", "agency", "brief", "appeal"])
    ),
    // E3: Appeal details
    tableBlock(
      "3. Details of appeals pending",
      ["Case Details", "Name of regulatory / judicial institution"],
      dynamicRows(answers, "p1_e3_rowcount", "p1_e3_row", ["case", "agency"])
    ),
    // E4: Anti-corruption policy
    proseBlock("4. Anti-corruption policy details", g("p1_e4_anticorr")),
    // E5: Disciplinary action
    tableBlock(
      "5. Number of disciplinary action taken (current and previous year)",
      ["Category", "FY Current Year", "FY Previous Year"],
      [
        ["Directors", g("p1_e5_dir_cy"), g("p1_e5_dir_py")],
        ["KMPs", g("p1_e5_kmp_cy"), g("p1_e5_kmp_py")],
        ["Employees other than BoD/KMPs", g("p1_e5_emp_cy"), g("p1_e5_emp_py")],
        ["Workers", g("p1_e5_wrk_cy"), g("p1_e5_wrk_py")],
      ]
    ),
    // E6: Conflict of interest complaints
    tableBlock(
      "6. Details of complaints regarding conflict of interest",
      ["Category", "FY Current Year (No.)", "FY Current Year (Remarks)", "FY Previous Year (No.)", "FY Previous Year (Remarks)"],
      [
        ["Directors / KMPs", g("p1_e6_dir_cy"), g("p1_e6_dir_cy_rem"), g("p1_e6_dir_py"), g("p1_e6_dir_py_rem")],
        ["Key Management Personnel", g("p1_e6_kmp_cy"), g("p1_e6_kmp_cy_rem"), g("p1_e6_kmp_py"), g("p1_e6_kmp_py_rem")],
      ]
    ),
    // E7: Corrective action taken
    proseBlock("7. Corrective action taken or underway", g("p1_e7_corrective")),
    // E8: Accounts payable days
    tableBlock(
      "8. Provide details of any corrective action taken or underway on issues related to fines / penalties / action taken by regulators / law enforcement agencies",
      ["Metric", "FY Current Year", "FY Previous Year"],
      [
        ["Number of days of accounts payable", g("p1_e8_ap_cy"), g("p1_e8_ap_py")],
        ["Adjusted cost of goods/services procured (INR Crore)", g("p1_e8_cost_cy"), g("p1_e8_cost_py")],
      ]
    ),
    // E9: Concentration — Purchases
    tableBlock(
      "9(a). Purchases concentration",
      ["Metric", "FY Current Year", "FY Previous Year"],
      [
        ["Purchases from trading houses (INR Crore)", g("p1_e9_purch_i_cy"), g("p1_e9_purch_i_py")],
        ["Total purchases (INR Crore)", g("p1_e9_purch_total_cy"), g("p1_e9_purch_total_py")],
        ["Number of trading house suppliers", g("p1_e9_purch_num_cy"), g("p1_e9_purch_num_py")],
        ["% of purchases from top 10 trading houses", g("p1_e9_purch_top10_cy"), g("p1_e9_purch_top10_py")],
      ]
    ),
    tableBlock(
      "9(b). Sales concentration",
      ["Metric", "FY Current Year", "FY Previous Year"],
      [
        ["Sales to dealers/distributors (INR Crore)", g("p1_e9_sales_i_cy"), g("p1_e9_sales_i_py")],
        ["Total sales (INR Crore)", g("p1_e9_sales_total_cy"), g("p1_e9_sales_total_py")],
        ["Number of dealers/distributors", g("p1_e9_sales_num_cy"), g("p1_e9_sales_num_py")],
        ["% of sales from top 10 dealers/distributors", g("p1_e9_sales_top10_cy"), g("p1_e9_sales_top10_py")],
      ]
    ),
    tableBlock(
      "9(c). Related party transactions (RPTs) concentration",
      ["Metric", "FY Current Year", "FY Previous Year"],
      [
        ["Purchases (INR Crore)", g("p1_e9_rpt_purch_i_cy"), g("p1_e9_rpt_purch_i_py")],
        ["Total purchases (INR Crore)", g("p1_e9_rpt_purch_total_cy"), g("p1_e9_rpt_purch_total_py")],
        ["Sales (INR Crore)", g("p1_e9_rpt_sales_i_cy"), g("p1_e9_rpt_sales_i_py")],
        ["Total sales (INR Crore)", g("p1_e9_rpt_sales_total_cy"), g("p1_e9_rpt_sales_total_py")],
        ["Loans & advances (INR Crore)", g("p1_e9_rpt_loans_i_cy"), g("p1_e9_rpt_loans_i_py")],
        ["Investments (INR Crore)", g("p1_e9_rpt_inv_i_cy"), g("p1_e9_rpt_inv_i_py")],
      ]
    ),
  ];

  const leadership: PrincipleBlock[] = [
    tableBlock(
      "L1. Training and awareness programmes (non-mandatory)",
      ["Segment / programme", "Topics / impact", "% persons covered"],
      dynamicRows(answers, "p1_l1_rowcount", "p1_l1_row", ["prog", "topics", "pct"])
    ),
    proseBlock("L2. Complaints regarding conflict of interest of the Board", g("p1_l2_conflict")),
  ];

  return { essential, leadership };
}

// ─── P2 (Sustainable and Safe Goods/Services) ────────────────────────────────

function buildP2DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    tableBlock(
      "1. R&D and capital expenditure investments",
      ["Type", "FY Current Year (INR)", "FY Previous Year (INR)", "Details"],
      [
        ["R&D expenditure", g("p2_e1_rd_cy"), g("p2_e1_rd_py"), g("p2_e1_rd_details")],
        ["Capital expenditure (CAPEX)", g("p2_e1_capex_cy"), g("p2_e1_capex_py"), g("p2_e1_capex_details")],
      ]
    ),
    proseBlock("2. Has the entity sought independent assessment/evaluation of its products/services?", g("p2_e2_yn")),
    tableBlock(
      "3. Percentage of recycled or reused input material",
      ["Input material", "% recycled or reused"],
      [
        ["Plastics", g("p2_e3_plastics")],
        ["E-waste", g("p2_e3_ewaste")],
        ["Hazardous waste", g("p2_e3_hazardous")],
        ["Other waste", g("p2_e3_other")],
      ]
    ),
    proseBlock("4. Extended Producer Responsibility (EPR) details", g("p2_e4_epr")),
  ];

  const leadership: PrincipleBlock[] = [
    proseBlock("L1. Voluntary recall of products", g("p2_l1_yn")),
    tableBlock(
      "L2. Percentage of products / packaging material reclaimed",
      ["Product / material", "Environmental risk", "Action taken"],
      dynamicRows(answers, "p2_l2_rowcount", "p2_l2_row", ["product", "risk", "action"])
    ),
    tableBlock(
      "L3. Reclaimed post-consumer waste material",
      ["Reclaimed material", "% recycled or reused (Current FY)", "% recycled or reused (Previous FY)"],
      dynamicRows(answers, "p2_l3_rowcount", "p2_l3_row", ["material", "pct_cy", "pct_py"])
    ),
    tableBlock(
      "L4. Reclaimed waste by category (Re-used / Recycled / Disposed)",
      ["Category", "CY Re-used", "CY Recycled", "CY Disposed", "PY Re-used", "PY Recycled", "PY Disposed"],
      [
        ["Plastics", g("p2_l4_plast_cy_re"), g("p2_l4_plast_cy_rc"), g("p2_l4_plast_cy_d"), g("p2_l4_plast_py_re"), g("p2_l4_plast_py_rc"), g("p2_l4_plast_py_d")],
        ["E-waste", g("p2_l4_ew_cy_re"), g("p2_l4_ew_cy_rc"), g("p2_l4_ew_cy_d"), g("p2_l4_ew_py_re"), g("p2_l4_ew_py_rc"), g("p2_l4_ew_py_d")],
        ["Hazardous waste", g("p2_l4_haz_cy_re"), g("p2_l4_haz_cy_rc"), g("p2_l4_haz_cy_d"), g("p2_l4_haz_py_re"), g("p2_l4_haz_py_rc"), g("p2_l4_haz_py_d")],
        ["Other waste", g("p2_l4_oth_cy_re"), g("p2_l4_oth_cy_rc"), g("p2_l4_oth_cy_d"), g("p2_l4_oth_py_re"), g("p2_l4_oth_py_rc"), g("p2_l4_oth_py_d")],
      ]
    ),
    tableBlock(
      "L5. Products reclaimed by category",
      ["Category", "% of products reclaimed"],
      dynamicRows(answers, "p2_l5_rowcount", "p2_l5_row", ["category", "pct"])
    ),
  ];

  return { essential, leadership };
}

// ─── P3 (Well-being of All Employees and Workers) ────────────────────────────

function buildP3DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    tableBlock(
      "1(a). Details of measures for the well-being of Employees",
      ["Category", "Total (A)", "Health ins. covered (B)", "Accident ins. covered (C)", "Maternity (D)", "Paternity (E)", "Day care (F)"],
      [
        ["Permanent – Male", g("p3_e1a_perm_m_t"), g("p3_e1a_perm_m_hi"), g("p3_e1a_perm_m_ac"), g("p3_e1a_perm_m_mat"), g("p3_e1a_perm_m_pat"), g("p3_e1a_perm_m_dc")],
        ["Permanent – Female", g("p3_e1a_perm_f_t"), g("p3_e1a_perm_f_hi"), g("p3_e1a_perm_f_ac"), g("p3_e1a_perm_f_mat"), g("p3_e1a_perm_f_pat"), g("p3_e1a_perm_f_dc")],
        ["Permanent – Other", g("p3_e1a_perm_o_t"), g("p3_e1a_perm_o_hi"), g("p3_e1a_perm_o_ac"), g("p3_e1a_perm_o_mat"), g("p3_e1a_perm_o_pat"), g("p3_e1a_perm_o_dc")],
        ["Other than permanent – Male", g("p3_e1a_oth_m_t"), g("p3_e1a_oth_m_hi"), g("p3_e1a_oth_m_ac"), g("p3_e1a_oth_m_mat"), g("p3_e1a_oth_m_pat"), g("p3_e1a_oth_m_dc")],
        ["Other than permanent – Female", g("p3_e1a_oth_f_t"), g("p3_e1a_oth_f_hi"), g("p3_e1a_oth_f_ac"), g("p3_e1a_oth_f_mat"), g("p3_e1a_oth_f_pat"), g("p3_e1a_oth_f_dc")],
        ["Other than permanent – Other", g("p3_e1a_oth_o_t"), g("p3_e1a_oth_o_hi"), g("p3_e1a_oth_o_ac"), g("p3_e1a_oth_o_mat"), g("p3_e1a_oth_o_pat"), g("p3_e1a_oth_o_dc")],
      ]
    ),
    tableBlock(
      "1(b). Details of measures for the well-being of Workers",
      ["Category", "Total (A)", "Health ins. covered (B)", "Accident ins. covered (C)", "Maternity (D)", "Paternity (E)", "Day care (F)"],
      [
        ["Permanent – Male", g("p3_e1b_perm_m_t"), g("p3_e1b_perm_m_hi"), g("p3_e1b_perm_m_ac"), g("p3_e1b_perm_m_mat"), g("p3_e1b_perm_m_pat"), g("p3_e1b_perm_m_dc")],
        ["Permanent – Female", g("p3_e1b_perm_f_t"), g("p3_e1b_perm_f_hi"), g("p3_e1b_perm_f_ac"), g("p3_e1b_perm_f_mat"), g("p3_e1b_perm_f_pat"), g("p3_e1b_perm_f_dc")],
        ["Permanent – Other", g("p3_e1b_perm_o_t"), g("p3_e1b_perm_o_hi"), g("p3_e1b_perm_o_ac"), g("p3_e1b_perm_o_mat"), g("p3_e1b_perm_o_pat"), g("p3_e1b_perm_o_dc")],
        ["Other than permanent – Male", g("p3_e1b_oth_m_t"), g("p3_e1b_oth_m_hi"), g("p3_e1b_oth_m_ac"), g("p3_e1b_oth_m_mat"), g("p3_e1b_oth_m_pat"), g("p3_e1b_oth_m_dc")],
        ["Other than permanent – Female", g("p3_e1b_oth_f_t"), g("p3_e1b_oth_f_hi"), g("p3_e1b_oth_f_ac"), g("p3_e1b_oth_f_mat"), g("p3_e1b_oth_f_pat"), g("p3_e1b_oth_f_dc")],
        ["Other than permanent – Other", g("p3_e1b_oth_o_t"), g("p3_e1b_oth_o_hi"), g("p3_e1b_oth_o_ac"), g("p3_e1b_oth_o_mat"), g("p3_e1b_oth_o_pat"), g("p3_e1b_oth_o_dc")],
      ]
    ),
    tableBlock(
      "1(c). Expenditure on employee well-being as % of total revenue",
      ["Metric", "FY Current Year", "FY Previous Year"],
      [
        ["Well-being expenditure (INR)", g("p3_e1c_cy_spend"), g("p3_e1c_py_spend")],
        ["Total revenue of entity (INR)", g("p3_e1c_cy_rev"), g("p3_e1c_py_rev")],
      ]
    ),
    tableBlock(
      "2. Statutory payments made for employees and workers (Provident Fund, Gratuity, ESI, etc.)",
      ["Benefit", "Employees – CY", "Workers – CY", "Dependents – CY", "Employees – PY", "Workers – PY", "Dependents – PY"],
      [
        ["Provident Fund", g("p3_e2_pf_emp_cy"), g("p3_e2_pf_wrk_cy"), g("p3_e2_pf_dep_cy"), g("p3_e2_pf_emp_py"), g("p3_e2_pf_wrk_py"), g("p3_e2_pf_dep_py")],
        ["Gratuity", g("p3_e2_gr_emp_cy"), g("p3_e2_gr_wrk_cy"), g("p3_e2_gr_dep_cy"), g("p3_e2_gr_emp_py"), g("p3_e2_gr_wrk_py"), g("p3_e2_gr_dep_py")],
        ["ESI", g("p3_e2_esi_emp_cy"), g("p3_e2_esi_wrk_cy"), g("p3_e2_esi_dep_cy"), g("p3_e2_esi_emp_py"), g("p3_e2_esi_wrk_py"), g("p3_e2_esi_dep_py")],
        ["Other", g("p3_e2_oth_emp_cy"), g("p3_e2_oth_wrk_cy"), g("p3_e2_oth_dep_cy"), g("p3_e2_oth_emp_py"), g("p3_e2_oth_wrk_py"), g("p3_e2_oth_dep_py")],
      ]
    ),
    proseBlock("3. Accessibility of the entities' facilities to employees/workers with disabilities", g("p3_e3_access")),
    proseBlock("4. Does the entity have an equal opportunity policy?", g("p3_e4_equal")),
    tableBlock(
      "5. Return to work and retention rates of employees and workers after parental leave",
      ["Category", "Male Return", "Male Retention", "Female Return", "Female Retention", "Other Return", "Other Retention", "Total Return", "Total Retention"],
      [
        ["Employees", g("p3_e5_m_emp_ret"), g("p3_e5_m_emp_retn"), g("p3_e5_f_emp_ret"), g("p3_e5_f_emp_retn"), g("p3_e5_o_emp_ret"), g("p3_e5_o_emp_retn"), g("p3_e5_tot_emp_ret"), g("p3_e5_tot_emp_retn")],
        ["Workers", g("p3_e5_m_wrk_ret"), g("p3_e5_m_wrk_retn"), g("p3_e5_f_wrk_ret"), g("p3_e5_f_wrk_retn"), g("p3_e5_o_wrk_ret"), g("p3_e5_o_wrk_retn"), g("p3_e5_tot_wrk_ret"), g("p3_e5_tot_wrk_retn")],
      ]
    ),
    proseBlock("6. Mechanism for employees and workers to file complaints", `${g("p3_e6_yn") ?? ""}${g("p3_e6_emp_perm") ? `\nEmployees (permanent): ${g("p3_e6_emp_perm")}` : ""}${g("p3_e6_wrk_perm") ? `\nWorkers (permanent): ${g("p3_e6_wrk_perm")}` : ""}`),
    tableBlock(
      "11. Employees / workers covered under OHS management system",
      ["Category", "Total – CY", "Covered – CY", "Total – PY", "Covered – PY"],
      [
        ["LTIFR – Employees", null, g("p3_e11_ltifr_emp_cy"), null, g("p3_e11_ltifr_emp_py")],
        ["LTIFR – Workers", null, g("p3_e11_ltifr_wrk_cy"), null, g("p3_e11_ltifr_wrk_py")],
        ["Recordable injuries – Employees", null, g("p3_e11_rec_emp_cy"), null, g("p3_e11_rec_emp_py")],
        ["Recordable injuries – Workers", null, g("p3_e11_rec_wrk_cy"), null, g("p3_e11_rec_wrk_py")],
        ["Fatalities – Employees", null, g("p3_e11_fat_emp_cy"), null, g("p3_e11_fat_emp_py")],
        ["Fatalities – Workers", null, g("p3_e11_fat_wrk_cy"), null, g("p3_e11_fat_wrk_py")],
      ]
    ),
    tableBlock(
      "13. Complaints related to Working Conditions and Health & Safety",
      ["Category", "CY Filed", "CY Pending", "CY Remarks", "PY Filed", "PY Pending", "PY Remarks"],
      [
        ["Working Conditions", g("p3_e13_wc_cy_f"), g("p3_e13_wc_cy_p"), g("p3_e13_wc_cy_r"), g("p3_e13_wc_py_f"), g("p3_e13_wc_py_p"), g("p3_e13_wc_py_r")],
        ["Health & Safety", g("p3_e13_hs_cy_f"), g("p3_e13_hs_cy_p"), g("p3_e13_hs_cy_r"), g("p3_e13_hs_py_f"), g("p3_e13_hs_py_p"), g("p3_e13_hs_py_r")],
      ]
    ),
    proseBlock("12. Details of safety-related incidents", `HS assessment: ${g("p3_e14_hs") ?? ""}; WC assessment: ${g("p3_e14_wc") ?? ""}`),
    proseBlock("15. Corrective action taken", g("p3_e15_corrective")),
  ];

  const leadership: PrincipleBlock[] = [
    proseBlock("L1. Life and disability cover", `Employees: ${g("p3_l1_emp") ?? ""}; Workers: ${g("p3_l1_wrk") ?? ""}`),
    proseBlock("L2. Statutory vs contractual benefits", g("p3_l2_statutory")),
    tableBlock(
      "L3. Employees/workers covered in health and safety training",
      ["Category", "Total – CY", "Regular – CY", "Total – PY", "Regular – PY"],
      [
        ["Employees", g("p3_l3_emp_cy_t"), g("p3_l3_emp_cy_r"), g("p3_l3_emp_py_t"), g("p3_l3_emp_py_r")],
        ["Workers", g("p3_l3_wrk_cy_t"), g("p3_l3_wrk_cy_r"), g("p3_l3_wrk_py_t"), g("p3_l3_wrk_py_r")],
      ]
    ),
    proseBlock("L4. Transition assistance programs", g("p3_l4_transition")),
    proseBlock("L5. Complaints on OHS / Working Conditions (corrective action)", `HS: ${g("p3_l5_hs") ?? ""}; WC: ${g("p3_l5_wc") ?? ""}`),
    proseBlock("L6. Corrective action (leadership)", g("p3_l6_corrective")),
  ];

  return { essential, leadership };
}

// ─── P4 (Stakeholders) ───────────────────────────────────────────────────────

function buildP4DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    proseBlock("1. Process for identifying stakeholders", g("p4_e1_process")),
    tableBlock(
      "2. Stakeholder identification and engagement",
      ["Stakeholder group", "Material issue / vulnerability", "Communication channels", "Other channels", "Frequency", "Other frequency", "Purpose"],
      dynamicRows(answers, "p4_e2_rowcount", "p4_e2_row", ["name", "vuln", "chan", "chan_other", "freq", "freq_other", "purpose"])
    ),
  ];

  const leadership: PrincipleBlock[] = [
    proseBlock("L1. Consultative process for key decisions", g("p4_l1_consult")),
    proseBlock("L2. Special initiatives / programs for disadvantaged stakeholders", `${g("p4_l2_yn") ?? ""}\n${g("p4_l2_instances") ?? ""}`),
    proseBlock("L3. Engagement with local and marginalized communities", g("p4_l3_engagement")),
  ];

  return { essential, leadership };
}

// ─── P5 (Human Rights) ───────────────────────────────────────────────────────

function buildP5DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    tableBlock(
      "1. Employees and workers covered by human rights training",
      ["Category", "Total – CY", "Covered – CY", "Total – PY", "Covered – PY"],
      [
        ["Employees – Permanent", g("p5_e1_emp_perm_t_cy"), g("p5_e1_emp_perm_c_cy"), g("p5_e1_emp_perm_t_py"), g("p5_e1_emp_perm_c_py")],
        ["Employees – Other", g("p5_e1_emp_oth_t_cy"), g("p5_e1_emp_oth_c_cy"), g("p5_e1_emp_oth_t_py"), g("p5_e1_emp_oth_c_py")],
        ["Workers – Permanent", g("p5_e1_wrk_perm_t_cy"), g("p5_e1_wrk_perm_c_cy"), g("p5_e1_wrk_perm_t_py"), g("p5_e1_wrk_perm_c_py")],
        ["Workers – Other", g("p5_e1_wrk_oth_t_cy"), g("p5_e1_wrk_oth_c_cy"), g("p5_e1_wrk_oth_t_py"), g("p5_e1_wrk_oth_c_py")],
      ]
    ),
    tableBlock(
      "3(b). Complaints on sexual harassment, discrimination, child labour, forced labour, wages",
      ["Category", "CY Filed", "CY Total", "PY Filed", "PY Total"],
      [
        ["Sexual harassment", g("p5_e3b_cy_f"), g("p5_e3b_cy_t"), g("p5_e3b_py_f"), g("p5_e3b_py_t")],
      ]
    ),
    proseBlock("4. Focal point for human rights issues", g("p5_e4_focal")),
    proseBlock("5. Internal mechanism for raising grievances on human rights", g("p5_e5_mech")),
    tableBlock(
      "6. Complaints filed under the human rights framework",
      ["Category", "CY Filed", "CY Pending", "CY Remarks", "PY Filed", "PY Pending", "PY Remarks"],
      [
        ["Sexual harassment", g("p5_e6_sh_cy_f"), g("p5_e6_sh_cy_p"), g("p5_e6_sh_cy_r"), g("p5_e6_sh_py_f"), g("p5_e6_sh_py_p"), g("p5_e6_sh_py_r")],
        ["Discrimination at workplace", g("p5_e6_disc_cy_f"), g("p5_e6_disc_cy_p"), g("p5_e6_disc_cy_r"), g("p5_e6_disc_py_f"), g("p5_e6_disc_py_p"), g("p5_e6_disc_py_r")],
        ["Child labour", g("p5_e6_cl_cy_f"), g("p5_e6_cl_cy_p"), g("p5_e6_cl_cy_r"), g("p5_e6_cl_py_f"), g("p5_e6_cl_py_p"), g("p5_e6_cl_py_r")],
        ["Forced labour / involuntary labour", g("p5_e6_fl_cy_f"), g("p5_e6_fl_cy_p"), g("p5_e6_fl_cy_r"), g("p5_e6_fl_py_f"), g("p5_e6_fl_py_p"), g("p5_e6_fl_py_r")],
        ["Wages", g("p5_e6_wg_cy_f"), g("p5_e6_wg_cy_p"), g("p5_e6_wg_cy_r"), g("p5_e6_wg_py_f"), g("p5_e6_wg_py_p"), g("p5_e6_wg_py_r")],
        ["Other HR related", g("p5_e6_oth_cy_f"), g("p5_e6_oth_cy_p"), g("p5_e6_oth_cy_r"), g("p5_e6_oth_py_f"), g("p5_e6_oth_py_p"), g("p5_e6_oth_py_r")],
      ]
    ),
    tableBlock(
      "7. Mechanisms to prevent adverse consequences to complainants",
      ["Metric", "FY Current Year", "FY Previous Year"],
      [
        ["Total complaints received", g("p5_e7_tot_cy"), g("p5_e7_tot_py")],
        ["Filed by employees", g("p5_e7_f_cy"), g("p5_e7_f_py")],
        ["Up-streamed to authorities", g("p5_e7_up_cy"), g("p5_e7_up_py")],
      ]
    ),
    proseBlock("8. Mechanism in place to prevent adverse consequences to complainant/whistle blower", g("p5_e8_mech")),
    proseBlock("9. Contracts with value chain partners ensuring human rights", g("p5_e9_contracts")),
    proseBlock("10. Assessments for child labour, forced/involuntary labour, sexual harassment, discrimination, wages", `Child labour: ${g("p5_e10_cl") ?? ""}; Forced labour: ${g("p5_e10_fl") ?? ""}; Sexual harassment: ${g("p5_e10_sh") ?? ""}; Discrimination: ${g("p5_e10_disc") ?? ""}; Wages: ${g("p5_e10_wg") ?? ""}; Other: ${g("p5_e10_oth") ?? ""} ${g("p5_e10_oth_details") ?? ""}`),
    proseBlock("11. Corrective action taken on human rights issues", g("p5_e11_corrective")),
  ];

  const leadership: PrincipleBlock[] = [
    proseBlock("L1. Process to address human rights in value chain", g("p5_l1_process")),
    proseBlock("L2. Scope of human rights commitments", g("p5_l2_scope")),
    proseBlock("L3. Mechanisms enabling accessibility", g("p5_l3_access")),
    proseBlock("L5. Corrective action on human rights in value chain", g("p5_l5_corrective")),
  ];

  return { essential, leadership };
}

// ─── P7 (Public and Regulatory Policy) ───────────────────────────────────────

function buildP7DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    proseBlock("1(a). Number of trade and industry chambers / associations the entity is a member of", g("p7_e1a_count")),
    tableBlock(
      "1(b). Trade and industry chamber memberships",
      ["Chamber / Association Name", "Reach"],
      Array.from({ length: 10 }, (_, i) => [g(`p7_e1b_${i + 1}_name`), g(`p7_e1b_${i + 1}_reach`)]).filter((r) => r.some((v) => v !== null))
    ),
    tableBlock(
      "2. Anti-competitive conduct — corrective actions taken",
      ["Authority name", "Brief of case", "Corrective action"],
      dynamicRows(answers, "p7_e2_rowcount", "p7_e2_row", ["auth", "brief", "action"])
    ),
  ];

  const leadership: PrincipleBlock[] = [
    tableBlock(
      "L1. Public policy positions",
      ["Policy advocated", "Method", "Frequency", "Web link publicly available?", "Web link"],
      dynamicRows(answers, "p7_l1_rowcount", "p7_l1_row", ["policy", "method", "freq", "public", "link"])
    ),
  ];

  return { essential, leadership };
}

// ─── P8 (Inclusive Growth and Equitable Development) ─────────────────────────

function buildP8DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    tableBlock(
      "1. Social impact assessments (SIA) for projects",
      ["Project name", "Notified?", "Date of notification", "Conducted by independent entity?", "Published?", "Web link"],
      dynamicRows(answers, "p8_e1_rowcount", "p8_e1_row", ["name", "notif", "date", "ind", "pub", "link"])
    ),
    tableBlock(
      "2. Projects / programs for rehabilitation and resettlement",
      ["Name of project / programme", "State", "District", "PAF (Project Affected Families)", "% of PAF covered", "Amount paid (INR)"],
      dynamicRows(answers, "p8_e2_rowcount", "p8_e2_row", ["name", "state", "dist", "paf", "pct", "amt"])
    ),
    proseBlock("3. Grievance redressal mechanism for communities", g("p8_e3_griev")),
    tableBlock(
      "4. Direct value created for local supply chain",
      ["Metric", "FY Current Year (INR)", "FY Previous Year (INR)"],
      [
        ["Sourced from MSMEs / small producers", g("p8_e4_msme_cy"), g("p8_e4_msme_py")],
        ["Sourced from within the district / 200 km", g("p8_e4_india_cy"), g("p8_e4_india_py")],
      ]
    ),
    tableBlock(
      "5. Job creation in smaller towns",
      ["Location", "FY Current – Women", "FY Current – Total", "FY Previous – Women", "FY Previous – Total"],
      [
        ["Rural", g("p8_e5_rural_w_cy"), g("p8_e5_rural_t_cy"), g("p8_e5_rural_w_py"), g("p8_e5_rural_t_py")],
        ["Semi-urban", g("p8_e5_semi_w_cy"), g("p8_e5_semi_t_cy"), g("p8_e5_semi_w_py"), g("p8_e5_semi_t_py")],
        ["Urban", g("p8_e5_urb_w_cy"), g("p8_e5_urb_t_cy"), g("p8_e5_urb_w_py"), g("p8_e5_urb_t_py")],
        ["Metropolitan", g("p8_e5_metro_w_cy"), g("p8_e5_metro_t_cy"), g("p8_e5_metro_w_py"), g("p8_e5_metro_t_py")],
      ]
    ),
  ];

  const leadership: PrincipleBlock[] = [
    tableBlock(
      "L1. Significant adverse social impact identified in value chain",
      ["Social impact identified", "Corrective action"],
      dynamicRows(answers, "p8_l1_rowcount", "p8_l1_row", ["impact", "action"])
    ),
    tableBlock(
      "L2. CSR projects in aspirational districts",
      ["State", "District", "Amount spent (INR Crore)"],
      dynamicRows(answers, "p8_l2_rowcount", "p8_l2_row", ["state", "dist", "amt"])
    ),
    proseBlock("L3. Preference to marginalized / vulnerable groups", `${g("p8_l3_yn") ?? ""}\n${g("p8_l3_groups") ?? ""}\n${g("p8_l3_pct") ?? ""}`),
    tableBlock(
      "L4. Intellectual property rights over traditional knowledge",
      ["IP-based product / service", "Owner", "Beneficiary", "Basis of benefit sharing"],
      dynamicRows(answers, "p8_l4_rowcount", "p8_l4_row", ["ip", "own", "ben", "basis"])
    ),
    tableBlock(
      "L5. Corrective actions for negative impact on communities",
      ["Authority name", "Brief of case", "Corrective action"],
      dynamicRows(answers, "p8_l5_rowcount", "p8_l5_row", ["auth", "brief", "action"])
    ),
    tableBlock(
      "L6. Beneficiaries of CSR projects",
      ["CSR project", "No. of persons benefited", "% of beneficiaries from vulnerable groups"],
      dynamicRows(answers, "p8_l6_rowcount", "p8_l6_row", ["proj", "num", "pct"])
    ),
  ];

  return { essential, leadership };
}

// ─── P9 (Consumers) ───────────────────────────────────────────────────────────

function buildP9DocxBlocks(answers: Record<string, string>): BRSRPrinciple["docxBlocks"] {
  const g = (c: string) => av(answers, c);

  const essential: PrincipleBlock[] = [
    proseBlock("1. Mechanisms for receiving and responding to consumer complaints / feedback", g("p9_e1_mech")),
    proseBlock("2. Turnover of products and services with environmental and social information labelled", `Environmental labelling: ${g("p9_e2_env") ?? ""}; Safe use information: ${g("p9_e2_safe") ?? ""}; Recyclability info: ${g("p9_e2_recycle") ?? ""}`),
    tableBlock(
      "3. Number of consumer complaints with respect to the following",
      ["Category", "CY Filed", "CY Pending", "CY Remarks", "PY Filed", "PY Pending", "PY Remarks"],
      [
        ["Data privacy", g("p9_e3_dp_cy_f"), g("p9_e3_dp_cy_p"), g("p9_e3_dp_cy_r"), g("p9_e3_dp_py_f"), g("p9_e3_dp_py_p"), g("p9_e3_dp_py_r")],
        ["Advertising", g("p9_e3_adv_cy_f"), g("p9_e3_adv_cy_p"), g("p9_e3_adv_cy_r"), g("p9_e3_adv_py_f"), g("p9_e3_adv_py_p"), g("p9_e3_adv_py_r")],
        ["Cyber-security", g("p9_e3_cs_cy_f"), g("p9_e3_cs_cy_p"), g("p9_e3_cs_cy_r"), g("p9_e3_cs_py_f"), g("p9_e3_cs_py_p"), g("p9_e3_cs_py_r")],
        ["Delivery of essential services", g("p9_e3_del_cy_f"), g("p9_e3_del_cy_p"), g("p9_e3_del_cy_r"), g("p9_e3_del_py_f"), g("p9_e3_del_py_p"), g("p9_e3_del_py_r")],
        ["Restrictive trade practices", g("p9_e3_rtp_cy_f"), g("p9_e3_rtp_cy_p"), g("p9_e3_rtp_cy_r"), g("p9_e3_rtp_py_f"), g("p9_e3_rtp_py_p"), g("p9_e3_rtp_py_r")],
        ["Unfair trade practices", g("p9_e3_utp_cy_f"), g("p9_e3_utp_cy_p"), g("p9_e3_utp_cy_r"), g("p9_e3_utp_py_f"), g("p9_e3_utp_py_p"), g("p9_e3_utp_py_r")],
        ["Other", g("p9_e3_oth_cy_f"), g("p9_e3_oth_cy_p"), g("p9_e3_oth_cy_r"), g("p9_e3_oth_py_f"), g("p9_e3_oth_py_p"), g("p9_e3_oth_py_r")],
      ]
    ),
    proseBlock("4. Product recalls (voluntary and forced)", `Voluntary: number = ${g("p9_e4_vol_num") ?? ""}; reason = ${g("p9_e4_vol_reason") ?? ""}\nForced: number = ${g("p9_e4_for_num") ?? ""}; reason = ${g("p9_e4_for_reason") ?? ""}`),
    proseBlock("5. Consumer satisfaction surveys", `Framework: ${g("p9_e5_framework") ?? ""}; Web link: ${g("p9_e5_link") ?? ""}`),
    proseBlock("6. Corrective action taken on data privacy issues", g("p9_e6_corrective")),
    tableBlock(
      "7. Channels and platforms for consumer communication",
      ["Channel", "FY Current Year", "FY Previous Year"],
      [
        ["Digital / online", g("p9_e7a_cy"), g("p9_e7a_py")],
        ["Traditional", g("p9_e7b_cy"), g("p9_e7b_py")],
        ["Dedicated support", g("p9_e7c_cy"), g("p9_e7c_py")],
      ]
    ),
  ];

  const leadership: PrincipleBlock[] = [
    proseBlock("L1. Channels to disseminate information to customers", g("p9_l1_channels")),
    proseBlock("L2. Steps to inform and educate consumers", g("p9_l2_steps")),
    proseBlock("L3. Mechanism to address grievances with respect to data usage", g("p9_l3_mech")),
    proseBlock("L4. Fair / responsible marketing", `${g("p9_l4_beyond") ?? ""}\n${g("p9_l4_detail") ?? ""}\n${g("p9_l4_survey") ?? ""}`),
  ];

  return { essential, leadership };
}

/** Dispatch to the correct per-principle docxBlocks builder. */
function buildDocxBlocks(answers: Record<string, string>, n: number): BRSRPrinciple["docxBlocks"] | undefined {
  switch (n) {
    case 1: return buildP1DocxBlocks(answers);
    case 2: return buildP2DocxBlocks(answers);
    case 3: return buildP3DocxBlocks(answers);
    case 4: return buildP4DocxBlocks(answers);
    case 5: return buildP5DocxBlocks(answers);
    // P6 keeps the existing subsections path (complex autofill structure)
    case 7: return buildP7DocxBlocks(answers);
    case 8: return buildP8DocxBlocks(answers);
    case 9: return buildP9DocxBlocks(answers);
    default: return undefined;
  }
}

function mapPrinciple(answers: Record<string, string>, principleNum: number): BRSRPrinciple {
  const get = (code: string) => val(answers[code]);
  const essential: BRSRIndicator[] = [];
  const leadership: BRSRIndicator[] = [];
  let subsections: { label: string; indicators: BRSRIndicator[] }[] | undefined;
  const panelId = `p${principleNum}` as "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8" | "p9";
  const staticCodes = getQuestionCodesForPanel(panelId);
  const dynamicCodes = getDynamicRowCodes(principleNum, answers);
  const codes = [...staticCodes, ...dynamicCodes];

  if (principleNum === 6) {
    subsections = [];
    for (const prefix of P6_SUBSECTION_PREFIXES) {
      const label = P6_PREFIX_LABELS[prefix] ?? prefix;
      const indicators: BRSRIndicator[] = [];
      for (const code of codes) {
        if (code === "p6_notes") continue;
        if (code.startsWith(prefix + "_") || code === prefix) {
          indicators.push({ label: getPrincipleLabel(code, 6), value: get(code) });
        }
      }
      if (indicators.length > 0) {
        subsections.push({ label, indicators });
      }
    }
  } else {
    for (const code of codes) {
      if (code === `${panelId}_notes`) continue;
      const label = getPrincipleLabel(code, principleNum);
      const ind: BRSRIndicator = { label, value: get(code) };
      if (/_l\d+/.test(code)) {
        leadership.push(ind);
      } else {
        essential.push(ind);
      }
    }
  }

  const ngrbcStatement = NGRBC_PRINCIPLE_TITLES[principleNum] ?? "";
  const docxBlocks = buildDocxBlocks(answers, principleNum);
  return { ngrbcStatement, essential, leadership, subsections, docxBlocks };
}

function mapSectionC(answers: Record<string, string>): BRSRSectionC {
  const sectionC: BRSRSectionC = {
    p1: { ngrbcStatement: "", essential: [], leadership: [] },
    p2: { ngrbcStatement: "", essential: [], leadership: [] },
    p3: { ngrbcStatement: "", essential: [], leadership: [] },
    p4: { ngrbcStatement: "", essential: [], leadership: [] },
    p5: { ngrbcStatement: "", essential: [], leadership: [] },
    p6: { ngrbcStatement: "", essential: [], leadership: [] },
    p7: { ngrbcStatement: "", essential: [], leadership: [] },
    p8: { ngrbcStatement: "", essential: [], leadership: [] },
    p9: { ngrbcStatement: "", essential: [], leadership: [] },
  };

  for (let n = 1; n <= 9; n++) {
    sectionC[`p${n}` as keyof BRSRSectionC] = mapPrinciple(answers, n);
  }

  return sectionC;
}

/**
 * Map answers and org to BRSRExportData.
 * Applies runCalculations before mapping so computed fields are available.
 */
export function mapAnswersToBRSR(
  answers: Record<string, string>,
  org: OrgRow,
  reportingYear: string
): BRSRExportData {
  const computed = runCalculations(answers);
  const merged = { ...answers, ...computed };

  const { org: brsrOrg, reportingYear: ry } = mapOrg(org, reportingYear);

  return {
    org: brsrOrg,
    reportingYear: ry,
    sectionA: mapSectionA(merged),
    sectionB: mapSectionB(merged),
    sectionC: mapSectionC(merged),
  };
}
