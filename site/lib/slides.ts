/*
  Post artwork definitions.

  A "deck" is one Instagram carousel: an ordered list of slides. Each slide
  is a tagged shape rather than free-form layout, so the renderer can lay
  every kind out consistently and the brand rules can't drift per post.

  The correction slide is mandatory. It is the site's signature and it has
  to survive into the feed, otherwise the posts are just quote cards.
*/

import type { IconName } from "./icons";

export type Slide =
  /* `ep` is optional and no longer rendered — kept for ordering only */
  | { kind: "cover"; ep?: string; desk: string; title: string; sub?: string }
  | { kind: "statement"; label?: string; body: string; icon?: IconName }
  | {
      kind: "number";
      value: string;
      label: string;
      note?: string;
      /* Pictogram slot — any key from lib/icons.tsx ICONS */
      icon?: IconName;
    }
  /*
    `wrong` is an array because the strike is drawn as a bar per line —
    a single bar over a wrapped block crosses only the first line and
    dangles past the last one. The author controls the break.
  */
  | {
      kind: "correction";
      wrong: string[];
      right: string;
      /* Rail labels. Default to the teardown voice; override to change whose
         claim is being struck out and who is answering. */
      wrongLabel?: string;
      rightLabel?: string;
    }
  | { kind: "list"; label: string; items: { k: string; v: string }[]; icon?: IconName }
  | { kind: "cta"; heading: string; sub: string; handle: string }
  /* Single-post kinds — these have to work with no slides either side */
  | {
      kind: "quote";
      quote: string;
      attribution?: string;
      /* Absolute URL — Satori fetches it at render time */
      photo?: string;
    }
  | {
      kind: "teardown";
      company: string;
      verdict: string;
      number: string;
      numberLabel: string;
      take: string;
      icon?: IconName;
    }
  | { kind: "hook"; overline: string; hook: string; kicker: string }
  /*
    Image-bearing kinds. `src` must be an absolute, publicly reachable URL —
    Satori fetches it at render time, so a private or relative path fails at
    render rather than at author time.

    Editorial use only: a company mark identifying the company under
    discussion. Do not use agency or news photography.
  */
  | {
      kind: "logo";
      src: string;
      company: string;
      verdict?: string;
      number: string;
      numberLabel: string;
    }
  | {
      kind: "photo";
      src: string;
      overline?: string;
      caption: string;
      credit?: string;
    };

export type Deck = {
  slug: string;
  ep: string;
  title: string;
  /*
    `carousel` renders 1080x1350 with progress pips.
    `single` is one image, no pips.
    `story` is 1080x1920 with the safe area kept clear of Instagram's chrome.
  */
  format: "carousel" | "single" | "story";
  slides: Slide[];
};

export const DECKS: Deck[] = [
  {
    slug: "ep008-burn-multiple",
    ep: "EP.008",
    title: "The burn multiple nobody quotes in a pitch",
    format: "carousel",
    slides: [
      {
        kind: "cover",
        ep: "EP.008",
        desk: "Concepts, explained",
        title: "The number founders skip",
        sub: "Burn multiple, in 60 seconds",
      },
      {
        kind: "statement",
        label: "The setup",
        body: "Every deck shows ARR growth.\n\nAlmost none show what the growth cost.",
      },
      {
        kind: "number",
        value: "Net burn ÷ net new ARR",
        label: "Burn multiple",
        icon: "burn",
        note: "Burn ₹4Cr to add ₹1Cr of ARR → burn multiple of 4.",
      },
      {
        kind: "list",
        label: "How to read it",
        items: [
          { k: "UNDER 1.5", v: "Efficient. Growth is earning its keep." },
          { k: "1.5 – 3", v: "Watch it. Fine while capital is cheap." },
          { k: "OVER 3", v: "You are buying revenue, not earning it." },
        ],
      },
      {
        kind: "correction",
        wrong: ["Growth rate tells you", "how the company is doing."],
        right:
          "Growth rate tells you the speed. Burn multiple tells you whether you can keep going at that speed.",
      },
      {
        kind: "statement",
        label: "What I found",
        body: "I went looking for this number in six Indian SaaS decks this month.\n\nFound it in zero.\n\nThat absence is the signal.",
      },
      {
        kind: "cta",
        heading: "Still not a VC.",
        sub: "Teardowns, term sheets, and the one number everyone skips.",
        handle: "@notavc.co",
      },
    ],
  },
];

/* Singles — each is one image that has to carry the whole idea alone. */
DECKS.push(
  {
    slug: "single-liq-pref",
    ep: "EP.009",
    title: "Liquidation preference — single",
    format: "single",
    slides: [
      {
        kind: "quote",
        quote:
          "A liquidation preference isn't a term. It's the entire deal wearing a disguise.",
        attribution: "Field note — Jul 21",
      },
    ],
  },
  {
    slug: "demo-logo-card",
    ep: "EP.007",
    title: "Zerodha — logo card",
    format: "single",
    slides: [
      {
        kind: "logo",
        // logo.dev serves marks by domain; swap for a self-hosted file if
        // you would rather not depend on a third party at render time
        src: "https://img.logo.dev/zerodha.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=200&format=png",
        company: "ZERODHA",
        verdict: "THE QUIET ONE",
        number: "₹4,700 Cr",
        numberLabel: "Profit, with roughly zero marketing spend",
      },
    ],
  },
  {
    slug: "single-byjus",
    ep: "EP.001",
    title: "BYJU'S — teardown card",
    format: "single",
    slides: [
      {
        kind: "teardown",
        company: "BYJU'S",
        verdict: "POST-MORTEM",
        number: "$22B → ~$0",
        numberLabel: "Peak valuation to investor write-downs, 2022–2024",
        take: "Growth bought with borrowed money isn't growth. It's a countdown.",
      },
    ],
  },
  {
    slug: "story-burn-multiple",
    ep: "EP.008",
    title: "Burn multiple — story",
    format: "story",
    slides: [
      {
        kind: "hook",
        overline: "Concepts, explained",
        hook: "Six SaaS decks. Zero mentions of this number.",
        kicker: "Swipe up for the teardown",
      },
    ],
  },
);

export function deckBySlug(slug: string) {
  return DECKS.find((d) => d.slug === slug);
}
