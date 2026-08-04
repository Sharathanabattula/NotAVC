import type { Slide } from "./slides";
import type { IconName } from "./icons";

/*
  Turn a short labelled message into a full carousel.

  The compose form asks ~25 questions, which is fine at a desk and unusable
  on a phone. This is the phone path: seven labelled lines, typed in
  Telegram, no model involved.

    HOOK: The 10-year seed cheque
    SETUP: Seed investing gets sold as spotting the fast winner.
    NUMBER: 10-11 years
    LABEL: Seed to listing
    WRONG: Seed investing is about spotting the fast winners.
    RIGHT: Three of four Blume listings took 10-11 years.
    FOUND: Unacademy took the same shape. Ten years, three months.

  Labels are case-insensitive and order-independent; only HOOK, WRONG and
  RIGHT are required. Everything else has a sensible default, because a
  post that is missing its sub-line is still publishable and a post missing
  its correction is not.
*/

export type QuickPost = {
  slides: Slide[];
  caption: string;
  hook: string;
  desk: string;
  sources: { url: string; title: string }[];
  /* Instagram format. "post" is a single image, "carousel" is the deck. */
  format: "carousel" | "post";
};

const LABELS = [
  "hook", "sub", "desk", "setup", "number", "label", "note", "icon",
  "wrong", "right", "found", "list", "source", "logo", "company",
  /* "single" collapses the deck to one image — see below */
  "format",
  /*
    Image-bearing lines. These are what made a deck like the Hyderabad one
    need a laptop: logo cards, a deals table and a cover strip could only be
    authored in a script. All three take company domains and resolve to
    marks at render time.
  */
  "card", "deal", "strip",
] as const;

type Label = (typeof LABELS)[number];

function parse(text: string): Partial<Record<Label, string[]>> {
  const out: Partial<Record<Label, string[]>> = {};
  let current: Label | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = line.match(/^([A-Za-z]+)\s*:\s*(.*)$/);
    const maybe = match?.[1]?.toLowerCase() as Label | undefined;

    if (maybe && (LABELS as readonly string[]).includes(maybe)) {
      current = maybe;
      const value = match![2].trim();
      out[current] = out[current] ?? [];
      if (value) out[current]!.push(value);
    } else if (current) {
      // Continuation of the previous label — lets long RIGHT lines wrap
      out[current]!.push(line);
    }
  }
  return out;
}

