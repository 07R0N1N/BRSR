/**
 * BRSR Export types – SEBI-compliant report structure.
 * Maps from organizations + answers to export-ready data.
 */

/** Org fields for export (sector = industry, hqCountry = country) */
export type BRSROrg = {
  name: string;
  cin: string;
  sector: string;
  companyType: string;
  hqCity: string;
  hqCountry: string;
  website: string;
};

/** Reporting year (current, previous) – e.g. "2024-25", "2023-24" */
export type BRSRReportingYear = {
  current: string;
  previous: string;
};

/** Key-value pair for a single indicator/field */
export type BRSRIndicator = {
  label: string;
  value: string;
};

/** Row for Products/Services (gen_16, gen_17) */
export type BRSRProductsRow = {
  main?: string;
  activity?: string;
  nic?: string;
  product?: string;
  pct?: string;
};

/** Row for Holding/Subsidiary (gen_23) */
export type BRSRHoldingRow = {
  name: string;
  type: string;
  pct: string;
  br: string;
};

/** Row for Material Issues (gen_26) */
export type BRSRMaterialRow = {
  issue: string;
  riskOrOpp: string;
  rationale: string;
  approach: string;
  financial: string;
};

/** Row for Operations locations (gen_18) */
export type BRSROpsLocationRow = {
  location: string;
  plants: string;
  offices: string;
  total: string;
};

/** Row for Employees/Workers tables (gen_20a, gen_20b) – columns: Particulars, Total (A), Male No. (B), Male % (B/A), Female No. (C), Female % (C/A) */
export type BRSREmployeeRow = {
  category: string;
  total: string;
  male: string;
  malePct: string;
  female: string;
  femalePct: string;
};

/** Row for Women participation table (gen_21) – columns: Total (A), No. of Female (B), % (B/A) of Females */
export type BRSRWomenParticipationRow = {
  category: string;
  total: string;
  female: string;
  femalePct: string;
};

/** Row for Turnover rate table (gen_22) */
export type BRSRTurnoverRow = {
  year: string;
  male: string;
  female: string;
  total: string;
};

/** Section IV – Employees & Workers structured data */
export type BRSREmployeesSection = {
  employees: BRSREmployeeRow[];
  workers: BRSREmployeeRow[];
  differentlyAbledEmployees: BRSREmployeeRow[];
  differentlyAbledWorkers: BRSREmployeeRow[];
  womenParticipation: BRSRWomenParticipationRow[];
  turnoverEmployees: BRSRTurnoverRow[];
  turnoverWorkers: BRSRTurnoverRow[];
};

/** Row for Complaints (gen_25) – one per stakeholder */
export type BRSRComplaintsRow = {
  stakeholder: string;
  mechanism: string;
  webLink: string;
  cyFiled: string;
  cyPending: string;
  cyRemark: string;
  pyFiled: string;
  pyPending: string;
  pyRemark: string;
};

/** Section A – General Disclosures */
export type BRSRSectionA = {
  /** I. Details of the listed entity */
  details: BRSRIndicator[];
  /** II. Products/Services (gen_16, gen_17) */
  productsServices: {
    businessActivities: BRSRProductsRow[];
    productsSold: BRSRProductsRow[];
  };
  /** III. Operations (gen_18, gen_19, gen_19b, gen_19c) */
  operations: {
    locations: BRSROpsLocationRow[];
    /** i. Number of locations table: National (No. of States), International (No. of Countries) */
    numberOfLocations: BRSRIndicator[];
    markets: BRSRIndicator[];
  };
  /** IV. Employees & workers (gen_20a, gen_20b, gen_21, gen_22) */
  employees: BRSREmployeesSection;
  /** V. Holding/subsidiary/JVs (gen_23) */
  holdingSubsidiary: BRSRHoldingRow[];
  /** VI. CSR (gen_24) */
  csr: BRSRIndicator[];
  /** VII. Complaints (gen_25) */
  complaints: BRSRComplaintsRow[];
  /** VIII. Material issues (gen_26) */
  materialIssues: BRSRMaterialRow[];
};

/** Row for Section B policies matrix (question × P1–P9) */
export type BRSRPoliciesMatrixRow = {
  question: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  p5: string;
  p6: string;
  p7: string;
  p8: string;
  p9: string;
};

/** Section B – Management & Process */
export type BRSRSectionB = {
  /** Policies matrix (sb_1a–12d × P1–P9) */
  policies: BRSRPoliciesMatrixRow[];
  /** Director statement (sb_7) */
  directorStatement: string;
  /** Highest authority (sb_8) */
  highestAuthority: string;
  /** Other reason (sb_12e) */
  otherReason: string;
  /** Leadership (sb_9 committee) – kept for backward compat if needed */
  leadership: BRSRIndicator[];
};

/** Principle data – Essential and Leadership indicators */
export type BRSRPrinciple = {
  ngrbcStatement: string;
  essential: BRSRIndicator[];
  leadership: BRSRIndicator[];
  /** P6 only: grouped sub-sections for readability */
  subsections?: { label: string; indicators: BRSRIndicator[] }[];
};

/** Section C – Principles 1–9 */
export type BRSRSectionC = {
  p1: BRSRPrinciple;
  p2: BRSRPrinciple;
  p3: BRSRPrinciple;
  p4: BRSRPrinciple;
  p5: BRSRPrinciple;
  p6: BRSRPrinciple;
  p7: BRSRPrinciple;
  p8: BRSRPrinciple;
  p9: BRSRPrinciple;
};

/** Full BRSR export data */
export type BRSRExportData = {
  org: BRSROrg;
  reportingYear: BRSRReportingYear;
  sectionA: BRSRSectionA;
  sectionB: BRSRSectionB;
  sectionC: BRSRSectionC;
};

/** Org row from DB (organizations table) */
export type OrgRow = {
  id: string;
  name: string;
  cin?: string | null;
  company_type?: string | null;
  industry?: string | null;
  hq_city?: string | null;
  country?: string | null;
  website?: string | null;
  reporting_year?: string | null;
};

/** Section IDs for export filtering */
export type BRSRSectionId =
  | "sectionA"
  | "sectionB"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "p8"
  | "p9";
