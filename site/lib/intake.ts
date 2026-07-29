import { db } from "./supabase";
import { draftFromIdea } from "./draft";
import { notify, sendCarousel } from "./telegram";

/*
  Idea → drafted platter → artwork → approval card.

  Runs inline on the webhook rather than on a queue: Telegram retries a
  webhook it considers failed, and a retried draft would bill twice and
  produce two cards. Answering fast and doing the work inline keeps the
  contract simple, at the cost of Sharath waiting ~20s for the card.
*/

export async function processIdea(rawText: string, chatId: string, siteUrl: string) {
  const supabase = db();

  const { data: idea, error: ideaError } = await supabase
    .from("ideas")
    .insert({ raw_text: rawText, source_chat: chatId, status: "drafting" })
    .select("id")
    .single();

  if (ideaError || !idea) {
    await notify("⚠️ Could not save that idea. Try again?");
    return;
  }

  try {
    const ep = await nextEp();
    const draft = await draftFromIdea(rawText, ep);

    const { data: platter, error: platterError } = await supabase
      .from("platters")
      .insert({
        ep,
        title: draft.title,
        desk: draft.desk,
        publish_date: new Date().toISOString().slice(0, 10),
        status: "pending_approval",
        brief: rawText,
      })
      .select("id")
      .single();

    if (platterError || !platter) throw new Error(platterError?.message ?? "platter insert failed");

    if (draft.sources.length) {
      await supabase.from("sources").insert(
        draft.sources.map((s) => ({
          platter_id: platter.id,
          url: s.url,
          title: s.title,
          publisher: s.publisher ?? null,
        })),
      );
    }

    // Default schedule: LinkedIn tomorrow 09:30 IST, Instagram 18:30 IST.
    // Both are stored as UTC; IST is UTC+5:30.
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const at = (h: number, m: number) => {
      const d = new Date(tomorrow);
      d.setUTCHours(h - 5, m - 30 < 0 ? m + 30 : m - 30, 0, 0);
      if (m - 30 < 0) d.setUTCHours(h - 6);
      return d.toISOString();
    };

    const { data: posts, error: postsError } = await supabase
      .from("posts")
      .insert(
        draft.posts.map((p) => ({
          platter_id: platter.id,
          channel: p.channel,
          format: p.format,
          caption: p.caption,
          hashtags: p.hashtags,
          slides: p.slides,
          scheduled_for: p.channel === "linkedin" ? at(9, 30) : at(18, 30),
          status: "pending_approval",
        })),
      )
      .select("id, channel, format, caption, scheduled_for, slides");

    if (postsError || !posts) throw new Error(postsError?.message ?? "posts insert failed");

    await supabase
      .from("ideas")
      .update({ status: "drafted", platter_id: platter.id })
      .eq("id", idea.id);

    /*
      Instagram media_urls point at our own renderer. The Graph API fetches
      them at publish time, so they must be absolute and publicly reachable
      — a relative path or a preview URL behind auth will fail there, not
      here.
    */
    for (const post of posts) {
      const slideCount = Array.isArray(post.slides) ? post.slides.length : 0;
      if (post.channel === "instagram" && slideCount) {
        const urls = Array.from(
          { length: slideCount },
          (_, i) => `${siteUrl}/api/og/slide?post=${post.id}&i=${i}`,
        );
        await supabase.from("posts").update({ media_urls: urls }).eq("id", post.id);
        await sendCarousel({
          postId: post.id,
          ep,
          channel: post.channel,
          format: post.format,
          caption: post.caption,
          scheduledFor: post.scheduled_for,
          sources: draft.sources,
          imageUrls: urls,
        });
      } else {
        await sendCarousel({
          postId: post.id,
          ep,
          channel: post.channel,
          format: post.format,
          caption: post.caption,
          scheduledFor: post.scheduled_for,
          sources: draft.sources,
          imageUrls: [],
        });
      }
    }
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    await supabase
      .from("ideas")
      .update({ status: "failed", error: detail })
      .eq("id", idea.id);
    await notify(`⚠️ Draft failed\n<code>${detail}</code>`);
  }
}

/* EP numbers are sequential across the whole archive, not per-desk. */
async function nextEp(): Promise<string> {
  const supabase = db();
  const { data } = await supabase
    .from("platters")
    .select("ep")
    .order("ep", { ascending: false })
    .limit(1)
    .maybeSingle();

  const last = Number(data?.ep?.replace(/\D/g, "") ?? 0);
  return `EP.${String(last + 1).padStart(3, "0")}`;
}
