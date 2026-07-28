import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, type PostStatus } from "@/lib/supabase";
import { sendApprovalCard } from "@/lib/telegram";

export const dynamic = "force-dynamic";

/*
  Studio mutations. proxy.ts already gates /studio pages, but API routes
  are not covered by that matcher — an unauthenticated PATCH here would
  move posts toward publication, so the cookie is re-checked.
*/

const ALLOWED: PostStatus[] = [
  "draft",
  "pending_approval",
  "changes_requested",
  "approved",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const jar = await cookies();
  const session = jar.get("notavc_studio")?.value;
  if (!session || session !== process.env.STUDIO_SESSION_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json()) as {
    status?: PostStatus;
    scheduled_for?: string | null;
    notify?: boolean;
    resetAttempts?: boolean;
  };

  if (body.status && !ALLOWED.includes(body.status)) {
    return NextResponse.json(
      { error: `Status ${body.status} cannot be set from Studio` },
      { status: 400 },
    );
  }

  const supabase = db();
  const patch: Record<string, unknown> = {};
  if (body.status) patch.status = body.status;
  if (body.scheduled_for !== undefined) patch.scheduled_for = body.scheduled_for;
  if (body.resetAttempts) {
    patch.attempts = 0;
    patch.last_error = null;
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "nothing to update" }, { status: 400 });
  }

  const { data: post, error } = await supabase
    .from("posts")
    .update(patch)
    .eq("id", id)
    // Anything already live is out of Studio's reach — un-publishing is not
    // something this endpoint should be able to do.
    .not("status", "in", "(published,publishing)")
    .select("*")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!post) {
    return NextResponse.json(
      { error: "Post not found, or already published" },
      { status: 404 },
    );
  }

  if (body.notify) {
    const [{ data: platter }, { data: sources }] = await Promise.all([
      supabase.from("platters").select("ep").eq("id", post.platter_id).maybeSingle(),
      supabase.from("sources").select("title, url").eq("platter_id", post.platter_id),
    ]);

    const sent = await sendApprovalCard({
      postId: post.id,
      ep: platter?.ep ?? "EP.???",
      channel: post.channel,
      format: post.format,
      caption: post.caption,
      scheduledFor: post.scheduled_for,
      sources: sources ?? [],
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Status saved, but Telegram is not configured — card not sent" },
        { status: 502 },
      );
    }
  }

  return NextResponse.json({ post });
}
