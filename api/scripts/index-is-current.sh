#!/usr/bin/env bash
# Compares the commits the live index was built from (GET /api/ask/meta) with the head of each indexed
# repository's default branch. Prints what changed and exits 1 when the index is stale, or when the live
# site can't say; exits 0 when every repository is where the index left it. The nightly run in
# .github/workflows/ask.yml uses it to rebuild only when some repository's docs may have moved.
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
meta_url="${1:-https://nathanzimmerman.com/api/ask/meta}"

if ! meta="$(curl -fsS --max-time 20 "$meta_url")"; then
  echo "The live index can't be read from $meta_url; rebuilding."
  exit 1
fi

stale=0
while IFS=$'\t' read -r key github; do
  indexed="$(jq -r --arg key "$key" '.repos[] | select(.key == $key) | .commit' <<<"$meta")"
  head="$(git ls-remote "https://github.com/$github" HEAD | cut -f1)"
  if [ -z "$indexed" ]; then
    echo "$key is not in the live index."
    stale=1
  elif [ "$indexed" != "$head" ]; then
    echo "$key moved from ${indexed:0:7} to ${head:0:7}."
    stale=1
  else
    echo "$key is current at ${head:0:7}."
  fi
done < <(jq -r '.repos[] | [.key, .gitHub] | @tsv' "$here/corpus.json")

exit "$stale"
