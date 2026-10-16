#!/usr/bin/env node
// People's time for «Работа агентов за две недели» (Alexey's review 15.10; Ivan 15.10: «10-минутки»): the 10-minute buckets
// in which a person wrote into an orchestrator, times 10 minutes. One person cannot type twice at once, so a person's
// machines share one timeline (a bucket with prompts on two of them counts once); different people add up.
//
// Prompts are timestamps only: the prompts table of the private sessions database (.scripts/agent-hours.mjs --db), or a
// host export of another machine (.scripts/host-export.mjs). A machine whose database is gone can come from demo 2's data
// (--swarm slides/demo/swarm.json --swarm-host mini): its prompts on the kept lanes are exact to the second, the others are
// only placed in their 30-minute bins of human.series, which turns the result into a range.
//
//   node .scripts/people-hours.mjs [--db FILE.sqlite]… [--export HOST-export.json]… [--swarm slides/demo/swarm.json
//        --swarm-host mini…] [--person ivan=mini,ivmbp --person alexey=m1max] [--from 2026-09-29] [--to 2026-10-13]
//        [--drop HOST=noise.json]… [--write slides/demo/stats.json] [--json out.json]
//
// --drop takes a machine's status pings and filler out of its prompts: a JSON array of timestamps (ms) from
// .scripts/prompt-triage.mjs, which labels each prompt with a light model (Alexey, 16.10: «чокак», «где мы»).
//
// --person groups machines by person (default: all machines are one person). --write sets twoWeeks.people.hours in a
// statistics file to [low, high] hours.
import fs from 'node:fs'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const multi = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] ? [argv[i + 1]] : []))
const MSK = 3 * 3600e3, BUCKET = 600e3, H = 3600e3
const day = (s) => Date.parse(`${s}T00:00:00Z`) - MSK
const from = day(one('--from', '2026-09-29')), to = day(one('--to', '2026-10-13'))

// ---- prompts by machine ---------------------------------------------------------------------------------
const byHost = new Map() // host -> timestamps (ms)
const drop = new Map(multi('--drop').map((spec) => { const [h, f] = spec.split('='); return [h, new Set(JSON.parse(fs.readFileSync(f, 'utf8')))] }))
const dropped = new Map() // host -> timestamps left out
const add = (host, t) => { if (t >= from && t < to && drop.get(host)?.has(t)) { if (!dropped.has(host)) dropped.set(host, []); dropped.get(host).push(t); return }; if (t >= from && t < to) { if (!byHost.has(host)) byHost.set(host, []); byHost.get(host).push(t) } }
for (const f of multi('--db')) {
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(f, { readOnly: true })
  for (const r of db.prepare('SELECT s.host, p.ts_ms t FROM prompts p JOIN sessions s ON s.id = p.session_id WHERE p.ts_ms >= ? AND p.ts_ms < ?').all(from, to)) add(r.host, r.t)
  db.close()
}
for (const f of multi('--export')) {
  const x = JSON.parse(fs.readFileSync(f, 'utf8'))
  if (x.window[0] !== from || x.window[1] !== to) { console.error(`${f}: window ${x.window} differs from ${[from, to]}`); process.exit(2) }
  for (const t of x.people.prompts) add(x.host, t)
}

// ---- machines from demo 2's data: exact prompts on kept lanes, the rest bounded by their 30-minute bins ----------
const swarmHosts = multi('--swarm-host')
const missing = [] // [binStart, count]
if (swarmHosts.length) {
  const sw = JSON.parse(fs.readFileSync(one('--swarm'), 'utf8'))
  if (sw.window[0] !== from || sw.window[1] !== to) { console.error(`swarm window ${sw.window} differs from ${[from, to]}`); process.exit(2) }
  for (const l of sw.lanes) if (swarmHosts.includes(l.host)) for (const s of l.h || []) add(l.host, from + s * 1000)
  // human.series counts every prompt of the swarm's machines; what the database and the kept lanes do not explain is missing
  const bin = sw.human.bin, left = sw.human.series.slice()
  // a dropped prompt is known, not missing
  for (const h of sw.hosts.map((x) => x.id)) for (const t of [...(byHost.get(h) || []), ...(dropped.get(h) || [])]) left[Math.floor((t - from) / bin)]--
  left.forEach((m, k) => {
    if (m < 0) { console.error(`bin ${k}: ${-m} more prompts than demo 2 counted: the database is not the one demo 2 was built from`); process.exit(1) }
    if (m > 0) missing.push([from + k * bin, m, bin])
  })
}

// ---- buckets per person ------------------------------------------------------------------------------------
const people = new Map() // person -> hosts
for (const spec of multi('--person')) { const [p, hs] = spec.split('='); people.set(p, hs.split(',')) }
const hosts = [...byHost.keys()].sort()
for (const h of hosts) if (![...people.values()].some((hs) => hs.includes(h))) people.set(people.size ? h : 'all', people.size ? [h] : hosts.filter((x) => ![...people.values()].flat().includes(x)))
const result = { bucketMin: BUCKET / 60e3, window: [from, to], prompts: 0, buckets: 0, hours: [0, 0], people: {} }
for (const [p, hs] of people) {
  const set = new Set()
  let n = 0
  for (const h of hs) for (const t of byHost.get(h) || []) { set.add(Math.floor((t - from) / BUCKET)); n++ }
  let lo = 0, hi = 0
  if (hs.some((h) => swarmHosts.includes(h))) for (const [a, m, bin] of missing) {
    const first = Math.floor((a - from) / BUCKET), per = bin / BUCKET
    let covered = 0
    for (let k = first; k < first + per; k++) if (set.has(k)) covered++
    lo += covered ? 0 : 1; hi += Math.min(m, per - covered); n += m
  }
  const r1 = (b) => Math.round((b * BUCKET) / H * 10) / 10
  result.people[p] = { hosts: hs, prompts: n, buckets: set.size, hours: [r1(set.size + lo), r1(set.size + hi)] }
  result.prompts += n; result.buckets += set.size; result.hours[0] += set.size + lo; result.hours[1] += set.size + hi
}
result.hours = result.hours.map((b) => Math.round((b * BUCKET) / H * 10) / 10)

for (const [p, v] of Object.entries(result.people)) console.log(`${p} (${v.hosts.join(', ')}): ${v.prompts} prompts, ${v.buckets} buckets of 10 min known, ${v.hours[0]}–${v.hours[1]} h`)
for (const [h, ts] of dropped) console.log(`${h}: ${ts.length} status pings and filler left out (--drop)`)
console.log(`people: ${result.prompts} prompts, ${result.hours[0]}–${result.hours[1]} h${missing.length ? ` (${missing.reduce((s, [, m]) => s + m, 0)} prompts known only to their 30-minute bin)` : ''}`)
if (one('--json')) fs.writeFileSync(one('--json'), JSON.stringify(result))
if (one('--write')) {
  const f = one('--write'), s = JSON.parse(fs.readFileSync(f, 'utf8'))
  s.twoWeeks.people.hours = result.hours
  s.twoWeeks.people.hoursBy = Object.fromEntries(Object.entries(result.people).map(([p, v]) => [p, v.hours]))
  fs.writeFileSync(f, JSON.stringify(s, null, 1))
  console.log(`wrote twoWeeks.people.hours = ${JSON.stringify(result.hours)} to ${f}`)
}
