import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import PaletteObserver from "@/components/PaletteObserver";
import { TEARDOWNS, type Teardown } from "@/lib/content";
import { db } from "@/lib/supabase";
import SlideDeck from "@/components/SlideDeck";
import { WorkingRow } from "@/components/WorkingRow";
import { Morph } from "@/components/Morph";

/*
  One breakdown, one page.

  The site's claim is "every number here has a receipt". This is where the
  receipts live: the carousel exactly as it was published, then every figure
  with the arithmetic that produced it, then the reasoning, then the links.

  Slides come from Supabase rather than being duplicated here, so the page
  and the feed can't drift apart — they are literally the same images.
*/

export const revalidate = 300;

export function generateStaticParams() {
  return TEARDOWNS.map((t) => ({ slug: t.slug }));
}

function find(slug: string): Teardown | undefined {
  return TEARDOWNS.find((t) => t.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = find(slug);
  if (!t) return { title: "Not found — NotAVC" };
  return {
    title: `${t.company} — the numbers | NotAVC`,
    description: t.hook,
  };
}

/*
  Pulls the published carousel for this breakdown. Returns nothing rather
  than throwing: a missing platter, or Supabase being unreachable, should
  cost the reader the slide preview and nothing else.
*/
async function slidesFor(match?: string): Promise<string[]> {
  if (!match) return [];
  try {
    const supabase = db();
    const { data: platter } = await supabase
      .from("platters")
      .select("id")
      .ilike("title", match)
      .order("publish_date", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!platter) return [];

    const { data: post } = await supabase
      .from("posts")
      .select("media_urls")
      .eq("platter_id", platter.id)
      .eq("channel", "instagram")
      .maybeSingle();

    return Array.isArray(post?.media_urls) ? (post.media_urls as string[]) : [];
  } catch {
    return [];
  }
}

const TONE: Record<Teardown["verdictTone"], string> = {
  coral: "text-coral border-coral/40",
  amber: "text-amber border-amber/40",
  info: "text-info border-info/40",
};

export default async function BreakdownPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = find(slug);
  if (!t) notFound();

  const slides = await slidesFor(t.platterMatch);
  const r = t.research;

  return (
    <>
      <PaletteObserver />
      <Nav />
      <main data-zone="deck">
        <article className="mx-auto max-w-5xl px-5 pb-32 pt-32 sm:px-8 sm:pt-40">
          <Link
            href="/#teardowns"
            className="voice-data zone text-[11px] tracking-[0.2em] text-muted hover:text-accent"
          >
            ← ALL BREAKDOWNS
          </Link>

          <div className="zone mt-10 flex flex-wrap items-center gap-4">
            <span className="voice-data zone text-xs tracking-[0.2em] text-muted">
              {t.sector}
            </span>
            <span
              className={`voice-data rounded-full border px-3 py-1 text-[10px] tracking-[0.18em] ${TONE[t.verdictTone]}`}
            >
              {t.verdict}
            </span>
          </div>

          {/* Same names as the card, so the browser carries them across. */}
          <Morph name={`co-${t.slug}`}>
            <h1 className="voice-display zone mt-6 text-6xl text-ink sm:text-7xl">
              {t.company}
            </h1>
          </Morph>
          <p className="zone mt-5 max-w-2xl text-xl font-light leading-relaxed text-muted">
            {t.hook}
          </p>

          <div className="zone mt-12 border-y border-rule py-10">
            <Morph name={`num-${t.slug}`}>
              <p className="voice-data zone text-6xl font-bold tracking-tight text-accent sm:text-7xl">
                {t.number}
              </p>
            </Morph>
            <p className="voice-kicker zone mt-4 text-muted">{t.numberLabel}</p>
          </div>

          {/* The correction layer, same as the card */}
          <section className="zone mt-14 border-l-2 border-accent pl-6">
            <p className="voice-kicker zone mb-3 text-muted">The take everyone had</p>
            <p className="zone text-2xl font-light leading-snug text-muted line-through decoration-accent decoration-2">
              {t.wrongTake}
            </p>
            <p className="voice-kicker zone mb-2 mt-8 text-accent">
              What the numbers said
            </p>
            <p className="zone text-lg leading-relaxed text-ink">{t.corrected}</p>
          </section>

          {slides.length > 0 && (
            <section className="mt-20">
              <h2 className="voice-kicker zone mb-6 text-accent">
                The carousel — {slides.length} slides
              </h2>
              <SlideDeck slides={slides} company={t.company} />
            </section>
          )}

          {r ? (
            <>
              <section className="mt-24">
                <h2 className="voice-display zone text-4xl text-ink sm:text-5xl">
                  The working
                </h2>
                <p className="voice-data zone mt-3 text-[11px] tracking-[0.2em] text-muted">
                  {r.period.toUpperCase()}
                </p>
                <p className="zone mt-8 max-w-3xl text-lg font-light leading-relaxed text-ink/85">
                  {r.summary}
                </p>

                <div className="zone mt-12 border-t border-rule">
                  {r.workings.map((w, i) => (
                    <WorkingRow key={w.k} {...w} index={i} />
                  ))}
                </div>
              </section>

              <section className="mt-24 grid gap-12 lg:grid-cols-2">
                {r.notes.map((n) => (
                  <div key={n.heading}>
                    <h3 className="voice-heading zone text-2xl text-ink">
                      {n.heading}
                    </h3>
                    <p className="zone mt-4 font-light leading-relaxed text-muted">
                      {n.body}
                    </p>
                  </div>
                ))}
              </section>

              <section className="mt-24">
                <h2 className="voice-kicker zone mb-6 text-accent">
                  Everything I used
                </h2>
                <ul className="zone border-t border-rule">
                  {r.sources.map((s) => (
                    <li key={s.url} className="zone border-b border-rule">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="zone block py-5 text-ink hover:text-accent"
                      >
                        <span className="zone font-light">{s.title}</span>
                        <span className="voice-data zone mt-1 block break-all text-[11px] text-muted">
                          {s.url}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="zone mt-10 max-w-2xl text-sm font-light leading-relaxed text-muted">
                  If a number here is wrong, tell me and I&rsquo;ll correct it on
                  this page with the old version struck through rather than
                  quietly deleted.
                </p>
              </section>
            </>
          ) : (
            /*
              Breakdowns published before the research pages existed. Better to
              say so than to render a page that looks like the receipts are
              missing.
            */
            <section className="mt-24 border-t border-rule pt-10">
              <p className="zone max-w-2xl font-light leading-relaxed text-muted">
                {t.take}
              </p>
              <p className="voice-data zone mt-8 text-[11px] tracking-[0.2em] text-muted">
                THE FULL WORKING FOR THIS ONE ISN&rsquo;T WRITTEN UP YET.
              </p>
            </section>
          )}
        </article>
      </main>
    </>
  );
}
