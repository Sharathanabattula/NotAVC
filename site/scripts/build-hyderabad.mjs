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

const TITLE = "Hyderabad's biggest cheque this year did not go to a startup";
const DESK = "Cities, in numbers";

const SLIDES = [
  {
    kind: "cover",
    desk: DESK,
    title: "Hyderabad's biggest cheque this year didn't go to a startup.",
    sub: "It went to a company most people in the ecosystem can't name.",
    source: "Business Standard · Inc42 · ICRA · 2026",
  },
  {
    kind: "number",
    value: "₹44,914 Cr",
    label: "What CtrlS was valued at in June 2026",
    icon: "chart",
    note: "Canada's pension fund put in ₹4,000 Cr for 8.2%, plus up to ₹3,000 Cr more into a joint venture. Hyderabad's entire reported startup funding for the first half of 2026 was $226 Mn.",
  },
  {
    kind: "number",
    value: "Top 3 in the world",
    label: "Where Divi's Labs ranks among API makers",
    icon: "scale",
    note: "₹11,067 Cr of income in FY26. Ships the ingredients inside your medicines to over 100 countries. Started in Hyderabad in 1990 — and almost nobody who talks about this city's startups has said the name.",
  },
  {
    kind: "list",
    label: "Three more that don't trend",
    icon: "store",
    items: [
      {
        k: "ZENOTI",
        v: "Software for salons and spas. The world's first unicorn in that category, valued at $1.5 Bn.",
      },
      {
        k: "RECYKAL",
        v: "Scrap, run as a marketplace. ₹1,498 Cr of gross revenue in FY26, up 53% in a year.",
      },
      {
        k: "OZONETEL",
        v: "Cloud call centres since 2007. Roughly 2,000 business customers, built without a headline round.",
      },
    ],
  },
  {
    kind: "correction",
    wrong: ["Hyderabad's startup story", "is T-Hub and rockets."],
    right:
      "The city's biggest companies sell to other businesses — data centres, drug ingredients, salon software, scrap. Not one of them is a consumer app. Not one of them trends. And the largest cheque of the year came from a Canadian pension fund, not a VC.",
  },
  {
    kind: "statement",
    label: "What I keep thinking about",
    /*
      The statement kind renders at a fixed 58px with no autoscaling, so the
      whole body has to fit in roughly nine lines. Longer copy silently runs
      off the bottom of the frame.
    */
    body: "Divi's 1990. CtrlS 2007. Zenoti 2010.\n\nThe winners here are 15 to 35 years old.\n\nThe question isn't which startup is hot. It's which boring B2B company is eight years in with no press.",
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

const LI_CAPTION = `Hyderabad's biggest funding event of 2026 was not a startup round.

In June, Canada's pension fund committed up to ₹7,000 crore to CtrlS — ₹4,000 crore for 8.2%, the rest into a joint venture — at a valuation of ₹44,914 crore.

For scale: every startup in Hyderabad raised $226 million between January and June.

One data centre company, founded in 2007, out-raised the entire city's startup ecosystem several times over. And I would guess most people reading this have never said its name out loud.

That is the pattern I keep running into with Hyderabad.

Divi's Labs is a top three API maker in the world. ₹11,067 crore of income in FY26, shipping to over 100 countries. It has been in Hyderabad since 1990.

Zenoti built the world's first salon and spa software unicorn.

Recykal did ₹1,498 crore of gross revenue in FY26 selling scrap as a marketplace, up 53%.

Ozonetel has run cloud call centres since 2007 without a headline round.

None of them are consumer apps. None of them trend. All of them sell to other businesses.

The founding years are the part that stayed with me. 1990. 2007. 2007. 2010. The companies doing best here have been at it for fifteen to thirty-five years.

A funding table tells you how much money went in this half. It does not tell you who is winning.

I am a student, not an investor. But if I were writing cheques, I would stop asking which Hyderabad startup is hot and start asking which unglamorous B2B company here is eight years in, has real customers, and has never been written about.

Numbers: Business Standard, ICRA, Inc42, Screener.`;

const IG_CAPTION = `Hyderabad's biggest cheque of 2026 wasn't a startup round.

₹7,000 Cr from Canada's pension fund into CtrlS. A data centre company founded in 2007.

Every startup in the city raised $226 Mn in the same six months.

One company you can't name beat the whole ecosystem.

Same story everywhere here:

Divi's Labs — top 3 API maker on earth, ₹11,067 Cr income.
Zenoti — the world's first salon software unicorn.
Recykal — ₹1,498 Cr from scrap, up 53%.
Ozonetel — cloud call centres since 2007, no headline round.

Not one consumer app. Not one that trends.

Founded 1990. 2007. 2007. 2010.

The funding table shows who raised. It doesn't show who's winning.

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
