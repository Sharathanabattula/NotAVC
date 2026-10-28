function ReelData({ ep, kicker, headline, rows }) {
  return (
    <ReelFrame variant="data" ep={ep}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 26 }}>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: 'var(--mint)', letterSpacing: 2, marginBottom: 12 }}>{kicker}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: '#fff', lineHeight: 1.15, letterSpacing: -0.5, marginBottom: 18 }}>{headline}</div>
        <DataCard rows={rows} />
      </div>
      <div style={{ padding: '14px 26px', borderTop: '0.5px solid var(--white-06)' }}>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--white-45)', lineHeight: 1.5, textAlign: 'center' }}>The math: most bets don't work. The survivors carry the fund.</div>
      </div>
    </ReelFrame>
  );
}
window.ReelData = ReelData;
