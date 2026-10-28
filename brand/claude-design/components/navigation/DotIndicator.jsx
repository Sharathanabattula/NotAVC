import React from 'react';
export function DotIndicator({ count = 7, active = 0, dark = false }) {
  return React.createElement('div', { style: { display: 'flex', gap: 4 } },
    Array.from({ length: count }).map((_, i) => React.createElement('div', {
      key: i, style: {
        width: 5, height: 5, borderRadius: '50%',
        background: i === active ? 'var(--signal)' : dark ? 'var(--white-10)' : '#ddd'
      }
    }))
  );
}
