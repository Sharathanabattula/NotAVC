import { NextResponse, after } from "next/server";
import { db } from "@/lib/supabase";
import { answerCallback, notify } from "@/lib/telegram";
import { processIdea } from "@/lib/intake";
import { handleQuickPost } from "@/lib/publish-quick";
import { QUICK_HELP } from "@/lib/quickpost";

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
    /* message_id keys inbox rows that carry no link of their own. */
    message?: { chat?: { id: number }; text?: string; message_id?: number };
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

    if (text.startsWith("/") || /^help$/i.test(text)) {
      await notify(QUICK_HELP);
      return NextResponse.json({ ok: true });
    }

    /*
      Picking from the morning digest. Numbers refer to that message's
      ordering, which is the newest unpicked topics — so the same list is
      reconstructed here rather than storing positions, and a stale reply
      to yesterday's digest simply picks from today's list instead of
      silently choosing the wrong story.
    */
    const pick = text.match(/^\s*pick\s+(\d{1,2})\s*$/i);
    if (pick) {
      const n = Number(pick[1]);
      const supabase = db();
      const { data: rows } = await supabase
        .from("topics")
        .select("id, channel, title, url")
        .is("picked_at", null)
        .is("built_at", null)
        .order("found_at", { ascending: false })
        .limit(12);

      const chosen = rows?.[n - 1];
      if (!chosen) {
        await notify(
          `No number ${n} on the current shortlist. Send <code>topics</code> to see it again.`,
        );
        return NextResponse.json({ ok: true });
      }

      await supabase
        .from("topics")
        .update({ picked_at: new Date().toISOString() })
        .eq("id", chosen.id);

      await notify(
        `✅ Picked <b>${chosen.title}</b>\n<i>${chosen.channel}</i>\n\n` +
          `I'll research it and send back the deck and the PDF.`,
      );
      return NextResponse.json({ ok: true });
    }

    /* Everything sent in by hand and not yet turned into a deck. */
    if (/^\s*inbox\s*$/i.test(text)) {
      const supabase = db();
      const { data: rows } = await supabase
        .from("topics")
        .select("title, url, notes, found_at")
        .eq("source", "inbox")
        .is("built_at", null)
        .order("found_at", { ascending: false })
        .limit(15);

      if (!rows?.length) {
        await notify("Inbox is empty. Send me a link or an idea and it lands here.");
        return NextResponse.json({ ok: true });
      }

      const esc = (s: string) =>
        s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);

      await notify(
        `<b>Inbox</b> — ${rows.length} waiting\n\n` +
          rows
            .map((r, i) => {
              const extra = (r.notes ?? "").split("\n").length - 1;
              return (
                `<b>${i + 1}.</b> ${esc(r.title)}` +
                (extra > 0 ? `\n<i>+ ${extra} more line${extra > 1 ? "s" : ""} of brief</i>` : "")
              );
            })
            .join("\n\n"),
      );
      return NextResponse.json({ ok: true });
    }

    /* Re-send the shortlist without waiting for tomorrow's digest. */
    if (/^\s*topics\s*$/i.test(text)) {
      const supabase = db();
      const { data: rows } = await supabase
        .from("topics")
        .select("channel, title, url, source")
        .is("picked_at", null)
        .is("built_at", null)
        .order("found_at", { ascending: false })
        .limit(12);

      if (!rows?.length) {
        await notify("Nothing on the shortlist right now.");
        return NextResponse.json({ ok: true });
      }

      const esc = (s: string) =>
        s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c]!);
      await notify(
        `<b>Shortlist</b>\n\n` +
          rows
            .map(
              (r, i) =>
                `<b>${i + 1}.</b> ${r.source === "youtube" ? "▶" : "■"} <i>${esc(r.channel)}</i>\n<a href="${r.url}">${esc(r.title)}</a>`,
            )
            .join("\n\n") +
          `\n\n<i>Reply</i> <code>pick 3</code>`,
      );
      return NextResponse.json({ ok: true });
    }

    const siteUrlForPost =
      process.env.SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : new URL(request.url).origin);

    /*
      A labelled message is a finished post and needs no model. Anything
      else is a raw idea for the drafter, which costs money and may not be
      configured — so the free path is checked first.
    */
    if (/^\s*HOOK\s*:/im.test(text)) {
      await notify("🎨 Building the carousel…");
      after(async () => {
        await handleQuickPost(text, siteUrlForPost);
      });
      return NextResponse.json({ ok: true });
    }

    /*
      The inbox.

      Anything that isn't a command is a brief: a link, a video, a story,
      the angle he wants taken, how he wants it read. It is stored verbatim
      — the whole message is the instruction, and summarising it here would
      throw away the part that matters.

      This used to fall through to the model drafter. With no API key
      configured that path throws, so a pasted link produced a failure
      notice and the brief was lost. Drafting is only attempted when a key
      is actually present.
    */
    const links = [...text.matchAll(/https?:\/\/[^\s<>"]+/g)].map((m) => m[0]);

    /*
      Titles are just a label for the shortlist. First non-empty line that
      isn't purely a URL reads better than the URL itself; falling back to
      the link keeps a bare-link message identifiable.
    */
    const firstLine =
      text
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l && !/^https?:\/\/\S+$/.test(l)) ?? links[0] ?? text.slice(0, 60);

    const supabase = db();
    /* Keyed by message id so two link-less briefs can't collide. */
    const key = links[0] ?? `tg:${update.message.message_id ?? Date.now()}`;

    const { error: inboxErr } = await supabase.from("topics").upsert(
      {
        source: "inbox",
        channel: "Sent by Sharath",
        title: firstLine.slice(0, 180),
        url: key,
        notes: text,
        published_at: new Date().toISOString(),
      },
      { onConflict: "url" },
    );

    if (inboxErr) {
      await notify(`⚠️ Couldn't save that: ${inboxErr.message}`);
      return NextResponse.json({ ok: true });
    }

    await notify(
      `📥 <b>Saved to the inbox.</b>\n` +
        (links.length
          ? `${links.length} link${links.length > 1 ? "s" : ""} picked up.\n`
          : "") +
        `\nI'll read the whole thing, research it, and send back the deck and the PDF.\n\n` +
        `<i>Send</i> <code>inbox</code> <i>to see what's waiting.</i>`,
    );

    /*
      Only draft automatically when a key exists. Without one the brief is
      still safely stored above, which is the behaviour that matters.
    */
    const key_ = process.env.ANTHROPIC_API_KEY;
    if (key_ && !key_.startsWith("PASTE_")) {
      const siteUrl =
        process.env.SITE_URL ??
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : new URL(request.url).origin);

      /*
        `after` rather than a floating promise. A serverless function is
        frozen the moment it responds, so `void processIdea(...)` ran fine
        locally and silently never executed in production.
      */
      after(async () => {
        await processIdea(text, allowedChat, siteUrl);
      });
    }

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

  /*
    The PDF button changes nothing about the post, so it is handled before
    the status machinery. Stitching six slides takes longer than Telegram
    will wait for a callback answer, so acknowledge first and build in
    `after` — a retried callback would otherwise send the deck twice.
  */
  if (action === "pdf") {
    await answerCallback(cb.id, "Building the PDF…");
    after(async () => {
      const { resendPdf } = await import("@/lib/deck-build");
      await resendPdf(postId);
    });
    return NextResponse.json({ ok: true });
  }

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
