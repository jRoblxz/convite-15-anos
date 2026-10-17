import { useState } from "react";
import { event } from "../config/event";
import { Split, Words } from "./Text";
import { burst } from "../lib/confetti";

const paras = [
  "Este convite é pequeno perto do que estou sentindo. Aos 15 anos, uma fase se fecha e outra se abre, e eu quero começar a nova com as pessoas que me trouxeram até aqui.",
  "Cada abraço, cada conselho e cada risada nesses anos me levaram até esta noite. Ter você ao meu lado vai deixar tudo ainda mais especial.",
  "Obrigada por fazer parte da minha história. Vem comigo?",
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
          <p>Com carinho,</p>
          <p className="neon sig">{event.celebrantName}</p>
        </div>
      </div>
    </section>
  );
}
