import { CLOSER, SOCIAL } from "@/lib/content";
import { Wordmark, Monogram } from "./Logo";
import { Reveal } from "./Reveal";

/*
  The decision zone. Per the brief: motion stops where the user's
  decision starts — everything below the heading is static.
*/
export default function Closer() {
  return (
    <footer className="mx-auto max-w-7xl px-5 pb-10 pt-28 sm:px-8 sm:pt-40">
      <Reveal>
        <p className="voice-kicker zone mb-6 text-accent">{CLOSER.kicker}</p>
        <h2 className="voice-display zone text-[clamp(3.5rem,11vw,9rem)] text-ink">
          {CLOSER.heading}
        </h2>
        <p className="zone mt-8 max-w-lg text-lg font-light leading-relaxed text-ink/90">
          {CLOSER.sub}
        </p>
      </Reveal>

      <div className="mt-14 flex flex-wrap gap-4">
        <a
          href={SOCIAL.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="press voice-data zone bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-opacity hover:opacity-85"
        >
          TEARDOWNS → LINKEDIN
        </a>
        <a
          href={SOCIAL.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="press voice-data zone rounded-full border border-rule px-7 py-3.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          REELS → INSTAGRAM
        </a>
        <a
          href={SOCIAL.email}
          className="press voice-data zone rounded-full border border-rule px-7 py-3.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
        >
          PITCH ME A TEARDOWN
        </a>
      </div>

      <div className="zone mt-24 flex flex-col gap-6 border-t border-rule pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Monogram size={30} />
          <div>
            <Wordmark className="text-lg" />
            <p className="voice-kicker zone mt-1 text-[9px] text-muted">
              The numbers, not the headline
            </p>
          </div>
        </div>
        <p className="voice-data zone text-[10px] tracking-[0.18em] text-muted">
          {CLOSER.legal}
        </p>
      </div>
    </footer>
  );
}
