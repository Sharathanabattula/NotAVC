# NotAVC — Carousel Research & Design Brief

*Everything needed to design a NotAVC carousel: the research behind EP.009,
the method that produced it, the visual system, and the rules that decide
whether a slide is on-brand.*

Prepared 29 July 2026 · for Claude Design

---

# PART 1 — WHO THIS IS FOR

**Sharath Chandra Anabattula.** MBA at SR University (Finance &
Derivatives), Bower School of Entrepreneurship LEAD VC/PE programme.
Hyderabad. Not an investor, no fund, nobody paying him.

**Positioning:** the anti-bullshit translator for the Indian MBA. He reads
the filings the headlines skip.

**Audience:** MBA students and young professionals in India, 20–28. Smart,
not specialists, quick to spot someone pretending to know more than they do.

**The one memorable thing:** *he shows his work, mistakes included.*

**Voice:** a learning journey explained in simple terms. First person,
direct. One number per claim. Indian context first. Never claims insider
access — that honesty is the entire product.

**Banned words:** leverage (verb), unlock, game-changer, revolutionise, deep
dive, thrilled, humbled, journey, aspiring, passionate, exploring.

---

# PART 2 — THE RESEARCH (EP.009)

## 2.1 The subject

**Blume Ventures.** Venture capital firm, founded 2010, headquartered in
Mumbai. Chosen because it is genuinely Indian — 278 of its 341 investments
are in India — and because nobody has written up what its exits actually
took.

*(An earlier draft used Accel and was scrapped: Accel is a US firm founded
1983 in Palo Alto, and the DPI figure available for it was secondhand
reporting that Accel disputes. Wrong country, unverifiable number.)*

## 2.2 Verified firm data

Source: Tracxn investor profile, read 29 July 2026.

| Metric | Value |
|---|---|
| Founded | 2010 |
| HQ | Mumbai, India |
| Companies backed | 341 |
| India investments | 278 |
| US investments | 34 |
| Team | 40 people, 8 partners |
| Unicorns in portfolio | 6 |
| IPOs | 4 |
| Acquisitions | 49 |
| Seed investments | 252, average round **$2.09M** |
| Series A investments | 52, average round **$4.72M** |

**Investment pace by year:** 2021: 70 · 2022: 69 · 2023: 57 · 2024: 57 ·
2025: 46 · 2026 YTD: 18

**Notable portfolio:** Purplle, Spinny, Slice, Ultrahuman, smallcase,
Unacademy, Turtlemint, Neysa, Raise, E2E Networks, Infollion, earKART.

## 2.3 The finding — and how it was produced

**This is the part that matters.** Tracxn publishes first-investment dates
and IPO dates as separate columns. It does **not** publish hold periods.
The subtraction below is original work, which is what makes this analysis
rather than a summary.

| Company | First cheque | IPO | **Hold** | Market cap at listing |
|---|---|---|---|---|
| E2E Networks | Mar 2011 (Seed) | Apr 2022 | **11y 1m** | — |
| Infollion | Apr 2013 (Seed) | Jun 2023 | **10y 2m** | — |
| Turtlemint | Apr 2015 (Seed) | Jun 2026 | **11y 2m** | **$471M** |
| earKART | Apr 2023 (Seed) | Oct 2025 | **2y 5m** | **$20.9M** |

**Corroborating datapoint (acquisition side):** Unacademy — seed Dec 2015,
acquired Mar 2026. **10 years 3 months.**

### The insight

Three of four listings took **10–11 years** from first cheque. The fourth
listed in 2.5 years — at roughly **one twentieth** the market cap of the
slowest one.

The outlier is stated in the post rather than dropped. That is deliberate:
including the case that complicates the argument is the difference between
analysis and a talking point, and it is the brand.

### What it means

A seed fund is not underwriting growth. It is underwriting its own ability
to still be present in a decade. That is a materially harder thing than
picking a good pitch, and nobody frames it that way.

## 2.4 Confidence and limits — state these honestly

- **High confidence:** all dates, market caps, counts and averages. Directly
  from Tracxn, checkable by any reader with an account.
- **Original:** the hold-period arithmetic. Sharath's, not Tracxn's.
- **Not available:** DPI, IRR, fund-level returns. Tracxn does not carry LP
  reporting. Do **not** publish a DPI figure for any firm without a source
  that can be named and linked.
- **Masked:** funding amounts show as `$*****` on this Tracxn tier. Do not
  guess at them.

