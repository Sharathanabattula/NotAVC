#!/usr/bin/env node
// raw clip -> whisper.cpp captions -> framed vertical short with captions.
// Usage: node scripts/make-short.mjs raw/clip.mp4 [--model base|medium] [--label NotAVC] [--kicker "RAW CUT"]
// Output: output/<name>-short.mp4
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, appendFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { transcribe } from './transcribe.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const clip = args[0];
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
if (!clip) {
  console.error('Usage: node scripts/make-short.mjs <clip> [--model base|medium] [--label X] [--kicker Y]');
  process.exit(1);
}

const { name, captions } = transcribe(clip, opt('--model', 'base'));
console.log(`transcribed ${captions.length} words`);

const probe = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height:format=duration', '-of', 'json', clip], { encoding: 'utf8' }));

// Remotion serves media from public/, so stage a copy there
const work = join(ROOT, 'public/_work');
mkdirSync(work, { recursive: true });
copyFileSync(clip, join(work, `${name}.mp4`));

const inputProps = {
  videoSrc: `_work/${name}.mp4`,
  captions,
  durationInSeconds: Number(probe.format.duration),
  sourceWidth: probe.streams[0].width,
  sourceHeight: probe.streams[0].height,
  label: opt('--label', 'NotAVC'),
  kicker: opt('--kicker', 'RAW CUT'),
};

const serveUrl = await bundle({ entryPoint: join(ROOT, 'src/index.ts') });
const composition = await selectComposition({ serveUrl, id: 'FramedShort', inputProps });
const outputLocation = join(ROOT, 'output', `${name}-short.mp4`);
const started = Date.now();
let lastPct = -1;
await renderMedia({
  composition, serveUrl, codec: 'h264', outputLocation, inputProps, logLevel: 'error',
  onProgress: ({ progress }) => {
    const pct = Math.floor(progress * 10) * 10;
    if (pct !== lastPct) process.stdout.write(`rendering ${(lastPct = pct)}%\n`);
  },
});
const secs = (Date.now() - started) / 1000;
appendFileSync(join(ROOT, 'logs/render.log'), `${new Date().toISOString()} ${name} ${secs}s -> ${outputLocation}\n`);
console.log(`\ndone in ${secs}s -> ${outputLocation}`);
