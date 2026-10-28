/** A number/valuation/percentage rendered in Space Mono — the "quant signal" applied to every metric in NotAVC content. */
export interface DataMetricProps {
  /** The value string to render, e.g. "$5.2B", "70%", "₹4,200Cr". */
  value: string;
  /** Color semantic: positive (Info blue), negative (Coral), neutral (Signal/Mint). Default 'neutral'. */
  sentiment?: 'positive' | 'negative' | 'neutral';
  /** Use Mint instead of Signal for neutral on dark surfaces. Default false. */
  dark?: boolean;
  /** 'lg' for hero stats, 'sm' for inline data-row values. Default 'lg'. */
  size?: 'sm' | 'lg';
}
export function DataMetric(props: DataMetricProps): JSX.Element;
