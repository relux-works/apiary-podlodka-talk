#!/usr/bin/env node
// Data for demo 2, the swarm at scale (slides/components/DemoSwarm.vue): the orchestrators of every machine over a
// window, from the private sessions database of .scripts/agent-hours.mjs --db. One lane per orchestrator (a project
// directory on a machine with at least --min-hours of interactive work) with two tracks: the orchestrator's own busy
// time and its subagents' (task-board runs it launched, found through the run's caller session, and worker sessions in
// the same project), each coloured by runtime. Also the number of orchestrators and subagents busy in each 10-minute
// slot and the task-board runs. Anonymous lanes: no project names, no paths; machines by their display names.
//
//   node .scripts/demo-swarm.mjs --db ~/private/agent-hours/sessions.sqlite [--from 2026-09-29] [--to 2026-10-13]
//        [--min-hours 10] [--runs-json ivmbp.json:ivmbp]… [--a2a messages.ndjson.gz] [--out slides/demo/swarm.json]
//
// --a2a: an export of a2a message metadata ({room, topic, at, sender, to, kind}, no bodies). Messages are split into
// two sides, Alexey's agents (an m1max_ name) and Ivan's (every other), counted per 30 minutes by kind, with the
// messages one side addressed to the other. #system only mirrors other rooms and is left out; repeats are dropped.
//
// --from / --to are Moscow dates (the window starts and ends at Moscow midnight). --runs-json adds the task-board run
// intervals of a machine whose ledgers are not in the database (the cohorts.runs of an agent-hours JSON).
import fs from 'node:fs'
import zlib from 'node:zlib'
import { DatabaseSync } from 'node:sqlite'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const multi = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] ? [argv[i + 1]] : []))
const MSK = 3 * 3600e3, SLOT = 600e3
const day = (s) => Date.parse(`${s}T00:00:00Z`) - MSK
const from = day(one('--from', '2026-09-29')), to = day(one('--to', '2026-10-13'))
const minMs = Number(one('--min-hours', '10')) * 3600e3
const out = one('--out', 'slides/demo/swarm.json')
const NAMES = { mini: 'Mac mini', ivmbp: 'MacBook Ивана', m1max: 'MacBook Алексея' }
const RT = { claude: 0, codex: 1, muse: 2 }

const db = new DatabaseSync(one('--db'), { readOnly: true })
const rows = db.prepare(`SELECT s.host, s.project, s.runtime, s.cohort, s.file, i.start_ms a, i.end_ms b FROM intervals i JOIN sessions s ON s.id = i.session_id
  WHERE i.end_ms > ? AND i.start_ms < ?`).all(from, to)
// a session's own id: Claude <id>.jsonl, Codex rollout-…-<id>.jsonl, Muse <id>/session.jsonl
const idOf = (file) => (/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\.jsonl|\/session\.jsonl)$/.exec(file) || [])[1]
const clip = (a, b) => [Math.max(a, from), Math.min(b, to)]

