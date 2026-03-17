/**
 * FY label helpers for reporting year display (e.g. "2024-25" -> "FY 2024-2025").
 * Used by PanelGeneral Q22 and brsrDocx export.
 */

function formatFY(s: string): string {
  if (!s || s.length < 6) return s;
  const m = s.match(/^(\d{4})-(\d{2,4})$/);
  if (!m) return s;
  const y2 = m[2].length === 2 ? "20" + m[2] : m[2];
  return `FY ${m[1]}-${y2}`;
}

function derivePreviousYear(current: string): string {
  const m = current.match(/^(\d{4})-(\d{2})$/);
  if (!m) return current;
  const y1 = parseInt(m[1], 10);
  const y2 = parseInt(m[2], 10);
  return `${y1 - 1}-${String(y2 - 1).padStart(2, "0")}`;
}

function derivePriorYear(current: string): string {
  const parts = current.split("-").map((x) => parseInt(x, 10) || 0);
  const c1 = parts[0];
  const c2 = parts[1];
  if (!c1 || !c2) return "";
  const y1 = c1 - 2;
  const y2 = c2 > 100 ? c2 - 2 : (c2 - 2 + 100) % 100;
  return y1 >= 2000 ? `${y1}-${String(y2).padStart(2, "0")}` : "";
}

/** Returns [FY current, FY previous, FY prior] for a reporting year (e.g. "2024-25"). */
export function getFYLabelsFromReportingYear(reportingYear: string): [string, string, string] {
  const current = reportingYear || "2024-25";
  const previous = derivePreviousYear(current);
  const prior = derivePriorYear(current);
  return [formatFY(current), formatFY(previous), formatFY(prior)];
}

/** For brsrDocx: accepts { current, previous } and returns [FY current, FY previous, FY prior]. */
export function getFYLabels(ry: { current: string; previous: string }): [string, string, string] {
  const prior = ry.current ? derivePriorYear(ry.current) : "";
  return [formatFY(ry.current), formatFY(ry.previous), formatFY(prior)];
}
