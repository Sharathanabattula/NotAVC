"use client";

import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
} from "framer-motion";

/*
  MOTION MOMENT 1 of 2 — the masthead.
  One scroll timeline, transform/opacity only. The headline recedes at
  half scroll-speed, the crimson rule draws itself, the kicker dissolves.
*/
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const kickerOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const ruleScale = useTransform(scrollYProgress, [0, 0.55], [0.18, 1]);

  const enter = {
    initial: { opacity: 0, y: 36 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <section
        ref={ref}
        id="top"
        className="relative flex min-h-svh flex-col justify-end overflow-clip px-5 pb-14 pt-28 sm:px-8"
      >
        {/* Split-tone backdrop: warm band on the right third */}
        <div className="zone absolute inset-y-0 right-0 -z-10 w-1/3 bg-paper-2" />

        {/* Watermark — slower than scroll, opposite direction */}
        <m.span
          aria-hidden
          style={{ y: watermarkY }}
          className="voice-display pointer-events-none absolute -right-6 top-16 -z-10 text-[38vw] leading-none text-crimson opacity-[0.07] sm:text-[30vw]"
        >
          N/A
        </m.span>

        <div className="mx-auto w-full max-w-7xl">
          <m.p
            {...enter}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ opacity: kickerOpacity }}
            className="voice-kicker zone mb-8 text-crimson"
          >
            EP.000 — The permanent record of an MBA student
            <span className="text-muted"> · SR University · Finance & Derivatives</span>
          </m.p>

          <m.div style={{ y: headlineY }}>
            <m.h1
              {...enter}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="voice-display zone text-[clamp(4.5rem,15vw,13rem)] text-ink"
            >
              <span className="block text-muted">NOT</span>
              <span className="block">
                A VC<span className="zone text-crimson">.</span>
              </span>
            </m.h1>

            <m.div
              style={{ scaleX: ruleScale }}
              className="my-9 h-[3px] origin-left bg-crimson"
            />

            <m.div
              {...enter}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end"
            >
              <p className="zone max-w-md text-lg font-light leading-relaxed text-ink">
                Just a student who refuses to learn venture capital quietly.
                Teardowns, term sheets, and the one number everyone else skips —
                documented in public, mistakes included.
              </p>
              <div className="voice-data zone shrink-0 text-right text-xs leading-loose text-muted">
                <p>VENTURE INTELLIGENCE FOR EVERYONE</p>
                <p>
                  SCROLL FOR THE THESIS <span className="text-crimson">↓</span>
                </p>
              </div>
            </m.div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
