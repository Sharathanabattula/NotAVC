import Anthropic from "@anthropic-ai/sdk";
import type { Slide } from "./slides";

/*
  Turns a raw idea into a drafted platter.

  The output shape is enforced with a tool schema rather than asked for in
  prose — a malformed carousel would render as a broken image, and there is
  no human in the loop between here and Telegram to catch it.

  The voice rules live in the prompt because they are editorial judgement,
  not validation: "one number per claim" cannot be expressed in a schema.
*/

export type DraftedPost = {
  channel: "linkedin" | "instagram";
  format: "post" | "carousel" | "reel";
  caption: string;
  hashtags: string[];
  slides: Slide[];
};

export type Draft = {
  ep: string;
  title: string;
  desk: string;
  sources: { url: string; title: string; publisher?: string }[];
  posts: DraftedPost[];
};

const SYSTEM = `You write for NotAVC — Sharath Chandra Anabattula, an MBA student at SR University (Finance & Derivatives, Bower School of Entrepreneurship VC/PE programme) who is learning venture capital in public.

POSITIONING
He is the anti-bullshit translator for the Indian MBA. Not a teacher, not an
analyst with access — the proxy for every smart 24-year-old who reads a
funding headline and thinks "am I stupid, or is this PR spin?".

THE RULE THAT MATTERS MOST
Definitions do not travel. Consequences do. Never explain a term without
naming a real Indian company it bites, and the number that proves it.
  Weak: "Burn multiple is net burn divided by net new ARR."
  Strong: "Zepto needs you to buy Rs 500 of groceries to break even on a
           Rs 20 delivery. Here is the number that decides whether quick
           commerce survives."

VOICE
- First person, direct, unadorned. He is a student doing the work early and out loud, not an authority handing down verdicts.
- Never claim insider access, a fund, or a track record. He has none. That honesty is the brand.
- One number per claim. If you cannot name the number, cut the claim.
- Indian context first: rupees, Indian companies, Indian market structure. Global examples only when they teach something Indian ones do not.
- Short sentences. No hedging, no "in today's fast-paced world", no LinkedIn throat-clearing, no emoji in body copy.
- Never use: leverage (as a verb), unlock, game-changer, revolutionise, deep dive, thrilled, humbled, journey.

THE SIGNATURE — non-negotiable
Every carousel must contain exactly one "correction" slide. It states the take everyone had, then what the numbers actually said. This is the whole brand: he shows his work, mistakes included. A carousel without it is rejected.
The 'wrong' field is an ARRAY OF LINES, each short enough to sit on one line at 56px in a 1080px-wide frame — roughly 26 characters. Break the sentence yourself. Two or three lines is right.

STRUCTURE OF A CAROUSEL (7 slides, in this order)
1. cover — the hook, under 40 characters in the title
2. statement — the setup, the thing everyone assumes
3. number — the metric that matters, and how to compute it
4. list — three tiers for reading that metric
5. correction — THE SIGNATURE
6. statement — what he found when he looked, ending on a line that lands
7. cta — always "Still not a VC." with handle @notavc.co

CAPTIONS
- LinkedIn: 120-200 words, line breaks between thoughts, no hashtag wall — 3 to 4 at the end.
- Instagram: 60-100 words, punchier, 5 hashtags mixing broad (#startupindia) and specific (#unitecononomics).

SOURCES
Only cite sources actually present in the user's message. If they gave a link, use it. If they gave none, return an empty array — never invent a citation.`;

