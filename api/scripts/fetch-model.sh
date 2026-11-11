#!/usr/bin/env bash
# Downloads the embedding model named in api/models/manifest.json into a directory (default
# api/models/files) and checks both files against their pinned SHA-256. The files are not committed.
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
manifest="$here/models/manifest.json"
dest="${1:-$here/models/files}"
mkdir -p "$dest"

field() { node -e "const m=require(process.argv[1]);console.log(process.argv[2].split('.').reduce((o,k)=>o[k],m))" "$manifest" "$1"; }

onnx="$(field onnx.name)"
tok="$(field tokenizer.name)"
check() { echo "$(field "$1.sha256")  $dest/$(field "$1.name")" | sha256sum --check --quiet; }

if [ -f "$dest/$onnx" ] && [ -f "$dest/$tok" ] && check onnx && check tokenizer; then
  echo "Model already present in $dest"
  exit 0
fi

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
curl -fsSL "$(field source)" -o "$tmp/model.tgz"
tar -xzf "$tmp/model.tgz" -C "$tmp"
cp "$tmp/package/$onnx" "$tmp/package/$tok" "$dest/"
check onnx
check tokenizer
echo "Model ready in $dest"
