"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

/*
  One line of arithmetic, with a bar that fills as it enters.

  The bar is measured against sales, so the rows are comparable to each
  other rather than each being scaled to its own maximum — that is the
  whole point. Anything over 100% overflows the track deliberately and
  turns crimson: total costs at 117% of sales is the finding, and a bar
  clamped to the track edge would hide it.
*/
export function WorkingRow({
  k,
  v,
  note,
  share,
  index,
}: {
  k: string;
  v: string;
  note: string;
  share?: number;
  index: number;
}) {
  /* Over-100 bars are drawn against a 130 scale so the overflow is visible. */
  const over = (share ?? 0) > 100;
  const width = share === undefined ? 0 : Math.min(100, (share / (over ? 130 : 100)) * 100);

  return (
    <div className="zone grid gap-2 border-b border-rule py-6 sm:grid-cols-[14rem_9rem_1fr] sm:gap-6">
      <span className="voice-data zone text-[11px] tracking-[0.18em] text-muted">
        {k}
      </span>

      <div className="flex flex-col gap-2">
        <span className="voice-data zone text-xl font-bold text-accent">{v}</span>
        {share !== undefined && (
          <LazyMotion features={domAnimation} strict>
            <span
              aria-hidden
              className="zone hidden h-[3px] w-full overflow-hidden bg-rule sm:block"
            >
              <m.span
                className="block h-full origin-left"
                style={{ background: over ? "var(--accent)" : "var(--accent-dim)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: width / 100 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{
                  duration: 0.9,
                  delay: 0.06 * index,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </span>
            <span className="voice-data zone hidden text-[10px] tracking-[0.15em] text-muted sm:block">
              {share}% OF SALES
            </span>
          </LazyMotion>
        )}
      </div>

      <span className="zone font-light leading-relaxed text-muted">{note}</span>
    </div>
  );
}
