"use client";

import { useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import { NEWSLETTER } from "@/lib/content";

/*
  The Wire — newsletter signup.

  Motion here is the magnetic submit: the button tracks toward the pointer
  within a small radius and springs back on leave. Per the design system,
  motion stops where decisions start, so the magnet is the only movement in
  this zone and it dies the moment the form is submitted.
*/

type State = "idle" | "sending" | "done" | "error";

export default function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "0px 0px -20% 0px" });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");

  /* Magnetic pull, written straight to the node — no state, no re-render. */
  const pull = (e: React.PointerEvent<HTMLDivElement>) => {
    const button = buttonRef.current;
    if (!button || state !== "idle") return;
    const rect = button.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    button.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
  };

  const release = () => {
    const button = buttonRef.current;
    if (button) button.style.transform = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    release();

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "site-wire" }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Something went wrong.");
      setState("done");
      setMessage(body.message);
    } catch (err) {
      setState("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={sectionRef} className="relative isolate overflow-clip">
        {/* Signal bars — the only ambient motion in this zone */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex h-full items-end justify-around opacity-[0.07]"
        >
          {Array.from({ length: 28 }).map((_, i) => (
            <m.span
              key={i}
              className="w-px bg-accent"
              initial={{ height: "8%" }}
              animate={inView ? { height: ["8%", `${18 + ((i * 37) % 60)}%`, "8%"] } : {}}
              transition={{
                duration: 3.2 + (i % 5) * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.06,
              }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="papergrid">
            <div className="margin-col zone">
              <p className="mb-5">
                <b>Cadence</b>
                {NEWSLETTER.cadence}
              </p>
              <p className="mb-5">
                <b>Cost</b>
                Free, always
              </p>
              <p>
                <b>Rule</b>
                One teardown per issue
              </p>
            </div>

            <div className="max-w-2xl">
              <p className="voice-kicker zone mb-6 text-accent">
                {NEWSLETTER.kicker}
              </p>
              <h2 className="voice-display zone text-5xl text-ink sm:text-6xl">
                {NEWSLETTER.heading}
                <span className="text-accent">.</span>
              </h2>
              <p className="zone mt-7 text-lg font-light leading-relaxed text-ink/80">
                {NEWSLETTER.sub}
              </p>

              {state === "done" ? (
                <m.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="panel ticked mt-10 p-6"
                >
                  <p className="voice-kicker mb-2 text-accent">Confirmed pending</p>
                  <p className="text-ink">{message}</p>
                </m.div>
              ) : (
                <form onSubmit={submit} className="mt-10">
                  <div
                    onPointerMove={pull}
                    onPointerLeave={release}
                    className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
                  >
                    <label htmlFor="wire-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="wire-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@wherever.com"
                      className="voice-data zone min-w-0 flex-1 border border-rule bg-surface/60 px-5 py-4 text-ink outline-none backdrop-blur-sm transition-colors placeholder:text-faint focus:border-accent"
                    />
                    <button
                      ref={buttonRef}
                      type="submit"
                      disabled={state === "sending"}
                      className="voice-data shrink-0 bg-accent px-8 py-4 text-sm font-semibold text-bg transition-[transform,opacity] duration-300 ease-out disabled:opacity-60"
                    >
                      {state === "sending" ? "SENDING…" : "GET THE WIRE"}
                    </button>
                  </div>

                  <p className="voice-data zone mt-4 text-[11px] leading-relaxed text-faint">
                    Double opt-in. Unsubscribe in one click. No selling, no
                    sharing, no daily nonsense.
                  </p>

                  {state === "error" ? (
                    <p
                      role="alert"
                      className="voice-data mt-3 text-xs text-accent"
                    >
                      {message}
                    </p>
                  ) : null}
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
