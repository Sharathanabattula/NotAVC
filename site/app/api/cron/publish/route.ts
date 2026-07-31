import { NextResponse } from "next/server";
import { db, type Post } from "@/lib/supabase";
import { publisherFor } from "@/lib/publish";
import { notify } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/*
  The scheduler. Vercel Cron hits this every 5 minutes; it publishes every
  approved post whose time has come.

  Two rules keep it safe to run on a schedule:
  1. Only 'approved' posts are eligible — nothing publishes without Sharath
     having said yes in Telegram first.
  2. The status flips to 'publishing' before the network call, so an
     overlapping run cannot pick up the same row and post it twice.
*/

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = db();

  const { data: due, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "approved")
    .not("scheduled_for", "is", null)
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: true })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!due?.length) {
    /*
      Nothing to do, so report whether this deployment could publish if
      something were due. Without this, a credential missing in production
      only surfaces as a failed attempt at the scheduled minute.

      Booleans only — never the values, and never their length. This runs
      behind the same CRON_SECRET as the rest of the route.
    */
    return NextResponse.json({
      published: 0,
      message: "nothing due",
      ready: {
        instagram: Boolean(process.env.IG_TOKEN && process.env.IG_USER_ID),
        linkedin: Boolean(process.env.LI_TOKEN && process.env.LI_PERSON_ID),
      },
    });
  }

  const results: Array<{ id: string; ok: boolean; detail: string }> = [];

  for (const post of due as Post[]) {
    // Claim the row. If another run already moved it, skip.
    const { data: claimed } = await supabase
      .from("posts")
      .update({ status: "publishing", attempts: post.attempts + 1 })
      .eq("id", post.id)
      .eq("status", "approved")
      .select("id")
      .maybeSingle();

    if (!claimed) {
      results.push({ id: post.id, ok: false, detail: "claimed by another run" });
      continue;
    }

    try {
      const { externalId, url } = await publisherFor(post.channel)(post);
      await supabase
        .from("posts")
        .update({
          status: "published",
          external_id: externalId,
          external_url: url,
          posted_at: new Date().toISOString(),
          last_error: null,
        })
        .eq("id", post.id);

      results.push({ id: post.id, ok: true, detail: url ?? externalId });
      await notify(`✅ Published to ${post.channel}\n${url ?? externalId}`);
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      // Back to 'approved' so the next run retries, unless it has failed
      // repeatedly — then park it and ask a human.
      const exhausted = post.attempts + 1 >= 3;
      await supabase
        .from("posts")
        .update({ status: exhausted ? "failed" : "approved", last_error: detail })
        .eq("id", post.id);

      results.push({ id: post.id, ok: false, detail });
      await notify(
        `⚠️ ${post.channel} publish failed (attempt ${post.attempts + 1}/3)\n${detail}`,
      );
    }
  }

  return NextResponse.json({
    published: results.filter((r) => r.ok).length,
    results,
  });
}
