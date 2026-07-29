/*
  All site copy lives here. Voice rules from DESIGN-SYSTEM.md apply:
  raw, first person, one number per claim, no banned words.
*/

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/sharathanabattula",
  instagram: "https://www.instagram.com/notavc.co",
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
  /* Margin annotations — the notes in the left gutter */
  margin: [
    { label: "Filed", note: "EP.000 — thesis" },
    { label: "Status", note: "Open, revised in public" },
    { label: "Rule", note: "One number per claim" },
  ],
  stats: [
    { value: "₹0", label: "Assets under management" },
    { value: "04", label: "Desks, always open" },
    { value: "EP.∞", label: "Numbered, never expiring" },
    { value: "100%", label: "Work shown, errors included" },
  ],
};

export const BOOT_LINES = [
  "NOTAVC // VENTURE INTELLIGENCE TERMINAL",
  "> mounting archive ................ OK",
  "> desks online [04] ............... OK",
  "> teardowns indexed [04] .......... OK",
  "> analyst .......... SHARATH C. ANABATTULA",
  "> credential ....... BOWER SCHOOL — VC/PE",
  "> status ........... NOT A VC",
];

export const FOUNDER = {
  kicker: "The analyst",
  heading: "I'm Sharath. I'm not a VC — I'm the guy doing the homework in public.",
  paragraphs: [
    "MBA student at SR University, specialising in Finance & Derivatives, and part of the Bower School of Entrepreneurship's VC/PE programme — deal simulations, term-sheet negotiations, and Indian case studies like the Zomato and Paytm IPOs.",
    "I fell for two things at once: finance and startups. Finance because the numbers never flatter anyone for long. Startups because they're the only place where a spreadsheet and a stubborn idea can fight it out in public.",
    "So I stopped waiting for a fund to hire me before I was allowed to think like an investor. Every teardown here is me doing the work early, out loud, with the mistakes left in.",
  ],
  credentials: [
    { k: "PROGRAMME", v: "Bower School — LEAD VC/PE" },
    { k: "DEGREE", v: "MBA · Finance & Derivatives" },
    { k: "INSTITUTION", v: "SR University" },
    { k: "BASED", v: "India · Building in public" },
  ],
  pull: "Nobody gave me a fund. So I gave myself the syllabus.",
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
  /* The correction layer — the consensus read, struck through in crimson */
  wrongTake: string;
  /* What the numbers actually said, written in the margin */
  corrected: string;
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
    wrongTake: "India's edtech giant is scaling faster than anyone can copy.",
    corrected:
      "It was scaling acquisitions, not learning outcomes. Revenue recognition did the rest.",
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
    wrongTake: "A super app deserves a super-app multiple.",
    corrected:
      "Take rate under 1% is a payments rail, not a platform. Rails price like rails.",
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
    wrongTake: "Hollywood pedigree plus $1.75B de-risks the launch.",
    corrected:
      "Pedigree funded the build, never the test. Untested belief costs the same at any raise size.",
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
    wrongTake: "GMV growth proves quick commerce works.",
    corrected:
      "GMV is a volume claim, not a margin one. Watch contribution per order after rider cost.",
    metrics: [
      { k: "FOUNDED", v: "2021" },
      { k: "VALUATION", v: "$5B" },
      { k: "MODEL", v: "DARK STORE" },
    ],
  },
];

/*
  Four desks, cut from six. Six read as a menu rather than a position, and
  three of them were crowded by podcasts or risky for a student to publish.
  What survives is what the correction layer has teeth on.
*/
export const PILLARS = [
  {
    index: "01",
    name: "Company teardowns",
    desc: "Pick a company, pull the numbers, find the moat. Every teardown has ONE number that tells the real story.",
    format: "CAROUSEL · TUE",
  },
  {
    index: "02",
    name: "Concepts, explained",
    desc: "Burn multiple, liquidation preferences, MOIC vs IRR — one concept at a time, always with an Indian company attached. Never a definition without a consequence.",
    format: "SINGLE POST · THU",
  },
  {
    index: "03",
    name: "The uncomfortable",
    desc: "The ₹800Cr \"raise\" that was converted debt. The unicorn that stopped growing but never stopped hiring. What the press release left out.",
    format: "CAROUSEL",
  },
  {
    index: "04",
    name: "Founder stories",
    desc: "The specific decisions that built or broke companies. Not biographies — the inflection point and the number behind it.",
    format: "CAROUSEL · REEL",
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

export const NEWSLETTER = {
  kicker: "The wire — weekly",
  heading: "One startup, torn down, every Sunday",
  sub: "Not a link roundup. One company, one number that decides its fate, and the take I had to correct. Written the same week the news breaks, not recycled from a thread.",
  cadence: "Sundays, 08:00 IST",
};

export const CLOSER = {
  kicker: "The inbox is open",
  heading: "Still not a VC.",
  sub: "Following along costs nothing. Suggest a company to tear down, correct my math, or just watch me get better in public.",
  legal: "© 2026 NOTAVC — NOT INVESTMENT ADVICE. OBVIOUSLY.",
};
