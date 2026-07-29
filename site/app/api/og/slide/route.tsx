import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { deckBySlug, type Deck, type Slide } from "@/lib/slides";
import { db } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/*
  Renders one carousel slide as a PNG at a public URL.

  This is what makes Instagram publishing work at all: the Graph API
  downloads media from a URL, it cannot accept an upload from us. Rendering
  the artwork here means the same brand tokens drive the site and the feed,
  and there is no design step between writing a platter and posting it.

  Satori (behind ImageResponse) supports flexbox only — no CSS grid, no
  float, and every text node needs an explicit display. Layouts below are
  built accordingly.
*/

const BG = "#08070a";
const SURFACE = "#14111a";
const INK = "#ece7e1";
const MUTED = "#8b8494";
const FAINT = "#5b5566";
const ACCENT = "#e23e52";
const RULE = "rgba(236,231,225,0.14)";

const SIZES = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

async function fonts() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [display, mono, monoBold] = await Promise.all([
    readFile(path.join(dir, "Fraunces-Bold.ttf")),
    readFile(path.join(dir, "PlexMono-Regular.ttf")),
    readFile(path.join(dir, "PlexMono-SemiBold.ttf")),
  ]);
  return [
    { name: "Fraunces", data: display, weight: 700 as const, style: "normal" as const },
    { name: "Plex", data: mono, weight: 400 as const, style: "normal" as const },
    { name: "Plex", data: monoBold, weight: 600 as const, style: "normal" as const },
  ];
}

/* Shared chrome: hairline grid, corner ticks, footer rail. */
function Frame({
  children,
  ep,
  index,
  total,
}: {
  children: React.ReactNode;
  ep: string;
  index: number;
  total: number;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: BG,
        position: "relative",
        padding: 72,
        fontFamily: "Plex",
      }}
    >
      {/* Backlit grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          backgroundImage: `linear-gradient(to right, ${RULE} 1px, transparent 1px), linear-gradient(to bottom, ${RULE} 1px, transparent 1px)`,
          backgroundSize: "108px 108px",
          opacity: 0.5,
        }}
      />
      {/* Crimson horizon */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 420,
          display: "flex",
          background:
            "radial-gradient(ellipse 70% 100% at 50% 130%, rgba(226,62,82,0.30), transparent 70%)",
        }}
      />

      {/* Corner ticks */}
      <div style={{ position: "absolute", top: 40, left: 40, width: 34, height: 34, display: "flex", borderTop: `2px solid ${ACCENT}`, borderLeft: `2px solid ${ACCENT}`, opacity: 0.8 }} />
      <div style={{ position: "absolute", bottom: 40, right: 40, width: 34, height: 34, display: "flex", borderBottom: `2px solid ${ACCENT}`, borderRight: `2px solid ${ACCENT}`, opacity: 0.8 }} />

      {/* Header rail */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: 22, letterSpacing: 4, color: ACCENT, fontWeight: 600 }}>
          NOTAVC
        </div>
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 4, color: FAINT }}>
          {ep}
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", zIndex: 1 }}>
        {children}
      </div>

      {/* Footer rail with progress pips */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
        <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: FAINT }}>
          NOT A VC
        </div>
        {/* Pips only make sense when there is something to swipe to */}
        {total > 1 ? (
          <div style={{ display: "flex", gap: 10 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  width: i === index ? 34 : 10,
                  height: 4,
                  background: i === index ? ACCENT : RULE,
                }}
              />
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 4, color: ACCENT }}>
            @NOTAVC.CO
          </div>
        )}
      </div>
    </div>
  );
}

