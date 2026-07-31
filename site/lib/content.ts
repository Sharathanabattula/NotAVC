/*
  All site copy lives here. Voice rules from DESIGN-SYSTEM.md apply:
  raw, first person, one number per claim, no banned words.

  Plain language is a hard rule, not a preference. The reader is not assumed
  to know what a filing, a term sheet or a take rate is — trade words either
  get said in normal English or get explained the first time they appear.
  "Filing" in particular is out: it is the single word that made the old copy
  read like someone claiming insider access rather than a student working
  something out.

  The position is a student learning this properly in public. Not an
  advisor, not an investor, and never implied to be either. What is claimed
  instead is the work: take a company apart, say it in normal words, leave
  every source on the page.
*/

export const SOCIAL = {
  linkedin: "https://www.linkedin.com/in/sharathanabattula",
  instagram: "https://www.instagram.com/notavc.co",
  email: "mailto:sharathanabattula@gmail.com",
};

/*
  Questions, not vocabulary. The old ticker was twelve pieces of trade
  jargon with nothing attached — impressive to people who already knew the
  words and useless to everyone else. These are the questions the breakdowns
  actually answer, which is the same signal without the gatekeeping.
*/
export const TICKER_TERMS = [
  "WHO PAYS FIRST",
  "WHAT IT COSTS TO EARN ₹1",
  "WHERE THE MONEY WENT",
  "BORROWED, OR RAISED",
  "GROWING BUT LOSING MORE",
  "WHO GETS PAID WHEN IT SELLS",
  "THE NUMBER NOBODY PRINTED",
  "WHO GETS TO SAY NO",
  "PROFIT ON PAPER",
  "STILL HIRING, STOPPED GROWING",
  "PAID FOR, OR EARNED",
  "THE BIT LEFT OUT",
];

export const MANIFESTO = {
  kicker: "EP.000 — Why this exists",
  heading: "Everyone reads the announcement. Almost nobody reads the accounts.",
  paragraphs: [
    "I'm Sharath. MBA student at SR University, studying finance. Nobody pays me to have an opinion about startups, which is most of the reason you should read this.",
    "This started because funding announcements kept making me feel stupid. Everyone would be congratulating a company on the money it had raised, and I'd read it three times and still not be able to say what had actually happened. Then I found out that every company in India has to publish its accounts, and that almost nobody bothers to look at them. That's the version with no adjectives in it, and it's free.",
    "So that's what this is. Pick a company, go through the numbers, and write down what's there in normal words — including the point where the announcement and the arithmetic stop agreeing. Usually nobody is lying. The story just gets told the way the people telling it want it to land. When I get something wrong, the wrong version stays on the page with a line through it.",
  ],
  pullQuote:
    "You don't need to work at a fund to read a set of accounts. You need an afternoon and no reason to flatter anyone.",
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
  "NOTAVC // THE NUMBERS, NOT THE HEADLINE",
  "> announcements set aside ......... OK",
  "> accounts read [04] .............. OK",
  "> corrections logged .............. OK",
  "> written by ....... SHARATH C. ANABATTULA",
  "> paid by .......... NOBODY",
  "> status ........... NOT A VC",
];

export const FOUNDER = {
  kicker: "Who's writing this",
  heading: "I'm a student. I'm learning this properly, out loud.",
  paragraphs: [
    "MBA at SR University — finance and derivatives — and part of the Bower School of Entrepreneurship's VC/PE programme. That's where I'm picking this up: sessions, case studies, and a lot more reading than I expected to enjoy.",
    "What keeps pulling me in is how different the same company looks depending on where you're standing. The announcement picks one angle. The numbers underneath pick another. Usually nobody is lying — they're just describing different things, and only one of them tells you whether the business actually works.",
    "I'm not an investor or an advisor, and I'm not going to pretend to be either. I'm outside all of it, looking at the same companies from a different angle. What I can do is take one apart properly, say what I find in words that don't need a finance degree, and leave every source on the page so you can check me — and tell me when I'm wrong.",
  ],
  credentials: [
    { k: "PROGRAMME", v: "Bower School — LEAD VC/PE" },
    { k: "DEGREE", v: "MBA · Finance & Derivatives" },
    { k: "INSTITUTION", v: "SR University" },
    { k: "CONFLICTS", v: "None. Nobody pays me." },
  ],
  pull: "If you've ever read a funding headline and thought \"am I stupid, or is this spin?\" — you're the reason this exists.",
};

/*
  The research document behind one breakdown. This is the thing the site
  actually promises — "every number here has a receipt" is only true if the
  receipts are on a page somebody can open.

  `workings` is the arithmetic, one row per figure, each with where it came
  from. `notes` is the reasoning in prose. `sources` is every link used.
*/
export type Research = {
  summary: string;
  period: string;
  workings: { k: string; v: string; note: string }[];
  notes: { heading: string; body: string }[];
  sources: { title: string; url: string }[];
};

