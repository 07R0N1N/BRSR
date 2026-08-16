import type { PanelId } from "./types";
import { getQuestionCodesForPanel } from "./questionConfig";
import { getPrincipleTemplate } from "./principleTemplates";
import { getStaticPrincipleBlocks } from "./principleBlocksConfig";

/** Migrated principles that use principleBlocksConfig instead of HTML template parsing */
const MIGRATED_PRINCIPLES = new Set([1, 2, 3, 4, 5, 7, 8, 9]);

export type Department =
  | "HR"
  | "Sustainability"
  | "CS/Legal"
  | "Finance"
  | "Marketing"
  | "IT"
  | "Procurement";

export type AssignmentBlock = {
  id: string;
  label: string;
  questionCodes: string[];
  /** Suggested owner department(s) for admin chips. Omitted when untagged. */
  departments?: Department[];
};

/**
 * Static department tags by assignment-block id. Not used for access or RLS.
 * Blocks with no entry are intentionally untagged.
 */
export const BLOCK_DEPARTMENTS: Record<string, Department[]> = {
  // General Data
  generaldata_turnover_ppp: ["Finance"],
  generaldata_emp_worker: ["HR"],

  // Section A — General Disclosures
  general_1: ["CS/Legal"],
  general_2: ["CS/Legal"],
  general_3: ["CS/Legal"],
  general_4: ["CS/Legal"],
  general_5: ["CS/Legal"],
  general_8: ["Marketing", "IT"],
  general_9: ["Finance"],
  general_10: ["CS/Legal"],
  general_11: ["Finance"],
  general_12: ["Sustainability"],
  general_13: ["Sustainability"],
  general_14: ["Sustainability"],
  general_15: ["Sustainability"],
  general_16: ["Finance"],
  general_17: ["Finance"],
  general_19: ["Marketing"],
  general_19b: ["Finance"],
  general_19c: ["Marketing"],
  general_20a: ["HR"],
  general_20b: ["HR"],
  general_21: ["HR", "CS/Legal"],
  general_22: ["HR"],
  general_23: ["CS/Legal"],
  general_24: ["Finance", "Sustainability"],
  general_25: ["CS/Legal"],
  general_26: ["Sustainability"],

  // Section B — Management & Process
  sectionb_1a: ["Sustainability"],
  sectionb_1b: ["Sustainability", "CS/Legal"],
  sectionb_1c: ["Sustainability"],
  sectionb_2: ["Sustainability"],
  sectionb_3: ["Sustainability", "Procurement"],
  sectionb_4: ["Sustainability"],
  sectionb_5: ["Sustainability"],
  sectionb_6: ["Sustainability"],
  sectionb_7: ["Sustainability", "CS/Legal"],
  sectionb_8: ["Sustainability", "CS/Legal"],
  sectionb_9: ["Sustainability", "CS/Legal"],
  sectionb_10a: ["Sustainability"],
  sectionb_10b: ["CS/Legal"],
  sectionb_11: ["Sustainability"],

  // Principle 1
  p1_1: ["HR"],
  p1_2: ["CS/Legal"],
  p1_3: ["CS/Legal"],
  p1_4: ["CS/Legal"],
  p1_5: ["CS/Legal", "HR"],
  p1_6: ["CS/Legal"],
  p1_7: ["CS/Legal"],
  p1_8: ["Finance"],
  p1_9: ["Finance", "Procurement"],
  p1_l1: ["Procurement"],
  p1_l2: ["CS/Legal"],

  // Principle 2
  p2_1: ["Finance", "Sustainability"],
  p2_2: ["Procurement", "Sustainability"],
  p2_3: ["Sustainability"],
  p2_4: ["Sustainability", "CS/Legal"],
  p2_l1: ["Sustainability"],
  p2_l2: ["Sustainability"],
  p2_l3: ["Procurement", "Sustainability"],
  p2_l4: ["Sustainability"],
  p2_l5: ["Sustainability"],

  // Principle 3
  p3_1a: ["HR"],
  p3_1b: ["HR"],
  p3_1c: ["HR", "Finance"],
  p3_2: ["HR", "Finance"],
  p3_3: ["HR"],
  p3_4: ["HR"],
  p3_5: ["HR"],
  p3_6: ["HR"],
  p3_7: ["HR"],
  p3_8: ["HR"],
  p3_9: ["HR"],
  p3_10: ["HR", "Sustainability"],
  p3_11: ["HR", "Sustainability"],
  p3_12: ["HR", "Sustainability"],
  p3_13: ["HR"],
  p3_14: ["HR", "Sustainability"],
  p3_15: ["HR", "Sustainability"],
  p3_l1: ["HR"],
  p3_l2: ["Procurement"],
  p3_l3: ["HR"],
  p3_l4: ["HR"],
  p3_l5: ["Procurement"],
  p3_l6: ["Procurement"],

  // Principle 4
  p4_1: ["Sustainability"],
  p4_2: ["Sustainability", "Marketing"],
  p4_l1: ["Sustainability", "CS/Legal"],
  p4_l2: ["Sustainability"],
  p4_l3: ["Sustainability"],

  // Principle 5
  p5_1: ["HR"],
  p5_2: ["HR", "Finance"],
  p5_3a: ["HR", "Finance"],
  p5_3b: ["HR", "Finance"],
  p5_4: ["HR", "CS/Legal"],
  p5_5: ["HR"],
  p5_6: ["HR"],
  p5_7: ["HR", "CS/Legal"],
  p5_8: ["HR"],
  p5_9: ["CS/Legal", "Procurement"],
  p5_10: ["HR"],
  p5_11: ["HR"],
  p5_l1: ["HR"],
  p5_l2: ["Sustainability", "CS/Legal"],
  p5_l3: ["HR"],
  p5_l4: ["Procurement"],
  p5_l5: ["Procurement"],

  // Principle 6
  p6_e1: ["Sustainability"],
  p6_e2: ["Sustainability"],
  p6_e3: ["Sustainability"],
  p6_e4: ["Sustainability"],
  p6_e5: ["Sustainability"],
  p6_e6: ["Sustainability"],
  p6_e7: ["Sustainability"],
  p6_e8: ["Sustainability"],
  p6_e9: ["Sustainability"],
  p6_e10: ["Sustainability"],
  p6_e11: ["Sustainability"],
  p6_e12: ["Sustainability"],
  p6_e13: ["Sustainability", "CS/Legal"],
  p6_l1: ["Sustainability"],
  p6_l2: ["Sustainability"],
  p6_l3: ["Sustainability"],
  p6_l4: ["Sustainability"],
  p6_l5: ["Sustainability", "IT"],
  p6_l6: ["Sustainability", "Procurement"],
  p6_l7: ["Procurement"],
  p6_l8: ["Sustainability"],

  // Principle 7
  p7_1a: ["CS/Legal"],
  p7_1b: ["CS/Legal"],
  p7_2: ["CS/Legal"],
  p7_l1: ["CS/Legal"],

  // Principle 8
  p8_1: ["Sustainability"],
  p8_2: ["Sustainability"],
  p8_3: ["Sustainability"],
  p8_4: ["Procurement"],
  p8_5: ["HR", "Finance"],
  p8_l1: ["Sustainability"],
  p8_l2: ["Sustainability"],
  p8_l3: ["Procurement"],
  p8_l4: ["CS/Legal"],
  p8_l5: ["CS/Legal"],
  p8_l6: ["Sustainability"],

  // Principle 9
  p9_1: ["CS/Legal"],
  p9_2: ["Marketing"],
  p9_3: ["CS/Legal", "IT", "Marketing"],
  p9_4: ["CS/Legal"],
  p9_5: ["IT", "CS/Legal"],
  p9_6: ["CS/Legal"],
  p9_7: ["IT", "CS/Legal"],
  p9_l1: ["Marketing"],
  p9_l2: ["Marketing"],
  p9_l3: ["Marketing", "CS/Legal"],
  p9_l4: ["Marketing"],
};

