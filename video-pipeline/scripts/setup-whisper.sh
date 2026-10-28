#!/usr/bin/env bash
# Clone + build whisper.cpp and fetch the base.en (fast) and medium.en (accurate) models.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -d whisper.cpp ] || git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git
cd whisper.cpp
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j --config Release
for m in base.en medium.en; do
  [ -f "models/ggml-$m.bin" ] || bash models/download-ggml-model.sh "$m"
done
./build/bin/whisper-cli --help | head -1
