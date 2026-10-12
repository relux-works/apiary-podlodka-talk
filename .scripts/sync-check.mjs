#!/usr/bin/env node
// The shared clicker in headless Chromium (docs/shared-clicker.md): windows on one deck dev server in present mode
// follow each other, and a window that opens or reloads joins the live slide instead of pulling the others to its own.
//
//   node .scripts/sync-check.mjs --port 8096        start `slidev` in present mode on that port, check, stop it
//   node .scripts/sync-check.mjs --url <url>        check a deck that already runs (npm run present, a tunnel)
//
// The windows are tabs of one browser here; on stage they are two laptops on SSH tunnels, which carry the same traffic.
// Exit 0 when every step holds. Plain Slidev (no present mode) never marks a window joined, so the check stops at the
// first window there; by hand on 13.10 it failed the three open steps, which slides/setup/present.ts fixes.
import { spawn } from 'node:child_process'
import { chromium } from 'playwright-chromium'

const args = process.argv.slice(2)
const opt = name => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)
const port = opt('--port') ?? '8096'
let base = opt('--url')
const sleep = ms => new Promise(r => setTimeout(r, ms))

let server
if (!base) {
  base = `http://localhost:${port}`
  server = spawn('node_modules/.bin/slidev', ['slides/slides.md', '--port', port], {
    env: { ...process.env, VITE_PRESENT: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let log = ''
  server.stdout.on('data', d => (log += d))
  server.stderr.on('data', d => (log += d))
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(`${base}/`)).ok)
        break
    }
    catch {}
    if (i > 90 || server.exitCode !== null) {
      console.error(`the deck did not come up on ${base}\n${log.slice(-2000)}`)
      process.exit(1)
    }
    await sleep(1000)
  }
}

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
const errors = []
let failed = 0

async function open(path) {
  const p = await ctx.newPage()
  // headless Chromium refuses the screen wake lock Slidev asks for; a real browser grants it
  p.on('pageerror', (e) => {
    if (!/Wake Lock/.test(e.message))
      errors.push(`${path}: ${e.message}`)
  })
  await p.goto(base + path)
  await ready(p, path.includes('/presenter/'))
  return p
}
// The window has joined (present mode marks it) and its route has settled: a presenter path gives a presenter window.
async function ready(p, presenter) {
  await p.waitForFunction(want => document.documentElement.dataset.present === 'joined'
    && window.__slidev__?.nav?.currentSlideNo > 0 && window.__slidev__.nav.isPresenter === want, presenter, { timeout: 30000 })
}
const pos = p => p.evaluate(() => ({ page: window.__slidev__.nav.currentSlideNo, clicks: window.__slidev__.nav.clicks }))
const fmt = s => `${s.page}.${s.clicks}`
const go = (p, n) => p.evaluate(n => window.__slidev__.nav.go(n), n)

// Wait until every window shows `want` (page, and clicks when given); then hold a moment to see nothing moves after.
async function expect(step, tabs, want) {
  const same = s => s.page === want.page && (want.clicks === undefined || s.clicks === want.clicks)
  let seen
  for (let i = 0; i < 50; i++) {
    seen = await Promise.all(Object.values(tabs).map(pos))
    if (seen.every(same))
      break
    await sleep(200)
  }
  await sleep(1200)
  seen = await Promise.all(Object.values(tabs).map(pos))
  const ok = seen.every(same)
  if (!ok)
    failed++
  const where = Object.keys(tabs).map((k, i) => `${k}=${fmt(seen[i])}`).join('  ')
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${step.padEnd(46)} ${where}`)
}

try {
  const warm = await open('/#/1') // the first load can make Vite reload after optimising dependencies
  await sleep(3000)
  await warm.close()

  const V = await open('/#/1')
  const P1 = await open('/#/presenter/1')
  await go(P1, 1)
  await expect('viewer and a presenter on slide 1', { V, P1 }, { page: 1 })
  await go(P1, 5)
  await expect('presenter moves, the viewer follows', { V, P1 }, { page: 5 })
  const P2 = await open('/#/presenter/1')
  await expect('a presenter opened at 1 joins 5', { V, P1, P2 }, { page: 5 })
  await go(P1, 10)
  await expect('one presenter moves, the other follows', { V, P1, P2 }, { page: 10 })
  const P3 = await open('/#/presenter/8')
  await expect('a stale presenter at 8 joins 10', { V, P1, P2, P3 }, { page: 10 })
  await P3.close()
  const V2 = await open('/#/3')
  await expect('a second viewer at 3 joins 10', { V, P1, P2, V2 }, { page: 10 })
  await V2.close()
  await P2.evaluate(() => window.__slidev__.nav.next())
  const after = await pos(P2)
  await expect(`a click in the other presenter (${fmt(after)})`, { V, P1, P2 }, after)
  await go(P2, 12)
  await expect('the other presenter moves to 12', { V, P1, P2 }, { page: 12 })
  await go(V, 14)
  await expect('a move in the viewer moves the presenters', { V, P1, P2 }, { page: 14 })
  await P1.reload()
  await ready(P1, true)
  await expect('a reloaded presenter joins 14', { V, P1, P2 }, { page: 14 })

  const titles = { V: await V.title(), P1: await P1.title() }
  const titled = titles.V.startsWith('ЭКРАН · ') && titles.P1.startsWith('ЗАМЕТКИ · ')
  if (!titled)
    failed++
  console.log(`${titled ? 'ok  ' : 'FAIL'}  ${'window titles'.padEnd(46)} V=«${titles.V}»  P1=«${titles.P1}»`)
  for (const e of errors)
    console.log(`page error  ${e}`)
}
finally {
  await browser.close()
  server?.kill()
}
console.log(failed ? `${failed} step(s) failed` : 'shared clicker: all steps hold')
process.exit(failed || errors.length ? 1 : 0)
