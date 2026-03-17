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
  OrgRow,
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
  const idx15 = details.findIndex((d) => d.label.startsWith("15."));
  if (assurers && idx15 >= 0) details.splice(idx15, 0, { label: GENERAL_LABELS["14"], value: val(assurers) });
  else if (assurers) details.push({ label: GENERAL_LABELS["14"], value: val(assurers) });

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
    policies.push({ question, p1, p2, p3, p4, p5, p6, p7, p8, p9 });
  }

  const leadership: BRSRIndicator[] = [];
  for (let n = 1; n <= 9; n++) {
    leadership.push({ label: `9. Committee of Board – Principle ${n}`, value: get(`sb_9_p${n}`) });
  }

  return {
    policies,
    directorStatement: get("sb_7_statement"),
    highestAuthority: get("sb_8_authority"),
    leadership,
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
  "p6_l1", "p6_l2", "p6_l3", "p6_l4", "p6_l5", "p6_l6", "p6_l7",
] as const;

/**
 * Dynamic table definitions: for each principle, the rowcount key and the list
 * of field suffixes for each dynamic table. At export time we enumerate all
 * rows 0..N-1 to ensure dynamic row answers (beyond row0) are included.
 */
const DYNAMIC_TABLES: Record<number, Array<{ rowcountKey: string; prefix: string; fields: string[] }>> = {
  2: [
    { rowcountKey: "p2_l1_rowcount", prefix: "p2_l1_row", fields: ["nic", "product", "pct", "boundary", "ext", "public", "link"] },
    { rowcountKey: "p2_l2_rowcount", prefix: "p2_l2_row", fields: ["product", "risk", "action"] },
    { rowcountKey: "p2_l3_rowcount", prefix: "p2_l3_row", fields: ["material", "recycled", "total"] },
  ],
  4: [
    { rowcountKey: "p4_e2_rowcount", prefix: "p4_e2_row", fields: ["name", "vuln", "chan", "freq", "purpose"] },
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
  return { ngrbcStatement, essential, leadership, subsections };
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
