// Vertical 9:16 short: source clip framed on the dark Reel surface, word-by-word captions below.
// Layout follows brand/claude-design/content_kits/reels (brand pill top-left, label top-right,
// progress bar at the bottom) at 1080x1920.
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Caption, createTikTokStyleCaptions } from '@remotion/captions';
import { color, font } from './brand';

export type FramedShortProps = {
  videoSrc: string; // path inside public/
  captions: Caption[];
  durationInSeconds: number;
  sourceWidth: number;
  sourceHeight: number;
  label: string;
  kicker: string;
};

const PAD = 48;
const FRAME_W = 1080 - PAD * 2;
const MAX_FRAME_H = 1180;
const CAPTION_H = 320;

export const FramedShort: React.FC<FramedShortProps> = ({
  videoSrc, captions, sourceWidth, sourceHeight, label, kicker,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const nowMs = (frame / fps) * 1000;

  const frameH = Math.min(MAX_FRAME_H, Math.round((FRAME_W * sourceHeight) / sourceWidth));
  // Centre frame + caption block; the caption area sits below the frame
  const frameTop = Math.max(180, Math.round((1920 - frameH - CAPTION_H) / 2));
  const { pages } = createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 900 });
  const page = pages.find((p) => nowMs >= p.startMs && nowMs < p.startMs + p.durationMs);

  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${color.ink} 0%, ${color.deep} 100%)` }}>
      <div style={{ position: 'absolute', top: PAD, left: PAD, right: PAD, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, color: color.white, background: color.white10, padding: '12px 30px', borderRadius: 9999, letterSpacing: 1.5 }}>
          {label}
        </div>
        <div style={{ fontFamily: font.data, fontSize: 24, color: color.white35, letterSpacing: 3 }}>{kicker}</div>
      </div>

      <div style={{ position: 'absolute', top: frameTop, left: PAD, width: FRAME_W, height: frameH, borderRadius: 16, overflow: 'hidden', border: `1.5px solid ${color.white10}` }}>
        <OffthreadVideo src={staticFile(videoSrc)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{ position: 'absolute', top: frameTop + frameH + 72, left: PAD, right: PAD, textAlign: 'center' }}>
        {page && (
          <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 76, lineHeight: 1.15, letterSpacing: -1.5, color: color.white, whiteSpace: 'pre-wrap' }}>
            {page.tokens.map((t, i) => {
              const active = nowMs >= t.fromMs && nowMs < t.toMs;
              return (
                <span key={i} style={{ color: active ? color.bronze : color.white }}>
                  {t.text}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 72, left: PAD, right: PAD, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ fontFamily: font.data, fontSize: 22, color: color.white35, letterSpacing: 3 }}>NOTAVC</div>
        <div style={{ flex: 1, height: 6, background: color.white08, borderRadius: 3 }}>
          <div style={{ height: '100%', width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`, background: color.bronze, borderRadius: 3 }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
