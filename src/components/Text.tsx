import type { CSSProperties } from "react";

const v = (i: number) => ({ "--i": i }) as CSSProperties;

export function Split({ text, cls = "ch" }: { text: string; cls?: string }) {
  return (
    <span aria-label={text}>
      {[...text].map((c, i) => (
        <span aria-hidden="true" key={i} className={cls} style={v(i)}>{c === " " ? "\u00A0" : c}</span>
      ))}
    </span>
  );
}

export function Words({ text, start = 0 }: { text: string; start?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="w" style={v(start + i)}>{w}{" "}</span>
      ))}
    </>
  );
}
