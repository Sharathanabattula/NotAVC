"use client";

import { LazyMotion, domAnimation, m, useScroll } from "framer-motion";
import { Wordmark } from "./Logo";

const LINKS = [
  { href: "#thesis", label: "Why" },
  { href: "#analyst", label: "Who" },
  { href: "#method", label: "Method" },
  { href: "#desks", label: "Desks" },
  { href: "#teardowns", label: "Receipts" },
  { href: "#glossary", label: "Glossary" },
  { href: "#wire", label: "The Wire" },
  { href: "#signal", label: "Argue" },
];

export default function Nav() {
  // scaleX binds straight to the motion value — no React re-render per frame
  const { scrollYProgress } = useScroll();

  return (
    <LazyMotion features={domAnimation} strict>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="zone border-b border-rule bg-bg/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <a href="#top" aria-label="NotAVC — back to top">
              <Wordmark className="text-xl" />
            </a>
            <nav className="voice-kicker hidden items-center gap-7 text-muted sm:flex">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="zone transition-colors hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <span className="voice-kicker zone flex items-center gap-2 text-accent">
              <span className="h-1 w-1 rounded-full bg-accent" />
              EST. 2026
            </span>
          </div>
        </div>

        {/* Read-through progress */}
        <m.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="h-px origin-left bg-accent shadow-[0_0_10px_var(--glow)]"
        />
      </header>
    </LazyMotion>
  );
}
