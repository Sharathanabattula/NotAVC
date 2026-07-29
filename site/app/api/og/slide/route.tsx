import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { deckBySlug, type Deck, type Slide } from "@/lib/slides";
import { db } from "@/lib/supabase";
import { BRAND, FONT, RADIUS } from "@/lib/brand";

export const dynamic = "force-dynamic";

/*
  Renders one slide as a PNG at a public URL.

  This is what makes Instagram publishing work at all: the Graph API
  downloads media from a URL, it cannot accept an upload from us.

  Everything visual comes from lib/brand.ts, which transcribes the NotAVC
  Design System. Carousels and posts sit on light canvas; only reels and
  story formats invert to dark, where crimson becomes unreadable and the
  system switches the accent to bronze.

  Satori (behind ImageResponse) supports flexbox only — no CSS grid, no
  float, and every text node needs an explicit display.
*/

const SIZES = {
  square: { width: 1080, height: 1080 },
  portrait: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

async function fonts() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [display, body, bodySemi, mono, monoBold] = await Promise.all([
    readFile(path.join(dir, "Jakarta-ExtraBold.ttf")),
    readFile(path.join(dir, "Outfit-Regular.ttf")),
    readFile(path.join(dir, "Outfit-SemiBold.ttf")),
    readFile(path.join(dir, "SpaceMono-Regular.ttf")),
    readFile(path.join(dir, "SpaceMono-Bold.ttf")),
  ]);
  const n = "normal" as const;
  return [
    { name: "Jakarta", data: display, weight: 800 as const, style: n },
    { name: "Outfit", data: body, weight: 400 as const, style: n },
    { name: "Outfit", data: bodySemi, weight: 600 as const, style: n },
    { name: "SpaceMono", data: mono, weight: 400 as const, style: n },
    { name: "SpaceMono", data: monoBold, weight: 700 as const, style: n },
  ];
}

/* Wordmark: "Not" at 35% opacity, "AVC" full weight. */
function Wordmark({ dark }: { dark: boolean }) {
  const colour = dark ? "#FFFFFF" : BRAND.ink;
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontFamily: FONT.display, fontSize: 30 }}>
      <span style={{ color: colour, opacity: 0.35 }}>Not</span>
      <span style={{ color: colour }}>AVC</span>
      <span style={{ color: dark ? BRAND.accentOnDark : BRAND.signal }}>.</span>
    </div>
  );
}

/* EpisodeBadge — EP.001 in Space Mono, on a signal tint. */
function EpisodeBadge({ ep, dark }: { ep: string; dark: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT.data,
        fontSize: 20,
        letterSpacing: 2,
        padding: "10px 18px",
        borderRadius: RADIUS.pill,
        background: dark ? BRAND.white06 : BRAND.signal08,
        color: dark ? BRAND.accentOnDark : BRAND.signal,
      }}
    >
      {ep}
    </div>
  );
}

/* DotIndicator — carousel progress. */
function DotIndicator({ index, total, dark }: { index: number; total: number; dark: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            width: i === index ? 26 : 8,
            height: 8,
            borderRadius: RADIUS.pill,
            background:
              i === index
                ? dark
                  ? BRAND.accentOnDark
                  : BRAND.signal
                : dark
                  ? BRAND.white10
                  : BRAND.signal18,
          }}
        />
      ))}
    </div>
  );
}

function Frame({
  children,
  ep,
  index,
  total,
  dark,
}: {
  children: React.ReactNode;
  ep: string;
  index: number;
  total: number;
  dark: boolean;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: dark ? BRAND.surfaceDark : BRAND.canvas,
        padding: 76,
        fontFamily: FONT.body,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Wordmark dark={dark} />
        <EpisodeBadge ep={ep} dark={dark} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
        {children}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            fontFamily: FONT.data,
            fontSize: 18,
            letterSpacing: 2,
            color: dark ? BRAND.white45 : BRAND.muted,
          }}
        >
          @notavc.co
        </div>
        {total > 1 ? (
          <DotIndicator index={index} total={total} dark={dark} />
        ) : (
          <div
            style={{
              display: "flex",
              fontFamily: FONT.data,
              fontSize: 18,
              letterSpacing: 2,
              color: dark ? BRAND.accentOnDark : BRAND.signal,
            }}
          >
            NOT A VC
          </div>
        )}
      </div>
    </div>
  );
}

