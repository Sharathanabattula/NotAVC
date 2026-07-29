import { BRAND } from "./brand";

/*
  NotAVC pictograms.

  Geometric but warm — rounded caps and joins, generous corner radii, and
  shapes that sit slightly off-axis so they read as drawn rather than
  snapped to a grid. Abstract on purpose: a pictogram that tries to depict
  the literal object lands as clipart.

  Construction rules, so a new one matches without guesswork:
  - 120x120 viewBox, artwork inside a 12px margin
  - one stroke weight: 9, round caps, round joins
  - exactly three tones — ink, signal, and ink at 18% as the ghost
  - four elements maximum
  - the signal element is the subject; everything else is context
*/

export type IconProps = { size?: number; accent?: string; ink?: string };

const S = 9;

function base(ink: string) {
  return {
    stroke: ink,
    strokeWidth: S,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none" as const,
  };
}

/* ── Money and capital ────────────────────────────────────── */

export function IconCoins({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <ellipse cx="60" cy="86" rx="40" ry="15" fill={ink} opacity="0.18" />
      <ellipse cx="60" cy="62" rx="40" ry="15" fill={ink} opacity="0.18" />
      <ellipse cx="60" cy="38" rx="40" ry="15" fill={accent} />
      <ellipse cx="60" cy="38" rx="40" ry="15" {...base(ink)} />
    </svg>
  );
}

export function IconBurn({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="44" fill={ink} opacity="0.18" />
      <path d="M60 16 A44 44 0 0 1 104 60 L60 60 Z" fill={accent} />
      <circle cx="60" cy="60" r="44" {...base(ink)} />
    </svg>
  );
}

export function IconRunway({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="14" y="46" width="92" height="28" rx="14" fill={ink} opacity="0.18" />
      <rect x="14" y="46" width="46" height="28" rx="14" fill={accent} />
      <rect x="14" y="46" width="92" height="28" rx="14" {...base(ink)} />
    </svg>
  );
}

/* ── Growth and measurement ───────────────────────────────── */

export function IconChart({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <rect x="16" y="70" width="22" height="36" rx="9" fill={ink} opacity="0.18" />
      <rect x="49" y="48" width="22" height="58" rx="9" fill={accent} />
      <rect x="82" y="24" width="22" height="82" rx="9" fill={ink} opacity="0.18" />
      <path d="M12 106 H108" {...base(ink)} />
    </svg>
  );
}

export function IconClimb({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M16 88 L46 58 L68 76 L104 32" {...base(ink)} stroke={accent} />
      <path d="M104 32 L104 56 M104 32 L80 32" {...base(ink)} stroke={accent} />
      <circle cx="46" cy="58" r="8" fill={ink} opacity="0.18" />
      <circle cx="68" cy="76" r="8" fill={ink} opacity="0.18" />
    </svg>
  );
}

/* Beam tips down toward the weighted side; the fulcrum is a fixed post. */
export function IconScale({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M60 46 V96" {...base(ink)} />
      <path d="M34 104 H86" {...base(ink)} />
      <path d="M20 56 L100 36" {...base(ink)} />
      <circle cx="20" cy="56" r="16" fill={accent} />
      <rect x="86" y="22" width="28" height="28" rx="10" fill={ink} opacity="0.18" />
    </svg>
  );
}

/* ── Decisions and paths ──────────────────────────────────── */

export function IconSplit({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M16 60 H50" {...base(ink)} />
      <path d="M50 60 C74 60 80 28 104 26" {...base(ink)} stroke={accent} />
      <path d="M50 60 C74 60 80 92 104 94" {...base(ink)} opacity="0.35" />
      <circle cx="50" cy="60" r="11" fill={accent} />
    </svg>
  );
}

export function IconTarget({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="44" {...base(ink)} opacity="0.35" />
      <circle cx="60" cy="60" r="26" {...base(ink)} />
      <circle cx="60" cy="60" r="11" fill={accent} />
    </svg>
  );
}

export function IconClock({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="62" r="42" fill={ink} opacity="0.18" />
      <circle cx="60" cy="62" r="42" {...base(ink)} />
      <path d="M60 34 V62 L82 74" {...base(ink)} stroke={accent} />
    </svg>
  );
}

