"use client";

import { useMemo, useState, type ReactNode } from "react";
import type { PanelId } from "@/lib/brsr/types";
import { PANELS } from "@/lib/brsr/questionConfig";
import { getAssignmentBlocksForPanel, type AssignmentBlock, type Department } from "@/lib/brsr/assignmentBlocks";
import { useAssignmentStats } from "../hooks/useAssignmentStats";
import { useAssignments } from "../hooks/useAssignments";
import { useAssignmentCoverage } from "../hooks/useAssignmentCoverage";
import { AvatarChip, cardClass, captionClass, ghostBtnClass, userLabel, type UserOption } from "./shared";
import { ManageUsersPanel } from "./ManageUsersPanel";

/**
 * Admin Workspace color system — CSS variables from `.app-theme`
 * (globals.css), ported 1:1 from Archive 1/workflow-mockup/admin-assign-tier1.html.
 * Every color below is `var(--...)`, never a hardcoded hex, so the whole page
 * re-themes when ThemeToggleButton flips `data-theme` on the wrapper:
 * - `--surface`/`--surface-2`/`--surface-3`: card / inset panel / segmented-track
 *   backgrounds, light-to-dark step.
 * - `--ink`/`--text`/`--text-muted`: headings+emphasized data / structural copy
 *   (labels, table data, nav text) / secondary copy (subtitles, helper text).
 * - `--brand`: exactly one meaning — active nav/tab, primary action (Confirm),
 *   and (per the mock) a fully-selected question block.
 * - `--amber`: reserved for "partially selected" only — do not reuse elsewhere.
 * This intentionally replaces the previous emerald-for-"complete" convention:
 * the mock uses brand blue for checked blocks, amber for partial, nothing else.
 */

function isEssentialBlock(block: AssignmentBlock): boolean {
  return block.questionCodes.some((c) => /_e\d/.test(c) || c.endsWith("_notes"));
}
function isLeadershipBlock(block: AssignmentBlock): boolean {
  return block.questionCodes.some((c) => /_l\d/.test(c) || c.endsWith("_notes"));
}

type AssignmentTab = "essential" | "leadership";

type WorkspaceTab = "analytics" | "assign" | "manage-users";

type SectionNavId = PanelId | "__all__";

const DEPARTMENTS: Department[] = [
  "HR",
  "Sustainability",
  "CS/Legal",
  "Finance",
  "Marketing",
  "IT",
  "Procurement",
];
const UNTAGGED_DEPT = "__untagged__";

function isUntaggedBlock(block: AssignmentBlock): boolean {
  return !block.departments?.length;
}

/** Union match: a block passes if it has any selected department, or is untagged when Untagged is on. */
function matchesDeptFilter(block: AssignmentBlock, activeDepts: Set<string>): boolean {
  if (activeDepts.size === 0) return true;
  if (activeDepts.has(UNTAGGED_DEPT) && isUntaggedBlock(block)) return true;
  return (block.departments ?? []).some((d) => activeDepts.has(d));
}

/** Org-unassigned: none of the block's codes appear in anyone's assignment set. */
function isOrgUnassignedBlock(block: AssignmentBlock, orgAssignedCodes: Set<string>): boolean {
  return !block.questionCodes.some((code) => orgAssignedCodes.has(code));
}

const WORKSPACE_TABS: { id: WorkspaceTab; label: string }[] = [
  { id: "analytics", label: "Analytics" },
  { id: "assign", label: "Assign" },
  { id: "manage-users", label: "Manage Users" },
];

/* Segmented pill tab, shared by the workspace-level tabs and the
   essential/leadership sub-tabs (mock's .tabs/.tab and .subtabs). */
