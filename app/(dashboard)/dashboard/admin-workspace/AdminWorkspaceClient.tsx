"use client";

import { useMemo, useState } from "react";
import type { PanelId } from "@/lib/brsr/types";
import { PANELS } from "@/lib/brsr/questionConfig";
import { getAssignmentBlocksForPanel } from "@/lib/brsr/assignmentBlocks";
import { REPORTING_YEARS } from "@/lib/brsr/constants";
import { useAssignmentStats } from "../hooks/useAssignmentStats";
import { useAssignments } from "../hooks/useAssignments";

type UserOption = {
  id: string;
  email: string | null;
  display_name: string | null;
};

export function AdminWorkspaceClient({ users }: { users: UserOption[] }) {
  const [reportingYear, setReportingYear] = useState(REPORTING_YEARS[0]);
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id ?? "");
  const [activePanel, setActivePanel] = useState<PanelId>("generaldata");

  const { stats, loading: loadingStats, error: statsError, reload: reloadStats } =
    useAssignmentStats(reportingYear);

  const {
    selectedCodes,
    loading: loadingAssignments,
    saving: savingAssignments,
    error: assignError,
    success,
    toggleBlock,
    confirmAssignments,
  } = useAssignments(selectedUserId);

  const error = statsError ?? assignError;

  const assignmentBlocksForActivePanel = useMemo(
    () => getAssignmentBlocksForPanel(activePanel),
    [activePanel]
  );

  const selectedBlockCount = useMemo(
    () =>
      assignmentBlocksForActivePanel.filter((block) =>
        block.questionCodes.every((code) => selectedCodes.has(code))
      ).length,
    [assignmentBlocksForActivePanel, selectedCodes]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[#334155] bg-[#1e293b] p-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Completion statistics</h2>
            <p className="text-sm text-gray-400">Track completion against assigned questions.</p>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase text-gray-400">Reporting year</label>
            <select
              value={reportingYear}
              onChange={(e) => setReportingYear(e.target.value)}
              className="mt-1 rounded border border-[#334155] bg-[#111827] px-3 py-2 text-sm text-white"
            >
              {REPORTING_YEARS.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {loadingStats ? (
          <p className="mt-4 text-sm text-gray-400">Loading statistics...</p>
        ) : (
          <>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded border border-[#334155] bg-[#111827] p-3">
                <p className="text-xs uppercase text-gray-400">Assigned</p>
                <p className="mt-1 text-2xl font-semibold text-white">{stats?.totals.assigned_count ?? 0}</p>
              </div>
              <div className="rounded border border-[#334155] bg-[#111827] p-3">
                <p className="text-xs uppercase text-gray-400">Completed</p>
                <p className="mt-1 text-2xl font-semibold text-white">{stats?.totals.completed_count ?? 0}</p>
              </div>
              <div className="rounded border border-[#334155] bg-[#111827] p-3">
                <p className="text-xs uppercase text-gray-400">Completion</p>
                <p className="mt-1 text-2xl font-semibold text-white">{stats?.totals.completion_pct ?? 0}%</p>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded border border-[#334155]">
              <table className="min-w-full divide-y divide-[#334155]">
                <thead className="bg-[#111827]">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-400">User</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-400">Assigned</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-400">Completed</th>
                    <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-400">Completion %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155] bg-[#1e293b]">
                  {(stats?.per_user ?? []).map((row) => (
                    <tr key={row.user_id}>
                      <td className="px-3 py-2 text-sm text-gray-200">
                        {row.display_name || row.email || "User"}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-300">{row.assigned_count}</td>
                      <td className="px-3 py-2 text-sm text-gray-300">{row.completed_count}</td>
                      <td className="px-3 py-2 text-sm text-gray-300">{row.completion_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      <section className="rounded-lg border border-[#334155] bg-[#1e293b] p-4">
        <h2 className="text-lg font-semibold text-white">Assign users to questions</h2>
        <p className="text-sm text-gray-400">
          Select a user, choose a section block, then click question blocks and confirm.
        </p>

        <div className="mt-4">
          <label className="block text-xs font-medium uppercase text-gray-400">User</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="mt-1 w-full rounded border border-[#334155] bg-[#111827] px-3 py-2 text-sm text-white md:w-96"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.display_name || u.email || u.id}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[260px_1fr]">
          <div className="rounded border border-[#334155] bg-[#111827] p-2">
            <p className="px-2 py-1 text-xs uppercase text-gray-400">Sections</p>
            <div className="space-y-1">
              {PANELS.map((panel) => (
                <button
                  key={panel.id}
                  type="button"
                  onClick={() => setActivePanel(panel.id)}
                  className={`w-full rounded px-2 py-2 text-left text-sm ${
                    activePanel === panel.id
                      ? "bg-blue-600 font-medium text-white"
                      : "text-gray-300 hover:bg-[#1f2937]"
                  }`}
                >
                  {panel.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded border border-[#334155] bg-[#111827] p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">
                {PANELS.find((p) => p.id === activePanel)?.label ?? "Questions"}
              </p>
              <p className="text-xs text-gray-400">Selected blocks: {selectedBlockCount}</p>
            </div>
            {loadingAssignments ? (
              <p className="text-sm text-gray-400">Loading assignments...</p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {assignmentBlocksForActivePanel.map((block) => {
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
                      onClick={() => toggleBlock(block.questionCodes)}
                      className={`flex items-center justify-between rounded border px-2 py-2 text-left text-sm ${
                        checked
                          ? "border-blue-500 bg-blue-500/10 text-blue-200"
                          : partial
                            ? "border-amber-500 bg-amber-500/10 text-amber-200"
                            : "border-[#334155] text-gray-300 hover:bg-[#1f2937]"
                      }`}
                    >
                      <span className="truncate">{block.label}</span>
                      <span className="ml-2 text-xs">
                        {checked ? "✓" : partial ? `${selectedCount}/${block.questionCodes.length}` : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => confirmAssignments(reloadStats)}
            disabled={!selectedUserId || savingAssignments}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {savingAssignments ? "Saving..." : "Confirm Assignment"}
          </button>
          {success && <p className="text-sm text-emerald-400">{success}</p>}
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
      </section>
    </div>
  );
}
