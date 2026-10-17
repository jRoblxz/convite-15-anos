import { event } from "../config/event";

export default function Sizes() {
  const { top, bottom, shoe } = event.sizes;
  const tags = [["Blusa", top], ["Short e calça", bottom], ["Sapato", shoe]];
  return (
    <section className="scene">
      <h2>Meus tamanhos</h2>
      <p>Presente não é obrigação. Se quiser dar uma ajudinha, aqui estão meus tamanhos.</p>
      <div className="tags">
        {tags.map(([label, size], i) => (
          <div key={label} className="tag" style={{ animationDelay: `${i * 0.3}s` }}>
            <b>{size}</b>
            <small>{label}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
