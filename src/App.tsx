import { lazy, Suspense, useEffect, useState } from "react";
const Background3D = lazy(() => import("./components/Background3D"));
import Stars from "./components/Stars";
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import Location from "./components/Location";
import RsvpForm from "./components/RsvpForm";
import Manual from "./components/Manual";
import Sizes from "./components/Sizes";
import Letter from "./components/Letter";

export default function App() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: 0.2 });
    document.querySelectorAll(".scene").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [open]);
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => document.getElementById("quando")?.scrollIntoView({ behavior: "smooth" }), 2000);
  };
  return (
    <main>
      <Stars />
      <Suspense fallback={null}><Background3D /></Suspense>
      <Hero open={open} onOpen={handleOpen} />
      {open && (
        <>
          <EventDetails />
          <Location />
          <RsvpForm />
          <Manual />
          <Sizes />
          <Letter />
        </>
      )}
    </main>
  );
}
