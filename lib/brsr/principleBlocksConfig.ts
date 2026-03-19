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
  { id: "p1_1", label: "1. Percentage coverage by training and awareness programmes on any of the Principles during the financial year", prefix: "p1_e1_" },
  { id: "p1_2", label: "2. Details of fines / penalties / punishment / award / compounding fees / settlement amount paid in proceedings", prefix: "p1_e2_" },
  { id: "p1_3", label: "3. Of the instances disclosed in Question 2 above, details of the Appeal/ Revision preferred", prefix: "p1_e3_" },
  { id: "p1_4", label: "4. Does the entity have an anti-corruption policy or anti-bribery policy?", prefix: "p1_e4_" },
  { id: "p1_5", label: "5. Number of Directors/KMPs/employees/workers against whom disciplinary action was taken (bribery/corruption)", prefix: "p1_e5_" },
  { id: "p1_6", label: "6. Details of complaints with regard to conflict of interest", prefix: "p1_e6_" },
  { id: "p1_7", label: "7. Provide details of any corrective action taken or under way on fines/penalties/corruption/conflicts of interest", prefix: "p1_e7_" },
  { id: "p1_8", label: "8. Number of days of accounts payables", prefix: "p1_e8_" },
  { id: "p1_9", label: "9. Open-ness of business - Provide details of concentration of purchases and sales with trading houses, dealers, and related parties along-with loans and advances & investments, with related parties, in the following format", prefix: "p1_e9_" },
  { id: "p1_l1", label: "1. Awareness programmes conducted for value chain partners on any of the Principles during the financial year", prefix: "p1_l1_" },
  { id: "p1_l2", label: "2. Does the entity have processes in place to avoid / manage conflict of interests involving members of the Board?", prefix: "p1_l2_" },
];

const P2_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p2_1", label: "1. Percentage of R&D and capex investments for environmental and social impacts", prefix: "p2_e1_" },
  { id: "p2_2", label: "2. Does the entity have procedures in place for sustainable sourcing?", prefix: "p2_e2_" },
  { id: "p2_3", label: "3. Describe the processes in place to safely reclaim your products for reusing, recycling and disposing at the end of life", prefix: "p2_e3_" },
  { id: "p2_4", label: "4. Whether Extended Producer Responsibility (EPR) is applicable to the entity's activities (Yes / No).", prefix: "p2_e4_" },
  { id: "p2_l1", label: "1. Has the Company conducted Life Cycle Assessments (LCA) for its products /services?", prefix: "p2_l1_" },
  { id: "p2_l2", label: "2. If there are any significant social or environmental concerns and/or risks arising from production or disposal of your products / services, as identified in the Life Cycle Perspective / Assessments (LCA) or through any other means, briefly describe the same along-with action taken to mitigate the same", prefix: "p2_l2_" },
  { id: "p2_l3", label: "3. Percentage of recycled or reused input material to total material (by value) used in production (for manufacturing industry) or providing services (for service industry).", prefix: "p2_l3_" },
  { id: "p2_l4", label: "4. Of the products and packaging reclaimed at end of life of products, amount (in metric tonnes) reused, recycled, and safely disposed, as per the following format.", prefix: "p2_l4_" },
  { id: "p2_l5", label: "5. Reclaimed products and their packaging materials (as percentage of products sold) for each product category.", prefix: "p2_l5_" },
];

