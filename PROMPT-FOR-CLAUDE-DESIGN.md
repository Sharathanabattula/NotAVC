# Prompt for Claude Design

*Paste the block below into Claude Design with the **NotAVC Design System**
selected. Attach `CAROUSEL-BRIEF.md` alongside it.*

---

I need Instagram carousel slides for NotAVC. The full brief is attached —
read it before designing, especially Part 4 (visual system) and Part 5
(what good looks like). It is the authority; don't introduce a colour,
typeface or device that isn't in it.

## What NotAVC is

An MBA student in Hyderabad takes Indian startups and VC firms apart using
public filings, and publishes the point where the press release and the
arithmetic stop agreeing. He has no fund and nobody pays him, which is the
whole credential.

The signature is a **correction**: the take everyone had, struck through by
hand, then what the numbers actually said. That slide is not optional and
not decorative — it is the reason the account exists.

## The job

Design the slides for one carousel. Content is in Part 6 of the brief —
Blume Ventures, and how long its exits actually took.

**1080 × 1350.** Light canvas `#F2F1ED`, ink `#0B0B0B`, one accent
`#710014`. Plus Jakarta Sans ExtraBold for display, Outfit for body, Space
Mono for labels and data.

Slides needed, in order:

1. **Cover** — hook at ~112px, desk kicker above in Space Mono
2. **Logo card** — company mark on a white plate, name, headline number
3. **Statement** — the assumption everyone holds
4. **Number** — the metric, with a geometric pictogram
5. **List** — three dated rows in cards
6. **Correction** — ⭐ the signature
7. **Statement** — the finding
8. **CTA** — "Still not a VC." @notavc.co

## Rules that decide whether it's right

- **Graph paper on every slide.** 108px grid at `rgba(11,11,11,0.09)`, full
  bleed, behind everything. It is the format's signature, not texture.
- **Header rail:** wordmark only — "Not" at 35% opacity, "AVC" full weight,
  a `#710014` full stop. 2px ink rule beneath. **No episode number
  anywhere.**
- **Footer rail:** 2px rule, a "SWIPE ‹‹‹" pill bottom-left, the slide
  number in a filled `#710014` disc bottom-right. Last slide replaces the
  pill with @notavc.co.
- **Hand-drawn marks in the accent** — looping arrows, double underlines
  where the two passes deliberately don't align, scribbled strike-throughs.
  They must read as drawn by a person. A perfect ellipse or a straight
  `text-decoration` rule kills the effect.
- **Two-ink discipline.** Ink is what he wrote; crimson is what he
  corrected. Crimson never decorates. More than three crimson elements in
  one frame is wrong.
- **Hairline borders only** — 8/12/18% black. Never heavy strokes. Cards at
  12px radius, pills full.
- **Let it breathe.** The grid is the composition. Resist filling space.

## The correction slide specifically

This is the one to get right. Structure:

```
THE TAKE EVERYONE HAD          ← Space Mono, muted, small

Seed investing is about        ← Plus Jakarta ~54px, MUTED grey,
spotting the fast winners.       each line struck through separately
                                 with a hand-drawn crimson scribble

        ↘ hand-drawn arrow curving down-right

┌─────────────────────────────────────┐
│ WHAT THE NUMBERS SAID               │  ← crimson Space Mono label
│                                     │
│ Three of Blume's four listings      │  ← ink, Outfit ~38px
│ took 10–11 years from the first     │
│ cheque…                             │
└─────────────────────────────────────┘
   crimson-tinted card, 12px radius
```

The wrong take is **grey and crossed out**. The correction is **ink on a
crimson tint**. That contrast is the entire idea made visual.

## What to avoid

- Stock illustration, generic gradients, drop shadows, glassmorphism
- Anything that looks like a fund's marketing deck — this is a student's
  working notes that happen to be beautifully set
- Filling the frame because it looks empty; the restraint is the point
- Colours outside the palette, however good they look

## Reference

Structurally: Raj Shamani's *Figuring Out* carousels — graph paper, huge
grotesk headlines, hand-drawn marker annotations, SWIPE pill, numbered
disc, zigzag alignment. Same language, `#710014` in place of the yellow,
and a sharper correction device.

## Deliver

Each slide as its own artboard at 1080 × 1350, in order, named by slide
kind. Show the correction slide first if you're iterating — if that one
isn't right, nothing else matters.
