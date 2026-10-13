# Running the deck with clicks and live demos

For a speaker's laptop. The deck is Slidev; the two demos run inside their slides (27 and 42) and need no other window.

## On your laptop, full version

```bash
git clone git@github.com:relux-works/apiary-podlodka-talk.git
cd apiary-podlodka-talk
npm ci                 # Node 20 or newer; 24 is what CI uses
npm run dev            # opens http://localhost:3030
```

- **Show and presenter windows.** The audience window is `http://localhost:3030/#/1`. The presenter window is `http://localhost:3030/#/presenter/1`, with notes, the next slide and the timer; open it in a second window, and both follow each other.
- **Clicks.** Space or → is the next click, ← goes back. Arrow down and up move by whole slides.
- **Live demos** on slides 27 «Разработка по логам» and 42 «Рой за две недели»:
  - → or Space starts the demo, and it then plays by itself for about a minute;
  - → again pauses and resumes it, for an explanation;
  - ← goes back to the start of the current beat;
  - R restarts it;
  - after the end, → moves to the next slide as usual.
- **Rehearsal mode.** `npm run dev:flat` shows every slide whole, and the arrows move by slides.
- **Keep it current.** Before a rehearsal, run `git pull` and then `npm ci` if `package-lock.json` changed.

## Without Node

Each release has the PDF and the static HTML: <https://github.com/relux-works/apiary-podlodka-talk/releases>.

- **HTML.** Unzip it and open `index.html` in a browser. Clicks work, and the demos play in that browser; its tabs follow each other.
- **PDF.** Every slide whole, with the demos at their last frame.

## Together on the shared server

Both speakers on one deck, either one clicking, one sharing the screen: `npm run join -- --host <your SSH alias of the Mac mini>`.

- The speaker who shares the screen adds `--share`.
- The demos and their pauses follow in every window.
- Details and the stage rules: [`shared-clicker.md`](shared-clicker.md). It needs SSH access to the mini.