export type Teardown = {
  /* Keys the archive and the React list. Deliberately never rendered. */
  ep: string;
  /* URL segment for the breakdown's own page */
  slug: string;
  company: string;
  /*
    Finds the matching platter in Supabase so the page can show the carousel
    that was actually published. Absent for breakdowns that predate the
    platter system — those pages simply render without a slide preview.
  */
  platterMatch?: string;
  research?: Research;
  /* Sits where the episode number used to — tells the reader what they're
     looking at rather than how many came before it. */
  sector: string;
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
  /*
    Newest first. This one is the current carousel, so the page and the feed
    say the same thing — every figure is from the FY25 accounts as reported
    by Entrackr, and re-checked against that source.
  */
  {
    ep: "EP.005",
    slug: "sids-farm",
    platterMatch: "%Sid's Farm%",
    company: "SID'S FARM",
    sector: "DAIRY · HYDERABAD",
    verdict: "LIVE BET",
    verdictTone: "info",
    hook: "He left Intel and bought 20 cows. Ten years on, that's a ₹168 Cr business losing ₹27 Cr.",
    number: "₹1.17",
    numberLabel: "Spent to earn one rupee of sales in FY25, up from ₹1.09",
    take:
      "The brand is real and so is the product. But 75 paise of every rupee goes straight back out to buy the milk, which leaves 25 paise to cover everything else — and no amount of growth lifts that ceiling on its own. The number I actually want isn't public: whether customers pay for the month before the farmers do.",
    wrongTake: "A ₹81 Cr raise means the model is working.",
    corrected:
      "A big loss is fine if the business gets more efficient as it grows. Sales growing while efficiency drops is the harder problem.",
    metrics: [
      { k: "FY25 SALES", v: "₹168 Cr" },
      { k: "MILK COST", v: "75% of sales" },
      { k: "LOSS", v: "₹27 Cr" },
    ],
    research: {
      period: "FY25 accounts, filed with the Registrar of Companies",
      summary:
        "Sid's Farm raised ₹81 Cr this month. Its sales grew 38% last year, which sounds like the raise is working. But its costs grew 47% over the same period, which means it got less efficient while it got bigger. This page shows every figure I used, where each one came from, and the one number I couldn't find.",
      workings: [
        {
          k: "SALES",
          v: "₹168 Cr",
          note: "Up 38% from ₹122 Cr the year before.",
        },
        {
          k: "COSTS",
          v: "₹196 Cr",
          note: "Up 47% from ₹133.5 Cr. Growing faster than sales — that gap is the whole story.",
        },
        {
          k: "LOSS",
          v: "₹27 Cr",
          note: "Up from ₹10.5 Cr. Roughly two and a half times bigger.",
        },
        {
          k: "COST TO EARN ₹1",
          v: "₹1.17",
          note: "₹196 Cr of costs ÷ ₹168 Cr of sales. Last year the same sum gave ₹1.09.",
        },
        {
          k: "MILK FROM FARMERS",
          v: "₹126 Cr",
          note: "₹126 Cr ÷ ₹168 Cr = 75% of sales. Leaves 25 paise in the rupee for everything else.",
        },
        {
          k: "DELIVERY + COLD STORAGE",
          v: "₹13 Cr",
          note: "Distribution ₹8 Cr plus transport ₹5 Cr, or 7.7% of sales.",
        },
        {
          k: "ADVERTISING",
          v: "₹7 Cr",
          note: "Up from ₹3.6 Cr. Nearly doubled, while sales grew 38%.",
        },
        {
          k: "CASH IN THE BANK",
          v: "₹1 Cr",
          note: "As at March 2025, against ₹45 Cr of current assets.",
        },
      ],
      notes: [
        {
          heading: "What ₹1.17 actually means",
          body: "It cost the company ₹1.17 to bring in one rupee of sales. The year before, the same rupee cost ₹1.09. So the business got bigger and less efficient at the same time. That combination is the one worth watching, because scale makes it worse rather than better — every extra rupee of sales brings a slightly larger loss with it.",
        },
        {
          heading: "Why 25 paise is the real constraint",
          body: "Three quarters of every rupee that comes in goes straight back out to buy milk from farmers, before anything is delivered to anybody. That leaves 25 paise to cover delivery, cold storage, salaries, advertising and everything else. It is a hard ceiling: no amount of growth lifts it, because buying more milk costs proportionally more. The only ways up are paying farmers less, charging customers more, or selling things with more margin in them than plain milk.",
        },
        {
          heading: "The part that is genuinely good",
          body: "Delivery and cold storage together come to 7.7% of sales. For a business that puts fresh milk at your door every morning, that is better than the 8–15% range you would normally expect from home delivery. Whatever else is going on, the logistics are being run well — and that is the part most people assume is the problem.",
        },
        {
          heading: "The number I could not find",
          body: "A subscription business can be funded by its own customers. If people pay for the month upfront and the farmers get paid on a later cycle, the company is holding other people's money the whole time — the same arrangement that makes Zomato and Swiggy work, and it would make a loss on paper mean something very different. The accounts show ₹1 Cr of cash against ₹45 Cr of current assets, but they don't say who pays first. That is the first thing I would ask.",
        },
        {
          heading: "What I am not saying",
          body: "This is not a claim that the business is failing, and it is not advice about anything. It is one year of numbers read carefully. A single year cannot separate a company investing deliberately ahead of growth from one losing control of its costs — that takes three, and there are only two here.",
        },
      ],
      sources: [
        {
          title: "Sid's Farm FY25 accounts — Entrackr",
          url: "https://entrackr.com/fintrackr/sids-farm-posts-rs-168-cr-revenue-in-fy25-losses-surge-26x-10983599",
        },
        {
          title: "Sid's Farm raises ₹81 Cr pre-Series B — YourStory",
          url: "https://yourstory.com/2026/07/sids-farm-raises-over-rs-81-cr-pre-series-b-round",
        },
        {
          title: "Sid's Farm — product range and pack imagery",
          url: "https://sidsfarm.com/collections/all",
        },
      ],
    },
  },
  {
    ep: "EP.001",
    slug: "byjus",
    company: "BYJU'S",
    sector: "EDTECH",
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
    slug: "paytm",
    company: "PAYTM",
    sector: "FINTECH",
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
    slug: "quibi",
    company: "QUIBI",
    sector: "STREAMING",
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
    slug: "zepto",
    company: "ZEPTO",
    sector: "QUICK COMMERCE",
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
    name: "Company breakdowns",
    desc: "Pick a company, pull the numbers, find the moat. Every teardown has ONE number that tells the real story.",
    format: "CAROUSEL · TUE",
  },
  {
    index: "02",
    name: "Concepts, explained",
    desc: "How fast the money is going. Who gets paid first when a company sells. Why two funds can quote different returns on the same deal. One idea at a time, in normal words, always with an Indian company attached — never a definition without a consequence.",
    format: "SINGLE POST · THU",
  },
  {
    index: "03",
    name: "The uncomfortable",
    desc: "The ₹800 Cr \"raise\" that was mostly old debt. The unicorn that stopped growing but never stopped hiring. The bit the announcement left out — usually because it was boring, occasionally because it wasn't.",
    format: "CAROUSEL",
  },
  {
    index: "04",
    name: "Founder stories",
    desc: "The specific decisions that built or broke companies. Not biographies — the inflection point and the number behind it.",
    format: "CAROUSEL · REEL",
  },
];

