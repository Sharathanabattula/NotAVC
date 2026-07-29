# How the posting machine works

Plain English. No code. This is the whole system in one page.

---

## The one-line version

> A platter gets written → artwork renders itself → Telegram asks you →
> you tap Approve → it posts at the scheduled time → Telegram sends you the
> live link.

**Nothing reaches LinkedIn or Instagram unless you tapped Approve.** That is
enforced in the database, not by convention.

---

## The five stages

```
   1. WRITE            2. RENDER           3. ASK
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │ Platter  │───────▶│ Artwork  │───────▶│ Telegram │
   │ + sources│        │ auto-made│        │  card    │
   └──────────┘        └──────────┘        └────┬─────┘
                                                │
                          ┌─────────────────────┴─────────┐
                          │                               │
                    ✅ Approve                      ✏️ Changes / 🚫 Reject
                          │                               │
                          ▼                               ▼
                   4. QUEUE  ──────▶  5. POST      back to draft
                   (scheduled)         + link to you
```

---

## Stage 1 — Write the platter

A **platter** is one day's content. It holds:

- the idea (e.g. "the burn multiple nobody quotes")
- **sources** — the research it came from
- one or more **posts** (a LinkedIn post, an Instagram carousel, a reel…)

Right now you write these yourself in Studio or the database. Later, a daily
routine will draft them from that morning's India startup news and leave them
as drafts for you.

> **The research rule is built in.** A platter carries its sources, and the
> Telegram card lists them. If a platter has no sources, the card says so in
> italics — so you can see at a glance whether something was actually
> researched or just written from memory.

---

## Stage 2 — Artwork renders itself

You never open Canva.

Post images are drawn by the site itself from the same design tokens the
website uses. You write the words in `lib/slides.ts`; the picture comes out
the other end at `/api/og/slide`.

Formats available: **carousel** (1080×1350), **single post**, **story**
(1080×1920). Slide types: cover, statement, big number, list, quote,
teardown card, and the **correction slide**.

See them all at `/studio/decks`.

> **Why this matters beyond convenience:** Instagram's API *downloads* your
> image from a web address — it cannot accept a file upload from us. Because
> the site serves the artwork at a public address, Instagram can fetch it
> directly. Without this, Instagram automation does not work at all.

---

## Stage 3 — Telegram asks you

When a post is ready, it appears in Telegram as a card:

```
EP.008 · INSTAGRAM · carousel
🕒 30 Jul 2026, 6:30 pm

The number founders skip. Burn multiple = net burn
÷ net new ARR. Under 1.5 — efficient...

Sources
1. Efficiency metrics for cloud businesses
2. The Burn Multiple

[ ✅ Approve ]  [ ✏️ Changes ]
[ 🚫 Reject ]
```

- **✅ Approve** → it joins the queue and goes out at its scheduled time
- **✏️ Changes** → parked; edit it in Studio or GitHub mobile, then resend
- **🚫 Reject** → back to draft, nothing posts

Every tap is written to an audit log, so there's a permanent record of what
you approved and when.

---

## Stage 4 — The queue

A timer on the server wakes up **every 5 minutes** and asks one question:

> *Is there anything approved whose time has come?*

If no → it goes back to sleep. If yes → it posts it.

Three things make this safe to leave running unattended:

1. **It only ever looks at approved posts.** A draft is invisible to it.
2. **It claims a post before posting it.** Two overlapping runs cannot grab
   the same post, so nothing gets published twice.
3. **Failures retry twice, then stop and tell you.** It will not sit in a
   loop hammering Instagram.

---

## Stage 5 — It posts, and tells you

You get a Telegram message with the live link:

```
✅ Published to instagram
https://www.instagram.com/p/...
```

If something failed instead:

```
⚠️ instagram publish failed (attempt 1/3)
media_url unreachable
```

---

## What you do day to day

| When | You | Time |
|---|---|---|
| Morning | Read the Telegram card, tap Approve | 30 seconds |
| If it needs a fix | Edit in Studio or GitHub mobile, resend | 2 minutes |
| Never | Open Canva, log into Instagram, remember to post | — |

**All of it works from your phone.** Telegram for approvals, `/studio` in a
mobile browser for the queue, GitHub mobile for edits.

---

## Who is allowed to do what

Worth knowing, because this posts to your real accounts:

- **The database is sealed.** Every table refuses to answer the public
  internet. Only the server can read it, using a key that never reaches a
  browser.
- **Studio is behind a passphrase**, and it *cannot* touch anything already
  published — no accidental un-posting.
- **Telegram checks two things** before accepting a tap: a secret only
  Telegram and the server know, and that the message came from *your* chat.
  Someone who finds the web address cannot approve anything.
- **Newsletter signups are double opt-in** — an address has to confirm before
  it can ever be mailed, so the form can't be used to spam someone.

---

## What is not built yet

- **The daily writer.** Platters are written by hand today. The routine that
  drafts them from the morning's news is designed but not wired to the
  database.
- **Newsletter sending.** Signups are captured; the confirmation email and
  the send pipeline need an email provider (Resend — 3,000/month free, and
  not capped by contact count).
- **Reels.** Carousels and single images are fully automated. A reel needs a
  video file hosted somewhere public; that piece is not built.
