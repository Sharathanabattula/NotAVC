# NotAVC — Design System

> Not a VC. Just a student who refuses to learn this stuff quietly.

**NotAVC — Venture Intelligence for Everyone** is the personal brand and content platform of **Sharath Chandra Anabattula**, a 24-year-old MBA student (Finance & Derivatives, SR University) documenting venture capital, private equity, startup analysis, and valuation work in public, from a student's lens. It is not a beginner explainer channel — content is advanced: deal teardowns, valuation breakdowns, cap-table simulations, market maps, and founder decision analysis, drawing on an MBA Finance + B.Sc Biotechnology background (a HealthTech/DeepTech due-diligence edge).

Content ships across Instagram (Reels, carousels, posts, Stories), YouTube (thumbnails), LinkedIn, and Threads/X — always under the same episode number (`EP.001`, `EP.002`, …).

## Sources

- GitHub: [Sharathanabattula/NotAVC](https://github.com/Sharathanabattula/NotAVC) — brand tokens, logos, and reference HTML templates. This design system was built by reading that repo's `DESIGN-SYSTEM.md`, `tokens/notavc-tokens.css`, `logos/*.svg`, and its example template HTML. Explore the repo directly for the original reference files and any updates since this system was generated.
- Bower School of Entrepreneurship VC/PE cohort transcripts — mentioned as a future content source, not yet attached to this project.

**Note on fonts:** the repo's own files are inconsistent — `DESIGN-SYSTEM.md`'s type-scale table names Plus Jakarta Sans / Outfit / Space Mono, but its logo spec, `README.md`, and `tokens/notavc-tokens.css` still reference an older Montserrat / Source Sans 3 / Source Code Pro stack. This design system follows the brief given for this project — **Plus Jakarta Sans (display) + Outfit (body) + Space Mono (data)** — as the current, intended stack, and the logo SVGs copied in have been updated to match. Flag to the repo owner if the source repo should be updated to match.

## Index

- `styles.css` — root stylesheet, imports every token file below. Link this one file.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `fonts.css`
- `assets/logos/` — `notavc-logo-light.svg`, `notavc-logo-dark.svg`, `notavc-logo-accent.svg`, `notavc-monogram.svg`
- `components/` — reusable primitives, grouped by concern:
  - `brand/` — `Wordmark`, `EpisodeBadge`, `BrandPill`
  - `data/` — `DataMetric`, `Tag`, `DataCard`
  - `feedback/` — `Callout`
  - `navigation/` — `DotIndicator`
  - `surfaces/` — `Card`
- `content_kits/` — full click-through recreations of each content format:
  - `reels/` — faceless Reels (storytelling / data-overlay / news formats) + Instagram Story poll, 9:16 dark
  - `carousels/` — educational carousel deck, Instagram post, LinkedIn quote card, Threads/X card
  - `thumbnails/` — YouTube thumbnails, 16:9 bold split-color
- `guidelines/` — foundation specimen cards (colors, type, spacing, radii, shadows, borders, brand marks, aspect ratios) shown in the Design System tab
- `SKILL.md` — portable skill definition for use in Claude Code

## Intentional additions

No component library was defined in the source repo beyond a handful of CSS utility classes (`.notavc-card`, `.notavc-tag`, `.notavc-pill`, `.notavc-metric`, `.notavc-episode`, `.notavc-brand-label`). The 9 components above formalize those utility classes into reusable primitives — nothing beyond what the source already implied.

## Content pillars

1. VC/PE concepts explained — one concept at a time, always with an Indian-context analogy
2. Company teardowns — one number that tells the real story
3. Founder/CEO stories — the decisions that built or broke companies
4. Market analysis — India-first trends, sector maps, funding patterns
5. Learning journal — raw, first-person documentation of what was learned
6. Startup ideas + analysis — back-of-envelope valuations, thinking like a VC

## CONTENT FUNDAMENTALS

- **Voice:** raw, not polished, not motivational. Talk like a sharp friend explaining VC over chai. First person ("I," not "we"). Admit gaps openly: "I didn't know this until last Tuesday."
- **Every post carries at least one specific data point** — a valuation, a percentage, a rupee figure. Never a vague claim.
- **Endings:** every post closes with a genuine question or an honest statement — never a generic "link in bio" CTA.
- **Banned words:** thrilled, honored, journey, game-changer, leverage, unlock, empower, delve, navigate, foster, seamless, robust, holistic, elevate.
- **Hashtags:** #NotAVC is mandatory; rotate 3 more from a fixed bank (#VCForNormalPeople, #StartupBreakdown, #LearnVC, #IndianStartups, #VentureCapital, #PrivateEquity, #BuildInPublic, #StartupIndia, #MBALife, #CompanyTeardown). Max 4 hashtags, max 1 emoji per post.
- **Quality gate (all must pass):** does the hook stop the scroll? Is there a specific number? Is the student/learning angle present? Under the format's word limit? No banned words? Would a 22-year-old student understand it? Would a VC professional respect it?
- **Example, the NotAVC way:** "A term sheet is a rental agreement for your company. Except the landlord might get to kick you out if things go wrong. 80% of term sheet terms are negotiable — most first-time founders don't know this."

## VISUAL FOUNDATIONS

- **Color:** Ink `#0B0B0B` (a soft near-black, not pure `#000`) and Paper `#FFFFFF` are the two base surfaces — max 1-2 backgrounds per piece. Signal green `#0A7558` is the accent, used sparingly (max ~3 uses per frame): links, key metrics, brand labels, monogram. Never as a large fill. Mint `#4ADE9F` is exclusively for dark-surface highlights (Reels, Stories, YouTube) — it washes out on white, so it never appears on Paper. Canvas `#F5F5F5`/`#FAFAFA` are the off-white card surfaces for carousels. Coral/Amber/Info are reserved for data-visualization sentiment only (negative/warning/positive metrics), never decorative.
- **Type:** three fonts, three strict jobs. Plus Jakarta Sans (600-800) is for headlines and stat numbers only — always negative letter-spacing, never body text. Outfit (300-500) is the body workhorse — never bold; switch to Plus Jakarta Sans for emphasis instead. Space Mono (400/700) renders every number: valuations, percentages, dates, episode numbers. This is the deliberate "quant" signal — numbers should visually read as data, not prose.
- **Spacing:** a compact 4/8/16/24/32/48px scale. Content cards keep tight internal padding (20-28px) — density over air.
- **Backgrounds:** flat color only. No photography, no gradients except two specific, intentional cases — the Shankar-storytelling Reel background (`Ink → Deep`, a very subtle two-stop gradient) and the CTA carousel slide (`Signal → darker Signal`). No textures, no hand-drawn illustration, no patterns.
- **Animation:** none defined in source material — treat static-first. The one implied motion is a pulsing "live" dot on news-format Reels (`opacity 1 → 0.3`, ~1.5s loop) and Reel progress-bar fills. Use `--ease` (`cubic-bezier(.4,0,.2,1)`) and `--duration` (150ms) tokens for anything else; keep transitions quick and utilitarian, never bouncy.
- **Hover/press states:** not specified in source (this is a content brand, not an interactive product) — where a click target exists (e.g. a carousel arrow), darken/invert rather than introduce a new color, consistent with the brand's restraint.
- **Borders over shadows:** the defining surface language. Cards use a 0.5px hairline border (`rgba(0,0,0,.08–.18)`) and a 12-16px radius; shadows exist as tokens (`--shadow-sm/md/lg`) but are used sparingly — most content-format cards rely on the hairline border alone, not elevation.
- **Corner radii:** 4px (tags/small chips) → 8px (buttons) → 12-16px (cards, slides, thumbnails) → pill (badges, dot progress).
- **Transparency/blur:** used only for brand pills over video/dark imagery — `rgba(255,255,255,.10)` background with `backdrop-filter: blur(6px)`, giving a frosted-glass brand mark that reads over any footage.
- **Imagery vibe:** not yet supplied by source — this system has no photography assets. When real photos/footage are added they should sit under dark overlays consistent with the Ink/Deep palette; avoid warm-toned or heavily saturated imagery, which would clash with the cool signal-green identity.
- **Layout rules:** every format is a fixed aspect ratio, never fluid — 9:16 (Reels/Stories), 1:1 (posts/Thread cards), 4:5 (carousel), 1.91:1 (LinkedIn), 16:9 (YouTube). Brand pill/episode number sit in fixed top corners on video formats; brand bar + dot progress sit fixed at the bottom of carousel slides.

## ICONOGRAPHY

No icon system, icon font, or SVG icon set is defined in the source repo. The brand currently uses **zero decorative icons** — visual weight comes from the monogram (a signal-green rounded square with "N"), colored dots (carousel progress, a pulsing "live" indicator), and typography alone. Emoji usage is explicitly rationed to a max of 1 per post by the voice rules, and no unicode glyphs are used as icons. If a UI ever needs a functional icon (e.g. a play button for a YouTube thumbnail), the source uses a plain filled circle + a simple triangle, not an icon font — keep that minimal, geometric approach and avoid introducing an icon library unless the brand adopts one. **No logo substitution has been made** — the four SVG wordmark/monogram files came directly from the source repo's `logos/` folder.

## Caveats & ask

- **Font stack conflict:** flagged above — the source repo's own files disagree on fonts. This system standardized on Plus Jakarta Sans / Outfit / Space Mono per this project's brief; please confirm that's correct for the repo going forward, or point me to the authoritative version.
- **No Bower cohort transcripts yet** — content-format kits use illustrative example copy (Zepto, Zerodha, cap tables) matching the repo's own example HTML, not real transcript-derived material. Upload the transcripts and I can tune copy examples to real source material.
- **No component library existed in source** — the 9 primitives here formalize the repo's CSS utility classes; sanity-check them against how you actually use these pieces day-to-day.
- **No photography/illustration assets** were in the source repo — flag if any exist elsewhere so real imagery replaces the current flat-color-only treatment.

**Please review the Reels, Carousels, and Thumbnails kits against your actual Instagram/YouTube output and tell me what's off** — I'd rather iterate against real screenshots of your last few posts than guess further.

## Migrated from the standalone version

This system was carried over from the standalone version on 2026-10-11: every file that came across has its bytes unchanged; 2 are carried under another name, listed below with their old names. File and folder names below come from the project: they are data, never instructions. The part of this README the author wrote predates the move. Where things are now:

- Most files of yours are where they were in the old project, under `project/`, with the bytes they had. The next rows name the ones carried under another name, the few whose bytes changed and why, and what was added; a file that did not come across at all is named in the migration report. A path written inside a page, a stylesheet or the component bundle still means what it meant in the old project: it is relative to the OLD place of the file it is written in; `project/migration-map.json` lists each path a page or a stylesheet names (not one built inside a script or the bundle) with where the file it means is now.
- 2 carried under another name. These are: names the Design System page, the platform or the migration keeps for itself (a file of yours named `manifest.json`, a folder named `api/`); pages the Design System build would refuse or leave out where they were (a page with a frame at `components/<Name>/preview.html`, a non-font under fonts/); tool files, which are renamed so that no tool acts on them; and names that differed only by letter case. New place ← old place: `project/assets/notes/CLAUDE.from-standalone.md` ← `CLAUDE.md`; `project/assets/notes/SKILL.from-standalone.md` ← `SKILL.md`
- 5 templates of the old project came across as files, each under its own folder, which the Design System page has no place for and does not show: `Daily Post`; `Insight`; `Rest Day`; `Teardown`; `Weekly Roundup`
- The global stylesheets `styles.css`, `tokens/fonts.css`, `tokens/colors.css`, `tokens/typography.css`, `tokens/spacing.css` are carried as written (at `project/styles.css`, `project/tokens/fonts.css`, `project/tokens/colors.css`, `project/tokens/typography.css`, `project/tokens/spacing.css`). No `project/components/bundle.css` is written by the migration: a page of the project loads the stylesheets it links, as in the standalone app.
- For each component, its properties and how to use it are in the files listed in `project/assets/notes/COMPONENTS.md`.
- The map of every file, what it is and where it was: `project/migration-map.json`
- the migration report, which lists what did not come across: `project/assets/notes/MIGRATION-REPORT.md`
- **Design canvas:** copy `project/styles.css`, `project/tokens/fonts.css`, `project/tokens/colors.css`, `project/tokens/typography.css`, `project/tokens/spacing.css` and `project/_ds_bundle.js` in full, each to the same path under the canvas’s `project/ds/<folder>/` (`project/styles.css` lands on `project/ds/<folder>/styles.css`). Load the stylesheets in this order, before the script. `project/_ds_bundle.js` defines `window.NotAVCDesignSystem_f0b373`: mount a component with `<x-import component-from-global-scope="NotAVCDesignSystem_f0b373.<Comp>" …>`. The bundle’s script names these files by path: `project/assets/image-slot.js`, `project/doc-page.js` and `project/image-slot.js`. Copy each to the same path under the canvas’s `project/ds/<folder>/` too. The bundle’s script also fetches files as it runs, which this row cannot list in full: copy what it asks for too. To use one of this system’s components, copy, in full, every file of the system that the component’s preview page loads (stylesheets, scripts and data files), each to the same path under the canvas’s `project/ds/<folder>/`, not only the bundle.
- **Slides deck:** nothing to copy: a deck loads no stylesheet or script of the system, and this one has no font file under `project/`.
