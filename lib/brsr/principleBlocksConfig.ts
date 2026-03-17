/**
 * Static block definitions for Principles 1-5, 7-9.
 * Replaces parsePrincipleTemplateBlocks (which parses raw HTML templates) in
 * assignmentBlocks.ts once each principle has been migrated to JSX.
 *
 * Each entry maps a code prefix to a block label. The matching logic in
 * getStaticPrincipleBlocks groups question codes whose prefix matches one of
 * the defined prefixes, preserving the original section order.
 */

import type { AssignmentBlock } from "./assignmentBlocks";

type PrefixBlock = {
  id: string;
  label: string;
  /** Codes whose startsWith(prefix) belongs to this block */
  prefix: string;
};

const P1_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p1_1", label: "1. Percentage coverage by training and awareness programmes", prefix: "p1_e1_" },
  { id: "p1_2", label: "2. Fines/penalties/punishment/award/compounding/settlement (monetary)", prefix: "p1_e2_" },
  { id: "p1_3", label: "3. Appeal/Revision details (where action appealed)", prefix: "p1_e3_" },
  { id: "p1_4", label: "4. Anti-corruption / anti-bribery policy (Y/N). If yes, details and weblink", prefix: "p1_e4_" },
  { id: "p1_5", label: "5. Disciplinary action (law enforcement) – bribery/corruption", prefix: "p1_e5_" },
  { id: "p1_6", label: "6. Complaints – conflict of interest (Directors / KMPs)", prefix: "p1_e6_" },
  { id: "p1_7", label: "7. Corrective action on fines/penalties/corruption/conflict of interest", prefix: "p1_e7_" },
  { id: "p1_8", label: "8. Days of accounts payables (AP × 365 / Cost of goods procured)", prefix: "p1_e8_" },
  { id: "p1_9", label: "9. Open-ness – concentration of purchases/sales, RPTs", prefix: "p1_e9_" },
  { id: "p1_l1", label: "Leadership 1. Awareness programmes for value chain partners", prefix: "p1_l1_" },
  { id: "p1_l2", label: "Leadership 2. Processes to avoid/manage conflict of interests (Board)", prefix: "p1_l2_" },
];

const P2_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p2_1", label: "1. R&D and capex % for environmental and social impacts", prefix: "p2_e1_" },
  { id: "p2_2", label: "2. Sustainable sourcing", prefix: "p2_e2_" },
  { id: "p2_3", label: "3. Processes to reclaim products (reuse, recycle, dispose)", prefix: "p2_e3_" },
  { id: "p2_4", label: "4. EPR applicable (Y/N). Waste collection plan in line with EPR? Steps if not.", prefix: "p2_e4_" },
  { id: "p2_l1", label: "Leadership 1. Life Cycle Perspective / Assessments (LCA)", prefix: "p2_l1_" },
  { id: "p2_l2", label: "Leadership 2. Significant social/environmental concerns from production/disposal – action taken", prefix: "p2_l2_" },
  { id: "p2_l3", label: "Leadership 3. Recycled or reused input material as % of total material (by value)", prefix: "p2_l3_" },
  { id: "p2_l4", label: "Leadership 4. Products and packaging reclaimed at end of life (metric tonnes)", prefix: "p2_l4_" },
  { id: "p2_l5", label: "Leadership 5. Reclaimed products and packaging as % of products sold (by category)", prefix: "p2_l5_" },
];

const P3_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p3_1a", label: "1(a). Well-being measures – Employees (% covered)", prefix: "p3_e1a_" },
  { id: "p3_1b", label: "1(b). Well-being measures – Workers (% covered)", prefix: "p3_e1b_" },
  { id: "p3_1c", label: "1(c). Spending on well-being as % of total revenue", prefix: "p3_e1c_" },
  { id: "p3_2", label: "2. Retirement benefits (PF, Gratuity, ESI, Others)", prefix: "p3_e2_" },
  { id: "p3_3", label: "3. Accessibility for differently abled (Rights of Persons with Disabilities Act)", prefix: "p3_e3_" },
  { id: "p3_4", label: "4. Equal opportunity policy (Y/N). Weblink", prefix: "p3_e4_" },
  { id: "p3_5", label: "5. Return to work and retention (parental leave)", prefix: "p3_e5_" },
  { id: "p3_6", label: "6. Grievance mechanism (Y/N and details)", prefix: "p3_e6_" },
  { id: "p3_7", label: "7. Membership in associations/unions", prefix: "p3_e7_" },
  { id: "p3_8", label: "8. Training (health & safety, skill upgradation)", prefix: "p3_e8_" },
  { id: "p3_9", label: "9. Performance and career development reviews", prefix: "p3_e9_" },
  { id: "p3_10", label: "10. Health and safety management system", prefix: "p3_e10_" },
  { id: "p3_11", label: "11. Safety-related incidents (LTIFR, recordable injuries, fatalities, high consequence)", prefix: "p3_e11_" },
  { id: "p3_12", label: "12. Measures for safe and healthy workplace", prefix: "p3_e12_" },
  { id: "p3_13", label: "13. Complaints (working conditions, health & safety)", prefix: "p3_e13_" },
  { id: "p3_14", label: "14. Assessments (% plants/offices assessed)", prefix: "p3_e14_" },
  { id: "p3_15", label: "15. Corrective action (safety incidents, assessments)", prefix: "p3_e15_" },
  { id: "p3_l1", label: "Leadership 1. Life insurance / compensatory package (death)", prefix: "p3_l1_" },
  { id: "p3_l2", label: "Leadership 2. Statutory dues deducted and deposited by value chain partners", prefix: "p3_l2_" },
  { id: "p3_l3", label: "Leadership 3. Rehabilitation (affected employees/workers or family placed)", prefix: "p3_l3_" },
  { id: "p3_l4", label: "Leadership 4. Transition assistance (retirement/termination)", prefix: "p3_l4_" },
  { id: "p3_l5", label: "Leadership 5. Value chain partners assessed (%) – Health & safety, Working conditions", prefix: "p3_l5_" },
  { id: "p3_l6", label: "Leadership 6. Corrective actions (value chain assessments)", prefix: "p3_l6_" },
];

