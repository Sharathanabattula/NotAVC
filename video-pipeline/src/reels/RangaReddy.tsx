// Reel version of the "Once Hyderabad Rural, now India's richest district" infographic.
// Figures: Telangana Socio-Economic Outlook 2026, Pharmexcil (as on the static post).
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { INDIA_INSET, TELANGANA } from '../data/geo';
import { Arrow, C, Chip, CountUp, F, Footer, Kicker, PAD, Paper, Scene, Tag, useIn, usePop, Wordmark } from './kit';

const SCENES: [string, number, React.FC<{ dur: number }>][] = [
  ['hook', 150, Hook],
  ['backstory', 135, Backstory],
  ['map', 180, MapScene],
  ['income', 120, Income],
  ['multiple', 120, Multiple],
  ['state', 120, StateGrowth],
  ['it', 180, ITEngine],
  ['pharma', 135, Pharma],
  ['inside', 105, Inside],
  ['stamp', 105, Stamp],
  ['cta', 180, CTA],
];

export const RANGA_REDDY_FRAMES = SCENES.reduce((s, [, d]) => s + d, 0);

export const RangaReddy: React.FC = () => {
  let from = 0;
  return (
    <Paper>
      <Kicker text="NOT A VC · TELANGANA · 2026 DATA" />
      {SCENES.map(([name, dur, Comp]) => {
        const seq = (
          <Sequence key={name} name={name} from={from} durationInFrames={dur}>
            <Scene dur={dur}><Comp dur={dur} /></Scene>
          </Sequence>
        );
        from += dur;
        return seq;
      })}
      <Footer source="SOURCE · TELANGANA SOCIO-ECONOMIC OUTLOOK 2026 · PHARMEXCIL" />
    </Paper>
  );
};

const Center: React.FC<{ children: React.ReactNode; top?: number; gap?: number }> = ({ children, top = 300, gap = 0 }) => (
  <div style={{ position: 'absolute', top, left: PAD, right: PAD, bottom: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap }}>
    {children}
  </div>
);

const Label: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 56, color = C.ink }) => (
  <div style={{ fontFamily: F.body, fontWeight: 600, fontSize: size, color, letterSpacing: -0.5 }}>{children}</div>
);

const Sub: React.FC<{ children: React.ReactNode; size?: number }> = ({ children, size = 44 }) => (
  <div style={{ fontFamily: F.body, fontWeight: 400, fontSize: size, color: C.muted }}>{children}</div>
);

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string }> = ({ children, size = 300, color = C.crimson }) => (
  <div style={{ fontFamily: F.display, fontSize: size, lineHeight: 1, color, letterSpacing: -2, whiteSpace: 'nowrap' }}>{children}</div>
);

