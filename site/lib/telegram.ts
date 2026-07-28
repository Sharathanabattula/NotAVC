/*
  Telegram is the approval surface: the bot sends the platter, Sharath
  replies with a button, nothing reaches LinkedIn or Instagram until he does.

  Every function here fails soft. A notification that cannot be delivered
  must never take down the publish run that triggered it.
*/

const API = "https://api.telegram.org/bot";

function config() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  return token && chatId ? { token, chatId } : null;
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
