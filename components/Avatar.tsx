"use client";

/**
 * Shared avatar chip used by Admin Workspace and questionnaire authorship UI.
 * Moved out of admin-workspace/shared so dashboard panels can import without
 * pulling Admin Workspace modules.
 */

const AVATAR_PALETTE = ["#2f5bff", "#0fb5a0", "#8b5cf6", "#ec4899", "#06b6d4", "#6366f1"];

function colorForAvatar(seed: string): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function initialsFor(label: string): string {
  return label
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function userLabel(u: { display_name?: string | null; email?: string | null; id: string }): string {
  return u.display_name || u.email || u.id;
}

export function AvatarChip({
  seed,
  label,
  size = "sm",
  title,
}: {
  seed: string;
  label: string;
  size?: "sm" | "lg";
  title?: string;
}) {
  const dims = size === "lg" ? "h-[30px] w-[30px] text-[12px]" : "h-[22px] w-[22px] text-[10px]";
  return (
    <span
      title={title ?? label}
      className={`inline-grid flex-none place-items-center rounded-full font-bold text-white ${dims}`}
      style={{ background: colorForAvatar(seed) }}
    >
      {initialsFor(label)}
    </span>
  );
}

/** Stack up to `max` avatars; overflow shown as +N. */
export function AvatarStack({
  people,
  max = 3,
}: {
  people: { id: string; label: string }[];
  max?: number;
}) {
  if (people.length === 0) return null;
  const shown = people.slice(0, max);
  const overflow = people.length - shown.length;
  return (
    <span className="inline-flex items-center" title={people.map((p) => p.label).join(", ")}>
      {shown.map((p, i) => (
        <span key={p.id} className={i === 0 ? "" : "-ml-1.5"} style={{ zIndex: shown.length - i }}>
          <AvatarChip seed={p.id} label={p.label} />
        </span>
      ))}
      {overflow > 0 && (
        <span className="-ml-1.5 inline-grid h-[22px] w-[22px] flex-none place-items-center rounded-full bg-[var(--surface-2)] text-[9px] font-bold text-[var(--text-muted)] ring-1 ring-[var(--border-soft)]">
          +{overflow}
        </span>
      )}
    </span>
  );
}
