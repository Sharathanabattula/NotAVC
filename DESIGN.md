# Design System — NotAVC

> Source of truth. Read before any visual or UI decision. Do not deviate without explicit user approval.

## Product Context

- **What this is:** The personal site and permanent archive of Sharath Chandra Anabattula, who publicly tears down companies, explains VC/PE concepts, and documents what he gets wrong.
- **Who it's for:** MBA students and young professionals in India (20–28), plus founders and investors who may follow or hire him.
- **Space/industry:** Venture capital / startup media. Peers: a16z, BITKRAFT, ChainGPT Labs, Indian VC firm sites.
- **Project type:** Editorial personal-brand site.
- **Positioning (locked):** A student doing the work in public.
- **The one memorable thing (locked):** *He shows his work, mistakes included.* Every design decision below serves this. If a change does not serve it, reject the change.

## Aesthetic Direction

- **Direction:** Working Papers — a marked-up worked problem, not a published report.
- **Decoration level:** Intentional — paper grain at 4.5%, hairline rules, margin annotation column, revision marks. No decoration that isn't carrying information.
- **Mood:** Studious, exposed, slightly unfinished on purpose. It should feel like someone's actual working notes that happen to be beautifully set.
- **Research finding driving this:** a16z's paper is `#F6F4EE`. NotAVC's previous paper was `#F5EFE6` — a ~1% difference, i.e. the category uniform. Both established camps (institutional-editorial and terminal-technical) perform authority by *hiding* process. Showing corrected mistakes is the open lane.
- **Reference sites:** https://a16z.com (Domaine/Orpheus, warm cream — the norm to avoid), https://www.bitkraft.vc (terminal/ASCII/HUD), https://labs.chaingpt.org (`#E4E4E4` paper, RobotoMono + pixel display, `#FF7120`).

## Typography

- **Display/Hero:** **Fraunces** — variable serif with optical-size and WONK axes. Bookish and human, reads like an old textbook plate rather than an institutional fund serif. Nobody in Indian VC content uses it. Set `font-variation-settings: "opsz" 144, "WONK" 1, "SOFT" 20`, weight 700–800, tracking −0.02em, leading 1.02.
- **Body:** **Instrument Sans** — clean, slightly condensed, high legibility at 16–19px. Stays quiet so the display and the corrections carry the personality. Weights 400/500/600.
- **UI/Labels:** IBM Plex Mono, 10–11px, uppercase, letter-spacing 0.18–0.22em.
- **Data/Tables:** **IBM Plex Mono** — every number, valuation, percentage, date, and episode tag. IBM carries enterprise-finance heritage, which earns the rigour claim. Must use `font-variant-numeric: tabular-nums`.
- **Code:** IBM Plex Mono.
- **Loading:** `next/font/google` (self-hosted at build, zero external requests, zero CLS).
- **Scale:** hero clamp(52px, 9vw, 116px) · h2 38–48px · h3 26px · body 19px · small 16px · caption 13px · micro 10.5–11px.

### Retired

Plus Jakarta Sans, Outfit, Space Mono. Do not reintroduce. Never use Inter, Roboto, Arial, Helvetica, Montserrat, Poppins, or Space Grotesk.

## Color

- **Approach:** Restrained, and deliberately **two inks**.
- **The two-ink rule (the core of the system):** Black is what he wrote. Crimson is what he corrected. Crimson never decorates — it only ever marks a correction, a live metric, or the single thing that matters on a surface. If crimson appears more than three times in a viewport, something is wrong.

| Role | Hex | Usage |
|---|---|---|
| Paper | `#E8E6E1` | Default background. One deliberate step cooler than fund cream. |
| Paper 2 | `#DEDBD4` | Cards, insets, specimen blocks. |
| Ink | `#1A1613` | Primary text — "what he wrote". |
| Crimson | `#710014` | Corrections, key metrics, the full stop in the wordmark. Earned, never decorative. |
| Muted | `#7E7871` | Metadata, margin column, captions, struck-through text. |
| Rule | `rgba(26,22,19,.16)` | Hairlines and borders. |

