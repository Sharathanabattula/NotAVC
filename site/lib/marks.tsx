import { BRAND } from "./brand";

/*
  Hand-drawn marker marks and line-art icons.

  Every path here is hand-authored rather than generated, because the whole
  point is that they look drawn by a person: the arrows overshoot, the
  underlines are two passes that do not line up, the circle does not close.
  A perfect ellipse reads as a shape tool and kills the effect.

  Satori renders inline SVG, but only a subset — no filters, no masks, no
  markers. Arrowheads are therefore drawn as explicit paths, and stroke
  tapering is faked by stacking two strokes of different widths.
*/

type MarkProps = { colour?: string; width?: number; height?: number };

/*
  Graph paper, drawn as explicit lines.

  A tiled `background-image: linear-gradient(...)` with `background-size`
  is the obvious way to do this and it silently renders nothing in Satori —
  it does not repeat backgrounds. Every line is therefore emitted.
*/
export function GraphPaper({
  width,
  height,
  step = 108,
  colour,
}: {
  width: number;
  height: number;
  step?: number;
  colour: string;
}) {
  const cols = Math.ceil(width / step);
  const rows = Math.ceil(height / step);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      {Array.from({ length: cols }, (_, i) => (
        <rect key={`v${i}`} x={i * step} y={0} width={2} height={height} fill={colour} />
      ))}
      {Array.from({ length: rows }, (_, i) => (
        <rect key={`h${i}`} x={0} y={i * step} width={width} height={2} fill={colour} />
      ))}
    </svg>
  );
}

/* Curved arrow with a loop in the tail. Points down-left. */
export function ArrowDownLeft({ colour = BRAND.signal, width = 190, height = 150 }: MarkProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 190 150" fill="none">
      <path
        d="M175 8 C176 46 168 74 150 92 C142 100 130 104 124 97 C118 90 125 79 134 82 C144 85 146 100 138 112 C128 127 96 134 46 132"
        stroke={colour}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M46 132 L74 116" stroke={colour} strokeWidth="7" strokeLinecap="round" />
      <path d="M46 132 L76 144" stroke={colour} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/* Mirror of the above — points down-right. */
export function ArrowDownRight({ colour = BRAND.signal, width = 190, height = 150 }: MarkProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 190 150" fill="none">
      <path
        d="M15 8 C14 46 22 74 40 92 C48 100 60 104 66 97 C72 90 65 79 56 82 C46 85 44 100 52 112 C62 127 94 134 144 132"
        stroke={colour}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M144 132 L116 116" stroke={colour} strokeWidth="7" strokeLinecap="round" />
      <path d="M144 132 L114 144" stroke={colour} strokeWidth="7" strokeLinecap="round" />
    </svg>
  );
}

/*
  Double underline. Two passes at different widths and lengths — the second
  is the "went over it again" stroke and must not track the first.
*/
export function Underline({ colour = BRAND.signal, width = 760, height = 46 }: MarkProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 760 46" fill="none">
      <path
        d="M14 16 C170 6 420 6 742 12"
        stroke={colour}
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.92"
      />
      <path
        d="M92 36 C240 27 430 27 610 33"
        stroke={colour}
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/* Circled phrase. Deliberately open at the top-right — a closed ring reads as a shape. */
export function CircleMark({ colour = BRAND.signal, width = 560, height = 190 }: MarkProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 560 190" fill="none">
      <path
        d="M396 22 C250 4 92 22 40 68 C-2 106 30 154 150 170 C286 188 470 172 526 124 C560 94 542 58 470 38"
        stroke={colour}
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/*
  Strike for the correction layer. Two crossing passes, so it reads as
  scribbled out rather than as a text-decoration rule.
*/
export function StrikeMark({ colour = BRAND.signal, width = 700, height = 30 }: MarkProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 700 30" fill="none">
      <path
        d="M8 18 C160 8 420 10 692 14"
        stroke={colour}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M20 12 C200 22 460 20 680 18"
        stroke={colour}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/* ── Line-art icons ───────────────────────────────────────── */

const ICON_STROKE = { stroke: BRAND.ink, strokeWidth: 5, fill: "none" as const };

export function IconChart({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <rect x="10" y="14" width="100" height="92" rx="8" {...ICON_STROKE} />
      <path d="M28 82 L48 58 L66 72 L92 36" {...ICON_STROKE} strokeLinecap="round" />
      <circle cx="48" cy="58" r="6" {...ICON_STROKE} />
      <circle cx="66" cy="72" r="6" {...ICON_STROKE} />
    </svg>
  );
}

export function IconBurn({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <path
        d="M60 12 C74 36 92 46 92 70 C92 90 78 104 60 104 C42 104 28 90 28 70 C28 46 46 36 60 12 Z"
        {...ICON_STROKE}
        strokeLinejoin="round"
      />
      <path d="M60 60 C66 72 72 76 72 84 C72 92 66 96 60 96 C54 96 48 92 48 84 C48 76 54 72 60 60 Z" {...ICON_STROKE} />
    </svg>
  );
}

export function IconScale({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <path d="M60 16 L60 100" {...ICON_STROKE} strokeLinecap="round" />
      <path d="M24 34 L96 34" {...ICON_STROKE} strokeLinecap="round" />
      <path d="M36 100 L84 100" {...ICON_STROKE} strokeLinecap="round" />
      <path d="M24 34 L10 66 A18 14 0 0 0 38 66 Z" {...ICON_STROKE} strokeLinejoin="round" />
      <path d="M96 34 L82 66 A18 14 0 0 0 110 66 Z" {...ICON_STROKE} strokeLinejoin="round" />
    </svg>
  );
}

export function IconDoc({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <path d="M28 12 H72 L92 34 V108 H28 Z" {...ICON_STROKE} strokeLinejoin="round" />
      <path d="M72 12 V34 H92" {...ICON_STROKE} strokeLinejoin="round" />
      <path d="M44 58 H76 M44 74 H76 M44 90 H62" {...ICON_STROKE} strokeLinecap="round" />
    </svg>
  );
}

export function IconCoins({ size = 130 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120">
      <ellipse cx="60" cy="30" rx="34" ry="14" {...ICON_STROKE} />
      <path d="M26 30 V58 C26 66 41 72 60 72 C79 72 94 66 94 58 V30" {...ICON_STROKE} />
      <path d="M26 58 V84 C26 92 41 98 60 98 C79 98 94 92 94 84 V58" {...ICON_STROKE} />
    </svg>
  );
}

export const ICONS = {
  chart: IconChart,
  burn: IconBurn,
  scale: IconScale,
  doc: IconDoc,
  coins: IconCoins,
} as const;

export type IconName = keyof typeof ICONS;
