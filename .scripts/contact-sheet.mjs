#!/usr/bin/env node
// Glue the per-slide screenshots of an audit run into one image, so a reviewer
// (human or agent) looks at the whole deck in a single read instead of forty.
// Usage: node .scripts/contact-sheet.mjs <auditDir> [columns]   → <auditDir>/sheet.png
import { chromium } from 'playwright-chromium'
import fs from 'node:fs'
import path from 'node:path'

const dir = path.resolve(process.argv[2] || '.temp/audit')
const cols = Number(process.argv[3] || 4)
const shots = fs.readdirSync(dir).filter(f => /^slide-\d+\.png$/.test(f)).sort()
if (!shots.length) { console.error(`no slide-NN.png in ${dir}`); process.exit(2) }

const cellW = 400
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#0d0d0d;font:12px ui-monospace,Menlo,monospace;color:#bbb}
.g{display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:10px;padding:10px}
figure{margin:0}img{width:${cellW}px;display:block;border:1px solid #333}
figcaption{padding:3px 0 0}</style><div class="g">${
  shots.map(f => `<figure><img src="file://${path.join(dir, f)}"><figcaption>${f.match(/\d+/)[0]}</figcaption></figure>`).join('')
}</div>`
const page_ = path.join(dir, 'sheet.html')
fs.writeFileSync(page_, html)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: cols * (cellW + 10) + 10, height: 400 } })
await page.goto('file://' + page_, { waitUntil: 'load' })
await page.screenshot({ path: path.join(dir, 'sheet.png'), fullPage: true })
await browser.close()
fs.unlinkSync(page_)
console.log(`contact sheet: ${path.join(dir, 'sheet.png')} (${shots.length} slides)`)
