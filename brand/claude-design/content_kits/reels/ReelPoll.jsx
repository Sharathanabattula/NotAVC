function ReelPoll({ ep, question, options, highlight }) {
  return (
    <ReelFrame variant="poll" ep={ep}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 26, gap: 22 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>{question}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map((o, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-body)', fontSize: 12, textAlign: 'center', padding: '10px 14px', borderRadius: 'var(--radius-md)',
              color: i === highlight ? 'var(--mint)' : 'var(--white-45)',
              background: i === highlight ? 'transparent' : 'var(--white-08)',
              border: i === highlight ? '0.5px solid var(--mint)' : '0.5px solid var(--white-10)'
            }}>{o}</div>
          ))}
        </div>
      </div>
    </ReelFrame>
  );
}
window.ReelPoll = ReelPoll;
