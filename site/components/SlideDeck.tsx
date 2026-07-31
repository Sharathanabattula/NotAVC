"use client";

import { useState } from "react";

/*
  The published carousel, readable on a page rather than in a feed.

  A horizontal snap-scroll strip rather than a lightbox: the slides are meant
  to be read in order, and a strip preserves that while still letting someone
  jump to the one they want. Clicking a slide opens it full size, because the
  numbers on them are small at strip scale.

  The images are the same PNG endpoint Instagram pulls from, so this can
  never show a different deck from the one that was published.
*/
export default function SlideDeck({
  slides,
  company,
}: {
  slides: string[];
  company: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <div className="-mx-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
        <div className="flex snap-x snap-mandatory gap-4">
          {slides.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${company} slide ${i + 1} of ${slides.length} — open full size`}
              className="zone group relative w-[70vw] shrink-0 snap-start overflow-hidden border border-rule sm:w-[19rem]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${company} — slide ${i + 1}`}
                width={1080}
                height={1350}
                loading={i < 3 ? "eager" : "lazy"}
                className="block h-auto w-full transition-opacity group-hover:opacity-85"
              />
              <span className="voice-data absolute bottom-0 right-0 bg-accent px-2 py-1 text-[10px] text-white">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="voice-data zone mt-2 text-[11px] tracking-[0.18em] text-muted">
        SCROLL SIDEWAYS · TAP A SLIDE TO ENLARGE
      </p>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${company} slide ${open + 1}`}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slides[open]}
            alt={`${company} — slide ${open + 1}`}
            className="max-h-[90vh] w-auto max-w-full object-contain"
          />
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Close"
            className="voice-data absolute right-5 top-5 border border-white/30 px-3 py-2 text-xs tracking-[0.2em] text-white"
          >
            CLOSE ✕
          </button>
        </div>
      )}
    </>
  );
}
