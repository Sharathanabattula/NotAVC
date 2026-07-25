import { MANIFESTO } from "@/lib/content";
import { Reveal } from "./Reveal";

export default function Manifesto() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-40">
      <div className="grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Reveal>
            <p className="voice-kicker pal mb-6 text-accent">{MANIFESTO.kicker}</p>
            <h2 className="voice-heading pal text-4xl text-ink sm:text-5xl">
              {MANIFESTO.heading}
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-6">
          {MANIFESTO.paragraphs.map((para, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="pal mb-6 font-light leading-relaxed text-ink/90 text-lg">
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="lg:col-span-2 lg:col-start-11">
          <Reveal delay={0.1}>
            <div className="pal border-l-2 border-accent pl-5">
              <p className="voice-heading pal text-xl leading-snug text-accent-2">
                {MANIFESTO.pullQuote}
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <Reveal className="mt-24" delay={0.05}>
        <dl className="pal grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-4">
          {MANIFESTO.stats.map((stat) => (
            <div key={stat.label} className="pal bg-bg p-7">
              <dt className="voice-kicker pal order-2 mt-3 block text-muted">
                {stat.label}
              </dt>
              <dd className="voice-data pal text-4xl font-bold text-ink">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
