"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { REPORTING_YEARS } from "@/lib/brsr/constants";
import { OrganizationDeleteButton } from "../OrganizationDeleteButton";

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
};

export function OrgSettingsForm({ org }: { org: Org }) {
  const router = useRouter();
  const [form, setForm] = useState({
    reporting_year: org.reporting_year ?? "",
    plan_tier: org.plan_tier ?? "",
    industry: org.industry ?? "",
    company_type: org.company_type ?? "",
    hq_city: org.hq_city ?? "",
    cin: org.cin ?? "",
    website: org.website ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/organizations?id=${encodeURIComponent(org.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save changes");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  const field = "field";
  const inputClass =
    "w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-50)]";
  const labelClass = "mb-1.5 block text-xs font-semibold text-[var(--text-muted)]";

  return (
    <div className={field}>
      <div className="mb-1 flex items-baseline justify-between">
        <h2 className="text-[17px] font-bold text-[var(--ink)]">Organization settings</h2>
      </div>
      <p className="mb-5 text-[12.5px] text-[var(--text-muted)]">
        Reporting year and profile — set once at onboarding, editable here afterward.
      </p>
      <div className="grid max-w-[560px] grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Reporting year</label>
          <select
            value={form.reporting_year}
            onChange={(e) => update("reporting_year", e.target.value)}
            className={inputClass}
          >
            <option value="">—</option>
            {REPORTING_YEARS.map((y) => (
              <option key={y} value={y}>
                FY {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Plan tier</label>
          <input
            value={form.plan_tier}
            onChange={(e) => update("plan_tier", e.target.value)}
            className={inputClass}
            placeholder="Growth"
          />
        </div>
        <div>
          <label className={labelClass}>Industry</label>
          <input
            value={form.industry}
            onChange={(e) => update("industry", e.target.value)}
            className={inputClass}
            placeholder="Manufacturing"
          />
        </div>
        <div>
          <label className={labelClass}>Company type</label>
          <input
            value={form.company_type}
            onChange={(e) => update("company_type", e.target.value)}
            className={inputClass}
            placeholder="Listed"
          />
        </div>
        <div>
          <label className={labelClass}>HQ city</label>
          <input
            value={form.hq_city}
            onChange={(e) => update("hq_city", e.target.value)}
            className={inputClass}
            placeholder="Mumbai"
          />
        </div>
        <div>
          <label className={labelClass}>CIN</label>
          <input value={form.cin} onChange={(e) => update("cin", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Website</label>
          <input value={form.website} onChange={(e) => update("website", e.target.value)} className={inputClass} />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[var(--brand)] px-[18px] py-2 text-[13px] font-bold text-white hover:bg-[var(--brand-600)] disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && !error && <span className="text-[12.5px] text-[var(--teal)]">Saved.</span>}
        {error && (
          <span className="text-[12.5px] text-[var(--red)]" role="alert">
            {error}
          </span>
        )}
        <span className="text-[12.5px] text-[var(--text-muted)]">
          Changing reporting year does not move existing answers.
        </span>
      </div>

      <div className="mt-8 border-t border-[var(--border-soft)] pt-5">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Danger zone</p>
        <OrganizationDeleteButton orgId={org.id} name={org.name} redirectTo="/master/organizations" />
      </div>
    </div>
  );
}
