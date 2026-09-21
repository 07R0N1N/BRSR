import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  className?: string;
};

const COL_CLASS: Record<NonNullable<Props["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export function FieldGrid({ children, columns = 3, className = "" }: Props) {
  return (
    <div className={`field-grid grid gap-3.5 ${COL_CLASS[columns]} ${className}`}>
      {children}
    </div>
  );
}

type FieldProps = {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Field({ label, hint, children, className = "" }: FieldProps) {
  return (
    <div className={`field min-w-0 ${className}`}>
      <label className="mb-1 block text-[12px] font-medium text-[var(--text-muted)]">
        {label}
      </label>
      {children}
      {hint != null && (
        <p className="mt-1 text-[11px] text-[var(--text-muted)]">{hint}</p>
      )}
    </div>
  );
}
