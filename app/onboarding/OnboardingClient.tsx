"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { REPORTING_YEARS } from "@/lib/brsr/constants";
import { PANELS } from "@/lib/brsr/questionConfig";
import { getAssignmentBlocksForPanel } from "@/lib/brsr/assignmentBlocks";
import type { PanelId } from "@/lib/brsr/types";

type OrgData = {
  /** Empty string until the org row is created via POST /api/onboarding/organization */
  id: string;
  name: string;
  reporting_year: string | null;
  company_type: string | null;
  industry: string | null;
  hq_city: string | null;
  country: string | null;
  cin: string | null;
  website: string | null;
  onboarding_complete: boolean;
};

type UserRow = { id: string; email: string | null; display_name: string | null };

const COMPANY_TYPES = ["Listed company", "Unlisted company", "SME", "PSU"] as const;

const INDUSTRY_OPTIONS = [
  "Agriculture & Allied Activities",
  "Automobiles",
  "Banks",
  "Capital Goods",
  "Chemicals",
  "Construction Materials",
  "Consumer Durables",
  "FMCG",
  "Financial Services",
  "Healthcare",
  "Information Technology",
  "Infrastructure & Real Estate",
  "Insurance",
  "Media & Entertainment",
  "Metals & Mining",
  "Oil & Gas",
  "Pharmaceuticals",
  "Power",
  "Retail",
  "Telecommunications",
  "Textiles",
  "Tourism & Hospitality",
  "Other",
];

const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "United Kingdom",
  "Singapore",
  "UAE",
  "Other",
];

// Sidebar step config
const STEPS = [
  { num: 1, label: "Account verified", sub: "Admin credentials confirmed" },
  { num: 2, label: "Organisation setup", sub: "Company info & reporting period" },
  { num: 3, label: "Invite team", sub: "CSV or manual entry", optional: true },
  { num: 4, label: "Configure sections", sub: "Assign users to principles", optional: true },
  { num: 5, label: "Launch workspace", sub: "Begin data collection" },
];

// ── Step-2 form ──────────────────────────────────────────────────────────────

