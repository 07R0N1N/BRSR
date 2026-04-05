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
  TabStopType,
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
  SBQ10Row,
  SBQ11Row,
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

/** Sentinel emitted by brsrDataMapper for unanswered fields. */
const MAPPER_EMPTY = "—";
/** Footer tab stop: A4 content width at 1-inch margins (11906 − 2×1440 twips). */
const FOOTER_TAB_TWIPS = 9026;

/** Unanswered value for prose/narrative contexts. */
export const PROSE_EMPTY = "Disclosure Not Available";

/**
 * Table-cell value: converts mapper sentinel / null / blank to an empty
 * string so cells are left blank rather than showing "—".
 */
export function tv(v: string | null | undefined): string {
  if (v == null || v === MAPPER_EMPTY || v === "") return "";
  return v;
}

/**
 * Prose value: converts mapper sentinel / null / blank to the standard
 * "Disclosure Not Available" disclosure string for narrative paragraphs.
 */
export function pv(v: string | null | undefined): string {
  if (v == null || v === MAPPER_EMPTY || v === "") return PROSE_EMPTY;
  return v;
}

/**
 * Returns true when every value in the array is blank or the mapper sentinel.
 * Used to skip all-empty dynamic rows in table builders.
 */
export function isRowEmpty(vals: (string | null | undefined)[]): boolean {
  return vals.every((v) => v == null || v === MAPPER_EMPTY || v === "");
}

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
    children: [new Paragraph({ children: [new TextRun({ text: tv(text), size: SZ_8, font: FONT })] })],
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
          children: [new Paragraph({ children: [new TextRun({ text: tv(ind.value), size: SZ_8, font: FONT })] })],
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

/**
 * Section A Q1–Q14 table: 3-column layout per the Eternal reference format.
 * Column widths are equal thirds of A4 content width at 1-inch margins (~3009 DXA each).
 */
function buildSectionADetailsTable(indicators: BRSRIndicator[]): Table | null {
  if (indicators.length === 0) return null;
  const COL_W = 3009; // 1/3 of 9026 twips content width, in DXA
  const hdr = (text: string) =>
    new TableCell({
      children: [new Paragraph({ children: [new TextRun({ text, bold: true, color: "FFFFFF", size: SZ_8, font: FONT })] })],
      shading: { fill: TABLE_HEADER_FILL },
      width: { size: COL_W, type: WidthType.DXA },
    });
  const headerRow = new TableRow({ children: [hdr("Question"), hdr("Value"), hdr("Notes")] });
  const bodyRows = indicators.map((ind, i) =>
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: ind.label, size: SZ_8, font: FONT })] })],
          shading: i % 2 === 1 ? { fill: TABLE_ALT_FILL } : undefined,
          width: { size: COL_W, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: tv(ind.value), size: SZ_8, font: FONT })] })],
          shading: i % 2 === 1 ? { fill: TABLE_ALT_FILL } : undefined,
          width: { size: COL_W, type: WidthType.DXA },
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: "", size: SZ_8, font: FONT })] })],
          shading: i % 2 === 1 ? { fill: TABLE_ALT_FILL } : undefined,
          width: { size: COL_W, type: WidthType.DXA },
        }),
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
    children: [new Paragraph({ children: [new TextRun({ text: tv(text), size: SZ_8, font: FONT })] })],
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
  const val = (r: BRSRTurnoverRow, k: keyof BRSRTurnoverRow) => tv(r[k] as string);

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

const PRINCIPLE_LABELS = ["P1", "P2", "P3", "P4", "P5", "P6", "P7", "P8", "P9"] as const;
const PRINCIPLE_KEYS = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8", "p9"] as const;

/**
 * Q1 — 4-column table, P1–P9 as rows: Principle | Policy covers NGRBCs? | Board approved? | Weblink
 * Reads keys "1a", "1b", "1c" from the policies array and transposes to principle rows.
 */
function buildQ1Table(policies: BRSRPoliciesMatrixRow[]): Table | null {
  const r1a = policies.find((r) => r.key === "1a");
  const r1b = policies.find((r) => r.key === "1b");
  const r1c = policies.find((r) => r.key === "1c");
  if (!r1a && !r1b && !r1c) return null;
  const headerRow = new TableRow({
    children: [
      headerCell("Principle"),
      headerCell("Policy covers NGRBCs?"),
      headerCell("Board approved?"),
      headerCell("Web link"),
    ],
  });
  const bodyRows = PRINCIPLE_KEYS.map((pk, i) =>
    new TableRow({
      children: [
        cell(PRINCIPLE_LABELS[i], i % 2 === 1),
        cell(r1a?.[pk] ?? "", i % 2 === 1),
        cell(r1b?.[pk] ?? "", i % 2 === 1),
        cell(r1c?.[pk] ?? "", i % 2 === 1),
      ],
    })
  );
  return new Table({ rows: [headerRow, ...bodyRows], width: { size: 100, type: WidthType.PERCENTAGE } });
}

