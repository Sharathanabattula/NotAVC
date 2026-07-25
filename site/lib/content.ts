/*
  All site copy lives here. Voice rules from DESIGN-SYSTEM.md apply:
  raw, first person, one number per claim, no banned words.
  TODO(sharath): swap SOCIAL hrefs for your real handles before launch.
*/

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/",
  instagram: "https://www.instagram.com/",
  email: "mailto:sharathanabattula@gmail.com",
};

export const TICKER_TERMS = [
  "CAP TABLES",
  "LIQ PREFS",
  "MOIC ≠ IRR",
  "DRY POWDER",
  "TERM SHEETS",
  "PRO-RATA",
  "DOWN ROUNDS",
  "BURN MULTIPLE",
  "ESOP POOLS",
  "DPI OR IT DIDN'T HAPPEN",
  "UNIT ECONOMICS",
  "ANTI-DILUTION",
];

export const MANIFESTO = {
  kicker: "EP.000 — The thesis",
  heading: "Most people learn venture quietly. I take notes in public.",
  paragraphs: [
    "I'm Sharath — an MBA student at SR University studying finance and derivatives, working through venture capital and private equity one term sheet at a time. Not from inside a fund. From the outside, with library access and stubbornness.",
    "Every teardown, every concept, every mistake goes on the record. When I misread a cap table, you'll see the correction. When a \"₹800Cr valuation\" turns out to be a liquidation-preference mirage, you'll see the math.",
    "This is not a 30-day challenge. It's a permanent, numbered archive — the venture education I wanted and couldn't find in a textbook.",
  ],
  pullQuote:
    "Venture intelligence shouldn't need a Sand Hill Road address. Or a Bandra one.",
  stats: [
    { value: "₹0", label: "Assets under management" },
    { value: "06", label: "Desks, always open" },
    { value: "EP.∞", label: "Numbered, never expiring" },
    { value: "100%", label: "Work shown, errors included" },
  ],
};

export type Teardown = {
  ep: string;
  company: string;
  verdict: "POST-MORTEM" | "REPRICED" | "LIVE BET";
  verdictTone: "coral" | "amber" | "info";
  hook: string;
  number: string;
  numberLabel: string;
  take: string;
  metrics: { k: string; v: string }[];
};

export const TEARDOWNS: Teardown[] = [
  {
    ep: "EP.001",
    company: "BYJU'S",
    verdict: "POST-MORTEM",
    verdictTone: "coral",
    hook: "The $22B lesson in believing your own pitch deck.",
    number: "$22B → ~$0",
    numberLabel: "Peak valuation to investor write-downs, 2022–2024",
    take:
      "Growth bought with borrowed money isn't growth — it's a countdown. The one number that mattered was cash conversion, and nobody on the cap table asked for it early enough.",
    metrics: [
      { k: "RAISED", v: "$5B+" },
      { k: "AUDITOR EXIT", v: "2023" },
      { k: "TERM LOAN", v: "$1.2B" },
    ],
  },
  {
    ep: "EP.002",
    company: "PAYTM",
    verdict: "REPRICED",
    verdictTone: "amber",
    hook: "India's biggest IPO met India's most patient sellers.",
    number: "−75%",
    numberLabel: "From ₹2,150 listing price within twelve months",
    take:
      "The prospectus said 'super app.' The income statement said 'payments company with thin take rates.' Public markets read the second document. Private markets had priced the first.",
    metrics: [
      { k: "IPO SIZE", v: "₹18,300Cr" },
      { k: "LIST YEAR", v: "2021" },
      { k: "TAKE RATE", v: "<1%" },
    ],
  },
  {
    ep: "EP.003",
    company: "QUIBI",
    verdict: "POST-MORTEM",
    verdictTone: "coral",
    hook: "$1.75B raised. 180 days lived. Zero questions asked.",
    number: "$1.75B / 6mo",
    numberLabel: "Capital raised versus operating lifespan",
    take:
      "The most funded pre-launch startup in history never ran a cheap test of its core belief — that people wanted premium 10-minute video they couldn't screenshot. A ₹50L pilot would have answered it.",
    metrics: [
      { k: "FOUNDERS", v: "A-LIST" },
      { k: "LAUNCH", v: "APR 2020" },
      { k: "SHUTDOWN", v: "OCT 2020" },
    ],
  },
  {
    ep: "EP.004",
    company: "ZEPTO",
    verdict: "LIVE BET",
    verdictTone: "info",
    hook: "Two 19-year-olds versus every kirana store in India.",
    number: "10 min",
    numberLabel: "The delivery promise the entire model hangs on",
    take:
      "Quick commerce is a bet that dark-store density beats decades of neighbourhood trust. The number I'm watching isn't GMV — it's contribution margin per order after rider costs. That decides everything.",
    metrics: [
      { k: "FOUNDED", v: "2021" },
      { k: "VALUATION", v: "$5B" },
      { k: "MODEL", v: "DARK STORE" },
    ],
  },
];

export const PILLARS = [
  {
    index: "01",
    name: "Concepts, explained",
    desc: "Cap tables, liquidation preferences, MOIC vs IRR — one concept at a time, always with an Indian-context analogy.",
    format: "CAROUSEL + POST",
  },
  {
    index: "02",
    name: "Company teardowns",
    desc: "Pick a company, pull the numbers, find the moat. Every teardown has ONE number that tells the real story.",
    format: "REEL + CAROUSEL",
  },
  {
    index: "03",
    name: "Founder stories",
    desc: "The specific decisions that built or broke companies. Not biographies — inflection points.",
    format: "REEL",
  },
  {
    index: "04",
    name: "Market analysis",
    desc: "Funding patterns, sector maps, macro shifts. India-first, data-led, surprising stat up front.",
    format: "THREAD + CAROUSEL",
  },
  {
    index: "05",
    name: "Learning journal",
    desc: "What I learned, what surprised me, what I got wrong. The rawest desk — and the most read.",
    format: "LINKEDIN POST",
  },
  {
    index: "06",
    name: "Ideas + valuations",
    desc: "Spotting gaps, running back-of-envelope valuations, thinking like a VC before being one.",
    format: "POST + POLL",
  },
];

export const FIELD_NOTES = [
  {
    date: "JUL 21, 2026",
    note: "A liquidation preference isn't a term. It's the entire deal wearing a disguise.",
  },
  {
    date: "JUL 17, 2026",
    note: "Asked a founder what their burn multiple was. The pause answered before they did.",
  },
  {
    date: "JUL 12, 2026",
    note: "IRR flatters early exits. MOIC flatters patience. A fund quoting only one is telling you which flatters them.",
  },
];

export const CLOSER = {
  kicker: "The inbox is open",
  heading: "Still not a VC.",
  sub: "Following along costs nothing. Suggest a company to tear down, correct my math, or just watch me get better in public.",
  legal: "© 2026 NOTAVC — NOT INVESTMENT ADVICE. OBVIOUSLY.",
};
