import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { scout } from "@/lib/scout";
import { notify } from "@/lib/telegram";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/*
  The morning digest.

  Runs once a day, collects whatever appeared on the feeds overnight, and
  sends a numbered list to Telegram. Replying with a number marks that topic
  as picked; the deck still gets written by hand afterwards, because a
  model-written breakdown is the one thing this brand can't ship.

  Same auth as the publish cron.
*/

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const found = await scout();

  if (!found.length) {
    /*
      Silent on empty. A daily "nothing today" message trains you to ignore
      the channel, which is the one thing a digest cannot afford.
    */
    return NextResponse.json({ found: 0, message: "nothing new" });
  }

  const supabase = db();
  const { data: rows } = await supabase
    .from("topics")
    .select("id, source, channel, title, url")
    .in("url", found.map((f) => f.url))
    .order("found_at", { ascending: false });

  const esc = (s: string) =>
    s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);

  const icon = (source: string) => (source === "youtube" ? "▶" : "■");

  const lines = (rows ?? []).map(
    (r, i) =>
      `<b>${i + 1}.</b> ${icon(r.source)} <i>${esc(r.channel)}</i>\n` +
      `<a href="${r.url}">${esc(r.title)}</a>`,
  );

  await notify(
    `☕ <b>Today's shortlist</b> — ${lines.length} new\n\n` +
      lines.join("\n\n") +
      `\n\n<i>Reply</i> <code>pick 3</code> <i>to choose one. I'll research it and send back the deck and PDF.</i>`,
  );

  return NextResponse.json({ found: found.length });
}
