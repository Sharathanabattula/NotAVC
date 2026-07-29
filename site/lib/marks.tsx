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

/* Pictograms moved to lib/icons.tsx — see ICONS there. */
export { ICONS, ICON_NAMES, type IconName } from "./icons";

/*
  Cutout portrait on an offset plate.

  Satori supports no CSS `filter`, so there is no grayscale() and no true
  duotone. The look is built by composition instead: a flat signal plate
  offset behind the image, and a signal wash laid over it at low alpha.
  That reads as a deliberate treatment rather than a raw photo dropped in,
  which is the difference between modernist and scrapbook.

  `src` must be an absolute URL — Satori fetches it at render time.
*/
export function CutoutPortrait({
  src,
  width = 300,
  height = 375,
  accent = BRAND.signal,
  offset = 18,
}: {
  src: string;
  width?: number;
  height?: number;
  accent?: string;
  offset?: number;
}) {
  return (
    <div style={{ display: "flex", position: "relative", width: width + offset, height: height + offset }}>
      {/* Plate */}
      <div
        style={{
          position: "absolute",
          left: offset,
          top: offset,
          width,
          height,
          display: "flex",
          background: accent,
        }}
      />
      {/* Photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }}
      />
      {/* Wash — ties the photo to the palette without a filter */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          display: "flex",
          background: accent,
          opacity: 0.22,
        }}
      />
    </div>
  );
}

/*
  Filled grid cells. Uses the graph paper as a compositional device rather
  than wallpaper — a few cells inked in to weight a corner.
*/
export function GridBlocks({
  cells,
  step = 108,
  colour = BRAND.signal,
  opacity = 0.1,
}: {
  cells: { col: number; row: number; w?: number; h?: number }[];
  step?: number;
  colour?: string;
  opacity?: number;
}) {
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" fill="none">
      {cells.map((c, i) => (
        <rect
          key={i}
          x={c.col * step}
          y={c.row * step}
          width={(c.w ?? 1) * step}
          height={(c.h ?? 1) * step}
          fill={colour}
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
