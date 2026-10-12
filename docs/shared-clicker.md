# Shared clicker: both speakers advance one deck

The speakers' call of 12.10 asked for this: the deck runs on one server, one speaker shares the screen, and both can move the slides with Space or the arrow keys. Access is over SSH only; nothing listens on a public address.

Status (13.10): the sync, the join rule and the window titles below pass in headless Chromium on the Mac mini, both directly and through a TCP forward that stands in for the SSH tunnel, and in CI on every push (`npm run check:sync`, `.scripts/sync-check.mjs`). `join.sh` passed end to end on the mini with an SSH test double: it started the deck, held the tunnel, reconnected after a drop, and closed on Ctrl-C. **Not yet tested with two laptops and real SSH**: do that on the rehearsal (open-questions.md, «Общий кликер»).

## One command per laptop

Each speaker needs a checkout of this repository and SSH access to the presenting host (the Mac mini). The script needs bash, ssh and curl, not `npm install`.

```bash
npm run join -- --host <ssh alias of the mini>   # first time; the alias is kept in .temp/join/config
npm run join                                     # the presenter window «ЗАМЕТКИ»
npm run join -- --share                          # also the viewer window «ЭКРАН»: this speaker shares the screen
```

What it does:

1. Starts the deck on the mini over SSH unless it already runs (`.scripts/present.sh start`). Two speakers starting at once is safe: one start runs at a time. If the SSH user cannot reach the repository there, the script says so and connects anyway.
2. Holds `ssh -N -L 3030:localhost:3030 <mini>` with keepalives, so a dead link shows within about 15 seconds, and reconnects 3 seconds after any drop. The open windows reload on their own when the tunnel is back (Vite does that) and join the live slide.
3. Opens the windows once the deck answers: «ЗАМЕТКИ» always, «ЭКРАН» with `--share`. `--browser chrome|firefox|safari|default|none` picks the browser and is remembered.
4. Ctrl-C closes the tunnel; the deck keeps running on the mini.

To take over the screen, for example when the sharing speaker's link fails, the other speaker runs `npm run join -- --share` in a second terminal. The tunnel stays, and a viewer window opens at the live slide. Share it, and close the old viewer once it is back.

Other options: `--port` (the deck's port on the mini, 3030), `--local-port` (when a local deck already uses that port on the laptop), `--dir` (the repository on the mini, relative to the SSH user's home; `Developer/ReluxWorks/apiary-podlodka-talk`), `--no-start`.

## Who shares the screen

The role decides which windows open: the speaker who shares runs join with `--share`, the other without it. The deck itself needs no names. The shared window is the viewer, and every window knows whether it is one (`useNav().isPresenter` is false there), so a demo component can draw only on the shared screen and keep its controls in the presenter windows.

The window titles mark the windows for the call's share dialog: «ЭКРАН · …» is the viewer, «ЗАМЕТКИ · …» a presenter window. Never share a «ЗАМЕТКИ» window: it shows the notes.

## Present mode

`npm run present` runs the dev server with `VITE_PRESENT=1`, which turns on two things in `slides/setup/present.ts`. `npm run dev`, the build and the PDF stay plain Slidev.

- **A window that opens or reloads joins the live slide and click.** Plain Slidev sends a window's position after every route change, its first one included, so a window opened at its own URL pulls everyone to its slide. Probe on the mini, 13.10: a presenter window opened at `/presenter/1` sent the shared screen from slide 10 back to slide 1, and a reload that had missed moves and a second viewer window did the same. In present mode a new window sends nothing until it has taken the live position.
- **Window titles** «ЭКРАН» and «ЗАМЕТКИ».

## How Slidev syncs

The dev server (`slidev`, not a static build) keeps one shared state: page, click and timer. Every open tab sends its moves to it and follows the moves of others, with one rule that matters here (`@slidev/client/setup/root.ts`):

- A tab ignores updates sent by a tab of its own kind. Two presenter tabs (`/presenter`) do not follow each other directly, and neither do two viewer tabs.
- A viewer tab may send only from a trusted origin, `localhost` or `127.0.0.1` (`@slidev/client/constants.ts`). Through an SSH tunnel the origin is `localhost`, so this holds.

So the working shape is **one viewer tab plus any number of presenter tabs**. A move in a presenter tab moves the viewer; the viewer then re-sends the new position as a viewer update, and every other presenter tab follows it. A move in the viewer tab moves all presenter tabs. With the viewer closed, the two presenter tabs stop following each other until a viewer is back.

## By hand, without join.sh

1. On the mini, in this repository: `npm run present` (`.scripts/present.sh start`; pid file and log in `.temp/present/`). `npm run present:status` shows the commit, the tunnel command and the URLs; `npm run present:stop` stops it. `.scripts/present.sh start --pull` fast-forwards a clean main first; `--flat` is the rehearsal mode with whole slides. The script refuses to start without `node_modules` (run `npm ci` once) and warns when the checkout is behind origin/main.
2. On each laptop: `ssh -N -L 3030:localhost:3030 <mini>`.
3. The speaker who shares opens the viewer `http://localhost:3030/#/1` and shares that window.
4. Each speaker opens the presenter view `http://localhost:3030/#/presenter/1` for notes, the next slide and the timer.
5. Either speaker presses Space, ← or → in their own window; everyone follows. Two presses at the same moment: the last one wins.

## Laser pointer

Built in, nothing to set up. A presenter tab that has focus publishes its mouse position into the shared state, with its style: cursor or laser (`@slidev/client/pages/presenter.vue`). The viewer tab draws it (`@slidev/client/internals/LaserPointer.vue`), so the audience sees the laser of whoever points in their own presenter tab.

- Turn the laser on in the presenter tab's toolbar; «show presenter cursor» is on by default.
- The laser shows on the viewer, the shared screen; the other speaker's presenter tab shows only its own mouse.
- Point one at a time: two focused presenter tabs overwrite each other's pointer.

## Rules on stage

- Keep **one** viewer window «ЭКРАН» and share it, never a «ЗАМЕТКИ» window.
- Do not use `--remote` or `--tunnel`: they listen on all interfaces or open a public URL. The SSH tunnel is the only door.
- The dev server also serves Slidev's MCP endpoint `/__mcp`, which can move and edit slides. Like the deck, it is reachable only on the mini itself and through the tunnels.
- If the tunnel drops, join.sh brings it back, and the windows reload and join the live slide on their own. Do not press keys in a window until it shows the current slide again.
- Sync directions live in each browser's local storage (`syncDirections`: presenter and viewer, send and receive, all on by default). If a window stops following, check the sync toggle in the presenter's navigation bar.
- A rehearsal with whole slides on the shared server: `.scripts/present.sh start --flat`; it syncs the same way.

## Alternatives considered (13.10)

- **A subdomain of relux.works.** A static build keeps no shared state between two laptops, so it gives no shared clicker. The dev server behind a public name would sync the shared screen, but from a non-local origin the viewer tab may not send, so the two presenter tabs stop following each other and one speaker's notes drift. It also needs a WebSocket proxy, a password and a public endpoint. Not recommended.
- **A SOCKS proxy (`ssh -D`) and Firefox.** Works only if the browser opens the deck as `localhost` or `127.0.0.1` through the proxy. Firefox never proxies localhost by default; it needs `network.proxy.allow_hijacking_localhost = true` in `about:config`. Opening the host by its own name instead makes the origin untrusted, with the drift above. A plain `ssh -L` port forward does the same with no browser setting.
- **Where the dev server runs.** The Mac mini works: the deck is a light long-running Vite process; start it about half an hour before the run-through. Both speakers need SSH access to it.
