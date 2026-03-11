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
  const name = body.name as string | undefined;
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const { error } = await supabase.from("organizations").insert({
    name: name.trim(),
    plan_tier: (body.plan_tier as string)?.trim() || null,
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
    return NextResponse.json({ error: "Organization id required" }, { status: 400 });
  }
  const { error } = await supabase.from("organizations").delete().eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