/* ── Documents and terms ──────────────────────────────────── */

export function IconDoc({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M26 14 H72 L96 38 V106 H26 Z" rx="10" fill={ink} opacity="0.18" />
      <path d="M26 14 H72 L96 38 V106 H26 Z" {...base(ink)} />
      <path d="M72 14 V38 H96" {...base(ink)} />
      <rect x="44" y="66" width="38" height="9" rx="4.5" fill={accent} />
    </svg>
  );
}

export function IconStamp({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="48" r="30" fill={accent} />
      <path d="M32 96 H88" {...base(ink)} />
      <path d="M44 78 H76" {...base(ink)} opacity="0.35" />
      <path d="M48 46 L57 56 L74 38" {...base(ink)} stroke="#FFFFFF" />
    </svg>
  );
}

/* ── People and market ────────────────────────────────────── */

export function IconPeople({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <circle cx="38" cy="44" r="16" fill={ink} opacity="0.18" />
      <path d="M14 96 C14 76 26 68 38 68 C50 68 62 76 62 96" {...base(ink)} opacity="0.35" />
      <circle cx="80" cy="40" r="19" fill={accent} />
      <path d="M52 100 C52 78 64 68 80 68 C96 68 108 78 108 100" {...base(ink)} />
    </svg>
  );
}

export function IconStore({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M18 44 L28 20 H92 L102 44 Z" fill={accent} />
      <path d="M18 44 L28 20 H92 L102 44 Z" {...base(ink)} />
      <path d="M26 44 V102 H94 V44" {...base(ink)} />
      <rect x="50" y="68" width="24" height="34" rx="8" fill={ink} opacity="0.18" />
    </svg>
  );
}

export function IconRocket({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path
        d="M60 12 C78 30 86 52 86 72 H34 C34 52 42 30 60 12 Z"
        fill={accent}
      />
      <path d="M60 12 C78 30 86 52 86 72 H34 C34 52 42 30 60 12 Z" {...base(ink)} />
      <circle cx="60" cy="48" r="10" fill="#FFFFFF" />
      <path d="M46 84 L52 104 M74 84 L68 104" {...base(ink)} opacity="0.35" />
    </svg>
  );
}

/* ── Warnings and signals ─────────────────────────────────── */

export function IconAlert({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M60 16 L106 98 H14 Z" rx="12" fill={accent} />
      <path d="M60 16 L106 98 H14 Z" {...base(ink)} />
      <path d="M60 48 V70" {...base(ink)} stroke="#FFFFFF" />
      <circle cx="60" cy="84" r="5" fill="#FFFFFF" />
    </svg>
  );
}

export function IconEye({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M10 60 C30 30 90 30 110 60 C90 90 30 90 10 60 Z" fill={ink} opacity="0.18" />
      <path d="M10 60 C30 30 90 30 110 60 C90 90 30 90 10 60 Z" {...base(ink)} />
      <circle cx="60" cy="60" r="15" fill={accent} />
    </svg>
  );
}

export function IconLock({ size = 150, accent = BRAND.signal, ink = BRAND.ink }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <path d="M40 52 V38 A20 20 0 0 1 80 38 V52" {...base(ink)} />
      <rect x="24" y="52" width="72" height="54" rx="14" fill={accent} />
      <rect x="24" y="52" width="72" height="54" rx="14" {...base(ink)} />
      <circle cx="60" cy="79" r="7" fill="#FFFFFF" />
    </svg>
  );
}

export const ICONS = {
  coins: IconCoins,
  burn: IconBurn,
  runway: IconRunway,
  chart: IconChart,
  climb: IconClimb,
  scale: IconScale,
  split: IconSplit,
  target: IconTarget,
  clock: IconClock,
  doc: IconDoc,
  stamp: IconStamp,
  people: IconPeople,
  store: IconStore,
  rocket: IconRocket,
  alert: IconAlert,
  eye: IconEye,
  lock: IconLock,
} as const;

export type IconName = keyof typeof ICONS;
export const ICON_NAMES = Object.keys(ICONS) as IconName[];