## 2.5 Sources

1. Tracxn — Blume Venture investor profile
   `https://tracxn.com/d/venture-capital/blume-venture/__BMaDyIZX1t-9bXMxZDLfjoDApSKa0kF_Fwe7LeU6aP8`
2. Blume Ventures — funds page · `https://blume.vc/funds`

---

# PART 3 — CAROUSEL ARCHITECTURE

## 3.1 The spine

Nine slots. Image slides are optional and skipped when unused.

| # | Kind | Job | Required |
|---|---|---|---|
| 1 | `cover` | The hook. Short — set at 112px. No episode number. | ✅ |
| 2 | `logo` | Names the subject. Company mark + headline number. | optional |
| 3 | `statement` | The setup — what everyone assumes. | ✅ |
| 4 | `number` | The metric, with a pictogram. | ✅ |
| 5 | `list` | Three tiers or three datapoints. | ✅ |
| 6 | `correction` | **THE SIGNATURE.** | ✅ **enforced in code** |
| 7 | `photo` | Real image + caption. | optional |
| 8 | `statement` | What he found. Lands the point. | ✅ |
| 9 | `cta` | "Still not a VC." @notavc.co | ✅ |

## 3.2 The correction slide — the whole brand

```
THE TAKE EVERYONE HAD
~~Seed investing is about~~        ← struck through, per line
~~spotting the fast winners.~~

        ↓ (hand-drawn arrow)

WHAT THE NUMBERS SAID
Three of Blume's four listings took 10–11 years…
```

**Rules:**
- Exactly one per carousel. A carousel without it is rejected by the server.
- `wrong` is an **array of lines**, each ≈26 characters. Each line gets its
  own strike — one bar over a wrapped block crosses only the first line.
- The strike is a **drawn scribble**, never `text-decoration`. A straight
  rule reads as typography; the point is that he crossed it out by hand.

## 3.3 Other slide kinds available

`quote` (pull quote, optional portrait) · `teardown` (company card: verdict,
number, take) · `hook` (9:16 story opener)

---

# PART 4 — VISUAL SYSTEM

Transcribed from Sharath's own **NotAVC Design System** in Claude Design.
This is the authority; do not introduce a colour or font not listed.

## 4.1 Colour

| Token | Hex | Use |
|---|---|---|
| `--canvas` | `#F2F1ED` | Carousel background |
| `--canvas-2` | `#FAF9F6` | — |
| `--paper` | `#FFFFFF` | Cards, logo plates |
| `--ink` | `#0B0B0B` | Primary text |
| `--muted` | `#888888` | Secondary text, struck-through copy |
| `--hairline` | `#E5E5E5` | Borders |
| `--signal` | `#710014` | **The accent.** Corrections, numbers, marks |
| `--signal-08/12/18` | `rgba(113,0,20,.08/.12/.18)` | Tints, pills, cards |
| `--surface-dark` | `#0B0B0B` | Reels/story only |
| `--accent-on-dark` | `#B38F6F` | Bronze — on dark only, crimson fails contrast |
| semantic | coral `#E8593C` · amber `#F2A623` · info `#3B8BD4` | Verdict pills |

**Two-ink rule:** ink is what he wrote, signal is what he corrected. Signal
never decorates. More than three signal elements in one frame is wrong.

## 4.2 Type

| Role | Font | Use |
|---|---|---|
| Display | **Plus Jakarta Sans** ExtraBold | Headlines, numbers, company names |
| Body | **Outfit** 400/600 | Body copy, notes |
| Data | **Space Mono** 400/700 | EP numbers, labels, kickers, handles |

Sizes at 1080×1350: cover title 112px · statement 58px · number 78–84px ·
correction wrong-take 54px · body 32–38px · kicker/label 18–24px.

## 4.3 Structure

- **Graph paper:** 108px grid, `rgba(11,11,11,0.09)`, full bleed. Drawn as
  explicit SVG lines — a tiled CSS gradient renders nothing in Satori.
- **Header rail:** wordmark only ("Not" at 35% opacity + "AVC" full + signal
  full stop), 2px ink rule beneath. **No episode number** — the archive is
  numbered internally for ordering, never shown to the reader.
- **Footer rail:** 2px rule, SWIPE pill left (last slide shows @notavc.co),
  page number in a filled signal disc right.
