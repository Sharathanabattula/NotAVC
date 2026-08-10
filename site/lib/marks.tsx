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

/*
  A rail that forks, with the lever that forks it.

  Drawn for the trolley problem but the shape is more general: the moment one
  path becomes two and someone has to own which. Sleepers are laid before the
  rails so the rails sit on top, and the straight route is two passes that do
  not agree — a single clean stroke reads as a diagram, not a drawing.
*/
export function Switchpoint({ colour = BRAND.signal, width = 820, height = 300 }: MarkProps) {
  const w = width;
  const h = height;
  /* The straight route sits low so the branch has room to climb away from it */
  const y = h * 0.72;
  const sx = w * 0.34;
  /* Where the branch ends, and the slope it holds while getting there */
  const bx = w - 10;
  const by = y - h * 0.5;
  const sleeper = 20;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      {/* Sleepers under the straight route */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = w * 0.03 + i * w * 0.085;
        return (
          <path
            key={`s${i}`}
            d={`M${x} ${y - sleeper} L${x - 5} ${y + sleeper}`}
            stroke={colour}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.35}
          />
        );
      })}

      {/*
        Sleepers under the branch, angled to it. Without these the branch
        reads as a trend line on a chart rather than a second track.
      */}
      {Array.from({ length: 6 }, (_, i) => {
        const t = 0.2 + i * 0.16;
        const x = sx + (bx - sx) * t;
        const yy = y + (by - y) * t * t;
        return (
          <path
            key={`b${i}`}
            d={`M${x + 7} ${yy - sleeper} L${x - 9} ${yy + sleeper}`}
            stroke={colour}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.35}
          />
        );
      })}

      {/* Straight route — two passes that do not agree */}
      <path
        d={`M4 ${y} C ${w * 0.3} ${y - 5}, ${w * 0.7} ${y + 4}, ${w - 6} ${y - 2}`}
        stroke={colour}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <path
        d={`M18 ${y + 9} C ${w * 0.35} ${y + 5}, ${w * 0.72} ${y + 13}, ${w - 20} ${y + 8}`}
        stroke={colour}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.4}
      />

      {/* The branch, leaving at the switch */}
      <path
        d={`M${sx} ${y + 2} C ${sx + (bx - sx) * 0.35} ${y - 6}, ${sx + (bx - sx) * 0.6} ${by + 54}, ${bx} ${by}`}
        stroke={colour}
        strokeWidth={10}
        strokeLinecap="round"
      />

      {/* The lever — the whole point of the drawing, so it is not subtle */}
      <path
        d={`M${sx} ${y} L${sx - 6} ${y + 60}`}
        stroke={colour}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <rect x={sx - 6 - 15} y={y + 58} width={30} height={30} rx={15} fill={colour} />
    </svg>
  );
}

