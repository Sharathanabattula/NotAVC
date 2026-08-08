import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { deckBySlug, type Deck, type Slide } from "@/lib/slides";
import { db } from "@/lib/supabase";
import { BRAND, FONT, RADIUS } from "@/lib/brand";
import {
  GraphPaper,
  CutoutPortrait,
  ArrowDownLeft,
  ArrowDownRight,
  Underline,
  StrikeMark,
  ICONS,
  type IconName,
} from "@/lib/marks";

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
/*
  `text` re-letters the frame for something that isn't NotAVC — a personal
  post, a talk, a one-off. It splits on the first space so a two-part name
  keeps the same muted-then-solid rhythm the NotAVC mark has at its own seam.
*/
function Wordmark({ dark, text }: { dark: boolean; text?: string }) {
  const colour = dark ? "#FFFFFF" : BRAND.ink;
  const space = text ? text.indexOf(" ") : -1;
  const lead = text ? (space > 0 ? text.slice(0, space + 1) : "") : "Not";
  const rest = text ? (space > 0 ? text.slice(space + 1) : text) : "AVC";
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontFamily: FONT.display, fontSize: 30 }}>
      {lead ? <span style={{ color: colour, opacity: 0.35 }}>{lead}</span> : null}
      <span style={{ color: colour }}>{rest}</span>
      <span style={{ color: dark ? BRAND.accentOnDark : BRAND.signal }}>.</span>
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
  index,
  total,
  dark,
  size,
  brand,
  handle,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  dark: boolean;
  size: { width: number; height: number };
  brand?: string;
  handle?: string;
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
        padding: 64,
        fontFamily: FONT.body,
        position: "relative",
      }}
    >
      {/*
        Graph paper, full bleed behind everything. Not BRAND.hairline:
        #E5E5E5 on the #F2F1ED canvas is barely one step and the grid
        vanishes at thumbnail size.
      */}
      <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
        <GraphPaper
          width={size.width}
          height={size.height}
          colour={dark ? "rgba(255,255,255,0.07)" : "rgba(11,11,11,0.09)"}
        />
      </div>

      {/* Header rail */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingBottom: 16,
          }}
        >
          <Wordmark dark={dark} text={brand} />
          {/*
            No episode number. Kept in the database for ordering and
            uniqueness, deliberately not shown — the archive is numbered
            for us, not for the reader.
          */}
        </div>
        <div
          style={{
            display: "flex",
            height: 2,
            background: dark ? BRAND.white10 : BRAND.ink,
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center" }}>
        {children}
      </div>

      {/* Footer rail */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            height: 2,
            background: dark ? BRAND.white10 : BRAND.ink,
            marginBottom: 20,
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {total > 1 && index < total - 1 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                border: `2px solid ${dark ? BRAND.white35 : BRAND.ink}`,
                borderRadius: RADIUS.pill,
                padding: "12px 24px",
                fontFamily: FONT.data,
                fontSize: 20,
                letterSpacing: 3,
                color: dark ? "#FFFFFF" : BRAND.ink,
              }}
            >
              SWIPE ‹‹‹
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                fontFamily: FONT.data,
                fontSize: 20,
                letterSpacing: 2,
                color: dark ? BRAND.white45 : BRAND.muted,
              }}
            >
              {handle ?? "@notavc.co"}
            </div>
          )}

          {/*
            Page number in a filled signal disc. A single-frame post has no
            page to number, and a lone "1" reads as a carousel that failed to
            load the rest.
          */}
          {total > 1 ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 56,
                height: 56,
                borderRadius: RADIUS.pill,
                background: dark ? BRAND.accentOnDark : BRAND.signal,
                color: dark ? BRAND.surfaceDark : "#FFFFFF",
                fontFamily: FONT.data,
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              {index + 1}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/*
  Source credit. Deliberately small and set in the data face — it is a
  citation, not a headline, and the whole point of printing it is that the
  reader can check the claim rather than that they admire the typography.
*/
function SourceLine({ text, dark }: { text: string; dark: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 26,
        fontFamily: FONT.data,
        fontSize: 16,
        letterSpacing: 2,
        color: dark ? BRAND.white45 : BRAND.muted,
      }}
    >
      <div
        style={{
          display: "flex",
          width: 22,
          height: 2,
          background: dark ? BRAND.accentOnDark : BRAND.signal,
        }}
      />
      {text.toUpperCase()}
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

/*
   exists for the 9:16 story frame. Type sized for the 4:5 feed reads
  as lost in space at story height, and a story is glanced at rather than
  read — the number has to dominate. Only the kinds actually used for
  stories apply it; the rest are unaffected at scale 1.
*/
function Body({ slide, dark, scale = 1 }: { slide: Slide; dark: boolean; scale?: number }) {
  const S = (n: number) => Math.round(n * scale);
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
            <div style={{ display: "flex", marginTop: 30, fontSize: 34, color: muted }}>
              {money(slide.sub)}
            </div>
          ) : null}

          {/* Image band. Sits under the type so the hook still reads first. */}
          {slide.src ? (
            <div
              style={{
                display: "flex",
                marginTop: 40,
                width: "100%",
                height: 300,
                borderRadius: RADIUS.lg,
                overflow: "hidden",
                border: `1px solid ${BRAND.borderDefault}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt="" width={952} height={300} style={{ objectFit: "cover" }} />
            </div>
          ) : null}

          {slide.source ? <SourceLine text={slide.source} dark={dark} /> : null}
        </div>
      );

    /*
      Paragraphs alternate alignment and get a marker mark between them —
      the zigzag plus the drawn arrow is what makes the page read as
      annotated rather than typeset.
    */
    case "statement": {
      const paras = slide.body.split("\n\n");
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.label ? <Kicker text={slide.label} dark={dark} /> : null}
          {paras.map((para, i) => {
            const right = i % 2 === 1;
            const last = i === paras.length - 1;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: right ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontFamily: FONT.display,
                    fontSize: 58,
                    lineHeight: 1.2,
                    letterSpacing: -1.5,
                    color: ink,
                    textAlign: right ? "right" : "left",
                    maxWidth: 820,
                  }}
                >
                  {para}
                </div>

                {last ? (
                  <div style={{ display: "flex", marginTop: -6, marginLeft: right ? 0 : 30 }}>
                    <Underline colour={accent} width={Math.min(700, para.length * 17)} />
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      marginTop: 8,
                      marginBottom: 8,
                      paddingLeft: right ? 0 : 120,
                      paddingRight: right ? 120 : 0,
                    }}
                  >
                    {right ? (
                      <ArrowDownLeft colour={accent} width={150} height={118} />
                    ) : (
                      <ArrowDownRight colour={accent} width={150} height={118} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    /* DataMetric — the number is the hero, on a tinted card */
    /*
      DataMetric. The icon sits opposite the label rather than beside the
      number — it weights the empty half of the frame instead of decorating
      the value.
    */
    case "number": {
      const Icon = ICONS[(slide.icon as IconName) ?? "chart"] ?? ICONS.chart;
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Kicker text={slide.label} dark={dark} />
            <Icon size={S(150)} accent={accent} ink={dark ? "#FFFFFF" : BRAND.ink} />
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: S(78),
              lineHeight: 1.1,
              letterSpacing: -2.5,
              color: accent,
              marginTop: 8,
            }}
          >
            {slide.value}
          </div>
          <div style={{ display: "flex", marginTop: 2, marginLeft: 20 }}>
            <Underline colour={accent} width={620} />
          </div>
          {slide.note ? (
            <div style={{ display: "flex", marginTop: 30, fontSize: S(34), lineHeight: 1.45, color: ink, maxWidth: 820 }}>
              {money(slide.note)}
            </div>
          ) : null}
        </div>
      );
    }

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
            {(slide.wrongLabel ?? "THE TAKE EVERYONE HAD").toUpperCase()}
          </div>

          {/*
            The strike is a drawn scribble, not a rule — a straight bar
            reads as text-decoration, and the point is that he crossed it
            out by hand.
          */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            {slide.wrong.map((line, i) => (
              <div key={i} style={{ display: "flex", position: "relative", marginBottom: 4 }}>
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
                    left: -8,
                    top: "38%",
                    display: "flex",
                  }}
                >
                  <StrikeMark colour={accent} width={line.length * 27 + 20} height={26} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", marginTop: 6, marginLeft: 60 }}>
            <ArrowDownRight colour={accent} width={140} height={110} />
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
                {(slide.rightLabel ?? "WHAT THE NUMBERS SAID").toUpperCase()}
              </div>
              <div style={{ display: "flex", fontSize: 38, lineHeight: 1.4, color: ink }}>
                {money(slide.right)}
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
                  {money(item.v)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      );

    /*
      A week's deals. Each row is a white logo plate, the company, and the
      amount — the plate matters because most marks are drawn for white and
      several of these vanish on the canvas colour.
    */
    case "deals":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Kicker text={slide.label} dark={dark} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {slide.items.map((item) => (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 22,
                  padding: "14px 20px",
                  borderRadius: RADIUS.lg,
                  background: dark ? BRAND.white10 : BRAND.paper,
                  border: `1px solid ${BRAND.borderDefault}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 168,
                    height: 74,
                    flexShrink: 0,
                    borderRadius: RADIUS.sm,
                    background: BRAND.paper,
                  }}
                >
                  {item.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.logo}
                      alt=""
                      width={150}
                      height={58}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    /* No usable mark — the initial keeps the row rhythm. */
                    <div
                      style={{
                        display: "flex",
                        fontFamily: FONT.display,
                        fontSize: 42,
                        color: BRAND.signal,
                      }}
                    >
                      {item.name.slice(0, 1)}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: FONT.display,
                      fontSize: 30,
                      letterSpacing: -0.5,
                      color: BRAND.ink,
                    }}
                  >
                    {item.name}
                  </div>
                  <div style={{ display: "flex", marginTop: 4, fontSize: 22, color: BRAND.muted }}>
                    {money(item.note)}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    fontFamily: FONT.display,
                    fontSize: 36,
                    letterSpacing: -1,
                    color: accent,
                  }}
                >
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
          {slide.source ? <SourceLine text={slide.source} dark={dark} /> : null}
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
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginTop: 44 }}>
            {slide.photo ? (
              <CutoutPortrait src={slide.photo} width={130} height={160} accent={accent} offset={12} />
            ) : null}
            <div
              style={{
                display: "flex",
                fontFamily: FONT.data,
                fontSize: 20,
                letterSpacing: 3,
                color: muted,
              }}
            >
              {(slide.attribution ?? "NOTAVC").toUpperCase()}
            </div>
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
                {money(slide.numberLabel).toUpperCase()}
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

    /*
      Logo card. The mark sits on its own white plate rather than directly
      on the canvas: most logos ship with a transparent background and are
      drawn for white, so placing one on #F2F1ED breaks the darker ones.
    */
    case "logo":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 28, marginBottom: 40 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                /*
                  Wide, not square. Most company marks are horizontal
                  wordmarks, and a square plate contains them down to a
                  fraction of the plate's height — the logo ends up the
                  smallest thing on a slide that exists to show it.
                */
                width: 300,
                height: 160,
                borderRadius: RADIUS.lg,
                background: BRAND.paper,
                border: `1px solid ${BRAND.borderDefault}`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt="" width={244} height={120} style={{ objectFit: "contain" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: FONT.display,
                  fontSize: 76,
                  letterSpacing: -2.5,
                  color: ink,
                  lineHeight: 1,
                }}
              >
                {slide.company}
              </div>
              {slide.verdict ? (
                <div
                  style={{
                    display: "flex",
                    marginTop: 16,
                    alignSelf: "flex-start",
                    fontFamily: FONT.data,
                    fontSize: 18,
                    letterSpacing: 3,
                    padding: "8px 18px",
                    borderRadius: RADIUS.pill,
                    background: BRAND.signal12,
                    color: accent,
                  }}
                >
                  {slide.verdict}
                </div>
              ) : null}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: 84,
              letterSpacing: -2.5,
              color: accent,
            }}
          >
            {slide.number}
          </div>
          <div style={{ display: "flex", marginTop: 2, marginLeft: 16 }}>
            <Underline colour={accent} width={560} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontFamily: FONT.data,
              fontSize: 20,
              letterSpacing: 2,
              color: muted,
            }}
          >
            {money(slide.numberLabel).toUpperCase()}
          </div>
        </div>
      );

    /*
      Full-bleed photo with the caption on a plate over it. Satori has no
      filters, so legibility comes from the plate rather than from dimming
      the image — an overlay dark enough to guarantee contrast would kill
      the photo it is there to show.
    */
    case "photo":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {slide.overline ? <Kicker text={slide.overline} dark={dark} /> : null}
          <div
            style={{
              display: "flex",
              position: "relative",
              width: "100%",
              height: 560,
              borderRadius: RADIUS.lg,
              overflow: "hidden",
              border: `1px solid ${BRAND.borderDefault}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.src} alt="" width={952} height={560} style={{ objectFit: "cover" }} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontFamily: FONT.display,
              fontSize: 46,
              lineHeight: 1.25,
              letterSpacing: -1.5,
              color: ink,
            }}
          >
            {slide.caption}
          </div>
          {slide.credit ? (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontFamily: FONT.data,
                fontSize: 16,
                letterSpacing: 2,
                color: muted,
              }}
            >
              {slide.credit.toUpperCase()}
            </div>
          ) : null}
        </div>
      );

    case "cta":
      return (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: FONT.display,
              fontSize: S(118),
              letterSpacing: -4,
              lineHeight: 1,
              color: ink,
            }}
          >
            {slide.heading}
          </div>
          {/*
            Ink, not muted. This is the closing argument — the one slide a
            reader is most likely to screenshot — and grey-on-canvas was
            making the most important paragraph in the deck the faintest.
          */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: 36, maxWidth: 880 }}>
            {slide.sub.split("\n\n").map((para, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  fontSize: S(36),
                  lineHeight: 1.45,
                  color: ink,
                  marginTop: i ? 26 : 0,
                }}
              >
                {money(para)}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 44 }}>
            <div
              style={{
                display: "flex",
                fontFamily: FONT.data,
                fontSize: S(26),
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

/*
  Outfit carries no ₹ glyph — not even in the full variable build — so any
  body-copy word containing one splits into a Jakarta fallback run, and
  Satori measures the space either side of that boundary unreliably: the
  same paragraph came back with "₹126 Cr.That" in one place and a double gap
  in another. Emitting the amount as its own span fixes the spacing but makes
  it a flex item, which forces a line break after every figure.

  So body copy simply avoids the glyph. "Rs" is one uninterrupted Outfit run,
  it is how the filings and the trade press write it anyway, and it is the
  more readable of the two for anyone outside finance.

  Headlines, photo captions and the strike lines keep ₹ — they are set in
  Jakarta, and the rails in Space Mono. Both carry the glyph natively, so
  there is no run to break.
*/
function money(text: string): string {
  return text.replace(/₹ ?/g, "Rs ");
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
      <Frame
        index={index}
        total={deck.slides.length}
        dark={dark}
        size={SIZES[size]}
        /* Re-letters the frame for a post that isn't NotAVC's */
        brand={url.searchParams.get("brand") ?? undefined}
        handle={url.searchParams.get("handle") ?? undefined}
      >
        <Body slide={slide} dark={dark} scale={size === "story" ? 1.45 : 1} />
      </Frame>
    ),
    { ...SIZES[size], fonts: await fonts() },
  );
}
