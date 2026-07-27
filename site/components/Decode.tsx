"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>_#$%&*";

/*
  Terminal decode. Characters resolve left to right; unresolved slots cycle
  glyphs. The real string is always the accessible name — only the visual
  layer scrambles, so screen readers and copy-paste get the finished text.
*/
export default function Decode({
  text,
  className,
  speed = 34,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  /** ms per resolved character */
  speed?: number;
  delay?: number;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}) {
  const ref = useRef<HTMLElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;
    let frame = 0;
    let raf = 0;
    let started = false;

    const run = () => {
      const total = text.length;
      const tick = () => {
        const resolved = Math.floor(frame);
        setOut(
          text
            .split("")
            .map((ch, i) => {
              if (i < resolved || ch === " ") return ch;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );
        frame += 1000 / 60 / speed;
        if (frame < total) {
          raf = requestAnimationFrame(tick);
        } else {
          setOut(text);
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        io.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.25 },
    );
    io.observe(node);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
    };
  }, [text, speed, delay]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      aria-label={text}
    >
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
