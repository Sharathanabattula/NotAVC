# NotAVC

> **Not a VC. Just a student who refuses to learn this stuff quietly.**

The personal site and publishing engine of **Sharath Chandra Anabattula** —
MBA (Finance & Derivatives) at SR University, Bower School of
Entrepreneurship LEAD programme.

Company teardowns, term-sheet literacy, and the one number everyone else
skips. Documented in public, mistakes included.

---

## What's here

| Folder | What it is |
|---|---|
| `site/` | The website + `/studio` control room (Next.js 16, Tailwind 4, Framer Motion) |
| `automation/` | Standalone LinkedIn + Instagram publishers |
| `content-hq/` | Content strategy, post templates, and the platter archive |
| `brand/` | Logos, and the archived v3 design system |

## Read these in order

1. **[HOW-IT-WORKS.md](HOW-IT-WORKS.md)** — the posting machine in plain
   English. Start here.
2. **[GO-LIVE.md](GO-LIVE.md)** — the remaining manual steps to ship it.
3. **[SECTIONS.md](SECTIONS.md)** — every section of the site: what it's for,
   what moves, which file to edit.
4. **[DESIGN.md](DESIGN.md)** — the design system, and why each decision was
   made. Read before changing anything visual.

## The idea

Both established camps in this category perform authority by *hiding*
process — the institutional-editorial funds and the terminal-technical labs.
Showing corrected mistakes is the open lane.

So the site has a signature element: **the correction layer.** A crimson rule
strikes through the take everyone had, and the corrected read rises
underneath it. It appears on every teardown and in every carousel. Remove it
and this is just another dark VC template.

## The loop

1. A **platter** is written for the day — the idea, its sources, and one or
   more posts.
2. Post artwork **renders itself** from the design tokens at
   `site/app/api/og/slide`. No Canva step.
3. **Telegram asks for approval.** Nothing reaches LinkedIn or Instagram
   until it's approved — that's enforced in the database, not by convention.
4. A cron publishes approved posts on schedule and sends back the live link.

Full detail in [HOW-IT-WORKS.md](HOW-IT-WORKS.md).

## Running it

```bash
cd site
npm install
npm run dev          # http://localhost:3000
```

`/studio` needs environment variables — see [GO-LIVE.md](GO-LIVE.md).

## Stack

Next.js 16 (Turbopack) · React 19 · Tailwind CSS 4 · Framer Motion 12 ·
Supabase (Postgres) · Vercel · Telegram Bot API · Meta Graph API ·
LinkedIn REST API

## Brand archive

`brand/legacy-v3/` holds the original v3 design system — HTML carousel
templates, CSS tokens, and the old brand bible. It is **superseded** by
[DESIGN.md](DESIGN.md) and the slide renderer, and kept only for reference.

Note the v3 palette (Signal green `#0A7558`, Montserrat) is **not** the
current system. Current is Terminal Ledger: near-black, crimson `#e23e52`,
Fraunces + Instrument Sans + IBM Plex Mono.

The logos in `brand/logos/` are still current.

---

© 2026 NotAVC — not investment advice. Obviously.
