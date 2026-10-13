#!/usr/bin/env node
// The in-slide demos in the static build, as the release HTML plays them (docs/run-the-deck.md, «Without Node»):
// there is no dev server, so a demo runs in each browser on its own and the tabs of one browser follow each other
// through a BroadcastChannel (slides/demo/clock.ts). For every slide with `live: true`, in two tabs:
// → starts the demo in tab A and tab B follows; → pauses both on the same moment; ← goes back to a beat;
// → resumes; R restarts; the slide never changes under these keys. The demo's moment is its svg's data-demo-t.
// A build has no window.__slidev__, so the demo slides come from the deck source and the slide from the URL hash.
//
//   node .scripts/static-demos.mjs <base-url of a served static build> [deck.md]   e.g. http://127.0.0.1:8096/
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-chromium'

const base = process.argv[2] || 'http://127.0.0.1:8096/'
const deck = process.argv[3] || 'slides/slides.md'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const failures = []
const expect = (ok, what) => { if (!ok) failures.push(what); console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`) }

// Slides with `live: true` in their frontmatter, numbered as audit-overflow.mjs counts: every `---` that opens a
// slide starts a page; a slide whose frontmatter is `src: file.md` is replaced by that file's slides.
function liveSlides(file, found = [], at = { n: 0 }) {
  const lines = fs.readFileSync(file, 'utf8').split('\n')
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '---') continue
    if (i + 1 < lines.length && /^[A-Za-z_][\w-]*:/.test(lines[i + 1])) {
      let src = null, live = false
      i++
      while (i < lines.length && lines[i].trim() !== '---') {
        const m = lines[i].match(/^src:\s*['"]?([^'"#]+?)['"]?\s*$/)
        if (m) src = m[1]
        if (/^live:\s*true\s*$/.test(lines[i])) live = true
        i++
      }
      if (src) {
        liveSlides(path.resolve(path.dirname(file), src), found, at)
      } else {
        at.n++
        if (live) found.push(at.n)
      }
    } else {
      at.n++
    }
  }
  return found
}
const live = liveSlides(deck)
expect(live.length > 0, `slides with a live demo in ${deck}: ${live.join(', ') || 'none'}`)

const browser = await chromium.launch()
try {
  const context = await browser.newContext({ viewport: { width: 980, height: 551 } })
  const errors = []
  const tab = async () => {
    const page = await context.newPage()
    page.on('pageerror', (e) => errors.push(e.message))
    return page
  }
  const a = await tab()

  // the moment a tab shows, read while that tab is in front (a background tab may skip animation frames)
  const moment = async (page) => {
    await page.bringToFront()
    await sleep(150)
    return Number(await page.locator('svg.demo-live:visible').first().getAttribute('data-demo-t'))
  }
  const press = async (page, key) => {
    await page.bringToFront()
    await page.keyboard.press(key)
  }
  const slideNo = (page) => page.evaluate(() => Number(location.hash.match(/^#\/(\d+)/)?.[1]))
  const open = async (page, n) => {
    await page.goto(`${base}#/${n}`)
    await page.locator('svg.demo-live:visible').first().waitFor({ timeout: 60000 })
    await sleep(800) // the slide transition
  }

  for (const n of live) {
    await open(a, n)
    const b = await tab()
    await open(b, n)

    expect((await moment(a)) === 0, `slide ${n}: waits for the start`)
    await press(a, 'ArrowRight')
    await sleep(2500)
    const played = await moment(a)
    expect(played >= 1500 && played <= 5000, `slide ${n}: → starts it, ${played} ms after 2.5 s`)
    const follower = await moment(b)
    expect(follower >= 1000, `slide ${n}: the second tab follows, ${follower} ms`)

    await press(a, 'ArrowRight')
    const held = await moment(a)
    await sleep(1200)
    expect((await moment(a)) === held, `slide ${n}: → pauses it at ${held} ms`)
    expect((await moment(b)) === held, `slide ${n}: the second tab pauses on the same moment`)

    await press(a, 'ArrowLeft')
    const beat = await moment(a)
    expect(beat <= held, `slide ${n}: ← goes back to a beat, ${beat} ms`)
    expect((await moment(b)) === beat, `slide ${n}: the second tab goes back too`)

    await press(a, 'ArrowRight')
    await sleep(1000)
    expect((await moment(a)) > beat, `slide ${n}: → resumes it`)

    await press(a, 'r')
    expect((await moment(a)) < 1000, `slide ${n}: R restarts it`)
    expect((await slideNo(a)) === n && (await slideNo(b)) === n, `slide ${n}: the keys stay on the demo's slide`)
    await b.close()
  }
  expect(errors.length === 0, `no page errors${errors.length ? `: ${errors.slice(0, 3).join(' | ')}` : ''}`)
}
finally {
  await browser.close()
}
if (failures.length) {
  console.error(`${failures.length} check(s) failed`)
  process.exit(1)
}
