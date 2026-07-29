import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/supabase";
import { sendCarousel } from "@/lib/telegram";
import type { Slide } from "@/lib/slides";
import type { IconName } from "@/lib/icons";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/*
  Compose a platter by hand.

  This is the path that costs nothing: Sharath writes the words, the machine
  renders the artwork, schedules it, sends the approval card and publishes.
  The drafting API is optional and this route never touches it.

  Fields map onto the seven-slide carousel so nobody has to think about
  slide kinds while writing. The correction is required — a carousel
  without one is not a NotAVC post, and that rule lives in code rather than
  in a style guide precisely so it cannot quietly lapse.
*/

type Body = {
  desk: string;
  title: string;
  coverTitle: string;
  coverSub?: string;
  setup: string;
  numberLabel: string;
  numberValue: string;
  numberNote?: string;
  icon?: IconName;
  tiers: { k: string; v: string }[];
  wrong: string[];
  right: string;
  finding: string;
  linkedin: string;
  instagram: string;
  hashtags: string[];
  sources: { url: string; title: string }[];
  linkedinAt: string;
  instagramAt: string;
};

export async function POST(request: Request) {
  const jar = await cookies();
  if (jar.get("notavc_studio")?.value !== process.env.STUDIO_SESSION_TOKEN) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let b: Body;
  try {
    b = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const wrong = (b.wrong ?? []).map((l) => l.trim()).filter(Boolean);
  if (!wrong.length || !b.right?.trim()) {
    return NextResponse.json(
      { error: "The correction is required — that's the whole post." },
      { status: 400 },
    );
  }
  if (!b.coverTitle?.trim() || !b.linkedin?.trim()) {
    return NextResponse.json(
      { error: "Cover title and LinkedIn caption are required." },
      { status: 400 },
    );
  }

  const supabase = db();

  // EP numbers run sequentially across the whole archive
  const { data: last } = await supabase
    .from("platters")
    .select("ep")
    .order("ep", { ascending: false })
    .limit(1)
    .maybeSingle();
  const ep = `EP.${String(Number(last?.ep?.replace(/\D/g, "") ?? 0) + 1).padStart(3, "0")}`;

  const slides: Slide[] = [
    {
      kind: "cover",
      ep,
      desk: b.desk,
      title: b.coverTitle.trim(),
      sub: b.coverSub?.trim() || undefined,
    },
    { kind: "statement", label: "The setup", body: b.setup.trim() },
    {
      kind: "number",
      label: b.numberLabel.trim(),
      value: b.numberValue.trim(),
      note: b.numberNote?.trim() || undefined,
      icon: b.icon,
    },
    {
      kind: "list",
      label: "How to read it",
      items: (b.tiers ?? []).filter((t) => t.k?.trim() && t.v?.trim()),
    },
    { kind: "correction", wrong, right: b.right.trim() },
    { kind: "statement", label: "What I found", body: b.finding.trim() },
    {
      kind: "cta",
      heading: "Still not a VC.",
      sub: "Teardowns, term sheets, and the one number everyone skips.",
      handle: "@notavc.co",
    },
  ];

  const { data: platter, error: platterErr } = await supabase
    .from("platters")
    .insert({
      ep,
      title: b.title?.trim() || b.coverTitle.trim(),
      desk: b.desk,
      publish_date: new Date().toISOString().slice(0, 10),
      status: "pending_approval",
      brief: "Written by hand in Studio.",
    })
    .select("id")
    .single();

  if (platterErr || !platter) {
    return NextResponse.json({ error: platterErr?.message ?? "insert failed" }, { status: 500 });
  }

  const sources = (b.sources ?? []).filter((s) => s.url?.trim());
  if (sources.length) {
    await supabase.from("sources").insert(
      sources.map((s) => ({
        platter_id: platter.id,
        url: s.url.trim(),
        title: s.title?.trim() || s.url.trim(),
      })),
    );
  }

  const { data: posts, error: postsErr } = await supabase
    .from("posts")
    .insert([
      {
        platter_id: platter.id,
        channel: "linkedin",
        format: "post",
        caption: b.linkedin.trim(),
        hashtags: b.hashtags ?? [],
        slides: [],
        scheduled_for: b.linkedinAt || null,
        status: "pending_approval",
      },
      {
        platter_id: platter.id,
        channel: "instagram",
        format: "carousel",
        caption: (b.instagram || b.linkedin).trim(),
        hashtags: b.hashtags ?? [],
        slides,
        scheduled_for: b.instagramAt || null,
        status: "pending_approval",
      },
    ])
    .select("id, channel, format, caption, scheduled_for, slides");

  if (postsErr || !posts) {
    return NextResponse.json({ error: postsErr?.message ?? "insert failed" }, { status: 500 });
  }

  /*
    Instagram fetches media from these URLs at publish time, so they must be
    absolute and publicly reachable — a relative path fails at Meta's end,
    not here, which makes it painful to debug later.
  */
  const origin = process.env.SITE_URL ?? new URL(request.url).origin;
  let telegramSent = false;

  for (const post of posts) {
    const count = Array.isArray(post.slides) ? post.slides.length : 0;
    const urls =
      post.channel === "instagram" && count
        ? Array.from(
            { length: count },
            (_, i) => `${origin.replace(/\/$/, "")}/api/og/slide?post=${post.id}&i=${i}`,
          )
        : [];

    if (urls.length) {
      await supabase.from("posts").update({ media_urls: urls }).eq("id", post.id);
    }

    const sent = await sendCarousel({
      postId: post.id,
      ep,
      channel: post.channel,
      format: post.format,
      caption: post.caption,
      scheduledFor: post.scheduled_for,
      sources,
      imageUrls: urls,
    });
    telegramSent = telegramSent || sent;
  }

  return NextResponse.json({
    ok: true,
    ep,
    platterId: platter.id,
    telegramSent,
    message: telegramSent
      ? `${ep} created. Approval card sent to Telegram.`
      : `${ep} created. Telegram is not configured — approve it here instead.`,
  });
}
