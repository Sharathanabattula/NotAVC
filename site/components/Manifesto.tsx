import { MANIFESTO } from "@/lib/content";
import { Reveal } from "./Reveal";

export default function Manifesto() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
      {/* Margin column carries the filing notes, body carries the argument */}
      <div className="papergrid">
        <div className="margin-col zone">
          {MANIFESTO.margin.map((entry) => (
            <p key={entry.label} className="mb-5">
              <b>{entry.label}</b>
              {entry.note}
            </p>
          ))}
        </div>

        <div className="grid gap-14 lg:grid-cols-11">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="voice-kicker zone mb-6 text-crimson">
                {MANIFESTO.kicker}
              </p>
              <h2 className="voice-heading zone text-4xl text-ink sm:text-5xl">
                {MANIFESTO.heading}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-4 lg:col-start-6">
            {MANIFESTO.paragraphs.map((para, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className="zone mb-6 text-lg font-light leading-relaxed text-ink/90">
                  {para}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="lg:col-span-2 lg:col-start-10">
            <Reveal delay={0.1}>
              <div className="zone border-l-2 border-crimson pl-5">
                <p className="voice-heading zone text-xl leading-snug text-muted">
                  {MANIFESTO.pullQuote}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal className="mt-20" delay={0.05}>
        <dl className="zone grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule lg:grid-cols-4">
          {MANIFESTO.stats.map((stat) => (
            <div key={stat.label} className="zone bg-paper p-7">
              <dt className="voice-kicker zone order-2 mt-3 block text-muted">
                {stat.label}
              </dt>
              <dd className="voice-data zone text-4xl font-bold text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
