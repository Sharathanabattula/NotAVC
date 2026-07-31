import { db } from "./supabase";

/*
  Daily topic scouting.

  Pulls the feeds Sharath actually reads, drops anything already seen, and
  returns what's new. Deliberately dumb: no model, no scoring, no summary
  writing — just "here is what appeared today, pick one". Anything cleverer
  would need an LLM, and a machine-written take is the exact thing this
  brand exists to be the opposite of.

  Filtering is keyword-based and errs toward keeping things. A false
  positive costs one line in a Telegram message; a false negative means a
  story is never offered at all.
*/

export type Feed = {
  source: string;
  channel: string;
  url: string;
};

/*
  YouTube channel IDs were resolved from handles and then verified by
  fetching each feed and checking the returned channel name and its latest
  video. Two handles resolved to unrelated accounts, so nothing goes in
  here without that check.
*/
export const FEEDS: Feed[] = [
  { source: "yourstory", channel: "YourStory", url: "https://yourstory.com/feed" },
  { source: "entrackr", channel: "Entrackr", url: "https://entrackr.com/rss" },
  {
    source: "youtube",
    channel: "Think School",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCKZozRVHRYsYHGEyNKuhhdA",
  },
  {
    source: "youtube",
    channel: "Backstage with Millionaires",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCnpekFV93kB1O0rVqEKSumg",
  },
  {
    source: "youtube",
    channel: "Akshat Shrivastava",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCTcRR6rGIf6gsUF0aGclOpw",
  },
];

/*
  Worth a breakdown. Money, structure, or a company doing something with a
  number attached — not listicles, not "5 books", not motivational content.
*/
const KEEP =
  /\b(fund(ing|ed|s)?|raise[sd]?|valuation|revenue|profit|loss(es)?|ipo|acquir|acquisition|merger|shut ?down|layoff|burn|margin|unit econ|ebitda|arr|gmv|stake|investor|vc|venture|series [a-f]\b|seed|crore|cr\b|million|billion|rbi|sebi|regulat|licence|license|market share|business model|why .* (failed|works|won|lost)|how .* (makes|made) money)\b/i;

/* Never worth it, regardless of what else matched. */
const DROP =
  /\b(\d+ books?|horoscope|quotes?|motivat|inspir|wishes|shayari|recipe|admission|result 20\d\d|sarkari|job alert|vacancy)\b/i;

export function isRelevant(title: string): boolean {
  if (DROP.test(title)) return false;
  return KEEP.test(title);
}

type Item = {
  source: string;
  channel: string;
  title: string;
  url: string;
  published_at: string | null;
};

/* Minimal RSS/Atom reader. Both shapes appear across these five feeds. */
function parseFeed(xml: string, feed: Feed): Item[] {
  const blocks = [
    ...xml.matchAll(/<(item|entry)\b[\s\S]*?<\/\1>/g),
  ].map((m) => m[0]);

  const pick = (block: string, tag: string) => {
    const m = block.match(
      new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`),
    );
    return m ? m[1].trim() : "";
  };

  return blocks
    .map((b) => {
      /* Atom puts the URL on an attribute; RSS puts it in the element. */
      const href = b.match(/<link[^>]*href="([^"]+)"/)?.[1];
      const url = href || pick(b, "link");
      const title = pick(b, "title")
        .replace(/&amp;/g, "&")
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");
      const published =
        pick(b, "published") || pick(b, "pubDate") || pick(b, "updated");
      return {
        source: feed.source,
        channel: feed.channel,
        title,
        url,
        published_at: published ? new Date(published).toISOString() : null,
      };
    })
    .filter((i) => i.title && i.url);
}

/*
  One feed failing must not take the whole digest down — a 404 or a slow
  host should cost that source's items and nothing else.
*/
async function fetchFeed(feed: Feed): Promise<Item[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; NotAVC scout)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return [];
    return parseFeed(await res.text(), feed);
  } catch {
    return [];
  }
}

/*
  Fetches everything, keeps what looks like a business story, and inserts
  the ones not already in the table. Returns only genuinely new rows, so a
  quiet day sends a short digest rather than repeating yesterday's.
*/
export async function scout(limit = 8): Promise<Item[]> {
  const all = (await Promise.all(FEEDS.map(fetchFeed))).flat();

  const candidates = all.filter((i) => isRelevant(i.title));
  if (!candidates.length) return [];

  const supabase = db();
  const { data: existing } = await supabase
    .from("topics")
    .select("url")
    .in("url", candidates.map((c) => c.url));

  const seen = new Set((existing ?? []).map((r) => r.url as string));
  const fresh = candidates.filter((c) => !seen.has(c.url));
  if (!fresh.length) return [];

  /* Newest first, and cap it — a digest nobody reads to the end is noise. */
  fresh.sort(
    (a, b) =>
      new Date(b.published_at ?? 0).getTime() - new Date(a.published_at ?? 0).getTime(),
  );
  const batch = fresh.slice(0, limit);

  await supabase.from("topics").upsert(batch, { onConflict: "url" });
  return batch;
}
