import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";

/**
 * Org roster for authorship UI (includes admins).
 * Distinct from GET /api/assignments, which excludes admins because they are
 * not assignable — here we need every profile that might appear in
 * answers.updated_by, including the admin who edited a field.
 */
export async function GET() {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, ctx } = access;

  const orgId = ctx.orgId;
  if (!orgId) {
    return NextResponse.json({ error: "Organization not available" }, { status: 400 });
  }

  const { data: members, error } = await supabase
    .from("profiles")
    .select("id, email, display_name, roles(slug)")
    .eq("org_id", orgId)
    .order("email");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const users = (members ?? []).map((row) => {
    const roles = row.roles as { slug: string } | { slug: string }[] | null;
    const roleSlug = Array.isArray(roles) ? roles[0]?.slug : roles?.slug;
    return {
      id: row.id as string,
      email: (row.email as string | null) ?? null,
      display_name: (row.display_name as string | null) ?? null,
      role_slug: roleSlug ?? null,
    };
  });

  return NextResponse.json({ org_id: orgId, users });
}
