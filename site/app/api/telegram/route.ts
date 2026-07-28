import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { answerCallback, notify } from "@/lib/telegram";

export const dynamic = "force-dynamic";

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

  const update = (await request.json()) as { callback_query?: CallbackQuery };
  const cb = update.callback_query;
  if (!cb?.data) return NextResponse.json({ ok: true });

  const allowedChat = process.env.TELEGRAM_CHAT_ID;
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
