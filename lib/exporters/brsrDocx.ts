/**
 * Builds SEBI-compliant BRSR Word (.docx) documents.
 * A4, 1" margins, table styling per plan.
 */
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  PageBreak,
  WidthType,
  Footer,
  PageNumber,
  AlignmentType,
} from "docx";
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
import { getFYLabels } from "@/lib/brsr/fyLabels";

const MARGIN = 1440; // 1 inch in twips (72pt * 20)
const TABLE_HEADER_FILL = "1F3864";
const TABLE_ALT_FILL = "F2F7FF";
const SECTION_BAR_FILL = "36454F";
const FONT = "Arial";
const SZ_12 = 12 * 2; // section heading
const SZ_10 = 10 * 2; // subheading
const SZ_8 = 8 * 2; // questions + table items

function heading1(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: SZ_12, font: FONT })],
    spacing: { after: 240 },
  });
}

function heading2(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: SZ_12, font: FONT })],
    spacing: { after: 200 },
  });
}

function heading3(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: SZ_10, font: FONT })],
    spacing: { after: 160 },
  });
}

function body(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: SZ_8, font: FONT })],
    spacing: { after: 120 },
  });
}

function bodySerif(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: SZ_8, font: FONT })],
    spacing: { after: 120 },
  });
}

function sectionBar(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, color: "FFFFFF", size: SZ_12, font: FONT })],
    shading: { fill: SECTION_BAR_FILL },
    spacing: { before: 200, after: 160 },
  });
}

function subsectionTitle(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: SZ_10, font: FONT })],
    spacing: { before: 180, after: 120 },
  });
}

function subHeading(text: string) {
  return new Paragraph({
    children: [new TextRun({ text, size: SZ_10, font: FONT })],
    spacing: { before: 120, after: 80 },
  });
}

function cellSerif(text: string, shaded?: boolean) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: SZ_8, font: FONT })] })],
    shading: shaded ? { fill: TABLE_ALT_FILL } : undefined,
  });
}

function indicatorsToTable(indicators: BRSRIndicator[]): Table | null {
  if (indicators.length === 0) return null;
  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Indicator", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        width: { size: 60, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Value", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
    ],
  });
  const bodyRows = indicators.map((ind, i) =>
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: ind.label, size: SZ_8, font: FONT })] })],
          shading: i % 2 === 1 ? { fill: TABLE_ALT_FILL } : undefined,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: ind.value, size: SZ_8, font: FONT })] })],
          shading: i % 2 === 1 ? { fill: TABLE_ALT_FILL } : undefined,
        }),
      ],
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildDetailsTable(indicators: BRSRIndicator[]): Table | null {
  if (indicators.length === 0) return null;
  const headerRow = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Particulars", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        width: { size: 60, type: WidthType.PERCENTAGE },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Notes", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        width: { size: 40, type: WidthType.PERCENTAGE },
      }),
    ],
  });
  const bodyRows = indicators.map((ind, i) =>
    new TableRow({
      children: [
        cellSerif(ind.label, i % 2 === 1),
        cellSerif(ind.value, i % 2 === 1),
      ],
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function cell(text: string, shaded?: boolean) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, size: SZ_8, font: FONT })] })],
    shading: shaded ? { fill: TABLE_ALT_FILL } : undefined,
  });
}

function headerCell(text: string) {
  return new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
    shading: { fill: TABLE_HEADER_FILL },
  });
}

