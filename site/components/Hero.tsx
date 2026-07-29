"use client";

import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import FieldCanvas from "./FieldCanvas";
import Decode from "./Decode";

/*
  MOTION MOMENT 1 — the masthead.

  Layers, back to front: dot field (canvas) · hairline grid · crimson
  horizon · N/A watermark · headline. All four foreground layers ride one
  scroll timeline at different rates, so depth comes from rate difference
  rather than from four separate animations.

  `isolate` on the section is load-bearing: without its own stacking
  context the -z layers paint beneath body's background and vanish.
*/

const RISE = {
  initial: { opacity: 0, y: 44 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const horizonScale = useTransform(scrollYProgress, [0, 1], [1, 1.6]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const ruleScale = useTransform(scrollYProgress, [0, 0.55], [0.14, 1]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        ref={ref}
        id="top"
        className="relative isolate flex min-h-svh flex-col justify-end overflow-clip px-5 pb-16 pt-32 sm:px-8"
      >
        {/* Layer 1 — the field */}
        <m.div style={{ opacity: fieldOpacity }} className="absolute inset-0 -z-30">
          <FieldCanvas />
        </m.div>

        {/* Layer 2 — hairline ledger grid */}
        <div aria-hidden className="gridlines absolute inset-0 -z-30 opacity-70" />

        {/* Layer 3 — crimson horizon bleeding up from the fold */}
        <m.div
          aria-hidden
          style={{ scaleY: horizonScale }}
          className="absolute inset-x-0 bottom-0 -z-20 h-[42vh] origin-bottom bg-[radial-gradient(ellipse_70%_100%_at_50%_120%,rgba(226,62,82,0.28),transparent_70%)]"
        />

        {/* Layer 4 — watermark, drifting against the scroll */}
        <m.span
          aria-hidden
          style={{ y: watermarkY }}
          className="voice-display pointer-events-none absolute -right-8 top-20 -z-10 text-[38vw] leading-none text-accent opacity-[0.06] sm:text-[30vw]"
        >
          N/A
        </m.span>

        <div className="mx-auto w-full max-w-7xl">
          <m.div
            {...RISE}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ opacity: kickerOpacity }}
            className="mb-10 flex flex-wrap items-center gap-x-4 gap-y-2"
          >
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <Decode
              text="EP.000 — I READ THE FILINGS, NOT THE PRESS RELEASE"
              className="voice-kicker text-accent"
              delay={280}
            />
            <span className="voice-kicker text-faint">
              SR UNIVERSITY · FINANCE &amp; DERIVATIVES
            </span>
          </m.div>

          <m.div style={{ y: headlineY }}>
            {/* Each line masked, so the reveal reads as type being set */}
            <h1 className="voice-display text-[clamp(4.5rem,16vw,14rem)] text-ink">
              <span className="block overflow-hidden">
                <m.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                  className="block text-muted"
                >
                  NOT
                </m.span>
              </span>
              <span className="block overflow-hidden">
                <m.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 1,
                    delay: 0.12,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                  className="block"
                >
                  A VC<span className="text-accent">.</span>
                </m.span>
              </span>
            </h1>

            <m.div
              style={{ scaleX: ruleScale }}
              className="my-10 h-px origin-left bg-accent shadow-[0_0_18px_var(--glow)]"
            />

            <m.div
              {...RISE}
              transition={{ duration: 0.9, delay: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between gap-10 sm:flex-row sm:items-end"
            >
              <p className="max-w-md text-lg font-light leading-relaxed text-ink/80">
                Startup headlines are written by PR firms. I&rsquo;m an MBA
                student who reads the filings instead. When the math stops
                matching the announcement, I show you both.
              </p>

              {/* HUD readout */}
              <dl className="voice-data grid shrink-0 grid-cols-3 gap-px overflow-hidden border border-rule bg-rule text-[10px] sm:w-[22rem]">
                {[
                  { k: "DESKS", v: "04" },
                  { k: "TEARDOWNS", v: "04" },
                  { k: "AUM", v: "₹0" },
                ].map((cell) => (
                  <div key={cell.k} className="bg-bg px-4 py-3">
                    <dt className="tracking-[0.2em] text-faint">{cell.k}</dt>
                    <dd className="mt-1.5 text-xl font-semibold text-ink">
                      {cell.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </m.div>
          </m.div>
        </div>

        <div className="voice-kicker mx-auto mt-14 flex w-full max-w-7xl items-center gap-4 text-faint">
          <span>START WITH WHY THIS EXISTS</span>
          <div className="sweep h-px flex-1 bg-rule" />
          <span className="text-accent">↓</span>
        </div>
      </section>
    </LazyMotion>
  );
}
