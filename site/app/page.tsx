import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Manifesto from "@/components/Manifesto";
import Founder from "@/components/Founder";
import Series from "@/components/Series";
import Teardowns from "@/components/Teardowns";
import Closer from "@/components/Closer";
import PaletteObserver from "@/components/PaletteObserver";
import BootSequence from "@/components/BootSequence";
import HudFrame from "@/components/HudFrame";

/*
  Zone arc: void (masthead) → deck (thesis) → plate (teardown desk) → deck.
  Elevation only, never a light flip. PaletteObserver owns the switch.
*/
export default function Home() {
  return (
    <>
      <BootSequence />
      <PaletteObserver />
      <HudFrame />
      <Nav />
      <main>
        <div data-zone="void">
          <Hero />
          <Ticker />
        </div>
        <div data-zone="deck">
          <section id="thesis">
            <Manifesto />
          </section>
          <section id="analyst">
            <Founder />
          </section>
          <section id="desks">
            <Series />
          </section>
        </div>
        <div data-zone="plate">
          <section id="teardowns">
            <Teardowns />
          </section>
        </div>
        <div data-zone="deck">
          <section id="signal">
            <Closer />
          </section>
        </div>
      </main>
    </>
  );
}
