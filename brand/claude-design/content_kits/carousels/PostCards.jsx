function PostCard({ label, stat, statLabel, tags }) {
  return (
    <Card padding={28}>
      <div style={{ width: 260, aspectRatio: '1/1', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, color: 'var(--signal)', letterSpacing: 1 }}>{label}</div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 48, color: 'var(--ink)', letterSpacing: -2, lineHeight: 1 }}>{stat}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.4 }}>{statLabel}</div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>{tags.map((t, i) => <Tag key={i}>{t}</Tag>)}</div>
      </div>
    </Card>
  );
}
function QuoteCard({ quote, name }) {
  return (
    <Card padding={24}>
      <div style={{ width: 380, aspectRatio: '1.91/1', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 10, color: 'var(--signal)', letterSpacing: 2 }}>NOTAVC</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', lineHeight: 1.4, letterSpacing: -0.2 }}>"{quote}"</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--muted)' }}>
          <span>{name}</span><span style={{ fontFamily: 'var(--font-data)', fontSize: 10 }}>@notavc</span>
        </div>
      </div>
    </Card>
  );
}
function ThreadCard({ text }) {
  return (
    <Card padding={24}>
      <div style={{ width: 260, aspectRatio: '1/1', display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 9, color: 'var(--signal)', letterSpacing: 1 }}>NOTAVC · THREAD</div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--ink)', textAlign: 'center', lineHeight: 1.4 }}>{text}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>1/7</div>
      </div>
    </Card>
  );
}
window.PostCard = PostCard; window.QuoteCard = QuoteCard; window.ThreadCard = ThreadCard;
