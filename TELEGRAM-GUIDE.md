# The Telegram bot — how to use it

Your phone is the control room. This is everything the bot does.

Manus advised cutting this. Keep it — but know why: the bot is the
**phone-first** path, and `/studio` is the **fallback**. Neither replaces the
other, and if one breaks the other still publishes. That redundancy is the
reason to keep both, and the reason a broken bot never stops your posting.

---

## Setup — once, about 5 minutes

**1. Make the bot**

Telegram → search **@BotFather** → send `/newbot`
- Name: `NotAVC Desk`
- Username: must end in `bot` — e.g. `notavc_desk_bot`

He replies with a token. Paste it into `site/.env.local` line 16
(`TELEGRAM_BOT_TOKEN=`) and save.

**2. Say hi**

Open your new bot in Telegram and send it any message. A bot cannot message
you until you message it first — this is a Telegram rule, not a bug.

**3. Let me finish it**

Tell me and I'll run:

```bash
node automation/telegram-setup.mjs --webhook https://not-avc.vercel.app
```

That verifies the token, finds your chat id, writes it to `.env.local`,
registers the webhook, and sends you a test message. Your token never passes
through the chat — the script reads it from the file.

**4. Copy the values to Vercel**

Add `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to the project's environment
variables and redeploy. Local values do not reach production on their own.

---

## Daily use

### Sending an idea

Message the bot in plain English. A link, a rough thought, or both.

> Zepto raised $350M at $5B. Everyone's calling it a win. But their dark
> store count only went up 40% while GMV doubled — something's off.
> https://example.com/article

It replies **"📝 Drafting…"** immediately, then about twenty seconds later
sends the carousel images and an approval card.

**What makes a good message:**

| Good | Weak |
|---|---|
| A link plus your suspicion | Just a link |
| The number that bothers you | "Write about Zepto" |
| The take you want to correct | A topic with no angle |

The bot drafts; the angle is yours. If you give it nothing to correct, it
will invent a weak one — and the correction slide is the whole post.

### The approval card

```
EP.009 · INSTAGRAM · carousel
🕒 30 Jul 2026, 6:30 pm

[caption text]

Sources
1. …
2. …

[ ✅ Approve ]  [ ✏️ Changes ]
[ 🚫 Reject ]
```

| Button | What happens |
|---|---|
| **✅ Approve** | Joins the queue. Publishes at the scheduled time. You get the live link. |
| **✏️ Changes** | Parked. Nothing publishes. Edit in `/studio`, then re-send. |
| **🚫 Reject** | Back to draft. Nothing publishes. |

Every tap is written to an audit log, so there is a permanent record of what
you approved and when.

**Check the sources line before approving.** If it says *"No sources —
research-first rule not satisfied"*, the draft has nothing behind it. That is
the one thing worth rejecting on sight.

### After it posts

```
✅ Published to instagram
https://www.instagram.com/p/…
```

Or, if it failed:

```
⚠️ instagram publish failed (attempt 1/3)
media_url unreachable
```

It retries twice, then parks the post as `failed` and stops. It will not sit
in a loop hammering the API.

---

## What the bot will NOT do

Being explicit, because these are the gaps that will bite you.

- **It cannot iterate.** Tapping ✏️ Changes marks the post — you cannot reply
  *"make the hook punchier"* and get a redraft. Edit in `/studio`. This is
  half-built and I'll finish it when you want it.
- **It never publishes on its own.** Only `approved` posts are ever picked
  up. This is enforced in the database, not by convention.
- **It only listens to you.** The webhook checks a secret header *and* pins
  your chat id. Someone who finds the URL cannot approve anything.
- **It does not do reels.** Carousels and single images only.

---

## When it breaks

It will, eventually — during exams, going by precedent.

**Nothing is lost.** The bot is a notification surface; the queue lives in
the database. Everything approved still publishes on schedule with the bot
completely dead.

| Symptom | Fix |
|---|---|
| No reply to messages | Webhook lapsed. Re-run the setup command in step 3. |
| Card arrives, buttons do nothing | `TELEGRAM_CHAT_ID` wrong in Vercel, or the secret mismatched. |
| "Drafting…" then silence | `ANTHROPIC_API_KEY` missing or out of credit. |
| Nothing at all | Use `/studio` — same lanes, same approve button, works in any browser. |

**The rule: if the bot is down, go to `/studio`.** Don't wait on it, and
don't let a dead bot become a reason not to post.

---

## What it costs

Telegram is free and has no limits that matter here.

Drafting costs roughly **₹2.40 per post** through the Anthropic API. At
3 posts a week that is about **₹30/month**.

If you'd rather not pay it: write the post yourself and use `/studio` to
render and schedule it. The bot still sends the approval card. The artwork,
scheduling and publishing stay automated either way — the API only writes the
first draft.