function StepOrgSetup({
  org,
  onNext,
}: {
  org: OrgData;
  onNext: (updated: Partial<OrgData> & { id: string }) => void;
}) {
  const [orgName, setOrgName] = useState(org.name ?? "");
  const [reportingYear, setReportingYear] = useState(org.reporting_year ?? REPORTING_YEARS[0]);
  const [companyType, setCompanyType] = useState(org.company_type ?? "");
  const [industry, setIndustry] = useState(org.industry ?? "");
  const [hqCity, setHqCity] = useState(org.hq_city ?? "");
  const [country, setCountry] = useState(org.country ?? "India");
  const [cin, setCin] = useState(org.cin ?? "");
  const [website, setWebsite] = useState(org.website ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!orgName.trim()) { setError("Organisation name is required"); return; }
    if (!companyType) { setError("Please select a company type"); return; }
    setError(null);
    setLoading(true);
    const payload = {
      name: orgName.trim(),
      reporting_year: reportingYear,
      company_type: companyType,
      industry: industry || null,
      hq_city: hqCity || null,
      country: country || "India",
      cin: cin || null,
      website: website || null,
    };

    const isCreate = !org.id?.trim();
    const res = isCreate
      ? await fetch("/api/onboarding/organization", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch(`/api/organizations?id=${encodeURIComponent(org.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    const data = (await res.json().catch(() => ({}))) as { error?: string; org_id?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Failed to save");
      return;
    }
    const newId = isCreate ? data.org_id : org.id;
    if (!newId) {
      setError("Missing organisation id from server");
      return;
    }
    onNext({
      id: newId,
      name: orgName.trim(),
      reporting_year: reportingYear,
      company_type: companyType,
      industry: industry || null,
      hq_city: hqCity || null,
      country: country || "India",
      cin: cin || null,
      website: website || null,
      onboarding_complete: false,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Org Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Organisation Name
        </label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Acme Corporation"
          required
          className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Reporting Year */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Reporting Year
        </label>
        <select
          value={reportingYear}
          onChange={(e) => setReportingYear(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {REPORTING_YEARS.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* Company Type */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Company Type
        </label>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {COMPANY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setCompanyType(type)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-colors ${
                companyType === type
                  ? "border-blue-500 bg-blue-500/10 text-white"
                  : "border-[#334155] bg-[#111827] text-gray-300 hover:border-[#475569]"
              }`}
            >
              <span
                className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
                  companyType === type ? "border-blue-500 bg-blue-500" : "border-gray-500"
                }`}
              />
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
          Industry / Sector <span className="normal-case font-normal text-gray-500">(optional)</span>
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select sector</option>
          {INDUSTRY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            HQ City <span className="normal-case font-normal text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={hqCity}
            onChange={(e) => setHqCity(e.target.value)}
            placeholder="Mumbai"
            className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Country <span className="normal-case font-normal text-gray-500">(optional)</span>
          </label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            CIN <span className="normal-case font-normal text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            placeholder="U12345MH2010PTC..."
            className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
            Company Website <span className="normal-case font-normal text-gray-500">(optional)</span>
          </label>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://acme.com"
            className="mt-2 w-full rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Continue →"}
        </button>
      </div>
    </form>
  );
}

// ── Step-3 form: Invite team ─────────────────────────────────────────────────

type ManualEntry = { name: string; email: string; password: string };

function StepInviteTeam({
  orgName,
  onNext,
  onSkip,
  onUsersAdded,
}: {
  orgName: string;
  onNext: () => void;
  onSkip: () => void;
  onUsersAdded: (users: UserRow[]) => void;
}) {
  const [entries, setEntries] = useState<ManualEntry[]>([{ name: "", email: "", password: "" }]);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [rowErrors, setRowErrors] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function parseCSV(text: string): ManualEntry[] {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length === 0) return [];
    const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
    const nameIdx = header.indexOf("name");
    const emailIdx = header.indexOf("email");
    const passIdx = header.indexOf("password");
    if (emailIdx === -1 || passIdx === -1) {
      throw new Error("CSV must have 'email' and 'password' columns");
    }
    return lines.slice(1).map((line) => {
      const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      return {
        name: nameIdx !== -1 ? (cols[nameIdx] ?? "") : "",
        email: cols[emailIdx] ?? "",
        password: cols[passIdx] ?? "",
      };
    }).filter((e) => e.email);
  }

  function handleFile(file: File) {
    setCsvError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target?.result as string);
        if (parsed.length === 0) { setCsvError("No valid rows found in CSV"); return; }
        setEntries(parsed);
      } catch (e) {
        setCsvError(e instanceof Error ? e.message : "Failed to parse CSV");
      }
    };
    reader.readAsText(file);
  }

  function downloadTemplate() {
    const csv = "name,email,password\nJohn Doe,john@example.com,securepassword123\n";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function addRow() {
    setEntries((prev) => [...prev, { name: "", email: "", password: "" }]);
  }

  function updateEntry(idx: number, field: keyof ManualEntry, value: string) {
    setEntries((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  }

  function removeEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    setSubmitError(null);
    setRowErrors({});
    const valid = entries.filter((e) => e.email.trim());
    if (valid.length === 0) { setSubmitError("Add at least one team member"); return; }
    setLoading(true);
    const payload = valid.map((e) => ({
      email: e.email.trim(),
      password: e.password,
      display_name: e.name.trim() || null,
    }));
    const res = await fetch("/api/onboarding/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok && res.status !== 207) {
      setSubmitError(data.error ?? "Failed to add users");
      return;
    }
    const results = (data.results ?? []) as { email: string; ok: boolean; error?: string; user_id?: string }[];
    const errs: Record<number, string> = {};
    results.forEach((r, i) => {
      if (!r.ok) errs[i] = r.error ?? "Failed";
    });
    if (Object.keys(errs).length > 0) {
      setRowErrors(errs);
      return;
    }
    const addedUsers: UserRow[] = results
      .filter((r) => r.ok && r.user_id)
      .map((r, i) => ({ id: r.user_id!, email: r.email, display_name: payload[i].display_name ?? null }));
    onUsersAdded(addedUsers);
    onNext();
  }

  return (
    <div className="space-y-6">
      {/* CSV Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => fileRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
          isDragging ? "border-blue-500 bg-blue-500/5" : "border-[#334155] hover:border-[#475569]"
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="text-4xl">📄</div>
        <p className="mt-2 text-sm text-gray-300">Upload a CSV file</p>
        <p className="mt-1 text-xs text-gray-500">
          name, email columns required ·{" "}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); downloadTemplate(); }}
            className="text-blue-400 hover:underline"
          >
            Download template
          </button>
        </p>
        {csvError && <p className="mt-2 text-xs text-red-400">{csvError}</p>}
      </div>

      {/* Fixed org name display */}
      <div className="rounded-lg border border-[#334155] bg-[#111827] px-4 py-3">
        <p className="text-xs text-gray-500">Organisation</p>
        <p className="mt-0.5 font-medium text-white">{orgName}</p>
      </div>

      {/* Manual entries */}
      <div>
        <div className="mb-2 text-center text-xs text-gray-500">or add one by one</div>
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Full name"
                  value={entry.name}
                  onChange={(e) => updateEntry(idx, "name", e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#111827] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Work email"
                  value={entry.email}
                  onChange={(e) => updateEntry(idx, "email", e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#111827] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <input
                  type="password"
                  placeholder="Password"
                  value={entry.password}
                  onChange={(e) => updateEntry(idx, "password", e.target.value)}
                  className="w-full rounded-lg border border-[#334155] bg-[#111827] px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => removeEntry(idx)}
                className="mt-0.5 rounded border border-[#334155] px-2 py-2.5 text-gray-400 hover:text-red-400"
                disabled={entries.length === 1}
              >
                ✕
              </button>
              {rowErrors[idx] && (
                <p className="col-span-full text-xs text-red-400">{rowErrors[idx]}</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 flex items-center gap-1 rounded-lg border border-[#334155] px-4 py-2 text-sm text-gray-300 hover:bg-[#1e293b]"
        >
          + Add
        </button>
      </div>

      {submitError && <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{submitError}</p>}

      <div className="flex items-center justify-between">
        <button type="button" onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-200">
          Skip for now
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? "Adding…" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ── Step-4 form: Configure sections ─────────────────────────────────────────

// assignmentMap: userId → Set<questionCode>
type AssignmentMap = Record<string, Set<string>>;

const SECTION_PANEL_INFO: { id: PanelId; label: string; sublabel: string }[] = [
  { id: "generaldata", label: "General Data", sublabel: "Turnover, PPP, headcount" },
  { id: "general", label: "Section A", sublabel: "General disclosures" },
  { id: "sectionb", label: "Section B", sublabel: "Management & process" },
  { id: "p1", label: "Principle 1", sublabel: "Ethics & transparency" },
  { id: "p2", label: "Principle 2", sublabel: "Sustainable products" },
  { id: "p3", label: "Principle 3", sublabel: "Employee wellbeing" },
  { id: "p4", label: "Principle 4", sublabel: "Stakeholder engagement" },
  { id: "p5", label: "Principle 5", sublabel: "Human rights" },
  { id: "p6", label: "Principle 6", sublabel: "Environment" },
  { id: "p7", label: "Principle 7", sublabel: "Public policy" },
  { id: "p8", label: "Principle 8", sublabel: "Inclusive growth" },
  { id: "p9", label: "Principle 9", sublabel: "Consumer responsibility" },
];

function StepConfigureSections({
  users,
  onNext,
  onSkip,
}: {
  users: UserRow[];
  onNext: (assignments: AssignmentMap) => void;
  onSkip: () => void;
}) {
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [activePanel, setActivePanel] = useState<PanelId | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getSectionCodesForPanel(panelId: PanelId): string[] {
    const blocks = getAssignmentBlocksForPanel(panelId);
    return blocks.flatMap((b) => b.questionCodes);
  }

  function isUserAssignedToPanel(userId: string, panelId: PanelId): boolean {
    const codes = getSectionCodesForPanel(panelId);
    if (codes.length === 0) return false;
    const userCodes = assignments[userId] ?? new Set();
    return codes.every((c) => userCodes.has(c));
  }

  function countAssignedUsersForPanel(panelId: PanelId): number {
    return users.filter((u) => isUserAssignedToPanel(u.id, panelId)).length;
  }

  function toggleUserForPanel(userId: string, panelId: PanelId) {
    const codes = getSectionCodesForPanel(panelId);
    setAssignments((prev) => {
      const next = { ...prev };
      const current = new Set(next[userId] ?? []);
      if (isUserAssignedToPanel(userId, panelId)) {
        codes.forEach((c) => current.delete(c));
      } else {
        codes.forEach((c) => current.add(c));
      }
      next[userId] = current;
      return next;
    });
  }

  async function handleContinue() {
    setSaving(true);
    setError(null);
    const userIds = Object.keys(assignments);
    for (const userId of userIds) {
      const questionCodes = Array.from(assignments[userId]);
      const res = await fetch("/api/assignments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, question_codes: questionCodes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save assignments");
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    onNext(assignments);
  }

  const activePanelInfo = SECTION_PANEL_INFO.find((p) => p.id === activePanel);

  return (
    <div className="space-y-4">
      {/* Section grid */}
      <div className="grid grid-cols-2 gap-3">
        {SECTION_PANEL_INFO.map((panel) => {
          const count = countAssignedUsersForPanel(panel.id);
          const isActive = activePanel === panel.id;
          return (
            <button
              key={panel.id}
              type="button"
              onClick={() => setActivePanel(isActive ? null : panel.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                isActive
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-[#334155] bg-[#111827] hover:border-[#475569]"
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="font-medium text-white">{panel.label}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    count > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-[#1e293b] text-gray-500"
                  }`}
                >
                  {count > 0 ? "Assigned" : "Unassigned"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">{panel.sublabel}</p>
            </button>
          );
        })}
      </div>

      {/* User picker for active section */}
      {activePanel && users.length > 0 && (
        <div className="rounded-xl border border-[#334155] bg-[#0f172a] p-4">
          <p className="mb-3 text-sm font-medium text-white">
            Assign <span className="text-blue-400">{activePanelInfo?.label}</span> to:
          </p>
          <div className="space-y-2">
            {users.map((u) => {
              const checked = isUserAssignedToPanel(u.id, activePanel);
              return (
                <label key={u.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-[#334155] bg-[#111827] px-4 py-3 hover:border-[#475569]">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleUserForPanel(u.id, activePanel)}
                    className="h-4 w-4 rounded border-gray-500 accent-blue-500"
                  />
                  <div>
                    <p className="text-sm text-white">{u.display_name || u.email}</p>
                    {u.display_name && <p className="text-xs text-gray-500">{u.email}</p>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {activePanel && users.length === 0 && (
        <p className="rounded-xl border border-[#334155] bg-[#0f172a] p-4 text-sm text-gray-400">
          No team members added yet. Skip to invite them later.
        </p>
      )}

      {error && <p className="rounded bg-red-500/10 p-3 text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-200">
          Skip for now
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={saving}
          className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-gray-100 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Continue →"}
        </button>
      </div>
    </div>
  );
}

// ── Step-5: Launch workspace ─────────────────────────────────────────────────

function StepLaunch({
  org,
  memberCount,
  onLaunch,
}: {
  org: OrgData;
  memberCount: number;
  onLaunch: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLaunch() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/onboarding/launch", { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) { setError(data.error ?? "Failed to launch"); return; }
    onLaunch();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1e293b] text-4xl">
        🚀
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Ready to launch</h2>
        <p className="mt-2 text-sm text-gray-400 max-w-sm">
          Your workspace is configured. Team members can begin filling in their assigned sections.
        </p>
      </div>
      <div className="flex gap-8 rounded-2xl border border-[#334155] bg-[#111827] px-8 py-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-white">1</p>
          <p className="mt-1 text-xs uppercase text-gray-500">Organisation</p>
        </div>
        <div className="w-px bg-[#334155]" />
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{memberCount}</p>
          <p className="mt-1 text-xs uppercase text-gray-500">Members</p>
        </div>
        <div className="w-px bg-[#334155]" />
        <div className="text-center">
          <p className="text-3xl font-bold text-white">{org.reporting_year ?? "—"}</p>
          <p className="mt-1 text-xs uppercase text-gray-500">Reporting Year</p>
        </div>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="button"
        onClick={handleLaunch}
        disabled={loading}
        className="rounded-xl bg-white px-8 py-4 text-sm font-semibold text-black hover:bg-gray-100 disabled:opacity-50"
      >
        {loading ? "Launching…" : "Launch workspace"}
      </button>
    </div>
  );
}

// ── Progress sidebar ─────────────────────────────────────────────────────────

function Sidebar({ currentStep, completedSteps }: { currentStep: number; completedSteps: Set<number> }) {
  return (
    <aside className="w-72 shrink-0 border-r border-[#1e293b] bg-[#0f172a] p-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-xl">
          📊
        </div>
        <div>
          <p className="font-semibold text-white">BRSR Data Collection</p>
          <p className="text-xs text-gray-500">Admin Setup</p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-500">
        Setup Progress
      </p>

      <div className="space-y-1">
        {STEPS.map((step, idx) => {
          const done = completedSteps.has(step.num);
          const active = currentStep === step.num;
          return (
            <div key={step.num} className="relative flex gap-4">
              {/* connector line */}
              {idx < STEPS.length - 1 && (
                <div className="absolute left-4 top-8 h-full w-px bg-[#1e293b]" />
              )}
              {/* circle */}
              <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                done
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : active
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-[#334155] bg-[#0f172a] text-gray-500"
              }`}>
                {done ? "✓" : step.num}
              </div>
              {/* label */}
              <div className="pb-6">
                <p className={`text-sm font-medium ${active ? "text-white" : done ? "text-gray-300" : "text-gray-500"}`}>
                  {step.label}
                  {step.optional && (
                    <span className="ml-1.5 rounded border border-[#334155] px-1.5 py-0.5 text-xs font-normal text-gray-500">
                      optional
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-600">{step.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-xs text-gray-600">
        Need help?{" "}
        <a href="#" className="text-blue-500 hover:underline">
          View setup guide →
        </a>
      </div>
    </aside>
  );
}

// ── Main onboarding wizard ───────────────────────────────────────────────────

function OnboardingWizardBody({
  initialOrg,
  initialUsers,
}: {
  initialOrg: OrgData;
  initialUsers: UserRow[];
}) {
  const [currentStep, setCurrentStep] = useState(2);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set([1]));
  const [org, setOrg] = useState<OrgData>(initialOrg);
  const [users, setUsers] = useState<UserRow[]>(initialUsers);

  function completeStep(num: number) {
    setCompletedSteps((prev) => new Set(Array.from(prev).concat(num)));
  }

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    2: {
      title: "Set up your organisation",
      subtitle: "Required fields get you started. Optional fields improve your BRSR report output.",
    },
    3: {
      title: "Invite your team",
      subtitle: "Add team members now or skip — you can always invite them from the admin workspace.",
    },
    4: {
      title: "Configure sections",
      subtitle: "Assign team members to BRSR sections. Skip to do this later from your admin workspace.",
    },
    5: {
      title: "",
      subtitle: "",
    },
  };

  return (
    <div className="flex min-h-screen bg-[#0a0f12]">
      <Sidebar currentStep={currentStep} completedSteps={completedSteps} />

      <main className="flex-1 overflow-auto">
        {/* Progress bar */}
        <div className="h-1 bg-[#1e293b]">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        <div className="mx-auto max-w-2xl px-8 py-10">
          {/* Step badge */}
          <div className="mb-6">
            <span className="inline-flex items-center rounded-full border border-[#334155] bg-[#111827] px-3 py-1 text-xs font-medium text-gray-300">
              Step {currentStep} of {STEPS.length}
              {(currentStep === 3 || currentStep === 4) && (
                <span className="ml-2 text-gray-500">· Optional</span>
              )}
            </span>
          </div>

          {/* Title (not shown for step 5 which has its own layout) */}
          {currentStep !== 5 && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white">{stepTitles[currentStep]?.title}</h1>
              <p className="mt-2 text-sm text-gray-400">{stepTitles[currentStep]?.subtitle}</p>
            </div>
          )}

          {currentStep === 2 && (
            <StepOrgSetup
              org={org}
              onNext={(updated) => {
                setOrg((prev) => ({ ...prev, ...updated }));
                completeStep(2);
                setCurrentStep(3);
              }}
            />
          )}

          {currentStep === 3 && (
            <StepInviteTeam
              orgName={org.name}
              onNext={() => {
                completeStep(3);
                setCurrentStep(4);
              }}
              onSkip={() => {
                completeStep(3);
                setCurrentStep(4);
              }}
              onUsersAdded={(newUsers) => {
                setUsers((prev) => [...prev, ...newUsers]);
              }}
            />
          )}

          {currentStep === 4 && (
            <StepConfigureSections
              users={users}
              onNext={() => {
                completeStep(4);
                setCurrentStep(5);
              }}
              onSkip={() => {
                completeStep(4);
                setCurrentStep(5);
              }}
            />
          )}

          {currentStep === 5 && (
            <StepLaunch
              org={org}
              memberCount={users.length}
              onLaunch={() => completeStep(5)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export function OnboardingClient({
  adminEmail: _adminEmail,
  org: initialOrg,
  initialUsers,
  mode = "wizard",
}: {
  adminEmail: string;
  org: OrgData;
  initialUsers: UserRow[];
  mode?: "wizard" | "pending";
}) {
  if (mode === "pending") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0f12] px-4">
        <div className="max-w-md rounded-xl border border-[#334155] bg-[#1a202c] p-8 text-center">
          <p className="text-lg font-semibold text-white">Organisation setup in progress</p>
          <p className="mt-3 text-sm text-gray-400">
            Your administrator has not finished onboarding for this organisation yet. You will get access to
            the workspace once they complete setup.
          </p>
          <form action="/api/auth/signout" method="post" className="mt-6">
            <button
              type="submit"
              className="text-sm text-blue-400 hover:underline"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <OnboardingWizardBody initialOrg={initialOrg} initialUsers={initialUsers} />;
}