const P4_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p4_1", label: "1. Processes for identifying key stakeholder groups", prefix: "p4_e1_" },
  { id: "p4_2", label: "2. Stakeholder groups – engagement", prefix: "p4_e2_" },
  { id: "p4_l1", label: "Leadership 1. Consultation between stakeholders and Board", prefix: "p4_l1_" },
  { id: "p4_l2", label: "Leadership 2. Stakeholder consultation for environmental/social topics", prefix: "p4_l2_" },
  { id: "p4_l3", label: "Leadership 3. Engagement with vulnerable/marginalized groups – actions taken", prefix: "p4_l3_" },
];

const P5_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p5_1", label: "1. Training on human rights", prefix: "p5_e1_" },
  { id: "p5_2", label: "2. Minimum wages (Equal to / More than minimum)", prefix: "p5_e2_" },
  { id: "p5_3a", label: "3(a). Median remuneration (BoD, KMP, Employees, Workers – Male/Female)", prefix: "p5_e3a_" },
  { id: "p5_3b", label: "3(b). Gross wages to females as % of total wages", prefix: "p5_e3b_" },
  { id: "p5_4", label: "4. Focal point for human rights (Y/N)", prefix: "p5_e4_" },
  { id: "p5_5", label: "5. Internal mechanisms for human rights grievances", prefix: "p5_e5_" },
  { id: "p5_6", label: "6. Complaints (sexual harassment, discrimination, child labour, forced labour, wages, other)", prefix: "p5_e6_" },
  { id: "p5_7", label: "7. POSH – Total complaints, % of female employees/workers, Complaints upheld", prefix: "p5_e7_" },
  { id: "p5_8", label: "8. Mechanisms to prevent adverse consequences (discrimination/harassment)", prefix: "p5_e8_" },
  { id: "p5_9", label: "9. Human rights in business agreements/contracts (Y/N)", prefix: "p5_e9_" },
  { id: "p5_10", label: "10. Assessments (% plants/offices) – Child labour, Forced labour, Sexual harassment, Discrimination, Wages, Others", prefix: "p5_e10_" },
  { id: "p5_11", label: "11. Corrective actions", prefix: "p5_e11_" },
  { id: "p5_l1", label: "Leadership 1. Business process modified due to human rights grievances", prefix: "p5_l1_" },
  { id: "p5_l2", label: "Leadership 2. Human rights due diligence – scope and coverage", prefix: "p5_l2_" },
  { id: "p5_l3", label: "Leadership 3. Premises accessible to differently abled visitors (Y/N)", prefix: "p5_l3_" },
  { id: "p5_l4", label: "Leadership 4. Value chain partners assessed (%) – Sexual harassment, Discrimination, Child labour, Forced labour, Wages, Others", prefix: "p5_l4_" },
  { id: "p5_l5", label: "Leadership 5. Corrective actions (value chain assessments)", prefix: "p5_l5_" },
];

const P7_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p7_1a", label: "1(a). Number of affiliations with trade and industry chambers/associations", prefix: "p7_e1a_" },
  { id: "p7_1b", label: "1(b). Top 10 trade and industry chambers/associations (by membership)", prefix: "p7_e1b_" },
  { id: "p7_2", label: "2. Corrective action on anti-competitive conduct (adverse orders)", prefix: "p7_e2_" },
  { id: "p7_l1", label: "Leadership 1. Public policy positions advocated", prefix: "p7_l1_" },
];

