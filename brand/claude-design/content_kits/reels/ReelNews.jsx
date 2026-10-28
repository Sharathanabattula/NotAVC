function ReelNews({ ep, category, headline, body, ticker }) {
  return (
    <ReelFrame variant="news" ep={ep}>
      <div style={{ background: 'var(--coral)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }}></div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: '#fff', letterSpacing: 1 }}>FUNDING ALERT</div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: 'var(--white-45)', marginLeft: 'auto' }}>2 HRS AGO</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 22 }}>
        <Tag>{category}</Tag>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: '#fff', lineHeight: 1.2, letterSpacing: -0.3, margin: '14px 0' }}>{headline}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--white-45)', lineHeight: 1.6, flex: 1 }}>{body}</div>
      </div>
      <div style={{ background: 'var(--white-06)', borderTop: '0.5px solid var(--white-06)', padding: '10px 16px', display: 'flex', gap: 18, overflow: 'hidden' }}>
        {ticker.map((t, i) => <div key={i} style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: 'var(--white-45)', whiteSpace: 'nowrap' }}>{t.name} <span style={{ color: t.up ? 'var(--mint)' : 'var(--coral)' }}>{t.up ? '+' : ''}{t.change}</span></div>)}
      </div>
      <div style={{ padding: '10px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Wordmark variant="dark" size={13} />
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: 'var(--white-35)', letterSpacing: 0.5 }}>SOURCE: INC42</div>
      </div>
    </ReelFrame>
  );
}
window.ReelNews = ReelNews;
