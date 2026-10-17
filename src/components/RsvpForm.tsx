import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import { event } from "../config/event";
import { saveRsvp } from "../services/rsvp";
import { burst } from "../lib/confetti";
import { Split } from "./Text";

const KEY = "rsvp-name";
const THUMB = 52;

function icsLink() {
  const d = new Date(event.dateISO);
  const f = (x: Date) => x.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const loc = [event.location.name, event.location.address].filter(Boolean).join(", ").replace(/,/g, "\\,");
  const t = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nDTSTART:${f(d)}\r\nDTEND:${f(new Date(d.getTime() + 4 * 36e5))}\r\nSUMMARY:15 anos da ${event.celebrantName}\r\nLOCATION:${loc}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
  return "data:text/calendar;charset=utf8," + encodeURIComponent(t);
}

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [done, setDone] = useState<string | null>(() => localStorage.getItem(KEY));
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">("idle");
  const [x, setX] = useState(0);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const track = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const d = new Date(event.dateISO);
  const guest = done ?? name.trim();

  const max = () => (track.current?.clientWidth ?? 300) - THUMB - 8;

  async function confirm() {
    if (name.trim().length < 2) { setStatus("empty"); return setX(0); }
    setStatus("loading");
    try {
      await saveRsvp({ name });
      localStorage.setItem(KEY, name.trim());
      burst(window.innerWidth / 2, window.innerHeight / 2, 80);
      setDone(name.trim());
    } catch {
      setStatus("error");
      setX(0);
    }
  }
  const down = (e: PointerEvent) => { startX.current = e.clientX - x; (e.currentTarget as Element).setPointerCapture(e.pointerId); };
  const move = (e: PointerEvent) => { if (startX.current !== null) setX(Math.max(0, Math.min(max(), e.clientX - startX.current))); };
  const up = () => {
    startX.current = null;
    if (x > max() * 0.85) { setX(max()); confirm(); } else setX(0);
  };
  const tiltMove = (e: PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ rx: ((e.clientY - r.top) / r.height - 0.5) * -14, ry: ((e.clientX - r.left) / r.width - 0.5) * 14 });
  };

  return (
    <section className="scene">
      <h2><Split text={done ? "Presença confirmada" : "Confirmar presença"} /></h2>
      <div
        className="tix"
        style={{ transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)` }}
        onPointerMove={tiltMove}
        onPointerLeave={() => setTilt({ rx: 0, ry: 0 })}
      >
        <small>Convite · 15 anos de {event.celebrantName}</small>
        <p className="guest">{guest || "Seu nome aparece aqui"}</p>
        <hr />
        <p>{d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}, às {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
        <p>{event.location.name}</p>
        {done && <span className="stamp">Confirmado</span>}
      </div>

      {done ? (
        <>
          <p role="status">Obrigado por confirmar, {done}. Te vemos lá!</p>
          <a className="btn ghost" href={icsLink()} download="festa.ics">Salvar no calendário</a>
        </>
      ) : (
        <>
          <p>Confirme até {event.rsvpDeadline}. Escreva seu nome e veja o ingresso se preencher.</p>
          <label htmlFor="nome">Seu nome</label>
          <input id="nome" className="field" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
          <div className="slide" ref={track}>
            <span className="fill" style={{ width: x + THUMB + 4 }} />
            <span className="slabel" style={{ opacity: 1 - x / max() }}>
              {status === "loading" ? "Confirmando…" : "Arraste para confirmar presença"}
            </span>
            <button
              className="thumb"
              aria-label="Confirmar presença"
              style={{ transform: `translateX(${x}px)`, transition: startX.current === null ? "transform .3s" : "none" }}
              onPointerDown={down}
              onPointerMove={move}
              onPointerUp={up}
              onPointerCancel={up}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); confirm(); } }}
            />
          </div>
          <p role="alert" className="err">
            {status === "empty" && "Escreva seu nome para confirmar."}
            {status === "error" && "Não conseguimos salvar sua confirmação. Confira a internet e arraste de novo."}
          </p>
        </>
      )}
    </section>
  );
}
