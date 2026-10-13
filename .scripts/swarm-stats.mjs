#!/usr/bin/env node
// The swarm's statistics for the talk (Ivan, 13.10: «статистику… по сообщениям, по оркестраторам, по часам, по
// субагентам… 1–2 слайда»): four views over the window of demo 2 and since July, from the private sessions database
// (.scripts/agent-hours.mjs --db), the a2a metadata export and other machines' agent-hours JSON. Prints the tables and
// writes aggregates only (no names, no paths) for the statistics slides.
//
//   node .scripts/swarm-stats.mjs --db ~/private/agent-hours/sessions.sqlite --a2a messages.ndjson.gz
//        [--from 2026-09-29] [--to 2026-10-13] [--since 2026-07-01] [--runs-json ivmbp.json] [--runs-json-long ivmbp-0701.json]
//        [--out slides/demo/stats.json]
//
// Windows are Moscow dates. Orchestrators are counted as lanes: a project directory on a machine with at least an hour
// (and, separately, ten hours) of interactive work. Hours: "sum" adds sessions up, "wall" is the union.
import fs from 'node:fs'
import zlib from 'node:zlib'
import { DatabaseSync } from 'node:sqlite'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const MSK = 3 * 3600e3, SLOT = 600e3, H = 3600e3
const day = (s) => Date.parse(`${s}T00:00:00Z`) - MSK
const from = day(one('--from', '2026-09-29')), to = day(one('--to', '2026-10-13')), since = day(one('--since', '2026-07-01'))
const db = new DatabaseSync(one('--db'), { readOnly: true })
const r1 = (x) => Math.round(x)

function union(iv) {
  const xs = iv.slice().sort((a, b) => a[0] - b[0])
  let t = 0, cur = null
  for (const [a, b] of xs) { if (!cur || a > cur[1]) { if (cur) t += cur[1] - cur[0]; cur = [a, b] } else if (b > cur[1]) cur[1] = b }
  return (cur ? t + cur[1] - cur[0] : t) / H
}

function sessionsView(lo, hi) {
  const rows = db.prepare(`SELECT s.id, s.host, s.project, s.runtime, s.cohort, i.start_ms a, i.end_ms b FROM intervals i JOIN sessions s ON s.id = i.session_id WHERE i.end_ms > ? AND i.start_ms < ?`).all(lo, hi)
  const v = { orch: { sessions: new Set(), byRuntime: {}, iv: [], sum: 0 }, work: { sessions: new Set(), byRuntime: {}, iv: [], sum: 0 }, lanes: new Map(), hosts: new Set() }
  for (const r of rows) {
    const a = Math.max(r.a, lo), b = Math.min(r.b, hi)
    if (b <= a) continue
    const g = r.cohort === 'orchestrators' ? v.orch : v.work
    g.sessions.add(r.id)
    const rt = (g.byRuntime[r.runtime] ||= { sessions: new Set(), sum: 0 })
    rt.sessions.add(r.id); rt.sum += (b - a) / H
    g.iv.push([a, b]); g.sum += (b - a) / H
    v.hosts.add(r.host)
    if (g === v.orch) { const k = `${r.host}\u0000${r.project}`; v.lanes.set(k, (v.lanes.get(k) || 0) + (b - a) / H) }
  }
  const lanesBy = (min) => { const o = {}; for (const [k, h] of v.lanes) if (h >= min) { const host = k.split('\u0000')[0]; o[host] = (o[host] || 0) + 1 } return o }
  const pack = (g) => ({ sessions: g.sessions.size, sumH: r1(g.sum), wallH: r1(union(g.iv)), byRuntime: Object.fromEntries(Object.entries(g.byRuntime).map(([k, x]) => [k, { sessions: x.sessions.size, sumH: r1(x.sum) }])) })
  // concurrency per 10 minutes: distinct orchestrators (lanes), subagent sessions
  const n = Math.ceil((hi - lo) / SLOT), cs = Array.from({ length: n }, () => new Set()), cw = new Array(n).fill(0)
  for (const r of rows) {
    const a = Math.max(r.a, lo), b = Math.min(r.b, hi)
    if (b <= a) continue
    for (let k = Math.floor((a - lo) / SLOT); k <= Math.min(n - 1, Math.floor((b - 1 - lo) / SLOT)); k++) {
      if (r.cohort === 'orchestrators') cs[k].add(`${r.host}\u0000${r.project}`); else cw[k]++
    }
  }
  const co = cs.map((x) => x.size)
  const peak = (s) => { let k = 0; s.forEach((x, i) => { if (x > s[k]) k = i }); return { n: s[k], at: new Date(lo + k * SLOT).toISOString() } }
  const median = (s) => s.slice().sort((a, b) => a - b)[Math.floor(s.length / 2)]
  return {
    hosts: [...v.hosts].sort(),
    orchestrators: { lanes1h: lanesBy(1), lanes10h: lanesBy(10), ...pack(v.orch), peak: peak(co), median: median(co) },
    subagents: { ...pack(v.work), peak: peak(cw), median: median(cw) },
  }
}

