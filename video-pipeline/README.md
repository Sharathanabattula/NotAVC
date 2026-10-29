# NotAVC video pipeline

A raw clip goes in, whisper.cpp transcribes it, and Remotion renders a framed 9:16 short with word-by-word captions in the NotAVC brand. Brand tokens come from `../brand/claude-design/` (the Claude Design system: Crimson Depth, bronze on dark, Plus Jakarta Sans / Outfit / Space Mono).

## Commands

```bash
npm install                 # Remotion + fonts
npm run setup:whisper       # clone/build whisper.cpp + base.en and medium.en models (one-off)
npm run transcribe -- raw/clip.mp4 --model base     # or --model medium (slower, more accurate)
npm run short -- raw/clip.mp4 --model base --kicker "EP.075"
npm run studio              # preview/tweak compositions in the browser
npm run reel:ranga-reddy    # data reel from the Ranga Reddy infographic -> output/ranga-reddy-reel.mp4
```

`short` writes `output/<name>-short.mp4`, plus `<name>.captions.json`, `.srt` and whisper's raw `.json`. Timings are appended to `logs/`.

## Voiceover

Record yourself (phone voice memo is fine) reading `docs/scripts/<reel>.json`, drop the file in `raw/`, then:

```bash
npm run voiceover -- raw/my-voice.m4a                 # Ranga Reddy script by default
npm run voiceover -- raw/my-voice.m4a --script docs/scripts/other.json --out output/other.mp4
```

whisper.cpp (medium) times every word, each scene starts when its line starts in your recording, and the spoken words show as captions. Read at your own pace; ad-libs and re-takes only shift the scene they're in. Scene start times are written to `output/<name>.timing.json`.

**AI copy of your voice (free, local):** Chatterbox (MIT licence) clones from 10–30 s of you talking.

```bash
npm run setup:tts                                                  # one-off, ~1 GB
npm run clone-voice -- --ref raw/my-voice-sample.wav               # writes raw/ranga-reddy-voice.wav
npm run clone-voice -- --ref raw/my-voice-sample.wav --lang hi     # Hindi / other languages
npm run voiceover -- raw/ranga-reddy-voice.wav
```

## Editing long videos (files over the 30 MB upload limit)

1. On your PC, make a small preview copy and upload that:
   `ffmpeg -i "my-video.mp4" -vf scale=-2:360 -c:v libx264 -crf 32 -preset veryfast -c:a aac -b:a 64k preview.mp4`
2. Claude transcribes the preview and writes a cut list, `output/<name>.edl.json` (`{"keep": [[start, end], ...]}` in seconds).
3. On your PC, apply it to the full-quality original (same timeline as the preview):
   `npm run cut -- "my-video.mp4" output/<name>.edl.json`

## Folders

| | |
|---|---|
| `raw/` | source footage |
| `output/` | rendered shorts, captions, srt |
| `references/` | reference reels (`yt-dlp -o "references/%(title)s.%(ext)s" <url>`) |
| `docs/formats/` | format specs |
| `logs/` | build, transcribe and render logs |
| `src/` | Remotion compositions: `FramedShort.tsx` (captioned short), `reels/` (data reels, shared `kit.tsx`), `data/geo.ts` (Telangana district + India outline paths) |
| `scripts/` | `transcribe.mjs`, `make-short.mjs`, `voiceover-reel.mjs`, `clone-voice.py`, `setup-whisper.sh` |
| `docs/scripts/` | voiceover scripts, one line per scene |

Media in `raw/`, `output/`, `references/` and `logs/`, plus `whisper.cpp/` and `node_modules/`, is git-ignored.

## Requirements

ffmpeg, Node.js 22+, git, cmake + a C++ compiler (for whisper.cpp), yt-dlp. On Windows run `scripts/setup-whisper.sh` from Git Bash with CMake and Visual Studio Build Tools installed, or download a prebuilt `whisper-bin-x64.zip` from the whisper.cpp releases and point `scripts/transcribe.mjs` at its `whisper-cli.exe`.
