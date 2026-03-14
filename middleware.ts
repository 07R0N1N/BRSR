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
    .select("role_id, org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profileRes.data as { org_id?: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const rolesData = profileData?.roles;
  const roleSlug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  const orgId = profileData?.org_id ?? null;
  if (isLogin) {
    const url = request.nextUrl.clone();
    // Admins with no org go to / so root page can create org and redirect to onboarding
    const redirectPath =
      roleSlug === "master"
        ? "/master"
        : roleSlug === "admin" && !orgId
          ? "/"
          : "/dashboard";
    url.pathname = redirectPath;
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
