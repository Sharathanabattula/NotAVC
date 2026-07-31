"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import { TEARDOWNS, type Teardown } from "@/lib/content";
import { Morph } from "./Morph";

const TONE: Record<Teardown["verdictTone"], string> = {
  coral: "text-coral border-coral/40",
  amber: "text-amber border-amber/40",
  info: "text-info border-info/40",
};

/*
  THE SIGNATURE — correction layer.
  Consensus take arrives, a crimson rule strikes it out, the margin
  correction rises underneath. CSS-driven off a single `.strike-in`
  class so the whole sequence is one class toggle, not four animations.
*/
function TeardownCard({ teardown, delay }: { teardown: Teardown; delay: number }) {
  const [struck, setStruck] = useState(false);

  /*
    Pointer glow writes two CSS custom properties straight onto the node.
    Custom properties on an element that only feed a background gradient
    skip layout and style recalc for everything else — cheaper than state.
  */
  const trackPointer = (e: React.PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <m.article
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      onViewportEnter={() => setStruck(true)}
      onPointerMove={trackPointer}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`panel panel-lit ticked zone group relative isolate flex h-full flex-col overflow-hidden p-8 sm:p-10 ${
        struck ? "strike-in" : ""
      }`}
    >
      {/* Cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), rgba(226,62,82,0.13), transparent 70%)",
        }}
      />

      {/*
        No episode number. It still keys the archive and the React list, but
        showing it turns a breakdown into an instalment — the reader doesn't
        need to know this was the fifth one.
      */}
      <div className="mb-8 flex items-center justify-between">
        <span className="voice-data zone text-xs tracking-[0.2em] text-muted">
          {teardown.sector}
        </span>
        <span
          className={`voice-data rounded-full border px-3 py-1 text-[10px] tracking-[0.18em] ${TONE[teardown.verdictTone]}`}
        >
          {teardown.verdict}
        </span>
      </div>

      {/*
        Named so the browser can carry these two straight through to the
        breakdown page instead of cutting to a new view. The name has to be
        unique per document, hence the slug.
      */}
      <Morph name={`co-${teardown.slug}`}>
        <h3 className="voice-heading zone text-3xl text-ink">{teardown.company}</h3>
      </Morph>
      <p className="zone mt-2 font-light text-muted">{teardown.hook}</p>

      <Morph name={`num-${teardown.slug}`}>
        <p className="voice-data zone mt-10 text-5xl font-bold tracking-tight text-accent sm:text-6xl">
          {teardown.number}
        </p>
      </Morph>
      <p className="voice-kicker zone mt-3 text-muted">{teardown.numberLabel}</p>

      {/* Correction layer */}
      <div className="zone mt-9 border-l-2 border-accent pl-5">
        <p className="voice-kicker zone mb-2 text-muted">The take everyone had</p>
        <p className="zone text-lg font-light leading-snug">
          <span className="wrong-take">{teardown.wrongTake}</span>
        </p>
        <p className="corrected voice-data zone mt-4 text-[13px] leading-relaxed text-accent">
          {teardown.corrected}
        </p>
      </div>

      <p className="zone mb-10 mt-8 font-light leading-relaxed text-ink/85">
        {teardown.take}
      </p>

      <div className="zone mt-auto flex flex-wrap gap-x-8 gap-y-2 border-t border-rule pt-6">
        {teardown.metrics.map((metric) => (
          <span key={metric.k} className="voice-data text-[11px]">
            <span className="zone text-muted">{metric.k} </span>
            <span className="zone text-ink">{metric.v}</span>
          </span>
        ))}
      </div>

      {/*
        Stretched link: the whole card is the hit area, but the accessible
        name stays on one real anchor rather than wrapping the article and
        swallowing its content into the link text.
      */}
      <Link
        href={`/breakdowns/${teardown.slug}`}
        className="voice-data zone mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] text-accent before:absolute before:inset-0 before:content-['']"
      >
        READ THE WORKING
        <span aria-hidden>→</span>
      </Link>
    </m.article>
  );
}

/*
  MOTION MOMENT 2 of 2 — the teardown desk.
  One scroll timeline drives the column parallax; cards stagger in once
  and fire their own correction sequence.
*/
export default function Teardowns() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const ruleScale = useTransform(scrollYProgress, [0.05, 0.6], [0, 1]);
  const leftColY = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [110, -20]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={ref} className="relative overflow-clip">
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          {/* Ledger margin rule — the desk's left edge */}
          <div
            aria-hidden
            className="zone absolute inset-y-24 left-5 hidden w-px bg-rule sm:left-8 lg:block"
          />
          <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="voice-kicker zone mb-6 text-accent">
                What the numbers said
              </p>
              <h2 className="voice-display zone text-6xl text-ink sm:text-7xl">
                The receipts<span className="zone text-accent">.</span>
              </h2>
            </div>
            <p className="voice-data zone max-w-xs text-xs leading-loose text-muted">
              {TEARDOWNS.length} COMPANIES. {TEARDOWNS.length} HEADLINES
              EVERYONE BELIEVED. {TEARDOWNS.length} NUMBERS THAT SAID
              OTHERWISE. OPEN ANY ONE FOR THE FULL WORKING.
            </p>
          </div>

          {/* Crimson rule draws across as you enter the desk */}
          <m.div
            aria-hidden
            style={{ scaleX: ruleScale }}
            className="mb-16 h-px origin-left bg-accent shadow-[0_0_18px_var(--glow)]"
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {TEARDOWNS.map((teardown, i) => (
              <m.div
                key={teardown.ep}
                style={{ y: i % 2 === 0 ? leftColY : rightColY }}
              >
                <TeardownCard teardown={teardown} delay={(i % 2) * 0.12} />
              </m.div>
            ))}
          </div>

          <p className="voice-data zone mt-16 text-center text-xs tracking-[0.2em] text-muted">
            NEW BREAKDOWNS DROP ON THE FEED —{" "}
            <a href="#signal" className="zone text-accent underline-offset-4 hover:underline">
              FOLLOW THE SIGNAL ↓
            </a>
          </p>
        </div>
      </section>
    </LazyMotion>
  );
}
