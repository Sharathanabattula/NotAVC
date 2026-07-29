/*
  Telegram is the approval surface: the bot sends the platter, Sharath
  replies with a button, nothing reaches LinkedIn or Instagram until he does.

  Every function here fails soft. A notification that cannot be delivered
  must never take down the publish run that triggered it.
*/

const API = "https://api.telegram.org/bot";

/*
  A placeholder is truthy, so a `PASTE_` value would sail through a plain
  presence check and every send would fail silently against a bogus token.
  Treat those as unset, and say so once — a bot that appears dead because
  of an unfilled variable is the hardest failure to diagnose from outside.
*/
function config() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const ok = (v?: string) => !!v && !v.startsWith("PASTE_");

  if (!ok(token) || !ok(chatId)) {
    console.warn(
      "[telegram] not configured on this deployment — " +
        `token ${ok(token) ? "ok" : "missing/placeholder"}, ` +
        `chat id ${ok(chatId) ? "ok" : "missing/placeholder"}`,
    );
    return null;
  }
  return { token: token as string, chatId: chatId as string };
}

export async function notify(text: string): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

  try {
    const res = await fetch(`${API}${cfg.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export type ApprovalCard = {
  postId: string;
  ep: string;
  channel: string;
  format: string;
  caption: string;
  scheduledFor: string | null;
  sources: { title: string | null; url: string }[];
};

/* The approve/edit/reject card. Buttons carry the post id in callback_data. */
export async function sendApprovalCard(card: ApprovalCard): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

  const when = card.scheduledFor
    ? new Date(card.scheduledFor).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "not scheduled";

  const sources = card.sources.length
    ? card.sources
        .map((s, i) => `${i + 1}. <a href="${s.url}">${escapeHtml(s.title ?? s.url)}</a>`)
        .join("\n")
    : "<i>No sources — research-first rule not satisfied</i>";

  const text = [
    `<b>${escapeHtml(card.ep)}</b> · ${card.channel.toUpperCase()} · ${card.format}`,
    `🕒 ${when}`,
    "",
    escapeHtml(card.caption),
    "",
    `<b>Sources</b>`,
    sources,
  ].join("\n");

  try {
    const res = await fetch(`${API}${cfg.token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              { text: "✅ Approve", callback_data: `approve:${card.postId}` },
              { text: "✏️ Changes", callback_data: `changes:${card.postId}` },
            ],
            [{ text: "🚫 Reject", callback_data: `reject:${card.postId}` }],
          ],
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/*
  Sends the artwork as an album, then the approval card beneath it.

  Two messages on purpose: Telegram albums cannot carry inline keyboards,
  so the buttons have to ride on a separate message. Sending the album
  first means the images are what Sharath sees when the notification opens.
*/
export async function sendCarousel(
  card: ApprovalCard & { imageUrls: string[] },
): Promise<boolean> {
  const cfg = config();
  if (!cfg) return false;

  if (card.imageUrls.length) {
    try {
      await fetch(`${API}${cfg.token}/sendMediaGroup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cfg.chatId,
          // Telegram caps an album at 10
          media: card.imageUrls.slice(0, 10).map((url) => ({ type: "photo", media: url })),
        }),
      });
    } catch {
      // Artwork is nice to have; the card carries the decision, so a failed
      // album must not stop the approval request going out.
    }
  }

  return sendApprovalCard(card);
}

export async function answerCallback(callbackId: string, text: string) {
  const cfg = config();
  if (!cfg) return;
  try {
    await fetch(`${API}${cfg.token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackId, text }),
    });
  } catch {
    /* answering is cosmetic — the decision is already recorded */
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