// lanes: orchestrator time per (host, project); remember which session ids belong to which lane
const lanes = new Map(), laneOfSession = new Map()
const keyOf = (r) => `${r.host}\u0000${r.project}`
for (const r of rows) {
  if (r.cohort !== 'orchestrators') continue
  const [a, b] = clip(r.a, r.b)
  if (b <= a) continue
  const k = keyOf(r)
  if (!lanes.has(k)) lanes.set(k, { host: r.host, busy: 0, o: [], s: [] })
  const l = lanes.get(k)
  l.busy += b - a
  l.o.push([a, b, RT[r.runtime] ?? 0])
  const id = idOf(r.file)
  if (id) laneOfSession.set(id, k)
}
const all = [...lanes.values()]
const kept = all.filter((l) => l.busy >= minMs)
const keptKeys = new Set([...lanes.entries()].filter(([, l]) => l.busy >= minMs).map(([k]) => k))
// subagents: runs by their caller session, worker sessions by project
let attributed = 0
for (const x of db.prepare('SELECT caller, runtime, started_ms a, ended_ms b FROM runs WHERE ended_ms > ? AND started_ms < ?').all(from, to)) {
  const k = laneOfSession.get(x.caller)
  if (!k || !keptKeys.has(k)) continue
  const [a, b] = clip(x.a, x.b)
  if (b > a) { lanes.get(k).s.push([a, b, RT[x.runtime] ?? 0]); attributed++ }
}
for (const r of rows) {
  if (r.cohort === 'orchestrators' || !keptKeys.has(keyOf(r))) continue
  const [a, b] = clip(r.a, r.b)
  if (b > a) lanes.get(keyOf(r)).s.push([a, b, RT[r.runtime] ?? 0])
}
// merge overlapping pieces of one track (the runtime of the longer piece wins)
const merge = (iv) => {
  iv.sort((p, q) => p[0] - q[0])
  const m = []
  for (const x of iv) {
    const y = m[m.length - 1]
    if (y && x[0] <= y[1]) { if (x[1] - x[0] > y[1] - y[0]) y[2] = x[2]; y[1] = Math.max(y[1], x[1]) } else m.push([...x])
  }
  return m
}
for (const l of kept) { l.o = merge(l.o); l.s = merge(l.s) }
const sec = (iv) => iv.map(([a, b, r]) => [Math.round((a - from) / 1000), Math.round((b - from) / 1000), r])
// people: the moments a person wrote into an orchestrator (agent-hours --db, prompts), on its lane and per 30 minutes
const prompts = (() => { try { return db.prepare(`SELECT s.host, s.project, s.file, p.ts_ms t FROM prompts p JOIN sessions s ON s.id = p.session_id WHERE p.ts_ms >= ? AND p.ts_ms < ? ORDER BY p.ts_ms`).all(from, to) } catch { return [] } })()
for (const p of prompts) { const k = keyOf(p); if (keptKeys.has(k)) (lanes.get(k).h ||= []).push(Math.round((p.t - from) / 1000)) }
const HBIN = 1800e3, human = new Array(Math.ceil((to - from) / HBIN)).fill(0)
for (const p of prompts) human[Math.floor((p.t - from) / HBIN)]++
let longestGap = 0
for (let i = 1; i < prompts.length; i++) longestGap = Math.max(longestGap, prompts[i].t - prompts[i - 1].t)
const hosts = [...new Set(kept.map((l) => l.host))].sort((a, b) => kept.filter((l) => l.host === b).length - kept.filter((l) => l.host === a).length)
const laneOut = hosts.flatMap((h) => kept.filter((l) => l.host === h).sort((p, q) => q.busy - p.busy).map((l) => ({ host: h, o: sec(l.o), s: sec(l.s), h: l.h || [] })))

// busy per 10-minute slot: distinct orchestrators (two sessions of one count once) and subagent sessions
const n = Math.ceil((to - from) / SLOT)
const orchSets = Array.from({ length: n }, () => new Set()), work = new Array(n).fill(0)
for (const r of rows) {
  const [a, b] = clip(r.a, r.b)
  if (b <= a) continue
  for (let k = Math.floor((a - from) / SLOT); k <= Math.min(n - 1, Math.floor((b - 1 - from) / SLOT)); k++) {
    if (r.cohort === 'orchestrators') orchSets[k].add(keyOf(r)); else work[k]++
  }
}
const orch = orchSets.map((x) => x.size)

// task-board run starts: the database's ledgers plus machines given as JSON
const runs = db.prepare('SELECT started_ms a FROM runs WHERE started_ms >= ? AND started_ms < ?').all(from, to).map((x) => x.a)
for (const spec of multi('--runs-json')) {
  const [f] = spec.split(':')
  const j = JSON.parse(fs.readFileSync(f, 'utf8'))
  for (const r of Array.isArray(j) ? j : [j]) for (const [a] of r.cohorts.runs.intervals) if (a >= from && a < to) runs.push(a)
}
runs.sort((a, b) => a - b)

