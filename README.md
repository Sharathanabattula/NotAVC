# NotAVC HQ

Everything the NotAVC brand runs on, in one place.

| Folder | What it is |
|---|---|
| `site/` | The flagship portfolio site (Next.js 16 + Tailwind 4 + Framer Motion). See `site/README.md` for the performance budget. |
| `brand/` | Design System v3 (Crimson Depth) + redesigned logo SVGs. |
| `content-hq/` | The Daily Platter system — content strategy, post templates, and the daily ready-to-post drafts. |
| `assets/` | Clone of the original NotAVC GitHub repo (Design System v2, social templates, tokens). Kept as its own git repo, ignored here. |

## The loop

1. A daily **platter** (LinkedIn post + Instagram carousel/reel script) lands in Airtable and `content-hq/platter/`.
2. You review, make one edit so it's yours, verify the numbers, and post. Nothing auto-publishes.
3. The site is the permanent archive the content points back to.
