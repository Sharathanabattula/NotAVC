# NotAVC — Design System v2.0

## Brand identity

**Name:** NotAVC
**Full name:** NotAVC — Venture Intelligence for Everyone
**Creator:** Sharath Chandra Anabattula
**Positioning:** "Not a VC. Just a student who refuses to learn this stuff quietly."

NotAVC is a personal brand and content platform where Sharath Chandra Anabattula — a 24-year-old MBA student specializing in Finance & Derivatives at SR University — documents his journey learning venture capital, private equity, startup analysis, company valuations, and financial markets. In public. In real-time. From a student's lens.

NotAVC is NOT a 30-day challenge. It is the permanent home for everything Sharath learns, builds, and analyzes in the VC/PE/startup space.

## Content pillars

1. **VC/PE concepts explained** — One concept at a time. Cap tables, term sheets, liquidation preferences, IRR, MOIC. Always with an Indian-context analogy.
2. **Company teardowns** — Pick a company, pull the numbers, find the moat. Every teardown has ONE number that tells the real story.
3. **Founder/CEO stories** — The decisions that built or broke companies. Strategic moves, pivots, bets.
4. **Market analysis** — Trends, sector maps, funding patterns, macro shifts. India-first.
5. **Learning journal** — What I learned, what surprised me, what I got wrong. Raw documentation.
6. **Startup ideas + analysis** — Spotting gaps, running back-of-envelope valuations, thinking like a VC.

## Target audience

- **Primary:** MBA students, commerce graduates, young professionals curious about VC/PE. Age 20-28. India-first.
- **Secondary:** Early-stage founders wanting to understand VC thinking before fundraising.
- **Tertiary:** Professionals in consulting/banking/tech exploring VC/PE pivots.

---

## Color palette

### Primary

| Name    | Hex       | Usage                                                              |
|---------|-----------|--------------------------------------------------------------------|
| Ink     | `#0B0B0B` | Headings, primary text, dark-mode backgrounds                      |
| Paper   | `#FFFFFF` | Light-mode backgrounds, card surfaces                              |
| Signal  | `#0A7558` | Brand accent, key data highlights, links, monogram. Use sparingly. |
| Mint    | `#4ADE9F` | Dark-surface highlights only (Reels, YT thumbnails, Stories)       |
| Canvas  | `#F5F5F5` | Card backgrounds, carousel slides, subtle surfaces                 |
| Muted   | `#888888` | Secondary text, metadata, captions                                 |

### Extended (data visualization only)

| Name  | Hex       | Usage                                                 |
|-------|-----------|-------------------------------------------------------|
| Coral | `#E8593C` | Negative metrics (burn rate, loss, decline)            |
| Amber | `#F2A623` | Warnings, neutral highlights                          |
| Info  | `#3B8BD4` | Positive metrics (growth, revenue, runway)             |
| Deep  | `#1A1A2E` | Alternative dark background for Stories and special Reels |

### Color rules