// Matrix: messages per 30 minutes and side, by kind; and those addressed across the sides
let matrix = null
if (one('--a2a')) {
  const BIN = 1800e3, nb = Math.ceil((to - from) / BIN)
  const text = zlib.gunzipSync(fs.readFileSync(one('--a2a'))).toString('utf8')
  const side = (a) => (a.startsWith('m1max_') ? 1 : 0) // 0 Ivan, 1 Alexey
  const group = (k) => (k === 'decision' || k === 'accept' ? 1 : k === 'question' || k === 'owner-needed' ? 2 : 0) // 0 work, 1 decisions, 2 questions
  const bins = [0, 1].map(() => [0, 1, 2].map(() => new Array(nb).fill(0)))
  const crossBins = new Array(nb).fill(0)
  const seen = new Set(), agents = [new Set(), new Set()]
  let total = 0, cross = 0
  for (const l of text.split('\n')) {
    if (!l) continue
    const m = JSON.parse(l)
    if (m.room === '#system') continue
    const key = `${m.at}|${m.sender}|${m.kind}|${m.topic}`
    if (seen.has(key)) continue
    seen.add(key)
    const t = Date.parse(m.at)
    if (!(t >= from && t < to)) continue
    const k = Math.floor((t - from) / BIN), sd = side(m.sender)
    bins[sd][group(m.kind)][k]++
    agents[sd].add(m.sender)
    total++
    if ((m.to || []).some((x) => x && x !== 'all' && side(x) !== sd)) { crossBins[k]++; cross++ }
  }
  matrix = { bin: BIN, sides: bins, cross: crossBins, total, crossTotal: cross, agents: agents.map((x) => x.size) }
}

const peak = (s) => { let k = 0; for (let i = 1; i < s.length; i++) if (s[i] > s[k]) k = i; return { slot: k, n: s[k] } }
const hoursOf = (cohort) => rows.filter((r) => r.cohort === cohort).reduce((t, r) => { const [a, b] = clip(r.a, r.b); return t + Math.max(0, b - a) }, 0) / 3600e3
const data = {
  about: 'Demo 2, the swarm at scale: orchestrators of every machine, from .scripts/demo-swarm.mjs over the private sessions database. Anonymous lanes, no project names, no paths.',
  window: [from, to],
  slot: SLOT,
  hosts: hosts.map((h) => ({ id: h, name: NAMES[h] || h, lanes: kept.filter((l) => l.host === h).length, of: all.filter((l) => l.host === h && l.busy >= 3600e3).length })),
  runtimes: ['Claude Code', 'Codex', 'Muse'],
  lanes: laneOut,
  orch,
  work,
  runs: runs.map((a) => Math.round((a - from) / 1000)),
  matrix,
  human: { bin: HBIN, series: human, total: prompts.length, longestGapH: Math.round((longestGap / 3600e3) * 10) / 10 },
  counts: {
    orchestrators: all.filter((l) => l.busy >= 3600e3).length, // at least an hour of work
    shown: kept.length,
    minHours: minMs / 3600e3,
    attributedRuns: attributed,
    peakOrch: peak(orch),
    peakWork: peak(work),
    orchHours: Math.round(hoursOf('orchestrators')),
    workHours: Math.round(hoursOf('workers')),
    runs: runs.length,
  },
}
fs.writeFileSync(out, JSON.stringify(data))
console.log(`${out}: ${kept.length} lanes of ${data.counts.orchestrators} orchestrators on ${hosts.join(', ')}, ${laneOut.reduce((s, l) => s + l.o.length + l.s.length, 0)} busy stretches, ${attributed} runs on lanes of ${runs.length}, ${(fs.statSync(out).size / 1024).toFixed(0)} KiB`)
console.log(JSON.stringify(data.counts))
