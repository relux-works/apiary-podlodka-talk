# Deck workflow

How we build a talk as code. The process and the traps below come from the iOS Crew #18 deck (ivanopcode/ios-crew-18-rwb, September 2026), where the toolchain and both themes were made; they apply here unchanged.

## 1. From text to slides

- **The post first, the deck from the post.** Slides follow the chapters of `text/from-buckets-to-apiary.ru.md`; the plan maps chapters to slides. If a slide needs a thesis the post does not have, write it into the post at its source (relux-works/blog) and re-copy, or note it in the pull request for the post's owner.
- **Speaker notes are the speech.** Each slide ends with an HTML comment holding full paragraphs of what is said, not bullets. Do not shorten them when editing a slide. After a rehearsal, rewrite the notes from the transcript.
- **Numbers are researched, never invented.** Every figure gets a source; an estimate is labelled as an estimate in the notes and listed in `open-questions.md` with what would confirm it.
- **Vision is labelled.** The plan's tone rule: what works today and what is vision are separated on the slide itself. Use `<Status v="today|decided|proposed|vision|open" />` — a pill after the title or next to an item («работает сегодня», «решено», «в спеке, предложено», «видение», «открыто»). The status comes from the source (`docs/sources.md`), not from how confident the slide sounds.
- **The deck is split by part.** `slides/slides.md` holds the title and imports `slides/parts/<n>-<name>.md` through `src:`; each part file starts with its opener. Lint and the audit follow the imports.

## 2. Slide conventions

These are the author's standing corrections from the previous deck. Apply them without being asked.

- **Titles:** one line, technical, calm. Statements or questions. No «не X, а Y». No pompous or marketing phrasing.
- **Typography:** «ёлочки» and long dashes — are intentional; keep them.
- **One composition per slide.** A title, one anchor (table, code, diagram, cards), a takeaway strip at the bottom (`<p class="lead">`).
- **Clicks reveal parts, in reading order:** the left column item by item, then the right column, then the bottom. A takeaway or summary strip appears last. Lists reveal one item per click.
- **No source lines on slides in `rwb-tech`.** Lines like «ОЦЕНКА · …» or «ФАКТ · …» were removed as noise; sources live in the notes and in `open-questions.md`. `rwb-minimal` has a designed source line (`source:` / `<SourceNote>`); use it only with that theme.
- **Nothing below 13 px.** When a slide does not fit, use `class: dense` in the frontmatter or split it into two slides; do not shrink the type.
- **Demos** get a bumper slide (`layout: demo`, `num: Демо N`, big title). A prompt the presenter pastes live can sit on the slide as invisible selectable text (text colour = background, `user-select: all`). Before recording a demo, record ten seconds and run `.scripts/check-recording.sh` — one rehearsal recording of the previous talk came out without sound.

## 3. Traps we already hit

| Symptom | Cause | Fix |
| --- | --- | --- |
| A layout receives an object or a cut-off string | unquoted YAML value with `: ` or ` #`; `num: 01` becomes `1` | quote it; `npm run lint` catches the first two |
| SVG label renders at 52 px | UnoCSS attributify reads `font-size="13"` on `<text>` as a utility | never set `font-size` / `font-family` attributes on SVG text; the theme sets 13 px mono |
| Grey text where colour was expected | a class name collides with a UnoCSS utility (`dim`, `sec`) | use theme names like `tone-*` |
| Element invisible at click 0 | `v-click="[0,1]"` | `v-click.hide="1"` |
| Code block loses characters on the right | long lines in a narrow column | wrap the lines; for a dense config, a scoped smaller style (see `cfg-tight` in the iOS Crew deck); the audit flags clipped `pre` |
| Two code blocks swap on click but jump | both in flow | stack them with `grid-area: 1 / 1` in one grid |
| 404 in the console for a diagram | Slidev preloads images by source path | `preloadImages: false` in the headmatter; the image itself loads as a bundled asset |
| The audit measures only the title slide | deck without `routerMode: hash` | keep `routerMode: hash` in every deck and showcase; the audit now reports unmeasured slides |

