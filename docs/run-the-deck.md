# Running the deck with clicks and live demos

For a speaker's laptop. The deck is Slidev; the demos run inside their slides and need no other window.

## On your laptop, full version

```bash
git clone git@github.com:relux-works/apiary-podlodka-talk.git
cd apiary-podlodka-talk
npm ci                 # Node 24 as in CI, or 22.12+ or 20.19+ (what Vite 8 accepts)
npm run dev            # opens http://localhost:3030
```

- **Show and presenter windows.** The audience window is `http://localhost:3030/#/1`. The presenter window is `http://localhost:3030/#/presenter/1`, with notes, the next slide and the timer; open it in a second window, and both follow each other.
- **Clicks.** Space or → is the next click, ← goes back. Arrow down and up move by whole slides.
- **Live demos** on slides 27 «Разработка по логам», 38 «Curator в терминале», 42 «Сборка запуска из профиля и проекта», 44 «Рой за две недели» and 58 «Внешние агенты в одной среде»:
  - → or Space starts the demo, and it then plays by itself for about a minute;
  - → again pauses and resumes it, for an explanation;
  - ← goes back to the start of the current beat;
  - R restarts it;
  - after the end, → moves to the next slide as usual.
- **Rehearsal mode.** `npm run dev:flat` shows every slide whole, and the arrows move by slides.
- **Keep it current.** Before a rehearsal, run `git pull` and then `npm ci` if `package-lock.json` changed.

## Without Node

Each release has the PDF and the static HTML: <https://github.com/relux-works/apiary-podlodka-talk/releases>.

- **HTML.** Unzip it, start a local server in that folder and open <http://localhost:8080>:

  ```bash
  python3 -m http.server 8080
  ```

  A double click on `index.html` gives a blank page: browsers do not load the deck's modules from `file://`. Clicks work, the presenter window is `http://localhost:8080/#/presenter/1`, and the demos play in that browser; its tabs follow each other (CI step «Demos in the static build»). The archive's `HOW_TO_RUN.md` says the same in Russian.
- **PDF.** Every slide whole, with the demos at their last frame.

## Together on the shared server

Both speakers on one deck, either one clicking, one sharing the screen. The script always goes through the Mac mini (`administrator@relux-macmini` on the tailnet; `--host <alias>` once if your SSH config names it differently):

- Alexey: `npm run join` opens the presenter window «ЗАМЕТКИ».
- Ivan, the host who shares the screen: `npm run join -- --ivan` also opens the viewer window «ЭКРАН». `--share` does the same for anyone else.
- The demos and their pauses follow in every window.
- Details and the stage rules: [`shared-clicker.md`](shared-clicker.md). It needs SSH access to the mini.
- `npm run present` (`.scripts/present.sh start`) puts the deck's server in a session of its own, so it outlives the command that started it, an agent harness's included (CI step «Shared server outlives its caller»). If something still takes it down, run it as a launchd job instead: `launchctl submit -l works.relux.apiary-podlodka-talk.present -- /bin/zsh -lc 'cd ~/Developer/ReluxWorks/apiary-podlodka-talk && VITE_PRESENT=1 exec node_modules/.bin/slidev slides/slides.md --port 3030'`, and stop it with `launchctl remove works.relux.apiary-podlodka-talk.present`. launchd restarts it if it exits.
