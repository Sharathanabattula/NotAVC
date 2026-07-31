"use client";

import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import { useRef } from "react";
import { METHOD } from "@/lib/content";
import { Reveal } from "./Reveal";

/*
  How a breakdown gets made.

  The motion here is deliberately the opposite of the ambient field in the
  masthead: nothing drifts and nothing loops. A ledger rule draws itself down
  the left of the four steps as they enter, one segment per step, the way a
  column of figures gets ruled off — the section is about method, so the
  movement should read as work being done in order rather than atmosphere.

  Everything is transform and opacity, and it runs once.
*/
export default function Method() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="voice-kicker zone mb-6 text-accent">{METHOD.kicker}</p>
              <h2 className="voice-display zone mb-8 text-5xl text-ink sm:text-6xl">
                {METHOD.heading}
              </h2>
              <p className="zone max-w-md font-light leading-relaxed text-muted">
                {METHOD.sub}
              </p>
            </Reveal>
          </div>

          <div ref={ref} className="relative lg:col-span-6 lg:col-start-7">
            {/*
              The rule is a single scaled line rather than four borders, so it
              reads as one continuous stroke being drawn rather than four
              boxes appearing.
            */}
            <m.div
              aria-hidden
              className="absolute left-0 top-0 hidden w-px origin-top bg-accent sm:block"
              style={{ height: "100%" }}
              initial={{ scaleY: 0, opacity: 0.35 }}
              animate={inView ? { scaleY: 1, opacity: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            />

            {METHOD.steps.map((step, i) => (
              <m.div
                key={step.index}
                className="zone border-b border-rule py-7 first:pt-0 last:border-b-0 sm:pl-8"
                initial={{ opacity: 0, x: 18 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: 0.18 + i * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="voice-data zone text-sm text-accent">{step.index}</span>
                  <h3 className="voice-heading zone text-2xl text-ink">{step.name}</h3>
                </div>
                <p className="zone mt-3 max-w-xl font-light leading-relaxed text-muted">
                  {step.desc}
                </p>
              </m.div>
            ))}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
