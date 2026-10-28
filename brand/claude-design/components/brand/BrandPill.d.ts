/** Frosted brand pill used top-left on Reel/Story overlays. */
export interface BrandPillProps {
  /** Pill text. Default 'NotAVC'. */
  label?: string;
  /** Frosted-white-on-dark style (video overlays) vs signal-tinted light style. Default true. */
  dark?: boolean;
}
export function BrandPill(props: BrandPillProps): JSX.Element;
