import { PILLARS, FIELD_NOTES } from "@/lib/content";
import { Reveal } from "./Reveal";

export default function Series() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="voice-kicker zone mb-6 text-accent">The six desks</p>
            <h2 className="voice-display zone mb-14 text-5xl text-ink sm:text-6xl">
              One archive,
              <br />
              six obsessions<span className="zone text-accent">.</span>
            </h2>
          </Reveal>

          <div className="zone border-t border-rule">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.index} delay={i * 0.04}>
                <div className="zone group grid grid-cols-[3rem_1fr] gap-4 border-b border-rule py-7 sm:grid-cols-[4rem_1fr_auto]">
                  <span className="voice-data zone text-sm text-accent">
                    {pillar.index}
                  </span>
                  <div>
                    <h3 className="voice-heading zone text-2xl text-ink">
                      {pillar.name}
                    </h3>
                    <p className="zone mt-2 max-w-xl font-light leading-relaxed text-muted">
                      {pillar.desc}
                    </p>
                  </div>
                  <span className="voice-data zone col-start-2 text-[10px] tracking-[0.2em] text-muted sm:col-start-3 sm:self-center">
                    {pillar.format}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9 lg:sticky lg:top-28 lg:self-start">
          <Reveal delay={0.1}>
            <div className="zone border border-rule bg-surface p-8 sm:p-10">
              <p className="voice-kicker zone mb-8 text-accent">
                Field notes — latest
              </p>
              {FIELD_NOTES.map((entry) => (
                <div
                  key={entry.date}
                  className="zone mb-8 border-l border-rule pl-5 last:mb-0"
                >
                  <p className="voice-data zone mb-2 text-[10px] tracking-[0.2em] text-muted">
                    {entry.date}
                  </p>
                  <p className="voice-heading zone text-lg leading-snug text-ink">
                    {entry.note}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
