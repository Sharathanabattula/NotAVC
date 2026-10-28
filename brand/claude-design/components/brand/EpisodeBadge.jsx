import React from 'react';
export function EpisodeBadge({ number = 1, dark = false }) {
  const n = String(number).padStart(3, '0');
  return React.createElement('div', { style: { fontFamily: 'var(--font-data)', fontSize: 11, letterSpacing: 1, color: dark ? 'var(--white-35)' : 'var(--muted)' } }, 'EP.' + n);
}
