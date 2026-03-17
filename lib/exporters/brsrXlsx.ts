/**
 * Builds BRSR Excel (.xlsx) export.
 * One sheet per section with tabular layout.
 * Structured types are flattened to row-based tables.
 */
import * as XLSX from "xlsx";
import type {
  BRSRExportData,
  BRSREmployeeRow,
  BRSRIndicator,
  BRSRPoliciesMatrixRow,
  BRSRProductsRow,
  BRSRHoldingRow,
  BRSRMaterialRow,
  BRSROpsLocationRow,
  BRSRComplaintsRow,
  BRSRSectionId,
  BRSRTurnoverRow,
  BRSRWomenParticipationRow,
} from "@/types/brsr";

function indicatorsToAoa(indicators: BRSRIndicator[]): (string | number)[][] {
  if (indicators.length === 0) return [];
  return [["Indicator", "Value"], ...indicators.map((ind) => [ind.label, ind.value])];
}

function productsRowsToAoa(rows: BRSRProductsRow[], columns: string[], keys: (keyof BRSRProductsRow)[]): (string | number)[][] {
  if (rows.length === 0) return [];
  return [columns, ...rows.map((r) => keys.map((k) => r[k] ?? ""))];
}

function holdingRowsToAoa(rows: BRSRHoldingRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Name", "Type", "% shares", "BR participation"];
  const keys = ["name", "type", "pct", "br"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k]))];
}

function materialRowsToAoa(rows: BRSRMaterialRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Material issue identified", "Indicate whether risk or opportunity", "Rationale for identifying risk/ opportunity", "In case of risk, approach to adapt or mitigate", "Financial implications of the risk or opportunity"];
  const keys = ["issue", "riskOrOpp", "rationale", "approach", "financial"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k]))];
}

function opsLocationRowsToAoa(rows: BRSROpsLocationRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Location", "Number of plants", "Number of offices", "Total"];
  const keys = ["location", "plants", "offices", "total"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k]))];
}

function complaintsRowsToAoa(rows: BRSRComplaintsRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Stakeholder", "Mechanism", "Web-link", "CY Filed", "CY Pending", "CY Remark", "PY Filed", "PY Pending", "PY Remark"];
  const keys = ["stakeholder", "mechanism", "webLink", "cyFiled", "cyPending", "cyRemark", "pyFiled", "pyPending", "pyRemark"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k]))];
}

function employeeRowsToAoa(rows: BRSREmployeeRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Particulars", "Total (A)", "Male No. (B)", "Male % (B/A)", "Female No. (C)", "Female % (C/A)", "Other Gender No. (D)", "Other Gender % (D/A)"];
  const keys = ["category", "total", "male", "malePct", "female", "femalePct", "other", "otherPct"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k] ?? ""))];
}

function womenParticipationRowsToAoa(rows: BRSRWomenParticipationRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Particulars", "Total (A)", "No. of Female (B)", "% (B/A) of Females"];
  return [cols, ...rows.map((r) => [r.category, r.total, r.female, r.femalePct ? `${r.femalePct}%` : ""])];
}

function turnoverRowsToAoa(rows: BRSRTurnoverRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Year", "Male %", "Female %", "Other Gender %", "Total %"];
  const keys = ["year", "male", "female", "other", "total"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k]))];
}

