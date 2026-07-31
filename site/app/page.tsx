import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Manifesto from "@/components/Manifesto";
import Founder from "@/components/Founder";
import Method from "@/components/Method";
import Series from "@/components/Series";
import RupeeSplit from "@/components/RupeeSplit";
import Teardowns from "@/components/Teardowns";
import Glossary from "@/components/Glossary";
import Newsletter from "@/components/Newsletter";
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
          {/*
            Method sits between who is writing and what gets published: it is
            the answer to "why should I believe you", and it has to land
            before the desks rather than after them.
          */}
          <section id="method">
            <Method />
          </section>
          <section id="desks">
            <Series />
          </section>
        </div>
        {/*
          The rupee split opens the plate zone. It is the argument the whole
          site makes, drawn rather than stated, so it earns the elevation
          change and sets up the cards that follow it.
        */}
        <div data-zone="plate">
          <section id="rupee">
            <RupeeSplit />
          </section>
          <section id="teardowns">
            <Teardowns />
          </section>
        </div>
        <div data-zone="deck">
          {/*
            Glossary after the breakdowns, not before: someone who has just
            read "gross margin" in a card is the person who wants it defined.
          */}
          <section id="glossary">
            <Glossary />
          </section>
          <section id="wire">
            <Newsletter />
          </section>
          <section id="signal">
            <Closer />
          </section>
        </div>
      </main>
    </>
  );
}
