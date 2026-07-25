# NotAVC — Flagship Site

Editorial-magazine-meets-fintech portfolio for **NotAVC** (Sharath Chandra Anabattula). Next.js 16 · Tailwind CSS 4 · Framer Motion. Fully static output.

```bash
npm run dev    # local dev at http://localhost:3000
npm run build  # static production build
```

**Deploy to Vercel:** import the repo, set *Root Directory* to `site`. No env vars needed.

## Architecture

- `app/globals.css` — the entire v3 token system. Three palettes (Off-White & Rust → Nature Editorial → Luxe Dark) swap via CSS variables on `<html data-palette>`; the crossfade is pure CSS.
- `components/PaletteObserver.tsx` — IntersectionObserver flips the palette when a `[data-palette-zone]` crosses the viewport's center band. No scroll listeners anywhere in the app.
- `lib/content.ts` — every word of copy. Edit here, not in components. **Swap the placeholder LinkedIn/Instagram URLs before launch.**
- Fonts self-hosted at build via `next/font` (Plus Jakarta Sans / Outfit / Space Mono) — zero external requests, zero CLS.

## Performance budget (enforced, not aspirational)

| Budget line | Limit | Where it stands |
|---|---|---|
| Complex motion moments | **2** | Hero masthead timeline · Teardown desk timeline |
| Scroll-linked timelines | 2 (`useScroll` + transforms only) | Hero, Teardowns |
| Animated properties | `transform`, `opacity` only | Everywhere — palette crossfade is paint-only (`background-color`/`color`) |
| Scroll event listeners | **0** | Palette = IntersectionObserver; reveals = `whileInView` (fire once) |
| `backdrop-filter` surfaces | 6 | 4 glass teardown cards + nav bar |
| Client JS | framer-motion via `LazyMotion` (domAnimation subset) — no other client libs | ✓ |
| Images | 0 (inline SVG only) | ✓ |
| Layout shift | CLS 0 — no late-loading media, fonts via `next/font` | ✓ |
| Reduced motion | Everything collapses to instant; ticker stops | `globals.css` |

Any PR that adds a third scroll timeline, animates a layout property, or attaches a scroll listener is over budget. Cut something first.
