"use client";

import { useEffect } from "react";

/*
  Watches [data-zone] sections; whichever crosses the viewport's
  center band claims the palette. IntersectionObserver only — zero work
  per scroll frame, the crossfade itself is CSS.
*/
export default function PaletteObserver() {
  useEffect(() => {
    const zones = document.querySelectorAll<HTMLElement>("[data-zone]");
    if (!zones.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const palette = (entry.target as HTMLElement).dataset.zone;
            if (palette) {
              document.documentElement.setAttribute("data-zone", palette);
            }
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    zones.forEach((zone) => io.observe(zone));
    return () => io.disconnect();
  }, []);

  return null;
}
