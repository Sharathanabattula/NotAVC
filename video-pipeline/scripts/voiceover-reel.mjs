#!/usr/bin/env node
// Voiceover -> whisper.cpp word timings -> scenes retimed to the voice -> rendered reel with captions.
// Usage: node scripts/voiceover-reel.mjs raw/voice.m4a [--script docs/scripts/ranga-reddy.json] [--model medium] [--out output/x.mp4] [--captions script|spoken]
// Each scene starts when its line starts in the recording, so read at your own pace.
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { basename, extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { transcribe } from './transcribe.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FPS = 30;
const LEAD_MS = 250; // scene appears just before its first word
const MIN_SCENE = 60; // frames; keeps very quick lines readable
const TAIL_MS = 1500; // hold the last scene after the voice ends

const args = process.argv.slice(2);
const audio = args[0];
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
if (!audio) {
  console.error('Usage: node scripts/voiceover-reel.mjs <voice file> [--script docs/scripts/ranga-reddy.json] [--model base|medium] [--out output/x.mp4]');
  process.exit(1);
}
const script = JSON.parse(readFileSync(opt('--script', join(ROOT, 'docs/scripts/ranga-reddy.json')), 'utf8'));

const { name, captions } = transcribe(audio, opt('--model', 'medium'));
const audioMs = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
  '-of', 'csv=p=0', audio], { encoding: 'utf8' })) * 1000;

const { starts, scriptCaptions } = align(script.scenes, captions);
// Captions show the script's spelling (IIIT, ₹, Kokapet) with whisper's timing;
// --captions spoken shows whisper's own words instead, e.g. for heavy ad-libbing
const shownCaptions = opt('--captions', 'script') === 'spoken' ? captions : scriptCaptions;
const durations = {};
let prev = 0;
script.scenes.forEach((scene, i) => {
  const startF = i === 0 ? 0 : Math.max(prev + MIN_SCENE, Math.round(((starts[i] - LEAD_MS) / 1000) * FPS));
  const endF = i === script.scenes.length - 1
    ? Math.round(((audioMs + TAIL_MS) / 1000) * FPS)
    : Math.round(((starts[i + 1] - LEAD_MS) / 1000) * FPS);
  durations[scene.id] = Math.max(MIN_SCENE, endF - startF);
  prev = startF;
});

const timingPath = join(ROOT, 'output', `${name}.timing.json`);
writeFileSync(timingPath, JSON.stringify({ starts, durations }, null, 2));
console.table(script.scenes.map((s, i) => ({ scene: s.id, startS: (starts[i] / 1000).toFixed(2), frames: durations[s.id] })));

// Remotion serves media from public/, so stage the voice there
const work = join(ROOT, 'public/_work');
mkdirSync(work, { recursive: true });
const audioName = `${name}${extname(audio)}`;
copyFileSync(audio, join(work, audioName));

const inputProps = { durations, audioSrc: `_work/${audioName}`, captions: shownCaptions };
const serveUrl = await bundle({ entryPoint: join(ROOT, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: script.composition, inputProps });
const outputLocation = resolve(opt('--out', join(ROOT, 'output', `${basename(audio, extname(audio))}-reel.mp4`)));
const started = Date.now();
let lastPct = -1;
await renderMedia({
  composition, serveUrl, codec: 'h264', crf: 18, outputLocation, inputProps, logLevel: 'error',
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 10) * 10;
    if (pct !== lastPct) process.stdout.write(`rendering ${(lastPct = pct)}%\n`);
  },
});
const secs = (Date.now() - started) / 1000;
appendFileSync(join(ROOT, 'logs/render.log'), `${new Date().toISOString()} ${script.composition} voiced ${secs}s -> ${outputLocation}\n`);
console.log(`\ndone in ${secs}s -> ${outputLocation}`);

// Match script words to spoken words with a longest-common-subsequence alignment, so
// ad-libs, skipped words and re-takes only shift things locally. Script words with no
// spoken match get times interpolated from their matched neighbours.
function align(scenes, words) {
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
  const scriptWords = scenes.flatMap((s, i) => s.line.split(/\s+/).filter((w) => norm(w)).map((text) => ({ text, w: norm(text), scene: i })));
  const spoken = words.map((c) => ({ w: norm(c.text), ms: c.startMs, endMs: c.endMs })).filter((x) => x.w);

  const n = scriptWords.length;
  const m = spoken.length;
  const dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = scriptWords[i].w === spoken[j].w ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  // script word index -> spoken index; an unmatched script word takes the first unmatched
  // spoken word between its matched neighbours (whisper often respells numbers and names)
  const match = new Array(n).fill(-1);
  for (let i = 0, j = 0; i < n && j < m;) {
    if (scriptWords[i].w === spoken[j].w) { match[i++] = j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  for (let i = 0; i < n; i++) {
    if (match[i] !== -1) continue;
    const prevJ = i > 0 ? match[i - 1] : -1;
    let k = i + 1;
    while (k < n && match[k] === -1) k++;
    const nextJ = k < n ? match[k] : m;
    if (prevJ + 1 < nextJ) match[i] = prevJ + 1;
  }

  // times per script word; still-unmatched words are spread evenly between neighbours
  const times = match.map((j) => (j === -1 ? null : spoken[j].ms));
  const lastMs = m ? spoken[m - 1].endMs : 0;
  for (let i = 0; i < n; i++) {
    if (times[i] !== null) continue;
    let k = i;
    while (k < n && times[k] === null) k++;
    const lo = i > 0 ? times[i - 1] : 0;
    const hi = k < n ? times[k] : lastMs;
    for (let x = i; x < k; x++) times[x] = Math.round(lo + ((hi - lo) * (x - i + 1)) / (k - i + 1));
    i = k;
  }
  for (let i = 1; i < n; i++) times[i] = Math.max(times[i], times[i - 1]);

  const starts = scenes.map((_, s) => (s === 0 ? 0 : times[scriptWords.findIndex((x) => x.scene === s)]));
  const scriptCaptions = scriptWords.map((x, i) => {
    const endMs = i + 1 < n && scriptWords[i + 1].scene === x.scene ? times[i + 1] : Math.min(times[i] + 700, i + 1 < n ? times[i + 1] : lastMs);
    return { text: ` ${x.text}`, startMs: times[i], endMs: Math.max(endMs, times[i] + 80), timestampMs: times[i], confidence: 1 };
  });
  return { starts, scriptCaptions };
}
