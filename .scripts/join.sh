#!/usr/bin/env bash
# Join the shared deck from a speaker's laptop (docs/shared-clicker.md). It starts the deck on the presenting host if
# it is down, holds an SSH tunnel to it and brings the tunnel back when it drops, and opens this speaker's windows.
#
#   npm run join -- --host <ssh alias of the mini>   first time; the alias and the options below are remembered
#   npm run join                                     the presenter window «ЗАМЕТКИ»: notes, next slide, timer, laser
#   npm run join -- --share                          also the viewer window «ЭКРАН»: this speaker shares the screen
#
#   --host <alias>      the presenting host as your SSH config names it
#   --share             this speaker shares the screen; the other speaker runs join without it
#   --port <n>          the deck's port on the presenting host (3030)
#   --local-port <n>    the port on this laptop (as --port); change it when a local deck already uses that port
#   --dir <path>        the repository on the presenting host, relative to the SSH user's home
#                       (Developer/ReluxWorks/apiary-podlodka-talk)
#   --browser <name>    chrome, firefox, safari, default or none (default)
#   --no-start          only connect; do not start the deck on the presenting host
#
# Ctrl-C closes the tunnel. Run join again while a tunnel is up (in another terminal) and it only opens the window:
# with --share the viewer, to take over the screen, without it the presenter window. The windows outlive a dropped
# tunnel: Vite reloads them when it is back, and in present mode a reloaded window joins the live slide.
set -uo pipefail
cd "$(dirname "$0")/.."

CONF=.temp/join/config
SSH_LOG=.temp/join/ssh.log
HOST=""
DIR="Developer/ReluxWorks/apiary-podlodka-talk"
BROWSER="default"
if [ -f "$CONF" ]; then
  while IFS='=' read -r k v; do
    case "$k" in host) HOST=$v ;; dir) DIR=$v ;; browser) BROWSER=$v ;; esac
  done < "$CONF"
fi
PORT=3030
LPORT=""
SHARE=0
START=1
while [ $# -gt 0 ]; do
  case "$1" in
    --host) HOST="$2"; shift 2 ;;
    --share) SHARE=1; shift ;;
    --port) PORT="$2"; shift 2 ;;
    --local-port) LPORT="$2"; shift 2 ;;
    --dir) DIR="$2"; shift 2 ;;
    --browser) BROWSER="$2"; shift 2 ;;
    --no-start) START=0; shift ;;
    -h|--help) awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0"; exit 0 ;;
    *) echo "unknown option: $1 (see --help)" >&2; exit 2 ;;
  esac
done
LPORT=${LPORT:-$PORT}
case "$BROWSER" in chrome|firefox|safari|default|none) ;; *) echo "--browser: chrome, firefox, safari, default or none" >&2; exit 2 ;; esac
if [ -z "$HOST" ]; then
  echo "no host yet: npm run join -- --host <ssh alias of the presenting host>" >&2; exit 2
fi
mkdir -p "$(dirname "$CONF")"
printf 'host=%s\ndir=%s\nbrowser=%s\n' "$HOST" "$DIR" "$BROWSER" > "$CONF"

BASE="http://localhost:$LPORT"
NOTES="$BASE/#/presenter/1"
VIEWER="$BASE/#/1"
SSH_OPTS=(-o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=3 -o ControlMaster=no -o ControlPath=none)

say() { echo "[$(date +%H:%M:%S)] $*"; }
answers() { curl -fsS -o /dev/null --max-time 3 "$BASE/" 2>/dev/null; }

