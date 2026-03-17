import type { PanelId } from "./types";
import { getQuestionCodesForPanel } from "./questionConfig";
import { getPrincipleTemplate } from "./principleTemplates";

export type AssignmentBlock = {
  id: string;
  label: string;
  questionCodes: string[];
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
  p6_e1: "1. Energy consumption (renewable / non-renewable) and intensity",
  p6_e2: "2. PAT scheme",
  p6_e3: "3. Water – withdrawal, consumption, intensity",
  p6_e4: "4. Water discharge by destination and treatment level",
  p6_e5: "5. Zero liquid discharge",
  p6_e6: "6. Air emissions (other than GHG)",
  p6_e7: "7. GHG – Scope 1 and Scope 2 and intensity",
  p6_e8: "8. Projects for reducing GHG",
  p6_e9: "9. Waste generation, recovery, disposal, and intensity",
  p6_e10: "10. Waste management practices and strategy",
  p6_e11: "11. Operations in ecologically sensitive areas",
  p6_e12: "12. EIA of projects",
  p6_e13: "13. Environmental compliance and non-compliances",
  p6_l1: "Leadership 1. Water in areas of water stress",
  p6_l2: "Leadership 2. Scope 3 emissions and intensity",
  p6_l3: "Leadership 3. Biodiversity impact in ecologically sensitive areas",
  p6_l4: "Leadership 4. Initiatives and innovative technology",
  p6_l5: "Leadership 5. Business continuity and disaster management plan",
  p6_l6: "Leadership 6. Value chain adverse impact mitigation",
  p6_l7: "Leadership 7. % value chain partners assessed",
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

export function getAssignmentBlocksForPanel(panelId: PanelId): AssignmentBlock[] {
  const codes = getQuestionCodesForPanel(panelId);
  if (panelId === "generaldata") {
    const turnover = ["gdata_turnover_cy", "gdata_turnover_py", "gdata_ppp_cy", "gdata_ppp_py"];
    const remaining = codes.filter((c) => !turnover.includes(c));
    return [
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
  }
  if (panelId === "general") return makeGeneralBlocks(codes);
  if (panelId === "sectionb") return makeSectionBBlocks(codes);
  if (panelId === "p6") return makeP6Blocks(codes);
  if (/^p[1-9]$/.test(panelId)) {
    const principleNum = Number.parseInt(panelId.slice(1), 10);
    return parsePrincipleTemplateBlocks(principleNum, codes);
  }
  return codes.map((code) => ({
    id: code,
    label: humanizeCode(code),
    questionCodes: [code],
  }));
}
