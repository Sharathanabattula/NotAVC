#!/usr/bin/env node
// Apply a cut list (EDL) to a video: keep the listed segments, join them, re-encode at full quality.
// Works on Windows/macOS/Linux; needs ffmpeg on PATH.
// Usage: node scripts/apply-edl.mjs <original video> <edl.json> [output.mp4]
// edl.json: { "keep": [[startSec, endSec], ...] }  (times from the preview copy match the original)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FADE = 0.02; // seconds of audio fade at each cut, so joins don't click

const [src, edlPath, outArg] = process.argv.slice(2);
if (!src || !edlPath) {
  console.error('Usage: node scripts/apply-edl.mjs <original video> <edl.json> [output.mp4]');
  process.exit(1);
}
const keep = JSON.parse(readFileSync(edlPath, 'utf8')).keep;
if (!Array.isArray(keep) || keep.length === 0) throw new Error('edl.json needs a non-empty "keep" list');

const parts = [];
const labels = [];
keep.forEach(([s, e], i) => {
  if (!(e > s)) throw new Error(`segment ${i} has end <= start: [${s}, ${e}]`);
  const d = e - s;
  parts.push(`[0:v]trim=start=${s}:end=${e},setpts=PTS-STARTPTS[v${i}]`);
  parts.push(`[0:a]atrim=start=${s}:end=${e},asetpts=PTS-STARTPTS,afade=t=in:d=${FADE},afade=t=out:st=${Math.max(0, d - FADE).toFixed(3)}:d=${FADE}[a${i}]`);
  labels.push(`[v${i}][a${i}]`);
});
parts.push(`${labels.join('')}concat=n=${keep.length}:v=1:a=1[v][a]`);

const logDir = join(ROOT, 'logs');
mkdirSync(logDir, { recursive: true });
const filterFile = join(logDir, 'edl-filter.txt');
writeFileSync(filterFile, parts.join(';\n'));

const out = resolve(outArg ?? join(ROOT, 'output', `${basename(src, extname(src))}-edited.mp4`));
const kept = keep.reduce((t, [s, e]) => t + (e - s), 0);
console.log(`${keep.length} segments, ${(kept / 60).toFixed(2)} min kept -> ${out}`);
execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-stats', '-y', '-i', src,
  '-filter_complex_script', filterFile, '-map', '[v]', '-map', '[a]',
  '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log('done');
