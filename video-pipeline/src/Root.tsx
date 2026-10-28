import { Composition } from 'remotion';
import { FramedShort, FramedShortProps } from './FramedShort';

const FPS = 30;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FramedShort"
    component={FramedShort}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={FPS * 10}
    defaultProps={{
      videoSrc: '_work/test-clip-10s.mp4',
      captions: [],
      durationInSeconds: 10,
      sourceWidth: 1920,
      sourceHeight: 1080,
      label: 'NotAVC',
      kicker: 'RAW CUT',
    } satisfies FramedShortProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: Math.max(1, Math.round(props.durationInSeconds * FPS)),
    })}
  />
);
