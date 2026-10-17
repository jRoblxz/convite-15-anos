import { useEffect, useState } from "react";
import { Split } from "./Text";
import { event } from "../config/event";

const { lat, lng, name, address } = event.location;
const rad = (d: number) => (d * Math.PI) / 180;
const DIRS = ["norte", "nordeste", "leste", "sudeste", "sul", "sudoeste", "oeste", "noroeste"];

function calc(la: number, ln: number) {
  const dLat = rad(lat - la), dLng = rad(lng - ln);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(la)) * Math.cos(rad(lat)) * Math.sin(dLng / 2) ** 2;
  const km = 12742 * Math.asin(Math.sqrt(a));
  const y = Math.sin(dLng) * Math.cos(rad(lat));
  const x = Math.cos(rad(la)) * Math.sin(rad(lat)) - Math.sin(rad(la)) * Math.cos(rad(lat)) * Math.cos(dLng);
  return { km, bearing: ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360 };
}

export default function Location() {
  const [info, setInfo] = useState<{ km: number; bearing: number } | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [msg, setMsg] = useState("");
  const q = encodeURIComponent(`${name}, ${address}`);

  useEffect(() => {
    if (!info) return;
    const h = (e: any) => {
      const v = e.webkitCompassHeading ?? (e.alpha != null ? 360 - e.alpha : null);
      if (v != null) setHeading(v);
    };
    window.addEventListener("deviceorientationabsolute", h as any);
    window.addEventListener("deviceorientation", h as any);
    return () => {
      window.removeEventListener("deviceorientationabsolute", h as any);
      window.removeEventListener("deviceorientation", h as any);
    };
  }, [info]);

  async function activate() {
    try {
      const DOE = (window as any).DeviceOrientationEvent;
      if (DOE?.requestPermission) await DOE.requestPermission();
    } catch { /* sem sensor: segue só com a direção em relação ao norte */ }
    if (!navigator.geolocation) return setMsg("Seu aparelho não permite localização. Use os botões de rota abaixo.");
    navigator.geolocation.getCurrentPosition(
      (p) => setInfo(calc(p.coords.latitude, p.coords.longitude)),
      () => setMsg("Não conseguimos sua localização. Permita o acesso ou use os botões de rota abaixo."),
    );
  }

  const angle = info ? info.bearing - (heading ?? 0) : 0;
  const dir = info ? DIRS[Math.round(info.bearing / 45) % 8] : "";

  return (
    <section className="scene">
      <h2><Split text="Onde é a festa" /></h2>
      <div className="compass" aria-hidden="true">
        <span className="needle" style={{ transform: `rotate(${angle}deg)` }} />
      </div>
      <p aria-live="polite">
        {info
          ? `A festa fica a ${info.km.toFixed(1).replace(".", ",")} km, para o ${dir}${heading == null ? " (em relação ao norte)" : ""}.`
          : msg || "Ative a bússola e o ponteiro aponta o caminho."}
      </p>
      <button className="btn" onClick={activate}>Ativar bússola</button>
      <p className="note">Sua localização fica só no seu aparelho e não é enviada.</p>
      <p><strong>{name}</strong><br />{address}</p>
      <iframe className="map" title={`Mapa de ${name}`} loading="lazy" src={`https://www.google.com/maps?q=${q}&output=embed`} />
      <div className="row">
        <a className="btn ghost" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${q}`}>Abrir no Google Maps</a>
        <a className="btn ghost" target="_blank" rel="noreferrer" href={`https://waze.com/ul?ll=${lat},${lng}&navigate=yes`}>Abrir no Waze</a>
        <a className="btn ghost" target="_blank" rel="noreferrer" href={`https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}`}>Chamar um Uber</a>
        <button className="btn ghost" onClick={() => navigator.clipboard?.writeText(address)}>Copiar endereço</button>
      </div>
    </section>
  );
}
