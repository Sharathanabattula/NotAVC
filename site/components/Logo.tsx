export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`voice-display inline-flex items-baseline tracking-[-0.04em] ${className}`}
    >
      <span className="opacity-40">Not</span>
      <span>AVC</span>
      <span className="zone text-crimson">.</span>
    </span>
  );
}

export function Monogram({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-label="NotAVC monogram"
    >
      <rect width="96" height="96" rx="22" fill="#710014" />
      <path d="M28 70V26h10l20 30.5V26h10v44H58L38 39.5V70H28Z" fill="#e8e6e1" />
      <rect x="70" y="62" width="8" height="8" fill="#A6522F" />
    </svg>
  );
}
