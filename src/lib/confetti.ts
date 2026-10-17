const COLORS = ["#C8A04A", "#EAD59A", "#D6E4FF", "#F7F8FC"];

export function burst(x: number, y: number, n = 24) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    const a = Math.random() * Math.PI * 2;
    const d = 60 + Math.random() * 120;
    Object.assign(s.style, {
      position: "fixed", left: x + "px", top: y + "px", width: "8px", height: "8px",
      borderRadius: i % 2 ? "50%" : "1px", background: COLORS[i % 4], pointerEvents: "none", zIndex: "20",
    });
    document.body.appendChild(s);
    s.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d + 80}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.22,1,.36,1)" },
    ).onfinish = () => s.remove();
  }
}