function PillTab({
  active,
  small,
  onClick,
  children,
  ...rest
}: {
  active: boolean;
  small?: boolean;
  onClick: () => void;
  children: ReactNode;
} & Record<string, unknown>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full font-semibold ${small ? "px-3.5 py-1.5 text-[12.5px]" : "px-4 py-2 text-[13.5px]"} ${
        active
          ? "bg-[var(--surface)] text-[var(--brand)] shadow-[var(--shadow-sm)]"
          : "text-[var(--text-muted)] hover:text-[var(--ink)]"
      }`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function AdminWorkspaceClient({ users, reportingYear }: { users: UserOption[]; reportingYear: string }) {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("analytics");
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [activePanel, setActivePanel] = useState<SectionNavId>("generaldata");
  const [assignmentTab, setAssignmentTab] = useState<AssignmentTab>("essential");
  const [activeDepts, setActiveDepts] = useState<Set<string>>(() => new Set());
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  const { stats, loading: loadingStats, error: statsError, reload: reloadStats } =
    useAssignmentStats(reportingYear);

  const {
    selectedCodes,
    loading: loadingAssignments,
    saving: savingAssignments,
    error: assignError,
    success,
    toggleBlock,
    applyBlockSelection,
    confirmAssignments,
  } = useAssignments(selectedUserId);

  const {
    assignedCodes: orgAssignedCodes,
    loading: loadingCoverage,
    error: coverageError,
    reload: reloadCoverage,
  } = useAssignmentCoverage(reportingYear);

  const error = statsError ?? assignError ?? coverageError;
  const selectedUser = users.find((u) => u.id === selectedUserId);

  const allBlocks = useMemo(
    () => PANELS.flatMap((panel) => getAssignmentBlocksForPanel(panel.id)),
    []
  );

  const deptCounts = useMemo(() => {
    const counts: Record<string, number> = Object.fromEntries(DEPARTMENTS.map((d) => [d, 0]));
    let untagged = 0;
    for (const block of allBlocks) {
      if (isUntaggedBlock(block)) {
        untagged += 1;
        continue;
      }
      for (const dept of block.departments ?? []) {
        counts[dept] = (counts[dept] ?? 0) + 1;
      }
    }
    return { counts, untagged };
  }, [allBlocks]);

  const taggingCoverage = useMemo(() => {
    const tagged = allBlocks.filter((block) => !isUntaggedBlock(block)).length;
    const total = allBlocks.length;
    const pct = total === 0 ? 0 : Math.round((100 * tagged) / total);
    return { tagged, total, pct };
  }, [allBlocks]);

  const assignmentBlocksForActivePanel = useMemo(() => {
    if (activePanel === "__all__") return allBlocks;
    return getAssignmentBlocksForPanel(activePanel);
  }, [activePanel, allBlocks]);

  const isPrinciplePanel = activePanel !== "__all__" && /^p[1-9]$/.test(activePanel);
  const displayedBlocks = useMemo(() => {
    const deptMatched = assignmentBlocksForActivePanel.filter((block) =>
      matchesDeptFilter(block, activeDepts)
    );
    const coverageMatched = unassignedOnly
      ? deptMatched.filter((block) => isOrgUnassignedBlock(block, orgAssignedCodes))
      : deptMatched;
    if (!isPrinciplePanel) return coverageMatched;
    return coverageMatched.filter((block) =>
      assignmentTab === "essential" ? isEssentialBlock(block) : isLeadershipBlock(block)
    );
  }, [
    assignmentBlocksForActivePanel,
    activeDepts,
    unassignedOnly,
    orgAssignedCodes,
    assignmentTab,
    isPrinciplePanel,
  ]);

  const sectionCounts = useMemo(() => {
    const byPanel: Record<string, number> = { __all__: 0 };
    for (const panel of PANELS) {
      const n = getAssignmentBlocksForPanel(panel.id).filter((block) => {
        if (!matchesDeptFilter(block, activeDepts)) return false;
        if (unassignedOnly && !isOrgUnassignedBlock(block, orgAssignedCodes)) {
          return false;
        }
        return true;
      }).length;
      byPanel[panel.id] = n;
      byPanel.__all__ += n;
    }
    return byPanel;
  }, [activeDepts, unassignedOnly, orgAssignedCodes]);

  const selectedBlockCount = useMemo(
    () =>
      displayedBlocks.filter((block) =>
        block.questionCodes.every((code) => selectedCodes.has(code))
      ).length,
    [displayedBlocks, selectedCodes]
  );

  const selectedBlockTotalForUser = useMemo(
    () =>
      allBlocks.filter((block) => block.questionCodes.some((code) => selectedCodes.has(code)))
        .length,
    [allBlocks, selectedCodes]
  );

  const allVisibleSelected =
    displayedBlocks.length > 0 &&
    displayedBlocks.every((block) => block.questionCodes.every((code) => selectedCodes.has(code)));

  function toggleDeptChip(dept: string) {
    const next = new Set(activeDepts);
    if (next.has(dept)) next.delete(dept);
    else next.add(dept);
    setActiveDepts(next);
    if (next.size > 0) setActivePanel("__all__");
  }

  function selectAllVisible() {
    const codes = displayedBlocks.flatMap((block) => block.questionCodes);
    applyBlockSelection(codes, !allVisibleSelected);
  }

  const sectionNav: { id: SectionNavId; label: string }[] = [
    { id: "__all__", label: "All sections" },
    ...PANELS.map((panel) => ({ id: panel.id as SectionNavId, label: panel.label })),
  ];

  return (
    <div className={`space-y-6${activeTab === "assign" ? " pb-28" : ""}`}>
      <div className="inline-flex gap-0.5 rounded-full bg-[var(--surface-3)] p-1">
        {WORKSPACE_TABS.map((tab) => (
          <PillTab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            data-testid={`workspace-tab-${tab.id}`}
          >
            {tab.label}
          </PillTab>
        ))}
      </div>

      {activeTab === "analytics" && (
      <section className={cardClass}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">Completion statistics</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Track completion against assigned questions.</p>
          </div>
          <div className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-3.5 py-2.5">
            <p className={captionClass}>Reporting year</p>
            <p className="mt-0.5 text-sm font-bold text-[var(--ink)]">{reportingYear}</p>
          </div>
        </div>

        {loadingStats ? (
          <p className="mt-5 text-sm text-[var(--text-muted)]">Loading statistics...</p>
        ) : (
          <>
            <div className="mt-5 grid gap-3.5 sm:grid-cols-3">
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                <p className={captionClass}>Assigned</p>
                <p className="mt-1.5 text-[28px] font-extrabold tracking-tight text-[var(--ink)]">{stats?.totals.assigned_count ?? 0}</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                <p className={captionClass}>Completed</p>
                <p className="mt-1.5 text-[28px] font-extrabold tracking-tight text-[var(--ink)]">{stats?.totals.completed_count ?? 0}</p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--surface-2)] p-4">
                <p className={captionClass}>Completion</p>
                <p className="mt-1.5 text-[28px] font-extrabold tracking-tight text-[var(--ink)]">{stats?.totals.completion_pct ?? 0}%</p>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-soft)]">
              <table className="min-w-full border-collapse">
                <thead className="bg-[var(--surface-2)]">
                  <tr>
                    <th className={`px-4 py-2.5 text-left ${captionClass}`}>User</th>
                    <th className={`px-4 py-2.5 text-left ${captionClass}`}>Assigned</th>
                    <th className={`px-4 py-2.5 text-left ${captionClass}`}>Completed</th>
                    <th className={`px-4 py-2.5 text-left ${captionClass}`}>Completion %</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.per_user ?? []).map((row) => {
                    const label = row.display_name || row.email || "User";
                    return (
                      <tr key={row.user_id} className="border-t border-[var(--border-soft)]">
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center gap-2.5 font-semibold text-[var(--ink)]">
                            <AvatarChip seed={row.user_id} label={label} />
                            {label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]">{row.assigned_count}</td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]">{row.completed_count}</td>
                        <td className="px-4 py-3 text-sm text-[var(--text)]">{row.completion_pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
      )}

      {activeTab === "assign" && (
      <section className={cardClass}>
        <h2 className="text-xl font-bold text-[var(--ink)]">Assign users to questions</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Select a user, filter by department if you like, click question blocks, then confirm.
        </p>

        <div className="mt-5">
          <label className={`mb-1.5 block ${captionClass}`}>User</label>
          <div className="flex max-w-md items-center gap-2.5">
            {selectedUser && <AvatarChip seed={selectedUser.id} label={userLabel(selectedUser)} size="lg" />}
            <select
              data-testid="user-select"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="flex-1 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] outline-none focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_var(--brand-50)]"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {userLabel(u)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-[14.5px] font-bold text-[var(--ink)]">Filter by department</p>
              <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                Pick a department to see its blocks across every section.
              </p>
            </div>
            <button
              type="button"
              data-testid="dept-clear"
              onClick={() => setActiveDepts(new Set())}
              disabled={activeDepts.size === 0}
              className={ghostBtnClass}
            >
              Clear filter
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              ...DEPARTMENTS.map((dept) => ({
                id: dept,
                label: dept,
                count: deptCounts.counts[dept] ?? 0,
                dashed: false,
                testId: `dept-chip-${dept}`,
              })),
              {
                id: UNTAGGED_DEPT,
                label: "Untagged",
                count: deptCounts.untagged,
                dashed: true,
                testId: "dept-chip-untagged",
              },
            ].map((chip) => {
              const on = activeDepts.has(chip.id);
              return (
                <button
                  key={chip.id}
                  type="button"
                  data-testid={chip.testId}
                  aria-pressed={on}
                  onClick={() => toggleDeptChip(chip.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold ${
                    chip.dashed ? "border-dashed" : ""
                  } ${
                    on
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white shadow-[var(--shadow-sm)] hover:border-[var(--brand-600)] hover:bg-[var(--brand-600)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                  }`}
                >
                  {chip.label}
                  <span className={`text-[11px] tabular-nums ${on ? "opacity-85" : "opacity-70"}`}>
                    {chip.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-[var(--border-soft)] pt-4">
            <div
              data-testid="tagging-coverage"
              className="grid h-10 w-10 flex-none place-items-center rounded-full"
              style={{
                background: `conic-gradient(var(--teal) ${taggingCoverage.pct}%, var(--border) 0)`,
              }}
              aria-label={`Tagging coverage: ${taggingCoverage.tagged} of ${taggingCoverage.total} blocks tagged`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--surface)] text-[10px] font-extrabold text-[var(--ink)]">
                {taggingCoverage.pct}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--ink)]">Tagging coverage</p>
              <p className="text-xs text-[var(--text-muted)]">
                {taggingCoverage.tagged} of {taggingCoverage.total} blocks tagged
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[18px]">
          <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-[13.5px] text-[var(--text)]">
            <input
              type="checkbox"
              data-testid="unassigned-only"
              className="peer sr-only"
              checked={unassignedOnly}
              disabled={loadingCoverage}
              onChange={(e) => setUnassignedOnly(e.target.checked)}
            />
            <span className="relative h-[21px] w-9 flex-none rounded-full bg-[var(--border)] transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-[17px] after:w-[17px] after:rounded-full after:bg-white after:shadow-[0_1px_3px_rgba(15,23,42,0.25)] after:transition-transform peer-checked:bg-[var(--brand)] peer-checked:after:translate-x-[15px] peer-disabled:opacity-45" />
            Show only unassigned blocks
          </label>
        </div>

        <div className="mt-5 grid gap-6 border-t border-[var(--border-soft)] pt-5 lg:grid-cols-[230px_1fr]">
          <div className="flex flex-col gap-0.5">
            <p className={`px-2.5 pb-2.5 ${captionClass}`}>Sections</p>
            {sectionNav.map((item) => {
              const n = sectionCounts[item.id] ?? 0;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-testid={item.id === "__all__" ? "section-all" : `section-${item.id}`}
                  onClick={() => setActivePanel(item.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-[var(--radius-sm)] px-2.5 py-2.5 text-left text-[13.5px] font-medium ${
                    activePanel === item.id
                      ? "bg-[var(--brand-50)] font-bold text-[var(--brand)]"
                      : n === 0
                        ? "text-[var(--text-muted)] hover:bg-[var(--surface-2)]"
                        : "text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[11px] tabular-nums text-[var(--text-muted)]">{n}</span>
                </button>
              );
            })}
          </div>

          <div className="min-w-0">
            <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[15px] font-bold text-[var(--ink)]">
                {activePanel === "__all__"
                  ? "All sections"
                  : (PANELS.find((p) => p.id === activePanel)?.label ?? "Questions")}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  data-testid="select-visible"
                  onClick={selectAllVisible}
                  disabled={loadingAssignments || displayedBlocks.length === 0}
                  className={ghostBtnClass}
                >
                  {allVisibleSelected ? "Deselect all visible" : "Select all visible"}
                </button>
                <p className="text-[12.5px] text-[var(--text-muted)]">
                  Selected blocks: <b className="text-[var(--ink)]">{selectedBlockCount}</b>
                </p>
              </div>
            </div>
            {isPrinciplePanel && (
              <div className="mb-3.5 inline-flex w-fit gap-1 rounded-full bg-[var(--surface-3)] p-1">
                {(["essential", "leadership"] as AssignmentTab[]).map((tab) => (
                  <PillTab
                    key={tab}
                    small
                    active={assignmentTab === tab}
                    onClick={() => setAssignmentTab(tab)}
                    data-testid={`tab-${tab}`}
                  >
                    {tab === "essential" ? "Essential indicators" : "Leadership indicators"}
                  </PillTab>
                ))}
              </div>
            )}
            {loadingAssignments ? (
              <p className="text-sm text-[var(--text-muted)]">Loading assignments...</p>
            ) : displayedBlocks.length === 0 ? (
              <p className="py-6 text-center text-sm text-[var(--text-muted)]">No blocks match this filter.</p>
            ) : (
              <div className="grid gap-2.5 md:grid-cols-2">
                {displayedBlocks.map((block) => {
                  const selectedCount = block.questionCodes.reduce(
                    (count, code) => count + (selectedCodes.has(code) ? 1 : 0),
                    0
                  );
                  const checked = selectedCount === block.questionCodes.length;
                  const partial = selectedCount > 0 && !checked;
                  return (
                    <button
                      key={block.id}
                      type="button"
                      data-testid={`block-${block.id}`}
                      data-checked={checked ? "true" : "false"}
                      onClick={() => toggleBlock(block.questionCodes)}
                      className={`relative flex items-start justify-between gap-2.5 rounded-[var(--radius-md)] border px-3.5 py-3.5 text-left text-sm transition-colors ${
                        checked
                          ? "border-[var(--brand)] bg-[var(--brand-50)] shadow-[0_0_0_1px_var(--brand)_inset]"
                          : partial
                            ? "border-[var(--amber)] bg-[var(--amber-50)] shadow-[0_0_0_1px_var(--amber)_inset]"
                            : "border-[var(--border-soft)] text-[var(--text)] hover:bg-[var(--surface-2)]"
                      }`}
                    >
                      <span className="truncate font-semibold text-[var(--ink)]">{block.label}</span>
                      {checked && (
                        <span className="absolute -right-2 -top-2 grid h-[22px] w-[22px] flex-none place-items-center rounded-full border-2 border-[var(--surface)] bg-[var(--brand)] text-[11px] font-bold text-white shadow-[var(--shadow-sm)]">
                          ✓
                        </span>
                      )}
                      {partial && (
                        <span className="flex-none rounded-full bg-[var(--amber-100)] px-2 py-0.5 text-[11px] font-bold text-[var(--amber)]">
                          {selectedCount}/{block.questionCodes.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {activeTab === "assign" && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-10">
          <div className="pointer-events-auto mx-auto max-w-[1180px] px-7 max-[900px]:px-4">
            <div className="flex flex-wrap items-center gap-3.5 rounded-2xl bg-[var(--actionbar-bg)] px-5 py-3.5 shadow-[var(--shadow-lg)]">
              <button
                type="button"
                data-testid="confirm-assignment"
                onClick={() =>
                  confirmAssignments(() => {
                    reloadStats();
                    reloadCoverage();
                  })
                }
                disabled={!selectedUserId || savingAssignments}
                className="rounded-[var(--radius-sm)] bg-[var(--brand)] px-[18px] py-2.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(47,91,255,0.32)] hover:bg-[var(--brand-600)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {savingAssignments ? "Saving..." : "Confirm Assignment"}
              </button>
              <button
                type="button"
                data-testid="clear-selection"
                onClick={() => applyBlockSelection(Array.from(selectedCodes), false)}
                disabled={selectedBlockTotalForUser === 0}
                className="rounded-[var(--radius-sm)] border border-white/15 bg-white/10 px-3.5 py-1.5 text-[13px] font-semibold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
              >
                Clear selection
              </button>
              <span className="text-[13.5px] font-semibold text-white/90">
                {selectedBlockTotalForUser} block{selectedBlockTotalForUser === 1 ? "" : "s"} selected
                {selectedUser ? ` for ${userLabel(selectedUser)}` : ""}
              </span>
              {success && (
                <p data-testid="assignment-success" className="text-[13px] font-semibold text-[var(--teal-300)]">
                  {success}
                </p>
              )}
              {error && (
                <p data-testid="assignment-error" className="text-sm font-semibold text-[var(--red)]">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "manage-users" && (
        <section data-testid="workspace-panel-manage-users">
          <ManageUsersPanel />
        </section>
      )}
    </div>
  );
}
