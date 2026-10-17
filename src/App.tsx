import { lazy, Suspense, useState } from "react";
const Background3D = lazy(() => import("./components/Background3D"));
import Hero from "./components/Hero";
import EventDetails from "./components/EventDetails";
import Location from "./components/Location";
import RsvpForm from "./components/RsvpForm";
import Manual from "./components/Manual";
import Sizes from "./components/Sizes";
import Letter from "./components/Letter";

export default function App() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => document.getElementById("quando")?.scrollIntoView({ behavior: "smooth" }), 2000);
  };
  return (
    <main>
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
