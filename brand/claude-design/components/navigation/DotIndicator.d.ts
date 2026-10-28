/** Carousel slide-progress dots shown in the brand bar of every carousel slide. */
export interface DotIndicatorProps {
  /** Total slide count. Default 7. */
  count?: number;
  /** Zero-indexed active slide. Default 0. */
  active?: number;
  /** Use dark-surface inactive-dot color. Default false. */
  dark?: boolean;
}
export function DotIndicator(props: DotIndicatorProps): JSX.Element;
