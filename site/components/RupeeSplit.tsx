"use client";

import Link from "next/link";
import { useRef } from "react";
import { LazyMotion, domAnimation, m, useInView } from "framer-motion";
import { RUPEE } from "@/lib/content";
import { Reveal } from "./Reveal";

/*
  THE ARGUMENT, AS A PICTURE.

  A single rupee of sales, and every paisa paid out to earn it. Segments
  grow left to right in sequence, so the bar is read the way the money is
  actually spent rather than appearing all at once as a finished chart.

  The scale is fixed to the total spend, not to income, and the rupee mark
  sits where 100 paise falls. That means the bar visibly runs past it. This
  is the only honest way to draw it: normalising the segments to fit inside
  the rupee would show a business that breaks even, which is not what the
  accounts say.
*/

export default function RupeeSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -18% 0px" });

  const total = RUPEE.segments.reduce((sum, s) => sum + s.paise, 0);
  /* Percentages of the full bar, so the segments always tile to 100%. */
  const pct = (paise: number) => (paise / total) * 100;
  const incomeMark = pct(RUPEE.income);

  let runningDelay = 0;

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <p className="voice-kicker zone mb-6 text-accent">{RUPEE.kicker}</p>
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <h2 className="voice-display zone max-w-2xl text-5xl text-ink sm:text-6xl">
              {RUPEE.heading}
            </h2>
            <p className="zone max-w-sm font-light leading-relaxed text-muted">
              {RUPEE.sub}
            </p>
          </div>
        </Reveal>

        <div ref={ref}>
          {/* The bar */}
          <div className="relative">
            <div className="zone flex h-20 w-full overflow-hidden border border-rule sm:h-28">
              {RUPEE.segments.map((seg, i) => {
                const delay = runningDelay;
                runningDelay += 0.18;
                return (
                  <m.div
                    key={seg.label}
                    className="zone h-full origin-left border-r border-rule last:border-r-0"
                    style={{
                      width: `${pct(seg.paise)}%`,
                      /*
                        Weight descends with size so the biggest slice reads
                        first — it is the one doing the damage.
                      */
                      background: `color-mix(in srgb, var(--accent) ${Math.max(14, 82 - i * 22)}%, transparent)`,
                    }}
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
                  />
                );
              })}
            </div>

            {/*
              The rupee mark. Everything to the right of this line is money
              the business spent but did not earn.
            */}
            <m.div
              aria-hidden
              className="absolute inset-y-0 w-px bg-ink"
              style={{ left: `${incomeMark}%` }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={inView ? { opacity: 1, scaleY: 1 } : {}}
              transition={{ duration: 0.5, delay: runningDelay + 0.1 }}
            />
            <m.p
              className="voice-data absolute -top-7 text-[11px] tracking-[0.18em] text-ink"
              style={{ left: `${incomeMark}%`, transform: "translateX(-50%)" }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: runningDelay + 0.2 }}
            >
              ₹1 IN
            </m.p>
          </div>

          <m.p
            className="voice-data zone mt-4 text-right text-[11px] tracking-[0.18em] text-accent"
            initial={{ opacity: 0, y: 6 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: runningDelay + 0.35 }}
          >
            {RUPEE.shortfall.toUpperCase()}
          </m.p>

          {/* Legend */}
          <div className="mt-12 grid gap-px border-t border-rule sm:grid-cols-2 lg:grid-cols-4">
            {RUPEE.segments.map((seg, i) => (
              <m.div
                key={seg.label}
                className="zone border-b border-rule py-6 pr-6"
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.18 * i + 0.2,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <p className="voice-data zone text-3xl font-bold text-accent">
                  {seg.paise}p
                </p>
                <p className="voice-heading zone mt-2 text-lg text-ink">
                  {seg.label}
                </p>
                <p className="zone mt-1 text-sm font-light leading-relaxed text-muted">
                  {seg.note}
                </p>
              </m.div>
            ))}
          </div>

          <p className="voice-data zone mt-10 text-[11px] tracking-[0.18em] text-muted">
            {RUPEE.company.toUpperCase()} —{" "}
            <Link
              href={RUPEE.href}
              className="zone text-accent underline-offset-4 hover:underline"
            >
              SEE THE FULL WORKING →
            </Link>
          </p>
        </div>
      </div>
    </LazyMotion>
  );
}
