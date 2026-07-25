import { TICKER_TERMS } from "@/lib/content";

function Row() {
  return (
    <span className="flex shrink-0 items-center">
      {TICKER_TERMS.map((term) => (
        <span key={term} className="voice-data flex items-center text-xs tracking-[0.18em]">
          <span className="pal px-6 text-muted">{term}</span>
          <span className="pal text-accent">·</span>
        </span>
      ))}
    </span>
  );
}

export default function Ticker() {
  return (
    <div className="pal overflow-clip border-y border-line py-3" aria-hidden>
      <div className="ticker-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
