"use client";

type Props = {
  /** The calcDisplay key, e.g. "calc_p1_pct_1" */
  code: string;
  calcDisplay: Record<string, string>;
  /** Optional fallback when calcDisplay value is empty */
  dash?: boolean;
  className?: string;
};

const DEFAULT_CLASS = "text-gray-500 text-sm";

/**
 * Read-only display cell for computed (calcDisplay) values such as percentages,
 * sums, and formula results. Renders the computed value or "–" if empty and
 * dash=true, otherwise renders nothing.
 */
export function CalcCell({ code, calcDisplay, dash = false, className = DEFAULT_CLASS }: Props) {
  const value = calcDisplay[code] ?? "";
  return <span className={className}>{value || (dash ? "–" : "")}</span>;
}

/**
 * Inline percentage cell: renders `(num/denom)*100 %` from values directly,
 * used for dynamic row calcs where no static calcDisplay entry exists.
 */
export function InlinePct({
  num,
  denom,
  className = DEFAULT_CLASS,
}: {
  num: string;
  denom: string;
  className?: string;
}) {
  const n = parseFloat(String(num ?? "").replace(/,/g, ""));
  const d = parseFloat(String(denom ?? "").replace(/,/g, ""));
  if (!d || isNaN(n) || isNaN(d)) return <span className={className}>—</span>;
  const v = (n / d) * 100;
  const display = Number.isInteger(v) ? `${v}%` : `${v.toFixed(2)}%`;
  return <span className={className}>{display}</span>;
}