## 4. Diagrams

The PNGs in `diagrams/` are documentation renders from the wiki: English, light, 8–12 participants, 9–11 px text. They do not read on a dark slide in a hall. Each has a stage version in `slides/components/`, listed in `slides/diagrams.md` (`npm run diagrams`):

- Russian labels, rwb-tech tokens, nothing below 13 px, at most about 12 messages or 10 boxes;
- drawn for the thesis of its slide in the plan; content checked against the original, nothing added;
- `<DiagName />` on a slide, `<DiagName reveal />` for click-by-click where the component supports it.

Sequence diagrams are data for `<Seq>`: `actors` with `id`, `label`, optional `sub` and `tone`; `steps` as messages `{ from, to, text, dashed?, tone? }`, dividers `{ section }` and notes `{ note, at }`. Keep a message label shorter than the span it sits on. Structural diagrams are hand-placed SVG with the theme classes (`n`, `n-purple`, `n-lime`, `n-wait`, `frame`, `frame-hive`, `e`, `e-dash`, `t-big`, `t-cap`, `t-sec`). An arrow into a hive ends at the frame edge, not at a box behind the hive's label.

When the original changes in the wiki or a spec, update the stage version by hand and note the source revision in the component's header comment. The audit fails on SVG text outside the drawing or its box; overlaps between labels and lines are checked by eye on the contact sheet. The components use rwb-tech classes; with rwb-minimal they need its equivalents.

Images other than these diagrams are referenced by relative path, `<img src="../diagrams/name.png">`, never copied into `slides/public/`.

## 5. The verification loop

```bash
npm run verify
```

It lints the frontmatter, builds the deck exactly as the release archive (`--base ./`, hash routing), opens every slide in headless Chromium at its final click state, and fails on:

- content below the layout's content box (the limit is read from the rendered layout, so it works for any theme);
- text wider than its box in `<Boxes>`, `<Stack>` and SVG `rect` labels;
- a `pre` block wider than its container;
- any console error, including 404s;
- a slide that never rendered.

Then look at `.temp/audit/sheet.png`: the whole deck in one image. Open `slide-NN.png` for the slides you changed. A green audit does not replace looking: balance, alignment and legibility are judged by eye.

For a click-by-click check, run `npm run dev` and open `http://localhost:3030/#/N?clicks=K`.

## 6. Rehearsal mode

`npm run dev:flat` sets `VITE_FLAT_CLICKS=1`. `slides/setup/transformers.ts` strips every `v-click` before Slidev compiles the deck, `slides/setup/main.ts` makes arrows and space move by whole slides and shows a green «FLAT · no clicks» badge. Stop it and run `npm run dev` to get the clicks back; nothing in the deck changes.

## 7. Themes

Two local themes live in `themes/`; the deck picks one in its headmatter (`theme: ../themes/rwb-tech`). Details and the logo switch are in [`themes/README.md`](../themes/README.md). Switching a finished deck to the other theme is a re-layout, not a toggle: read the target theme's `STYLE.md` and rework the slides that use theme-specific classes.

## 8. Delivery

- Work on a short-lived branch, signed commits, a pull request, land the reviewed head by fast-forward (the repository's working agreement).
- The `Build` workflow runs `verify` for the deck and both theme showcases and exports the PDF on every pull request.
- A release is a signed tag on `main`: `git tag -s vX.Y.Z && git push origin vX.Y.Z`. The `Release` workflow publishes the HTML archive (with `docs/HOW_TO_RUN.md` inside) and the PDF. Tag each accepted content batch (minor) or fix (patch); tag what was presented as `v1.0.0`.
- Before ending a session, leave the next one a way in: open items in `open-questions.md`, decisions with dates in its «Решено» section, and a pull request description that says what changed and what is left.
