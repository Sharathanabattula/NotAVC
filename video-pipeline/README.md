# NotAVC video pipeline

A raw clip goes in, whisper.cpp transcribes it, and Remotion renders a framed 9:16 short with word-by-word captions in the NotAVC brand. Brand tokens come from `../brand/claude-design/` (the Claude Design system: Crimson Depth, bronze on dark, Plus Jakarta Sans / Outfit / Space Mono).

## Commands

```bash
npm install                 # Remotion + fonts
npm run setup:whisper       # clone/build whisper.cpp + base.en and medium.en models (one-off)
npm run transcribe -- raw/clip.mp4 --model base     # or --model medium (slower, more accurate)
npm run short -- raw/clip.mp4 --model base --kicker "EP.075"
npm run studio              # preview/tweak the FramedShort composition in the browser
```

`short` writes `output/<name>-short.mp4`, plus `<name>.captions.json`, `.srt` and whisper's raw `.json`. Timings are appended to `logs/`.

## Folders

| | |
|---|---|
| `raw/` | source footage |
| `output/` | rendered shorts, captions, srt |
| `references/` | reference reels (`yt-dlp -o "references/%(title)s.%(ext)s" <url>`) |
| `docs/formats/` | format specs |
| `logs/` | build, transcribe and render logs |
| `src/` | Remotion composition (`FramedShort.tsx`, `brand.ts`) |
| `scripts/` | `transcribe.mjs`, `make-short.mjs`, `setup-whisper.sh` |

Media in `raw/`, `output/`, `references/` and `logs/`, plus `whisper.cpp/` and `node_modules/`, is git-ignored.

## Requirements

ffmpeg, Node.js 22+, git, cmake + a C++ compiler (for whisper.cpp), yt-dlp. On Windows run `scripts/setup-whisper.sh` from Git Bash with CMake and Visual Studio Build Tools installed, or download a prebuilt `whisper-bin-x64.zip` from the whisper.cpp releases and point `scripts/transcribe.mjs` at its `whisper-cli.exe`.
