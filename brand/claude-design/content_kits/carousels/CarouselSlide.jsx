function CarouselSlide({ variant, num, total, children }) {
  const bgMap = { white: 'var(--paper)', dark: 'var(--ink)', canvas: 'var(--canvas-2)', cta: 'linear-gradient(135deg,var(--signal),#4a000e)' };
  const numColor = variant === 'white' || variant === 'canvas' ? '#bbb' : 'var(--white-10)';
  const brandColor = variant === 'dark' ? 'var(--mint)' : variant === 'cta' ? '#fff' : 'var(--signal)';
  const dotInactive = variant === 'dark' ? 'var(--white-08)' : variant === 'cta' ? 'var(--white-10)' : '#ddd';
  const dotActive = variant === 'dark' ? 'var(--mint)' : variant === 'cta' ? '#fff' : 'var(--signal)';
  const borderTop = variant === 'dark' ? '0.5px solid var(--white-06)' : variant === 'cta' ? '0.5px solid var(--white-10)' : '0.5px solid var(--hairline)';
  return (
    <div style={{ width: 300, aspectRatio: '4/5', borderRadius: 16, overflow: 'hidden', border: 'var(--border-default-w)', background: bgMap[variant], display: 'flex', flexDirection: 'column', position: 'relative', flexShrink: 0, fontFamily: 'var(--font-body)' }}>
      <div style={{ position: 'absolute', top: 14, right: 14, fontFamily: 'var(--font-data)', fontSize: 9, color: numColor, letterSpacing: 1 }}>{String(num).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
      <div style={{ flex: 1, padding: '24px 22px 12px', display: 'flex', flexDirection: 'column' }}>{children}</div>
      <div style={{ padding: '10px 22px', borderTop, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 9, color: brandColor, letterSpacing: 0.5 }}>NotAVC</div>
        <DotIndicator count={total} active={num - 1} dark={variant !== 'white' && variant !== 'canvas'} />
      </div>
    </div>
  );
}
window.CarouselSlide = CarouselSlide;
