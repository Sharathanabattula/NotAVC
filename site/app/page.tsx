import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Manifesto from "@/components/Manifesto";
import Series from "@/components/Series";
import Teardowns from "@/components/Teardowns";
import Closer from "@/components/Closer";
import PaletteObserver from "@/components/PaletteObserver";

/*
  Palette arc: Off-White & Rust → Nature Editorial → Luxe Dark → Rust.
  Zones are observed by PaletteObserver; the crossfade is pure CSS.
*/
export default function Home() {
  return (
    <>
      <PaletteObserver />
      <Nav />
      <main>
        <div data-palette-zone="rust">
          <Hero />
          <Ticker />
        </div>
        <div data-palette-zone="nature">
          <section id="thesis">
            <Manifesto />
          </section>
          <section id="desks">
            <Series />
          </section>
        </div>
        <div data-palette-zone="luxe">
          <section id="teardowns">
            <Teardowns />
          </section>
        </div>
        <div data-palette-zone="rust">
          <section id="signal">
            <Closer />
          </section>
        </div>
      </main>
    </>
  );
}
