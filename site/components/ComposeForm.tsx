"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICON_NAMES } from "@/lib/icons";

/*
  Write a post by hand.

  Deliberately shaped around the seven-slide carousel so nobody has to think
  about slide kinds while writing — you fill in the argument, the renderer
  builds the deck.

  The correction fields are marked required in the markup and enforced again
  on the server: it is the one part of a NotAVC post that cannot be skipped
  on a busy day.
*/

const DESKS = [
  "Company teardowns",
  "Concepts, explained",
  "The uncomfortable",
  "Founder stories",
];

/* Tue 09:30 / 18:30 IST is the default rhythm — offered, not enforced. */
function defaultAt(hour: number, minute: number) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, minute, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hour)}:${pad(minute)}`;
}

const field =
  "w-full border border-rule bg-surface/60 px-4 py-3 text-ink outline-none transition-colors placeholder:text-faint focus:border-accent";
const label = "voice-kicker mb-2 block text-faint";

export default function ComposeForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [f, setF] = useState({
    desk: DESKS[0],
    title: "",
    coverTitle: "",
    coverSub: "",
    setup: "",
    numberLabel: "",
    numberValue: "",
    numberNote: "",
    icon: "chart",
    tier1k: "", tier1v: "",
    tier2k: "", tier2v: "",
    tier3k: "", tier3v: "",
    wrong1: "", wrong2: "", wrong3: "",
    right: "",
    finding: "",
    linkedin: "",
    instagram: "",
    hashtags: "",
    src1u: "", src1t: "",
    src2u: "", src2t: "",
    linkedinAt: defaultAt(9, 30),
    instagramAt: defaultAt(18, 30),
  });

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/studio/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          desk: f.desk,
          title: f.title,
          coverTitle: f.coverTitle,
          coverSub: f.coverSub,
          setup: f.setup,
          numberLabel: f.numberLabel,
          numberValue: f.numberValue,
          numberNote: f.numberNote,
          icon: f.icon,
          tiers: [
            { k: f.tier1k, v: f.tier1v },
            { k: f.tier2k, v: f.tier2v },
            { k: f.tier3k, v: f.tier3v },
          ],
          wrong: [f.wrong1, f.wrong2, f.wrong3],
          right: f.right,
          finding: f.finding,
          linkedin: f.linkedin,
          instagram: f.instagram,
          hashtags: f.hashtags.split(/[\s,]+/).filter(Boolean),
          sources: [
            { url: f.src1u, title: f.src1t },
            { url: f.src2u, title: f.src2t },
          ],
          // datetime-local is wall-clock with no zone; the browser's own
          // offset is the right one, since he writes these in IST.
          linkedinAt: f.linkedinAt ? new Date(f.linkedinAt).toISOString() : "",
          instagramAt: f.instagramAt ? new Date(f.instagramAt).toISOString() : "",
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? `Failed (${res.status})`);
      setResult(body.message);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  if (result) {
    return (
      <div className="panel panel-lit ticked p-8">
        <p className="voice-kicker mb-3 text-accent">Created</p>
        <p className="text-lg text-ink">{result}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/studio" className="press voice-data bg-accent px-6 py-3 text-sm font-semibold text-bg">
            OPEN THE BOARD
          </a>
          <button
            onClick={() => { setResult(null); setF((p) => ({ ...p, coverTitle: "", setup: "", right: "", wrong1: "", wrong2: "", wrong3: "", finding: "", linkedin: "", instagram: "" })); }}
            className="press voice-data border border-rule px-6 py-3 text-sm text-ink hover:border-accent hover:text-accent"
          >
            WRITE ANOTHER
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-10">
      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">1 · The hook</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="desk">Desk</label>
            <select id="desk" value={f.desk} onChange={set("desk")} className={field}>
              {DESKS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="coverSub">Sub-line (optional)</label>
            <input id="coverSub" value={f.coverSub} onChange={set("coverSub")} className={field} placeholder="Burn multiple, in 60 seconds" />
          </div>
        </div>
        <div className="mt-5">
          <label className={label} htmlFor="coverTitle">Cover title — short, it&rsquo;s set at 112px *</label>
          <input id="coverTitle" required value={f.coverTitle} onChange={set("coverTitle")} className={field} placeholder="The number founders skip" />
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">2 · The setup</h2>
        <label className={label} htmlFor="setup">What everyone assumes. Blank line between paragraphs.</label>
        <textarea id="setup" required rows={4} value={f.setup} onChange={set("setup")} className={field}
          placeholder={"Every deck shows ARR growth.\n\nAlmost none show what the growth cost."} />
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">3 · The number</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className={label} htmlFor="numberLabel">Label *</label>
            <input id="numberLabel" required value={f.numberLabel} onChange={set("numberLabel")} className={field} placeholder="Burn multiple" />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="numberValue">The number or formula *</label>
            <input id="numberValue" required value={f.numberValue} onChange={set("numberValue")} className={field} placeholder="Net burn ÷ net new ARR" />
          </div>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <label className={label} htmlFor="numberNote">Note</label>
            <input id="numberNote" value={f.numberNote} onChange={set("numberNote")} className={field} placeholder="Burn ₹4Cr to add ₹1Cr of ARR → burn multiple of 4." />
          </div>
          <div>
            <label className={label} htmlFor="icon">Pictogram</label>
            <select id="icon" value={f.icon} onChange={set("icon")} className={field}>
              {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">4 · How to read it</h2>
        <div className="flex flex-col gap-4">
          {([["tier1k","tier1v","UNDER 1.5","Efficient. Growth is earning its keep."],
             ["tier2k","tier2v","1.5 – 3","Watch it. Fine while capital is cheap."],
             ["tier3k","tier3v","OVER 3","You are buying revenue, not earning it."]] as const).map(([kk, vk, ph1, ph2]) => (
            <div key={kk} className="grid gap-4 sm:grid-cols-[10rem_1fr]">
              <input value={f[kk]} onChange={set(kk)} className={field} placeholder={ph1} />
              <input value={f[vk]} onChange={set(vk)} className={field} placeholder={ph2} />
            </div>
          ))}
        </div>
      </section>

      <section className="panel panel-lit ticked p-6 sm:p-8">
        <h2 className="voice-heading mb-2 text-xl text-ink">
          5 · The correction <span className="text-accent">— required</span>
        </h2>
        <p className="mb-6 text-sm font-light text-muted">
          The take everyone had, then what the numbers said. One line per box —
          each gets its own strike, so keep them short (~26 characters).
        </p>
        <label className={label}>The wrong take *</label>
        <div className="flex flex-col gap-3">
          <input required value={f.wrong1} onChange={set("wrong1")} className={field} placeholder="Growth rate tells you" />
          <input value={f.wrong2} onChange={set("wrong2")} className={field} placeholder="how the company is doing." />
          <input value={f.wrong3} onChange={set("wrong3")} className={field} placeholder="(third line, if needed)" />
        </div>
        <div className="mt-5">
          <label className={label} htmlFor="right">What the numbers said *</label>
          <textarea id="right" required rows={3} value={f.right} onChange={set("right")} className={field}
            placeholder="Growth rate tells you the speed. Burn multiple tells you whether you can keep going at that speed." />
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">6 · What you found</h2>
        <textarea required rows={4} value={f.finding} onChange={set("finding")} className={field}
          placeholder={"I went looking for this number in six Indian SaaS decks.\n\nFound it in zero.\n\nThat absence is the signal."} />
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">7 · Captions</h2>
        <label className={label} htmlFor="linkedin">LinkedIn — 120–200 words *</label>
        <textarea id="linkedin" required rows={7} value={f.linkedin} onChange={set("linkedin")} className={field} />
        <div className="mt-5">
          <label className={label} htmlFor="instagram">Instagram — 60–100 words (blank copies LinkedIn)</label>
          <textarea id="instagram" rows={4} value={f.instagram} onChange={set("instagram")} className={field} />
        </div>
        <div className="mt-5">
          <label className={label} htmlFor="hashtags">Hashtags — space separated</label>
          <input id="hashtags" value={f.hashtags} onChange={set("hashtags")} className={field} placeholder="#startupindia #venturecapital #mba" />
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-2 text-xl text-ink">8 · Sources</h2>
        <p className="mb-6 text-sm font-light text-muted">
          Research-first rule. The approval card says so in italics if this is empty.
        </p>
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={f.src1u} onChange={set("src1u")} className={field} placeholder="https://…" />
            <input value={f.src1t} onChange={set("src1t")} className={field} placeholder="What it is" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input value={f.src2u} onChange={set("src2u")} className={field} placeholder="https://…" />
            <input value={f.src2t} onChange={set("src2t")} className={field} placeholder="What it is" />
          </div>
        </div>
      </section>

      <section className="panel p-6 sm:p-8">
        <h2 className="voice-heading mb-6 text-xl text-ink">9 · When</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="linkedinAt">LinkedIn</label>
            <input id="linkedinAt" type="datetime-local" value={f.linkedinAt} onChange={set("linkedinAt")} className={field} />
          </div>
          <div>
            <label className={label} htmlFor="instagramAt">Instagram</label>
            <input id="instagramAt" type="datetime-local" value={f.instagramAt} onChange={set("instagramAt")} className={field} />
          </div>
        </div>
      </section>

      {error ? (
        <p role="alert" className="voice-data border border-coral/50 bg-coral/10 px-4 py-3 text-xs text-coral">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={busy}
        className="press voice-data w-full bg-accent px-8 py-5 text-sm font-semibold text-bg disabled:opacity-50">
        {busy ? "BUILDING…" : "RENDER, SCHEDULE, SEND TO TELEGRAM"}
      </button>
    </form>
  );
}
