import { useEffect, useState } from "react";
import { event } from "../config/event";

const target = new Date(event.dateISO);

export default function EventDetails() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target.getTime() - now);
  const parts = [
    ["dias", Math.floor(diff / 864e5)],
    ["horas", Math.floor(diff / 36e5) % 24],
    ["min", Math.floor(diff / 6e4) % 60],
    ["seg", Math.floor(diff / 1e3) % 60],
  ] as const;

  return (
    <section className="scene" id="quando">
      <p className="month">{target.toLocaleDateString("pt-BR", { month: "long" })}</p>
      <div className="dayrow">
        <span>{target.toLocaleDateString("pt-BR", { weekday: "long" })}</span>
        <strong className="day">{target.getDate()}</strong>
        <span>às {target.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <p className="month">{target.getFullYear()}</p>
      {diff === 0 ? (
        <h2>É hoje!</h2>
      ) : (
        <div className="count">
          {parts.map(([label, v]) => (
            <div key={label} className="tile">
              <b>{String(v).padStart(2, "0")}</b>
              <small>{label}</small>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
