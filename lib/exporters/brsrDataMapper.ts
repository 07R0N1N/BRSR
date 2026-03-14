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
  inv: "Investors",
  sha: "Shareholders",
  emp: "Employees and workers",
  cust: "Customers",
  vc: "Value Chain Partners",
  oth: "Other",
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
  const mkEmp = (cat: string, tot: string, m: string, f: string, skipPct?: boolean): BRSREmployeeRow => ({
    category: cat,
    total: tot,
    male: m,
    malePct: skipPct ? "" : pct(m, tot),
    female: f,
    femalePct: skipPct ? "" : pct(f, tot),
  });
  const empRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", get("gen_20a_emp_perm_total"), get("gen_20a_emp_perm_m"), get("gen_20a_emp_perm_f")),
    mkEmp("Other than Permanent (F)", get("gen_20a_emp_other_total"), get("gen_20a_emp_other_m"), get("gen_20a_emp_other_f")),
    mkEmp("Total employees (E+F)", get("gen_20a_emp_total"), get("gen_20a_emp_total_m"), get("gen_20a_emp_total_f"), true),
  ];
  const wrkPermT = get("gen_20a_wrk_perm_total");
  const wrkOthT = get("gen_20a_wrk_other_total");
  const wrkTotal = get("gen_20a_wrk_total") || (wrkPermT && wrkOthT ? String((parseFloat(String(wrkPermT).replace(/,/g, "")) || 0) + (parseFloat(String(wrkOthT).replace(/,/g, "")) || 0)) : "");
  const wrkRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", wrkPermT, get("gen_20a_wrk_perm_m"), get("gen_20a_wrk_perm_f")),
    mkEmp("Other than Permanent (F)", wrkOthT, get("gen_20a_wrk_other_m"), get("gen_20a_wrk_other_f")),
    mkEmp("Total workers (E+F)", wrkTotal, get("gen_20a_wrk_total_m") || "", get("gen_20a_wrk_total_f") || "", true),
  ];
  const daEmpRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", get("gen_20b_emp_perm_total"), get("gen_20b_emp_perm_m"), get("gen_20b_emp_perm_f")),
    mkEmp("Other than Permanent (F)", get("gen_20b_emp_other_total"), get("gen_20b_emp_other_m"), get("gen_20b_emp_other_f")),
    mkEmp("Total employees (E+F)", get("gen_20b_emp_total"), "", "", true),
  ];
  const daWrkRows: BRSREmployeeRow[] = [
    mkEmp("Permanent (E)", get("gen_20b_wrk_perm_total"), get("gen_20b_wrk_perm_m"), get("gen_20b_wrk_perm_f")),
    mkEmp("Other than Permanent (F)", get("gen_20b_wrk_other_total"), get("gen_20b_wrk_other_m"), get("gen_20b_wrk_other_f")),
    mkEmp("Total workers (E+F)", get("gen_20b_wrk_total"), "", "", true),
  ];
  const womenParticipation: BRSRWomenParticipationRow[] = [
    { category: "Board of Directors", total: get("gen_21_bod_total"), female: get("gen_21_bod_f"), femalePct: pct(get("gen_21_bod_f"), get("gen_21_bod_total")) },
    { category: "Key Management Personnel", total: get("gen_21_kmp_total"), female: get("gen_21_kmp_f"), femalePct: pct(get("gen_21_kmp_f"), get("gen_21_kmp_total")) },
  ];
  const turnoverEmployees: BRSRTurnoverRow[] = [
    { year: "Current Year", male: get("gen_22_emp_cy_m"), female: get("gen_22_emp_cy_f"), total: get("gen_22_emp_cy_t") },
    { year: "Previous Year", male: get("gen_22_emp_py_m"), female: get("gen_22_emp_py_f"), total: get("gen_22_emp_py_t") },
    { year: "Prior to Previous Year", male: get("gen_22_emp_pp_m"), female: get("gen_22_emp_pp_f"), total: get("gen_22_emp_pp_t") },
  ];
  const turnoverWorkers: BRSRTurnoverRow[] = [
    { year: "Current Year", male: get("gen_22_wrk_cy_m"), female: get("gen_22_wrk_cy_f"), total: get("gen_22_wrk_cy_t") },
    { year: "Previous Year", male: get("gen_22_wrk_py_m"), female: get("gen_22_wrk_py_f"), total: get("gen_22_wrk_py_t") },
    { year: "Prior to Previous Year", male: get("gen_22_wrk_pp_m"), female: get("gen_22_wrk_pp_f"), total: get("gen_22_wrk_pp_t") },
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
  const prefixes = ["comm", "inv", "sha", "emp", "cust", "vc", "oth"];
  const rows: BRSRComplaintsRow[] = [];
  for (const prefix of prefixes) {
    const stakeholder = STAKEHOLDER_LABELS[prefix] ?? prefix;
    const mechanism = get(`gen_25_${prefix}_mech`);
    const webLink = EMPTY; // schema has no separate web link field
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

function mapSectionA(answers: Record<string, string>): BRSRSectionA {
  const get = (code: string) => val(answers[code]);
  const details: BRSRIndicator[] = [];
  const csr: BRSRIndicator[] = [];

  const blocks = getAssignmentBlocksForPanel("general");
  for (const block of blocks) {
    for (const code of block.questionCodes) {
      if (code.endsWith("_row_count")) continue;
      const sub = getGenSubsection(code);
      if (sub === "details") details.push({ label: getGenLabel(code), value: get(code) });
      else if (sub === "csr") csr.push({ label: getGenLabel(code), value: get(code) });
    }
  }

  return {
    details,
    productsServices: mapProductsServices(answers),
    operations: mapOperations(answers),
    employees: mapEmployees(answers),
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
  "1a", "1b", "1c", "2", "3", "4", "5", "6", "9", "10a", "10b", "11", "12a", "12b", "12c", "12d",
] as const;

function mapSectionB(answers: Record<string, string>): BRSRSectionB {
  const get = (code: string) => val(answers[code]);
  const policies: BRSRPoliciesMatrixRow[] = [];

  for (const key of POLICIES_MATRIX_KEYS) {
    const question = SECTION_B_LABELS[key] ?? key;
    policies.push({
      question,
      p1: get(`sb_${key}_p1`),
      p2: get(`sb_${key}_p2`),
      p3: get(`sb_${key}_p3`),
      p4: get(`sb_${key}_p4`),
      p5: get(`sb_${key}_p5`),
      p6: get(`sb_${key}_p6`),
      p7: get(`sb_${key}_p7`),
      p8: get(`sb_${key}_p8`),
      p9: get(`sb_${key}_p9`),
    });
  }

  const leadership: BRSRIndicator[] = [];
  for (let n = 1; n <= 9; n++) {
    leadership.push({ label: `9. Committee of Board – Principle ${n}`, value: get(`sb_9_p${n}`) });
  }

  return {
    policies,
    directorStatement: get("sb_7_statement"),
    highestAuthority: get("sb_8_authority"),
    otherReason: get("sb_12e_other"),
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

function mapPrinciple(answers: Record<string, string>, principleNum: number): BRSRPrinciple {
  const get = (code: string) => val(answers[code]);
  const essential: BRSRIndicator[] = [];
  const leadership: BRSRIndicator[] = [];
  let subsections: { label: string; indicators: BRSRIndicator[] }[] | undefined;
  const panelId = `p${principleNum}` as "p1" | "p2" | "p3" | "p4" | "p5" | "p6" | "p7" | "p8" | "p9";
  const codes = getQuestionCodesForPanel(panelId);

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
