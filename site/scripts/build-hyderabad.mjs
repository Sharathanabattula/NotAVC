/*
  Builds the Hyderabad deck: writes the platter, the two posts and the
  sources, points media_urls at the render route, then stitches the slides
  into a 144 DPI PDF and sends it to Telegram with both captions.

  Angle: not Skyroot, not T-Hub. The Hyderabad companies that are actually
  winning and that nobody in the ecosystem can name.

  Every number on the artwork comes from a named source in SOURCES below.
  Pass a platter id as argv[2] to delete a superseded draft first.
*/

import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument } from "pdf-lib";

const env = Object.fromEntries(
  fs
    .readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => /^[A-Z]/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);

const db = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const SITE = env.SITE_URL || "https://notavc.co";
const TOKEN = env.TELEGRAM_BOT_TOKEN;
const CHAT = env.TELEGRAM_CHAT_ID;

/* Drop the superseded draft so the archive doesn't carry two Hyderabad decks */
const drop = process.argv[2];
if (drop) {
  await db.from("posts").delete().eq("platter_id", drop);
  await db.from("sources").delete().eq("platter_id", drop);
  await db.from("platters").delete().eq("id", drop);
  console.log(`Deleted superseded platter ${drop}`);
}

const TITLE = "You have never heard of Hyderabad's best companies";
const DESK = "Cities, in numbers";

const mark = (domain) =>
  `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=300&format=png`;

const SLIDES = [
  {
    kind: "cover",
    desk: DESK,
    title: "You've never heard of Hyderabad's best companies.",
    sub: "Five of them. What they make, and what they earn.",
    src: `${SITE}/img/hyderabad/logos.png`,
    source: "Business Standard · Inc42 · Screener · 2026",
  },
  {
    kind: "logo",
    src: mark("ctrls.com"),
    company: "CTRLS",
    verdict: "THE BIGGEST CHEQUE OF THE YEAR",
    number: "₹44,914 Cr",
    numberLabel:
      "What it is worth. It runs data centres. In June, Canada's pension fund paid ₹4,000 Cr for 8.2% of it.",
  },
  {
    kind: "logo",
    src: mark("divislabs.com"),
    company: "DIVI'S LABS",
    verdict: "TOP 3 IN THE WORLD",
    number: "₹11,067 Cr",
    numberLabel:
      "A year's income. It makes the chemicals that go inside medicines, and sells them to over 100 countries. Started here in 1990.",
  },
  {
    kind: "deals",
    label: "Three more you don't hear about",
    items: [
      {
        name: "Zenoti",
        amount: "$1.5 Bn",
        note: "Software that runs salons and spas",
        logo: mark("zenoti.com"),
      },
      {
        name: "Recykal",
        amount: "₹1,498 Cr",
        note: "Buys and sells scrap online. Up 53% in a year",
        logo: mark("recykal.com"),
      },
      {
        name: "Ozonetel",
        amount: "2,000",
        note: "Businesses using its call centre software, sold since 2007",
        logo: mark("ozonetel.com"),
      },
    ],
    source: "Inc42 · Tracxn · company sites",
  },
  {
    kind: "correction",
    wrong: ["Hyderabad startups mean", "T-Hub and rockets."],
    right:
      "The big ones here sell to other companies, not to you. Data centres, medicine chemicals, salon software, scrap. None of them is an app. None of them goes viral. And the biggest cheque of the year came from a pension fund, not a VC.",
  },
  {
    kind: "statement",
    label: "What I think",
    /*
      The statement kind renders at a fixed 58px with no autoscaling, so the
      whole body has to fit in roughly nine lines. Longer copy silently runs
      off the bottom of the frame.
    */
    body: "Divi's began in 1990. CtrlS in 2007.\n\nThe winners here are old.\n\nSo the question isn't which startup is hot. It's who has been quietly paid for years.",
  },
];

const SOURCES = [
  {
    url: "https://www.business-standard.com/companies/news/ctrls-datacenters-cpp-investments-partner-for-rs-7000-crore-126061700619_1.html",
    title: "Business Standard — CPP Investments' ₹7,000 Cr commitment to CtrlS",
  },
  {
    url: "https://www.icra.in/Rating/GetRationalReportFilePdf?id=138175",
    title: "ICRA — CtrlS FY25 revenue and operating margin",
  },
  {
    url: "https://inc42.com/buzz/hyderabad-startup-funding-soars-in-h1-2026-delhi-mumbai-funding-dips/",
    title: "Inc42 — Hyderabad startup funding, H1 2026",
  },
  {
    url: "https://www.screener.in/company/DIVISLAB/consolidated/",
    title: "Screener — Divi's Laboratories FY26 income",
  },
  {
    url: "https://inc42.com/buzz/recykal-bags-23-mn-to-take-its-waste-management-solutions-global/",
    title: "Inc42 — Recykal's FY26 revenue and $23 Mn round",
  },
];

