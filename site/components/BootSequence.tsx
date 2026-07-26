"use client";

import { useEffect, useState } from "react";
import { BOOT_LINES } from "@/lib/content";

/*
  MOTION MOMENT — the cold open.
  A terminal boot that runs once per session, then never again.
  Pure opacity/transform; unmounts completely so it costs nothing after.
*/
export default function BootSequence() {
  const [shown, setShown] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || sessionStorage.getItem("notavc-booted")) return;

    sessionStorage.setItem("notavc-booted", "1");
    setDone(false);
    document.body.style.overflow = "hidden";

    const timers: number[] = [];
    BOOT_LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), 260 + i * 190));
    });
    timers.push(window.setTimeout(() => setLeaving(true), 260 + BOOT_LINES.length * 190 + 420));
    timers.push(
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = "";
      }, 260 + BOOT_LINES.length * 190 + 1120),
    );

    return () => {
      timers.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#140d10] transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="voice-data w-full max-w-2xl px-6 text-[11px] leading-[2.1] sm:text-[13px]">
        {BOOT_LINES.map((line, i) => (
          <p
            key={line}
            className={`transition-opacity duration-200 ${
              i < shown ? "opacity-100" : "opacity-0"
            } ${i === 0 ? "mb-4 text-[#d8495f]" : "text-[#9c8d84]"}`}
          >
            {i === 0 ? line : <>{line.replace(/OK$/, "")}{line.endsWith("OK") && <span className="text-[#c9a470]">OK</span>}</>}
          </p>
        ))}
        <p className="mt-4 text-[#f1e9dd]">
          <span className="inline-block h-[1em] w-[0.55em] translate-y-[0.1em] bg-[#d8495f]" />
        </p>
      </div>
    </div>
  );
}
