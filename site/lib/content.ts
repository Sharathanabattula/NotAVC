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
  kicker: "EP.000 — Why this exists",
  heading: "The headline said ₹800Cr raised. The filing said convertible debt.",
  paragraphs: [
    "I'm Sharath. MBA student, SR University, finance and derivatives. Nobody pays me to have an opinion about startups, which is most of the reason you should read this.",
    "This started because a funding announcement made me feel stupid. Everyone was congratulating a company on a raise. I read it three times and still couldn't tell what had actually happened. So I found the filing. Most of the money was debt converting, not new capital. Not a lie. Just a story told the way the people telling it wanted it to land.",
    "Now I check. Every teardown here is me pulling the actual numbers and writing down the exact point where the press release and the arithmetic stop agreeing. When I get it wrong — and I have — the wrong version stays on the page with a line through it.",
  ],
  pullQuote:
    "You don't need a Sand Hill Road address to read a balance sheet. You need an afternoon and no reason to flatter anyone.",
  /* Margin annotations — the notes in the left gutter */
  margin: [
    { label: "Filed", note: "EP.000" },
    { label: "Status", note: "Open. Revised when wrong" },
    { label: "Rule", note: "No claim without a number" },
  ],
  stats: [
    { value: "₹0", label: "Under management" },
    { value: "₹0", label: "Paid to say this" },
    { value: "04", label: "Desks" },
    { value: "100%", label: "Corrections left visible" },
  ],
};

export const BOOT_LINES = [
  "NOTAVC // READING THE FILINGS SO YOU DON'T HAVE TO",
  "> press releases ignored .......... OK",
  "> filings pulled [04] ............. OK",
  "> corrections logged .............. OK",
  "> written by ....... SHARATH C. ANABATTULA",
  "> paid by .......... NOBODY",
  "> status ........... NOT A VC",
];

export const FOUNDER = {
  kicker: "Who's writing this",
  heading: "I read the filings that the headlines skip.",
  paragraphs: [
    "MBA at SR University — finance and derivatives — and part of the Bower School of Entrepreneurship's VC/PE programme. Deal simulations, term-sheet negotiations, Indian case studies. The Zomato and Paytm IPOs, taken apart line by line.",
    "The first real term sheet I read wasn't about valuation at all. It was about who gets to say no. Twelve clauses of control, and the number everyone quotes — the valuation — barely mattered next to them. That's the kind of thing nobody tells you until you're in the room.",
    "I'm not an investor and I'm not pretending to be. I'm the guy in the back of the class who looked up the filing while everyone else was reading the press release.",
  ],
  credentials: [
    { k: "PROGRAMME", v: "Bower School — LEAD VC/PE" },
    { k: "DEGREE", v: "MBA · Finance & Derivatives" },
    { k: "INSTITUTION", v: "SR University" },
    { k: "CONFLICTS", v: "None. Nobody pays me." },
  ],
  pull: "If you've ever read a funding headline and thought \"am I stupid, or is this spin?\" — you're the reason this exists.",
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
  kicker: "The wire — sundays",
  heading: "One company, one number, every Sunday",
  sub: "Not a news roundup. One company whose filing says something different from its press release, the number that gives it away, and the sources so you can check my work.",
  cadence: "Sundays, 08:00 IST",
};

export const CLOSER = {
  kicker: "Argue with me",
  heading: "Still not a VC.",
  sub: "If I've got a number wrong, tell me — I'd rather be corrected here than be confidently wrong in front of a fund later. Got a company whose press release doesn't match its filings? Send it.",
  legal: "© 2026 NOTAVC — NOT INVESTMENT ADVICE. OBVIOUSLY.",
};
