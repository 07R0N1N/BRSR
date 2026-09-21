import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Constrain table width; default full width of container. */
  maxWidth?: "none" | "2xl" | "3xl" | "4xl";
};

const MAX_WIDTH: Record<NonNullable<Props["maxWidth"]>, string> = {
  none: "",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

/**
 * Shared scrollable table wrapper: sticky first column, themed borders.
 * Replaces ad-hoc overflow-x-auto + min-w-[...] patterns in panels.
 */
export function DataTable({ children, className = "", maxWidth = "none" }: Props) {
  return (
    <div
      className={`data-table-wrap overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border-soft)] ${MAX_WIDTH[maxWidth]} ${className}`}
    >
      <table className="data-table w-full min-w-0 border-collapse text-sm [&_th:first-child]:sticky [&_th:first-child]:left-0 [&_th:first-child]:z-[1] [&_td:first-child]:sticky [&_td:first-child]:left-0 [&_td:first-child]:z-[1] [&_th:first-child]:bg-[var(--surface-2)] [&_td:first-child]:bg-[var(--surface)] [&_td.num]:text-right [&_td.num]:tabular-nums">
        {children}
      </table>
    </div>
  );
}

export function DataTableHead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="bg-[var(--surface-2)]">{children}</tr>
    </thead>
  );
}

export function DataTableTh({
  children,
  className = "",
  numeric,
}: {
  children: ReactNode;
  className?: string;
  numeric?: boolean;
}) {
  return (
    <th
      className={`border-b border-[var(--border-soft)] px-3 py-2.5 text-left text-[13px] font-semibold text-[var(--ink)] ${numeric ? "text-right" : ""} ${className}`}
    >
      {children}
    </th>
  );
}

export function DataTableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DataTableRow({ children }: { children: ReactNode }) {
  return (
    <tr className="odd:bg-[var(--surface)] even:bg-[var(--surface-2)]/40">{children}</tr>
  );
}

export function DataTableTd({
  children,
  className = "",
  numeric,
}: {
  children: ReactNode;
  className?: string;
  numeric?: boolean;
}) {
  return (
    <td
      className={`border-b border-[var(--border-soft)] px-3 py-2 align-middle text-[var(--ink)] ${numeric ? "num text-right tabular-nums" : ""} ${className}`}
    >
      {children}
    </td>
  );
}
