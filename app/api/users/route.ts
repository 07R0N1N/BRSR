import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeEmail, normalizePassword } from "@/lib/auth/normalize";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await supabase
    .from("profiles")
    .select("roles(slug)")
    .eq("id", currentUser.id)
    .single();
  const slug = (profile.data as { roles?: { slug: string } } | null)?.roles?.slug;
  if (slug !== "master") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const email = normalizeEmail(body.email as string | undefined);
  const password = normalizePassword(body.password as string | undefined);
  let org_id = (body.org_id as string | null) || null;
  const role_id = body.role_id as string;
  if (!email || !password || !role_id) {
    return NextResponse.json(
      { error: "Email, password, and role are required" },
      { status: 400 }
    );
  }
  const admin = createAdminClient();

  const { data: newUser, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }
  if (!newUser.user) {
    return NextResponse.json({ error: "User not created" }, { status: 500 });
  }
  const { error: profileError } = await admin.from("profiles").insert({
    id: newUser.user.id,
    email,
    org_id,
    role_id,
    created_by: currentUser.id,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(newUser.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, user_id: newUser.user.id });
}

/**
 * DELETE /api/users
 *
 * Master may delete any non-master/admin user in any org (existing behavior).
 * Admin may additionally delete "user"-role members of their own org only —
 * this is the Admin Workspace "Manage Users" remove action. Neither role can
 * delete master/admin accounts or themselves, so no path here can be used to
 * remove the caller's own access or another admin's.
 */
export async function DELETE(request: Request) {
  // "assignments" mode already allows admin (own org, any onboarding state)
  // or master — the same tier as the rest of the Admin Workspace.
  const access = await requireAppAccess("assignments");
  if (!access.ok) return access.response;
  const { supabase, user: currentUser, ctx } = access;
  const roleSlug = ctx.roleSlug;
  if (roleSlug !== "admin" && roleSlug !== "master") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "User id required" }, { status: 400 });
  }
  if (id === currentUser.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  const { data: targetProfile } = await supabase
    .from("profiles")
    .select("id, org_id, roles(slug)")
    .eq("id", id)
    .single();
  if (!targetProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const targetData = targetProfile as {
    id: string;
    org_id: string | null;
    roles?: { slug: string } | { slug: string }[];
  };
  const targetRolesData = targetData.roles;
  const targetSlug = Array.isArray(targetRolesData) ? targetRolesData[0]?.slug : targetRolesData?.slug;
  if (targetSlug === "master" || targetSlug === "admin") {
    return NextResponse.json({ error: "Cannot delete master or admin users" }, { status: 400 });
  }
  if (roleSlug === "admin" && targetData.org_id !== ctx.orgId) {
    return NextResponse.json({ error: "Cannot delete users outside your organization" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { error: deleteError } = await admin.auth.admin.deleteUser(id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
