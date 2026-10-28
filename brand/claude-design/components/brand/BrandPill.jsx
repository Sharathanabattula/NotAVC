import React from 'react';
export function BrandPill({ label = 'NotAVC', dark = true }) {
  return React.createElement('div', { style: {
    display: 'inline-block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9,
    color: dark ? '#fff' : 'var(--ink)', background: dark ? 'var(--white-10)' : 'var(--signal-08)',
    padding: '4px 10px', borderRadius: 'var(--radius-pill)', backdropFilter: 'blur(6px)', letterSpacing: 0.5
  } }, label);
}
