/**
 * Shared visual tokens and small presentational pieces for the Admin
 * Workspace tabs (AdminWorkspaceClient, ManageUsersPanel). Kept in one file
 * so the color system and avatar styling stay identical across tabs instead
 * of drifting — see AdminWorkspaceClient's color-system comment for the
 * `.admin-workspace-theme` variable meanings.
 */

export type UserOption = {
  id: string;
  email: string | null;
  display_name: string | null;
};

export function userLabel(u: Pick<UserOption, "display_name" | "email" | "id">): string {
  return u.display_name || u.email || u.id;
}

/* Decorative avatar palette for user initials — deliberately excludes
   amber/red so it never collides with the partial-selection or error
   meaning of those hues. Purely a presentation layer over real
   display_name/email data, not new data. */
const AVATAR_PALETTE = ["#2f5bff", "#0fb5a0", "#8b5cf6", "#ec4899", "#06b6d4", "#6366f1"];
function colorForAvatar(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}
function initialsFor(label: string): string {
  return label
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
export function AvatarChip({ seed, label, size = "sm" }: { seed: string; label: string; size?: "sm" | "lg" }) {
  const dims = size === "lg" ? "h-[30px] w-[30px] text-[12px]" : "h-[22px] w-[22px] text-[10px]";
  return (
    <span
      className={`inline-grid flex-none place-items-center rounded-full font-bold text-white ${dims}`}
      style={{ background: colorForAvatar(seed) }}
    >
      {initialsFor(label)}
    </span>
  );
}

export const cardClass =
  "rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-7 shadow-[var(--shadow-md)]";
export const captionClass = "text-[11.5px] font-bold uppercase tracking-wide text-[var(--text-muted)]";
export const ghostBtnClass =
  "rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--ink)] hover:bg-[var(--surface-2)] disabled:cursor-not-allowed disabled:opacity-45";
