import type { Post } from "./supabase";

/*
  Official-API publishers. No browser automation, no session cookies —
  both platforms are hit through their documented Graph/REST endpoints so
  nothing here breaks when a UI changes or a login is challenged.
*/

const GRAPH = "https://graph.facebook.com/v23.0";

export type PublishResult = { externalId: string; url: string | null };


/*
  Two months back, in LinkedIn's YYYYMM format. Not the current month: their
  versions are announced ahead of being servable, and asking for one that
  hasn't gone live fails exactly like asking for one that has expired.
*/
function linkedInVersion(): string {
  const d = new Date();
  d.setUTCMonth(d.getUTCMonth() - 2);
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/* ── LinkedIn ─────────────────────────────────────────────── */

/*
  LinkedIn has no carousel type. What everyone calls a LinkedIn carousel is
  a PDF document post, so the slides have to be stitched into one PDF and
  uploaded before the post can reference it.

  Pages match the image's aspect so the artwork stays full-bleed rather than
  sitting on white margins.

  The page is drawn at half the pixel dimensions on purpose. PDF pages are
  measured in points at 72 per inch, so a 1080x1350 page holding a 1080x1350
  image is exactly 72 DPI and looks soft everywhere except a phone. Halving
  the page while embedding the image at full resolution makes it 144 DPI —
  same file, same bytes, twice the effective density.
*/
export async function slidesToPdf(urls: string[]): Promise<Uint8Array> {
  const { PDFDocument } = await import("pdf-lib");
  const pdf = await PDFDocument.create();

  for (const url of urls) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Slide fetch ${res.status} for ${url}`);
    const png = await pdf.embedPng(new Uint8Array(await res.arrayBuffer()));
    const w = png.width / 2;
    const h = png.height / 2;
    const page = pdf.addPage([w, h]);
    page.drawImage(png, { x: 0, y: 0, width: w, height: h });
  }

  return pdf.save();
}

/*
  Three steps, all required: register the upload, PUT the bytes to the URL
  they hand back, then reference the returned document URN in the post.
*/
async function uploadDocument(
  pdf: Uint8Array,
  token: string,
  person: string,
  version: string,
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": version,
  };

  const init = await fetch(
    "https://api.linkedin.com/rest/documents?action=initializeUpload",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        initializeUploadRequest: { owner: `urn:li:person:${person}` },
      }),
    },
  );
  if (!init.ok) {
    throw new Error(`LinkedIn document init ${init.status}: ${await init.text()}`);
  }

  const { value } = (await init.json()) as {
    value: { uploadUrl: string; document: string };
  };

  const put = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: pdf as unknown as BodyInit,
  });
  if (!put.ok) {
    throw new Error(`LinkedIn document upload ${put.status}: ${await put.text()}`);
  }

  return value.document;
}

/*
  Same three-step shape as documents, against the images endpoint. Kept
  separate rather than parameterised because the two differ in the request
  body key as well as the path, and collapsing them hid that.
*/
async function uploadImage(
  url: string,
  token: string,
  person: string,
  version: string,
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": version,
  };

  const init = await fetch(
    "https://api.linkedin.com/rest/images?action=initializeUpload",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        initializeUploadRequest: { owner: `urn:li:person:${person}` },
      }),
    },
  );
  if (!init.ok) {
    throw new Error(`LinkedIn image init ${init.status}: ${await init.text()}`);
  }

  const { value } = (await init.json()) as {
    value: { uploadUrl: string; image: string };
  };

  const src = await fetch(url);
  if (!src.ok) throw new Error(`Image fetch ${src.status} for ${url}`);

  const put = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: new Uint8Array(await src.arrayBuffer()) as unknown as BodyInit,
  });
  if (!put.ok) {
    throw new Error(`LinkedIn image upload ${put.status}: ${await put.text()}`);
  }

  return value.image;
}

export async function publishToLinkedIn(post: Post): Promise<PublishResult> {
  const token = process.env.LI_TOKEN;
  const person = process.env.LI_PERSON_ID;
  if (!token || !person) throw new Error("Missing LI_TOKEN or LI_PERSON_ID");

  const version = process.env.LI_VERSION || linkedInVersion();

  /*
    Attach the deck when there is one. A text-only post of a breakdown
    throws away the artwork that makes it worth reading, and LinkedIn's
    document posts are what carry a carousel there.
  */
  let media: { id: string; title: string } | undefined;
  if (post.media_urls?.length) {
    /*
      A single image goes up as an image, not a one-page PDF. LinkedIn
      renders a document as a swipeable card with a page counter, which on
      one page reads as a carousel someone forgot to finish.
    */
    const id =
      post.media_urls.length === 1
        ? await uploadImage(post.media_urls[0], token, person, version)
        : await uploadDocument(
            await slidesToPdf(post.media_urls),
            token,
            person,
            version,
          );
    /*
      LinkedIn shows this above the document. The Post row doesn't carry the
      platter title, and the first line of the caption is already written to
      be the hook, so it makes a better label than anything generic.
    */
    const firstLine = post.caption.split("\n").find((l) => l.trim().length) ?? "";
    media = { id, title: firstLine.slice(0, 90) || "NotAVC — the numbers" };
  }

  const body = {
    author: `urn:li:person:${person}`,
    commentary: composeCaption(post),
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    ...(media ? { content: { media } } : {}),
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
      /*
        LinkedIn versions by month (YYYYMM) and retires anything older than
        about a year, so a hardcoded value silently rots — 202506 started
        returning NONEXISTENT_VERSION once it aged out. Defaults to the
        month before last, which is always released and always inside the
        window, and can be pinned via env without touching the code.
      */
      "LinkedIn-Version": version,
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

  /*
    Stories are not a carousel. Each frame is its own media object, and the
    API takes no caption for them — text has to be burned into the artwork,
    which is why story frames render at 1080x1920 through the slide route
    rather than being cropped from the feed deck.

    Frames publish in order and the last id is returned, since a story has
    no single canonical permalink.
  */
  if (post.format === "story") {
    let lastId = "";
    for (const url of post.media_urls) {
      const id = await createContainer(userId, token, {
        image_url: url,
        media_type: "STORIES",
      });
      const res = await fetch(`${GRAPH}/${userId}/media_publish`, {
        method: "POST",
        body: new URLSearchParams({ creation_id: id, access_token: token }),
      });
      if (!res.ok) {
        throw new Error(`Instagram story ${res.status}: ${await res.text()}`);
      }
      lastId = ((await res.json()) as { id: string }).id;
    }
    return { externalId: lastId, url: "https://www.instagram.com/stories/notavc.co/" };
  }

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
