import { DECKS } from "@/lib/slides";

export const metadata = { title: "Decks — NotAVC Studio" };

/*
  Contact sheet for post artwork. Each tile is the live renderer output, so
  what you see here is byte-identical to what Instagram will download — no
  separate preview path that can drift from the real thing.
*/
export default function Decks() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <header className="mb-12 border-b border-rule pb-8">
        <p className="voice-kicker mb-3 text-accent">Post artwork</p>
        <h1 className="voice-display text-5xl text-ink sm:text-6xl">
          Decks<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-xl font-light text-muted">
          Rendered from <code className="voice-data text-ink">lib/slides.ts</code>{" "}
          at publish time. Right-click any slide to save it, or point Instagram
          straight at the URL.
        </p>
      </header>

      {DECKS.map((deck) => (
        <section key={deck.slug} className="mb-20">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="voice-heading text-2xl text-ink">
              <span className="voice-data mr-3 text-sm text-accent">{deck.ep}</span>
              {deck.title}
            </h2>
            <span className="voice-data text-[11px] tracking-[0.2em] text-faint">
              {deck.slides.length} SLIDES · 1080×1350
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
