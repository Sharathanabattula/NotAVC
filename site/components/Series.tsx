import { PILLARS, FIELD_NOTES } from "@/lib/content";
import { Reveal } from "./Reveal";

export default function Series() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="voice-kicker pal mb-6 text-accent">The six desks</p>
            <h2 className="voice-display pal mb-14 text-5xl text-ink sm:text-6xl">
              One archive,
              <br />
              six obsessions<span className="pal text-accent">.</span>
            </h2>
          </Reveal>

          <div className="pal border-t border-line">
            {PILLARS.map((pillar, i) => (
              <Reveal key={pillar.index} delay={i * 0.04}>
                <div className="pal group grid grid-cols-[3rem_1fr] gap-4 border-b border-line py-7 sm:grid-cols-[4rem_1fr_auto]">
                  <span className="voice-data pal text-sm text-accent">
                    {pillar.index}
                  </span>
                  <div>
                    <h3 className="voice-heading pal text-2xl text-ink">
                      {pillar.name}
                    </h3>
                    <p className="pal mt-2 max-w-xl font-light leading-relaxed text-muted">
                      {pillar.desc}
                    </p>
                  </div>
                  <span className="voice-data pal col-start-2 text-[10px] tracking-[0.2em] text-accent-2 sm:col-start-3 sm:self-center">
                    {pillar.format}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 lg:col-start-9">
          <Reveal delay={0.1}>
            <div className="pal rounded-2xl bg-bg-soft p-8 sm:p-10">
              <p className="voice-kicker pal mb-8 text-accent">
                Field notes — latest
              </p>
              {FIELD_NOTES.map((entry) => (
                <div
                  key={entry.date}
                  className="pal mb-8 border-l border-line pl-5 last:mb-0"
                >
                  <p className="voice-data pal mb-2 text-[10px] tracking-[0.2em] text-muted">
                    {entry.date}
                  </p>
                  <p className="voice-heading pal text-lg leading-snug text-ink">
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
