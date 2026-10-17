import { useState } from "react";
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
