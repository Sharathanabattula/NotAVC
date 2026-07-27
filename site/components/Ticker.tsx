import { TICKER_TERMS } from "@/lib/content";

function Row() {
  return (
    <span className="flex shrink-0 items-center">
      {TICKER_TERMS.map((term) => (
        <span key={term} className="voice-data flex items-center text-xs tracking-[0.18em]">
          <span className="zone px-6 text-muted">{term}</span>
          <span className="zone text-crimson">·</span>
        </span>
      ))}
    </span>
  );
}

export default function Ticker() {
  return (
    <div className="zone overflow-clip border-y border-rule py-3" aria-hidden>
      <div className="ticker-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