const P3_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p3_1a", label: "1. Details of measures for well-being – Employees (% covered, Permanent/Other)", prefix: "p3_e1a_" },
  { id: "p3_1b", label: "1. Details of measures for well-being – Workers (% covered, Permanent/Other)", prefix: "p3_e1b_" },
  { id: "p3_1c", label: "1(c). Spending on measures towards well-being of employees and workers", prefix: "p3_e1c_" },
  { id: "p3_2", label: "2. Details of retirement benefits (PF, Gratuity, ESI, Others)", prefix: "p3_e2_" },
  { id: "p3_3", label: "3. Accessibility of workplaces for differently abled (Rights of Persons with Disabilities Act, 2016)", prefix: "p3_e3_" },
  { id: "p3_4", label: "4. Equal opportunity policy (Rights of Persons with Disabilities Act, 2016)", prefix: "p3_e4_" },
  { id: "p3_5", label: "5. Return to work and retention rates (parental leave)", prefix: "p3_e5_" },
  { id: "p3_6", label: "6. Mechanism to receive and redress grievances", prefix: "p3_e6_" },
  { id: "p3_7", label: "7. Membership of employees and workers in associations or unions", prefix: "p3_e7_" },
  { id: "p3_8", label: "8. Details of training given to employees and workers", prefix: "p3_e8_" },
  { id: "p3_9", label: "9. Details of performance and career development reviews of employees", prefix: "p3_e9_" },
  { id: "p3_10", label: "10. Health and safety management system", prefix: "p3_e10_" },
  { id: "p3_11", label: "11. Details of safety related incidents", prefix: "p3_e11_" },
  { id: "p3_12", label: "12. Measures for safe and healthy work place", prefix: "p3_e12_" },
  { id: "p3_13", label: "13. Number of complaints (working conditions, health & safety)", prefix: "p3_e13_" },
  { id: "p3_14", label: "14. Assessments for the year (% plants/offices assessed)", prefix: "p3_e14_" },
  { id: "p3_15", label: "15. Corrective action (safety incidents, assessments)", prefix: "p3_e15_" },
  { id: "p3_l1", label: "Leadership 1. Life insurance / compensatory package (death)", prefix: "p3_l1_" },
  { id: "p3_l2", label: "Leadership 2. Measures to ensure statutory dues deducted and deposited by value chain partners", prefix: "p3_l2_" },
  { id: "p3_l3", label: "Leadership 3. Rehabilitation (affected employees/workers or family placed)", prefix: "p3_l3_" },
  { id: "p3_l4", label: "Leadership 4. Transition assistance (retirement/termination)", prefix: "p3_l4_" },
  { id: "p3_l5", label: "Leadership 5. Value chain partners assessed (%) – Health & safety, Working conditions", prefix: "p3_l5_" },
  { id: "p3_l6", label: "Leadership 6. Corrective actions (value chain – health & safety, working conditions)", prefix: "p3_l6_" },
];

const P4_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p4_1", label: "1. Describe the processes for identifying key stakeholder groups of the entity.", prefix: "p4_e1_" },
  { id: "p4_2", label: "2. List stakeholder groups identified as key for your entity and the frequency of engagement with each stakeholder group.", prefix: "p4_e2_" },
  { id: "p4_l1", label: "Leadership 1. Provide the processes for consultation between stakeholders and the Board on economic, environmental, and social topics or if consultation is delegated, how is feedback from such consultations provided to the Board.", prefix: "p4_l1_" },
  { id: "p4_l2", label: "Leadership 2. Whether stakeholder consultation is used to support the identification and management of environmental and social topics?", prefix: "p4_l2_" },
  { id: "p4_l3", label: "Leadership 3. Instances of engagement with and actions taken to address the concerns of vulnerable /marginalised stakeholder groups.", prefix: "p4_l3_" },
];

const P5_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p5_1", label: "1. Employees and workers who have been provided training on human rights issues and policy(ies) of the entity", prefix: "p5_e1_" },
  { id: "p5_2", label: "2. Details of minimum wages paid to employees and workers", prefix: "p5_e2_" },
  { id: "p5_3a", label: "3. Details of remuneration/salary/wages – i. Median remuneration / wages", prefix: "p5_e3a_" },
  { id: "p5_3b", label: "3. Details of remuneration/salary/wages – ii. Gross wages paid to females", prefix: "p5_e3b_" },
  { id: "p5_4", label: "4. Do you have a focal point (Individual/ Committee) responsible for addressing human rights impacts or issues caused or contributed to by the business?", prefix: "p5_e4_" },
  { id: "p5_5", label: "5. Describe the internal mechanisms in place to redress grievances related to human rights issues.", prefix: "p5_e5_" },
  { id: "p5_6", label: "6. Number of Complaints on the following made by employees and workers", prefix: "p5_e6_" },
  { id: "p5_7", label: "7. Complaints filed under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013, in the following format:", prefix: "p5_e7_" },
  { id: "p5_8", label: "8. Mechanisms to prevent adverse consequences to the complainant in discrimination and harassment cases.", prefix: "p5_e8_" },
  { id: "p5_9", label: "9. Do human rights requirements form part of your business agreements and contracts?", prefix: "p5_e9_" },
  { id: "p5_10", label: "10. Assessment for the year", prefix: "p5_e10_" },
  { id: "p5_11", label: "11. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 10 above.", prefix: "p5_e11_" },
  { id: "p5_l1", label: "Leadership 1. Details of a business process being modified / introduced as a result of addressing human rights grievances/complaints.", prefix: "p5_l1_" },
  { id: "p5_l2", label: "Leadership 2. Details of the scope and coverage of any Human rights due-diligence conducted.", prefix: "p5_l2_" },
  { id: "p5_l3", label: "Leadership 3. Is the premise/office of the entity accessible to differently abled visitors, as per the requirements of the Rights of Persons with Disabilities Act, 2016?", prefix: "p5_l3_" },
  { id: "p5_l4", label: "Leadership 4. Details on assessment of value chain partners", prefix: "p5_l4_" },
  { id: "p5_l5", label: "Leadership 5. Provide details of any corrective actions taken or underway to address significant risks / concerns arising from the assessments at Question 4 above.", prefix: "p5_l5_" },
];

