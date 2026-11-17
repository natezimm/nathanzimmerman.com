#!/usr/bin/env bash
# Shallow-clones the four sibling repositories into a directory (default api/corpus-repos) at the head of
# their default branch, and writes this site's project data as Markdown, so the indexer has every file
# corpus.json allows. Prints the --repo arguments for the indexer.
set -euo pipefail

here="$(cd "$(dirname "$0")/.." && pwd)"
site="$(cd "$here/.." && pwd)"
dest="${1:-$here/corpus-repos}"
mkdir -p "$dest"

for repo in wheelhouse know-ball rabbit-ears brick-breaker-resume; do
  if [ -d "$dest/$repo/.git" ]; then
    git -C "$dest/$repo" fetch --quiet --depth 1 origin HEAD
    git -C "$dest/$repo" reset --quiet --hard FETCH_HEAD
  else
    git clone --quiet --depth 1 "https://github.com/natezimm/$repo" "$dest/$repo"
  fi
done

(cd "$site" && node scripts/export-site-data.mjs api/generated/portfolio.md) >&2

echo "--repo nathanzimmerman.com=$site --repo wheelhouse=$dest/wheelhouse --repo know-ball=$dest/know-ball --repo rabbit-ears=$dest/rabbit-ears --repo brick-breaker-resume=$dest/brick-breaker-resume"
