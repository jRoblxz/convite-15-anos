import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { event } from "../config/event";
import { burst } from "../lib/confetti";

const balloons = ["b1", "b2", "b3", "b4", "b5", "vb"];

export default function Hero({ open, onOpen }: { open: boolean; onOpen: () => void }) {
  const [dy, setDy] = useState(0);
  const [popped, setPopped] = useState<string[]>([]);
  const start = useRef<number | null>(null);

  const down = (e: PointerEvent) => {
    start.current = e.clientY;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (start.current !== null) setDy(Math.max(0, Math.min(110, e.clientY - start.current)));
  };
  const up = () => {
    if (dy > 70 && !open) onOpen();
    start.current = null;
    setDy(0);
  };

  return (
    <header className={"hero" + (open ? " open" : "")}>
      {balloons.map((b) => (
        <button
          key={b}
          aria-label="Estourar balão"
          className={`balloon ${b}${popped.includes(b) ? " pop" : ""}`}
          onClick={(e) => { burst(e.clientX, e.clientY); setPopped((p) => [...p, b]); }}
        />
      ))}
      <div className="arch">
        <div className="door l" />
        <div className="door r" />
        <div className="sign">
          <h1 className="neon">{event.celebrantName}</h1>
          <p className="foil">15 anos</p>
        </div>
      </div>
      {!open && (
        <>
          <div
            className="cord"
            style={{ height: 90 + dy }}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          >
            <span className="bulb" />
          </div>
          <p className="hint">Puxe o cordão para abrir</p>
          <button className="btn ghost" onClick={onOpen}>Abrir convite</button>
        </>
      )}
    </header>
  );
}
