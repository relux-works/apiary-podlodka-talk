#!/usr/bin/env bash
# The hosted job «Build, audit, PDF» (.github/workflows/build.yml), step by step on this machine, for while GitHub
# Actions cannot run (16.10: the account's billing stops every job before it starts; Alexey: «забиваем на сиай,
# прогоняем на локале и льем в транк»). Every lane runs even after a red one; the summary names each lane's verdict and
# the exit code is non-zero when any lane failed. Logs: .temp/ci-local/<lane>.log.
#
#   .scripts/ci-local.sh            (from the repository root, on the commit to land, with a clean tree)
#
# Not mirrored: «Shared server outlives its caller» needs setsid (Linux); macOS has none, so that lane is reported as
# skipped, not passed. The artifact upload has no local counterpart: outputs stay in .temp/.
set -u
cd "$(git rev-parse --show-toplevel)"
out=.temp/ci-local
rm -rf "$out"; mkdir -p "$out"
results=()
lane() { # lane <name> <command…>
  local name=$1; shift
  printf '== %s … ' "$name"
  if "$@" > "$out/$name.log" 2>&1; then echo ok; results+=("ok    $name"); else echo "FAIL (exit $?)"; results+=("FAIL  $name   $out/$name.log"); fi
}
skip() { echo "== $1 … skipped: $2"; results+=("skip  $1   $2"); }

head=$(git rev-parse --short HEAD)
dirty=$(git status --porcelain --untracked-files=no)
echo "commit $head$( [ -n "$dirty" ] && echo ' (tracked changes not committed: the lanes test the working tree, not the commit)')"

lane npm-ci npm ci
lane lint npm run lint
lane check-sync npm run check:sync
if command -v setsid > /dev/null; then
  lane server-outlives-caller bash -c '
    mkdir -p .temp
    setsid bash -c "echo \$\$ > .temp/caller.pgid; .scripts/present.sh start --port 8091 > .temp/present-start.log 2>&1"
    kill -TERM -- "-$(cat .temp/caller.pgid)" 2>/dev/null || true
    sleep 3
    rc=0; .scripts/present.sh status --port 8091 | head -1 | grep -q "^up" && curl -fsS -o /dev/null http://localhost:8091/ || rc=$?
    .scripts/present.sh stop || true
    exit $rc'
else
  skip server-outlives-caller 'no setsid on this machine (hosted runner only)'
fi
lane verify-deck bash -c 'rc=0; npm run verify || rc=$?; rm -rf .temp/audit-deck; mv .temp/audit .temp/audit-deck || true; exit $rc'
lane static-demos bash -c '
  python3 .scripts/serve-static.py 8096 .temp/dist-offline > /dev/null 2>&1 &
  server=$!
  for _ in $(seq 1 25); do curl -s -o /dev/null http://127.0.0.1:8096/ && break; sleep 0.2; done
  rc=0; node .scripts/static-demos.mjs http://127.0.0.1:8096/ slides/slides.md || rc=$?
  kill $server; exit $rc'
lane verify-galleries bash -c '
  rc=0
  check() { local r=0; VERIFY_PORT=$1 .scripts/verify.sh "$2" || r=$?; rm -rf ".temp/audit-$3"; mv .temp/audit ".temp/audit-$3" || true; [ $r = 0 ] || rc=$r; }
  check 8093 slides/diagrams.md diagrams
  check 8094 themes/rwb-tech/example.md rwb-tech
  check 8095 themes/rwb-minimal/example.md rwb-minimal
  check 8098 slides/demos.md demos
  exit $rc'
lane export-pdf npm run export
lane demo-frames bash -c '
  rc=0
  for s in 2 3; do
    node .scripts/demo-frames.mjs --deck slides/demos.md --slide $s --port 8097 --video --out .temp/demo-frames/slide-$s || rc=$?
    node .scripts/contact-sheet.mjs .temp/demo-frames/slide-$s 2 || rc=$?
  done
  for s in $(node .scripts/static-demos.mjs --list slides/slides.md); do
    node .scripts/demo-frames.mjs --deck slides/slides.md --slide $s --port 8097 --at 1500,5000,10000,15000,20000,25000,30000,35000,40000,45000,50000,58000 --out .temp/demo-frames/deck-$s || rc=$?
    node .scripts/contact-sheet.mjs .temp/demo-frames/deck-$s 3 || rc=$?
  done
  exit $rc'
lane click-frames node .scripts/click-frames.mjs --deck slides/slides.md --port 8099 --out .temp/click-frames

echo
echo "ci-local on $head, $(uname -sm), node $(node -v):"
printf '  %s\n' "${results[@]}"
printf '%s\n' "${results[@]}" | grep -q '^FAIL' && exit 1 || exit 0
