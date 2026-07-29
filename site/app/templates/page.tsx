import { DECKS } from "@/lib/slides";

export const metadata = {
  title: "Templates — NotAVC",
  description: "The post artwork system: every slide type, rendered live.",
};

/*
  Living style guide. Public on purpose — it is the brand's own artwork,
  nothing sensitive, and being able to open it on a phone is the point.

  Each tile is the live renderer output, so what you see here is
  byte-identical to what Instagram downloads. There is no separate preview
  path that can drift from the real thing.
*/
export default function Templates() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <header className="mb-12 border-b border-rule pb-8">
        <p className="voice-kicker mb-3 text-accent">The artwork system</p>
        <h1 className="voice-display text-5xl text-ink sm:text-6xl">
          Templates<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-xl font-light leading-relaxed text-muted">
          Every post is drawn from the same tokens as this site, at publish
          time. Nothing is designed by hand, so nothing drifts off-brand.
          Tap any slide to open the full-size PNG.
        </p>

        <dl className="voice-data mt-8 grid grid-cols-2 gap-px overflow-hidden border border-rule bg-rule text-[10px] sm:grid-cols-4">
          {[
            { k: "SLIDE TYPES", v: "09" },
            { k: "CAROUSEL", v: "1080×1350" },
            { k: "STORY", v: "1080×1920" },
            { k: "DESIGN STEP", v: "NONE" },
          ].map((cell) => (
            <div key={cell.k} className="bg-bg px-4 py-3">
              <dt className="tracking-[0.2em] text-faint">{cell.k}</dt>
              <dd className="mt-1 text-lg font-semibold text-ink">{cell.v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {DECKS.map((deck) => (
        <section key={deck.slug} className="mb-20">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="voice-heading text-2xl text-ink">
              <span className="voice-data mr-3 text-sm text-accent">{deck.ep}</span>
              {deck.title}
            </h2>
            <span className="voice-data text-[11px] tracking-[0.2em] text-faint">
              {deck.slides.length}{" "}
              {deck.slides.length === 1 ? "SLIDE" : "SLIDES"} ·{" "}
              {deck.format === "story" ? "1080×1920" : "1080×1350"} ·{" "}
              {deck.format.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {deck.slides.map((slide, i) => {
              const src = `/api/og/slide?deck=${deck.slug}&i=${i}`;
              return (
                <figure key={i} className="panel ticked p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${deck.ep} slide ${i + 1} — ${slide.kind}`}
                    className="w-full border border-rule"
                    loading="lazy"
                  />
                  <figcaption className="voice-data mt-3 flex items-center justify-between text-[10px] tracking-[0.15em] text-faint">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-muted">{slide.kind.toUpperCase()}</span>
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      OPEN
                    </a>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
