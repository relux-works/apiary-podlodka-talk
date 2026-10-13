#!/usr/bin/env node
// Every slide at every click, for a review of the reveals (Ivan, 13.10: «проверь, что все клики семантически корректны
// и раскрывают суть слайда… не было слишком больших или слишком маленьких блоков раскрытия»). Starts the deck's dev
// server, reads each slide's click count from Slidev, screenshots click 0…N, and glues one strip per slide into sheets.
//
//   node .scripts/click-frames.mjs [--deck slides/slides.md] [--port 8099] [--per-sheet 6] [--out .temp/click-frames]
//
// Output: clicks.json (slide, title, clicks), sheet-NN.png (a row per slide: its frames left to right), and the frames.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-chromium'

const args = process.argv.slice(2)
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d)
const deck = opt('--deck', 'slides/slides.md'), port = opt('--port', '8099'), perSheet = Number(opt('--per-sheet', '6'))
const out = path.resolve(opt('--out', '.temp/click-frames'))
const base = `http://localhost:${port}`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out, { recursive: true })

const server = spawn('node_modules/.bin/slidev', [deck, '--port', port], { stdio: ['ignore', 'pipe', 'pipe'] })
let log = ''
server.stdout.on('data', (d) => (log += d))
server.stderr.on('data', (d) => (log += d))
for (let i = 0; ; i++) {
  try { if ((await fetch(`${base}/`)).ok) break } catch {}
  if (i > 90 || server.exitCode !== null) { console.error(`the deck did not come up on ${base}\n${log.slice(-2000)}`); process.exit(1) }
  await sleep(1000)
}

const browser = await chromium.launch()
const rows = []
try {
  const page = await browser.newPage({ viewport: { width: 980, height: 551 } })
  await page.goto(`${base}/#/1`)
  await page.waitForFunction(() => window.__slidev__?.nav?.total > 0, null, { timeout: 60000 })
  await sleep(3000) // the first load can make Vite reload after optimising dependencies
  await page.goto(`${base}/#/1`)
  await page.waitForFunction(() => window.__slidev__?.nav?.total > 0, null, { timeout: 60000 })
  const total = await page.evaluate(() => window.__slidev__.nav.total)
  for (let n = 1; n <= total; n++) {
    await page.evaluate((n) => window.__slidev__.nav.go(n, 0), n)
    await page.waitForFunction((n) => window.__slidev__.nav.currentSlideNo === n, n)
    await sleep(700)
    const info = await page.evaluate(() => ({ clicks: window.__slidev__.nav.clicksTotal, title: document.querySelector('.slidev-page:not([style*="display: none"]) h1')?.textContent?.trim() || '' }))
    const frames = []
    for (let k = 0; k <= info.clicks; k++) {
      await page.evaluate(([n, k]) => window.__slidev__.nav.go(n, k), [n, k])
      await sleep(450)
      const f = path.join(out, `s${String(n).padStart(2, '0')}-c${String(k).padStart(2, '0')}.png`)
      await page.screenshot({ path: f })
      frames.push(path.basename(f))
    }
    rows.push({ n, title: info.title, clicks: info.clicks, frames })
    console.log(`slide ${n}: ${info.clicks} clicks · ${info.title}`)
  }
  fs.writeFileSync(path.join(out, 'clicks.json'), JSON.stringify(rows.map(({ frames, ...r }) => r), null, 1))
  // sheets: a row per slide, its frames at 245 px wide
  for (let s = 0; s * perSheet < rows.length; s++) {
    const part = rows.slice(s * perSheet, (s + 1) * perSheet)
    const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#0d0d0d;font:13px ui-monospace,Menlo,monospace;color:#bbb}
.r{display:flex;gap:6px;padding:6px 8px;align-items:flex-start;border-bottom:1px solid #222}.h{width:150px;flex:none}
img{width:245px;border:1px solid #333;display:block}figure{margin:0}figcaption{font-size:11px;color:#888}</style>${part.map((r) => `<div class="r"><div class="h">${r.n} · ${r.clicks} кл.<br>${r.title.replace(/</g, '&lt;')}</div>${r.frames.map((f, k) => `<figure><img src="file://${path.join(out, f)}"><figcaption>клик ${k}</figcaption></figure>`).join('')}</div>`).join('')}`
    const file = path.join(out, `sheet-${String(s + 1).padStart(2, '0')}.html`)
    fs.writeFileSync(file, html)
    const maxFrames = Math.max(...part.map((r) => r.frames.length))
    const p = await browser.newPage({ viewport: { width: 170 + maxFrames * 251, height: 300 } })
    await p.goto(`file://${file}`, { waitUntil: 'load' })
    await p.screenshot({ path: file.replace('.html', '.png'), fullPage: true })
    await p.close()
    fs.unlinkSync(file)
  }
}
finally {
  await browser.close()
  server.kill()
}
const sum = rows.reduce((a, r) => a + r.clicks, 0)
console.log(`${rows.length} slides, ${sum} clicks; sheets in ${out}`)
