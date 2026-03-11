import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await supabase
    .from("profiles")
    .select("roles(slug)")
    .eq("id", user.id)
    .single();
  const slug = (profile.data as { roles?: { slug: string } } | null)?.roles?.slug;
  if (slug !== "master") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const name = (body.name as string)?.trim();
  const slugVal = (body.slug as string)?.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  if (!name || !slugVal) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }
  const { error } = await supabase.from("roles").insert({
    name,
    slug: slugVal,
    is_system: false,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const profile = await supabase
    .from("profiles")
    .select("roles(slug)")
    .eq("id", user.id)
    .single();
  const rolesData = (profile.data as { roles?: { slug: string } | { slug: string }[] } | null)?.roles;
  const slug = Array.isArray(rolesData) ? rolesData[0]?.slug : rolesData?.slug;
  if (slug !== "master") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Role id required" }, { status: 400 });
  }
  const { data: role } = await supabase.from("roles").select("slug").eq("id", id).single();
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }
  if (role.slug === "master" || role.slug === "admin") {
    return NextResponse.json({ error: "Cannot delete master or admin role" }, { status: 400 });
  }
  const { error } = await supabase.from("roles").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
