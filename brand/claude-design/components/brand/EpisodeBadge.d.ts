/** Sequential episode number in Space Mono — appears on every piece of NotAVC content, cross-platform. */
export interface EpisodeBadgeProps {
  /** Episode number, zero-padded to 3 digits. */
  number: number | string;
  /** Use dimmed-white styling for dark backgrounds (Reels, Stories). Default false. */
  dark?: boolean;
}
export function EpisodeBadge(props: EpisodeBadgeProps): JSX.Element;