/* Card — hairline border, 12px radius, white surface. Never heavy strokes. */
function Card({
  children,
  dark,
  tint,
}: {
  children: React.ReactNode;
  dark: boolean;
  tint?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: dark ? BRAND.white06 : tint ? BRAND.signal08 : BRAND.paper,
        border: `1px solid ${dark ? BRAND.white10 : BRAND.borderDefault}`,
        borderRadius: RADIUS.lg,
        padding: 40,
      }}
    >
      {children}
    </div>
  );
}

function Kicker({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: FONT.data,
        fontSize: 20,
        letterSpacing: 4,
        marginBottom: 28,
        color: dark ? BRAND.accentOnDark : BRAND.signal,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
}

function Body({ slide, dark }: { slide: Slide; dark: boolean }) {
  const ink = dark ? "#FFFFFF" : BRAND.ink;
  const muted = dark ? BRAND.white45 : BRAND.muted;
  const accent = dark ? BRAND.accentOnDark : BRAND.signal;

  switch (slide.kind) {
    case "cover":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker text={slide.desk} dark={dark} />
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 112,
              lineHeight: 1.04,
              letterSpacing: -3,
              color: ink,
            }}
          >
            {slide.title}
          </div>
          {slide.sub ? (
            <div style={{ display: "flex", marginTop: 36, fontSize: 34, color: muted }}>
              {slide.sub}
            </div>
          ) : null}
        </div>
      );

    case "statement":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.label ? <Kicker text={slide.label} dark={dark} /> : null}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {slide.body.split("\n\n").map((para, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  fontFamily: FONT.display,
                  fontSize: 60,
                  lineHeight: 1.22,
                  letterSpacing: -1.5,
                  color: ink,
                  marginBottom: 30,
                }}
              >
                {para}
              </div>
            ))}
          </div>
        </div>
      );

    /* DataMetric — the number is the hero, on a tinted card */
    case "number":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker text={slide.label} dark={dark} />
          <Card dark={dark} tint>
            <div
              style={{
                display: "flex",
                fontFamily: FONT.display,
                fontSize: 72,
                lineHeight: 1.15,
                letterSpacing: -2,
                color: accent,
              }}
            >
              {slide.value}
            </div>
          </Card>
          {slide.note ? (
            <div style={{ display: "flex", marginTop: 32, fontSize: 34, lineHeight: 1.45, color: ink }}>
              {slide.note}
            </div>
          ) : null}
        </div>
      );

    /*
      THE SIGNATURE. The strike is a bar per line: one bar over a wrapped
      block crosses only the first line and dangles past the last.
    */
    case "correction":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.data,
              fontSize: 18,
              letterSpacing: 4,
              color: muted,
              marginBottom: 26,
            }}
          >
            THE TAKE EVERYONE HAD
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {slide.wrong.map((line, i) => (
              <div key={i} style={{ display: "flex", position: "relative", marginBottom: 6 }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: FONT.display,
                    fontSize: 54,
                    lineHeight: 1.2,
                    letterSpacing: -1.5,
                    color: muted,
                  }}
                >
                  {line}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: -4,
                    right: -4,
                    top: "52%",
                    height: 4,
                    borderRadius: RADIUS.sm,
                    background: accent,
                    display: "flex",
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 46 }}>
            <Card dark={dark} tint>
              <div
                style={{
                  display: "flex",
                  fontFamily: FONT.data,
                  fontSize: 18,
                  letterSpacing: 4,
                  color: accent,
                  marginBottom: 20,
                }}
              >
                WHAT THE NUMBERS SAID
              </div>
              <div style={{ display: "flex", fontSize: 38, lineHeight: 1.4, color: ink }}>
                {slide.right}
              </div>
            </Card>
          </div>
        </div>
      );

    case "list":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker text={slide.label} dark={dark} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {slide.items.map((item) => (
              <Card key={item.k} dark={dark}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: FONT.data,
                    fontSize: 24,
                    fontWeight: 700,
                    letterSpacing: 2,
                    color: accent,
                    marginBottom: 12,
                  }}
                >
                  {item.k}
                </div>
                <div style={{ display: "flex", fontSize: 32, lineHeight: 1.35, color: ink }}>
                  {item.v}
                </div>
              </Card>
            ))}
          </div>
        </div>
      );

    case "quote":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 110,
              lineHeight: 0.7,
              color: accent,
              marginBottom: 24,
            }}
          >
            &ldquo;
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 66,
              lineHeight: 1.2,
              letterSpacing: -2,
              color: ink,
            }}
          >
            {slide.quote}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontFamily: FONT.data,
              fontSize: 20,
              letterSpacing: 3,
              color: muted,
            }}
          >
            {(slide.attribution ?? "NOTAVC").toUpperCase()}
          </div>
        </div>
      );

    case "teardown":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                fontFamily: FONT.data,
                fontSize: 20,
                letterSpacing: 3,
                padding: "10px 20px",
                borderRadius: RADIUS.pill,
                background: BRAND.signal12,
                color: accent,
              }}
            >
              {slide.verdict}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 96,
              letterSpacing: -3,
              lineHeight: 1,
              color: ink,
            }}
          >
            {slide.company}
          </div>
          <div style={{ display: "flex", marginTop: 36 }}>
            <Card dark={dark} tint>
              <div
                style={{
                  display: "flex",
                  fontFamily: FONT.display,
                  fontSize: 68,
                  letterSpacing: -2,
                  color: accent,
                }}
              >
                {slide.number}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 14,
                  fontFamily: FONT.data,
                  fontSize: 18,
                  letterSpacing: 2,
                  color: muted,
                }}
              >
                {slide.numberLabel.toUpperCase()}
              </div>
            </Card>
          </div>
          <div style={{ display: "flex", marginTop: 32, fontSize: 36, lineHeight: 1.35, color: ink }}>
            {slide.take}
          </div>
        </div>
      );

    case "hook":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker text={slide.overline} dark={dark} />
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 104,
              lineHeight: 1.06,
              letterSpacing: -3,
              color: ink,
            }}
          >
            {slide.hook}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 48,
              fontFamily: FONT.data,
              fontSize: 26,
              letterSpacing: 3,
              color: accent,
            }}
          >
            {slide.kicker}
          </div>
        </div>
      );

    case "cta":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 118,
              letterSpacing: -4,
              lineHeight: 1,
              color: ink,
            }}
          >
            {slide.heading}
          </div>
          <div style={{ display: "flex", marginTop: 36, fontSize: 34, lineHeight: 1.45, color: muted, maxWidth: 760 }}>
            {slide.sub}
          </div>
          <div style={{ display: "flex", marginTop: 44 }}>
            <div
              style={{
                display: "flex",
                fontFamily: FONT.data,
                fontSize: 26,
                letterSpacing: 3,
                padding: "16px 30px",
                borderRadius: RADIUS.pill,
                background: accent,
                color: dark ? BRAND.surfaceDark : BRAND.paper,
              }}
            >
              {slide.handle}
            </div>
          </div>
        </div>
      );
  }
}

async function deckFromPost(postId: string): Promise<Deck | null> {
  const supabase = db();
  const { data } = await supabase
    .from("posts")
    .select("id, slides, platters(ep, title)")
    .eq("id", postId)
    .maybeSingle();

  if (!data?.slides || !Array.isArray(data.slides) || !data.slides.length) return null;

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

  const deck = postId
    ? await deckFromPost(postId)
    : deckBySlug(url.searchParams.get("deck") ?? "");
  if (!deck) return new Response("Unknown deck", { status: 404 });

  const slide = deck.slides[index];
  if (!slide) {
    return new Response(`Slide ${index} out of range (deck has ${deck.slides.length})`, {
      status: 404,
    });
  }

  const requested = url.searchParams.get("size") as keyof typeof SIZES | null;
  const size: keyof typeof SIZES =
    requested && requested in SIZES ? requested : deck.format === "story" ? "story" : "portrait";

  // Only the 9:16 story/reel format inverts; carousels and posts stay light.
  const dark = size === "story";

  return new ImageResponse(
    (
      <Frame ep={deck.ep} index={index} total={deck.slides.length} dark={dark}>
        <Body slide={slide} dark={dark} />
      </Frame>
    ),
    { ...SIZES[size], fonts: await fonts() },
  );
}