/*
  The method section. This is the honest version of a "proof of work" block:
  it claims a process, not a track record. No counters of things read, no
  advisory case studies, no client results — none of that has happened yet,
  and inventing it is the one thing that would make everything else here
  unreadable.

  What it does claim is checkable on any breakdown on the site.
*/
export const METHOD = {
  kicker: "How a breakdown gets made",
  heading: "Every number here has a receipt.",
  sub: "This isn't insider access. It's a public document, an afternoon, and the willingness to write down the boring part.",
  steps: [
    {
      index: "01",
      name: "Start where everyone else starts",
      desc: "A funding announcement, a launch, a shutdown. Whatever the timeline is repeating that week, and whatever everyone seems to agree about.",
    },
    {
      index: "02",
      name: "Go to the company's own numbers",
      desc: "Every company in India has to publish its accounts. That is the version with no adjectives in it, and it is free to read.",
    },
    {
      index: "03",
      name: "Find where the two stop agreeing",
      desc: "Not to catch anyone out. Most of the time the gap is just the part that got left out for being boring — and the boring part is usually the part that decides whether the business works.",
    },
    {
      index: "04",
      name: "Write it plainly, and show the sources",
      desc: "One number per claim. A link for every number. If you think I've got it wrong, you already have everything you need to prove it — and the wrong version stays up with a line through it.",
    },
  ],
};

export const FIELD_NOTES = [
  {
    date: "JUL 21, 2026",
    note: "\"Who gets paid first when the company sells\" isn't a detail. It's most of the deal, wearing a disguise.",
  },
  {
    date: "JUL 17, 2026",
    note: "A company can be growing and getting weaker at the same time. That combination is the one worth watching.",
  },
  {
    date: "JUL 12, 2026",
    note: "Two funds can describe the same deal and both come out looking good. One is measuring speed, the other size. Neither is lying.",
  },
];

export const NEWSLETTER = {
  kicker: "The wire — sundays",
  heading: "One company, one number, every Sunday",
  sub: "Not a news roundup. One company whose own numbers say something different from its announcement, the number that gives it away, and every source I used so you can check my work.",
  cadence: "Sundays, 08:00 IST",
};

export const CLOSER = {
  kicker: "Argue with me",
  heading: "Still not a VC.",
  sub: "If I've got a number wrong, tell me — I'd rather be corrected here than be confidently wrong in front of a fund later. Know a company whose announcement doesn't match its numbers? Send it.",
  legal: "© 2026 NOTAVC — NOT INVESTMENT ADVICE. OBVIOUSLY.",
};
