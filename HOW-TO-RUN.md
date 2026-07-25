# NotAVC — How To Run Everything (KT Document)

Read this once. It covers what exists, what runs by itself, what you do daily, and the two small manual steps left.

---

## 1. The map

```
Desktop/NotAVC-HQ/
├── site/          → your website (Next.js). Deploy target: Vercel.
├── brand/         → Design System v3 + new logo SVGs
├── content-hq/    → content strategy, templates, Week-1 platters
├── assets/        → your original GitHub repo (v2 design system, social templates)
├── README.md      → folder overview
└── HOW-TO-RUN.md  → this file
```

**In the cloud:**
- **Google Drive → "NotAVC Content HQ" folder** — your daily platters land here. Open the Drive app on your phone each morning.
- **Claude routine "NotAVC Daily Platter"** — runs every day at 6:04 AM IST. It web-searches that day's India startup/VC news, writes a fresh platter (LinkedIn post + carousel + 30s reel + fact-check list), and saves it as a Google Doc in that folder. Manage it here: https://claude.ai/code/routines (pause, edit, delete anytime).

## 2. Your daily loop (10 minutes)

1. Morning: open Drive → today's platter doc.
2. Read it. Make ONE edit so it sounds like you.
3. Check the fact-check list (2 min — every number has a source).
4. ~9:00 AM IST: paste the LinkedIn post → publish.
5. Afternoon/evening: build the carousel from `assets/carousel-templates.html`, post to Instagram (@notavc.co). Record the 30s reel when the day calls for one.
6. Done. **Nothing ever auto-publishes — you are always the final click.**

No 24-hour pressure: if a day slips, the platter rolls forward. Episode numbers are sequential, not date-locked.

## 3. Two manual steps left (do tomorrow, ~5 minutes total)

### a) Put the repo on GitHub (needed once)
GitHub CLI is already installed. In a terminal (or type `!` before the command inside Claude Code):
```
gh auth login          ← opens browser, click Authorize (one time)
cd Desktop/NotAVC-HQ
gh repo create NotAVC-HQ --private --source . --push
```

### b) Put the site live on Vercel
I tried deploying tonight — your Vercel connector said "no permission to create a project" (403). Two fixes, pick one:

- **Best (permanent):** after step (a), go to https://vercel.com/new → Import `NotAVC-HQ` → set **Root Directory = `site`** → Deploy. From then on, every git push auto-deploys. This is the solid, no-middleman setup.
- **Or:** reconnect the Vercel connector at https://claude.ai/settings/connectors with full permissions, then tell Claude "deploy the notavc site" — I'll do it.

## 4. Why this stack won't break in a few days (your "no free-tier trap" question)

| Piece | What it runs on | Risk of surprise limits |
|---|---|---|
| Website | Vercel Hobby | None for a portfolio site — free for personal use permanently, no card needed |
| Daily platter | Your existing Claude plan (routines) | Uses your plan's usage; no third-party key to expire |
| Platter storage | Your own Google Drive | None |
| Content source | Live web search inside the routine | None |
| Posting | You, manually | None — and no API keys to get banned |

Deliberately **not** used: Zapier/Make/Buffer free tiers, trial API keys, LinkedIn/Instagram auto-posting APIs. Those are exactly the things that die after a few days or get accounts flagged. If you later want scheduled auto-posting at scale, the honest path is a paid Buffer/Typefully plan (~$10/mo) or Meta/LinkedIn developer apps — tell Claude "wire the platter to Buffer" when that day comes.

## 5. Common tasks

| I want to… | Do this |
|---|---|
| Change any site text | Edit `site/lib/content.ts` (all copy lives there), then `git push` (auto-deploys once Vercel is connected) |
| See the site locally | `cd Desktop/NotAVC-HQ/site` → `npm run dev` → http://localhost:3000 |
| Add a teardown card | Add one object to `TEARDOWNS` in `site/lib/content.ts` |
| Change platter time/rules | https://claude.ai/code/routines → "NotAVC Daily Platter" → edit prompt/schedule |
| Pause daily platters | Same page → toggle off |
| Post with browser help | In Claude Code: "post today's platter" — it opens LinkedIn/IG in Chrome, pastes; you click Publish |
| New logos / brand rules | `brand/` folder — Design System v3 |

## 6. What got built (for reference)

- **Site:** Next.js 16 + Tailwind 4 + Framer Motion. Three palettes (Off-White & Rust → Nature Editorial → Luxe Dark) that crossfade as you scroll, anchored on Crimson Depth #710014. Two motion moments only (hero masthead, teardown desk). Static build, 60fps budget enforced — details in `site/README.md`.
- **Brand v3:** crimson anchor, `NotAVC.` wordmark (crimson full stop), monogram with the "footnote pixel". v2 stays valid for existing social templates.
- **Content engine:** strategy + templates + Week 1 (EP.001–EP.007) pre-written with real news pegs (Udaan's structured $160M round, July's $820M funding month), MBA lenses across finance/marketing/ops/accounting/econ, and 30s reel scripts.
