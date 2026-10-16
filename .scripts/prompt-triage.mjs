#!/usr/bin/env node
// Status pings and filler among the times a person wrote into an orchestrator (Alexey, 16.10: «чокак», «где мы»), for
// people's hours on «Работа агентов за две недели». A light model reads each prompt and labels it keep or noise; the
// result is a JSON array of the noise prompts' timestamps, which .scripts/people-hours.mjs leaves out with --drop.
//
// The prompts are those of the private sessions database (.scripts/agent-hours.mjs --db, or host-export's database):
// their timestamps are in the database, their text is read back from the session files on this machine and goes only
// to the model. Nothing with text is written: the output holds timestamps and labels.
//
//   node .scripts/prompt-triage.mjs --db .temp/host-export/m1max.sqlite [--from 2026-09-29] [--to 2026-10-13]
//        [--model haiku] [--out-dir .temp/prompt-triage]
//
// Writes <out-dir>/<host>-labels.json (timestamp -> keep|noise, a cache: a second run asks only for the new prompts)
// and <out-dir>/<host>-noise.json. Interrupts are a person's key and are kept without asking; a prompt whose text is
// not found in its session file is kept too.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { DatabaseSync } from 'node:sqlite'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const MSK = 3 * 3600e3
const day = (s) => Date.parse(`${s}T00:00:00Z`) - MSK
const from = day(one('--from', '2026-09-29')), to = day(one('--to', '2026-10-13'))
const model = one('--model', 'haiku'), outDir = path.resolve(one('--out-dir', '.temp/prompt-triage'))
if (!one('--db')) { console.error('usage: node .scripts/prompt-triage.mjs --db FILE.sqlite'); process.exit(2) }

const RULE = `You label messages a human typed to an AI coding orchestrator. Labels:
noise = the message only asks for status or progress ("чо там?", "чо как", "где мы", "ну что с X?", "есть достижения?", "готово?", "приземлил уже?", "ты тут?"), or is pure filler with no content (greeting, "ну?", "ау", "а дада", "ок", "+" when nothing is decided).
keep = anything that carries content: a task, direction, decision, correction, information, an answer to the agent's question (even short "да, второй вариант"), or a question about the substance of the work.
Reply with JSON only: an array of the numbers of the noise messages, e.g. [2,7,15], or [] when there are none.`

// ---- the prompts and their text -------------------------------------------------------------------------------------
const db = new DatabaseSync(one('--db'), { readOnly: true })
const rows = db.prepare(`SELECT s.host, s.runtime, s.file, p.ts_ms t FROM prompts p JOIN sessions s ON s.id = p.session_id
  WHERE s.cohort = 'orchestrators' AND p.ts_ms >= ? AND p.ts_ms < ?`).all(from, to)
db.close()
const files = new Map() // file -> { host, runtime, want: Set(ts) }
for (const r of rows) {
  if (!files.has(r.file)) files.set(r.file, { host: r.host, runtime: r.runtime, want: new Set() })
  files.get(r.file).want.add(r.t)
}
const joinText = (c) => (Array.isArray(c) ? c.map((b) => (typeof b === 'string' ? b : b?.type === 'text' || b?.type === 'input_text' ? b.text : '')).join(' ') : String(c || '')).trim()
const longest = (o) => { let best = ''; const walk = (v) => { if (typeof v === 'string') { if (v.length > best.length) best = v } else if (v && typeof v === 'object') Object.values(v).forEach(walk) }; walk(o); return best }
const textAt = { // a session line -> [ts, text] for a user prompt, or null
  claude(d) { return d.type === 'user' ? [Date.parse(d.timestamp), joinText(d.message?.content)] : null },
  codex(d) { return d.type === 'response_item' && d.payload?.role === 'user' ? [Date.parse(d.timestamp), joinText(d.payload.content)] : null },
  muse(d) {
    const recs = Array.isArray(d.children) ? d.children.map((c) => { try { return JSON.parse(c.record_json) } catch { return null } }) : [d]
    for (const r of recs) if (r?.payload_type === 'runtime.user_intent.accepted') { const t = Number(r.recorded_at); return [t > 1e14 ? Math.floor(t / 1000) : t, longest(r.payload)] }
    return null
  },
}
const byHost = new Map() // host -> [{ t, text }]
let missing = 0
for (const [file, f] of files) {
  let lines = []
  try { lines = fs.readFileSync(file, 'utf8').split('\n') } catch {}
  const found = byHost.get(f.host) || []
  for (const l of lines) {
    if (!l) continue
    let d; try { d = JSON.parse(l) } catch { continue }
    const x = textAt[f.runtime]?.(d)
    if (x && f.want.has(x[0])) { found.push({ t: x[0], text: x[1] }); f.want.delete(x[0]) }
  }
  missing += f.want.size
  byHost.set(f.host, found)
}

// ---- labels ----------------------------------------------------------------------------------------------------------
process.umask(0o077)
fs.mkdirSync(outDir, { recursive: true })
for (const [host, xs] of byHost) {
  const labelsFile = path.join(outDir, `${host}-labels.json`), noiseFile = path.join(outDir, `${host}-noise.json`)
  const lab = fs.existsSync(labelsFile) ? JSON.parse(fs.readFileSync(labelsFile, 'utf8')) : {}
  for (const x of xs) if (x.text.startsWith('[Request interrupted')) lab[x.t] = 'keep'
  const todo = xs.filter((x) => !(x.t in lab))
  for (let i = 0; i < todo.length; i += 25) {
    const b = todo.slice(i, i + 25)
    const body = b.map((x, k) => `${k + 1}. ${JSON.stringify(x.text.slice(0, 400))}`).join('\n')
    let ok = false
    for (let a = 0; a < 3 && !ok; a++) {
      const r = spawnSync('claude', ['-p', '--model', model, '--tools', '', '--system-prompt', RULE], { input: `${b.length} messages:\n${body}`, encoding: 'utf8', maxBuffer: 1e8 })
      let arr; try { arr = JSON.parse(/\[[\s\S]*?\]/.exec(r.stdout || '')[0]) } catch {}
      if (Array.isArray(arr) && arr.every((v) => Number.isInteger(v) && v >= 1 && v <= b.length)) { b.forEach((x, k) => (lab[x.t] = arr.includes(k + 1) ? 'noise' : 'keep')); ok = true }
      else console.error(`${host}: batch ${i / 25 + 1}, attempt ${a + 1}: no usable answer (exit ${r.status})`)
    }
    if (!ok) { console.error(`${host}: batch ${i / 25 + 1} failed three times; labels so far are saved, run again`); fs.writeFileSync(labelsFile, JSON.stringify(lab)); process.exit(1) }
    fs.writeFileSync(labelsFile, JSON.stringify(lab))
    process.stdout.write('.')
  }
  fs.writeFileSync(labelsFile, JSON.stringify(lab))
  const noise = xs.filter((x) => lab[x.t] === 'noise').map((x) => x.t).sort((a, b) => a - b)
  fs.writeFileSync(noiseFile, JSON.stringify(noise))
  const sha = crypto.createHash('sha256').update(fs.readFileSync(noiseFile)).digest('hex')
  console.log(`\n${host}: ${xs.length} prompts read, ${noise.length} status pings and filler → ${noiseFile} (sha256 ${sha})`)
}
if (missing) console.log(`${missing} prompts have no text in their session file and are kept`)
