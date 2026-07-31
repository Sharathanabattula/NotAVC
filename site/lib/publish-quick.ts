import { db } from "./supabase";
import { quickPost } from "./quickpost";
import { sendCarousel, notify } from "./telegram";

/*
  Takes a labelled Telegram message all the way to an approval card:
  parse → persist → render URLs → send back. No model, no form, no laptop.
*/

export async function handleQuickPost(text: string, siteUrl: string) {
  const parsed = quickPost(text);
  if (!parsed.ok) {
    await notify(`⚠️ ${parsed.error}\n\nSend <code>help</code> for the format.`);
    return;
  }

  const { slides, caption, hook, desk, sources, format } = parsed.post;
  const supabase = db();

  /*
    EP numbers are no longer shown on the artwork but still order the
    archive, so they are generated here rather than asked for.
  */
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
      title: hook,
      desk,
      publish_date: new Date().toISOString().slice(0, 10),
      status: "pending_approval",
      brief: "Written from Telegram.",
    })
    .select("id")
    .single();

  if (pErr || !platter) {
    await notify(`⚠️ Could not save that: ${pErr?.message ?? "unknown"}`);
    return;
  }

  if (sources.length) {
    await supabase
      .from("sources")
      .insert(sources.map((s) => ({ platter_id: platter.id, ...s })));
  }

  /* Tomorrow 09:30 and 18:30 IST, stored as UTC */
  const at = (h: number, m: number) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 1);
    d.setUTCHours(h - 5, m - 30 < 0 ? m + 30 : m - 30, 0, 0);
    if (m - 30 < 0) d.setUTCHours(h - 6);
    return d.toISOString();
  };

  const { data: posts, error: postErr } = await supabase
    .from("posts")
    .insert([
      {
        platter_id: platter.id,
        channel: "linkedin",
        format: "post",
        caption,
        slides: [],
        scheduled_for: at(9, 30),
        status: "pending_approval",
      },
      {
        platter_id: platter.id,
        channel: "instagram",
        format,
        caption,
        slides,
        scheduled_for: at(18, 30),
        status: "pending_approval",
      },
    ])
    .select("id, channel, format, caption, scheduled_for");

  if (postErr || !posts) {
    await notify(`⚠️ Could not save the posts: ${postErr?.message ?? "unknown"}`);
    return;
  }

  const ig = posts.find((p) => p.channel === "instagram")!;
  const urls = slides.map(
    (_, i) => `${siteUrl.replace(/\/$/, "")}/api/og/slide?post=${ig.id}&i=${i}`,
  );
  await supabase.from("posts").update({ media_urls: urls }).eq("id", ig.id);

  await sendCarousel({
    postId: ig.id,
    ep,
    channel: "instagram",
    format: "carousel",
    caption,
    scheduledFor: ig.scheduled_for,
    sources,
    imageUrls: urls,
  });

  const li = posts.find((p) => p.channel === "linkedin")!;
  await sendCarousel({
    postId: li.id,
    ep,
    channel: "linkedin",
    format: "post",
    caption,
    scheduledFor: li.scheduled_for,
    sources,
    imageUrls: [],
  });
}
