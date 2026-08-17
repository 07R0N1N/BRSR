"use client";

import { useState } from "react";
import Link from "next/link";
import type { OrgUserStat } from "@/lib/master/orgStats";
import { OrgSettingsForm } from "./OrgSettingsForm";

type Org = {
  id: string;
  name: string;
  plan_tier: string | null;
  reporting_year: string | null;
  company_type: string | null;
  industry: string | null;
  hq_city: string | null;
  country: string | null;
  cin: string | null;
  website: string | null;
  onboarding_complete: boolean;
};

const TABS = ["users", "settings", "benchmarking"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  users: "Users",
  settings: "Settings",
  benchmarking: "Benchmarking",
};

export function OrgDetailClient({ org, users }: { org: Org; users: OrgUserStat[] }) {
  const [tab, setTab] = useState<Tab>("users");

  return (
    <div>
      <Link
        href="/master/organizations"
        className="mb-3.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--brand)] hover:underline"
      >
        ← Back to organizations
      </Link>
      <div className="mb-1 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold text-[var(--ink)]">{org.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
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
            {org.reporting_year && (
              <span className="inline-flex items-center rounded-full bg-[var(--brand-50)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--brand)]">
                FY {org.reporting_year}
              </span>
            )}
            {(org.industry || org.hq_city) && (
              <span className="inline-flex items-center rounded-full bg-[var(--surface-3)] px-2.5 py-1 text-[11.5px] font-bold text-[var(--text-muted)]">
                {[org.industry, org.hq_city].filter(Boolean).join(" · ")}
              </span>
            )}
          </div>
        </div>
      </div>

      <nav
        className="my-5 inline-flex gap-0.5 rounded-full bg-[var(--surface-3)] p-1"
        role="tablist"
        aria-label="Org detail sections"
      >
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors ${
              tab === t
                ? "bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]"
                : "text-[var(--text-muted)] hover:text-[var(--ink)]"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </nav>

      {tab === "users" && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <div className="mb-4">
            <h2 className="text-[17px] font-bold text-[var(--ink)]">Users in this organization</h2>
            <p className="mt-0.5 text-[12.5px] text-[var(--text-muted)]">
              {users.length} user{users.length === 1 ? "" : "s"} · admin manages assignments in Admin Workspace
            </p>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {["Email", "Role", "Assigned questions", "Completion"].map((h) => (
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
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] font-bold text-[var(--ink)]">
                    {u.email}
                  </td>
                  <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                    {u.role_name}
                  </td>
                  <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                    {u.assigned_label}
                  </td>
                  <td className="border-b border-[var(--border-soft)] px-3 py-2.5 text-[13px] text-[var(--text)]">
                    {u.completion_pct !== null ? `${u.completion_pct}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="p-6 text-center text-sm text-[var(--text-muted)]">No users in this organization yet.</p>
          )}
        </div>
      )}

      {tab === "settings" && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <OrgSettingsForm org={org} />
        </div>
      )}

      {tab === "benchmarking" && (
        <div className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-5 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col items-center gap-2 px-5 py-12 text-center text-[var(--text-muted)]">
            <span className="rounded-full bg-[var(--surface-3)] px-3 py-1 text-[11.5px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
              Coming soon
            </span>
            <h3 className="text-[15px] font-bold text-[var(--ink)]">Peer benchmarking</h3>
            <p className="max-w-[380px] text-[13px]">
              Compare this org&apos;s intensity metrics (GHG, water, women&apos;s representation) against other{" "}
              {org.industry ?? "same-sector"} orgs once enough filings are in. Grouping will use industry, company
              type, and HQ location already on file.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
