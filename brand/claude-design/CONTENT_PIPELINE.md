# NotAVC Content Pipeline — Input Spec

Use this as the system prompt / output format for your daily scanner. When the output lands here, I produce the carousel instantly.

---

## REQUIRED FORMAT (paste this exactly into chat)

```
NOTAVC PLATTER
type: [daily | weekly | teardown | insight | rest-day]
date: YYYY-MM-DD
episode: EP.XXX
pillar: [one-liner description]

---

HOOK
[The one sentence that stops the scroll. Written like you'd text a friend.]

---

KEY FACTS
- [fact 1 — plain language, no jargon]
- [fact 2]
- [fact 3]
- [fact 4]
- [max 6 facts, each under 20 words]

---

NUMBERS
[number 1]: [what it means in plain English]
[number 2]: [what it means]
[number 3]: [what it means]

---

STORY ARC
slide_1: [hook — what stops the scroll]
slide_2: [context — why should I care]
slide_3: [the main insight]
slide_4: [proof / data / example]
slide_5: [the takeaway]
slide_6: [CTA — what the audience does next]

---

SOURCES
- [URL 1]
- [URL 2]
- [URL 3]

---

CTA_TYPE: [poll | comment-question | follow | share]
CTA_TEXT: [exact question or call to action]

---

LINKEDIN CAPTION
[Write 3-5 lines. First line = hook. Last line = CTA. Middle = context.]
```

---

## PILLAR DEFINITIONS

### DAILY (Mon–Sat)
- 6 slides, 1080×1350
- One news story, simplified
- No jargon — explain it like the audience is smart but not in VC
- Always end with a question or opinion prompt

### WEEKLY (Sunday)
- 6 slides, 1080×1350
- Roundup of the week's funding/deals
- Lead with the most surprising number
- Highlight 2-3 quiet stories behind the headline
- End with a poll or teardown vote

### TEARDOWN (Tuesday)
- 6 slides, 1080×1350
- One company deep-dive
- Structure: what they do → the numbers → the model → what's smart → what's risky → verdict
- Verdict uses the locked verdict colors (coral/amber/blue)

### INSIGHT (Thursday)
- 6 slides, 1080×1350
- One pattern or trend across multiple companies
- Structure: the pattern → example 1 → example 2 → why it matters → what to watch → CTA

### REST DAY (Sunday alt)
- Story poll format OR a simple 6-slide engagement post
- Lighter tone, audience participation focused

---

## RULES FOR THE SCANNER OUTPUT

1. **No jargon** — say "chip factory" not "fab", say "funding round" not "Series C" (unless the series letter IS the point)
2. **Numbers in human scale** — "$100M" not "$100,000,000", "₹200cr" not "₹2,000,000,000"
3. **Every fact needs a source URL** — I won't publish unchecked claims
4. **Hook must be under 15 words** — if it doesn't fit in one breath, rewrite it
5. **Max 6 slides** — if the story needs more, split into two posts
6. **Plain language test** — would a 22-year-old MBA student understand every word without Googling? If no, simplify.
7. **One insight per post** — don't cover 5 things. Cover 1 thing from 5 angles.

---

## WHAT I PRODUCE FROM THIS

When you paste the platter:
1. **LinkedIn carousel** — 6 slides, 1080×1350, NotAVC design system, graph-paper grid, two-ink discipline
2. **Export** — PNG (6 images) + PDF (document carousel), one-click download
3. **LinkedIn caption** — ready to copy-paste

---

## QUICK PASTE VERSION

If you're in a rush, minimum I need is:

```
type: daily
date: 2026-09-13
hook: [one line]
facts: [3-5 bullet points]
numbers: [2-3 key numbers with context]
source: [1-2 URLs]
cta: [question for the audience]
```

I'll build the arc and slides from that.


## Rule (Oct 11, 2026)
No episode numbers (EP.xxx) on any carousel slide. Episode numbers stay in filenames only.