function runsView(lo, hi, jsonFile) {
  const mini = db.prepare('SELECT host, role, runtime, started_ms a, ended_ms b FROM runs WHERE started_ms >= ? AND started_ms < ?').all(lo, hi)
  const byRole = {}, byRuntime = {}
  for (const x of mini) { byRole[x.role || '?'] = (byRole[x.role || '?'] || 0) + 1; byRuntime[x.runtime || '?'] = (byRuntime[x.runtime || '?'] || 0) + 1 }
  let other = 0, otherH = 0
  if (jsonFile) {
    const j = JSON.parse(fs.readFileSync(jsonFile, 'utf8'))
    for (const r of Array.isArray(j) ? j : [j]) for (const [a, b] of r.cohorts.runs.intervals) if (a >= lo && a < hi) { other++; otherH += (b - a) / H }
  }
  return { total: mini.length + other, mini: mini.length, other, rolesMini: byRole, runtimesMini: byRuntime, sumH: r1(mini.reduce((s, x) => s + (x.b - x.a) / H, 0) + otherH) }
}

// people: the moments a person wrote into an orchestrator (agent-hours --db, prompts)
function peopleView(lo, hi) {
  let rows = []
  try { rows = db.prepare('SELECT s.host, p.ts_ms t FROM prompts p JOIN sessions s ON s.id = p.session_id WHERE p.ts_ms >= ? AND p.ts_ms < ? ORDER BY p.ts_ms').all(lo, hi) } catch { return null }
  let gap = 0, gapAt = 0
  for (let i = 1; i < rows.length; i++) if (rows[i].t - rows[i - 1].t > gap) { gap = rows[i].t - rows[i - 1].t; gapAt = rows[i - 1].t }
  const byHost = {}
  for (const r of rows) byHost[r.host] = (byHost[r.host] || 0) + 1
  const days = Math.round((hi - lo) / 86400e3)
  return { prompts: rows.length, byHost, perDay: r1(rows.length / days), longestGapH: Math.round((gap / H) * 10) / 10, longestGapFrom: gapAt ? new Date(gapAt).toISOString() : null }
}