- **Semantic (teardown verdicts only):** post-mortem `#E8593C`, repriced `#F2A623`, live bet `#5EA3E0`.
- **Dark mode ("Desk"):** not a theme toggle — a *zone*. Teardowns render on `#15100F` with paper `#1E1715`, ink `#EDE7DE`, muted `#918780`, and crimson lifted to `#D8495F` for contrast. `#710014` is too dark for text on dark and may only be used as a fill or glow there.

## Spacing

- **Base unit:** 8px.
- **Density:** Comfortable in reading zones, dense in data rows.
- **Scale:** 2xs(2) xs(4) sm(8) md(16) lg(24) xl(32) 2xl(48) 3xl(64) 4xl(96) 5xl(144).
- **Section rhythm:** 72px vertical minimum between sections, 144px at major transitions.

## Layout

- **Approach:** Creative-editorial with a fixed annotation margin.
- **Grid:** `150px | 1fr` on ≥860px — the 150px left column is the **margin column** and holds episode numbers, dates, revision marks, and annotations. Below 860px it collapses to a crimson left-border block above the content.
- **Max content width:** 1180px. Reading measure max 52ch.
- **Border radius:** effectively none. sm:0 md:0 pill:9999px for buttons only. Working papers do not have rounded corners.
- **Grain:** fixed SVG fractal-noise overlay, opacity 0.045, `pointer-events: none`.

## Motion

- **Approach:** Intentional. Motion explains or corrects; it never ornaments.
- **THE SIGNATURE — the correction layer.** On scroll into view, a crimson rule draws left-to-right through the wrong take (`transform: scaleX(0 → 1)`, 1s, `cubic-bezier(.22,1,.36,1)`), then the corrected line rises and fades in (0.7s, +9px). This is the one thing the site is remembered by. It must appear on every teardown.
- **Easing:** enter `cubic-bezier(.22,1,.36,1)` · exit `ease-in` · move `cubic-bezier(.77,0,.175,1)` · continuous `linear`.
- **Duration:** micro 50–100ms · short 150–250ms · medium 250–400ms · long 400–1000ms (strikethrough only).
- **Budget:** transform and opacity only. No scroll listeners — IntersectionObserver or `whileInView`. Never attach an entrance animation and a scroll-parallax to the same element; they both write `transform` and will deadlock (this已 happened once — see Decisions Log).
- **Motion stops where decisions start:** CTAs, forms, and contact zones are static. Press feedback `scale(.97)` is the only motion permitted there.
- **Reduced motion:** `prefers-reduced-motion: reduce` collapses everything to instant and disables the strikethrough draw (the correction still renders, just without animation).

## Accessibility Floor

- Visible keyboard focus everywhere: 2px crimson outline, 3px offset.
- Body text contrast ≥ 4.5:1 (`#1A1613` on `#E8E6E1` = 14.8:1).
- Muted text never below 13px.
- Struck-through corrections must also be marked semantically with `<s>` or `<del>`, not colour alone.

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-27 | Initial design system created | /design-consultation, with live browser research of a16z, ChainGPT Labs, BITKRAFT |
| 2026-07-27 | Moved paper `#F5EFE6` → `#E8E6E1` | Previous value was within ~1% of a16z `#F6F4EE`; the site was wearing the category uniform |
| 2026-07-27 | Retired Plus Jakarta Sans / Outfit / Space Mono for Fraunces / Instrument Sans / IBM Plex Mono | Old stack was competent but generic; Fraunces gives a bookish voice no Indian VC account is using |
| 2026-07-27 | Adopted two-ink system as the core constraint | Makes "shows his work, mistakes included" a visual rule, not a slogan |
| 2026-07-27 | Cut three scroll palettes to one paper + one Desk zone | Three palettes was decoration; the argument is corrections, not colour-shifting |
| 2026-07-27 | Never combine entrance animation with parallax on one element | Both write `transform`; observed deadlock left the founder portrait stuck at 72% opacity |
