import React from 'react';
export function Wordmark({ variant = 'light', tagline = false, size = 32 }) {
  const bg = variant === 'dark' ? 'var(--ink)' : variant === 'accent' ? 'var(--signal)' : 'transparent';
  const notOpacity = variant === 'accent' ? 0.55 : 0.35;
  const color = variant === 'light' ? 'var(--ink)' : '#fff';
  return React.createElement('div', { style: { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: bg, padding: bg === 'transparent' ? 0 : '10px 20px', borderRadius: 'var(--radius-md)' } },
    React.createElement('div', { style: { fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size, letterSpacing: -size * 0.03 } },
      React.createElement('span', { style: { color, opacity: notOpacity } }, 'Not'),
      React.createElement('span', { style: { color } }, 'AVC')
    ),
    tagline && React.createElement('div', { style: { fontFamily: 'var(--font-data)', fontWeight: 500, fontSize: size * 0.18, letterSpacing: 2, color, opacity: 0.45 } }, 'VENTURE INTELLIGENCE FOR EVERYONE')
  );
}
