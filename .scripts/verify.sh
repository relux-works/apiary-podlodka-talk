#!/usr/bin/env bash
# One-shot quality gate for a deck: frontmatter lint → offline build → audit of
# every slide in Chromium → contact sheet. Exit code is non-zero on any finding.
#
#   .scripts/verify.sh [deck.md]        default: slides/slides.md
#
# Outputs (all under .temp/, gitignored):
#   .temp/dist-offline/   the static build, same as the release archive
#   .temp/audit/          slide-NN.png per slide, audit.json, sheet.png
#   .temp/verify.log      build log
set -euo pipefail
cd "$(dirname "$0")/.."
DECK="${1:-slides/slides.md}"
PORT="${VERIFY_PORT:-8093}"
mkdir -p .temp

python3 .scripts/check-frontmatter.py "$DECK"

echo "build: $DECK → .temp/dist-offline"
if ! npx slidev build "$DECK" --base ./ --out "$PWD/.temp/dist-offline" > .temp/verify.log 2>&1; then
  tail -30 .temp/verify.log; exit 1
fi

python3 .scripts/serve-static.py "$PORT" .temp/dist-offline > /dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
for _ in $(seq 1 25); do curl -s -o /dev/null "http://127.0.0.1:$PORT/" && break; sleep 0.2; done

rm -rf .temp/audit
set +e
node .scripts/audit-overflow.mjs "http://127.0.0.1:$PORT/" .temp/audit "$DECK"
AUDIT=$?
set -e
node .scripts/contact-sheet.mjs .temp/audit
exit $AUDIT
