import React from 'react';
export function Callout({ children }) {
  return React.createElement('div', { style: {
    background: 'var(--signal-08)', borderLeft: '2px solid var(--signal)', borderRadius: '0 var(--radius-md) var(--radius-md) 0',
    padding: '10px 14px'
  } }, React.createElement('div', { style: { fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.5, color: 'var(--signal)', fontWeight: 500 } }, children));
}
