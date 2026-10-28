function ReelFrame({ variant, ep, children }) {
  const bgMap = { story: 'linear-gradient(180deg,#0B0B0B 0%,#1A1A2E 100%)', data: '#0B0B0B', news: '#0B0B0B', poll: 'linear-gradient(180deg,#0B0B0B 0%,#1A1A2E 100%)' };
  return (
    <div style={{ width: 320, aspectRatio: '9/16', borderRadius: 20, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', background: bgMap[variant], fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-lg)' }}>
      {variant !== 'news' && (
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, color: '#fff', background: 'var(--white-10)', padding: '4px 10px', borderRadius: 'var(--radius-pill)', letterSpacing: 0.5, backdropFilter: 'blur(6px)' }}>NotAVC</div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: 'var(--white-35)', letterSpacing: 1 }}>EP.{String(ep).padStart(3, '0')}</div>
        </div>
      )}
      {children}
    </div>
  );
}
window.ReelFrame = ReelFrame;
