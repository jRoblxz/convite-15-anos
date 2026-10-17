const stars = Array.from({ length: 16 }, (_, i) => {
  const r = (n: number) => { const s = Math.sin(i * 53.3 + n * 7.1) * 10000; return s - Math.floor(s); };
  return { left: r(1) * 100, top: r(2) * 100, size: 8 + r(3) * 16, delay: r(4) * 5, dur: 3 + r(5) * 3 };
});

export default function Stars() {
  return (
    <div className="stars" aria-hidden="true">
      {stars.map((s, i) => (
        <span key={i} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }} />
      ))}
    </div>
  );
}