function Hook() {
  const a = useIn(4, 16);
  const b = useIn(26, 16);
  const box = useIn(48, 20);
  const sub = useIn(80, 18);
  return (
    <Center gap={10}>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px)`, fontFamily: F.display, fontSize: 120, lineHeight: 1.05, color: C.ink }}>ONCE</div>
      <div style={{ opacity: b, transform: `translateY(${(1 - b) * 30}px)`, fontFamily: F.display, fontSize: 116, lineHeight: 1.05, color: C.ink }}>“HYDERABAD RURAL.”</div>
      <div style={{ marginTop: 34, background: C.crimson, padding: '28px 44px 34px', clipPath: `inset(0 ${(1 - box) * 100}% 0 0)` }}>
        <div style={{ fontFamily: F.display, fontSize: 168, lineHeight: 1.02, color: C.white }}>NOW INDIA’S<br />RICHEST<br />DISTRICT.</div>
      </div>
      <div style={{ marginTop: 40, opacity: sub }}><Sub size={46}>Ranga Reddy, Telangana</Sub></div>
    </Center>
  );
}

function Backstory() {
  const t = useIn(0, 14);
  const n = useIn(18, 14);
  const stamp = usePop(70);
  return (
    <Center gap={18}>
      <div style={{ opacity: t }}><Big size={230} color={C.ink}>2006</Big></div>
      <div style={{ opacity: t }}><Label size={58}>Ranga Reddy was on<br />India’s list of the</Label></div>
      <div style={{ opacity: n, transform: `scale(${0.85 + 0.15 * n})` }}><Big size={330}><CountUp to={250} delay={18} dur={30} /></Big></div>
      <div style={{ opacity: n }}><Label size={64} color={C.crimson}>most backward districts.</Label></div>
      <div style={{ marginTop: 40, transform: `rotate(-4deg) scale(${2 - stamp})`, opacity: Math.min(1, stamp * 2) }}>
        <TapeLabel lines={['2006: “BACKWARD”']} />
      </div>
    </Center>
  );
}

const TapeLabel: React.FC<{ lines: React.ReactNode[]; size?: number }> = ({ lines, size = 48 }) => (
  <div style={{ background: C.tape, padding: '26px 40px', borderRadius: 6, boxShadow: '0 6px 0 rgba(11,11,11,.12)', fontFamily: F.mono, fontWeight: 700, fontSize: size, letterSpacing: 4, color: C.ink, textAlign: 'left', lineHeight: 1.5 }}>
    {lines.map((l, i) => <div key={i}>{l}</div>)}
  </div>
);

function MapScene() {
  const frame = useCurrentFrame();
  const MAP_W = 880;
  const s = MAP_W / TELANGANA.width;
  const rr = TELANGANA.districts.find((d) => d.name === 'Ranga Reddy')!;
  const hyd = TELANGANA.districts.find((d) => d.name === 'Hyderabad')!;
  const fill = useIn(46, 20);
  const hydTag = usePop(70);
  const rrTag = usePop(82);
  const inset = usePop(100);
  const zoom = interpolate(frame, [96, 180], [1, 1.1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad) });
  const head = useIn(0, 14);
  const maxDist = 900;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 300, left: 0, right: 0, textAlign: 'center', opacity: head }}>
        <Label size={60}>Here’s what it looks like in 2026.</Label>
      </div>
      <div style={{ position: 'absolute', top: 430, left: (1080 - MAP_W) / 2, width: MAP_W, height: TELANGANA.height * s, transform: `scale(${zoom})`, transformOrigin: `${rr.cx * s}px ${rr.cy * s}px` }}>
        <svg width={MAP_W} height={TELANGANA.height * s} viewBox={`0 0 ${TELANGANA.width} ${TELANGANA.height}`}>
          {TELANGANA.districts.map((d) => {
            const dist = Math.hypot(d.cx - rr.cx, d.cy - rr.cy);
            const o = interpolate(frame, [4 + (dist / maxDist) * 34, 18 + (dist / maxDist) * 34], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const isRR = d === rr;
            const isHyd = d === hyd;
            const color = isRR ? mix(C.sand, C.crimson, fill) : isHyd ? mix(C.sand, C.bronze, fill) : C.sand;
            return (
              <path key={d.name} d={d.d} fill={color} opacity={o}
                stroke={C.paper} strokeWidth={1.8} strokeLinejoin="round" />
            );
          })}
          {/* Hyderabad and Ranga Reddy on top so their outlines are not covered */}
          <path d={rr.d} fill="none" stroke={C.ink} strokeWidth={3 * fill} strokeLinejoin="round" />
          <path d={hyd.d} fill="none" stroke={C.ink} strokeWidth={3 * fill} strokeLinejoin="round" />
        </svg>
        <div style={{ position: 'absolute', left: hyd.cx * s, top: hyd.cy * s - 120, transform: `translateX(-50%) scale(${hydTag})` }}>
          <Tag size={46}>HYDERABAD</Tag>
        </div>
        <div style={{ position: 'absolute', left: rr.cx * s, top: rr.cy * s + 90, transform: `translateX(-50%) scale(${rrTag})` }}>
          <Tag size={46} bg={C.crimson}>RANGA REDDY</Tag>
        </div>
      </div>
      <div style={{ position: 'absolute', right: PAD, top: 1300, transform: `scale(${inset})`, transformOrigin: 'bottom right', background: C.white, border: `1.5px solid ${C.hairline}`, borderRadius: 20, padding: '24px 24px 18px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <svg width={190} height={190 * INDIA_INSET.height / INDIA_INSET.width} viewBox={`0 0 ${INDIA_INSET.width} ${INDIA_INSET.height}`}>
          <path d={INDIA_INSET.india} fill={C.sand} stroke={C.sand} strokeWidth={1} />
          <path d={INDIA_INSET.telangana} fill={C.crimson} stroke={C.crimson} strokeWidth={1} />
        </svg>
        <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 16, letterSpacing: 3, color: C.muted }}>TELANGANA IN INDIA</div>
      </div>
    </AbsoluteFill>
  );
}

function Income() {
  const chip = usePop(44);
  return (
    <Center gap={24}>
      <Label>Income per person</Label>
      <Big size={250}><CountUp to={11.3} decimals={2} prefix="₹" suffix=" L" delay={6} /></Big>
      <div style={{ marginTop: 20, transform: `scale(${chip})` }}><Tag size={56} bg={C.ink}>NO.1 IN TELANGANA</Tag></div>
    </Center>
  );
}

function Multiple() {
  const bars = useIn(30, 30);
  const BAR = 936;
  const row = (label: string, value: string, w: number, color: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, width: BAR }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontFamily: F.mono, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: C.ink }}>
        <span>{label}</span><span>{value}</span>
      </div>
      <div style={{ height: 64, width: w * bars, background: color, borderRadius: 8 }} />
    </div>
  );
  return (
    <Center gap={30}>
      <Big size={420}><CountUp to={5.1} decimals={1} suffix="X" delay={4} dur={30} /></Big>
      <Label size={54}>India’s average of ₹2.20 L</Label>
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 34 }}>
        {row('RANGA REDDY', '₹11.30 L', BAR, C.crimson)}
        {row('INDIA AVERAGE', '₹2.20 L', BAR * (2.2 / 11.3), C.ink)}
      </div>
    </Center>
  );
}

function StateGrowth() {
  const arrow = useIn(26, 16);
  const second = useIn(36, 16);
  const badge = usePop(60);
  const bars = useIn(10, 40);
  const MAXH = 480;
  return (
    <Center gap={26}>
      <Label>Telangana, per person</Label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <Big size={170} color={C.ink}>₹1.24L</Big>
        <Arrow width={110} progress={arrow} />
        <div style={{ opacity: second }}><Big size={170}>₹4.19L</Big></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 90, height: MAXH + 70, marginTop: 30, position: 'relative' }}>
        {[['2014', 1.24, C.ink], ['2026', 4.19, C.crimson]].map(([y, v, c]) => (
          <div key={y as string} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 200, height: (MAXH * (v as number) / 4.19) * bars, background: c as string, borderRadius: '10px 10px 0 0' }} />
            <div style={{ fontFamily: F.mono, fontWeight: 700, fontSize: 34, letterSpacing: 2 }}>{y}</div>
          </div>
        ))}
        <div style={{ position: 'absolute', right: -200, top: 0, transform: `scale(${badge}) rotate(-6deg)` }}>
          <div style={{ width: 190, height: 190, borderRadius: 999, background: C.bronze, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.display, fontSize: 80, color: C.white }}>3.4x</div>
        </div>
      </div>
    </Center>
  );
}

function ITEngine() {
  const rows: [string, React.ReactNode, string | null, string][] = [
    ['IT exports, FY25', <CountUp to={3.13} decimals={2} prefix="₹" suffix=" L CR" delay={4} />, 'up 16.6% in a year', C.crimson],
    ['People in IT jobs', <CountUp to={9.39} decimals={2} suffix=" LAKH" delay={34} />, null, C.ink],
    ['IT companies in Hyderabad', <CountUp to={1500} suffix="+" delay={64} />, null, C.ink],
  ];
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', top: 310, left: PAD, right: PAD, display: 'flex', flexDirection: 'column', gap: 46 }}>
        {rows.map(([label, value, note, color], i) => (
          <StatRow key={label} label={label} value={value} note={note} color={color} delay={i * 30} />
        ))}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 22, justifyContent: 'center', marginTop: 10 }}>
          {['Google', 'Microsoft', 'Amazon', 'Meta'].map((n, i) => <Chip key={n} delay={100 + i * 6} size={50}>{n}</Chip>)}
        </div>
      </div>
    </AbsoluteFill>
  );
}

const StatRow: React.FC<{ label: string; value: React.ReactNode; note: string | null; color: string; delay: number }> = ({ label, value, note, color, delay }) => {
  const o = useIn(delay, 14);
  return (
    <div style={{ opacity: o, transform: `translateX(${(1 - o) * -60}px)`, borderBottom: `1.5px solid ${C.hairline}`, paddingBottom: 30 }}>
      <Label size={46}>{label}</Label>
      <Big size={180} color={color}>{value}</Big>
      {note && <div style={{ marginTop: 10 }}><Sub size={38}>{note}</Sub></div>}
    </div>
  );
};

function Pharma() {
  const frame = useCurrentFrame();
  const CELL = 52;
  const GAP = 8;
  return (
    <Center gap={22}>
      <Label>Pharma exports, FY25</Label>
      <Big size={300}><CountUp to={5.9} decimals={1} prefix="$" suffix=" B" delay={4} /></Big>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(20, ${CELL * 0.7}px)`, gap: GAP * 0.75, marginTop: 20 }}>
        {Array.from({ length: 100 }, (_, i) => {
          const on = i < 19;
          const o = interpolate(frame, [30 + i * 0.5, 36 + i * 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <div key={i} style={{ width: CELL * 0.7, height: CELL * 0.7, borderRadius: 5, background: on ? C.crimson : C.sand, opacity: o }} />;
        })}
      </div>
      <Label size={52} color={C.crimson}>19% of India’s</Label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', marginTop: 16 }}>
        {['Dr. Reddy’s', 'Novartis', 'Bharat Biotech', 'Aurobindo'].map((n, i) => <Chip key={n} delay={80 + i * 6} size={44}>{n}</Chip>)}
      </div>
    </Center>
  );
}

