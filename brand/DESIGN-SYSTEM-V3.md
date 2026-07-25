# NotAVC — Design System v3.0 (Crimson Depth)

v3 evolves the v2 system (Signal green era) for the flagship site and all future brand surfaces. v2 remains valid for existing social templates until they're migrated; the voice rules, content formats, episode numbering, and quality gate from v2 carry over unchanged.

## What changed and why

| Axis | v2 | v3 | Why |
|------|----|----|-----|
| Anchor color | Signal green `#0A7558` | **Crimson Depth `#710014`** | Green read as "fintech dashboard." Crimson reads as editorial authority — magazine masthead, not SaaS. |
| Color model | One palette + dark mode | **Three palettes, one anchor** | The site transitions palettes by scroll depth; social templates pick the palette that fits the format. |
| Display face | Montserrat (logo) / Plus Jakarta Sans | **Plus Jakarta Sans everywhere** | One display voice. Montserrat is retired. |
| Logo | Wordmark, "Not" at 35% | **Wordmark + crimson full stop** — `NotAVC.` | The period is the brand's whole argument: a definitive statement, made by someone "unqualified" to make it. |

## The three palettes

Every palette shares the anchor: **Crimson Depth `#710014`**. It is the only color allowed to appear in all three.

### 1. Off-White & Rust — "the masthead"
First impressions, covers, heroes, closing statements.

| Token | Hex |
|-------|-----|
| bg | `#F5EFE6` |
| bg-soft | `#ECE3D3` |
| ink | `#201812` |
| muted | `#7E7264` |
| accent | `#710014` |
| accent-2 (rust) | `#A6522F` |

### 2. Nature Editorial — "the reading room"
Long-form, thesis, explanations. Calm, green-tinted neutrals.

| Token | Hex |
|-------|-----|
| bg | `#E6E4D5` |
| bg-soft | `#DBD8C3` |
| ink | `#1F241B` |
| muted | `#68705E` |
| accent | `#710014` |
| accent-2 (moss) | `#3F5A3E` |

### 3. Luxe Dark — "the desk lamp"
Teardowns, data, verdicts. Near-black with maroon warmth, never pure black.

| Token | Hex |
|-------|-----|
| bg | `#140D10` |
| bg-soft | `#1E1418` |
| ink | `#F1E9DD` |
| muted | `#9C8D84` |
| accent (readable crimson) | `#D8495F` |
| accent-2 (aged gold) | `#C9A470` |

**Rule:** `#710014` is too dark for text on Luxe Dark — there it appears only as fills, glows, and surfaces; `#D8495F` carries crimson in text.

### Verdict colors (teardowns and data only — carried from v2)
Coral `#E8593C` (post-mortem / negative) · Amber `#F2A623` (repriced / caution) · Info `#5EA3E0` (live bet / positive).

## Typography (unchanged roles, one clarification)

- **Display:** Plus Jakarta Sans 600–800, tracking −0.02em to −0.04em, leading 0.92–1.1
- **Body:** Outfit 300–500 — never bolded; emphasis switches to Jakarta
- **Data:** Space Mono 400/700 — ALL numbers, dates, episode tags, metadata; tabular numerals on

New display device: **the hollow headline** — outline-only type (transparent fill, 1.5px ink stroke) for the word that "recedes" (e.g. NOT). Use at most once per surface.

## Logo v3

- **Wordmark:** `NotAVC.` in Plus Jakarta Sans 800, tracking −0.04em. "Not" at 40% opacity, "AVC" full, full stop in the palette's accent crimson.
- **Monogram:** White "N" on Crimson Depth rounded square (radius ≈ 23%), with a small rust square in the lower-right — the "footnote pixel," a nod to the one number every teardown hangs on.
- Files: `brand/logos/notavc-{monogram,wordmark-light,wordmark-dark,wordmark-crimson}-v3.svg`
- Clear space and don't-stretch rules carry over from v2.

## Motion principles (site + future video)

1. Maximum two complex motion moments per surface. Everything else is a ≤700ms fade/rise that fires once.
2. Transform and opacity only. Nothing that triggers layout.
3. Custom curves, never built-ins: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances, `linear` only for tickers.
4. Motion stops where the user's decision starts — CTAs and forms sit in still zones, with press feedback (`scale(0.97)`) as the only motion.
5. `prefers-reduced-motion` collapses everything to instant.

## Surfaces

- **Glass** (backdrop blur 16px, 1px translucent border) is reserved for teardown cards on Luxe Dark. Budget: 6 per page.
- **Split-tone backgrounds:** one soft-tone vertical band per section maximum, always behind content, never decorative alone.
- **Film grain** at 5% opacity unifies all three palettes into one physical "paper."
