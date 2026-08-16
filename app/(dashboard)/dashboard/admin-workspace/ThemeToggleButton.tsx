"use client";

/**
 * Icon-button treatment ported from the mock's `#theme-toggle` (see
 * Archive 1/workflow-mockup/admin-assign-tier1.html) — same sun/moon SVGs,
 * same swap-on-click behavior. Must render inside AdminWorkspaceThemeWrapper.
 */

import { useAdminWorkspaceTheme } from "./ThemeWrapper";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.6M12 18.9v2.6M4.6 4.6l1.85 1.85M17.55 17.55l1.85 1.85M2.5 12h2.6M18.9 12h2.6M4.6 19.4l1.85-1.85M17.55 6.45l1.85-1.85" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.4 14.7A8.4 8.4 0 1 1 9.3 3.6a6.6 6.6 0 0 0 11.1 11.1z" />
    </svg>
  );
}

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useAdminWorkspaceTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
