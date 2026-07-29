import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { notify } from "@/lib/telegram";
import { emailConfigured, sendConfirmation } from "@/lib/email";

export const dynamic = "force-dynamic";

/*
  Newsletter signup. Public, so it is the one endpoint a stranger can reach.

  Double opt-in: a signup only ever creates a `pending` row. Nothing is
  mailed to an address until that address confirms, so the form cannot be
  used to send unsolicited mail to someone else.

  The response is identical whether the address is new, already pending, or
  already confirmed — otherwise this becomes an oracle for checking who has
  subscribed.
*/

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let email: string;
  let source: string | undefined;

  try {
    const body = await request.json();
    email = String(body.email ?? "").trim().toLowerCase();
    source = typeof body.source === "string" ? body.source.slice(0, 60) : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "That doesn't look like an email address." },
      { status: 400 },
    );
  }

  const supabase = db();

  const { data: created, error } = await supabase
    .from("subscribers")
    .insert({ email, source: source ?? "site" })
    .select("confirm_token")
    .maybeSingle();

  // 23505 = unique violation. Already on the list; say the same thing.
  if (error && error.code !== "23505") {
    return NextResponse.json(
      { error: "Could not save that right now. Try again shortly." },
      { status: 500 },
    );
  }

  if (!error && created) {
    await notify(`📬 New newsletter signup — ${email}`);

    if (emailConfigured()) {
      const origin =
        process.env.SITE_URL ?? new URL(request.url).origin;
      const result = await sendConfirmation(
        email,
        `${origin.replace(/\/$/, "")}/confirm?token=${created.confirm_token}`,
      );
      if (!result.ok) {
        // The address is saved either way — surface the failure to Sharath
        // rather than to the subscriber, who can do nothing about it.
        await notify(`⚠️ Confirmation email failed for ${email}\n${result.reason}`);
      }
    }
  }

  /*
    Do not promise an email that cannot be sent. Until a provider is
    configured every subscriber sits at 'pending' forever, and telling them
    to check an inbox that will stay empty is worse than saying nothing.
  */
  return NextResponse.json({
    ok: true,
    message: emailConfigured()
      ? "Check your inbox to confirm."
      : "You're on the list. Confirmation follows once the mailer is live.",
  });
}
