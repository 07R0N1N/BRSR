"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
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
      email,
      password,
    });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role_id, roles(slug)")
      .eq("id", user.id)
      .single();
    const rolesData = (profile as { roles?: { slug: string } | { slug: string }[] } | null)?.roles;
    const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
    const redirectPath = roleSlug === "master" ? "/master" : "/dashboard";
    // #region agent log
    fetch("http://127.0.0.1:7762/ingest/58fab4a8-b32e-4ce2-b25a-ed83ca637c06", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "548a71" }, body: JSON.stringify({ sessionId: "548a71", runId: "login", hypothesisId: "H1_H2_H3", location: "app/login/page.tsx:redirect", message: "Login profile and redirect", data: { hasProfile: !!profile, profileError: profileError?.message ?? null, rolesDataType: Array.isArray(rolesData) ? "array" : typeof rolesData, rolesDataRaw: rolesData, roleSlug, redirectPath }, timestamp: Date.now() }) }).catch(() => {});
    // #endregion
    if (roleSlug === "master") {
      router.push("/master");
      router.refresh();
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f12] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,#1e293b,#0a0f12)]">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-[#334155] bg-[#1a202c] p-8 shadow-lg">
        <div className="flex flex-col items-center gap-3">
          <span className="text-3xl leading-none" aria-hidden>📊</span>
          <h1 className="text-center text-2xl font-semibold text-white">
            BRSR Data Collection
          </h1>
        </div>
        <p className="text-center text-sm text-gray-400">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-[#334155] bg-[#0a0f12] px-3 py-2 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="block w-full rounded-md border border-[#334155] bg-[#0a0f12] py-2 pl-3 pr-10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a202c] disabled:opacity-60 disabled:pointer-events-none"
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
        <p className="text-center text-xs text-gray-500">
          Forgot password? Contact your administrator.
        </p>
      </div>
    </div>
  );
}
