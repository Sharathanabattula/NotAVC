import { NextResponse, after } from "next/server";
import { db } from "@/lib/supabase";
import { answerCallback, notify } from "@/lib/telegram";
import { processIdea } from "@/lib/intake";

export const dynamic = "force-dynamic";
// Drafting takes ~20s and runs in `after`, past the default 10s ceiling
export const maxDuration = 60;

/*
  Telegram webhook — where approval actually happens.

  Telegram authenticates itself with a secret token header set at
  registration time (setWebhook?secret_token=...). Without that check this
  endpoint would let anyone on the internet approve a post, so it is the
  first thing that runs.

  Only the configured chat may act, even with a valid secret: the bot could
  be added to another chat, and a stranger tapping Approve must not publish
  to Sharath's accounts.
*/

type CallbackQuery = {
  id: string;
  data?: string;
  message?: { chat?: { id: number } };
  from?: { id: number; username?: string };
};

export async function POST(request: Request) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const got = request.headers.get("x-telegram-bot-api-secret-token");
  if (!expected || got !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const update = (await request.json()) as {
    callback_query?: CallbackQuery;
    message?: { chat?: { id: number }; text?: string };
  };

  const allowedChat = process.env.TELEGRAM_CHAT_ID;

  /*
    A plain text message is an idea. Drafting takes ~20s, which is longer
    than Telegram's webhook patience — it retries anything slow, and a
    retry would bill a second draft and post a duplicate card. So
    acknowledge immediately and let the work finish in the background.
  */
  if (update.message?.text) {
    /*
      A mismatch here used to return 200 and drop the message with no trace,
      which is indistinguishable from the bot being dead — and the usual
      cause is a placeholder still sitting in the deployment's env, not a
      genuine stranger. Log enough to tell those apart without printing the
      configured id.
    */
    const from = String(update.message.chat?.id ?? "");
    if (from !== allowedChat) {
      console.warn(
        `[telegram] dropped message from chat ${from}: ` +
          (!allowedChat
            ? "TELEGRAM_CHAT_ID is not set on this deployment"
            : allowedChat.startsWith("PASTE_")
              ? "TELEGRAM_CHAT_ID is still a placeholder on this deployment"
              : "chat id does not match the configured one"),
      );
      return NextResponse.json({ ok: true });
    }

    const text = update.message.text.trim();
    if (text.startsWith("/")) {
      await notify(
        text === "/start"
          ? "Send me a news link or an idea and I'll draft the platter."
          : "Unknown command. Just send the idea as a message.",
      );
      return NextResponse.json({ ok: true });
    }
    if (text.length < 20) {
      await notify("Give me a bit more — a link, or a sentence about the idea.");
      return NextResponse.json({ ok: true });
    }

    await notify("📝 Drafting… the card lands here in about 20 seconds.");

    const siteUrl =
      process.env.SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : new URL(request.url).origin);

    /*
      `after` rather than a floating promise. A serverless function is
      frozen the moment it responds, so `void processIdea(...)` ran fine
      locally and silently never executed in production — the drafting
      simply vanished, with Telegram seeing a clean 200.
    */
    after(async () => {
      await processIdea(text, allowedChat, siteUrl);
    });

    return NextResponse.json({ ok: true });
  }

  const cb = update.callback_query;
  if (!cb?.data) return NextResponse.json({ ok: true });
  if (String(cb.message?.chat?.id ?? "") !== allowedChat) {
    await answerCallback(cb.id, "Not authorised.");
    return NextResponse.json({ ok: true });
  }

  const [action, postId] = cb.data.split(":");
  if (!postId) return NextResponse.json({ ok: true });

  const supabase = db();

  const nextStatus =
    action === "approve"
      ? "approved"
      : action === "changes"
        ? "changes_requested"
        : action === "reject"
          ? "draft"
          : null;

  if (!nextStatus) return NextResponse.json({ ok: true });

  // Only a post still awaiting a decision can be moved. Prevents a stale
  // card in the chat history from un-publishing something already live.
  const { data: updated, error } = await supabase
    .from("posts")
    .update({ status: nextStatus })
    .eq("id", postId)
    .in("status", ["pending_approval", "changes_requested", "draft"])
    .select("id, channel, scheduled_for")
    .maybeSingle();

  if (error || !updated) {
    await answerCallback(cb.id, "Already decided or no longer pending.");
    return NextResponse.json({ ok: true });
  }

  await supabase.from("approvals").insert({
    post_id: postId,
    action: action === "approve" ? "approved" : action === "changes" ? "changes_requested" : "rejected",
    actor: cb.from?.username ?? "telegram",
  });

  const word =
    action === "approve"
      ? `Approved — goes out ${updated.scheduled_for ? "on schedule" : "once scheduled"}`
      : action === "changes"
        ? "Marked for changes"
        : "Rejected";

  await answerCallback(cb.id, word);
  await notify(`<b>${word}</b> · ${updated.channel}`);

  return NextResponse.json({ ok: true });
}
