import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

type UserEntry = {
  email: string;
  password: string;
  display_name?: string;
};

async function getAdminOrgAndRole(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, orgId: null, slug: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, roles(slug)")
    .eq("id", user.id)
    .single();

  const profileData = profile as { org_id: string | null; roles?: { slug: string } | { slug: string }[] } | null;
  const rolesData = profileData?.roles;
  const slug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  return { user, orgId: profileData?.org_id ?? null, slug };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { user, orgId, slug } = await getAdminOrgAndRole(supabase);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (slug !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!orgId) return NextResponse.json({ error: "No organization assigned to your account" }, { status: 400 });

  // fetch the normal role id
  const { data: normalRole } = await supabase
    .from("roles")
    .select("id")
    .eq("slug", "normal")
    .single();
  const normalRoleId = (normalRole as { id: string } | null)?.id;
  if (!normalRoleId) {
    return NextResponse.json({ error: "Normal role not found" }, { status: 500 });
  }

  const body = await request.json();
  const entries: UserEntry[] = Array.isArray(body) ? body : [body];

  if (entries.length === 0) {
    return NextResponse.json({ error: "No users provided" }, { status: 400 });
  }

  const admin = createAdminClient();
  const results: { email: string; ok: boolean; error?: string; user_id?: string }[] = [];

  for (const entry of entries) {
    const email = entry.email?.trim();
    const password = entry.password;
    const displayName = entry.display_name?.trim() || null;

    if (!email || !password) {
      results.push({ email: email ?? "", ok: false, error: "Email and password are required" });
      continue;
    }

    const { data: newUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      results.push({ email, ok: false, error: authError.message });
      continue;
    }

    if (!newUser.user) {
      results.push({ email, ok: false, error: "User not created" });
      continue;
    }

    const { error: profileError } = await admin.from("profiles").insert({
      id: newUser.user.id,
      email,
      display_name: displayName,
      org_id: orgId,
      role_id: normalRoleId,
      created_by: user.id,
    });

    if (profileError) {
      await admin.auth.admin.deleteUser(newUser.user.id);
      results.push({ email, ok: false, error: profileError.message });
      continue;
    }

    results.push({ email, ok: true, user_id: newUser.user.id });
  }

  const allOk = results.every((r) => r.ok);
  return NextResponse.json({ ok: allOk, results }, { status: allOk ? 200 : 207 });
}
