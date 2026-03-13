import type { PanelId } from "./types";

/** Panel metadata — groups and labels shown in the sidebar and admin workspace */
export const PANELS: { id: PanelId; label: string; group: string }[] = [
  { id: "generaldata", label: "General Data Gathering", group: "General Data" },
  { id: "general",     label: "General Disclosures",   group: "Section A" },
  { id: "sectionb",   label: "Management & Process",   group: "Section B" },
  { id: "p1", label: "Principle 1", group: "Section C – Principles" },
  { id: "p2", label: "Principle 2", group: "Section C – Principles" },
  { id: "p3", label: "Principle 3", group: "Section C – Principles" },
  { id: "p4", label: "Principle 4", group: "Section C – Principles" },
  { id: "p5", label: "Principle 5", group: "Section C – Principles" },
  { id: "p6", label: "Principle 6", group: "Section C – Principles" },
  { id: "p7", label: "Principle 7", group: "Section C – Principles" },
  { id: "p8", label: "Principle 8", group: "Section C – Principles" },
  { id: "p9", label: "Principle 9", group: "Section C – Principles" },
];
