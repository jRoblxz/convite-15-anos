import { useState } from "react";
import { event } from "../config/event";

const colors = [
  ["#E9A9B8", false], ["#B9A6E3", false], ["#C0303A", false], ["#F2C94C", false],
  ["#111111", false], ["#FFFFFF", false], ["#4F9D69", false],
  ["#1B3FA8", true], ["#0B1F6B", true], ["#A8C4EC", true],
] as const;

export default function Manual() {
  const [pick, setPick] = useState<number | null>(null);
  const blue = pick !== null && colors[pick][1];
  const time = new Date(event.dateISO).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return (
    <section className="scene">
      <h2>Manual do convidado</h2>
      <ul className="manual">
        <li><b>Não vá de azul.</b> O azul é da decoração. Qualquer outra cor combina.</li>
        <li><b>Confirme até {event.rsvpDeadline}.</b></li>
        <li><b>Seja pontual.</b> A festa começa às {time}. Chegue um pouquinho antes.</li>
        <li><b>Tire bastante fotos.</b></li>
      </ul>
      <div className="swatches">
        {colors.map(([c, isBlue], i) => (
          <button key={c} aria-label={isBlue ? "Cor azul" : "Cor"} className={"sw" + (pick === i && isBlue ? " shake" : "")} style={{ background: c }} onClick={() => setPick(i)} />
        ))}
      </div>
      <p aria-live="polite" className="note">
        {pick === null ? "Toque numa cor para testar." : blue ? "Esse a decoração já tem! Escolha outra cor." : "Combina com a festa."}
      </p>
    </section>
  );
}