/**
 * Q2–Q6 — one 2-column table per question, P1–P9 as rows: Principle | Answer.
 * Pass the single matching policies row for the question key.
 */
function buildQ2to6Table(row: BRSRPoliciesMatrixRow | undefined, questionLabel: string): Table | null {
  if (!row) return null;
  const headerRow = new TableRow({
    children: [headerCell("Principle"), headerCell(questionLabel)],
  });
  const bodyRows = PRINCIPLE_KEYS.map((pk, i) =>
    new TableRow({
      children: [cell(PRINCIPLE_LABELS[i], i % 2 === 1), cell(row[pk], i % 2 === 1)],
    })
  );
  return new Table({ rows: [headerRow, ...bodyRows], width: { size: 100, type: WidthType.PERCENTAGE } });
}

/**
 * Q9 — standalone 2-column table, P1–P9 as rows: Principle | Committee value.
 * Reads from `leadership` BRSRIndicator array (sb_9_p1…p9).
 */
function buildQ9Table(leadership: BRSRIndicator[]): Table | null {
  if (leadership.length === 0) return null;
  const headerRow = new TableRow({
    children: [headerCell("Principle"), headerCell("Committee responsible for oversight")],
  });
  const bodyRows = PRINCIPLE_LABELS.map((pl, i) => {
    const ind = leadership[i];
    return new TableRow({
      children: [cell(pl, i % 2 === 1), cell(ind?.value ?? "", i % 2 === 1)],
    });
  });
  return new Table({ rows: [headerRow, ...bodyRows], width: { size: 100, type: WidthType.PERCENTAGE } });
}

/**
 * Q10(a/b) — one 4-column table per sub-question, P1–P9 as rows:
 * Principle | Review Oversight | Frequency | Description.
 */
function buildQ10Table(rows: SBQ10Row[]): Table | null {
  if (rows.length === 0) return null;
  const headerRow = new TableRow({
    children: [
      headerCell("Principle"),
      headerCell("Review Oversight"),
      headerCell("Frequency"),
      headerCell("Description"),
    ],
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: [
        cell(row.principle, i % 2 === 1),
        cell(row.review, i % 2 === 1),
        cell(row.freq, i % 2 === 1),
        cell(row.desc, i % 2 === 1),
      ],
    })
  );
  return new Table({ rows: [headerRow, ...bodyRows], width: { size: 100, type: WidthType.PERCENTAGE } });
}

/**
 * Q11 — 3-column table, P1–P9 as rows: Principle | Assessment carried out? | Name of agency.
 */