function Body({ slide }: { slide: Slide }) {
  switch (slide.kind) {
    case "cover":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: ACCENT, marginBottom: 34 }}>
            {slide.desk.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 118, lineHeight: 1.02, color: INK, letterSpacing: -3 }}>
            {slide.title}
          </div>
          <div style={{ display: "flex", width: 180, height: 4, background: ACCENT, margin: "44px 0" }} />
          {slide.sub ? (
            <div style={{ display: "flex", fontSize: 30, color: MUTED, letterSpacing: 1 }}>
              {slide.sub}
            </div>
          ) : null}
        </div>
      );

    case "statement":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.label ? (
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: ACCENT, marginBottom: 40 }}>
              {slide.label.toUpperCase()}
            </div>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {slide.body.split("\n\n").map((para, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  fontFamily: "Fraunces",
                  fontSize: 62,
                  lineHeight: 1.22,
                  color: INK,
                  marginBottom: 32,
                  letterSpacing: -1,
                }}
              >
                {para}
              </div>
            ))}
          </div>
        </div>
      );

    case "number":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: MUTED, marginBottom: 30 }}>
            {slide.label.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontSize: 78, fontWeight: 600, color: ACCENT, lineHeight: 1.15, letterSpacing: -2 }}>
            {slide.value}
          </div>
          {slide.note ? (
            <div style={{ display: "flex", marginTop: 48, paddingLeft: 28, borderLeft: `3px solid ${ACCENT}`, fontSize: 34, lineHeight: 1.45, color: INK }}>
              {slide.note}
            </div>
          ) : null}
        </div>
      );

    /*
      The signature. The strikethrough is drawn as an absolutely positioned
      bar rather than text-decoration, which Satori renders inconsistently
      at large sizes.
    */
    case "correction":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: MUTED, marginBottom: 34 }}>
            THE TAKE EVERYONE HAD
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {slide.wrong.map((line, i) => (
              // Each line is its own inline box so the bar matches its width
              <div key={i} style={{ display: "flex", position: "relative", marginBottom: 8 }}>
                <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 56, lineHeight: 1.2, color: MUTED, letterSpacing: -1 }}>
                  {line}
                </div>
                <div style={{ position: "absolute", left: -6, right: -6, top: "52%", height: 5, background: ACCENT, display: "flex" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 60, paddingLeft: 28, borderLeft: `4px solid ${ACCENT}`, flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: ACCENT, marginBottom: 22 }}>
              WHAT THE NUMBERS SAID
            </div>
            <div style={{ display: "flex", fontSize: 40, lineHeight: 1.4, color: INK }}>
              {slide.right}
            </div>
          </div>
        </div>
      );

    case "list":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: ACCENT, marginBottom: 48 }}>
            {slide.label.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {slide.items.map((item) => (
              <div
                key={item.k}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderTop: `1px solid ${RULE}`,
                  padding: "34px 0",
                  background: SURFACE,
                  paddingLeft: 28,
                  marginBottom: 4,
                }}
              >
                <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: ACCENT, letterSpacing: 3, marginBottom: 14 }}>
                  {item.k}
                </div>
                <div style={{ display: "flex", fontSize: 34, color: INK, lineHeight: 1.35 }}>
                  {item.v}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 100, color: ACCENT, fontFamily: "Fraunces", lineHeight: 0.7, marginBottom: 20 }}>
            “
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 68, lineHeight: 1.2, color: INK, letterSpacing: -2 }}>
            {slide.quote}
          </div>
          <div style={{ display: "flex", width: 160, height: 4, background: ACCENT, margin: "48px 0 28px" }} />
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: MUTED }}>
            {(slide.attribution ?? "NOTAVC").toUpperCase()}
          </div>
        </div>
      );

    case "teardown":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", border: `2px solid ${ACCENT}`, color: ACCENT, fontSize: 22, letterSpacing: 4, padding: "10px 20px" }}>
              {slide.verdict}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 104, color: INK, letterSpacing: -3, lineHeight: 1 }}>
            {slide.company}
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600, color: ACCENT, marginTop: 48, letterSpacing: -2 }}>
            {slide.number}
          </div>
          <div style={{ display: "flex", fontSize: 24, letterSpacing: 3, color: MUTED, marginTop: 18 }}>
            {slide.numberLabel.toUpperCase()}
          </div>
          <div style={{ display: "flex", marginTop: 52, paddingLeft: 28, borderLeft: `4px solid ${ACCENT}`, fontSize: 38, lineHeight: 1.35, color: INK }}>
            {slide.take}
          </div>
        </div>
      );

    case "hook":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: ACCENT, marginBottom: 40 }}>
            {slide.overline.toUpperCase()}
          </div>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 110, lineHeight: 1.05, color: INK, letterSpacing: -3 }}>
            {slide.hook}
          </div>
          <div style={{ display: "flex", width: 180, height: 4, background: ACCENT, margin: "56px 0" }} />
          <div style={{ display: "flex", fontSize: 32, letterSpacing: 3, color: MUTED }}>
            {slide.kicker}
          </div>
        </div>
      );

    case "cta":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontFamily: "Fraunces", fontSize: 130, color: INK, letterSpacing: -4, lineHeight: 1 }}>
            {slide.heading}
          </div>
          <div style={{ display: "flex", width: 180, height: 4, background: ACCENT, margin: "48px 0" }} />
          <div style={{ display: "flex", fontSize: 34, color: MUTED, lineHeight: 1.45, maxWidth: 780 }}>
            {slide.sub}
          </div>
          <div style={{ display: "flex", marginTop: 56, fontSize: 34, fontWeight: 600, letterSpacing: 4, color: ACCENT }}>
            {slide.handle}
          </div>
        </div>
      );
  }
}

/* A drafted post carries its own slides; the ep comes from its platter. */
async function deckFromPost(postId: string): Promise<Deck | null> {
  const supabase = db();
  const { data } = await supabase
    .from("posts")
    .select("id, slides, platters(ep, title)")
    .eq("id", postId)
    .maybeSingle();

  if (!data?.slides || !Array.isArray(data.slides) || !data.slides.length) {
    return null;
  }

  const platter = data.platters as unknown as { ep: string; title: string } | null;
  return {
    slug: data.id,
    ep: platter?.ep ?? "EP.???",
    title: platter?.title ?? "",
    format: "carousel",
    slides: data.slides as Slide[],
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const index = Number(url.searchParams.get("i") ?? 0);
  const postId = url.searchParams.get("post");

  /*
    Two sources. `post` reads slides written by the drafter, which is how
    generated decks render at a public URL that Instagram can fetch. `deck`
    reads the hand-authored ones in lib/slides.ts.
  */
  const deck = postId ? await deckFromPost(postId) : deckBySlug(url.searchParams.get("deck") ?? "");
  if (!deck) {
    return new Response("Unknown deck", { status: 404 });
  }

  // Size follows the deck's format unless explicitly overridden
  const requested = url.searchParams.get("size") as keyof typeof SIZES | null;
  const size: keyof typeof SIZES =
    requested && requested in SIZES
      ? requested
      : deck.format === "story"
        ? "story"
        : "portrait";
  const slide = deck.slides[index];
  if (!slide) {
    return new Response(`Slide ${index} out of range (deck has ${deck.slides.length})`, {
      status: 404,
    });
  }

  return new ImageResponse(
    (
      <Frame ep={deck.ep} index={index} total={deck.slides.length}>
        <Body slide={slide} />
      </Frame>
    ),
    {
      ...(SIZES[size] ?? SIZES.portrait),
      fonts: await fonts(),
    },
  );
}
