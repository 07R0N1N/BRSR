/**
 * Helpers for restricted users: which question codes they can see/edit.
 * When allowedSet is null, everything is allowed (admin/master).
 */

export function isAllowed(code: string, allowedSet: Set<string> | null): boolean {
  return allowedSet === null || allowedSet.has(code);
}

export function filterByAllowed(codes: string[], allowedSet: Set<string> | null): string[] {
  if (allowedSet === null) return codes;
  return codes.filter((c) => allowedSet.has(c));
}

/** True if the subsection (codes) should be shown: no restriction or at least one code is allowed */
export function sectionHasAnyAllowed(codes: string[], allowedSet: Set<string> | null): boolean {
  if (allowedSet === null) return true;
  return codes.some((c) => allowedSet.has(c));
}

/**
 * True when no restriction is active, or at least one assigned code starts with `prefix`.
 * Used to gate entire question blocks inside principle panels.
 */
export function blockAllowed(prefix: string, allowedSet: Set<string> | null | undefined): boolean {
  if (allowedSet == null) return true;
  return Array.from(allowedSet).some((code) => code.startsWith(prefix));
}
