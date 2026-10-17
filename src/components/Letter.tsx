import { event } from "../config/event";

export default function Letter() {
  return (
    <section className="scene letter-scene">
      <div className="letter">
        <p>Este convite é pequeno perto do que estou sentindo. Aos 15 anos, uma fase se fecha e outra se abre, e eu quero começar a nova com as pessoas que me trouxeram até aqui.</p>
        <p>Cada abraço, cada conselho e cada risada nesses anos me levaram até esta noite. Ter você ao meu lado vai deixar tudo ainda mais especial.</p>
        <p>Obrigada por fazer parte da minha história. Vem comigo?</p>
        <p>Com carinho,</p>
        <p className="neon sig">{event.celebrantName}</p>
      </div>
    </section>
  );
}
