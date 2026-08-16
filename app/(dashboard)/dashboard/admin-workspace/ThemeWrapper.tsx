"use client";

/**
 * Theme mechanism for the Admin Workspace route only. Owns the light/dark
 * state, applies `data-theme` to the `.admin-workspace-theme` wrapper div
 * (see globals.css for the scoped CSS variables that key off it), and
 * persists the choice to localStorage. Ported from the toggle in
 * Archive 1/workflow-mockup/admin-assign-tier1.html, which flips
 * `document.documentElement.dataset.theme` directly — here the same
 * attribute is scoped to this wrapper instead of `<html>` so nothing
 * outside `/dashboard/admin-workspace` can be affected.
 *
 * Stats/Assign/the header now read these variables (see page.tsx and
 * AdminWorkspaceClient.tsx), so the wrapper's own background must resolve
 * from `--bg` too instead of the old hardcoded dark-only `#0a0f12`.
 */

import localFont from "next/font/local";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Self-hosted Inter (via next/font/local), not next/font/google. The Google
 * variant's CSS request succeeds but the woff2 download from fonts.gstatic.com
 * times out in this environment, so `next/font/google` silently falls back to
 * a system font with an empty --font-inter variable. Bundling the static
 * files removes that network dependency so the font can't fail to load again
 * in dev, CI, or prod. Files sourced from @fontsource/inter 5.3.0 (latin,
 * normal) and copied into app/fonts/inter/.
 */
const inter = localFont({
  src: [
    { path: "../../../fonts/inter/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../../../fonts/inter/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../../../fonts/inter/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../../../fonts/inter/inter-700.woff2", weight: "700", style: "normal" },
    { path: "../../../fonts/inter/inter-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "admin-workspace-theme";

const AdminWorkspaceThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function useAdminWorkspaceTheme() {
  const ctx = useContext(AdminWorkspaceThemeContext);
  if (!ctx) {
    throw new Error("useAdminWorkspaceTheme must be used within AdminWorkspaceThemeWrapper");
  }
  return ctx;
}

export function AdminWorkspaceThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <AdminWorkspaceThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${inter.variable} admin-workspace-theme min-h-screen bg-[var(--bg)]`} data-theme={theme}>
        {children}
      </div>
    </AdminWorkspaceThemeContext.Provider>
  );
}
