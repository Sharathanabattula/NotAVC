import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const metadata = { title: "Confirmed — The Wire" };

/*
  Double opt-in landing. The token is single-use by consequence rather than
  by deletion: confirming only moves a row out of 'pending', so replaying
  the link is inert.

  Unsubscribed addresses are deliberately not resurrected here — someone who
  opted out should not be re-subscribed by an old link in their inbox.
*/
export default async function Confirm({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  let state: "ok" | "already" | "bad" = "bad";

  if (token) {
    const supabase = db();
    const { data } = await supabase
      .from("subscribers")
      .update({ status: "confirmed", confirmed_at: new Date().toISOString() })
      .eq("confirm_token", token)
      .eq("status", "pending")
      .select("id")
      .maybeSingle();

    if (data) {
      state = "ok";
    } else {
      const { data: existing } = await supabase
        .from("subscribers")
        .select("status")
        .eq("confirm_token", token)
        .maybeSingle();
      state = existing?.status === "confirmed" ? "already" : "bad";
    }
  }

  const copy = {
    ok: {
      kicker: "You're in",
      heading: "Confirmed.",
      body: "The first issue of The Wire lands Sunday, 08:00 IST. One startup, torn down, with the take I had to correct.",
    },
    already: {
      kicker: "Already done",
      heading: "You're on the list.",
      body: "This address was confirmed earlier. Nothing more to do — Sunday's issue is on its way.",
    },
    bad: {
      kicker: "That link didn't work",
      heading: "Hmm.",
      body: "The link may have expired, or the address was removed. Sign up again from the site and a fresh confirmation will arrive.",
    },
  }[state];

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <div className="panel panel-lit ticked w-full max-w-lg p-10">
        <p className="voice-kicker mb-4 text-accent">{copy.kicker}</p>
        <h1 className="voice-display text-5xl text-ink">{copy.heading}</h1>
        <p className="mt-5 font-light leading-relaxed text-muted">{copy.body}</p>
        <a
          href="/"
          className="press voice-data mt-9 inline-flex bg-accent px-6 py-3 text-sm font-semibold text-bg"
        >
          BACK TO NOTAVC
        </a>
      </div>
    </main>
  );
}
