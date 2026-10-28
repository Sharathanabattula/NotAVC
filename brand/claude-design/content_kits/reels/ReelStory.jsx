function ReelStory({ ep, hook, highlight, stat, statLabel, sub }) {
  return (
    <ReelFrame variant="story" ep={ep}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 26, textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: '#fff', lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 14 }}>
          {hook} <span style={{ color: 'var(--mint)' }}>{highlight}</span>
        </div>
        {stat && <div style={{ fontFamily: 'var(--font-data)', fontWeight: 600, fontSize: 40, color: 'var(--mint)', letterSpacing: -2, margin: '4px 0' }}>{stat}</div>}
        {statLabel && <div style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--white-35)', letterSpacing: 1, marginBottom: 16 }}>{statLabel}</div>}
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--white-45)', lineHeight: 1.5 }}>{sub}</div>
      </div>
      <div style={{ padding: '14px 26px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: 'var(--white-10)', letterSpacing: 1 }}>SWIPE UP</div>
        <div style={{ flex: 1, height: 2, background: 'var(--white-08)', borderRadius: 1 }}><div style={{ height: '100%', width: '35%', background: 'var(--mint)', borderRadius: 1 }}></div></div>
      </div>
    </ReelFrame>
  );
}
window.ReelStory = ReelStory;
