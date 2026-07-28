import type { Post } from "./supabase";

/*
  Official-API publishers. No browser automation, no session cookies —
  both platforms are hit through their documented Graph/REST endpoints so
  nothing here breaks when a UI changes or a login is challenged.
*/

const GRAPH = "https://graph.facebook.com/v23.0";

export type PublishResult = { externalId: string; url: string | null };

/* ── LinkedIn ─────────────────────────────────────────────── */

export async function publishToLinkedIn(post: Post): Promise<PublishResult> {
  const token = process.env.LI_TOKEN;
  const person = process.env.LI_PERSON_ID;
  if (!token || !person) throw new Error("Missing LI_TOKEN or LI_PERSON_ID");

  const body = {
    author: `urn:li:person:${person}`,
    commentary: composeCaption(post),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      // LinkedIn versions by month and rejects anything unversioned
      "LinkedIn-Version": "202506",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn ${res.status}: ${await res.text()}`);
  }

  // The id comes back on a header, not in the body
  const id = res.headers.get("x-restli-id") ?? "";
  return {
    externalId: id,
    url: id ? `https://www.linkedin.com/feed/update/${id}` : null,
  };
}

/* ── Instagram ────────────────────────────────────────────── */

export async function publishToInstagram(post: Post): Promise<PublishResult> {
  const token = process.env.IG_TOKEN;
  const userId = process.env.IG_USER_ID;
  if (!token || !userId) throw new Error("Missing IG_TOKEN or IG_USER_ID");
  if (!post.media_urls.length) {
    throw new Error("Instagram requires at least one public media URL");
  }

  const caption = composeCaption(post);
  let creationId: string;

  if (post.format === "carousel") {
    // Children first, then a CAROUSEL parent that references them
    const children = await Promise.all(
      post.media_urls.map((url) =>
        createContainer(userId, token, {
          image_url: url,
          is_carousel_item: "true",
        }),
      ),
    );
    creationId = await createContainer(userId, token, {
      media_type: "CAROUSEL",
      children: children.join(","),
      caption,
    });
  } else if (post.format === "reel") {
    creationId = await createContainer(userId, token, {
      media_type: "REELS",
      video_url: post.media_urls[0],
      caption,
    });
    // Video containers transcode asynchronously; publishing early 400s
    await waitForContainer(creationId, token);
  } else {
    creationId = await createContainer(userId, token, {
      image_url: post.media_urls[0],
      caption,
    });
  }

  const res = await fetch(`${GRAPH}/${userId}/media_publish`, {
    method: "POST",
    body: new URLSearchParams({ creation_id: creationId, access_token: token }),
  });
  if (!res.ok) throw new Error(`Instagram publish ${res.status}: ${await res.text()}`);

  const { id } = (await res.json()) as { id: string };
  return { externalId: id, url: `https://www.instagram.com/p/${id}` };
}

async function createContainer(
  userId: string,
  token: string,
  fields: Record<string, string>,
): Promise<string> {
  const res = await fetch(`${GRAPH}/${userId}/media`, {
    method: "POST",
    body: new URLSearchParams({ ...fields, access_token: token }),
  });
  if (!res.ok) throw new Error(`Instagram container ${res.status}: ${await res.text()}`);
  const { id } = (await res.json()) as { id: string };
  return id;
}

/* Reels transcode server-side. Poll until FINISHED or give up. */
async function waitForContainer(id: string, token: string, tries = 20) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(
      `${GRAPH}/${id}?fields=status_code,status&access_token=${token}`,
    );
    const body = (await res.json()) as { status_code?: string; status?: string };
    if (body.status_code === "FINISHED") return;
    if (body.status_code === "ERROR") {
      throw new Error(`Instagram transcode failed: ${body.status ?? "unknown"}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("Instagram transcode timed out after 100s");
}

/* ── Shared ───────────────────────────────────────────────── */

export function composeCaption(post: Post): string {
  const tags = post.hashtags.length ? `\n\n${post.hashtags.join(" ")}` : "";
  return `${post.caption}${tags}`;
}

export function publisherFor(channel: Post["channel"]) {
  return channel === "linkedin" ? publishToLinkedIn : publishToInstagram;
}
