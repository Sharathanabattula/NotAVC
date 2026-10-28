/** Dark data-row table used in faceless Reels (Ahmed's Business overlay style) to show fund math, cap tables, unit economics. */
export interface DataCardRow {
  label: string;
  value: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}
export interface DataCardProps {
  rows: DataCardRow[];
}
export function DataCard(props: DataCardProps): JSX.Element;
