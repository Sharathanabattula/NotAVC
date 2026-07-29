/*
  Tokens from the NotAVC Design System in Claude Design
  (Anabattula Sharath Chandra, updated 2026-07-29).

  This file is the authority for post artwork. It is transcribed from the
  design system rather than invented here, so the feed cannot drift from
  what Sharath specified. If a value changes there, change it here — do not
  introduce a colour or a font that is not in this list.

  Note the site itself runs a different, darker system (see DESIGN.md).
  That is deliberate: the design system defines social formats — carousels
  and posts on light canvas, reels 9:16 dark, thumbnails 16:9 split.
*/

export const BRAND = {
  canvas: "#F2F1ED",
  canvas2: "#FAF9F6",
  paper: "#FFFFFF",
  ink: "#0B0B0B",
  muted: "#888888",
  hairline: "#E5E5E5",

  /* Signal is the crimson anchor, used flat and as tints */
  signal: "#710014",
  signal08: "rgba(113,0,20,.08)",
  signal12: "rgba(113,0,20,.12)",
  signal18: "rgba(113,0,20,.18)",

  /* Dark surfaces — reels and any inverted panel */
  surfaceDark: "#0B0B0B",
  surfaceDeep: "#2a0008",
  /* On dark, crimson is unreadable; the system switches to warm bronze */
  accentOnDark: "#B38F6F",

  white06: "rgba(255,255,255,.06)",
  white10: "rgba(255,255,255,.10)",
  white35: "rgba(255,255,255,.35)",
  white45: "rgba(255,255,255,.45)",

  borderLight: "rgba(0,0,0,.08)",
  borderDefault: "rgba(0,0,0,.12)",
  borderStrong: "rgba(0,0,0,.18)",

  coral: "#E8593C",
  amber: "#F2A623",
  info: "#3B8BD4",
  positive: "#3B8BD4",
  negative: "#E8593C",
} as const;

/* Display / Body / Data */
export const FONT = {
  display: "Jakarta",
  body: "Outfit",
  data: "SpaceMono",
} as const;

/* 4 / 8 / 16 / 24 / 32 / 48 — scaled up for 1080px artwork */
export const SPACE = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

/* sm 4px → pill; cards use lg (12px) */
export const RADIUS = { sm: 4, md: 8, lg: 12, pill: 9999 } as const;
