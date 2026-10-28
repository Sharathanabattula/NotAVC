import React from 'react';
const sentimentColor = { positive: 'var(--info)', negative: 'var(--coral)', neutral: 'var(--signal)' };
export function DataMetric({ value, sentiment = 'neutral', dark = false, size = 'lg' }) {
  const color = dark && sentiment === 'neutral' ? 'var(--mint)' : sentimentColor[sentiment];
  return React.createElement('div', { style: {
    fontFamily: 'var(--font-data)', fontWeight: size === 'lg' ? 700 : 500,
    fontSize: size === 'lg' ? 44 : 14, letterSpacing: size === 'lg' ? -1.5 : 0, color, lineHeight: 1
  } }, value);
}
