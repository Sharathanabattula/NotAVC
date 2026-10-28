#!/usr/bin/env node
// Transcribe a clip with whisper.cpp and write Remotion captions.
// Usage: node scripts/transcribe.mjs raw/clip.mp4 [--model base|medium]
// Writes output/<name>.captions.json (Remotion Caption[]) and output/<name>.srt
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { basename, extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WHISPER = join(ROOT, 'whisper.cpp/build/bin/whisper-cli');
const MODELS = {
  base: join(ROOT, 'whisper.cpp/models/ggml-base.en.bin'), // fast
  medium: join(ROOT, 'whisper.cpp/models/ggml-medium.en.bin'), // accurate
};

export function transcribe(clip, model = 'base') {
  if (!existsSync(clip)) throw new Error(`No such clip: ${clip}`);
  if (!MODELS[model]) throw new Error(`Unknown model "${model}" (use base or medium)`);

  const name = basename(clip, extname(clip));
  const outDir = join(ROOT, 'output');
  const logDir = join(ROOT, 'logs');
  mkdirSync(outDir, { recursive: true });
  mkdirSync(logDir, { recursive: true });

  // whisper.cpp wants 16 kHz mono 16-bit WAV
  const wav = join(logDir, `${name}.16k.wav`);
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', clip,
    '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', wav]);

  const outBase = join(outDir, name);
  const started = Date.now();
  const log = execFileSync(WHISPER, ['-m', MODELS[model], '-f', wav, '-l', 'en',
    '-t', '4', '-ojf', '-osrt', '-of', outBase], { stdio: ['ignore', 'pipe', 'pipe'] });
  appendFileSync(join(logDir, 'transcribe.log'),
    `${new Date().toISOString()} ${name} model=${model} ${(Date.now() - started) / 1000}s\n${log}\n`);

  const json = JSON.parse(readFileSync(`${outBase}.json`, 'utf8'));
  const captions = toCaptions(json);
  writeFileSync(`${outBase}.captions.json`, JSON.stringify(captions, null, 2));
  return { name, captions, captionsPath: `${outBase}.captions.json`, srtPath: `${outBase}.srt` };
}

// whisper.cpp full JSON (-ojf) -> @remotion/captions Caption[], one entry per word.
// Tokens that start with a space begin a new word; "[_...]" tokens are control tokens.
function toCaptions(json) {
  const words = [];
  for (const seg of json.transcription) {
    for (const tok of seg.tokens) {
      if (tok.text.startsWith('[_') || tok.text.trim() === '') continue;
      const startMs = tok.offsets.from;
      const endMs = tok.offsets.to;
      const last = words[words.length - 1];
      if (last && !tok.text.startsWith(' ')) {
        last.text += tok.text;
        last.endMs = endMs;
        last.confidence = Math.min(last.confidence, tok.p);
      } else {
        words.push({ text: tok.text, startMs, endMs, timestampMs: startMs, confidence: tok.p });
      }
    }
  }
  return words;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [clip, ...rest] = process.argv.slice(2);
  if (!clip) {
    console.error('Usage: node scripts/transcribe.mjs <clip> [--model base|medium]');
    process.exit(1);
  }
  const mi = rest.indexOf('--model');
  const { captions, captionsPath, srtPath } = transcribe(clip, mi >= 0 ? rest[mi + 1] : 'base');
  console.log(captions.map((c) => c.text).join('').trim());
  console.log(`\n${captions.length} words -> ${captionsPath}\nsrt -> ${srtPath}`);
}
