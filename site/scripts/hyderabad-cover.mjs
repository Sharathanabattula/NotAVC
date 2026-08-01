/*
  Builds the cover thumbnail for the Hyderabad deck: the five company marks
  in a row on paper.

  The cover image band is 952x300 with objectFit: cover, so this renders at
  2x that aspect and the marks are sized to a common HEIGHT rather than a
  common width — capping width makes a wide wordmark and a square mark look
  like different weights on the same row.
*/

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const TOKEN = "pk_X-1ZO13GSgeOoUrIuJ6GMQ";
const DOMAINS = ["ctrls.com", "divislabs.com", "zenoti.com", "recykal.com", "ozonetel.com"];

const W = 1904;
const H = 600;
const GAP = 28;
const PAD = 40;
const MAX_H = 150;

/* Plate geometry. Two of the five marks are drawn for a dark background and
   arrive as solid black or navy blocks; on bare paper they read as errors.
   Every mark sits on the same white plate instead, which makes those blocks
   look like a logo on a card rather than a rendering fault. */
const PLATE_PAD_X = 34;
const PLATE_PAD_Y = 30;
const CANVAS = "#F2F1ED";

/* logo.dev resets the connection often enough that one attempt is a coin flip */
async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return r;
      if (i === tries - 1) throw new Error(`${r.status}`);
    } catch (e) {
      if (i === tries - 1) throw e;
    }
    await new Promise((r) => setTimeout(r, 800 * (i + 1)));
  }
}

const raw = [];
for (const d of DOMAINS) {
  const res = await get(`https://img.logo.dev/${d}?token=${TOKEN}&size=512&format=png`);
  /*
    Trim first. logo.dev pads every mark into a square, so untrimmed aspect
    ratios are all 1:1 and the row ends up as five identical boxes.
  */
  const buf = await sharp(Buffer.from(await res.arrayBuffer())).trim().png().toBuffer();
  const meta = await sharp(buf).metadata();
  raw.push({ d, buf, aspect: meta.width / meta.height });
  console.log(`${d}  ${meta.width}x${meta.height}`);
}

/*
  Solve for the common mark HEIGHT that makes the row of plates fill the
  width. Each plate is the mark plus fixed padding, so the width a mark of
  height h contributes is h*aspect + 2*PLATE_PAD_X.
*/
const plateSlack = raw.length * PLATE_PAD_X * 2 + GAP * (raw.length - 1);
const avail = W - PAD * 2 - plateSlack;
const aspectSum = raw.reduce((s, r) => s + r.aspect, 0);
const height = Math.min(MAX_H, Math.floor(avail / aspectSum));
const plateH = height + PLATE_PAD_Y * 2;

const tiles = [];
let x = PAD;
for (const r of raw) {
  const w = Math.round(height * r.aspect);
  const plateW = w + PLATE_PAD_X * 2;
  const mark = await sharp(r.buf).resize(w, height, { fit: "inside" }).png().toBuffer();

  const plate = await sharp({
    create: { width: plateW, height: plateH, channels: 4, background: "#FFFFFF" },
  })
    .composite([{ input: mark, left: PLATE_PAD_X, top: PLATE_PAD_Y }])
    .png()
    .toBuffer();

  /* Rounded corners + hairline, drawn as SVG and composited over the plate */
  const mask = Buffer.from(
    `<svg width="${plateW}" height="${plateH}"><rect x="0" y="0" width="${plateW}" height="${plateH}" rx="18" ry="18" fill="#fff"/></svg>`,
  );
  const edge = Buffer.from(
    `<svg width="${plateW}" height="${plateH}"><rect x="0.5" y="0.5" width="${plateW - 1}" height="${plateH - 1}" rx="18" ry="18" fill="none" stroke="#E5E5E5" stroke-width="1"/></svg>`,
  );

  tiles.push({
    input: await sharp(plate)
      .composite([
        { input: mask, blend: "dest-in" },
        { input: edge, blend: "over" },
      ])
      .png()
      .toBuffer(),
    left: Math.round(x),
    top: Math.round((H - plateH) / 2),
  });
  x += plateW + GAP;
}

/* Centre the finished row rather than leaving the slack on the right */
const used = x - GAP - PAD;
const shift = Math.round((W - PAD * 2 - used) / 2);
for (const t of tiles) t.left += shift;

const out = path.join(process.cwd(), "public", "img", "hyderabad");
fs.mkdirSync(out, { recursive: true });

await sharp({ create: { width: W, height: H, channels: 3, background: CANVAS } })
  .composite(tiles)
  .png()
  .toFile(path.join(out, "logos.png"));

console.log(`\nWrote public/img/hyderabad/logos.png — ${W}x${H}, marks at ${height}px tall`);
