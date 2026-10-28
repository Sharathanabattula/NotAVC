/** Generic light-surface card — hairline border, 12px radius, no shadow. The base surface for posts, quote cards and slide previews. */
export interface CardProps {
  children: React.ReactNode;
  /** Padding in px. Default 20. */
  padding?: number;
}
export function Card(props: CardProps): JSX.Element;