open_url() {
  local mac=0
  [ "$(uname)" = Darwin ] && mac=1
  case "$BROWSER" in
    none) ;;
    chrome) if [ $mac = 1 ]; then open -na "Google Chrome" --args --new-window "$1"; else google-chrome --new-window "$1" >/dev/null 2>&1 & fi ;;
    firefox) if [ $mac = 1 ]; then open -na Firefox --args -new-window "$1"; else firefox -new-window "$1" >/dev/null 2>&1 & fi ;;
    safari) open -a Safari "$1" ;;
    default) if [ $mac = 1 ]; then open "$1"; else xdg-open "$1" >/dev/null 2>&1; fi ;;
  esac
}
# A window that opens joins the live slide (present mode), so opening one mid-talk moves nobody.
open_notes() { open_url "$NOTES"; say "«ЗАМЕТКИ»  $NOTES   notes, next slide, timer; the laser from here shows on «ЭКРАН»"; }
open_viewer() { open_url "$VIEWER"; say "«ЭКРАН»    $VIEWER   share this window, full screen; keep only one of these"; }

# Port already held on this laptop: by our own tunnel from another terminal, or by something else.
holder=$(lsof -nP -iTCP:"$LPORT" -sTCP:LISTEN -t 2>/dev/null | head -1 || true)
if [ -n "$holder" ]; then
  name=$(basename "$(ps -o comm= -p "$holder" 2>/dev/null)" 2>/dev/null)
  if [ "$name" = ssh ] && answers; then
    say "a tunnel already holds port $LPORT (ssh, pid $holder) and the deck answers: opening the window only"
    if [ "$SHARE" = 1 ]; then open_viewer; else open_notes; fi
    exit 0
  fi
  echo "port $LPORT on this laptop is taken by ${name:-pid $holder}: stop it or pass --local-port <n>" >&2; exit 1
fi

if [ "$START" = 1 ]; then
  say "$HOST: starting the deck unless it runs"
  ssh "${SSH_OPTS[@]}" "$HOST" "cd '$DIR' && .scripts/present.sh start --port $PORT" 2>&1 | sed 's/^/    /'
  rc=${PIPESTATUS[0]}
  if [ "$rc" = 255 ]; then echo "cannot reach $HOST over SSH (see above)" >&2; exit 1; fi
  if [ "$rc" != 0 ]; then say "could not start the deck on $HOST (see above); connecting anyway: whoever has the repository there runs npm run present"; fi
elif ! ssh "${SSH_OPTS[@]}" "$HOST" true; then
  echo "cannot reach $HOST over SSH" >&2; exit 1
fi

if [ "$SHARE" = 1 ]; then role="you share the screen"; else role="presenter window only"; fi
say "$HOST:$PORT to localhost:$LPORT, $role"
SSH_PID=""
stop() {
  [ -n "$SSH_PID" ] && kill "$SSH_PID" 2>/dev/null
  echo; say "tunnel closed; the deck keeps running on $HOST"
  exit 0
}
trap stop INT TERM

opened=0
while true; do
  ssh -N "${SSH_OPTS[@]}" -o ExitOnForwardFailure=yes -L "$LPORT:localhost:$PORT" "$HOST" 2>>"$SSH_LOG" &
  SSH_PID=$!
  state=""
  while kill -0 "$SSH_PID" 2>/dev/null; do
    if answers; then now=up; else now=down; fi
    if [ "$now" != "$state" ]; then
      state=$now
      if [ "$now" = up ]; then say "tunnel up: the deck answers at $BASE"
      else say "no answer at $BASE yet: the tunnel is connecting, or the deck is down on $HOST"; fi
      if [ "$now" = up ] && [ "$opened" = 0 ]; then
        opened=1
        open_notes
        if [ "$SHARE" = 1 ]; then open_viewer
        else say "the other speaker shares «ЭКРАН»; to take over: npm run join -- --share in a second terminal"; fi
        say "holding the tunnel; Ctrl-C closes it"
      fi
    fi
    sleep 3 & wait $! # a signal interrupts wait at once, a plain sleep would hold the trap back
  done
  wait "$SSH_PID"; rc=$?
  SSH_PID=""
  why=$(tail -n 1 "$SSH_LOG" 2>/dev/null)
  say "tunnel dropped (ssh exit $rc${why:+: $why}); reconnecting in 3 s"
  sleep 3 & wait $!
done
