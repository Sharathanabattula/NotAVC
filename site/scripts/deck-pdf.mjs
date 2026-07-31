/*
  Builds the deck as a print-quality PDF and sends it to Telegram, so a post
  can be published by hand from the phone instead of going through the
  scheduler.

  Two things matter for quality. The slides are fetched at their native
  1080x1350 and embedded unchanged — no re-encoding. And each page is laid
  out at half those dimensions, which puts the image at 144 DPI rather than
  the 72 DPI you get when page points equal image pixels.

  Sent with sendDocument rather than sendPhoto: Telegram re-compresses
  photos and would undo the point of this.
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

const TOKEN = env.TELEGRAM_BOT_TOKEN;
const CHAT = env.TELEGRAM_CHAT_ID;

const match = process.argv[2] || "%Sid%Farm%";

const { data: platter } = await db
  .from("platters")
  .select("id, ep, title")
  .ilike("title", match)
  .single();

const { data: posts } = await db
  .from("posts")
  .select("channel, caption, hashtags, media_urls")
  .eq("platter_id", platter.id);

const ig = posts.find((p) => p.channel === "instagram");
const li = posts.find((p) => p.channel === "linkedin");
const urls = ig?.media_urls ?? [];

if (!urls.length) {
  console.error("No slides on the Instagram row — nothing to build.");
  process.exit(1);
}

console.log(`Building ${urls.length} slides at full resolution…`);
const pdf = await PDFDocument.create();
for (const [i, url] of urls.entries()) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Slide ${i} → ${res.status}`);
  const png = await pdf.embedPng(new Uint8Array(await res.arrayBuffer()));
  const w = png.width / 2;
  const h = png.height / 2;
  const page = pdf.addPage([w, h]);
  page.drawImage(png, { x: 0, y: 0, width: w, height: h });
  process.stdout.write(`  ${i + 1}/${urls.length}\r`);
}
const bytes = await pdf.save();
console.log(`\nPDF: ${pdf.getPageCount()} pages, ${Math.round(bytes.length / 1024)} KB, 144 DPI`);

const slug = platter.title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "")
  .slice(0, 48);
const filename = `notavc-${slug}.pdf`;

/* Document, not photo — Telegram re-compresses photos. */
const form = new FormData();
form.append("chat_id", CHAT);
form.append("document", new Blob([bytes], { type: "application/pdf" }), filename);
form.append(
  "caption",
  `📄 ${platter.title}\n${pdf.getPageCount()} pages · ready to upload to LinkedIn`,
);

const send = await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, {
  method: "POST",
  body: form,
});
const sent = await send.json();
if (!sent.ok) {
  console.error("sendDocument failed:", sent.description);
  process.exit(1);
}
console.log("✓ PDF sent to Telegram");

/*
  Captions go as their own messages in <pre>, which Telegram renders with a
  copy button — the point is to be able to paste them straight into the app.
*/
const esc = (s) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]);

for (const [label, post] of [
  ["LINKEDIN", li],
  ["INSTAGRAM", ig],
]) {
  if (!post) continue;
  const tags = post.hashtags?.length ? `\n\n${post.hashtags.join(" ")}` : "";
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT,
      parse_mode: "HTML",
      text: `<b>${label} caption</b> — tap to copy\n\n<pre>${esc(post.caption + tags)}</pre>`,
    }),
  });
  const j = await r.json();
  console.log(`  ${label} caption:`, j.ok ? "sent" : j.description);
}
