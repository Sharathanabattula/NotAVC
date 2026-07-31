"use client";

import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { GLOSSARY } from "@/lib/content";
import { Reveal } from "./Reveal";

/*
  The words, in normal English.

  Collapsed by default and opened one at a time. A wall of ten definitions
  is a reference document nobody reads; one open answer is a conversation.
  The height animation is on a wrapper rather than the text so the copy
  never reflows mid-transition.
*/
export default function Glossary() {
  const [open, setOpen] = useState<string | null>(GLOSSARY[0].term);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <p className="voice-kicker zone mb-6 text-accent">
                The words, in normal English
              </p>
              <h2 className="voice-display zone text-5xl text-ink sm:text-6xl">
                None of this is as complicated as it sounds.
              </h2>
              <p className="zone mt-8 max-w-sm font-light leading-relaxed text-muted">
                Most of what makes finance feel closed off is vocabulary. Here
                is the vocabulary, with no vocabulary in the answers.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="zone border-t border-rule">
              {GLOSSARY.map((entry, i) => {
                const isOpen = open === entry.term;
                return (
                  <Reveal key={entry.term} delay={Math.min(i, 5) * 0.03}>
                    <div className="zone border-b border-rule">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : entry.term)}
                        aria-expanded={isOpen}
                        className="zone flex w-full items-center justify-between gap-6 py-6 text-left"
                      >
                        <span
                          className={`voice-heading zone text-xl transition-colors sm:text-2xl ${
                            isOpen ? "text-accent" : "text-ink"
                          }`}
                        >
                          {entry.term}
                        </span>
                        <m.span
                          aria-hidden
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="voice-data zone shrink-0 text-xl text-accent"
                        >
                          +
                        </m.span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <m.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="zone max-w-2xl pb-7 font-light leading-relaxed text-muted">
                              {entry.plain}
                            </p>
                          </m.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
