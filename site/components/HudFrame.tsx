/*
  Fixed viewport brackets — the "terminal instrument" frame.
  Static, pointer-events-none, painted once. Zero scroll cost.
*/
export default function HudFrame() {
  const arm = "pointer-events-none fixed z-40 border-accent/45 pal hidden sm:block";
  return (
    <div aria-hidden>
      <span className={`${arm} left-3 top-3 h-5 w-5 border-l border-t`} />
      <span className={`${arm} right-3 top-3 h-5 w-5 border-r border-t`} />
      <span className={`${arm} bottom-3 left-3 h-5 w-5 border-b border-l`} />
      <span className={`${arm} bottom-3 right-3 h-5 w-5 border-b border-r`} />
    </div>
  );
}
