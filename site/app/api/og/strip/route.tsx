import { ImageResponse } from "next/og";
import { BRAND, RADIUS } from "@/lib/brand";

/*
  Renders a row of company marks as one image, for the cover slide's image
  band.

  This used to be a sharp script that composited the marks locally, wrote a
  PNG into public/, and needed a commit and a Vercel deploy before the slide
  renderer could see it. Four laptop-only steps for one picture. Here it is
  a URL, so a deck can be authored from a phone.

  Plates are uniform rather than sized to each mark's aspect. Satori cannot
  measure a remote image, so aspect-driven widths aren't available to it —
  and a uniform row reads as a deliberate logo wall anyway. Every mark sits
  on a white plate because several companies publish marks drawn for dark
  backgrounds, which arrive as solid blocks and look like a rendering fault
  on bare paper.

    /api/og/strip?d=ctrls.com,divislabs.com,zenoti.com

  Optional: &w= &h= to change the band, &bg=dark to invert the backing.
*/

export const dynamic = "force-dynamic";

const LOGO_TOKEN = "pk_X-1ZO13GSgeOoUrIuJ6GMQ";

const PAD = 40;
const GAP = 28;
/* Breathing room between a mark and its plate edge */
const INSET = 34;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const domains = (params.get("d") ?? "")
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean)
    .slice(0, 8);

  if (!domains.length) {
    return new Response("Pass ?d=domain.com,other.com", { status: 400 });
  }

  const width = Number(params.get("w") ?? 1904);
  const height = Number(params.get("h") ?? 600);
  const dark = params.get("bg") === "dark";

  const plateW = Math.floor((width - PAD * 2 - GAP * (domains.length - 1)) / domains.length);
  const plateH = Math.min(Math.round(plateW * 0.7), height - PAD * 2);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
          gap: GAP,
          padding: PAD,
          background: dark ? BRAND.surfaceDark : BRAND.canvas,
        }}
      >
        {domains.map((d) => (
          <div
            key={d}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: plateW,
              height: plateH,
              borderRadius: RADIUS.lg,
              background: BRAND.paper,
              border: `1px solid ${BRAND.hairline}`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.logo.dev/${d}?token=${LOGO_TOKEN}&size=400&format=png`}
              alt=""
              width={plateW - INSET * 2}
              height={plateH - INSET * 2}
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
      </div>
    ),
    {
      width,
      height,
      headers: {
        /*
          A strip for a given set of domains never changes, and logo.dev is
          slow and prone to resetting the connection. Cache hard so a deck
          re-render doesn't refetch five marks.
        */
        "cache-control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