/*
  The whole problem in one drawing: a train, a rail that forks, two people on
  the route it is already taking, one on the route the lever would send it to.

  Everything is a path or a rounded rect — Satori renders no <text>, no
  <circle> reliably and no markers, so heads and wheels are rects with a full
  radius and the figures are drawn rather than typeset. The count is left for
  the reader to make: two against one is legible at a glance, and labelling it
  would explain a joke nobody asked to have explained.
*/
export function TrolleyScene({ colour = BRAND.signal, width = 940, height = 348 }: MarkProps) {
  const W = 940;
  /*
    The drawing is authored on a 430-tall grid but the top 82 rows are empty
    sky above the branch. Cropping them in the viewBox rather than moving every
    coordinate keeps the geometry readable and stops the figure opening with a
    band of nothing under the headline.
  */
  const TOP = 82;
  const H = 430 - TOP;
  const ink = BRAND.ink;
  const railY = 316;
  const forkX = 306;
  const endX = 926;
  const endY = 132;

  /* The branch, eased so it leaves the switch shallow and climbs after */
  const branchAt = (t: number) => ({
    x: forkX + (endX - forkX) * t,
    y: railY + (endY - railY) * t * t,
  });

  /*
    A sleeper laid across the branch rather than beside it. Angling each one
    to the local normal is the whole difference between a second track and a
    field of hatching floating above a trend line.
  */
  const branchSleeper = (t: number, half: number) => {
    const p = branchAt(t);
    const dx = endX - forkX;
    const dy = 2 * (endY - railY) * t;
    const len = Math.hypot(dx, dy);
    const nx = (-dy / len) * half;
    const ny = (dx / len) * half;
    return `M${p.x - nx} ${p.y - ny} L${p.x + nx} ${p.y + ny}`;
  };

  /*
    Returns elements rather than being a component. Satori walks the <svg>
    subtree looking for shapes, and a nested component or a fragment inside it
    renders nothing at all — silently, which is how the first version of this
    drawing shipped as an empty box.
  */
  const figure = (key: string, x: number, y: number, armDrop: number) => [
    <rect key={`${key}h`} x={x - 9} y={y - 62} width={18} height={18} rx={9} fill={ink} />,
    <path
      key={`${key}t`}
      d={`M${x} ${y - 43} L${x} ${y - 20}`}
      stroke={ink}
      strokeWidth={5}
      strokeLinecap="round"
    />,
    <path
      key={`${key}a`}
      d={`M${x - 14} ${y - 36} L${x + 14} ${y - armDrop}`}
      stroke={ink}
      strokeWidth={5}
      strokeLinecap="round"
    />,
    <path
      key={`${key}l1`}
      d={`M${x} ${y - 20} L${x - 11} ${y}`}
      stroke={ink}
      strokeWidth={5}
      strokeLinecap="round"
    />,
    <path
      key={`${key}l2`}
      d={`M${x} ${y - 20} L${x + 11} ${y}`}
      stroke={ink}
      strokeWidth={5}
      strokeLinecap="round"
    />,
  ];

  return (
    <svg width={width} height={height} viewBox={`0 ${TOP} ${W} ${H}`} fill="none">
      {/* Sleepers, straight route */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = 250 + i * 47;
        return (
          <path
            key={`s${i}`}
            d={`M${x} ${railY - 17} L${x - 5} ${railY + 17}`}
            stroke={colour}
            strokeWidth={4}
            strokeLinecap="round"
            opacity={0.3}
          />
        );
      })}

      {/* Sleepers, branch */}
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={`b${i}`}
          d={branchSleeper(0.2 + i * 0.1, 17)}
          stroke={colour}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.3}
        />
      ))}

      {/* Straight route — two passes that do not agree */}
      <path
        d={`M8 ${railY} C 300 ${railY - 5}, 640 ${railY + 4}, ${W - 8} ${railY - 2}`}
        stroke={colour}
        strokeWidth={9}
        strokeLinecap="round"
      />
      <path
        d={`M24 ${railY + 9} C 320 ${railY + 5}, 660 ${railY + 13}, ${W - 24} ${railY + 8}`}
        stroke={colour}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0.4}
      />

      {/* Branch */}
      <path
        d={`M${forkX} ${railY + 2} C ${forkX + 150} ${railY - 8}, ${endX - 190} ${endY + 66}, ${endX} ${endY}`}
        stroke={colour}
        strokeWidth={9}
        strokeLinecap="round"
      />

      {/* Lever */}
      <path
        d={`M${forkX} ${railY} L${forkX - 7} ${railY + 62}`}
        stroke={colour}
        strokeWidth={8}
        strokeLinecap="round"
      />
      <rect x={forkX - 7 - 15} y={railY + 60} width={30} height={30} rx={15} fill={colour} />

      {/* Speed, above and behind */}
      {[196, 214].map((y, i) => (
        <path
          key={`v${i}`}
          d={`M${10 + i * 16} ${y} L${58 + i * 16} ${y}`}
          stroke={ink}
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.3}
        />
      ))}

      {/*
        A locomotive, not a van. The proportion is the whole trick: roughly
        three and a half long to one high, with the nose raking hard over the
        leading wheel. A squarer box reads as a delivery truck no matter what
        is drawn on it.
      */}
      <path
        d={`M26 ${railY - 12} L26 246 C26 236, 34 232, 46 232 L226 232 L278 288 L278 ${railY - 12} Z`}
        stroke={ink}
        strokeWidth={7}
        strokeLinejoin="round"
      />
      {/* Cab glass, set into the rake */}
      <path
        d={`M224 246 L238 246 L268 278 L224 278 Z`}
        stroke={ink}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      {/* Window band */}
      <path d={`M50 256 L200 256`} stroke={ink} strokeWidth={5} strokeLinecap="round" opacity={0.45} />
      <path d={`M50 278 L172 278`} stroke={ink} strokeWidth={4} strokeLinecap="round" opacity={0.3} />
      <rect x={56} y={railY - 24} width={28} height={28} rx={14} fill={ink} />
      <rect x={130} y={railY - 24} width={28} height={28} rx={14} fill={ink} />
      <rect x={218} y={railY - 24} width={28} height={28} rx={14} fill={ink} />

      {/* Two on the route it is already taking */}
      {figure("p1", 812, railY, 40)}
      {figure("p2", 868, railY, 30)}

      {/* One on the route the lever would choose */}
      {figure("p3", 862, branchAt(0.9).y, 36)}
    </svg>
  );
}
