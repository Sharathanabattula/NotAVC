import { db } from "./supabase";
import { slidesToPdf } from "./publish";
import { sendDocument, sendAlbum, sendCopyable, notify } from "./telegram";
import type { Slide } from "./slides";

/*
  Everything a research deck needs, server-side.

  This is the cloud version of what used to be a per-deck node script run on
  a laptop: insert the platter, insert both posts, point media_urls at the
  render route, stitch the slides into a print-quality PDF, and push the PDF,
  the individual frames and both captions to Telegram.

  The scripts had to run locally because they read .env.local and called
  Telegram directly. Nothing here does — it runs wherever Vercel runs it.
*/

export type DeckSpec = {
  title: string;
  desk: string;
  slides: Slide[];
  captions: { linkedin: string; instagram: string };
  hashtags?: string[];
  sources?: { url: string; title: string }[];
  /* Instagram format. LinkedIn always posts as one document or image. */
  format?: "carousel" | "post";
  brief?: string;
  /*
    Platter id of a draft this replaces. Redrafting a deck is the normal
    case — three attempts at the same post shouldn't leave three platters in
    the archive.
  */
  replaces?: string;
};

export type BuiltDeck = {
  ep: string;
  platterId: string;
  instagramId: string;
  linkedinId: string;
  urls: string[];
};

export async function buildDeck(spec: DeckSpec, siteUrl: string): Promise<BuiltDeck> {
  const supabase = db();
  const site = siteUrl.replace(/\/$/, "");

  if (spec.replaces) {
    await supabase.from("posts").delete().eq("platter_id", spec.replaces);
    await supabase.from("sources").delete().eq("platter_id", spec.replaces);
    await supabase.from("platters").delete().eq("id", spec.replaces);
  }

  /* EP numbers no longer appear on the artwork but still order the archive */
  const { data: last } = await supabase
    .from("platters")
    .select("ep")
    .order("ep", { ascending: false })
    .limit(1)
    .maybeSingle();
  const ep = `EP.${String(Number(last?.ep?.replace(/\D/g, "") ?? 0) + 1).padStart(3, "0")}`;

  const { data: platter, error: pErr } = await supabase
    .from("platters")
    .insert({
      ep,
      title: spec.title,
      desk: spec.desk,
      publish_date: new Date().toISOString().slice(0, 10),
      status: "pending_approval",
      brief: spec.brief ?? "Built from a brief, not a form.",
    })
    .select("id")
    .single();

  if (pErr || !platter) throw new Error(`platter: ${pErr?.message ?? "insert failed"}`);

  if (spec.sources?.length) {
    await supabase
      .from("sources")
      .insert(spec.sources.map((s) => ({ platter_id: platter.id, ...s })));
  }

  const { data: posts, error: postErr } = await supabase
    .from("posts")
    .insert([
      {
        platter_id: platter.id,
        channel: "linkedin",
        format: "post",
        caption: spec.captions.linkedin,
        hashtags: spec.hashtags ?? [],
        slides: spec.slides,
        status: "pending_approval",
      },
      {
        platter_id: platter.id,
        channel: "instagram",
        format: spec.format ?? "carousel",
        caption: spec.captions.instagram,
        hashtags: spec.hashtags ?? [],
        slides: spec.slides,
        status: "pending_approval",
      },
    ])
    .select("id, channel");

  if (postErr || !posts) throw new Error(`posts: ${postErr?.message ?? "insert failed"}`);

  const ig = posts.find((p) => p.channel === "instagram")!;
  const li = posts.find((p) => p.channel === "linkedin")!;

  const urlsFor = (id: string) =>
    spec.slides.map((_, i) => `${site}/api/og/slide?post=${id}&i=${i}`);

  /*
    Both rows carry the deck. A LinkedIn row with no media_urls publishes as
    text with the artwork thrown away — the exact bug that shipped once.
  */
  const urls = urlsFor(ig.id);
  await supabase.from("posts").update({ media_urls: urls }).eq("id", ig.id);
  await supabase.from("posts").update({ media_urls: urlsFor(li.id) }).eq("id", li.id);

  return { ep, platterId: platter.id, instagramId: ig.id, linkedinId: li.id, urls };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/*
  Sends the finished deck to Telegram: PDF first (that is what gets uploaded
  to LinkedIn), then the frames as an album (Instagram needs individual
  images — a PDF cannot be posted as a carousel), then each caption in its
  own copyable message.
*/
export async function deliverDeck(opts: {
  title: string;
  urls: string[];
  captions: { linkedin: string; instagram: string };
  hashtags?: string[];
}): Promise<{ pages: number; kb: number }> {
  const bytes = await slidesToPdf(opts.urls);
  const tags = opts.hashtags?.length ? `\n\n${opts.hashtags.join(" ")}` : "";

  await sendDocument(
    bytes,
    `notavc-${slugify(opts.title)}.pdf`,
    `📄 ${opts.title}\n${opts.urls.length} pages · ready to upload to LinkedIn`,
  );

  await sendAlbum(opts.urls, `Slides 1-${opts.urls.length} — save these for Instagram`);

  await sendCopyable("LINKEDIN caption", opts.captions.linkedin + tags);
  await sendCopyable("INSTAGRAM caption", opts.captions.instagram + tags);

  return { pages: opts.urls.length, kb: Math.round(bytes.length / 1024) };
}

/*
  Rebuilds and re-sends the PDF for a post that already exists — what the
  📄 button on an approval card calls.
*/
export async function resendPdf(postId: string): Promise<boolean> {
  const supabase = db();
  const { data: post } = await supabase
    .from("posts")
    .select("caption, hashtags, media_urls, platter_id, platters(title)")
    .eq("id", postId)
    .maybeSingle();

  if (!post?.media_urls?.length) {
    await notify("⚠️ That post has no rendered slides yet.");
    return false;
  }

  const title =
    (post.platters as unknown as { title?: string } | null)?.title ?? "NotAVC — the numbers";

  const bytes = await slidesToPdf(post.media_urls);
  const tags = post.hashtags?.length ? `\n\n${post.hashtags.join(" ")}` : "";

  await sendDocument(
    bytes,
    `notavc-${slugify(title)}.pdf`,
    `📄 ${title}\n${post.media_urls.length} pages · ready to upload`,
  );
  await sendCopyable("Caption", post.caption + tags);
  return true;
}
