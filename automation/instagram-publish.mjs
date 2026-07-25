#!/usr/bin/env node
/*
  NotAVC — Instagram auto-publish via the official Meta Graph API.
  Publishes a single image, a carousel (2–10 images), or a reel to your
  Instagram Professional account.

  Usage:
    node instagram-publish.mjs image  "https://.../slide1.jpg" "Caption text #NotAVC"
    node instagram-publish.mjs carousel "url1,url2,url3" "Caption text #NotAVC"
    node instagram-publish.mjs reel  "https://.../reel.mp4" "Caption text #NotAVC"

  Requires env vars (see SETUP-KEYS.md):
    IG_USER_ID    — your Instagram professional account ID
    IG_TOKEN      — long-lived access token
  Note: media URLs must be PUBLIC https URLs (host slides on the site,
  e.g. notavc.vercel.app/posts/ep008-1.jpg — Drive links do not work).
*/

const GRAPH = "https://graph.facebook.com/v23.0";
const { IG_USER_ID, IG_TOKEN } = process.env;

if (!IG_USER_ID || !IG_TOKEN) {
  console.error("Missing IG_USER_ID or IG_TOKEN env vars. See SETUP-KEYS.md");
  process.exit(1);
}

async function api(path, params) {
  const body = new URLSearchParams({ ...params, access_token: IG_TOKEN });
  const res = await fetch(`${GRAPH}/${path}`, { method: "POST", body });
  const json = await res.json();
  if (json.error) throw new Error(`${path}: ${json.error.message}`);
  return json;
}

async function waitUntilReady(creationId) {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(
      `${GRAPH}/${creationId}?fields=status_code&access_token=${IG_TOKEN}`,
    );
    const { status_code } = await res.json();
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR") throw new Error("Media processing failed");
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("Timed out waiting for media processing");
}

async function publish(creationId) {
  const { id } = await api(`${IG_USER_ID}/media_publish`, {
    creation_id: creationId,
  });
  console.log(`Published. Media ID: ${id}`);
}

const [mode, media, caption = ""] = process.argv.slice(2);

if (mode === "image") {
  const { id } = await api(`${IG_USER_ID}/media`, {
    image_url: media,
    caption,
  });
  await publish(id);
} else if (mode === "carousel") {
  const urls = media.split(",").map((u) => u.trim());
  const children = [];
  for (const url of urls) {
    const { id } = await api(`${IG_USER_ID}/media`, {
      image_url: url,
      is_carousel_item: "true",
    });
    children.push(id);
  }
  const { id } = await api(`${IG_USER_ID}/media`, {
    media_type: "CAROUSEL",
    children: children.join(","),
    caption,
  });
  await publish(id);
} else if (mode === "reel") {
  const { id } = await api(`${IG_USER_ID}/media`, {
    media_type: "REELS",
    video_url: media,
    caption,
  });
  await waitUntilReady(id);
  await publish(id);
} else {
  console.error("Mode must be: image | carousel | reel");
  process.exit(1);
}