- Signal green (#0A7558) is earned — never for backgrounds or large fills. Max 3 uses per frame.
- Mint (#4ADE9F) is exclusively for dark surfaces. Never on white — it washes out.
- Ink (#0B0B0B) is not pure black — it's 96% dark, softer and more refined than #000000.
- Coral, Amber, Info only appear in teardown content and data visualizations.

---

## Typography

### Font stack

| Role      | Font              | Weights   | Usage                                                     |
|-----------|-------------------|-----------|------------------------------------------------------------|
| Display   | Plus Jakarta Sans | 600–800   | Headlines, stat numbers, brand name, carousel titles, hooks |
| Body      | Outfit            | 300–500   | Body text, descriptions, captions, long-form content        |
| Data      | Space Mono        | 400, 700  | Numbers, metrics, valuations, dates, episode numbers, metadata |

### Type scale

| Tier        | Font              | Weight | Size  | Tracking | Leading | Usage                           |
|-------------|-------------------|--------|-------|----------|---------|----------------------------------|
| Display     | Plus Jakarta Sans | 800    | 32px  | -0.5px   | 1.15    | Hero headlines, Reel hooks       |
| Heading     | Plus Jakarta Sans | 700    | 22px  | -0.3px   | 1.25    | Section headers, carousel titles |
| Subheading  | Plus Jakarta Sans | 600    | 16px  | -0.2px   | 1.35    | Card titles, subsection headers  |
| Body        | Outfit            | 400    | 16px  | 0        | 1.6     | Body text, descriptions          |
| Data        | Space Mono        | 400    | 14px  | 0        | 1.4     | Metrics, valuations, numbers     |
| Caption     | Outfit            | 400    | 13px  | 0        | 1.5     | Captions, timestamps             |
| Micro       | Space Mono        | 400    | 11px  | 2px      | 1.3     | Brand labels, uppercase metadata |

### Why this stack

- **Plus Jakarta Sans** — Geometric but warm. Rounder than Montserrat, same impact. Used by Stripe, Linear, Vercel. Nobody in Indian finance content uses it. Instant premium signal.
- **Outfit** — Clean geometric body font. More modern than Source Sans, lighter visual weight. Highly legible at 13-16px on mobile.
- **Space Mono** — Fixed-width with personality. More distinctive than Source Code Pro. The "quant" signal that makes data feel intentional, not decorative.

### Type rules

- Plus Jakarta Sans is for headlines ONLY. Never for body text. Always negative letter-spacing (-0.2 to -0.5px).
- Space Mono for ALL numbers — valuations, percentages, dates, episode numbers. This is the "quant" signal.
- Outfit is the workhorse for readable body text. Never bold Outfit — switch to Plus Jakarta Sans for emphasis.
- No font mixing within a single line, except: inline data points (Space Mono) within an Outfit sentence.

### Google Fonts import

```
https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap
```

---

## Logo system

### Primary wordmark

The word "NotAVC" set in Montserrat 800. "Not" renders at 35-40% opacity. "AVC" at full opacity. This visually encodes the brand positioning — the qualifier recedes, the authority builds.

### Variants

1. **Light** — Ink text on Paper background
2. **Dark** — White text on Ink background
3. **Accent** — White text on Signal green background
4. **Compact** — Smaller wordmark without tagline
5. **Monogram** — "N" in Montserrat 800, white, inside a Signal green (#0A7558) rounded square (border-radius: 6px). For profile pictures and favicon only.

### Tagline

"VENTURE INTELLIGENCE FOR EVERYONE" — Source Code Pro 500, 8-9px, letter-spacing: 2px, 45% opacity. Optional. Used on formal brand applications and large logo placements.

### Clear space

Minimum clear space = 1.5x the height of the "A" character on all sides. Never stretch, rotate, add effects, or change the font.

---

## Social template specs

### Instagram Reel / YouTube Short (9:16, 1080×1920)

- Background: #0B0B0B (Ink)
- Top bar: NotAVC pill (Montserrat 700, 9px, white, rgba(255,255,255,0.1) bg, border-radius: 16px) top-left. Episode number (Source Code Pro, 8px, rgba(255,255,255,0.35)) top-right.
- Face-up video: centered, occupying middle 40% of frame
- Hook text: bottom third, Montserrat 800, 14-16px, white, key terms highlighted in Mint (#4ADE9F)
- Sub-hook: Source Sans 3, 10px, rgba(255,255,255,0.45)
- Animated captions: Source Sans 3, centered, white on semi-transparent dark bg

### Instagram Post (1:1, 1080×1080)

- Background: #FFFFFF (Paper)
- Brand label: "NOTAVC — [CONTENT TYPE]" in Montserrat 800, 9px, Signal green, letter-spacing: 1px, top-left
- Hero stat: Montserrat 800, 36-40px, Ink, centered vertically
- Description: Source Sans 3, 11px, Muted
- Tags: Source Code Pro, 9px, Signal green on rgba(10,117,88,0.08) bg, border-radius: 4px

### Carousel (4:5, 1080×1350)

- Background: #FAFAFA (slightly off-white Canvas)
- Slide number: Source Code Pro, 8px, #bbb, top-right
- Title: Montserrat 800, 12-14px, Ink
- Body: Source Sans 3, 10-11px, #666
- Brand bar: bottom, border-top 0.5px solid #E5E5E5, NotAVC in Montserrat 700 8px Signal green left, dot indicators right (Signal green active, #ddd inactive, 4-5px circles)

### LinkedIn Quote Card (1.91:1, 1200×628)

- Background: #FFFFFF (Paper)
- Brand label: "NOTAVC" in Montserrat 800, 8-9px, Signal green, letter-spacing: 1.5px
- Quote: Montserrat 700, 12-13px, Ink
- Footer: Source Sans 3, 9-10px, Muted. Name left, @notavc right

### Instagram Story Poll (9:16, 1080×1920)

- Background: gradient from #0B0B0B to #1A1A2E (Deep)
- Brand pill: top-left
- Question: Montserrat 700, 13px, white, centered
- Options: Source Sans 3, 10px, rgba(255,255,255,0.8) on rgba(255,255,255,0.08) bg, border: 0.5px solid rgba(255,255,255,0.15), border-radius: 8px. Highlight option: Mint border + Mint text.

### YouTube Thumbnail (16:9, 1280×720)

- Background: #0B0B0B (Ink)
- Play button: centered, 44px circle, rgba(255,255,255,0.15), white play icon
- Title: Montserrat 800, 12px, white, bottom-left
- Meta: Source Sans 3, 9px, rgba(255,255,255,0.4)

### Threads / X Post Card (1:1, 1080×1080)

- Background: #FFFFFF (Paper), 0.5px solid #eee border
- Brand label: "NOTAVC · THREAD" in Montserrat 800, 8px, Signal green, top-left
- Main text: Montserrat 700, 12px, Ink, centered vertically
- Footer: Source Sans 3, 10px, Muted, bottom

---

## Content format structures

### Format 1: VC concept explained (60s Reel)

```
HOOK    (0-3s)   — One punchy line creating curiosity or tension
SETUP   (3-15s)  — Why this matters. One real-world reference
CORE    (15-45s) — Concept in layman terms. ONE analogy. Max 3 parts
OVEN    (45-55s) — The insight nobody else is saying
CLOSE   (55-60s) — Question or honest admission
```

### Format 2: Company teardown (90s Reel + Carousel)

```
HOOK    — "[Company] raised ₹[X]Cr. Here's what nobody's asking."
WHAT    — One line. What they do
NUMBER  — THE metric that matters. Just one
MOAT    — Why they win or why they're vulnerable
VC LENS — Why investors said yes (or should have said no)
MY TAKE — What I actually think as a student
```

### Format 3: Founder/CEO story (60s Reel)

```
HOOK    — The contrarian or surprising decision
CONTEXT — Where they were when they made it
DECISION — The actual move. Be specific
OUTCOME  — What happened. With a number
LESSON   — What I (student) take from this
```

### Format 4: Market analysis (90s Reel + Thread)

Data-led. Open with surprising stat. Walk through trend with 2-3 data points. Close with implications. Thread: 5-8 posts, numbered.

### Format 5: Weekly journal (60s Reel + LinkedIn post)

Most personal format. "3 things I learned this week." Chinmai Velocity style on LinkedIn: short paragraphs, punchy, under 130 words.

---

## Voice rules

### Tone

- Raw. Not polished. Not motivational.
- Talk like a sharp friend explaining VC over chai.
- First person: "I" not "we."
- Admit gaps: "I didn't know this until last Tuesday."
- End every post with a question or honest statement.

### Banned words

thrilled, honored, journey, game-changer, leverage, unlock, empower, delve, navigate, foster, seamless, robust, holistic, elevate

### Hashtag rules

- #NotAVC is mandatory on every post
- Rotate 3 others from bank: #VCForNormalPeople #StartupBreakdown #LearnVC #IndianStartups #VentureCapital #PrivateEquity #BuildInPublic #StartupIndia #MBALife #CompanyTeardown
- Max 4 per post. Max 1 emoji per post.

### Quality gate (all 7 must pass)

1. Does the hook stop the scroll?
2. Contains at least one specific number or data point?
3. Includes the student/learning angle?
4. Under word limit for the format?
5. No banned words?
6. Would a 22-year-old college student understand this?
7. Would a VC professional respect this?

---

## Episode numbering

Every piece of content gets a sequential episode number: EP.001, EP.002, etc.

- Font: Source Code Pro, uppercase, with leading zero
- Cross-platform: same number on IG, YT, LinkedIn, Threads
- If a topic gets multiple formats (Reel + Carousel + Thread), they share the same episode number