/** Labels for General Disclosures (Section A) – exported for BRSR export mapper */
export const GENERAL_LABELS: Record<string, string> = {
  "1": "1. Corporate Identity Number (CIN)",
  "2": "2. Name of the Listed Entity",
  "3": "3. Date of Incorporation",
  "4": "4. Registered office address",
  "5": "5. Corporate address",
  "6": "6. E-mail address",
  "7": "7. Telephone No.",
  "8": "8. Website",
  "9": "9. Financial year for which reporting is being done",
  "10": "10. Name of the Stock Exchange(s) where shares are listed",
  "11": "11. Paid-up Capital (in INR)",
  "12": "12. Name and contact details of the person who may be contacted in case of any queries on the BRSR report",
  "13": "13. Reporting boundary",
  "14": "14. Details of Assurer(s)",
  "15": "15. Type of assurance obtained",
  "16": "16. Details of business activities (accounting for 90% of turnover)",
  "17": "17. Products/Services sold (accounting for 90% of turnover)",
  "18": "18. Number of locations where plants and/or operations/offices of the entity are situated",
  "19": "19. Markets served by the entity",
  "19b": "19(b). Contribution of exports as % of total turnover",
  "19c": "19(c). Brief on types of customers",
  "20a": "20. Details as at the end of Financial Year – i. Employees, ii. Workers",
  "20b": "20. Details as at the end of Financial Year – iii. Differently abled Employees, iv. Differently abled Workers",
  "21": "21. Participation/Inclusion/Representation of women",
  "22": "22. Turnover rate for permanent employees and workers",
  "23": "23. Names of holding / subsidiary / associate companies / joint ventures",
  "24": "24. CSR applicability, turnover, and net worth",
  "25": "25. Complaints on any of the principles (Principles 1 to 9) under the National Guidelines on Responsible Business Conduct.",
  "26": "26. Overview of the entity's material responsible business conduct issues",
};