function policiesMatrixToAoa(rows: BRSRPoliciesMatrixRow[]): (string | number)[][] {
  if (rows.length === 0) return [];
  const cols = ["Policy question", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"];
  const keys = ["question", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"] as const;
  return [cols, ...rows.map((r) => keys.map((k) => r[k]))];
}

/**
 * Build BRSR xlsx. Filter by sections.
 */
export async function buildBRSRXlsx(
  data: BRSRExportData,
  sections: BRSRSectionId[] = ["sectionA", "sectionB", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"]
): Promise<Buffer> {
  const wb = XLSX.utils.book_new();

  // Cover / Org info
  const coverData: (string | number)[][] = [
    ["BRSR Export"],
    ["Organization", data.org.name],
    ["CIN", data.org.cin],
    ["Reporting Year", data.reportingYear.current],
    ["Company Type", data.org.companyType],
    ["Sector", data.org.sector],
    ["HQ City", data.org.hqCity],
    ["Country", data.org.hqCountry],
    ["Website", data.org.website],
  ];
  const coverSheet = XLSX.utils.aoa_to_sheet(coverData);
  XLSX.utils.book_append_sheet(wb, coverSheet, "Cover");

  if (sections.includes("sectionA")) {
    if (data.sectionA.details.length > 0) {
      const sheet = XLSX.utils.aoa_to_sheet(indicatorsToAoa(data.sectionA.details));
      XLSX.utils.book_append_sheet(wb, sheet, "A_Details");
    }
    const ps = data.sectionA.productsServices;
    if (ps.businessActivities.length > 0) {
      const aoa = productsRowsToAoa(ps.businessActivities, ["Description of main activity", "Description of business activity", "% of Turnover"], ["main", "activity", "pct"]);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "A_Products_16");
    }
    if (ps.productsSold.length > 0) {
      const aoa = productsRowsToAoa(ps.productsSold, ["Product/Service", "NIC Code", "% of total Turnover"], ["product", "nic", "pct"]);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "A_Products_17");
    }
    const ops = data.sectionA.operations;
    if (ops.locations.length > 0) {
      const aoa = opsLocationRowsToAoa(ops.locations);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "A_Ops_Locations");
    }
    if (ops.markets.length > 0) {
      const sheet = XLSX.utils.aoa_to_sheet(indicatorsToAoa(ops.markets));
      XLSX.utils.book_append_sheet(wb, sheet, "A_Ops_Markets");
    }
    const emp = data.sectionA.employees;
    const empAoa = employeeRowsToAoa(emp.employees);
    if (empAoa.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(empAoa), "A_Emp_21i");
    }
    const wrkAoa = employeeRowsToAoa(emp.workers);
    if (wrkAoa.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wrkAoa), "A_Wrk_21ii");
    }
    const daEmpAoa = employeeRowsToAoa(emp.differentlyAbledEmployees);
    if (daEmpAoa.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(daEmpAoa), "A_DA_Emp");
    }
    const daWrkAoa = employeeRowsToAoa(emp.differentlyAbledWorkers);
    if (daWrkAoa.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(daWrkAoa), "A_DA_Wrk");
    }
    if (emp.womenParticipation.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(womenParticipationRowsToAoa(emp.womenParticipation)), "A_Women_22");
    }
    const toEmpAoa = turnoverRowsToAoa(emp.turnoverEmployees);
    if (toEmpAoa.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(toEmpAoa), "A_Turnover_Emp");
    }
    const toWrkAoa = turnoverRowsToAoa(emp.turnoverWorkers);
    if (toWrkAoa.length > 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(toWrkAoa), "A_Turnover_Wrk");
    }
    if (data.sectionA.holdingSubsidiary.length > 0) {
      const aoa = holdingRowsToAoa(data.sectionA.holdingSubsidiary);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "A_Holding");
    }
    if (data.sectionA.csr.length > 0) {
      const sheet = XLSX.utils.aoa_to_sheet(indicatorsToAoa(data.sectionA.csr));
      XLSX.utils.book_append_sheet(wb, sheet, "A_CSR");
    }
    if (data.sectionA.complaints.length > 0) {
      const aoa = complaintsRowsToAoa(data.sectionA.complaints);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "A_Complaints");
    }
    if (data.sectionA.materialIssues.length > 0) {
      const aoa = materialRowsToAoa(data.sectionA.materialIssues);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), "A_Material");
    }
  }

  if (sections.includes("sectionB")) {
    const policiesAoa = policiesMatrixToAoa(data.sectionB.policies);
    if (policiesAoa.length > 0) {
      const sheet = XLSX.utils.aoa_to_sheet(policiesAoa);
      XLSX.utils.book_append_sheet(wb, sheet, "B_Policies");
    }
    const leadershipAoa = indicatorsToAoa(data.sectionB.leadership);
    if (leadershipAoa.length > 0) {
      const sheet = XLSX.utils.aoa_to_sheet(leadershipAoa);
      XLSX.utils.book_append_sheet(wb, sheet, "B_Leadership");
    }
  }

  for (let n = 1; n <= 9; n++) {
    const pid = `p${n}` as BRSRSectionId;
    if (!sections.includes(pid)) continue;
    const p = data.sectionC[`p${n}` as keyof typeof data.sectionC];
    if (!p) continue;
    if (p.subsections && p.subsections.length > 0) {
      for (let i = 0; i < p.subsections.length; i++) {
        const sub = p.subsections[i];
        const aoa = indicatorsToAoa(sub.indicators);
        if (aoa.length > 0) {
          XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), `P${n}_${String(i + 1).padStart(2, "0")}`);
        }
      }
    } else {
      const essentialAoa = indicatorsToAoa(p.essential);
      const hasEssential = essentialAoa.length > 0 || p.ngrbcStatement;
      if (hasEssential) {
        const rows: (string | number)[][] = p.ngrbcStatement
          ? [["NGRBC Statement", p.ngrbcStatement], ...essentialAoa]
          : essentialAoa;
        const sheet = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(wb, sheet, `P${n}_Essential`);
      }
      const leadershipAoa = indicatorsToAoa(p.leadership);
      if (leadershipAoa.length > 0) {
        const sheet = XLSX.utils.aoa_to_sheet(leadershipAoa);
        XLSX.utils.book_append_sheet(wb, sheet, `P${n}_Leadership`);
      }
    }
  }

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}
