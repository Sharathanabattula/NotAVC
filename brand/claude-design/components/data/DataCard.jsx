import React from 'react';
export function DataCard({ rows = [] }) {
  return React.createElement('div', { style: {
    background: 'var(--white-06)', border: '0.5px solid var(--white-08)', borderRadius: 'var(--radius-lg)', padding: 16
  } }, rows.map((r, i) => React.createElement('div', { key: i, style: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: i === rows.length - 1 ? 0 : 8
  } },
    React.createElement('div', { style: { fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--white-45)' } }, r.label),
    React.createElement('div', { style: {
      fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 14,
      color: r.sentiment === 'positive' ? 'var(--mint)' : r.sentiment === 'negative' ? 'var(--coral)' : '#fff'
    } }, r.value)
  )));
}
