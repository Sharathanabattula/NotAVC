import React from 'react';
export function Tag({ children }) {
  return React.createElement('span', { style: {
    display: 'inline-block', fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--signal)',
    background: 'var(--signal-08)', padding: '3px 8px', borderRadius: 'var(--radius-sm)'
  } }, children);
}
