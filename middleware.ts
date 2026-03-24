import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canUseApp, isMaster, redirectForIncompleteApp } from "@/lib/auth/accessPolicy";

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
  const isMasterPath = path.startsWith("/master");
  const isDashboard = path.startsWith("/dashboard");
  const isOnboarding = path === "/onboarding" || path.startsWith("/onboarding/");
  const isRoot = path === "/";

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
    .select("role_id, org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profileRes.data as { org_id?: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const rolesData = profileData?.roles;
  const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  const orgId = profileData?.org_id ?? null;

  let onboardingComplete: boolean | null = null;
  if (orgId) {
    const { data: orgRow } = await supabase
      .from("organizations")
      .select("onboarding_complete")
      .eq("id", orgId)
      .single();
    onboardingComplete = (orgRow as { onboarding_complete?: boolean } | null)?.onboarding_complete ?? null;
  }

  const ctx = {
    roleSlug: roleSlug ?? null,
    orgId,
    onboardingComplete: orgId ? onboardingComplete : null,
  };

  if (isLogin) {
    const url = request.nextUrl.clone();
    if (isMaster(roleSlug ?? null)) {
      url.pathname = "/master";
    } else if (canUseApp(ctx)) {
      url.pathname = "/dashboard";
    } else {
      url.pathname = redirectForIncompleteApp(ctx);
    }
    return NextResponse.redirect(url);
  }

  if (isMasterPath && !isMaster(roleSlug ?? null)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (isDashboard && isMaster(roleSlug ?? null)) {
    const url = request.nextUrl.clone();
    url.pathname = "/master";
    return NextResponse.redirect(url);
  }

  if (isOnboarding && canUseApp(ctx)) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if ((isDashboard || isRoot) && !isMaster(roleSlug ?? null) && !canUseApp(ctx)) {
    const url = request.nextUrl.clone();
    url.pathname = redirectForIncompleteApp(ctx);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/", "/login", "/onboarding", "/onboarding/:path*", "/dashboard/:path*", "/master/:path*"],
};
