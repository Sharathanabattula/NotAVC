import { NextResponse } from "next/server";
import { db } from "@/lib/supabase";
import { notify } from "@/lib/telegram";

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

  const { error } = await supabase
    .from("subscribers")
    .insert({ email, source: source ?? "site" });

  // 23505 = unique violation. Already on the list; say the same thing.
  if (error && error.code !== "23505") {
    return NextResponse.json(
      { error: "Could not save that right now. Try again shortly." },
      { status: 500 },
    );
  }

  if (!error) {
    await notify(`📬 New newsletter signup — ${email}`);
  }

  return NextResponse.json({
    ok: true,
    message: "Check your inbox to confirm.",
  });
}
