import { useState } from "react";
import { event } from "../config/event";
import { Split } from "./Text";

const I = {
  azul: <><circle cx="12" cy="12" r="9" /><path d="M6 6l12 12" /></>,
  data: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  hora: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  foto: <><rect x="3" y="7" width="18" height="13" rx="2" /><circle cx="12" cy="13.5" r="3.5" /><path d="M8 7l1.5-3h5L16 7" /></>,
};
const colors = [
  ["#E9A9B8", false, "Rosa"], ["#B9A6E3", false, "Lilás"], ["#C0304A", false, "Vermelho"], ["#F2C94C", false, "Amarelo"],
  ["#111111", false, "Preto"], ["#4F9D69", false, "Verde"], ["#F7F8FC", false, "Branco"],
  ["#1B3FA8", true, "Azul royal"], ["#0B1F6B", true, "Azul marinho"], ["#A8C4EC", true, "Azul claro"],
] as const;

export default function Manual() {
  const [pick, setPick] = useState<number | null>(null);
  const blue = pick !== null && colors[pick][1];
  const time = new Date(event.dateISO).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const rules: [keyof typeof I, string, string][] = [
    ["azul", "Vá com o que quiser, só evite azul...", "O azul, em qualquer tom, é a cor da decoração."],
    ["data", `Confirme até ${event.rsvpDeadline}`, "É rapidinho: só o seu nome."],
    ["hora", "Seja pontual", `A festa começa às ${time}. Chegue um pouquinho antes.`],
    ["foto", "Tire bastante fotos", "Cada momento merece ser guardado."],
  ];
  return (
    <section className="scene">
      <h2><Split text="Manual do convidado" /></h2>
      {rules.map(([k, t, d]) => (
        <div className="rule" key={k}>
          <span className="ico"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{I[k]}</svg></span>
          <p><b>{t}</b><br />{d}</p>
        </div>
      ))}
      <div className={"mirror" + (blue ? " shake" : "")}>
        <svg viewBox="0 0 100 140" width="110" aria-hidden="true">
          <path className="dress" d="M38 8 Q50 22 62 8 L66 34 L60 48 L84 128 L16 128 L40 48 L34 34 Z" fill={pick === null ? "#F7F8FC" : colors[pick][0]} />
        </svg>
        {blue && <span className="no">✕</span>}
      </div>
      <div className="swatches">
        {colors.map(([c, , label], i) => (
          <div className="swc" key={c}>
            <button aria-label={label} className="sw" style={{ background: c }} onClick={() => setPick(i)} />
            <small>{label}</small>
          </div>
        ))}
      </div>
      <p aria-live="polite" className="note">
        {pick === null ? "Toque numa cor para ver no vestido." : blue ? `${colors[pick][2]} é a cor da decoração. Escolha outra!` : `${colors[pick][2]} combina com a festa!`}
      </p>
    </section>
  );
}
