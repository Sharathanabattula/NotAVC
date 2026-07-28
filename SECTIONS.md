# NotAVC — What's on the site, section by section

Read top to bottom; it's the order a visitor sees. Each entry says what the
section is for, what moves, and which file to edit.

All copy lives in **`site/lib/content.ts`**. You almost never need to touch a
component to change words.

---

## Global furniture

| Piece | File | What it does |
|---|---|---|
| Boot sequence | `components/BootSequence.tsx` | Terminal cold-open, once per browser session. Skipped on repeat visits via `sessionStorage`. |
| HUD frame | `components/HudFrame.tsx` | The four crimson corner brackets pinned to the viewport. Painted once, costs nothing. |
| Nav | `components/Nav.tsx` | Glass bar + section links + a read-through progress rule that fills as you scroll. |
| Zone observer | `components/PaletteObserver.tsx` | Watches which section is centred and lifts the page elevation to match. |
| Grain | `app/globals.css` (`.grain`) | Fixed sensor-noise overlay at 3.5%. |

---

## 1. Masthead — `#top`

**File:** `components/Hero.tsx`
**Purpose:** Say who this is and what it refuses to be, in two words.

**What moves — four layers on one scroll timeline, each at a different rate:**

1. **The field** (`components/FieldCanvas.tsx`) — a dot lattice with a
   travelling wave. Dots lift and turn crimson at the wave crest, and
   brighten wherever your cursor is. This is the site's ambient motion.
2. **Backlit grid** — hairline ledger rules, masked to fade at the edges.
3. **Crimson horizon** — a glow bleeding up from the fold, scaling on scroll.
4. **N/A watermark** — drifts *against* the scroll direction.

Plus: the kicker decodes out of scrambling glyphs (`components/Decode.tsx`),
and "NOT / A VC." reveals line by line from behind a mask, so the type
appears to be set rather than faded in.

**HUD readout:** desks / teardowns / AUM. Edit inline in `Hero.tsx`.

---

## 2. The tape

**File:** `components/Ticker.tsx`
**Purpose:** A breath between the masthead and the argument. Signals the
vocabulary of the site without explaining it.

**What moves:** it drifts on its own, but **scroll velocity drives it** —
flick down and it accelerates and leans forward; scroll up and it runs
backwards. Terms: `TICKER_TERMS` in `content.ts`.

---

## 3. Thesis — `#thesis`

**File:** `components/Manifesto.tsx` · **Copy:** `MANIFESTO`
**Purpose:** The argument. Why this exists, in your voice.

**Layout:** the working-paper grid — a 150px **margin column** on the left
carrying filing notes (FILED / STATUS / RULE), then the headline, the body,
and a pull quote. Below: a four-cell stat ledger (₹0 AUM, 06 desks, EP.∞,
100% work shown).

**What moves:** staggered entrance only. This section is for reading.

---

## 4. The analyst — `#analyst`

**File:** `components/Founder.tsx` · **Copy:** `FOUNDER`
**Purpose:** You. The Bower School / MBA / finance-and-startups story.

**Treatment:** your portrait in crimson duotone with scanlines, sitting on
an offset `#710014` plate, HUD ticks in two corners. Below it, a credentials
grid (programme, degree, institution, based).

> The portrait deliberately has **no entrance animation**. An earlier version
> combined a fade-in with parallax on the same element; both write
> `transform`, they deadlocked, and the photo sat at 72% opacity. A founder
> photo must never depend on an observer firing.

Photo: `public/img/sharath.jpg`. Swap the file to change it.

---

## 5. The six desks — `#desks`

**File:** `components/Series.tsx` · **Copy:** `PILLARS`, `FIELD_NOTES`
**Purpose:** What you actually publish, so a visitor knows what following you
gets them.

**Layout:** a numbered ledger (01–06) with the format tag on the right, and a
**sticky field-notes panel** that stays alongside as the list scrolls.

The six desks: concepts explained · company teardowns · founder stories ·
market analysis · learning journal · ideas + valuations.

---

## 6. The teardown desk — `#teardowns`

