import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: ReactNode;
};

export function PanelHeader({ title, subtitle }: Props) {
  return (
    <header className="panel-header">
      <h1 className="text-2xl font-bold text-[var(--ink)]">{title}</h1>
      {subtitle != null && (
        <p className="mt-1 text-[13px] text-[var(--text-muted)]">{subtitle}</p>
      )}
    </header>
  );
}