function buildProductsTable(
  rows: BRSRProductsRow[],
  columns: string[],
  keys: (keyof BRSRProductsRow)[],
  useSerif?: boolean
): Table | null {
  if (rows.length === 0) return null;
  const bodyCell = useSerif ? cellSerif : cell;
  const headerRow = new TableRow({
    children: columns.map((c) => headerCell(c)),
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: keys.map((k) => bodyCell(row[k] ?? "", i % 2 === 1)),
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

const HOLDING_COLS = [
  "Name of the holding / subsidiary / associate companies / joint ventures (A)",
  "Indicate whether holding/ Subsidiary/ Associate/ Joint Venture",
  "% of shares held by listed entity",
  "Entity indicated at col A, participate in the Business Responsibility initiatives of the listed entity?",
];

function buildHoldingTable(rows: BRSRHoldingRow[]): Table | null {
  if (rows.length === 0) return null;
  const keys = ["name", "type", "pct", "br"] as const;
  const headerRow = new TableRow({
    children: HOLDING_COLS.map((c) => headerCell(c)),
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: keys.map((k) => cell(row[k] || "—", i % 2 === 1)),
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildMaterialTable(rows: BRSRMaterialRow[]): Table | null {
  if (rows.length === 0) return null;
  const cols = ["Material issue identified", "Indicate whether risk or opportunity", "Rationale for identifying risk/ opportunity", "In case of risk, approach to adapt or mitigate", "Financial implications of the risk or opportunity"];
  const keys = ["issue", "riskOrOpp", "rationale", "approach", "financial"] as const;
  const headerRow = new TableRow({
    children: cols.map((c) => headerCell(c)),
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: keys.map((k) => cell(row[k], i % 2 === 1)),
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildOpsLocationsTable(rows: BRSROpsLocationRow[], useSerif?: boolean): Table | null {
  if (rows.length === 0) return null;
  const bodyCell = useSerif ? cellSerif : cell;
  const cols = ["Location", "Number of plants", "Number of offices", "Total"];
  const keys = ["location", "plants", "offices", "total"] as const;
  const headerRow = new TableRow({
    children: cols.map((c) => headerCell(c)),
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: keys.map((k) => bodyCell(row[k], i % 2 === 1)),
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildMarketsTable(indicators: BRSRIndicator[]): Table | null {
  if (indicators.length === 0) return null;
  const headerRow = new TableRow({
    children: [
      headerCell("Location"),
      headerCell("Number of plants"),
    ],
  });
  const bodyRows = indicators.map((ind, i) =>
    new TableRow({
      children: [
        cellSerif(ind.label, i % 2 === 1),
        cellSerif(ind.value, i % 2 === 1),
      ],
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildEmployeeTable(rows: BRSREmployeeRow[]): Table | null {
  if (rows.length === 0) return null;
  const cols = ["Particulars", "Total (A)", "Male No. (B)", "Male % (B/A)", "Female No. (C)", "Female % (C/A)", "Other Gender No. (D)", "Other Gender % (D/A)"];
  const keys = ["category", "total", "male", "malePct", "female", "femalePct", "other", "otherPct"] as const;
  const headerRow = new TableRow({
    children: cols.map((c) => headerCell(c)),
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: keys.map((k) => cell(row[k] ?? "—", i % 2 === 1)),
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildWomenParticipationTable(rows: BRSRWomenParticipationRow[]): Table | null {
  if (rows.length === 0) return null;
  const cols = ["Total (A)", "No. of Female (B)", "% (B/A) of Females"];
  const keys = ["total", "female", "femalePct"] as const;
  const headerRow = new TableRow({
    children: [
      headerCell("Particulars"),
      ...cols.map((c) => headerCell(c)),
    ],
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: [
        cell(row.category, i % 2 === 1),
        cell(row.total || "—", i % 2 === 1),
        cell(row.female || "—", i % 2 === 1),
        cell(row.femalePct ? `${row.femalePct}%` : "—", i % 2 === 1),
      ],
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildTurnoverCombinedTable(
  empRows: BRSRTurnoverRow[],
  wrkRows: BRSRTurnoverRow[],
  fyLabels: [string, string, string]
): Table | null {
  if (empRows.length === 0 && wrkRows.length === 0) return null;
  const emp = empRows.length >= 3 ? empRows : [
    { year: "Current Year", male: "", female: "", other: "", total: "" },
    { year: "Previous Year", male: "", female: "", other: "", total: "" },
    { year: "Prior to Previous Year", male: "", female: "", other: "", total: "" },
  ];
  const wrk = wrkRows.length >= 3 ? wrkRows : [
    { year: "Current Year", male: "", female: "", other: "", total: "" },
    { year: "Previous Year", male: "", female: "", other: "", total: "" },
    { year: "Prior to Previous Year", male: "", female: "", other: "", total: "" },
  ];
  const val = (r: BRSRTurnoverRow, k: keyof BRSRTurnoverRow) => (r[k] as string) || "—";

  const headerRow1 = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "", size: SZ_8, font: FONT })] })],
        rowSpan: 2,
        shading: { fill: TABLE_HEADER_FILL },
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: fyLabels[0], bold: true, color: "FFFFFF", size: SZ_10, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        columnSpan: 2,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: fyLabels[1], bold: true, color: "FFFFFF", size: SZ_10, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        columnSpan: 2,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: fyLabels[2], bold: true, color: "FFFFFF", size: SZ_10, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        columnSpan: 2,
      }),
    ],
  });

  const headerRow2 = new TableRow({
    children: [
      headerCell("Permanent Employees"),
      headerCell("Permanent Workers"),
      headerCell("Permanent Employees"),
      headerCell("Permanent Workers"),
      headerCell("Permanent Employees"),
      headerCell("Permanent Workers"),
    ],
  });

  const bodyRows = [
    new TableRow({
      children: [
        cell("Male %", false),
        cell(val(emp[0], "male"), false),
        cell(val(wrk[0], "male"), false),
        cell(val(emp[1], "male"), true),
        cell(val(wrk[1], "male"), true),
        cell(val(emp[2], "male"), false),
        cell(val(wrk[2], "male"), false),
      ],
    }),
    new TableRow({
      children: [
        cell("Female %", false),
        cell(val(emp[0], "female"), true),
        cell(val(wrk[0], "female"), true),
        cell(val(emp[1], "female"), false),
        cell(val(wrk[1], "female"), false),
        cell(val(emp[2], "female"), true),
        cell(val(wrk[2], "female"), true),
      ],
    }),
    new TableRow({
      children: [
        cell("Other Gender %", false),
        cell(val(emp[0], "other"), true),
        cell(val(wrk[0], "other"), true),
        cell(val(emp[1], "other"), false),
        cell(val(wrk[1], "other"), false),
        cell(val(emp[2], "other"), true),
        cell(val(wrk[2], "other"), true),
      ],
    }),
    new TableRow({
      children: [
        cell("Total %", false),
        cell(val(emp[0], "total"), false),
        cell(val(wrk[0], "total"), false),
        cell(val(emp[1], "total"), true),
        cell(val(wrk[1], "total"), true),
        cell(val(emp[2], "total"), false),
        cell(val(wrk[2], "total"), false),
      ],
    }),
  ];

  return new Table({
    rows: [headerRow1, headerRow2, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function buildPoliciesMatrix(rows: BRSRPoliciesMatrixRow[]): Table | null {
  if (rows.length === 0) return null;
  const cols = ["Policy question", "P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"];
  const keys = ["question", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"] as const;
  const headerRow = new TableRow({
    children: cols.map((c) => headerCell(c)),
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: keys.map((k) => cell(row[k], i % 2 === 1)),
    })
  );
  return new Table({
    rows: [headerRow, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

const COMPLAINTS_FY_SUBCOLS = [
  "No. of complaints filed during current year",
  "No. of complaints pending resolution at close in current year",
  "Remark",
];

function buildComplaintsTable(
  rows: BRSRComplaintsRow[],
  fyLabels: [string, string]
): Table | null {
  if (rows.length === 0) return null;
  const headerRow1 = new TableRow({
    children: [
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Stakeholder group", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        rowSpan: 2,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Grievance Redressal Mechanism in place", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        rowSpan: 2,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: "Web-link for grievance redress policy", bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        rowSpan: 2,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: fyLabels[0], bold: true, color: "FFFFFF", size: SZ_10, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        columnSpan: 3,
      }),
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: fyLabels[1], bold: true, color: "FFFFFF", size: SZ_10, font: FONT })] })],
        shading: { fill: TABLE_HEADER_FILL },
        columnSpan: 3,
      }),
    ],
  });
  const headerRow2 = new TableRow({
    children: [
      ...COMPLAINTS_FY_SUBCOLS.map((c) => headerCell(c)),
      ...COMPLAINTS_FY_SUBCOLS.map((c) => headerCell(c)),
    ],
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: [
        cell(row.stakeholder, i % 2 === 1),
        cell(row.mechanism || "—", i % 2 === 1),
        cell(row.webLink || "—", i % 2 === 1),
        cell(row.cyFiled || "—", i % 2 === 1),
        cell(row.cyPending || "—", i % 2 === 1),
        cell(row.cyRemark || "—", i % 2 === 1),
        cell(row.pyFiled || "—", i % 2 === 1),
        cell(row.pyPending || "—", i % 2 === 1),
        cell(row.pyRemark || "—", i % 2 === 1),
      ],
    })
  );
  return new Table({
    rows: [headerRow1, headerRow2, ...bodyRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

/**
 * Build BRSR docx. Filter by sections (e.g. ["sectionA","sectionB","p1",...,"p9"]).
 */
export async function buildBRSRDocx(
  data: BRSRExportData,
  sections: BRSRSectionId[] = ["sectionA", "sectionB", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"]
): Promise<Buffer> {
  const children: (Paragraph | Table)[] = [];

  // Section A (page 1 – no cover page)
  if (sections.includes("sectionA")) {
    children.push(sectionBar("SECTION A: GENERAL DISCLOSURES"));

    // I. Details
    if (data.sectionA.details.length > 0) {
      children.push(subsectionTitle("I. Details of the Listed Entity"));
      const tbl = buildDetailsTable(data.sectionA.details);
      if (tbl) children.push(tbl);
    }

    // II. Products/Services – subsections 17 and 18
    const ps = data.sectionA.productsServices;
    if (ps.businessActivities.length > 0 || ps.productsSold.length > 0) {
      children.push(sectionBar("II. Products/Services"));
      const tbl17 = buildProductsTable(
        ps.businessActivities,
        ["Description of main activity", "Description of business activity", "% of Turnover of the entity"],
        ["main", "activity", "pct"],
        true
      );
      if (tbl17) {
        children.push(subsectionTitle("17. Details of business activities (accounting for 90% of the turnover)"));
        children.push(tbl17);
      }
      const tbl18 = buildProductsTable(
        ps.productsSold,
        ["Product/Service", "NIC Code", "% of total Turnover contributed"],
        ["product", "nic", "pct"],
        true
      );
      if (tbl18) {
        children.push(subsectionTitle("18. Products/Services sold by the entity (accounting for 90% of the entity's Turnover)"));
        children.push(tbl18);
      }
    }

    // III. Operations – subsections 19 and 20
    const ops = data.sectionA.operations;
    if (ops.locations.length > 0 || ops.numberOfLocations.length > 0 || ops.markets.length > 0) {
      children.push(sectionBar("III. Operations"));
      const locTbl = buildOpsLocationsTable(ops.locations, true);
      if (locTbl) {
        children.push(subsectionTitle("19. Number of locations where plants and/or operations/offices of the entity are situated"));
        children.push(locTbl);
      }
      const numLocTbl = buildMarketsTable(ops.numberOfLocations);
      const exportPct = ops.markets.find((m) => m.label.includes("19(b)"));
      const customers = ops.markets.find((m) => m.label.includes("19(c)"));
      if (numLocTbl || exportPct || customers) {
        children.push(subsectionTitle("20. Markets served by the entity"));
        if (numLocTbl) {
          children.push(subHeading("i. Number of locations"));
          children.push(numLocTbl);
        }
        if (exportPct && (exportPct.value || exportPct.label)) {
          children.push(subHeading(`ii. ${exportPct.label.replace(/^19\(b\)\.\s*/, "")}`));
          children.push(bodySerif(exportPct.value || "—"));
        }
        if (customers && (customers.value || customers.label)) {
          children.push(subHeading(`iii. ${customers.label.replace(/^19\(c\)\.\s*/, "")}`));
          children.push(bodySerif(customers.value || "—"));
        }
      }
    }

    // IV. Employees
    const emp = data.sectionA.employees;
    const hasEmployees =
      emp.employees.length > 0 ||
      emp.workers.length > 0 ||
      emp.differentlyAbledEmployees.length > 0 ||
      emp.differentlyAbledWorkers.length > 0 ||
      emp.womenParticipation.length > 0 ||
      emp.turnoverEmployees.length > 0 ||
      emp.turnoverWorkers.length > 0;
    if (hasEmployees) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
      children.push(sectionBar("IV. Employees"));
      const has21 = emp.employees.length > 0 || emp.workers.length > 0 || emp.differentlyAbledEmployees.length > 0 || emp.differentlyAbledWorkers.length > 0;
      if (has21) {
        children.push(subsectionTitle("21. Details as at the end of Financial Year"));
        const tbl1 = buildEmployeeTable(emp.employees);
        if (tbl1) {
          children.push(subsectionTitle("i. Employees (including differently abled)"));
          children.push(tbl1);
        }
        const tbl2 = buildEmployeeTable(emp.workers);
        if (tbl2) {
          children.push(subsectionTitle("ii. Workers (including differently abled)"));
          children.push(tbl2);
        }
        const tbl3 = buildEmployeeTable(emp.differentlyAbledEmployees);
        if (tbl3) {
          children.push(subsectionTitle("iii. Differently abled Employees"));
          children.push(tbl3);
        }
        const tbl4 = buildEmployeeTable(emp.differentlyAbledWorkers);
        if (tbl4) {
          children.push(subsectionTitle("iv. Differently abled Workers"));
          children.push(tbl4);
        }
      }
      const wpTbl = buildWomenParticipationTable(emp.womenParticipation);
      if (wpTbl) {
        children.push(subsectionTitle("22. Participation/Inclusion/Representation of women"));
        children.push(wpTbl);
      }
      const fyLabels = getFYLabels(data.reportingYear);
      const toTbl = buildTurnoverCombinedTable(emp.turnoverEmployees, emp.turnoverWorkers, fyLabels);
      if (toTbl) {
        children.push(subsectionTitle("23. Turnover rate for permanent employees and workers"));
        children.push(toTbl);
      }
    }

    // Holding, Subsidiary & Assoc. Companies (including joint ventures)
    if (data.sectionA.holdingSubsidiary.length > 0) {
      children.push(sectionBar("V. Holding, Subsidiary & Assoc. Companies (including joint ventures)"));
      children.push(subsectionTitle("23. Names of holding / subsidiary / associate companies / joint ventures"));
      const tbl = buildHoldingTable(data.sectionA.holdingSubsidiary);
      if (tbl) children.push(tbl);
    }

    // VI. CSR Details
    if (data.sectionA.csr.length > 0) {
      children.push(sectionBar("VI. CSR Details"));
      children.push(subsectionTitle("25. Enter details for Corporate Social Responsibility(CSR)"));
      const csrLabels = [
        "i. Whether CSR is applicable as per section 135 of Companies Act, 2013",
        "ii. Turnover (In INR)",
        "iii. Net worth (In INR)",
      ];
      for (let i = 0; i < csrLabels.length; i++) {
        children.push(subHeading(csrLabels[i]));
        children.push(body(data.sectionA.csr[i]?.value || "—"));
      }
    }

    // VII. Complaints
    if (data.sectionA.complaints.length > 0) {
      children.push(sectionBar("VII. Complaints on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct."));
      children.push(subsectionTitle("25. Complaints on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct."));
      const [fy1, fy2] = getFYLabels(data.reportingYear);
      const tbl = buildComplaintsTable(data.sectionA.complaints, [fy1, fy2]);
      if (tbl) children.push(tbl);
    }

    // VIII. Material Issues
    if (data.sectionA.materialIssues.length > 0) {
      children.push(sectionBar("VIII. Material Issues"));
      const tbl = buildMaterialTable(data.sectionA.materialIssues);
      if (tbl) children.push(tbl);
    }

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Section B
  if (sections.includes("sectionB")) {
    children.push(heading2("Section B – Management & Process"));
    children.push(heading3("I. Policy and management processes"));
    const policiesTbl = buildPoliciesMatrix(data.sectionB.policies);
    if (policiesTbl) children.push(policiesTbl);
    if (data.sectionB.directorStatement && data.sectionB.directorStatement !== "—") {
      children.push(heading3("7. Statement by director"));
      children.push(body(data.sectionB.directorStatement));
    }
    if (data.sectionB.highestAuthority && data.sectionB.highestAuthority !== "—") {
      children.push(heading3("8. Highest authority"));
      children.push(body(data.sectionB.highestAuthority));
    }
    if (data.sectionB.leadership.length > 0) {
      children.push(heading3("9. Committee of Board"));
      const leadershipTbl = indicatorsToTable(data.sectionB.leadership);
      if (leadershipTbl) children.push(leadershipTbl);
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Section C – Principles 1–9
  for (let n = 1; n <= 9; n++) {
    const pid = `p${n}` as BRSRSectionId;
    if (!sections.includes(pid)) continue;
    const p = data.sectionC[`p${n}` as keyof typeof data.sectionC];
    if (!p) continue;
    children.push(heading2(`Principle ${n}`));
    if (p.ngrbcStatement) {
      children.push(body(p.ngrbcStatement));
    }
    if (p.subsections && p.subsections.length > 0) {
      for (const sub of p.subsections) {
        children.push(heading3(sub.label));
        const tbl = indicatorsToTable(sub.indicators);
        if (tbl) children.push(tbl);
      }
    } else {
      if (p.essential.length > 0) {
        children.push(heading3("Essential Indicators"));
        const tbl = indicatorsToTable(p.essential);
        if (tbl) children.push(tbl);
      }
      if (p.leadership.length > 0) {
        children.push(heading3("Leadership Indicators"));
        const tbl = indicatorsToTable(p.leadership);
        if (tbl) children.push(tbl);
      }
    }
    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: MARGIN,
              right: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.LEFT,
                            children: [new TextRun({ text: `${data.org.name} - `, font: FONT, size: SZ_8 })],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
                                font: FONT,
                                size: SZ_8,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
                width: { size: 100, type: WidthType.PERCENTAGE },
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}
