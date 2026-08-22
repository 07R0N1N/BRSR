"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { normalizeEmail, normalizePassword } from "@/lib/auth/normalize";
import { AppThemeWrapper } from "@/components/theme/AppThemeWrapper";
import { ThemeToggleButton } from "@/components/theme/ThemeToggleButton";
import { ThemedBrandMark } from "@/components/theme/ThemedBrandMark";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(username),
      password: normalizePassword(password),
    });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id, org_id, roles(slug)")
      .eq("id", user.id)
      .single();
    const rolesData = (profile as { roles?: { slug: string } | { slug: string }[] } | null)?.roles;
    const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
    if (roleSlug === "master") {
      router.push("/master");
      router.refresh();
      return;
    }
    // Home + middleware apply onboarding gate; avoids duplicating policy here
    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      {/* Soft brand glow behind the card — same radial treatment as Hero/CTA
          (inline style: Tailwind arbitrary bg-[radial-gradient(...),var(--bg)]
          drops the fallback colour; see CTA.tsx). Opacity stays low so this
          stays a wash, not a second theme. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(700px 420px at 50% 50%, var(--brand), transparent 62%)",
          opacity: 0.16,
        }}
      />
      <div className="absolute right-6 top-6 z-[1]">
        <ThemeToggleButton />
      </div>
      <div className="relative z-[1] w-full max-w-md space-y-6 rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)]">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to homepage
        </Link>
        <div className="flex flex-col items-center gap-3">
          <ThemedBrandMark size={48} />
          <h1 className="text-center text-[22px] font-bold text-[var(--ink)]">
            BRSR Data Collection
          </h1>
        </div>
        <p className="text-center text-sm text-[var(--text-muted)]">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-[var(--text)]">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="mt-1 block w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--ink)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_var(--brand-50)]"
              placeholder="Your sign-in name"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--text)]">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--surface)] py-2 pl-3 pr-10 text-[var(--ink)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_var(--brand-50)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[var(--radius-sm)] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {error && (
            <p className="rounded-[var(--radius-sm)] bg-[var(--amber-50)] px-3 py-2 text-sm font-semibold text-[var(--red)]" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[var(--brand)] px-3 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] hover:bg-[var(--brand-600)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <p className="text-center text-xs text-[var(--text-muted)]">
          Forgot password? Contact your administrator.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AppThemeWrapper>
      <LoginForm />
    </AppThemeWrapper>
  );
}
