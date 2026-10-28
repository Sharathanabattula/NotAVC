import React from 'react';
export function Card({ children, padding = 20 }) {
  return React.createElement('div', { style: {
    background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', border: 'var(--border-default-w)', padding
  } }, children);
}
