/** NotAVC wordmark — "Not" renders at reduced opacity, "AVC" at full weight. */
export interface WordmarkProps {
  /** Background/text treatment. Default 'light'. */
  variant?: 'light' | 'dark' | 'accent';
  /** Show the "VENTURE INTELLIGENCE FOR EVERYONE" tagline. Default false. */
  tagline?: boolean;
  /** Font size in px for the "AVC" text. Default 32. */
  size?: number;
}
export function Wordmark(props: WordmarkProps): JSX.Element;