function buildQ11Table(rows: SBQ11Row[]): Table | null {
  if (rows.length === 0) return null;
  const headerRow = new TableRow({
    children: [
      headerCell("Principle"),
      headerCell("Assessment carried out?"),
      headerCell("Name of external agency"),
    ],
  });
  const bodyRows = rows.map((row, i) =>
    new TableRow({
      children: [
        cell(row.principle, i % 2 === 1),
        cell(row.yn, i % 2 === 1),
        cell(row.agency, i % 2 === 1),
      ],
    })
  );
  return new Table({ rows: [headerRow, ...bodyRows], width: { size: 100, type: WidthType.PERCENTAGE } });
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
    children.push(sectionBar("Section A: General Disclosures"));

    // I. Details (3-column: Question | Value | Notes)
    if (data.sectionA.details.length > 0) {
      children.push(subsectionTitle("I. Details of the Listed Entity"));
      const tbl = buildSectionADetailsTable(data.sectionA.details);
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
          children.push(bodySerif(pv(exportPct.value)));
        }
        if (customers && (customers.value || customers.label)) {
          children.push(subHeading(`iii. ${customers.label.replace(/^19\(c\)\.\s*/, "")}`));
          children.push(bodySerif(pv(customers.value)));
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
        children.push(body(pv(data.sectionA.csr[i]?.value)));
      }
    }

    // VII. Transparency and Disclosures Compliances
    if (data.sectionA.complaints.length > 0) {
      children.push(sectionBar("VII. Transparency and Disclosures Compliances"));
      children.push(subsectionTitle("26. Complaints/Grievances on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct."));
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
    children.push(heading2("Section B: Management & Process Disclosures"));

    // I. Policy and management processes — per-question principle tables
    children.push(heading3("I. Policy and management processes"));

    // Q1: 4-column (Principle | Policy covers NGRBCs? | Board approved? | Weblink)
    const q1Tbl = buildQ1Table(data.sectionB.policies);
    if (q1Tbl) {
      children.push(subsectionTitle("1. Policy Details"));
      children.push(q1Tbl);
    }

    // Q2–Q6: 2-column tables (Principle | Answer)
    const Q2_TO_6: Array<{ key: string; label: string }> = [
      { key: "2", label: "Answer" },
      { key: "3", label: "Answer" },
      { key: "4", label: "Answer" },
      { key: "5", label: "Answer" },
      { key: "6", label: "Answer" },
    ];
    for (const { key, label } of Q2_TO_6) {
      const row = data.sectionB.policies.find((r) => r.key === key);
      if (row) {
        const tbl = buildQ2to6Table(row, label);
        if (tbl) {
          children.push(subsectionTitle(row.question));
          children.push(tbl);
        }
      }
    }

    // Q10(a): performance review — 4-column (Principle | Review Oversight | Frequency | Description)
    const q10aTbl = buildQ10Table(data.sectionB.q10Performance);
    if (q10aTbl) {
      children.push(subsectionTitle("10(a). Review of NGRBCs – Performance vs policies"));
      children.push(q10aTbl);
    }

    // Q10(b): compliance — same structure
    const q10bTbl = buildQ10Table(data.sectionB.q10Compliance);
    if (q10bTbl) {
      children.push(subsectionTitle("10(b). Compliance with statutory requirements"));
      children.push(q10bTbl);
    }

    // Q11: independent assessment — 3-column
    const q11Tbl = buildQ11Table(data.sectionB.q11Assessment);
    if (q11Tbl) {
      children.push(subsectionTitle("11. Independent assessment by external agency"));
      children.push(q11Tbl);
    }

    // II. Governance, leadership and oversight
    children.push(heading3("II. Governance, leadership and oversight"));

    // Q7: Statement by director — always render (prose)
    children.push(subsectionTitle("7. Statement by director responsible for the business responsibility report, highlighting ESG related challenges, targets and achievements"));
    children.push(body(pv(data.sectionB.directorStatement)));

    // Q8: Highest authority — always render (prose)
    children.push(subsectionTitle("8. Details of the highest authority responsible for implementation and oversight of the BR policy"));
    children.push(body(pv(data.sectionB.highestAuthority)));

    // Q9: Committee of Board — standalone 2-column principle table
    const q9Tbl = buildQ9Table(data.sectionB.leadership);
    if (q9Tbl) {
      children.push(subsectionTitle("9. Does the entity have a specified Committee of the Board / Director responsible for decision making on sustainability related issues?"));
      children.push(q9Tbl);
    }

    // Section Notes
    children.push(new Paragraph({
      children: [new TextRun({ text: "Section Notes", bold: true, size: SZ_10, font: FONT })],
      spacing: { before: 240, after: 120 },
    }));
    children.push(subsectionTitle("28. Do you have any additional details to provide on the Responsible Business Conduct policies and governance?"));
    children.push(body(PROSE_EMPTY));

    children.push(new Paragraph({ children: [new PageBreak()] }));
  }

  // Section C – Principles 1–9
  let sectionCHeadingAdded = false;
  for (let n = 1; n <= 9; n++) {
    const pid = `p${n}` as BRSRSectionId;
    if (!sections.includes(pid)) continue;
    const p = data.sectionC[`p${n}` as keyof typeof data.sectionC];
    if (!p) continue;
    if (!sectionCHeadingAdded) {
      children.push(heading2("Section C: Principle wise performance disclosure"));
      sectionCHeadingAdded = true;
    }
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
    // Section Notes block at the end of each principle
    children.push(new Paragraph({
      children: [new TextRun({ text: "Section Notes", bold: true, size: SZ_10, font: FONT })],
      spacing: { before: 200, after: 100 },
    }));
    children.push(subsectionTitle("Do you have any additional details to provide on the responsible business conduct of your entity?"));
    children.push(body(PROSE_EMPTY));
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
              new Paragraph({
                tabStops: [{ type: TabStopType.RIGHT, position: FOOTER_TAB_TWIPS }],
                children: [
                  new TextRun({ text: `${data.org.name} - `, font: FONT, size: SZ_8 }),
                  new TextRun({ text: "\t" }),
                  new TextRun({
                    children: ["Page ", PageNumber.CURRENT, " of ", PageNumber.TOTAL_PAGES],
                    font: FONT,
                    size: SZ_8,
                  }),
                ],
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
