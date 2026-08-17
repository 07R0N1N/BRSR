"use client";

/**
 * App-wide light/dark theme mechanism. Originally built for the Admin
 * Workspace only (`.admin-workspace-theme`) and generalized here so Login
 * and the Dashboard questionnaire can share the exact same CSS-variable
 * system instead of duplicating a second copy of the token set.
 *
 * Owns the light/dark state, applies `data-theme` to the `.app-theme`
 * wrapper div (see globals.css for the scoped CSS variables that key off
 * it — never `:root`, so nothing outside a wrapped surface can read or
 * collide with these names), and persists the choice to localStorage
 * under one shared key so a preference set on one surface (e.g. Admin
 * Workspace) is honored on the others (Dashboard, Login) too.
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
    { path: "../../app/fonts/inter/inter-400.woff2", weight: "400", style: "normal" },
    { path: "../../app/fonts/inter/inter-500.woff2", weight: "500", style: "normal" },
    { path: "../../app/fonts/inter/inter-600.woff2", weight: "600", style: "normal" },
    { path: "../../app/fonts/inter/inter-700.woff2", weight: "700", style: "normal" },
    { path: "../../app/fonts/inter/inter-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
});

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "app-theme";

const AppThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
} | null>(null);

export function useAppTheme() {
  const ctx = useContext(AppThemeContext);
  if (!ctx) {
    throw new Error("useAppTheme must be used within AppThemeWrapper");
  }
  return ctx;
}

export function AppThemeWrapper({ children }: { children: ReactNode }) {
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
    <AppThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${inter.variable} app-theme min-h-screen bg-[var(--bg)]`} data-theme={theme}>
        {children}
      </div>
    </AppThemeContext.Provider>
  );
}
