#!/usr/bin/env node
// Data for demo 2, the swarm at scale (slides/components/DemoSwarm.vue): every orchestrator of every machine over a
// window, from the private sessions database of .scripts/agent-hours.mjs --db. One lane per orchestrator (a project
// directory on a machine with at least --min-hours of interactive work), its busy time coloured by runtime; the number
// of orchestrators and subagents busy in each 10-minute slot; the task-board runs. Anonymous lanes: no project names,
// no paths; machines by their display names.
//
//   node .scripts/demo-swarm.mjs --db ~/private/agent-hours/sessions.sqlite [--from 2026-09-29] [--to 2026-10-13]
//        [--min-hours 1] [--runs-json ivmbp.json:ivmbp]… [--out slides/demo/swarm.json]
//
// --from / --to are Moscow dates (the window starts and ends at Moscow midnight). --runs-json adds the task-board run
// intervals of a machine whose ledgers are not in the database (the cohorts.runs of an agent-hours JSON).
import fs from 'node:fs'
import { DatabaseSync } from 'node:sqlite'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const multi = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] ? [argv[i + 1]] : []))
const MSK = 3 * 3600e3, SLOT = 600e3
const day = (s) => Date.parse(`${s}T00:00:00Z`) - MSK
const from = day(one('--from', '2026-09-29')), to = day(one('--to', '2026-10-13'))
const minMs = Number(one('--min-hours', '1')) * 3600e3
const out = one('--out', 'slides/demo/swarm.json')
const NAMES = { mini: 'Mac mini', ivmbp: 'MacBook Ивана', m1max: 'MacBook Алексея' }
const RT = { claude: 0, codex: 1, muse: 2 }

const db = new DatabaseSync(one('--db'), { readOnly: true })
const rows = db.prepare(`SELECT s.host, s.project, s.runtime, s.cohort, i.start_ms a, i.end_ms b FROM intervals i JOIN sessions s ON s.id = i.session_id
  WHERE i.end_ms > ? AND i.start_ms < ?`).all(from, to)
const clip = (a, b) => [Math.max(a, from), Math.min(b, to)]

// lanes: orchestrator time per (host, project)
const lanes = new Map()
for (const r of rows) {
  if (r.cohort !== 'orchestrators') continue
  const [a, b] = clip(r.a, r.b)
  if (b <= a) continue
  const k = `${r.host}\u0000${r.project}`
  if (!lanes.has(k)) lanes.set(k, { host: r.host, busy: 0, iv: [] })
  const l = lanes.get(k)
  l.busy += b - a
  l.iv.push([a, b, RT[r.runtime] ?? 0])
}
const kept = [...lanes.values()].filter((l) => l.busy >= minMs)
// merge overlapping intervals of one lane (the runtime of the longer piece wins)
for (const l of kept) {
  l.iv.sort((p, q) => p[0] - q[0])
  const m = []
  for (const x of l.iv) {
    const y = m[m.length - 1]
    if (y && x[0] <= y[1]) { if (x[1] - x[0] > y[1] - y[0]) y[2] = x[2]; y[1] = Math.max(y[1], x[1]) } else m.push([...x])
  }
  l.iv = m
}
const hosts = [...new Set(kept.map((l) => l.host))].sort((a, b) => kept.filter((l) => l.host === b).length - kept.filter((l) => l.host === a).length)
const laneOut = hosts.flatMap((h) => kept.filter((l) => l.host === h).sort((p, q) => q.busy - p.busy).map((l) => ({ host: h, iv: l.iv.map(([a, b, r]) => [Math.round((a - from) / 1000), Math.round((b - from) / 1000), r]) })))

// busy orchestrators and subagents per 10-minute slot
const n = Math.ceil((to - from) / SLOT)
const orch = new Array(n).fill(0), work = new Array(n).fill(0)
for (const r of rows) {
  const [a, b] = clip(r.a, r.b)
  if (b <= a) continue
  const s = r.cohort === 'orchestrators' ? orch : work
  for (let k = Math.floor((a - from) / SLOT); k <= Math.min(n - 1, Math.floor((b - 1 - from) / SLOT)); k++) s[k]++
}

// task-board run starts: the database's ledgers plus machines given as JSON
const runs = db.prepare('SELECT started_ms a FROM runs WHERE started_ms >= ? AND started_ms < ?').all(from, to).map((x) => x.a)
for (const spec of multi('--runs-json')) {
  const [f] = spec.split(':')
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  for (const r of Array.isArray(j) ? j : [j]) for (const [a] of r.cohorts.runs.intervals) if (a >= from && a < to) runs.push(a)
}
runs.sort((a, b) => a - b)

const peak = (s) => { let k = 0; for (let i = 1; i < s.length; i++) if (s[i] > s[k]) k = i; return { slot: k, n: s[k] } }
const hoursOf = (cohort) => rows.filter((r) => r.cohort === cohort).reduce((t, r) => { const [a, b] = clip(r.a, r.b); return t + Math.max(0, b - a) }, 0) / 3600e3
const data = {
  about: 'Demo 2, the swarm at scale: orchestrators of every machine, from .scripts/demo-swarm.mjs over the private sessions database. Anonymous lanes, no project names, no paths.',
  window: [from, to],
  slot: SLOT,
  hosts: hosts.map((h) => ({ id: h, name: NAMES[h] || h, lanes: kept.filter((l) => l.host === h).length })),
  runtimes: ['Claude Code', 'Codex', 'Muse'],
  lanes: laneOut,
  orch,
  work,
  runs: runs.map((a) => Math.round((a - from) / 1000)),
  counts: {
    orchestrators: kept.length,
    peakOrch: peak(orch),
    peakWork: peak(work),
    orchHours: Math.round(hoursOf('orchestrators')),
    workHours: Math.round(hoursOf('workers')),
    runs: runs.length,
  },
}
fs.writeFileSync(out, JSON.stringify(data))
console.log(`${out}: ${kept.length} orchestrators on ${hosts.join(', ')}, ${laneOut.reduce((s, l) => s + l.iv.length, 0)} busy stretches, ${runs.length} runs, ${(fs.statSync(out).size / 1024).toFixed(0)} KiB`)
console.log(JSON.stringify(data.counts))
