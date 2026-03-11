"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    setLoading(false);
    if (signInError) {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-semibold text-gray-900">
          BRSR Data Collection
        </h1>
        <p className="text-center text-sm text-gray-500">
          Sign in to your account
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
