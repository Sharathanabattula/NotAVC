function Thumbnail({ kicker, title, highlight, stat, statLabel }) {
  return (
    <div style={{ width: 440, aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', position: 'relative', background: 'var(--ink)', fontFamily: 'var(--font-body)', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', background: 'linear-gradient(135deg,var(--signal) 0%,#4a000e 100%)' }}></div>
      <div style={{ position: 'absolute', inset: 0, padding: '22px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--mint)', letterSpacing: 2, marginBottom: 10 }}>{kicker}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, maxWidth: '55%' }}>
          {title} <span style={{ color: 'var(--mint)' }}>{highlight}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 14, left: 26, display: 'flex', alignItems: 'center', gap: 8, zIndex: 2 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--signal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 13, color: '#fff' }}>N</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: 'var(--white-45)' }}>NotAVC</div>
      </div>
      {stat && (
        <div style={{ position: 'absolute', bottom: 18, right: 26, textAlign: 'right', zIndex: 2 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: -1, lineHeight: 1 }}>{stat}</div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: 'var(--white-45)', letterSpacing: 0.5, marginTop: 4 }}>{statLabel}</div>
        </div>
      )}
    </div>
  );
}
window.Thumbnail = Thumbnail;