**File:** `components/Teardowns.tsx` · **Copy:** `TEARDOWNS`
**Purpose:** Proof. Four companies, autopsied. Currently BYJU'S, Paytm,
Quibi, Zepto.

**This is the most important section on the site.** It carries the signature.

**THE CORRECTION LAYER** — on each card:

> **THE TAKE EVERYONE HAD**
> ~~India's edtech giant is scaling faster than anyone can copy.~~
> *It was scaling acquisitions, not learning outcomes.*

As the card enters view a crimson rule draws through the consensus take,
then the corrected read rises underneath. That is the one thing the site is
remembered by — *he shows his work, mistakes included.* Every teardown must
have it (`wrongTake` + `corrected` fields).

**Also moves:** columns parallax at different rates; a crimson rule draws
across on entry; each card has a cursor spotlight on hover.

**To add a teardown:** append to `TEARDOWNS` in `content.ts`. Required
fields: `ep`, `company`, `verdict`, `verdictTone`, `hook`, `number`,
`numberLabel`, `take`, `wrongTake`, `corrected`, `metrics`.

---

## 7. The Wire — `#wire` *(new)*

**File:** `components/Newsletter.tsx` · **Copy:** `NEWSLETTER`
**Purpose:** The newsletter you're considering. One startup torn down every
Sunday.

**What moves:** signal bars pulsing behind the copy, and a **magnetic submit
button** that leans toward your cursor and springs back. Motion stops the
instant you submit — per the design rule, nothing moves where a decision is
being made.

**How signup works:** `POST /api/subscribe` → writes a `pending` row to
`subscribers`. **Double opt-in** — nothing is ever mailed to an address until
that address confirms, so the form can't be used to spam someone. The
response is identical whether the address is new or already subscribed, so
it can't be used to check who's on the list.

> **Not built yet:** the confirmation email, the send pipeline, and the
> unsubscribe page. The database (`subscribers`, `issues`) and the capture
> form are done. You need an email sender — Resend's free tier is 3,000/month
> and does not expire, which fits your "no fragile free tiers" rule better
> than Mailchimp's contact-capped one.

---

## 8. Signal — `#signal`

**File:** `components/Closer.tsx` · **Copy:** `CLOSER`
**Purpose:** The exit. "Still not a VC." plus three links — LinkedIn,
Instagram, email.

**What moves:** nothing but press feedback. Decision zone.

---

## Off the main page

### `/studio` — the control room

**Files:** `app/studio/`, `components/StudioBoard.tsx`
Passphrase-gated. Four lanes: Draft → Awaiting approval → Approved/queued →
Published. Buttons to push a draft to Telegram, approve, retry a failure,
and open the live post.

### `/studio/login`

The gate. Set `STUDIO_PASSWORD` in your env.

### API routes

| Route | Purpose |
|---|---|
| `POST /api/subscribe` | Newsletter signup (public) |
| `POST /api/telegram` | Approval webhook — secret-token header + pinned chat id |
| `PATCH /api/studio/posts/[id]` | Move a post's status; cannot touch published posts |
| `GET /api/cron/publish` | Runs every 5 min; publishes approved posts that are due |
| `POST /api/studio/login` | Sets the studio cookie |

---

## Changing things without breaking them

- **Words:** `site/lib/content.ts`. Nothing else.
- **Colours / type / spacing:** `site/app/globals.css` — and read `DESIGN.md`
  first, it's the source of truth and explains *why* each value is what it is.
- **Adding a section:** build the component, add it to `app/page.tsx` inside a
  `<div data-zone="deck">`, and add a nav link in `components/Nav.tsx`.
- **The two-ink rule:** bone is what you wrote, crimson is what you
  corrected. If crimson shows up more than three times in one screen,
  something has gone wrong.

---

## Known gaps

- **No mobile nav menu.** Section links are hidden below 640px; scrolling
  works but there's no jump menu. Worth adding.
- **Newsletter sending is not built** — see section 7.
- **Instagram reels need a publicly hosted video URL**; the API downloads
  media from a URL and can't take a local upload.
