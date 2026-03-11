import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
  const email = (body.email as string)?.trim();
  const password = body.password as string;
  const org_id = body.org_id as string | null;
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
    org_id: org_id || null,
    role_id,
    created_by: currentUser.id,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(newUser.user.id);
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true, user_id: newUser.user.id });
}

export async function DELETE(request: Request) {
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
  const rolesData = (profile.data as { roles?: { slug: string } | { slug: string }[] } | null)?.roles;
  const slug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  if (slug !== "master") {
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
    .select("id, roles(slug)")
    .eq("id", id)
    .single();
  if (!targetProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const targetRolesData = (targetProfile as { roles?: { slug: string } | { slug: string }[] }).roles;
  const targetSlug = Array.isArray(targetRolesData) ? targetRolesData[0]?.slug : targetRolesData?.slug;
  if (targetSlug === "master" || targetSlug === "admin") {
    return NextResponse.json({ error: "Cannot delete master or admin users" }, { status: 400 });
  }
  const admin = createAdminClient();
  const { error: deleteError } = await admin.auth.admin.deleteUser(id);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
