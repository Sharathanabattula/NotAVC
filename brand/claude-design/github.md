repo: Sharathanabattula/NotAVC
branch: main

## Last sync
date: 2026-07-29T12:51:47Z

### Updated in this project
- Built the EP.009 Blume Ventures carousel (8 slides, 1080×1350) from `CAROUSEL-BRIEF.md` Part 6, grounded in `site/lib/marks.tsx` (hand-drawn mark paths) and `site/lib/slides.ts` (slide architecture)
- Confirmed system palette already matches repo v3 (`brand/DESIGN-SYSTEM-V3.md`): crimson `#710014`, canvas `#F2F1ED`, bronze `#B38F6F` on dark — no token changes needed
- Note: repo has evolved substantially since first import (new Next.js `site/`, `content-hq/` platter, v3 brand docs); design-system tokens/components NOT regenerated this sync

### Previously
- Imported brand tokens, copied logo SVGs, built 9 components + 3 content-format kits; later migrated palette from Signal green to Crimson Depth

## Screen map
| Design system item | Repo source |
|---|---|
| `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` | `tokens/notavc-tokens.css`, `DESIGN-SYSTEM.md` |
| `assets/logos/*.svg` | `logos/*.svg` |
| `content_kits/reels/` | `faceless-reels.html`, `examples/reel-cover.html` |
| `content_kits/carousels/` | `carousel-templates.html`, `examples/post-carousel.html` |
| `content_kits/thumbnails/` | `faceless-reels.html` (GrowthX thumbnail section) |
| `components/*` | `tokens/notavc-tokens.css` utility classes (`.notavc-card`, `.notavc-tag`, `.notavc-pill`, etc.) |
| `EP009 Blume Carousel.html` | `CAROUSEL-BRIEF.md`, `PROMPT-FOR-CLAUDE-DESIGN.md`, `site/lib/marks.tsx`, `site/lib/slides.ts` |
