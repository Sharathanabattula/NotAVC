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
};

const LABELS = [
  "hook", "sub", "desk", "setup", "number", "label", "note", "icon",
  "wrong", "right", "found", "list", "source", "logo", "company",
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

export function quickPost(text: string): { ok: false; error: string } | { ok: true; post: QuickPost } {
  const f = parse(text);
  const one = (k: Label) => f[k]?.join(" ").trim() ?? "";
  const all = (k: Label) => f[k] ?? [];

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

  const slides: Slide[] = [
    {
      kind: "cover",
      desk,
      title: hook,
      sub: one("sub") || undefined,
    },
  ];

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
    sub: "Teardowns, term sheets, and the one number everyone skips.",
    handle: "@notavc.co",
  });

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

  const sources = all("source").map((s) => {
    const i = s.indexOf(" ");
    return i === -1
      ? { url: s, title: s }
      : { url: s.slice(0, i).trim(), title: s.slice(i + 1).trim() };
  });

  return { ok: true, post: { slides, caption, hook, desk, sources } };
}

export const QUICK_HELP = `Send me a post like this — only HOOK, WRONG and RIGHT are required:

<code>HOOK: The 10-year seed cheque
SETUP: Seed investing gets sold as spotting the fast winner.
NUMBER: 10-11 years
LABEL: Seed to listing
WRONG: Seed investing is about spotting the fast winners.
RIGHT: Three of four Blume listings took 10-11 years from the first cheque.
FOUND: Unacademy took the same shape. Ten years, three months.</code>

Optional extras:
<code>DESK: Company teardowns
ICON: clock
LIST: UNDER 1.5 = Efficient
SOURCE: https://tracxn.com/... Tracxn profile
COMPANY: Blume
LOGO: https://img.logo.dev/blume.vc?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&amp;size=200&amp;format=png</code>

I'll build the carousel, render it, and send it back for approval.
<b>Other commands</b>
<code>topics</code> — today's shortlist
<code>pick 3</code> — choose one from it
<code>inbox</code> — what you've sent me that isn't built yet

Anything else you send — a link, a video, a story, the angle you want — is saved to the inbox verbatim and I work from it.`;