- **Borders:** hairline at 8/12/18% black. Never heavy strokes.
- **Radii:** cards 12px, pills full.
- **Spacing:** 4 / 8 / 16 / 24 / 32 / 48.

## 4.4 Hand-drawn marks

Hand-authored SVG paths, in signal. They must look drawn, not generated:
arrows overshoot and loop, the two underline passes deliberately do not
align, the circle does not close.

`ArrowDownLeft` · `ArrowDownRight` · `Underline` (double pass) ·
`CircleMark` · `StrikeMark` (two crossing passes)

## 4.5 Pictograms — 17 available

`coins` `burn` `runway` · `chart` `climb` `scale` · `split` `target` `clock`
· `doc` `stamp` · `people` `store` `rocket` · `alert` `eye` `lock`

**Construction rules** for any new one: 120 viewBox, one stroke weight of 9,
round caps and joins, exactly three tones (ink / signal / ink at 18%), four
elements maximum, and **the signal element is always the subject**.

## 4.6 Formats

| Format | Size | Surface |
|---|---|---|
| Carousel | 1080 × 1350 | Light canvas |
| Single post | 1080 × 1350 | Light canvas |
| Story / reel | 1080 × 1920 | **Dark**, bronze accent |
| YouTube thumb | 1280 × 720 | not built |

---

# PART 5 — WHAT GOOD LOOKS LIKE

## 5.1 The reference

Raj Shamani's *Figuring Out* carousels: graph paper, huge grotesk headlines,
hand-drawn yellow marker annotations, cut-out photos, SWIPE pill, numbered
disc, zigzag left/right alignment. NotAVC uses that structural language with
`#710014` in place of the yellow.

## 5.2 Rules that decide on-brand

**Do**
- Name the company. Every claim carries one number.
- Show the source. "Dates from Tracxn, arithmetic mine."
- Include the case that complicates the argument.
- Rupees and Indian companies first.
- Let the frame breathe — the grid is the composition, not wallpaper.

**Don't**
- Explain a term without naming a company it bites. *Definitions do not
  travel; consequences do.*
- Use a number you cannot link to.
- Round a figure to make it sound better.
- Let signal decorate.
- Drop the correction slide. Ever.

## 5.3 The test

> Could a reader open the same source and check every number in under ten
> minutes? If not, it isn't finished.

---

# PART 6 — EP.009 FINAL COPY

**Cover:** The 10-year seed cheque
**Sub:** What Blume's exits actually took
**Desk:** The uncomfortable *(no episode number on any slide)*

**Logo slide:** BLUME · MUMBAI · SINCE 2010 · **341** companies backed, 278
in India

**Setup:** Seed investing gets sold as spotting the fast winner. / So I
checked how long Blume's winners actually took.

**Number:** 10–11 years · *seed to listing* · icon `clock` · "Three of
Blume's four IPOs. I took the dates from Tracxn and did the subtraction
myself."

**List — every Blume IPO, dated:**
- E2E NETWORKS — Seed Mar 2011 → IPO Apr 2022. 11 years, 1 month.
- INFOLLION — Seed Apr 2013 → IPO Jun 2023. 10 years, 2 months.
- TURTLEMINT — Seed Apr 2015 → IPO Jun 2026. 11 years, 2 months.

**Correction:**
~~Seed investing is about~~ / ~~spotting the fast winners.~~
→ Three of Blume's four listings took 10–11 years from the first cheque. The
one that listed in 2.5 years came out at a $20.9M market cap — against
Turtlemint's $471M. The fast exit was the small one.

**What I found:** Unacademy took the same shape: seed in Dec 2015, acquired
Mar 2026. Ten years, three months. / The average Blume seed cheque is
$2.09M. The wait is a decade.

**CTA:** Still not a VC. · @notavc.co

---

# PART 7 — NEXT SUBJECTS

Same method, Indian firms only:

| Firm | Angle |
|---|---|
| **Peak XV** | $4B+ returned in 18–24 months post-Sequoia split. $35M in Groww → $1.5B. |
| **Elevation Capital** | Ex-SAIF. Paytm, Meesho, Swiggy, Urban Company. |
| **Z47** | Ex-Matrix India. 275 investments, 23 exits, rebranded 2024. |
| **Nexus** | $700M Fund VIII. |

**Method, every time:** open the Tracxn profile → pull the exit table →
compute what Tracxn does not publish → find where the arithmetic disagrees
with the received story → that gap is the correction.
