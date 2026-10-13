#!/usr/bin/env node
// Render an in-slide demo (docs/demos.md) in headless Chromium: still frames at chosen moments, and a video of the
// whole autoplay from one press of →, as the audience sees it. Starts the deck's dev server itself.
//
//   node .scripts/demo-frames.mjs [--deck slides/demos.md] [--slide 2] [--port 8097] [--at 1200,6000,…]
//        [--video] [--duration 68500] [--out .temp/demo-frames]
//
// Frames land as slide-NN.png (so .scripts/contact-sheet.mjs can glue them), the video as demo.webm.
// A frame is the demo held at one moment through ?demo-t=<ms> (slides/demo/clock.ts).
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright-chromium'

const args = process.argv.slice(2)
const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d)
const deck = opt('--deck', 'slides/demos.md'), slide = opt('--slide', '2'), port = opt('--port', '8097')
const at = opt('--at', '1200,6000,16000,28000,40000,52000,60500,67000').split(',').map(Number)
const duration = Number(opt('--duration', '68500'))
const out = path.resolve(opt('--out', '.temp/demo-frames'))
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

const errors = []
const browser = await chromium.launch()
try {
  const ctx = await browser.newContext({ viewport: { width: 980, height: 551 }, deviceScaleFactor: 2 })
  const warm = await ctx.newPage() // the first load can make Vite reload after optimising dependencies
  await warm.goto(`${base}/#/${slide}`)
  await warm.waitForSelector('.demo-run', { timeout: 60000 })
  await sleep(3000)
  await warm.close()
  for (const [i, t] of at.entries()) {
    const page = await ctx.newPage()
    page.on('pageerror', (e) => { if (!/Wake Lock/.test(e.message)) errors.push(e.message) })
    await page.goto(`${base}/?demo-t=${t}#/${slide}`)
    await page.waitForSelector('.demo-run', { timeout: 30000 })
    await sleep(900)
    const file = path.join(out, `slide-${String(i + 1).padStart(2, '0')}.png`)
    await page.screenshot({ path: file })
    console.log(`frame ${i + 1}: ${t} ms`)
    await page.close()
  }
  if (args.includes('--video')) {
    const vctx = await browser.newContext({ viewport: { width: 980, height: 551 }, recordVideo: { dir: out, size: { width: 980, height: 551 } } })
    const page = await vctx.newPage()
    page.on('pageerror', (e) => { if (!/Wake Lock/.test(e.message)) errors.push(e.message) })
    await page.goto(`${base}/#/${slide}`)
    await page.waitForSelector('.demo-run', { timeout: 30000 })
    await sleep(1500)
    await page.keyboard.press('ArrowRight')
    await sleep(duration + 2000)
    const video = page.video()
    await vctx.close()
    fs.renameSync(await video.path(), path.join(out, 'demo.webm'))
    console.log(`video: ${path.join(out, 'demo.webm')}`)
  }
}
finally {
  await browser.close()
  server.kill()
}
for (const e of errors) console.log(`page error: ${e}`)
process.exit(errors.length ? 1 : 0)
