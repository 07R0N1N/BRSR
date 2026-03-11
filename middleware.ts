import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isLogin = path === "/login";
  const isMaster = path.startsWith("/master");
  const isDashboard = path.startsWith("/dashboard");

  if (!user) {
    if (!isLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const profileRes = await supabase
    .from("profiles")
    .select("role_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const rolesData = (profileRes.data as { roles?: { slug: string } | { slug: string }[] } | null)?.roles;
  const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  const redirectTarget = isLogin ? (roleSlug === "master" ? "/master" : "/dashboard") : isDashboard && roleSlug === "master" ? "/master" : null;
  // #region agent log
  fetch("http://127.0.0.1:7762/ingest/58fab4a8-b32e-4ce2-b25a-ed83ca637c06", { method: "POST", headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "548a71" }, body: JSON.stringify({ sessionId: "548a71", runId: "middleware", hypothesisId: "H1_H4_H5", location: "middleware.ts:roleRedirect", message: "Middleware profile and redirect", data: { path, hasUser: !!user, profileError: profileRes.error?.message ?? null, rolesDataType: Array.isArray(rolesData) ? "array" : typeof rolesData, rolesDataRaw: rolesData, roleSlug, redirectTarget }, timestamp: Date.now() }) }).catch(() => {});
  // #endregion

  if (isLogin) {
    const url = request.nextUrl.clone();
    url.pathname = roleSlug === "master" ? "/master" : "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isMaster && roleSlug !== "master") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isDashboard && roleSlug === "master") {
    const url = request.nextUrl.clone();
    url.pathname = "/master";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/master/:path*"],
};