function messagesView(file, lo, hi) {
  const side = (a) => (a.startsWith('m1max_') ? 'alexey' : 'ivan')
  const seen = new Set(), agents = { ivan: new Set(), alexey: new Set() }, byKind = {}, bySide = { ivan: 0, alexey: 0 }, perDay = {}
  let total = 0, cross = 0, crossFrom = { ivan: 0, alexey: 0 }
  for (const l of zlib.gunzipSync(fs.readFileSync(file)).toString('utf8').split('\n')) {
    if (!l) continue
    const m = JSON.parse(l)
    if (m.room === '#system') continue // a mirror of other rooms
    const key = `${m.at}|${m.sender}|${m.kind}|${m.topic}`
    if (seen.has(key)) continue
    seen.add(key)
    const t = Date.parse(m.at)
    if (!(t >= lo && t < hi)) continue
    const s = side(m.sender)
    total++; bySide[s]++; agents[s].add(m.sender)
    byKind[m.kind] = (byKind[m.kind] || 0) + 1
    const d = new Date(t + MSK).toISOString().slice(0, 10)
    perDay[d] = (perDay[d] || 0) + 1
    if ((m.to || []).some((x) => x && x !== 'all' && side(x) !== s)) { cross++; crossFrom[s]++ }
  }
  const busiest = Object.entries(perDay).sort((a, b) => b[1] - a[1])[0]
  return { total, lowerBound: true, agents: { ivan: agents.ivan.size, alexey: agents.alexey.size }, bySide, cross, crossFrom, byKind, perDayAvg: r1(total / 14), busiestDay: busiest }
}

const two = { window: [from, to], ...sessionsView(from, to), runs: runsView(from, to, one('--runs-json')), people: peopleView(from, to), messages: one('--a2a') ? messagesView(one('--a2a'), from, to) : null }
const long = { window: [since, to], ...sessionsView(since, to), runs: runsView(since, to, one('--runs-json-long')) }
const out = { about: 'Swarm statistics for the talk, aggregates only; .scripts/swarm-stats.mjs. Machines: those in the sessions database (m1max joins with its own numbers). Messages are a lower bound: two long a2a threads are truncated in the export and rooms outside the exporters\' membership are missing.', twoWeeks: two, sinceJuly: long }
fs.writeFileSync(one('--out', 'slides/demo/stats.json'), JSON.stringify(out, null, 1))

const fmt = (w) => `${new Date(w[0] + MSK).toISOString().slice(0, 10)} … ${new Date(w[1] + MSK - 1).toISOString().slice(0, 10)} мск`
for (const [name, v] of [['two weeks', two], ['since July', long]]) {
  console.log(`\n== ${name}: ${fmt(v.window)}, machines ${v.hosts.join(', ')}`)
  const o = v.orchestrators, s = v.subagents
  console.log(`orchestrators: lanes >=1h ${JSON.stringify(o.lanes1h)}, >=10h ${JSON.stringify(o.lanes10h)}; sessions ${o.sessions}; ${o.sumH} h sum, ${o.wallH} h wall; peak ${o.peak.n} at ${o.peak.at}, median ${o.median}`)
  console.log(`  by runtime: ${Object.entries(o.byRuntime).map(([k, x]) => `${k} ${x.sessions} sessions ${x.sumH} h`).join('; ')}`)
  console.log(`subagents: sessions ${s.sessions}; ${s.sumH} h sum, ${s.wallH} h wall; peak ${s.peak.n} at ${s.peak.at}, median ${s.median}`)
  console.log(`  by runtime: ${Object.entries(s.byRuntime).map(([k, x]) => `${k} ${x.sessions} sessions ${x.sumH} h`).join('; ')}`)
  console.log(`board runs: ${v.runs.total} (mini ${v.runs.mini}, other ${v.runs.other}); ${v.runs.sumH} h; roles on mini ${JSON.stringify(v.runs.rolesMini)}; runtimes on mini ${JSON.stringify(v.runs.runtimesMini)}`)
  if (v.people) console.log(`people: ${v.people.prompts} prompts into orchestrators ${JSON.stringify(v.people.byHost)}, ${v.people.perDay} a day, longest gap ${v.people.longestGapH} h from ${v.people.longestGapFrom}`)
  if (v.messages) { const m = v.messages; console.log(`messages: at least ${m.total}; agents ${JSON.stringify(m.agents)}; by side ${JSON.stringify(m.bySide)}; across ${m.cross} ${JSON.stringify(m.crossFrom)}; per day ${m.perDayAvg}, busiest ${m.busiestDay}; kinds ${JSON.stringify(m.byKind)}`) }
}
