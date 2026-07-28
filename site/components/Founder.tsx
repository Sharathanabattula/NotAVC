"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
} from "framer-motion";
import { FOUNDER } from "@/lib/content";

/*
  The analyst. Portrait rises against a crimson plate while the
  frame-lines draw in. Transform/opacity only, one timeline.
*/
export default function Founder() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const portraitY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const plateY = useTransform(scrollYProgress, [0, 1], [-24, 24]);

  return (
    <LazyMotion features={domAnimation} strict>
      <section ref={ref} className="relative overflow-clip">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            {/* Portrait */}
            <div className="relative lg:col-span-5">
              <div className="relative mx-auto w-full max-w-[26rem] lg:max-w-none">
                {/* Crimson plate, offset behind the portrait */}
                <m.div
                  aria-hidden
                  style={{ y: plateY }}
                  className="absolute inset-0 -translate-x-4 -translate-y-4 bg-crimson"
                />
                <m.div style={{ y: portraitY }} className="relative">
                  <div className="relative aspect-[4/5] overflow-hidden bg-bg">
                    {/*
                      Duotone by stacking, not by filter chains: the image is
                      desaturated and darkened, then a crimson multiply layer
                      and a bottom-up fade tie it into the page. A single
                      `filter` string would cost one extra raster pass per
                      property; this is two composited layers.
                    */}
                    <Image
                      src="/img/sharath.jpg"
                      alt="Sharath Chandra Anabattula"
                      fill
                      sizes="(max-width: 1024px) 90vw, 40vw"
                      className="object-cover object-[center_18%] grayscale contrast-[1.1] brightness-[1.08]"
                      priority={false}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 mix-blend-multiply"
                      style={{
                        background:
                          "linear-gradient(150deg, rgba(113,0,20,0.42), rgba(8,7,10,0.5))",
                      }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent"
                    />
                    {/* Scanlines — sensor readout, not decoration */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-[0.09]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to bottom, rgba(236,231,225,0.5) 0 1px, transparent 1px 4px)",
                      }}
                    />
                    {/* HUD corner ticks */}
                    <span className="pointer-events-none absolute left-0 top-0 h-7 w-7 border-l-2 border-t-2 border-accent/90" />
                    <span className="pointer-events-none absolute bottom-0 right-0 h-7 w-7 border-b-2 border-r-2 border-accent/90" />
                  </div>
                </m.div>
              </div>

              <p className="voice-kicker zone mt-5 text-muted">
                SHARATH CHANDRA ANABATTULA — <span className="text-accent">EP.000</span>
              </p>
            </div>

            {/* Story */}
            <div className="lg:col-span-6 lg:col-start-7">
              <m.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -12% 0px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="voice-kicker zone mb-6 text-accent">{FOUNDER.kicker}</p>
                <h2 className="voice-heading zone text-3xl text-ink sm:text-4xl">
                  {FOUNDER.heading}
                </h2>

                {FOUNDER.paragraphs.map((para) => (
                  <p
                    key={para.slice(0, 24)}
                    className="zone mt-6 font-light leading-relaxed text-ink/85"
                  >
                    {para}
                  </p>
                ))}

                <p className="voice-heading zone mt-10 border-l-2 border-accent pl-5 text-xl leading-snug text-muted">
                  {FOUNDER.pull}
                </p>

                <dl className="zone mt-10 grid grid-cols-1 gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2">
                  {FOUNDER.credentials.map((c) => (
                    <div key={c.k} className="zone bg-bg px-5 py-4">
                      <dt className="voice-kicker zone text-muted">{c.k}</dt>
                      <dd className="zone mt-1.5 text-sm text-ink">{c.v}</dd>
                    </div>
                  ))}
                </dl>
              </m.div>
            </div>
          </div>
        </div>
      </section>
    </LazyMotion>
  );
}
