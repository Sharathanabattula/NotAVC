// Shared pieces for NotAVC data reels (paper + grid look from the static infographics).
import '@fontsource/anton/400.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Caption, createTikTokStyleCaptions } from '@remotion/captions';

export const C = {
  paper: '#F2F1ED',
  grid: 'rgba(11,11,11,.055)',
  ink: '#0B0B0B',
  crimson: '#710014',
  bronze: '#B38F6F',
  sand: '#E6D9C7',
  tape: '#C9A887',
  muted: '#7E7264',
  white: '#FFFFFF',
  hairline: 'rgba(11,11,11,.12)',
};

export const F = {
  display: "'Anton', sans-serif",
  body: "'Outfit', sans-serif",
  mono: "'Space Mono', monospace",
};

export const W = 1080;
export const H = 1920;
export const PAD = 72;

// 0 -> 1 ease-in over `dur` frames starting at `delay`
export const useIn = (delay = 0, dur = 18) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic),
  });
};

// Springy pop for chips and labels
export const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 160 } });
};

export const Paper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{
    background: C.paper,
    backgroundImage: `linear-gradient(${C.grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${C.grid} 1.5px, transparent 1.5px)`,
    backgroundSize: '72px 72px',
    backgroundPosition: '-1px -1px',
  }}>
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 22, background: C.crimson }} />
    {children}
  </AbsoluteFill>
);

// Fades/slides a scene in and out inside its <Sequence>
export const Scene: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(frame, [0, 14], [40, 0], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};

export const Kicker: React.FC<{ text: string; top?: number }> = ({ text, top = 200 }) => (
  <div style={{ position: 'absolute', top, left: 0, right: 0, textAlign: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 28, letterSpacing: 9, color: C.crimson }}>
    {text}
  </div>
);

export const Wordmark: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: size, letterSpacing: -1.5, lineHeight: 1 }}>
    <span style={{ color: C.ink, opacity: 0.4 }}>Not</span><span style={{ color: C.ink }}>AVC</span>
  </div>
);

export const Footer: React.FC<{ source: string }> = ({ source }) => (
  <div style={{ position: 'absolute', left: PAD, right: PAD, bottom: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    <div style={{ alignSelf: 'stretch', height: 1.5, background: C.hairline }} />
    <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: 3, color: C.muted, textAlign: 'center' }}>{source}</div>
  </div>
);

// Counts up to `to`, formatted with Indian digit grouping
export const CountUp: React.FC<{ to: number; decimals?: number; prefix?: string; suffix?: string; delay?: number; dur?: number }> = ({
  to, decimals = 0, prefix = '', suffix = '', delay = 0, dur = 36,
}) => {
  const t = useIn(delay, dur);
  const v = (to * t).toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  return <>{prefix}{v}{suffix}</>;
};

export const Chip: React.FC<{ children: React.ReactNode; delay?: number; dark?: boolean; size?: number }> = ({ children, delay = 0, dark, size = 52 }) => {
  const p = usePop(delay);
  return (
    <div style={{
      display: 'inline-block', transform: `scale(${0.6 + 0.4 * p})`, opacity: Math.min(1, p * 1.5),
      fontFamily: F.display, fontSize: size, lineHeight: 1, letterSpacing: 0.5, textTransform: 'uppercase',
      color: dark ? C.white : C.ink, background: dark ? C.crimson : C.white,
      border: `1.5px solid ${dark ? C.crimson : C.hairline}`, borderRadius: 18, padding: '22px 30px',
      boxShadow: '0 2px 0 rgba(11,11,11,.06)',
    }}>
      {children}
    </div>
  );
};

export const Arrow: React.FC<{ width?: number; color?: string; progress?: number }> = ({ width = 90, color = C.ink, progress = 1 }) => (
  <svg width={width} height={width * 0.5} viewBox="0 0 100 50" style={{ overflow: 'visible' }}>
    <path d="M4 25 H90 M70 8 L92 25 L70 42" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - progress} />
  </svg>
);

// A label in a box, like the stamped tags on the infographic
export const Tag: React.FC<{ children: React.ReactNode; bg?: string; color?: string; size?: number }> = ({ children, bg = C.ink, color = C.white, size = 44 }) => (
  <div style={{ display: 'inline-block', background: bg, color, fontFamily: F.display, fontSize: size, lineHeight: 1, padding: '14px 22px', borderRadius: 8, letterSpacing: 0.5 }}>
    {children}
  </div>
);

// Spoken-word captions above the footer; the word being said turns crimson
export const VoiceCaptions: React.FC<{ captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;
  const { pages } = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 1200 });
  const page = pages.find((p) => nowMs >= p.startMs && nowMs < p.startMs + p.durationMs);
  if (!page) return null;
  return (
    <div style={{ position: 'absolute', left: PAD, right: PAD, bottom: 250, display: 'flex', justifyContent: 'center' }}>
      <div style={{ background: C.white, border: `1.5px solid ${C.hairline}`, borderRadius: 18, padding: '18px 30px', maxWidth: '100%', textAlign: 'center',
        fontFamily: F.body, fontWeight: 600, fontSize: 46, lineHeight: 1.25, color: C.ink, whiteSpace: 'pre-wrap' }}>
        {page.tokens.map((t, i) => (
          <span key={i} style={{ color: nowMs >= t.fromMs && nowMs < t.toMs ? C.crimson : C.ink }}>{t.text}</span>
        ))}
      </div>
    </div>
  );
};