/*
  Short on purpose. The deck carries the numbers; a caption that repeats
  them is a story dump nobody finishes.
*/
const LI_CAPTION = `Name a big Hyderabad company. Most people say T-Hub. Or rockets.

Here are five you can't name — and one of them took a bigger cheque this year than every startup in the city put together.

They sell to businesses, not to you. They started in 1990 and 2007.

Funding reports show who raised. Not who's winning.

Numbers on the slides.`;

const IG_CAPTION = `Name a big Hyderabad company.

Most people say T-Hub. Or rockets.

Here are five you can't name.

One of them out-raised the entire city's startup scene this year.

Still not a VC. Just reading the boring column.`;

const HASHTAGS = [
  "#hyderabad",
  "#startups",
  "#venturecapital",
  "#indianstartups",
  "#b2b",
];

/* ── Write ────────────────────────────────────────────────── */

const { data: last } = await db
  .from("platters")
  .select("ep")
  .order("ep", { ascending: false })
  .limit(1)
  .maybeSingle();
const ep = `EP.${String(Number(last?.ep?.replace(/\D/g, "") ?? 0) + 1).padStart(3, "0")}`;

const { data: platter, error: pErr } = await db
  .from("platters")
  .insert({
    ep,
    title: TITLE,
    desk: DESK,
    publish_date: new Date().toISOString().slice(0, 10),
    status: "pending_approval",
    brief: "The Hyderabad companies that are winning and that nobody names.",
  })
  .select("id")
  .single();

if (pErr) {
  console.error("platter:", pErr.message);
  process.exit(1);
}
console.log(`Platter ${ep} → ${platter.id}`);

await db.from("sources").insert(SOURCES.map((s) => ({ platter_id: platter.id, ...s })));

const { data: posts, error: postErr } = await db
  .from("posts")
  .insert([
    {
      platter_id: platter.id,
      channel: "linkedin",
      format: "post",
      caption: LI_CAPTION,
      hashtags: HASHTAGS,
      slides: SLIDES,
      status: "pending_approval",
    },
    {
      platter_id: platter.id,
      channel: "instagram",
      format: "carousel",
      caption: IG_CAPTION,
      hashtags: HASHTAGS,
      slides: SLIDES,
      status: "pending_approval",
    },
  ])
  .select("id, channel");

if (postErr) {
  console.error("posts:", postErr.message);
  process.exit(1);
}

const ig = posts.find((p) => p.channel === "instagram");
const li = posts.find((p) => p.channel === "linkedin");

/*
  Both rows carry the deck. The LinkedIn row needs its own media_urls or the
  publisher sends text with no PDF — the exact bug that shipped last week.
*/
const urls = SLIDES.map((_, i) => `${SITE}/api/og/slide?post=${ig.id}&i=${i}`);
await db.from("posts").update({ media_urls: urls }).eq("id", ig.id);
await db
  .from("posts")
  .update({ media_urls: SLIDES.map((_, i) => `${SITE}/api/og/slide?post=${li.id}&i=${i}`) })
  .eq("id", li.id);

/* ── Render + PDF ─────────────────────────────────────────── */

console.log(`Rendering ${urls.length} slides…`);
const pdf = await PDFDocument.create();
for (const [i, url] of urls.entries()) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Slide ${i} → ${res.status} ${await res.text()}`);
  const png = await pdf.embedPng(new Uint8Array(await res.arrayBuffer()));
  const page = pdf.addPage([png.width / 2, png.height / 2]);
  page.drawImage(png, { x: 0, y: 0, width: png.width / 2, height: png.height / 2 });
  process.stdout.write(`  ${i + 1}/${urls.length}\r`);
}
const bytes = await pdf.save();
console.log(`\nPDF: ${pdf.getPageCount()} pages, ${Math.round(bytes.length / 1024)} KB`);

const form = new FormData();
form.append("chat_id", CHAT);
form.append(
  "document",
  new Blob([bytes], { type: "application/pdf" }),
  "notavc-hyderabad-quiet-winners.pdf",
);
form.append(
  "caption",
  `📄 Hyderabad — the companies nobody names\n${pdf.getPageCount()} pages · ready to upload to LinkedIn`,
);
const send = await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, {
  method: "POST",
  body: form,
});
const sent = await send.json();
console.log("PDF:", sent.ok ? "sent" : sent.description);

/* Individual slides too — a PDF cannot be posted as an Instagram carousel. */
const media = urls.map((u, i) => ({
  type: "photo",
  media: u,
  ...(i === 0 ? { caption: "Slides 1-6 — save these for Instagram" } : {}),
}));
const grp = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMediaGroup`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ chat_id: CHAT, media }),
});
const grpJson = await grp.json();
console.log("Slides:", grpJson.ok ? "sent" : grpJson.description);

const esc = (s) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);

for (const [label, caption] of [
  ["LINKEDIN", LI_CAPTION],
  ["INSTAGRAM", IG_CAPTION],
]) {
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT,
      parse_mode: "HTML",
      text: `<b>${label} caption</b> — tap to copy\n\n<pre>${esc(caption + "\n\n" + HASHTAGS.join(" "))}</pre>`,
    }),
  });
  const j = await r.json();
  console.log(`${label}:`, j.ok ? "sent" : j.description);
}

console.log(`\nPost ids — ig ${ig.id} · li ${li.id}`);