/** Labels for Section B – exported for BRSR export mapper */
export const SECTION_B_LABELS: Record<string, string> = {
  "1a": "1(a). Policy/policies cover each principle and core elements",
  "1b": "1(b). Policy approved by Board",
  "1c": "1(c). Web link of policies",
  "2": "2. Policy translated into procedures",
  "3": "3. Policies extend to value chain partners",
  "4": "4. National/international codes/certifications/labels/standards adopted",
  "5": "5. Specific commitments, goals, targets with timelines",
  "6": "6. Performance against commitments/goals/targets",
  "7": "7. Statement by director on ESG challenges, targets, achievements",
  "8": "8. Highest authority for implementation and oversight of BR policy",
  "9": "9. Committee of Board/Director for sustainability issues",
  "10a": "10(a). Review of NGRBCs – Performance vs policies",
  "10b": "10(b). Compliance with statutory requirements",
  "11": "11. Independent assessment by external agency",
};

/** Labels for P6 indicators – exported for BRSR export mapper */
export const P6_PREFIX_LABELS: Record<string, string> = {
  p6_e1: "1. Total energy consumption",
  p6_e2: "2. PAT scheme – designated consumers (DCs)",
  p6_e3: "3. Water related information",
  p6_e4: "4. Provide the following details related to water discharged",
  p6_e5: "5. Has the entity implemented a mechanism for Zero Liquid Discharge?",
  p6_e6: "6. Air emissions (other than GHG emissions)",
  p6_e7: "7. Greenhouse gas emissions",
  p6_e8: "8. Does the entity have any project related to reducing Green House Gas emission?",
  p6_e9: "9. Provide details related to waste management by the entity",
  p6_e10: "10. Waste management practices and strategy (hazardous/toxic chemicals)",
  p6_e11: "11. Operations in ecologically sensitive areas (environmental approvals/clearances)",
  p6_e12: "12. Details of environmental impact assessments of projects (current FY)",
  p6_e13: "13. Applicable environmental law/regulations/guidelines in India",
  p6_l1: "Leadership 1. Water withdrawal, consumption and discharge in areas of water stress",
  p6_l2: "Leadership 2. Total Scope 3 emissions",
  p6_l3: "Leadership 3. Biodiversity impact in ecologically sensitive areas",
  p6_l4: "Leadership 4. Initiatives and innovative technology",
  p6_l5: "Leadership 5. Business continuity and disaster management plan",
  p6_l6: "Leadership 6. Value chain adverse impact mitigation",
  p6_l7: "Leadership 7. % value chain partners assessed",
  p6_l8: "Leadership 8. Green Credits",
};

