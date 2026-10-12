#!/usr/bin/env bash
# Serve the deck for the shared clicker (docs/shared-clicker.md): the Slidev dev server, localhost only,
# in the background with a pid file and a log. Run it on the presenting host (the Mac mini by default);
# each speaker reaches it through an SSH port forward. Sync between the windows needs the dev server,
# a static build does not sync.
#
#   .scripts/present.sh start [--port 3030] [--flat] [--pull]   start, or report that it already runs
#   .scripts/present.sh status [--port 3030]                     up or down, commit, the URLs and the tunnel
#   .scripts/present.sh stop                                     stop the server this script started
#   .scripts/present.sh logs                                     the last lines of the server log
#
#   --flat   rehearsal mode: every slide whole, arrows move by slides (VITE_FLAT_CLICKS=1)
#   --pull   fast-forward main to origin/main first (only on a clean main)
set -euo pipefail
cd "$(dirname "$0")/.."

STATE=.temp/present
PIDFILE="$STATE/server.pid"
LOG="$STATE/server.log"
PORT=3030
FLAT=0
PULL=0
cmd="${1:-status}"
shift || true
while [ $# -gt 0 ]; do
  case "$1" in
    --port) PORT="$2"; shift 2 ;;
    --flat) FLAT=1; shift ;;
    --pull) PULL=1; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
mkdir -p "$STATE"

host_name() { scutil --get LocalHostName 2>/dev/null || hostname -s; }
running() { [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; }
answers() { curl -fsS -o /dev/null --max-time 3 "http://localhost:$PORT/" 2>/dev/null; }

print_access() {
  cat <<EOF
deck:     $(git rev-parse --short HEAD) on $(git rev-parse --abbrev-ref HEAD), port $PORT, localhost only
tunnel:   ssh -N -L $PORT:localhost:$PORT $(host_name)        # on each speaker's laptop
viewer:   http://localhost:$PORT/#/1                   # ONE window, the one you share on screen
notes:    http://localhost:$PORT/#/presenter/1         # each speaker; the laser from here shows on the viewer
EOF
}

case "$cmd" in
  start)
    if running; then echo "already running (pid $(cat "$PIDFILE"))"; print_access; exit 0; fi
    if [ ! -x node_modules/.bin/slidev ]; then
      echo "node_modules/.bin/slidev is missing: run 'npm ci' in this repository first" >&2; exit 1
    fi
    if [ "$PULL" = 1 ]; then
      if [ "$(git rev-parse --abbrev-ref HEAD)" != main ] || [ -n "$(git status --porcelain)" ]; then
        echo "--pull needs a clean checkout of main" >&2; exit 1
      fi
      git fetch -q origin && git merge -q --ff-only origin/main
    fi
    git fetch -q origin 2>/dev/null || true
    behind=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
    [ "$behind" != 0 ] && echo "warning: this checkout is $behind commit(s) behind origin/main (use --pull)"
    if [ "$FLAT" = 1 ]; then export VITE_FLAT_CLICKS=1; fi
    nohup node_modules/.bin/slidev slides/slides.md --port "$PORT" < /dev/null > "$LOG" 2>&1 &
    echo $! > "$PIDFILE"
    for _ in $(seq 1 60); do
      if answers; then echo "up (pid $(cat "$PIDFILE"))"; print_access; exit 0; fi
      if ! running; then echo "the server exited; last log lines:" >&2; tail -n 20 "$LOG" >&2; rm -f "$PIDFILE"; exit 1; fi
      sleep 1
    done
    echo "started (pid $(cat "$PIDFILE")) but port $PORT does not answer yet; see $LOG" >&2
    exit 1
    ;;
  status)
    if running && answers; then echo "up (pid $(cat "$PIDFILE"))"; print_access
    elif running; then echo "process $(cat "$PIDFILE") runs, port $PORT does not answer; see $LOG"
    else echo "down"; fi
    ;;
  stop)
    if running; then
      pid=$(cat "$PIDFILE"); kill "$pid"
      for _ in $(seq 1 20); do kill -0 "$pid" 2>/dev/null || break; sleep 0.5; done
      kill -0 "$pid" 2>/dev/null && kill -9 "$pid"
      echo "stopped (pid $pid)"
    else echo "not running"; fi
    rm -f "$PIDFILE"
    ;;
  logs) tail -n 40 "$LOG" 2>/dev/null || echo "no log yet" ;;
  *) echo "usage: $0 start|status|stop|logs [--port N] [--flat] [--pull]" >&2; exit 2 ;;
esac
