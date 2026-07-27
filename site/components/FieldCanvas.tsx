"use client";

import { useEffect, useRef } from "react";

/*
  The field — the site's ambient motion graphic.

  A dot lattice with a travelling wave. Dots near the wave crest lift and
  take the crimson; dots near the pointer brighten. One canvas, one rAF
  loop, no per-dot shadowBlur (that is what actually costs frames — a
  blurred fill is a separate raster pass per call).

  Budget: DPR capped at 2, ~1200 dots at 1440w, loop parks itself when the
  tab is hidden or the canvas scrolls out of view.
*/

const SPACING = 38;
const DOT = 1.4;
const POINTER_RADIUS = 190;

export default function FieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let raf = 0;
    let running = true;
    // Pointer parked off-canvas so nothing is lit before first move
    const pointer = { x: -9999, y: -9999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / SPACING) + 1;
      rows = Math.ceil(height / SPACING) + 1;
    };

    const draw = (time: number) => {
      const t = time * 0.00042;
      ctx.clearRect(0, 0, width, height);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = col * SPACING;
          const y = row * SPACING;

          // Two crossed sine waves — the crest travels diagonally
          const wave =
            Math.sin(x * 0.006 + t) * 0.5 + Math.sin(y * 0.009 - t * 0.8) * 0.5;

          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const near = dist < POINTER_RADIUS ? 1 - dist / POINTER_RADIUS : 0;

          // wave sits in [-1,1]; lift it to [0,1] then bias dark
          const energy = Math.max(0, wave) * 0.55 + near * 0.9;
          if (energy < 0.04) continue;

          const radius = DOT + energy * 1.9;
          // Crimson only where the crest and the pointer actually peak
          const hot = energy > 0.55;
          ctx.fillStyle = hot
            ? `rgba(226, 62, 82, ${Math.min(energy, 1) * 0.85})`
            : `rgba(236, 231, 225, ${energy * 0.34})`;

          ctx.beginPath();
          ctx.arc(x, y - wave * 5, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      if (!running) return;
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();

    if (reduced) {
      // One static frame — the lattice still reads, nothing moves
      draw(0);
      return;
    }

    raf = requestAnimationFrame(loop);

    const onVisibility = () => (document.hidden ? stop() : start());
    // Park the loop entirely once the field scrolls away
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
