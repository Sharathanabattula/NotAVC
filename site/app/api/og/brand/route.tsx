import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { BRAND, FONT } from "@/lib/brand";
import { GraphPaper } from "@/lib/marks";

export const dynamic = "force-dynamic";

/*
  Brand assets at the exact sizes the platforms want.

  These could have been exported once by hand, but the wordmark and the
  tagline change, and a hand-exported PNG goes stale silently. Rendering
  them from the same tokens and fonts as everything else means re-exporting
  is a page load, and they can never drift from the site.

  Satori is flexbox-only and every text node needs an explicit display.
*/

const KINDS = {
  /* LinkedIn company logo. Minimum is 300 square; 400 leaves headroom. */
  logo: { width: 400, height: 400 },
  /* LinkedIn company page cover. */
  cover: { width: 1128, height: 191 },
  /* LinkedIn personal profile banner. */
  banner: { width: 1584, height: 396 },
  /* Square avatar for Instagram / X / anywhere else. */
  avatar: { width: 1080, height: 1080 },
} as const;

type Kind = keyof typeof KINDS;

async function fonts() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [display, body, mono] = await Promise.all([
    readFile(path.join(dir, "Jakarta-ExtraBold.ttf")),
    readFile(path.join(dir, "Outfit-Regular.ttf")),
    readFile(path.join(dir, "SpaceMono-Regular.ttf")),
  ]);
  const n = "normal" as const;
  return [
    { name: "Jakarta", data: display, weight: 800 as const, style: n },
    { name: "Outfit", data: body, weight: 400 as const, style: n },
    { name: "SpaceMono", data: mono, weight: 400 as const, style: n },
  ];
}

/* Stacked lockup — fills a square far better than the horizontal wordmark. */
function Stacked({ scale }: { scale: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          display: "flex",
          fontFamily: FONT.display,
          fontSize: 58 * scale,
          letterSpacing: -1 * scale,
          lineHeight: 1,
          color: "#FFFFFF",
          opacity: 0.35,
        }}
      >
        Not
      </div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <div
          style={{
            display: "flex",
            fontFamily: FONT.display,
            fontSize: 104 * scale,
            letterSpacing: -3 * scale,
            lineHeight: 1,
            color: "#FFFFFF",
          }}
        >
          AVC
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: FONT.display,
            fontSize: 104 * scale,
            lineHeight: 1,
            color: BRAND.signal,
          }}
        >
          .
        </div>
      </div>
    </div>
  );
}

/* Horizontal wordmark — for the wide formats. */
function Inline({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", fontFamily: FONT.display }}>
      <div style={{ display: "flex", fontSize: size, color: "#FFFFFF", opacity: 0.35, letterSpacing: -size * 0.03 }}>
        Not
      </div>
      <div style={{ display: "flex", fontSize: size, color: "#FFFFFF", letterSpacing: -size * 0.03 }}>
        AVC
      </div>
      <div style={{ display: "flex", fontSize: size, color: BRAND.signal }}>.</div>
    </div>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("kind") as Kind | null;
  const kind: Kind = requested && requested in KINDS ? requested : "cover";
  const size = KINDS[kind];

  const square = kind === "logo" || kind === "avatar";
  /*
    LinkedIn crops covers on narrow viewports, so the wide formats keep
    their content inside a generous inset rather than running to the edge.
  */
  const pad = square ? 0 : kind === "cover" ? 40 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: square ? "center" : "space-between",
          padding: pad,
          background: BRAND.surfaceDark,
          fontFamily: FONT.body,
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, display: "flex" }}>
          <GraphPaper
            width={size.width}
            height={size.height}
            colour="rgba(255,255,255,0.06)"
          />
        </div>

        {square ? (
          <Stacked scale={kind === "avatar" ? 2.4 : 0.92} />
        ) : (
          <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Inline size={kind === "cover" ? 46 : 68} />
              <div
                style={{
                  display: "flex",
                  marginTop: kind === "cover" ? 10 : 18,
                  fontSize: kind === "cover" ? 20 : 30,
                  color: "rgba(255,255,255,0.62)",
                }}
              >
                The numbers, not the headline.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: FONT.data,
                  fontSize: kind === "cover" ? 15 : 21,
                  letterSpacing: 3,
                  color: BRAND.signal === "#710014" ? "#C2415A" : BRAND.signal,
                }}
              >
                @NOTAVC.CO
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 8,
                  fontFamily: FONT.data,
                  fontSize: kind === "cover" ? 13 : 17,
                  letterSpacing: 2,
                  color: "rgba(255,255,255,0.4)",
                }}
              >
                MBA STUDENT · INDIAN STARTUPS
              </div>
            </div>
          </>
        )}
      </div>
    ),
    { ...size, fonts: await fonts() },
  );
}
