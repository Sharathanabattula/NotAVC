import { quickPost } from "./quickpost";
import { buildDeck } from "./deck-build";
import { sendCarousel, notify } from "./telegram";

/*
  Takes a labelled Telegram message all the way to an approval card:
  parse → persist → render URLs → send back. No model, no form, no laptop.

  The persisting is buildDeck's job, not this file's. It used to be
  duplicated here, and the copy drifted: it wrote media_urls onto the
  Instagram row only, so every deck written from Telegram produced a
  LinkedIn post with no artwork and a PDF button with nothing to build.
  One builder, one place that can be wrong.
*/

/* Tomorrow 09:30 and 18:30 IST, stored as UTC */
function at(hour: number, minute: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(hour - 5, minute - 30 < 0 ? minute + 30 : minute - 30, 0, 0);
  if (minute - 30 < 0) d.setUTCHours(hour - 6);
  return d.toISOString();
}

export async function handleQuickPost(text: string, siteUrl: string) {
  /* siteUrl reaches the parser because STRIP: builds a render path with it */
  const parsed = quickPost(text, siteUrl);
  if (!parsed.ok) {
    await notify(`⚠️ ${parsed.error}\n\nSend <code>help</code> for the format.`);
    return;
  }

  const { slides, caption, hook, desk, sources, format } = parsed.post;

  let built;
  try {
    built = await buildDeck(
      {
        title: hook,
        desk,
        slides,
        captions: { linkedin: caption, instagram: caption },
        sources,
        format,
        brief: "Written from Telegram.",
        scheduledFor: { linkedin: at(9, 30), instagram: at(18, 30) },
      },
      siteUrl,
    );
  } catch (err) {
    await notify(`⚠️ Could not save that: ${err instanceof Error ? err.message : String(err)}`);
    return;
  }

  await sendCarousel({
    postId: built.instagramId,
    ep: built.ep,
    channel: "instagram",
    format,
    caption,
    scheduledFor: built.scheduled.instagram,
    sources,
    imageUrls: built.urls,
  });

  await sendCarousel({
    postId: built.linkedinId,
    ep: built.ep,
    channel: "linkedin",
    format: "post",
    caption,
    scheduledFor: built.scheduled.linkedin,
    sources,
    /* The album already went out above; a second copy is noise */
    imageUrls: [],
  });
}
