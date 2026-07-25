# NotAVC — Design System

> **Not a VC. Just a student who refuses to learn this stuff quietly.**

The complete brand identity, design tokens, and content system for [NotAVC](https://instagram.com/notavc) — Sharath Chandra Anabattula's venture capital learning brand.

## What is NotAVC?

NotAVC is a personal brand and content platform documenting the journey of learning venture capital, private equity, startup analysis, and financial markets — from a student's lens, for normal people.

## Structure

```
notavc-design-system/
├── DESIGN-SYSTEM.md          # Complete brand bible
├── tokens/
│   └── notavc-tokens.css     # CSS custom properties (colors, type, spacing)
├── logos/
│   ├── notavc-logo-light.svg # Wordmark — light bg
│   ├── notavc-logo-dark.svg  # Wordmark — dark bg
│   ├── notavc-logo-accent.svg# Wordmark — Signal green bg
│   └── notavc-monogram.svg   # "N" monogram — profile pics
├── examples/
│   ├── reel-cover.html       # Instagram Reel cover templates
│   └── post-carousel.html    # IG post, carousel, LinkedIn card
└── fonts/
    └── fonts.md              # Google Fonts references
```

## Quick start

### Use the CSS tokens

```html
<link rel="stylesheet" href="tokens/notavc-tokens.css">
```

```css
.headline {
  font: var(--notavc-text-display);
  letter-spacing: var(--notavc-ls-display);
  color: var(--notavc-ink);
}

.data-point {
  font: var(--notavc-text-data);
  color: var(--notavc-signal);
}
```

### Typography

| Role    | Font            | Use                          |
|---------|-----------------|------------------------------|
| Display | Montserrat 800  | Headlines, stats, brand name |
| Body    | Source Sans 3   | Body text, descriptions      |
| Data    | Source Code Pro | Numbers, metrics, metadata   |

### Color palette

| Name   | Hex       | Use                              |
|--------|-----------|----------------------------------|
| Ink    | `#0B0B0B` | Headings, dark-mode bg           |
| Paper  | `#FFFFFF` | Light-mode bg                    |
| Signal | `#0A7558` | Brand accent (use sparingly)     |
| Mint   | `#4ADE9F` | Dark-surface highlights only     |
| Canvas | `#F5F5F5` | Card backgrounds                 |
| Muted  | `#888888` | Secondary text                   |

## Platforms

Instagram · YouTube · LinkedIn · Threads · X/Twitter

## Created by

**Sharath Chandra Anabattula**
MBA — Finance & Derivatives @ SR University
Bower School of Entrepreneurship — LEAD Programme

---

*Built with Claude Design.*
