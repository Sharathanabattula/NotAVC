/*
  Telegram setup helper.

  Reads the bot token from site/.env.local, finds the chat id, writes it
  back, and registers the webhook. The token is never printed — it goes
  from the file to the API and nowhere else.

  Usage:
    node automation/telegram-setup.mjs            # find + save chat id
    node automation/telegram-setup.mjs --webhook  # also register webhook
*/

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ENV = path.join(here, "..", "site", ".env.local");

const raw = await readFile(ENV, "utf8");
const get = (key) => {
  const match = raw.match(new RegExp(`^${key}=(.*)$`, "m"));
  const value = match?.[1]?.trim();
  return value && !value.startsWith("PASTE_") ? value : null;
};

const token = get("TELEGRAM_BOT_TOKEN");
if (!token) {
  console.error("✗ TELEGRAM_BOT_TOKEN is still a placeholder in site/.env.local");
  console.error("  Get one from @BotFather, put it on line 16, save, and rerun.");
  process.exit(1);
}

const api = (method, params) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params ?? {}),
  }).then((r) => r.json());

/* Confirm the token works before doing anything with it */
const me = await api("getMe");
if (!me.ok) {
  console.error(`✗ Telegram rejected the token: ${me.description}`);
  process.exit(1);
}
console.log(`✓ Bot is @${me.result.username}`);

/* Find the chat id from whatever the user last sent the bot */
const updates = await api("getUpdates");
const chats = new Map();
for (const u of updates.result ?? []) {
  const msg = u.message ?? u.channel_post ?? u.callback_query?.message;
  if (msg?.chat?.id) {
    chats.set(msg.chat.id, msg.chat.username ?? msg.chat.first_name ?? "chat");
  }
}

if (!chats.size) {
  console.error("✗ No messages found. Open the bot in Telegram, send it any");
  console.error("  message (\"hi\" is fine), then rerun this.");
  process.exit(1);
}

if (chats.size > 1) {
  console.log("! Multiple chats found — using the most recent:");
  for (const [id, name] of chats) console.log(`    ${id}  ${name}`);
}

const [chatId, chatName] = [...chats].pop();
console.log(`✓ Chat id ${chatId} (${chatName})`);

/*
  Only rewrite the one line. A full re-serialise would reorder or reformat
  the other entries, and this file holds live credentials.
*/
const updated = raw.replace(/^TELEGRAM_CHAT_ID=.*$/m, `TELEGRAM_CHAT_ID=${chatId}`);
if (updated === raw) {
  console.error("✗ Could not find a TELEGRAM_CHAT_ID line to update");
  process.exit(1);
}
await writeFile(ENV, updated);
console.log("✓ Saved to site/.env.local");

if (process.argv.includes("--webhook")) {
  const siteUrl = process.argv[process.argv.indexOf("--webhook") + 1];
  const secret = get("TELEGRAM_WEBHOOK_SECRET");
  if (!siteUrl?.startsWith("https://")) {
    console.error("✗ Pass the site URL: --webhook https://not-avc.vercel.app");
    process.exit(1);
  }
  if (!secret) {
    console.error("✗ TELEGRAM_WEBHOOK_SECRET is not set in site/.env.local");
    process.exit(1);
  }

  const hook = await api("setWebhook", {
    url: `${siteUrl.replace(/\/$/, "")}/api/telegram`,
    secret_token: secret,
    // "message" matters as much as the button taps: ideas get sent to the
    // bot as plain text, and filtering to callback_query alone would drop
    // them silently at Telegram's end, before the webhook ever sees them.
    allowed_updates: ["callback_query", "message"],
  });

  if (!hook.ok) {
    console.error(`✗ setWebhook failed: ${hook.description}`);
    process.exit(1);
  }
  console.log(`✓ Webhook registered at ${siteUrl}/api/telegram`);
}

const testMessage = await api("sendMessage", {
  chat_id: chatId,
  text: "✅ NotAVC desk is wired up. Approval cards will arrive here.",
});
console.log(
  testMessage.ok
    ? "✓ Test message sent — check Telegram"
    : `! Test message failed: ${testMessage.description}`,
);
