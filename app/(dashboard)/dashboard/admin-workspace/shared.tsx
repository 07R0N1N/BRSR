/**
 * Shared visual tokens and small presentational pieces for the Admin
 * Workspace tabs (AdminWorkspaceClient, ManageUsersPanel). Avatar chips
 * live in `@/components/Avatar` so the questionnaire authorship UI and
 * Admin Workspace share one implementation.
 */

export type UserOption = {
  id: string;
  email: string | null;
  display_name: string | null;
};

export { AvatarChip, userLabel, AvatarStack } from "@/components/Avatar";

export const cardClass =
  "rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-7 shadow-[var(--shadow-md)]";
export const captionClass = "text-[11.5px] font-bold uppercase tracking-wide text-[var(--text-muted)]";
export const ghostBtnClass =
  "rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-45";
