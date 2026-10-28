#!/usr/bin/env python3
"""Read a reel script in a cloned voice with Chatterbox (MIT licence, runs locally, free).

Usage:
  .venv-tts/bin/python scripts/clone-voice.py --ref raw/my-voice-sample.wav \
      [--script docs/scripts/ranga-reddy.json] [--out raw/ranga-reddy-voice.wav] [--lang hi]

--ref is 10-30 s of you talking clearly, alone, no music. Without --lang it uses the
English model; with --lang (hi, ta, ...) it uses the multilingual one. Outputs carry
Resemble's inaudible PerTh watermark.
"""
import argparse
import json
import time
from pathlib import Path

import torch
import torchaudio

ROOT = Path(__file__).resolve().parent.parent
GAP_S = 0.35  # pause between lines


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ref", required=True, help="reference recording of your voice")
    ap.add_argument("--script", default=str(ROOT / "docs/scripts/ranga-reddy.json"))
    ap.add_argument("--out", default=None)
    ap.add_argument("--lang", default=None, help="language id for the multilingual model, e.g. hi")
    ap.add_argument("--exaggeration", type=float, default=0.5, help="0.25 flat ... 1.0 dramatic")
    ap.add_argument("--cfg", type=float, default=0.5, help="lower = slower, more deliberate pacing")
    a = ap.parse_args()

    script = json.loads(Path(a.script).read_text())
    out = Path(a.out or ROOT / "raw" / f"{Path(a.script).stem}-voice.wav")

    started = time.time()
    if a.lang:
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        model = ChatterboxMultilingualTTS.from_pretrained(device="cpu")
        say = lambda text: model.generate(text, language_id=a.lang, audio_prompt_path=a.ref,
                                          exaggeration=a.exaggeration, cfg_weight=a.cfg)
    else:
        from chatterbox.tts import ChatterboxTTS
        model = ChatterboxTTS.from_pretrained(device="cpu")
        say = lambda text: model.generate(text, audio_prompt_path=a.ref,
                                          exaggeration=a.exaggeration, cfg_weight=a.cfg)

    gap = torch.zeros(1, int(model.sr * GAP_S))
    parts = []
    for scene in script["scenes"]:
        t = time.time()
        parts += [say(scene["line"]), gap]
        print(f"{scene['id']:<10} {time.time() - t:5.1f}s  {scene['line']}", flush=True)

    out.parent.mkdir(parents=True, exist_ok=True)
    torchaudio.save(str(out), torch.cat(parts, dim=1), model.sr)
    print(f"\n{out} ({time.time() - started:.0f}s total)")


if __name__ == "__main__":
    main()