function Inside() {
  return (
    <Center gap={26}>
      <Label size={64}>Inside the district</Label>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, marginTop: 20 }}>
        {['ISB', 'IIIT Hyderabad', 'Univ. of Hyderabad', 'Shamshabad Airport'].map((n, i) => <Chip key={n} delay={10 + i * 10} size={78}>{n}</Chip>)}
      </div>
    </Center>
  );
}

function Stamp() {
  const frame = useCurrentFrame();
  const strike = useIn(30, 12);
  const line2 = Math.floor(interpolate(frame, [44, 64], [0, 10], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  const pop = usePop(0);
  return (
    <Center>
      <div style={{ transform: `rotate(-3deg) scale(${0.7 + 0.3 * pop})` }}>
        <div style={{ background: C.tape, padding: '50px 64px', borderRadius: 8, boxShadow: '0 10px 0 rgba(11,11,11,.12)', fontFamily: F.mono, fontWeight: 700, fontSize: 70, letterSpacing: 5, color: C.ink, textAlign: 'left', lineHeight: 1.6 }}>
          <div>2006: <span style={{ position: 'relative' }}>“BACKWARD”
            <span style={{ position: 'absolute', left: 0, top: '52%', height: 9, width: `${strike * 100}%`, background: C.crimson }} />
          </span></div>
          <div style={{ color: C.crimson }}>{'2026: NO.1'.slice(0, line2)}<span style={{ opacity: line2 < 10 ? 1 : 0 }}>_</span></div>
        </div>
      </div>
    </Center>
  );
}

function CTA() {
  const card = useIn(0, 16);
  const opts: [string, string][] = [['A', 'KOKAPET'], ['B', 'FUTURE CITY'], ['C', 'SHAMSHABAD'], ['D', 'YOUR AREA']];
  const ask = useIn(70, 16);
  return (
    <Center gap={40}>
      <div style={{ opacity: card, transform: `translateY(${(1 - card) * 60}px)`, background: C.ink, borderRadius: 36, padding: '56px 52px', width: 936, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div style={{ fontFamily: F.display, fontSize: 104, lineHeight: 1.02, textAlign: 'left', marginBottom: 18 }}>
          <div style={{ color: C.white }}>HYDERABAD’S NEXT</div>
          <div style={{ color: C.bronze }}>MONEY SPOT?</div>
        </div>
        {opts.map(([k, v], i) => <Option key={k} letter={k} text={v} highlight={k === 'D'} delay={18 + i * 8} />)}
      </div>
      <div style={{ opacity: ask, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
        <Label size={54}>Comment A, B, C or D.</Label>
        <Wordmark size={84} />
      </div>
    </Center>
  );
}

const Option: React.FC<{ letter: string; text: string; highlight: boolean; delay: number }> = ({ letter, text, highlight, delay }) => {
  const p = usePop(delay);
  return (
    <div style={{ transform: `scale(${0.8 + 0.2 * p})`, opacity: Math.min(1, p * 1.5), display: 'flex', alignItems: 'center', gap: 30, background: highlight ? C.crimson : '#1F1C1A', borderRadius: 18, padding: '24px 34px', fontFamily: F.display, fontSize: 64, lineHeight: 1 }}>
      <span style={{ color: highlight ? C.white : C.bronze }}>{letter}</span>
      <span style={{ color: C.white }}>{text}</span>
    </div>
  );
};

// Linear blend between two #rrggbb colors
function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',')})`;
}
