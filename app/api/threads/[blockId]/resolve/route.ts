import { NextResponse } from "next/server";
import { requireAppAccess } from "@/lib/auth/requireAppAccess";
import { isMaster } from "@/lib/auth/accessPolicy";
import { ensureThreadRow, isRlsForbidden, resolveBlockMeta } from "@/lib/collaboration/threads";

type RouteContext = { params: { blockId: string } };

/**
 * PATCH /api/threads/[blockId]/resolve
 * Body: { org_id, reporting_year, resolved: boolean }
 * Admin/master only.
 */
export async function PATCH(request: Request, context: RouteContext) {
  const access = await requireAppAccess("data");
  if (!access.ok) return access.response;
  const { supabase, user, ctx } = access;

  if (!isMaster(ctx.roleSlug) && ctx.roleSlug !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const blockId = decodeURIComponent(context.params.blockId);
  if (!resolveBlockMeta(blockId)) {
    return NextResponse.json({ error: "Unknown block" }, { status: 404 });
  }

  const body = await request.json();
  const org_id = body.org_id as string | undefined;
  const reporting_year = (body.reporting_year as string | undefined)?.trim();
  if (!org_id || !reporting_year) {
    return NextResponse.json(
      { error: "org_id and reporting_year are required" },
      { status: 400 }
    );
  }
  if (typeof body.resolved !== "boolean") {
    return NextResponse.json({ error: "resolved boolean is required" }, { status: 400 });
  }

  const ensured = await ensureThreadRow(supabase, {
    orgId: org_id,
    reportingYear: reporting_year,
    blockId,
  });
  if (ensured.notFound) {
    return NextResponse.json({ error: "Unknown block" }, { status: 404 });
  }
  if (ensured.error || !ensured.data) {
    if (ensured.error && isRlsForbidden({ message: ensured.error })) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { error: ensured.error ?? "Failed to ensure thread" },
      { status: 400 }
    );
  }

  const patch = body.resolved
    ? {
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
      }
    : {
        resolved_at: null,
        resolved_by: null,
      };

  const { data: thread, error } = await supabase
    .from("question_threads")
    .update(patch)
    .eq("id", ensured.data.id)
    .select("*")
    .single();

  if (error) {
    if (isRlsForbidden(error)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ thread });
}
