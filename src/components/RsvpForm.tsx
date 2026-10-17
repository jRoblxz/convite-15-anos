import { useState } from "react";
import type { FormEvent } from "react";
import { event } from "../config/event";
import { saveRsvp } from "../services/rsvp";
import { burst } from "../lib/confetti";

const KEY = "rsvp-name";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [done, setDone] = useState<string | null>(() => localStorage.getItem(KEY));
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">("idle");
  const d = new Date(event.dateISO);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setStatus("empty");
    setStatus("loading");
    try {
      await saveRsvp({ name });
      localStorage.setItem(KEY, name.trim());
      burst(window.innerWidth / 2, window.innerHeight / 2, 60);
      setDone(name.trim());
    } catch {
      setStatus("error");
    }
  }

  if (done)
    return (
      <section className="scene">
        <div className="ticket" role="status">
          <h2>Presença confirmada</h2>
          <p className="guest">{done}</p>
          <p>{d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}, às {d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</p>
          <p>{event.location.name}</p>
          <p className="foil-dark">Te vemos lá</p>
        </div>
      </section>
    );

  return (
    <section className="scene">
      <h2>Confirmar presença</h2>
      <p>Confirme até {event.rsvpDeadline}.</p>
      <form onSubmit={submit}>
        <label htmlFor="nome">Seu nome</label>
        <input id="nome" className="field" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} />
        <button className="btn" disabled={status === "loading"}>
          {status === "loading" ? "Confirmando…" : "Confirmar presença"}
        </button>
        <p role="alert" className="err">
          {status === "empty" && "Escreva seu nome para confirmar."}
          {status === "error" && "Não conseguimos salvar sua confirmação. Confira a internet e toque em Confirmar presença de novo."}
        </p>
      </form>
    </section>
  );
}
