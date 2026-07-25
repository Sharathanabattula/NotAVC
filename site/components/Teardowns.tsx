"use client";

import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import { TEARDOWNS, type Teardown } from "@/lib/content";

const TONE: Record<Teardown["verdictTone"], string> = {
  coral: "text-coral border-coral/40",
  amber: "text-amber border-amber/40",
  info: "text-info border-info/40",
};

/*
  MOTION MOMENT 2 of 2 — the teardown desk.
  One scroll timeline drives a crimson glow + column parallax; cards
  stagger in once. Glass lives only here (4 cards = within budget).
*/
export default function Teardowns() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const glowY = useTransform(scrollYProgress, [0, 1], ["-12%", "22%"]);
  const leftColY = useTransform(scrollYProgress, [0, 1], [48, -48]);
  const rightColY = useTransform(scrollYProgress, [0, 1], [110, -20]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={ref} className="relative overflow-clip">
        {/* Split-tone: soft panel behind the left column */}
        <div className="pal absolute inset-y-0 left-0 -z-10 hidden w-[38%] bg-bg-soft lg:block" />

        {/* Crimson depth glow, scroll-linked */}
        <m.div
          aria-hidden
          style={{ y: glowY }}
          className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-crimson opacity-25 blur-[160px]"
        />

        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
          <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="voice-kicker pal mb-6 text-accent">
                The teardown desk
              </p>
              <h2 className="voice-display pal text-6xl text-ink sm:text-7xl">
                Companies,
                <br />
                autopsied<span className="pal text-accent">.</span>
              </h2>
            </div>
            <p className="voice-data pal max-w-xs text-xs leading-loose text-muted">
              EVERY TEARDOWN HAS ONE NUMBER THAT TELLS THE REAL STORY. THESE ARE
              THOSE NUMBERS.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {TEARDOWNS.map((teardown, i) => (
              <m.div
                key={teardown.ep}
                style={{ y: i % 2 === 0 ? leftColY : rightColY }}
              >
                <m.article
                  initial={{ opacity: 0, y: 56 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                  transition={{
                    duration: 0.8,
                    delay: (i % 2) * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="glass-card pal group flex h-full flex-col rounded-2xl p-8 sm:p-10"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="voice-data pal text-xs tracking-[0.2em] text-muted">
                      {teardown.ep}
                    </span>
                    <span
                      className={`voice-data rounded-full border px-3 py-1 text-[10px] tracking-[0.18em] ${TONE[teardown.verdictTone]}`}
                    >
                      {teardown.verdict}
                    </span>
                  </div>

                  <h3 className="voice-heading pal text-3xl text-ink">
                    {teardown.company}
                  </h3>
                  <p className="pal mt-2 font-light text-muted">{teardown.hook}</p>

                  <p className="voice-data pal mt-10 text-5xl font-bold tracking-tight text-accent sm:text-6xl">
                    {teardown.number}
                  </p>
                  <p className="voice-kicker pal mt-3 text-muted">
                    {teardown.numberLabel}
                  </p>

                  <p className="pal mb-10 mt-8 font-light leading-relaxed text-ink/85">
                    {teardown.take}
                  </p>

                  <div className="pal mt-auto flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-6">
                    {teardown.metrics.map((metric) => (
                      <span key={metric.k} className="voice-data text-[11px]">
                        <span className="pal text-muted">{metric.k} </span>
                        <span className="pal text-ink">{metric.v}</span>
                      </span>
                    ))}
                  </div>
                </m.article>
              </m.div>
            ))}
          </div>

          <p className="voice-data pal mt-16 text-center text-xs tracking-[0.2em] text-muted">
            FULL TEARDOWNS DROP ON THE FEED —{" "}
            <a href="#signal" className="pal text-accent underline-offset-4 hover:underline">
              FOLLOW THE SIGNAL ↓
            </a>
          </p>
        </div>
      </section>
    </LazyMotion>
  );
}