const P8_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p8_1", label: "1. Social Impact Assessments (SIA) of projects", prefix: "p8_e1_" },
  { id: "p8_2", label: "2. Rehabilitation and Resettlement (R&R) – ongoing projects", prefix: "p8_e2_" },
  { id: "p8_3", label: "3. Grievance mechanism for community", prefix: "p8_e3_" },
  { id: "p8_4", label: "4. % input material sourced from MSMEs/small producers and from within India", prefix: "p8_e4_" },
  { id: "p8_5", label: "5. Job creation in smaller towns – wages as % of total wage cost (Rural, Semi-urban, Urban, Metropolitan)", prefix: "p8_e5_" },
  { id: "p8_l1", label: "Leadership 1. Mitigation of negative social impacts (from SIA)", prefix: "p8_l1_" },
  { id: "p8_l2", label: "Leadership 2. CSR in designated aspirational districts", prefix: "p8_l2_" },
  { id: "p8_l3", label: "Leadership 3. Preferential procurement from marginalized/vulnerable groups", prefix: "p8_l3_" },
  { id: "p8_l4", label: "Leadership 4. Benefits from IP based on traditional knowledge", prefix: "p8_l4_" },
  { id: "p8_l5", label: "Leadership 5. Corrective action on IP disputes (adverse orders)", prefix: "p8_l5_" },
  { id: "p8_l6", label: "Leadership 6. Beneficiaries of CSR projects – No. benefitted, % from vulnerable/marginalized", prefix: "p8_l6_" },
];

const P9_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p9_1", label: "1. Mechanisms for consumer complaints and feedback", prefix: "p9_e1_" },
  { id: "p9_2", label: "2. Turnover % with product information (environmental/social, safe usage, recycling/disposal)", prefix: "p9_e2_" },
  { id: "p9_3", label: "3. Consumer complaints (Data privacy, Advertising, Cybersecurity, Delivery, Restrictive/Unfair trade, Other)", prefix: "p9_e3_" },
  { id: "p9_4", label: "4. Product recalls (safety) – Voluntary / Forced – Number, Reasons", prefix: "p9_e4_" },
  { id: "p9_5", label: "5. Framework on cybersecurity and data privacy (Y/N). Weblink", prefix: "p9_e5_" },
  { id: "p9_6", label: "6. Corrective actions (advertising, delivery, cybersecurity, data privacy, recalls, regulatory penalty)", prefix: "p9_e6_" },
  { id: "p9_7", label: "7. Data breaches – (a) Number (b) % involving PII (c) Impact", prefix: "p9_e7" },
  { id: "p9_l1", label: "Leadership 1. Channels/platforms for product information (weblink)", prefix: "p9_l1_" },
  { id: "p9_l2", label: "Leadership 2. Steps to inform and educate on safe and responsible usage", prefix: "p9_l2_" },
  { id: "p9_l3", label: "Leadership 3. Mechanisms for disruption/discontinuation of essential services", prefix: "p9_l3_" },
  { id: "p9_l4", label: "Leadership 4. Product information beyond legal requirement. Consumer satisfaction survey", prefix: "p9_l4_" },
];

const PREFIX_BLOCKS_BY_PRINCIPLE: Record<number, PrefixBlock[]> = {
  1: P1_PREFIX_BLOCKS,
  2: P2_PREFIX_BLOCKS,
  3: P3_PREFIX_BLOCKS,
  4: P4_PREFIX_BLOCKS,
  5: P5_PREFIX_BLOCKS,
  7: P7_PREFIX_BLOCKS,
  8: P8_PREFIX_BLOCKS,
  9: P9_PREFIX_BLOCKS,
};

/**
 * Returns assignment blocks for a migrated principle (P1-5, P7-9) by
 * matching each question code against the defined prefix table.
 * Codes that don't match any prefix are grouped into a fallback block.
 */
export function getStaticPrincipleBlocks(principleNum: number, codes: string[]): AssignmentBlock[] {
  const prefixBlocks = PREFIX_BLOCKS_BY_PRINCIPLE[principleNum];
  if (!prefixBlocks) return [];

  const blocks: AssignmentBlock[] = [];
  const assigned = new Set<string>();

  for (const pb of prefixBlocks) {
    const matching = codes.filter((c) => c.startsWith(pb.prefix) && !assigned.has(c));
    if (matching.length > 0) {
      matching.forEach((c) => assigned.add(c));
      blocks.push({ id: pb.id, label: pb.label, questionCodes: matching });
    }
  }

  // Notes field
  const notesCode = `p${principleNum}_notes`;
  if (codes.includes(notesCode) && !assigned.has(notesCode)) {
    assigned.add(notesCode);
    blocks.push({ id: `p${principleNum}_notes`, label: "Notes (narrative)", questionCodes: [notesCode] });
  }

  // Fallback for any unmatched codes (e.g. dynamic row codes beyond row0 stored in answers)
  const leftovers = codes.filter((c) => !assigned.has(c));
  if (leftovers.length > 0) {
    blocks.push({
      id: `p${principleNum}_other`,
      label: "Other",
      questionCodes: leftovers,
    });
  }

  return blocks;
}
