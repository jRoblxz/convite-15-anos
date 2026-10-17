import { useState } from "react";
import { event } from "../config/event";
import { Split, Words } from "./Text";
import { burst } from "../lib/confetti";

const paras = [
  "Uma fase linda está começando, e eu quero viver esse momento ao lado de pessoas que fazem parte da minha história e que tornam minha vida mais especial.",
  "Cada momento, cada risada e cada lembrança que compartilho com você têm um lugarzinho no meu coração. E não teria como comemorar uma data tão importante sem ter você comigo!",
  "Preparei tudo com muito carinho para que seja um dia cheio de alegria, diversão e momentos inesquecíveis. Quero aproveitar cada segundo e guardar lembranças lindas ao lado de quem eu amo!",
  "Obrigada por fazer parte da minha vida. Agora só falta você para deixar esse dia ainda mais especial! Vem comemorar meus 15 anos comigo?",
];

export default function Letter() {
  const [open, setOpen] = useState(false);
  let n = 0;
  return (
    <section className="scene letter-scene">
      <h2><Split text="Uma carta para você" /></h2>
      <div className={"env" + (open ? " open" : "")}>
        <div className="flap" />
        {!open && (
          <button className="seal" aria-label="Abrir carta" onClick={(e) => { burst(e.clientX, e.clientY, 40); setOpen(true); }}>
            {event.celebrantName[0]}
          </button>
        )}
      </div>
      {!open && <p className="note">Toque no selo para abrir</p>}
      <div className={"unfold" + (open ? " open" : "")}>
        <div className={"letter" + (open ? " on" : "")}>
          {paras.map((p) => { const s = n; n += p.split(" ").length; return <p key={p}><Words text={p} start={s} /></p>; })}
          <p className="neon sig">{event.celebrantName}</p>
        </div>
      </div>
    </section>
  );
}
