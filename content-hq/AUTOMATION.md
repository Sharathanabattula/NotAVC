# NotAVC — Posting Automation

## How the pipeline works

```
DAILY ROUTINE (cloud, scheduled)          YOU (2–10 min/day)
─────────────────────────────────         ──────────────────
Generates tomorrow's platter       ──►    Open Airtable / platter file
· follows CONTENT-STRATEGY.md             Review + one personal edit
· passes the 7-point quality gate         Verify numbers (fact-check list)
· lands in Airtable "Content HQ"          Paste → post → flip Status to Posted
```

**Nothing auto-publishes.** The system automates everything up to the moment of judgment, then stops — the same rule the site uses for motion.

## Layer 1 — The daily platter (automated)

A scheduled Claude routine drafts the next platter every morning and appends it to the **NotAVC Content HQ** Airtable base (view it in the Airtable mobile app — that's your daily "notes" surface). The `content-hq/platter/` folder in this repo holds the reviewed/curated versions you want to keep in git.

Manage the routine at claude.ai (Routines) — pause, reschedule, or edit the prompt any time.

## Layer 2 — Posting (semi-automated, you press the button)

### Today
1. Open the day's platter → copy the LinkedIn post → paste in LinkedIn → post.
2. For carousels: open `assets/carousel-templates.html`, fill the slide text, screenshot slides (or print-to-PDF), upload to Instagram.
3. In a Claude Code session you can also say: *"post today's platter"* — Claude will open LinkedIn/Instagram in Chrome via the browser extension, navigate to the composer, and paste the content. **You click Publish.**

### If you want true hands-off later (needs accounts/credentials)
| Path | What it takes | Verdict |
|---|---|---|
| Buffer / Typefully / Metricool | Free-ish tier, connect LinkedIn + IG once; routine output → their scheduler | **Easiest.** Do this first if manual paste gets old. |
| LinkedIn API (Community Mgmt) | LinkedIn developer app + OAuth + approval process | Heavy for one person. Skip for now. |
| Instagram Graph API | IG **Business** account + Facebook Page + Meta developer app | Only worth it at scale. Carousels via API are finicky. |

When you pick one, come back to a Claude Code session and say "wire the platter to Buffer" — the routine prompt can be updated to call its API with your token.

## Layer 3 — The archive

Posted content gets its episode number, and the best teardowns graduate to the site (`site/lib/content.ts` → `TEARDOWNS`). The feed is the funnel; the site is the record.
