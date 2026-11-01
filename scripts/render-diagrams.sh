#!/usr/bin/env bash
# Renders each docs/diagrams/<slug>.mmd to src/assets/diagrams/<slug>.svg for
# the project pages. The sources are copies of each project's containers
# diagram from its README; copy them again when a project's diagram changes.
# Set PUPPETEER_EXECUTABLE_PATH to use an installed Chromium.
set -euo pipefail
cd "$(dirname "$0")/.."

puppeteer_config=$(mktemp)
trap 'rm -f "$puppeteer_config"' EXIT
if [ -n "${PUPPETEER_EXECUTABLE_PATH:-}" ]; then
  printf '{"executablePath":"%s","args":["--no-sandbox","--headless"]}' \
    "$PUPPETEER_EXECUTABLE_PATH" > "$puppeteer_config"
else
  echo '{}' > "$puppeteer_config"
fi

mkdir -p src/assets/diagrams
for source in docs/diagrams/*.mmd; do
  slug=$(basename "$source" .mmd)
  npx -y @mermaid-js/mermaid-cli@11.4.2 \
    -p "$puppeteer_config" -c scripts/mermaid.json -b white \
    -i "$source" -o "src/assets/diagrams/$slug.svg"
done