/*
  The wrong take is struck line by line, so it has to arrive as short
  lines. Rather than making the author count characters on a phone, break
  it here on word boundaries at ~26 characters.
*/
function breakLines(text: string, max = 26): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (!line) {
      line = word;
    } else if ((line + " " + word).length <= max) {
      line += " " + word;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

/*
  Company marks are resolved from a domain rather than pasted as a URL. A
  logo.dev URL is 90 characters of token and query string, which is not
  something anyone is typing into Telegram on a phone.
*/
const LOGO_TOKEN = "pk_X-1ZO13GSgeOoUrIuJ6GMQ";

function markFor(domain: string): string {
  return `https://img.logo.dev/${domain.trim()}?token=${LOGO_TOKEN}&size=300&format=png`;
}

/* Pipe-separated so a comma inside the copy doesn't split a field */
function fields(row: string): string[] {
  return row.split("|").map((p) => p.trim());
}

export function quickPost(
  text: string,
  siteUrl?: string,
): { ok: false; error: string } | { ok: true; post: QuickPost } {
  const f = parse(text);
  const one = (k: Label) => f[k]?.join(" ").trim() ?? "";
  const all = (k: Label) => f[k] ?? [];
  const site = (siteUrl ?? "").replace(/\/$/, "");

  const hook = one("hook");
  const wrong = one("wrong");
  const right = one("right");

  if (!hook) return { ok: false, error: "Missing HOOK: — that's the cover line." };
  if (!wrong || !right) {
    return {
      ok: false,
      error: "Missing WRONG: or RIGHT: — the correction is the whole post.",
    };
  }

  const desk = one("desk") || "The uncomfortable";
  const numberValue = one("number");
  const numberLabel = one("label") || "The number";

  const sources = all("source").map((s) => {
    const i = s.indexOf(" ");
    return i === -1
      ? { url: s, title: s }
      : { url: s.slice(0, i).trim(), title: s.slice(i + 1).trim() };
  });

  /*
    A page that claims every number has a receipt should name the receipt on
    the artwork too. Host names read better than titles at 18px.
  */
  const sourceLine = sources
    .map((s) => {
      try {
        return new URL(s.url).hostname.replace(/^www\./, "").split(".")[0];
      } catch {
        return "";
      }
    })
    .filter(Boolean)
    .slice(0, 4)
    .join(" · ");

  const slides: Slide[] = [];

  /*
    STRIP: a row of company marks under the cover title. Without a site URL
    to build the render path against, the strip is dropped rather than
    written as a broken image reference.
  */
  const stripDomains = all("strip")
    .join(",")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);

  slides.push({
    kind: "cover",
    desk,
    title: hook,
    sub: one("sub") || undefined,
    ...(stripDomains.length && site
      ? { src: `${site}/api/og/strip?d=${stripDomains.join(",")}` }
      : {}),
    ...(sourceLine ? { source: sourceLine } : {}),
  });

  /*
    CARD: domain | COMPANY | verdict | number | label

    One full-bleed logo card per line. Only the domain and company are
    required; a card with no number still reads, a card with no company does
    not.
  */
  for (const row of all("card")) {
    const [domain, company, verdict, value, label] = fields(row);
    if (!domain || !company) continue;
    slides.push({
      kind: "logo",
      src: markFor(domain),
      company: company.toUpperCase(),
      ...(verdict ? { verdict: verdict.toUpperCase() } : {}),
      number: value || "—",
      numberLabel: label || numberLabel,
    });
  }

  /* Back-compat: the original single-logo form */
  const logo = one("logo");
  const company = one("company");
  if (logo && company) {
    slides.push({
      kind: "logo",
      src: logo,
      company: company.toUpperCase(),
      number: numberValue || "—",
      numberLabel,
    });
  }

  if (one("setup")) {
    slides.push({ kind: "statement", label: "The setup", body: one("setup") });
  }

  if (numberValue) {
    slides.push({
      kind: "number",
      label: numberLabel,
      value: numberValue,
      note: one("note") || undefined,
      icon: (one("icon") || "chart") as IconName,
    });
  }

  /*
    DEAL: domain | Name | amount | note

    Every DEAL line collapses into one slide of logo plates. Missing marks
    fall back to the company's initial rather than blocking the row.
  */
  const dealItems = all("deal")
    .map((row) => {
      const [domain, name, amount, note] = fields(row);
      if (!name || !amount) return null;
      return {
        name,
        amount,
        note: note ?? "",
        ...(domain ? { logo: markFor(domain) } : {}),
      };
    })
    .filter((x): x is { name: string; amount: string; note: string; logo?: string } => !!x);

  if (dealItems.length) {
    slides.push({
      kind: "deals",
      label: one("label") && !numberValue ? numberLabel : "The ones nobody names",
      items: dealItems,
      ...(sourceLine ? { source: sourceLine } : {}),
    });
  }

  /* LIST lines look like "KEY = value" */
  const listItems = all("list")
    .map((row) => {
      const i = row.indexOf("=");
      return i === -1 ? null : { k: row.slice(0, i).trim(), v: row.slice(i + 1).trim() };
    })
    .filter((x): x is { k: string; v: string } => !!x && !!x.k && !!x.v);

  if (listItems.length) {
    slides.push({ kind: "list", label: "How to read it", items: listItems });
  }

  slides.push({ kind: "correction", wrong: breakLines(wrong), right });

  if (one("found")) {
    slides.push({ kind: "statement", label: "What I found", body: one("found") });
  }

  slides.push({
    kind: "cta",
    heading: "Still not a VC.",
    sub: "Breakdowns, and the one number everyone skips.",
    handle: "@notavc.co",
  });

  /*
    FORMAT: single — one image instead of a deck.

    A single post has one job, so it keeps the strongest frame rather than
    the first. A number given explicitly is the strongest thing available;
    without one, the correction is the signature and stands alone. The
    cover is the last resort, because a cover with nothing after it is a
    headline promising a swipe that doesn't exist.
  */
  const single = /^single$/i.test(one("format") ?? "");
  if (single) {
    const best =
      slides.find((s) => s.kind === "number") ??
      slides.find((s) => s.kind === "correction") ??
      slides[0];
    slides.length = 0;
    slides.push(best);
  }

  /* A caption assembled from the same parts — editable before publishing */
  const caption = [
    hook,
    "",
    one("setup"),
    numberValue ? `\n${numberLabel}: ${numberValue}` : "",
    one("note"),
    "",
    `Everyone says: ${wrong}`,
    `What the numbers said: ${right}`,
    "",
    one("found"),
  ]
    .filter((part) => part !== undefined)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return {
    ok: true,
    post: { slides, caption, hook, desk, sources, format: single ? "post" : "carousel" },
  };
}

export const QUICK_HELP = `Send me a post like this — only HOOK, WRONG and RIGHT are required:

<code>HOOK: The 10-year seed cheque
SETUP: Seed investing gets sold as spotting the fast winner.
NUMBER: 10-11 years
LABEL: Seed to listing
WRONG: Seed investing is about spotting the fast winners.
RIGHT: Three of four Blume listings took 10-11 years from the first cheque.
FOUND: Unacademy took the same shape. Ten years, three months.</code>

For a <b>single image</b> instead of a carousel, add:
<code>FORMAT: single</code>

<b>Logos and pictures</b> — give me domains, I fetch the marks:
<code>STRIP: ctrls.com, divislabs.com, zenoti.com
CARD: ctrls.com | CtrlS | BIGGEST CHEQUE | ₹44,914 Cr | What it's worth
DEAL: zenoti.com | Zenoti | $1.5 Bn | Software for salons</code>

STRIP puts a row of marks on the cover. Each CARD is its own logo slide. All the DEAL lines land on one slide together. Fields are split on <code>|</code> so commas are safe.

Optional extras:
<code>DESK: Company teardowns
ICON: clock
LIST: UNDER 1.5 = Efficient
SOURCE: https://tracxn.com/... Tracxn profile</code>

I'll build the carousel, render it, and send it back for approval with a 📄 PDF button.
<b>Other commands</b>
<code>topics</code> — today's shortlist
<code>pick 3</code> — choose one from it
<code>inbox</code> — what you've sent me that isn't built yet

Anything else you send — a link, a video, a story, the angle you want — is saved to the inbox verbatim and I work from it.`;
