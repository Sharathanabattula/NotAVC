# NotAVC — Go Live

Everything that could be built without your passwords is built. This is the
short list of things only you can do, in the order that unblocks the most.

Time estimate end to end: **about 40 minutes.**

---

## What already works

| Thing | State |
|---|---|
| Site design (dark, motion graphics) | Done, running locally |
| Supabase database | **Live** — project `notavc-hq`, Mumbai region, ₹0/month |
| `/studio` approval board | Built, gated, verified against fixtures |
| Telegram approval webhook | Built, waiting on a bot token |
| Cron publisher | Built, waiting on deployment |
| LinkedIn publishing | Token verified working |
| Instagram publishing | Code done, **waiting on your token** |

---

## Step 1 — Supabase key (2 min)

The site reads the database with the service-role key. It is secret; it never
goes in the browser and never in git.

1. Open <https://supabase.com/dashboard/project/cxvsiflqvnofqlhvusjm/settings/api-keys>
2. Copy the **`service_role`** key (not `anon`).
3. Open `site/.env.local` and replace `PASTE_SERVICE_ROLE_KEY`.

Then pick a Studio passphrase — anything you'll remember — and replace
`PASTE_A_PASSPHRASE` on the `STUDIO_PASSWORD` line.

Check it worked:

```bash
cd ~/Desktop/NotAVC-HQ/site
npm run dev
# open http://localhost:3000/studio — enter your passphrase
# you should see EP.008 with two draft posts
```

---

## Step 2 — Instagram token (5 min)

This is the last piece of the automation. The account is already connected —
only the token is missing.

1. Go to <https://business.facebook.com/settings/system-users>
2. Click **Notavc publisher bot** → **Generate new token**
3. App: **NotAVC**. Expiry: **Never**.
4. Tick these permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `business_management`
5. Copy the token into **both**:
   - `automation/.env` → `IG_TOKEN=`
   - `site/.env.local` → `IG_TOKEN=`

Verify:

```bash
cd ~/Desktop/NotAVC-HQ/automation
node -e "require('dotenv').config();fetch('https://graph.facebook.com/v23.0/'+process.env.IG_USER_ID+'?fields=username,followers_count&access_token='+process.env.IG_TOKEN).then(r=>r.json()).then(console.log)"
```

Expect `{ username: 'notavc.co', ... }`. If you get an OAuth error, the
permissions above were not all ticked.

---

## Step 3 — Telegram bot (8 min)

This is your approval inbox. Nothing posts without you tapping Approve here.

1. In Telegram, message **@BotFather** → `/newbot`
   - Name: `NotAVC Desk`
   - Username: anything ending in `bot`, e.g. `notavc_desk_bot`
   - He replies with a token → paste into `site/.env.local` as `TELEGRAM_BOT_TOKEN`
2. Message your new bot once (say "hi") so it can talk to you.
3. Get your chat id — paste your bot token into this URL in a browser:
   `https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates`
   Find `"chat":{"id":123456789` → that number is `TELEGRAM_CHAT_ID`.

`TELEGRAM_WEBHOOK_SECRET` is already generated for you — don't change it.

You'll register the webhook in Step 5, after the site has a public URL.

---

## Step 4 — GitHub + Vercel (15 min)

```bash
cd ~/Desktop/NotAVC-HQ
gh auth login          # browser opens, pick GitHub.com → HTTPS → login
git remote -v          # confirm it points at Sharathanabattula/NotAVC
git push -u origin main
```

Then at <https://vercel.com/new>:

1. Import the `NotAVC` repo.
2. **Root Directory: `site`** ← this one matters. It will fail without it.
3. Before clicking Deploy, open **Environment Variables** and paste in every
   line from `site/.env.local`. All of them, Production scope.
4. Deploy.

> Last time Vercel returned `You don't have permission to create a project`
> when I tried through the API. Importing through the website works — that
> error was about my API access, not your account.

---

## Step 5 — Point Telegram at the live site (2 min)

Once Vercel gives you a URL (e.g. `https://notavc.vercel.app`), run this,
substituting your bot token, your URL, and the `TELEGRAM_WEBHOOK_SECRET`
value from `site/.env.local`:

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -d "url=https://<YOUR-URL>/api/telegram" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

Expect `{"ok":true,...}`.

---

## Step 6 — First real post

1. Open `https://<your-url>/studio`, enter your passphrase.
2. EP.008 has two drafts (LinkedIn post + Instagram reel).
3. Hit **SEND TO TELEGRAM** on the LinkedIn one.
4. Telegram shows the caption, the schedule, and the sources, with three
   buttons: Approve / Changes / Reject.
5. Tap **Approve**.
6. The cron runs every 5 minutes; at the scheduled time it posts and
   messages you the live link.

The Instagram reel needs a **public video URL** in `media_urls` before it can
go out — Instagram's API downloads the file from a URL, it cannot take a
local upload. Supabase Storage is the natural place; I have not set that up
yet.

---

## How the safety works

You asked for approval before anything posts. Concretely:

- The cron **only** selects posts already in `approved`. A draft cannot leak out.
- Approval happens in exactly two places: the Telegram buttons, or the Studio
  board. Both write an audit row to `approvals`.
- The Telegram webhook checks a secret header **and** pins your chat id, so
  someone who guesses the URL still cannot approve anything.
- Studio cannot touch a post that is already published.
- Failed posts retry twice, then park in `failed` and ping you rather than
  retrying forever.

---

## Known issues

- **`npm audit` reports 12 high-severity findings in `sharp`** (image
  resizing, inherited from Next.js via libvips). The only offered fix is
  `npm audit fix --force`, which downgrades to Next.js 9 — a four-year
  regression. Not worth it: `sharp` only processes image files in the repo,
  none of which come from users. Revisit when Next ships a patched `sharp`.
- **Instagram reels need hosted media.** See Step 6.
- The content generator that fills `platters` daily is written as templates in
  `content-hq/` but is not yet wired to write into the database.

---

## Where things live

```
NotAVC-HQ/
├── site/                 Next.js app
│   ├── app/studio/       the approval board (gated)
│   ├── app/api/cron/     the scheduled publisher
│   ├── app/api/telegram/ the approval webhook
│   ├── lib/publish.ts    LinkedIn + Instagram API calls
│   └── .env.local        your secrets (never committed)
├── automation/           standalone publisher scripts
├── content-hq/           platter templates + strategy
└── DESIGN.md             the locked design system
```

Supabase project: `cxvsiflqvnofqlhvusjm` ·
<https://supabase.com/dashboard/project/cxvsiflqvnofqlhvusjm>
