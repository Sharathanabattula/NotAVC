# NotAVC — Full Context

*Hand-off document. Everything an outside collaborator needs to know about
the brand, the person, the machine, and the constraints.*

Last updated: 29 July 2026

---

## 1. The person

**Sharath Chandra Anabattula.** MBA student at SR University, specialising
in Finance & Derivatives. Part of the **Bower School of Entrepreneurship's
LEAD VC/PE programme** — deal simulations, term-sheet negotiations, Indian
case studies (Zomato and Paytm IPOs).

Based in India. Works in IST.

He is **not** a VC, has never worked at a fund, and has no track record.
That is not a weakness to hide — it is the entire positioning.

## 2. The positioning

> **A student doing the work in public.**

The one memorable thing: **he shows his work, mistakes included.**

The reasoning behind this: both established camps in venture content
perform authority by *hiding* process. The institutional funds (a16z and
their imitators) publish finished, confident theses. The terminal-technical
crypto labs publish dense, credentialled analysis. Neither shows anyone
being wrong and then correcting.

Showing corrected mistakes is the open lane. Nobody in Indian VC content is
in it.

## 3. The voice

**A learning journey, explained simply.** This is the governing rule.

| Do | Don't |
|---|---|
| First person, direct | Third-person authority voice |
| "Here's what I got wrong" | "Here's what founders get wrong" |
| One number per claim | Vague claims with no number |
| Explain the term, then use it | Assume the reader knows |
| Indian context, rupees, Indian companies | Default to US examples |
| Short sentences | Long qualifying clauses |
| Admit the limits of what he knows | Imply insider access |

**Banned words:** leverage (as a verb), unlock, game-changer, revolutionise,
deep dive, thrilled, humbled, journey (as a noun), "in today's fast-paced
world", any LinkedIn throat-clearing.

**The tone test:** would a second-year MBA student who is genuinely curious
write this sentence, or does it sound like a fund's marketing team? If the
latter, rewrite.

**The simplicity test:** could someone with no finance background follow it?
If a term is used, it must be explained in the same breath. "Burn multiple —
that's net burn divided by net new ARR" not "burn multiple efficiency".

## 4. The signature — non-negotiable

Every teardown and every carousel contains a **correction layer**:

> **THE TAKE EVERYONE HAD**
> ~~Growth rate tells you how the company is doing.~~
>
> **WHAT THE NUMBERS SAID**
> Growth rate tells you the speed. Burn multiple tells you whether you can
> keep going at that speed.

On the website this animates — a crimson rule draws through the wrong take,
then the correction rises underneath. In carousels it is slide 5, with a
hand-drawn scribble through the wrong take.

**This is the brand.** Remove it and NotAVC is another dark VC content
account. Any content plan that does not include a correction is off-brand.

## 5. What has been built

### Website — https://not-avc.vercel.app

Next.js 16, deployed on Vercel, auto-deploys from GitHub.

Sections: masthead → ticker → thesis → the analyst (his story) → six desks →
teardown desk (4 companies, with the correction layer) → The Wire
(newsletter signup) → closer.

Visually: dark, near-black, crimson `#e23e52`, Fraunces + Instrument Sans +
IBM Plex Mono, an ambient canvas dot-field that reacts to the cursor.

### The publishing machine

```
Idea  →  drafted  →  artwork renders itself  →  Telegram asks
                                                     ↓
                              approve  →  scheduled  →  posts  →  link back
```

- **Supabase** (Postgres, Mumbai): platters → sources → posts → approvals,
  plus newsletter subscribers and issues.
- **Post artwork renders itself** at `/api/og/slide` from design tokens.
  There is no Canva step. Also solves Instagram's requirement that media be
  fetched from a public URL.
- **Telegram bot** is the approval surface — approve / changes / reject.
- **GitHub Actions** runs the publisher every 5 minutes (Vercel's free plan
  caps cron at once daily).
- **LinkedIn API** working. **Instagram API** built, awaiting a token.

**Nothing publishes without Sharath approving it.** Enforced in the
database, not by convention.

### Post artwork system

Deliberately different from the website. Follows Sharath's own **NotAVC
Design System** (in Claude Design):

- Light canvas `#F2F1ED`, ink `#0B0B0B`, signal `#710014`
- **Plus Jakarta Sans** (display) / **Outfit** (body) / **Space Mono** (data)
- Graph-paper grid, hand-drawn crimson marks (looping arrows, double
  underlines, scribbled strikes)
- 17 geometric pictograms
- Hairline borders, 12px card radii
- Carousels/posts **light**; reels and stories **9:16 dark** with a bronze
  `#B38F6F` accent (crimson fails contrast on black)

Formats live: carousel (1080×1350), single post, story (1080×1920).
See https://not-avc.vercel.app/templates

### Content structure

**Six desks** (content pillars):
1. Concepts, explained
2. Company teardowns
3. Founder stories
4. Market analysis
5. Learning journal
6. Ideas + valuations

**Episode numbering:** `EP.001`, sequential across everything, never
date-locked. A permanent archive, explicitly **not** a 30-day challenge and
with no 24-hour completion pressure. If a day slips, the platter rolls
forward.

**Carousel structure** (7 slides):
1. cover — the hook
2. statement — the assumption everyone holds
3. number — the metric that matters, and how to compute it
4. list — three tiers for reading that metric
5. **correction — THE SIGNATURE**
6. statement — what he found when he looked
7. cta — "Still not a VC." @notavc.co

## 6. Channels

| | Handle | Status |
|---|---|---|
| LinkedIn | linkedin.com/in/sharathanabattula | API working |
| Instagram | @notavc.co | API built, token pending |
| Newsletter | "The Wire" — one startup torn down every Sunday | signup live, sending not built |
| Website | not-avc.vercel.app | live |

**Default schedule:** LinkedIn 09:30 IST, Instagram 18:30 IST.

## 7. Hard constraints

1. **Research-first.** Every claim traces to a source. Platters carry their
   citations and the Telegram approval card lists them. Never recycled
   threads, never regurgitated common knowledge.
2. **One number per claim.** If the number can't be named, cut the claim.
3. **No fabricated data.** He has no fund and no proprietary access. Any
   number must come from a public source.
4. **Not investment advice** — stated in the footer, and the content must
   never read as a recommendation to buy or sell.
5. **MBA breadth, not just finance.** Marketing, HR, operations, strategy
   and economics all count — the audience is MBA students, not just finance
   ones.
6. **Reels are not automated yet.** Carousels and single images are.

## 8. Audience

MBA students and young professionals in India, roughly 20–28. Secondarily
founders and investors who might follow or hire him.

They are smart but not specialists. They want the concept explained without
being condescended to, and they can tell when someone is pretending to know
more than they do.

## 9. What is not built

- Newsletter sending (needs an email provider — Resend recommended)
- Reels / video
- YouTube thumbnails, story polls, thread cards
- A "changes" loop in Telegram (approve/reject works; iterating does not)
- The daily generator writing into the database

---

## 10. What to ask an outside strategist for

The machine works. What it lacks is **editorial judgement about what to post
and why** — which story, which angle, which number, what sequence over
weeks, how to grow from zero.

That is the gap the accompanying prompt is meant to fill.
