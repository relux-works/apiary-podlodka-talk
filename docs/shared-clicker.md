# Shared clicker: both speakers advance one deck

The speakers' call of 12.10 asked for this: the deck runs on one server, one speaker shares the screen, and both can move the slides with Space or the arrow keys. Access is over SSH only; nothing listens on a public address.

Status: worked out from the Slidev 52.19.1 client source, **not yet tested end to end**. Test it on the presenting host before the run-through (open-questions.md, «Общий кликер»).

## How Slidev syncs

The dev server (`slidev`, not a static build) keeps one shared state: page, click and timer. Every open tab sends its moves to it and follows the moves of others, with one rule that matters here (`@slidev/client/setup/root.ts`):

- A tab ignores updates sent by a tab of its own kind. Two presenter tabs (`/presenter`) do not follow each other directly, and neither do two viewer tabs.
- A viewer tab may send only from a trusted origin, `localhost` or `127.0.0.1` (`@slidev/client/constants.ts`). Through an SSH tunnel the origin is `localhost`, so this holds.

So the working shape is **exactly one viewer tab plus any number of presenter tabs**. A move in a presenter tab moves the viewer; the viewer then re-sends the new position as a viewer update, and every other presenter tab follows it. A move in the viewer tab moves all presenter tabs.

## Steps

1. On the presenting host (the Mac mini), in this repository, start the dev server in the background, bound to localhost:

   ```bash
   npm run present                  # .scripts/present.sh start: pid file and log in .temp/present/
   npm run present:status           # up or down, the commit, the tunnel command and the URLs
   npm run present:stop             # stop it
   .scripts/present.sh start --pull # fast-forward a clean main to origin/main first
   .scripts/present.sh start --flat # rehearsal mode, whole slides
   ```

   The script refuses to start without `node_modules` (run `npm ci` once) and warns when the checkout is behind origin/main. Smoke-tested on the Mac mini on 13.10: the page and the presenter route answer, and stop leaves no process behind. `npm start` still runs the server in the foreground.

2. On each speaker's laptop, open a tunnel to it, with your own SSH alias for the mini:

   ```bash
   ssh -N -L 3030:localhost:3030 <mini>
   ```

3. The speaker who shares the screen opens the viewer and shares that window:

   ```text
   http://localhost:3030/#/1
   ```

4. Each speaker opens the presenter view for notes, the next slide and the timer:

   ```text
   http://localhost:3030/#/presenter/1
   ```

5. Either speaker presses Space, ← or → in their own window; everyone follows. Two presses at the same moment: the last one wins.

## Laser pointer

Built in, nothing to set up. A presenter tab that has focus publishes its mouse position into the shared state, with its style: cursor or laser (`@slidev/client/pages/presenter.vue`). The viewer tab draws it (`@slidev/client/internals/LaserPointer.vue`), so the audience sees the laser of whoever points in their own presenter tab.

- Turn the laser on in the presenter tab's toolbar; «show presenter cursor» is on by default.
- The laser shows on the viewer, the shared screen; the other speaker's presenter tab shows only its own mouse.
- Point one at a time: two focused presenter tabs overwrite each other's pointer.

## Rules on stage

- Keep **one** viewer tab. A second viewer tab, for example the other speaker opening `/#/1` too, splits the sync.
- Do not use `--remote` or `--tunnel`: they listen on all interfaces or open a public URL. The SSH tunnel is the only door.
- If the tunnel drops, the shared screen keeps working; reconnect the tunnel and reload the presenter tab.
- Sync directions live in each browser's local storage (`syncDirections`: presenter and viewer, send and receive, all on by default). If a tab stops following, check the sync toggle in the presenter's navigation bar.
- `npm run dev:flat` (rehearsal mode, whole slides) syncs the same way.

## Alternatives considered (13.10)

- **A subdomain of relux.works.** A static build keeps no shared state between two laptops, so it gives no shared clicker. The dev server behind a public name would sync the shared screen, but from a non-local origin the viewer tab may not send, so the two presenter tabs stop following each other and one speaker's notes drift. It also needs a WebSocket proxy, a password and a public endpoint. Not recommended.
- **A SOCKS proxy (`ssh -D`) and Firefox.** Works only if the browser opens the deck as `localhost` or `127.0.0.1` through the proxy. Firefox never proxies localhost by default; it needs `network.proxy.allow_hijacking_localhost = true` in `about:config`. Opening the host by its own name instead makes the origin untrusted, with the drift above. A plain `ssh -L` port forward does the same with no browser setting.
- **Where the dev server runs.** The Mac mini works: the deck is a light long-running Vite process; start it about half an hour before the run-through. Both speakers need SSH access to it.