function decodeHtml(input: string): string {
  return input
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function humanizeCode(code: string): string {
  return code
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function groupBy<T>(arr: T[], keyFn: (v: T) => string): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

function makeGeneralBlocks(codes: string[]): AssignmentBlock[] {
  const groups = groupBy(codes, (code) => {
    if (code.endsWith("_row_count")) {
      if (code === "gen_16_row_count") return "16";
      if (code === "gen_17_row_count") return "17";
      if (code === "gen_23_row_count") return "23";
      if (code === "gen_26_row_count") return "26";
    }
    const m = code.match(/^gen_(\d+[a-z]?)/);
    return m ? m[1] : code;
  });
  const order = Object.keys(groups).sort((a, b) => {
    const numA = Number.parseInt(a, 10) || 0;
    const numB = Number.parseInt(b, 10) || 0;
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });
  return order.map((key) => ({
    id: `general_${key}`,
    label: GENERAL_LABELS[key] ?? `${key}. ${humanizeCode(groups[key][0])}`,
    questionCodes: groups[key],
  }));
}

function makeSectionBBlocks(codes: string[]): AssignmentBlock[] {
  const groups = groupBy(codes, (code) => {
    if (code === "sb_7_statement") return "7";
    if (code === "sb_8_authority") return "8";
    const m = code.match(/^sb_(\d+[a-z]?)/);
    return m ? m[1] : code;
  });
  const order = Object.keys(groups).sort((a, b) => {
    const numA = Number.parseInt(a, 10) || 0;
    const numB = Number.parseInt(b, 10) || 0;
    if (numA !== numB) return numA - numB;
    return a.localeCompare(b);
  });
  return order.map((key) => ({
    id: `sectionb_${key}`,
    label: SECTION_B_LABELS[key] ?? `${key}. ${humanizeCode(groups[key][0])}`,
    questionCodes: groups[key],
  }));
}

function parsePrincipleTemplateBlocks(principleNum: number, codes: string[]): AssignmentBlock[] {
  const template = getPrincipleTemplate(principleNum);
  if (!template) return [];
  const html = `${template.essential}\n${template.leadership}`;
  const marker = /<p class="brsr-section">([\s\S]*?)<\/p>/g;
  const sections: { label: string; start: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = marker.exec(html))) {
    sections.push({
      label: decodeHtml(match[1]),
      start: marker.lastIndex,
      end: html.length,
    });
  }
  for (let i = 0; i < sections.length - 1; i++) {
    sections[i].end = sections[i + 1].start - sections[i + 1].label.length;
  }

  const allowed = new Set(codes);
  const assigned = new Set<string>();
  const blocks: AssignmentBlock[] = [];

  const idRegex = new RegExp(`id="p${principleNum}_([^"]+)"`, "g");
  sections.forEach((section, idx) => {
    const chunk = html.slice(section.start, sections[idx + 1]?.start ?? html.length);
    const ids: string[] = [];
    idRegex.lastIndex = 0;
    chunk.replace(idRegex, (_, suffix: string) => {
      const code = `p${principleNum}_${suffix}`;
      if (allowed.has(code) && !assigned.has(code)) {
        assigned.add(code);
        ids.push(code);
      }
      return "";
    });
    if (ids.length > 0) {
      blocks.push({
        id: `p${principleNum}_${idx + 1}`,
        label: section.label,
        questionCodes: ids,
      });
    }
  });

  if (allowed.has(`p${principleNum}_notes`)) {
    blocks.push({
      id: `p${principleNum}_notes`,
      label: "Notes (narrative)",
      questionCodes: [`p${principleNum}_notes`],
    });
    assigned.add(`p${principleNum}_notes`);
  }

  const leftovers = codes.filter((code) => !assigned.has(code));
  if (leftovers.length > 0) {
    const fallbackGroups = groupBy(leftovers, (code) => {
      const m = code.match(new RegExp(`^p${principleNum}_(e\\d+|l\\d+)`));
      return m ? m[1] : code;
    });
    Object.entries(fallbackGroups).forEach(([key, vals]) => {
      blocks.push({
        id: `p${principleNum}_fallback_${key}`,
        label: humanizeCode(key),
        questionCodes: vals,
      });
    });
  }

  return blocks;
}

function makeP6Blocks(codes: string[]): AssignmentBlock[] {
  const groups = groupBy(codes, (code) => {
    if (code === "p6_notes") return "p6_notes";
    const m = code.match(/^(p6_[el]\d+)/);
    return m ? m[1] : code;
  });
  const keys = Object.keys(groups).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return keys.map((key) => ({
    id: key,
    label: key === "p6_notes" ? "Notes (narrative)" : (P6_PREFIX_LABELS[key] ?? humanizeCode(key)),
    questionCodes: groups[key],
  }));
}

function withDepartments(blocks: AssignmentBlock[]): AssignmentBlock[] {
  return blocks.map((block) => {
    const departments = BLOCK_DEPARTMENTS[block.id];
    if (!departments?.length) return block;
    return { ...block, departments };
  });
}

export function getAssignmentBlocksForPanel(panelId: PanelId): AssignmentBlock[] {
  const codes = getQuestionCodesForPanel(panelId);
  let blocks: AssignmentBlock[];
  if (panelId === "generaldata") {
    const turnover = ["gdata_turnover_cy", "gdata_turnover_py", "gdata_ppp_cy", "gdata_ppp_py"];
    const remaining = codes.filter((c) => !turnover.includes(c));
    blocks = [
      {
        id: "generaldata_turnover_ppp",
        label: "Turnover & PPP (for intensity calculations)",
        questionCodes: turnover.filter((c) => codes.includes(c)),
      },
      {
        id: "generaldata_emp_worker",
        label: "Employee & worker counts (for use across principles)",
        questionCodes: remaining,
      },
    ].filter((b) => b.questionCodes.length > 0);
  } else if (panelId === "general") {
    blocks = makeGeneralBlocks(codes);
  } else if (panelId === "sectionb") {
    blocks = makeSectionBBlocks(codes);
  } else if (panelId === "p6") {
    blocks = makeP6Blocks(codes);
  } else if (/^p[1-9]$/.test(panelId)) {
    const principleNum = Number.parseInt(panelId.slice(1), 10);
    blocks = MIGRATED_PRINCIPLES.has(principleNum)
      ? getStaticPrincipleBlocks(principleNum, codes)
      : parsePrincipleTemplateBlocks(principleNum, codes);
  } else {
    blocks = codes.map((code) => ({
      id: code,
      label: humanizeCode(code),
      questionCodes: [code],
    }));
  }
  return withDepartments(blocks);
}
