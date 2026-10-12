# Shared clicker: both speakers advance one deck

The speakers' call of 12.10 asked for this: the deck runs on one server, one speaker shares the screen, and both can move the slides with Space or the arrow keys. Access is over SSH only; nothing listens on a public address.

Status: worked out from the Slidev 52.19.1 client source, **not yet tested end to end**. Test it on the presenting host before the run-through (open-questions.md, «Общий кликер»).

## How Slidev syncs

The dev server (`slidev`, not a static build) keeps one shared state: page, click and timer. Every open tab sends its moves to it and follows the moves of others, with one rule that matters here (`@slidev/client/setup/root.ts`):

- A tab ignores updates sent by a tab of its own kind. Two presenter tabs (`/presenter`) do not follow each other directly, and neither do two viewer tabs.
- A viewer tab may send only from a trusted origin, `localhost` or `127.0.0.1` (`@slidev/client/constants.ts`). Through an SSH tunnel the origin is `localhost`, so this holds.

So the working shape is **exactly one viewer tab plus any number of presenter tabs**. A move in a presenter tab moves the viewer; the viewer then re-sends the new position as a viewer update, and every other presenter tab follows it. A move in the viewer tab moves all presenter tabs.

## Steps

1. On the presenting host, in this repository, start the dev server bound to localhost (the default without `--remote`):

   ```bash
   npm start          # slidev slides/slides.md, http://localhost:3030
   ```

2. On each speaker's laptop, open a tunnel to it:

   ```bash
   ssh -N -L 3030:localhost:3030 <presenting-host>
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

## Rules on stage

- Keep **one** viewer tab. A second viewer tab, for example the other speaker opening `/#/1` too, splits the sync.
- Do not use `--remote` or `--tunnel`: they listen on all interfaces or open a public URL. The SSH tunnel is the only door.
- If the tunnel drops, the shared screen keeps working; reconnect the tunnel and reload the presenter tab.
- Sync directions live in each browser's local storage (`syncDirections`: presenter and viewer, send and receive, all on by default). If a tab stops following, check the sync toggle in the presenter's navigation bar.
- `npm run dev:flat` (rehearsal mode, whole slides) syncs the same way.
