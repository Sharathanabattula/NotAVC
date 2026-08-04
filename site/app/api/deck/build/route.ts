import { NextResponse } from "next/server";
import { buildDeck, deliverDeck, type DeckSpec } from "@/lib/deck-build";
import { notify } from "@/lib/telegram";

export const dynamic = "force-dynamic";
/* Rendering six slides and stitching a PDF runs past the default ceiling */
export const maxDuration = 120;

/*
  Build a research deck from a JSON spec and deliver it to Telegram.

  This is the endpoint that replaces the per-deck node scripts. Those read
  .env.local and called Telegram directly, so every image-heavy post needed
  a laptop. This needs a phone and a POST.

    curl -X POST "$SITE/api/deck/build" \
      -H "authorization: Bearer $CRON_SECRET" \
      -H "content-type: application/json" \
      -d @deck.json

  Same shared-secret auth as the publish and scout crons.
*/

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let spec: DeckSpec;
  try {
    spec = (await request.json()) as DeckSpec;
  } catch {
    return NextResponse.json({ error: "body is not JSON" }, { status: 400 });
  }

  if (!spec.title || !spec.slides?.length || !spec.captions?.linkedin) {
    return NextResponse.json(
      { error: "need title, slides and captions.linkedin" },
      { status: 400 },
    );
  }

  /*
    A deck without a correction slide is a quote card. The correction is the
    site's signature and the one thing that has to survive into the feed, so
    it is enforced here rather than left to whoever wrote the brief.
  */
  if (!spec.slides.some((s) => s.kind === "correction")) {
    return NextResponse.json({ error: "deck has no correction slide" }, { status: 400 });
  }

  const siteUrl =
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : new URL(request.url).origin);

  try {
    const built = await buildDeck(spec, siteUrl);
    const sent = await deliverDeck({
      title: spec.title,
      urls: built.urls,
      captions: spec.captions,
      hashtags: spec.hashtags,
    });
    return NextResponse.json({ ...built, ...sent });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await notify(`⚠️ Deck build failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
