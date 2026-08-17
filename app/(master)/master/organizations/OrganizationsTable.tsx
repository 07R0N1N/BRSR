"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { OrgWithStats } from "@/lib/master/orgStats";

type StatusFilter = "all" | "onboarded" | "pending";

export function OrganizationsTable({ organizations }: { organizations: OrgWithStats[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [year, setYear] = useState("all");
  const [industry, setIndustry] = useState("all");

  const years = useMemo(
    () => Array.from(new Set(organizations.map((o) => o.reporting_year).filter((y): y is string => !!y))).sort(),
    [organizations]
  );
  const industries = useMemo(
    () => Array.from(new Set(organizations.map((o) => o.industry).filter((i): i is string => !!i))).sort(),
    [organizations]
  );

  const filtered = organizations.filter((org) => {
    if (status === "onboarded" && !org.onboarding_complete) return false;
    if (status === "pending" && org.onboarding_complete) return false;
    if (year !== "all" && org.reporting_year !== year) return false;
    if (industry !== "all" && org.industry !== industry) return false;
    if (query.trim() && !org.name.toLowerCase().includes(query.trim().toLowerCase())) return false;
    return true;
  });

  const filterPillClass = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${
      active
        ? "border-[var(--brand)] bg-[var(--brand)] text-white"
        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
    }`;

  return (
    <div>
      <div className="mb-3.5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-muted)]" aria-hidden>
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search organizations…"
            className="w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] py-2 pl-8 pr-3 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-50)]"
          />
        </div>
        <button type="button" className={filterPillClass(status === "all")} onClick={() => setStatus("all")}>
          All status
        </button>
        <button type="button" className={filterPillClass(status === "onboarded")} onClick={() => setStatus("onboarded")}>
          Onboarded
        </button>
        <button type="button" className={filterPillClass(status === "pending")} onClick={() => setStatus("pending")}>
          Pending
        </button>
        <select
          aria-label="Filter by reporting year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--text)]"
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              FY {y}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[12.5px] font-semibold text-[var(--text)]"
        >
          <option value="all">All industries</option>
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {["Organization", "Reporting year", "Status", "Users", "Completion", "Industry"].map((h) => (
              <th
                key={h}
                className="border-b border-[var(--border-soft)] px-3 py-2.5 text-left text-[11.5px] font-semibold uppercase tracking-wide text-[var(--text-muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((org) => (
            <tr
              key={org.id}
              className="cursor-pointer hover:bg-[var(--surface-2)]"
              onClick={() => router.push(`/master/organizations/${org.id}`)}
            >
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] font-bold text-[var(--ink)]">
                {org.name}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                {org.reporting_year ? `FY ${org.reporting_year}` : "—"}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                    org.onboarding_complete
                      ? "bg-[var(--teal-50)] text-[var(--teal)]"
                      : "bg-[var(--amber-50)] text-[var(--amber)]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {org.onboarding_complete ? "Onboarded" : "Pending"}
                </span>
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                {org.user_count}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5">
                {org.completion_pct !== null ? (
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-[72px] overflow-hidden rounded-full bg-[var(--border-soft)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${org.completion_pct}%`,
                          background: org.completion_pct < 20 ? "var(--red)" : "var(--teal)",
                        }}
                      />
                    </div>
                    <span className="min-w-[34px] text-xs text-[var(--text-muted)]">{org.completion_pct}%</span>
                  </div>
                ) : (
                  <span className="text-xs text-[var(--text-muted)]">—</span>
                )}
              </td>
              <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                {org.industry ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && (
        <p className="p-6 text-center text-sm text-[var(--text-muted)]">No organizations match these filters.</p>
      )}
    </div>
  );
}