const TOOL: Anthropic.Tool = {
  name: "emit_platter",
  description: "Emit the drafted platter for NotAVC.",
  input_schema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Internal title for the platter" },
      desk: {
        type: "string",
        enum: [
          "Company teardowns",
          "Concepts, explained",
          "The uncomfortable",
          "Founder stories",
        ],
      },
      sources: {
        type: "array",
        items: {
          type: "object",
          properties: {
            url: { type: "string" },
            title: { type: "string" },
            publisher: { type: "string" },
          },
          required: ["url", "title"],
        },
      },
      linkedin_caption: { type: "string" },
      linkedin_hashtags: { type: "array", items: { type: "string" } },
      instagram_caption: { type: "string" },
      instagram_hashtags: { type: "array", items: { type: "string" } },
      slides: {
        type: "array",
        minItems: 7,
        maxItems: 7,
        items: {
          type: "object",
          properties: {
            kind: {
              type: "string",
              enum: ["cover", "statement", "number", "list", "correction", "cta"],
            },
            ep: { type: "string" },
            desk: { type: "string" },
            title: { type: "string" },
            sub: { type: "string" },
            label: { type: "string" },
            body: { type: "string" },
            value: { type: "string" },
            note: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                properties: { k: { type: "string" }, v: { type: "string" } },
                required: ["k", "v"],
              },
            },
            wrong: {
              type: "array",
              items: { type: "string" },
              description: "Lines of the wrong take, each ~26 chars max",
            },
            right: { type: "string" },
            heading: { type: "string" },
            handle: { type: "string" },
          },
          required: ["kind"],
        },
      },
    },
    required: [
      "title",
      "desk",
      "sources",
      "linkedin_caption",
      "linkedin_hashtags",
      "instagram_caption",
      "instagram_hashtags",
      "slides",
    ],
  },
};

export async function draftFromIdea(idea: string, ep: string): Promise<Draft> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.startsWith("PASTE_")) {
    throw new Error("ANTHROPIC_API_KEY is not set — see GO-LIVE.md");
  }

  const client = new Anthropic({ apiKey: key });

  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4000,
    system: SYSTEM,
    tools: [TOOL],
    // Forcing the tool guarantees structured output; without it the model
    // may reply in prose and there is nothing downstream to parse it.
    tool_choice: { type: "tool", name: "emit_platter" },
    messages: [
      {
        role: "user",
        content: `Draft ${ep} from this. Keep every number traceable to what I gave you.\n\n${idea}`,
      },
    ],
  });

  const block = message.content.find((c) => c.type === "tool_use");
  if (!block || block.type !== "tool_use") {
    throw new Error("Model did not return a platter");
  }

  const out = block.input as {
    title: string;
    desk: string;
    sources: { url: string; title: string; publisher?: string }[];
    linkedin_caption: string;
    linkedin_hashtags: string[];
    instagram_caption: string;
    instagram_hashtags: string[];
    slides: Slide[];
  };

  // The signature is a brand rule, so enforce it here rather than trusting
  // the prompt — a carousel without a correction is not a NotAVC post.
  if (!out.slides.some((s) => s.kind === "correction")) {
    throw new Error("Draft has no correction slide — regenerating");
  }

  return {
    ep,
    title: out.title,
    desk: out.desk,
    sources: out.sources ?? [],
    posts: [
      {
        channel: "linkedin",
        format: "post",
        caption: out.linkedin_caption,
        hashtags: out.linkedin_hashtags ?? [],
        slides: [],
      },
      {
        channel: "instagram",
        format: "carousel",
        caption: out.instagram_caption,
        hashtags: out.instagram_hashtags ?? [],
        slides: out.slides,
      },
    ],
  };
}

/* Re-draft an existing post against feedback, keeping everything else. */
export async function reviseCaption(
  current: string,
  feedback: string,
  channel: string,
): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key || key.startsWith("PASTE_")) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const client = new Anthropic({ apiKey: key });
  const message = await client.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 1500,
    system: SYSTEM,
    messages: [
      {
        role: "user",
        content: `Here is the current ${channel} caption:\n\n${current}\n\nSharath's note: ${feedback}\n\nRewrite it. Reply with the caption only — no preamble, no explanation.`,
      },
    ],
  });

  const text = message.content.find((c) => c.type === "text");
  if (!text || text.type !== "text") throw new Error("No revision returned");
  return text.text.trim();
}
