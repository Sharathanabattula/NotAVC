import { ICONS, ICON_NAMES } from "@/lib/icons";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Pictograms — NotAVC" };

/*
  The pictogram sheet. Rendered as live components at the size they appear
  on a slide, on the same canvas colour, so what you judge here is what
  ships — not a scaled preview.
*/
export default function IconSheet() {
  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <header className="mb-12 border-b border-rule pb-8">
        <p className="voice-kicker mb-3 text-accent">Pictograms</p>
        <h1 className="voice-display text-5xl text-ink sm:text-6xl">
          {ICON_NAMES.length} marks<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-light leading-relaxed text-muted">
          One stroke weight, round caps, three tones, four elements maximum.
          The crimson element is always the subject; everything else is
          context. Add <code className="voice-data text-ink">icon: &quot;name&quot;</code>{" "}
          to any statement, number, list or teardown slide.
        </p>
      </header>

      <div
        className="grid grid-cols-2 gap-px border border-rule bg-rule sm:grid-cols-3 lg:grid-cols-4"
        style={{ colorScheme: "light" }}
      >
        {ICON_NAMES.map((name) => {
          const Icon = ICONS[name];
          return (
            <figure
              key={name}
              className="flex flex-col items-center gap-4 p-8"
              style={{ background: BRAND.canvas }}
            >
              <Icon size={110} />
              <figcaption
                className="voice-data text-[11px] tracking-[0.2em]"
                style={{ color: BRAND.muted }}
              >
                {name.toUpperCase()}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </main>
  );
}
