"use client";

import { useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { TICKER_TERMS } from "@/lib/content";

/*
  The tape. It drifts on its own, but scroll velocity drives it: flick down
  and it accelerates and leans forward, flick up and it runs backwards.

  Position is integrated per frame into a motion value, never React state —
  the tape moves every frame, and a state update per frame would re-render
  the whole list sixty times a second.
*/

const BASE_DRIFT = -2.2; // percent per second

function Row() {
  return (
    <span className="flex shrink-0 items-center">
      {TICKER_TERMS.map((term) => (
        <span
          key={term}
          className="voice-data flex items-center text-xs tracking-[0.18em]"
        >
          <span className="zone px-6 text-muted">{term}</span>
          <span className="zone text-accent">·</span>
        </span>
      ))}
    </span>
  );
}

export default function Ticker() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Clamped so a fast flick accelerates the tape rather than tearing it
  // across the screen.
  const velocityFactor = useTransform(
    smoothVelocity,
    [-2500, 0, 2500],
    [-3, 0, 3],
    { clamp: true },
  );

  // Lean into the direction of travel
  const skew = useTransform(smoothVelocity, [-2000, 0, 2000], [4, 0, -4], {
    clamp: true,
  });
  const smoothSkew = useSpring(skew, { damping: 40, stiffness: 300 });

  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    const factor = velocityFactor.get();
    // Scrolling up runs the tape backwards
    if (factor !== 0) direction.current = factor < 0 ? -1 : 1;

    const seconds = delta / 1000;
    const moveBy =
      direction.current * BASE_DRIFT * seconds * (1 + Math.abs(factor));

    // Four identical rows, so wrapping at one row-width (25%) is seamless
    let next = baseX.get() + moveBy;
    if (next <= -25) next += 25;
    if (next >= 0) next -= 25;
    baseX.set(next);
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="zone overflow-clip border-y border-rule py-3" aria-hidden>
        <m.div
          style={{ x, skewX: smoothSkew }}
          className="flex w-max will-change-transform"
        >
          <Row />
          <Row />
          <Row />
          <Row />
        </m.div>
      </div>
    </LazyMotion>
  );
}