const P7_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p7_1a", label: "1. Trade and industry chambers / associations – i. Number of affiliations with trade and industry chambers / associations", prefix: "p7_e1a_" },
  { id: "p7_1b", label: "1. Trade and industry chambers / associations – ii. List the top 10 trade and industry chambers/ associations (determined based on the total members of such body) the entity is a member of/ affiliated to.", prefix: "p7_e1b_" },
  { id: "p7_2", label: "2. Provide details of corrective action taken or underway on any issues related to Anti-competitive conduct by the entity, based on adverse orders from regulatory authorities.", prefix: "p7_e2_" },
  { id: "p7_l1", label: "Leadership 1. Details of public policy positions advocated by the entity.", prefix: "p7_l1_" },
];

const P8_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p8_1", label: "1. Details of Social Impact Assessments (SIA) of projects undertaken by the Company based on applicable laws, in the current financial year.", prefix: "p8_e1_" },
  { id: "p8_2", label: "2. Provide information on project(s) for which ongoing Rehabilitation and Resettlement (R&R) is being undertaken by your entity.", prefix: "p8_e2_" },
  { id: "p8_3", label: "3. Describe the mechanisms to receive and redress grievances of the community.", prefix: "p8_e3_" },
  { id: "p8_4", label: "4. Percentage of input material (inputs to total inputs by value) sourced from suppliers.", prefix: "p8_e4_" },
  { id: "p8_5", label: "5. Job creation in smaller towns - Disclose wages paid to persons employed (including employees or workers employed on a permanent or non-permanent / on contract basis) in the following locations, as % of total wage cost", prefix: "p8_e5_" },
  { id: "p8_l1", label: "Leadership 1. Provide details of actions taken to mitigate any negative social impacts identified in the Social Impact Assessments. (Reference: Question 1 of Essential Indicators above)", prefix: "p8_l1_" },
  { id: "p8_l2", label: "Leadership 2. Provide the following information on CSR projects undertaken by your entity in designated aspirational districts as identified by government bodies.", prefix: "p8_l2_" },
  { id: "p8_l3", label: "Leadership 3. Preferential procurement from marginalized/vulnerable groups", prefix: "p8_l3_" },
  { id: "p8_l4", label: "Leadership 4. Details of the benefits derived and shared from the intellectual properties owned or acquired by your entity (in the current financial year), based on traditional knowledge.", prefix: "p8_l4_" },
  { id: "p8_l5", label: "Leadership 5. Details of corrective actions taken or underway, based on any adverse order in intellectual property related disputes wherein usage of traditional knowledge is involved.", prefix: "p8_l5_" },
  { id: "p8_l6", label: "Leadership 6. Details of beneficiaries of CSR Projects.", prefix: "p8_l6_" },
];

const P9_PREFIX_BLOCKS: PrefixBlock[] = [
  { id: "p9_1", label: "1. Describe the mechanisms in place to receive and respond to consumer complaints and feedback.", prefix: "p9_e1_" },
  { id: "p9_2", label: "2. Turnover of products and / services as a percentage of turnover from all products/service that carry information about", prefix: "p9_e2_" },
  { id: "p9_3", label: "3. Number of consumer complaints in respect of the following:", prefix: "p9_e3_" },
  { id: "p9_4", label: "4. Details of instances of product recalls on account of safety issues.", prefix: "p9_e4_" },
  { id: "p9_5", label: "5. Does the entity have a framework/ policy on cyber security and risks related to data privacy?", prefix: "p9_e5_" },
  { id: "p9_6", label: "6. Provide details of any corrective actions taken or underway on issues relating to advertising, and delivery of essential services; cyber security and data privacy of customers; re-occurrence of instances of product recalls; penalty / action taken by regulatory authorities on safety of products / services.", prefix: "p9_e6_" },
  { id: "p9_7", label: "7. Provide the following information relating to data breaches", prefix: "p9_e7" },
  { id: "p9_l1", label: "Leadership 1. Channels / platforms where information on products and services of the entity can be accessed (provide web link, if available).", prefix: "p9_l1_" },
  { id: "p9_l2", label: "Leadership 2. Steps taken to inform and educate consumers about safe and responsible usage of products and/or services.", prefix: "p9_l2_" },
  { id: "p9_l3", label: "Leadership 3. Mechanisms in place to inform consumers of any risk of disruption/discontinuation of essential services.", prefix: "p9_l3_" },
  { id: "p9_l4", label: "Leadership 4. Entity display product information – (i) Beyond legal mandate, (ii) Consumer satisfaction survey", prefix: "p9_l4_" },
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
