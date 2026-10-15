#!/usr/bin/env node
// Fold one machine's export (.scripts/host-export.mjs) into the talk's statistics and demo 2: slides/demo/stats.json
// (twoWeeks) and slides/demo/swarm.json. Counts and hours add up; the peaks and medians of busy orchestrators and subagents
// are recounted from the merged 10-minute series; people's hours add the new machine's person to the old ones (a different
// person: 10-minute buckets of their own); the longest stretch with no person is recounted when the new prompts fall inside
// the old one. Refuses a machine that is already in the files and a different window.
//
//   node .scripts/merge-host.mjs --export .temp/host-export/m1max-export.json [--person alexey]
//        [--people-db .temp/human-hours/ivmbp.sqlite] [--stats slides/demo/stats.json] [--swarm slides/demo/swarm.json] [--dry-run]
//
// --people-db: the sessions database of a machine already in the files, needed only when the longest stretch with no
// person has to be recounted (the old machines' prompts are then taken from it and from demo 2's kept lanes; prompts known
// only to their 30-minute bin count at the middle of the bin).
import fs from 'node:fs'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const statsFile = one('--stats', 'slides/demo/stats.json'), swarmFile = one('--swarm', 'slides/demo/swarm.json')
const x = JSON.parse(fs.readFileSync(one('--export'), 'utf8'))
const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8')), sw = JSON.parse(fs.readFileSync(swarmFile, 'utf8'))
const v = stats.twoWeeks, h = x.host, person = one('--person', h)
const same = (a, b) => a[0] === b[0] && a[1] === b[1]
const fail = (m) => { console.error(m); process.exit(1) }
if (!same(x.window, v.window) || !same(x.window, sw.window)) fail(`window ${x.window} differs from the slides' ${v.window}`)
if (v.hosts.includes(h) || sw.hosts.some((y) => y.id === h)) fail(`${h} is already in ${statsFile} or ${swarmFile}`)
const [from, to] = v.window, H = 3600e3, SLOT = sw.slot

// ---- demo 2 first: the merged series give the peaks for the statistics too -------------------------------------
const addSeries = (a, b) => { if (a.length !== b.length) fail('series of different length'); return a.map((y, i) => y + b[i]) }
const xs = x.swarm
sw.hosts.push(...xs.hosts.filter((y) => y.id === h))
sw.lanes.push(...xs.lanes)
sw.orch = addSeries(sw.orch, xs.orch)
sw.work = addSeries(sw.work, xs.work)
sw.runs = [...sw.runs, ...xs.runs].sort((a, b) => a - b)
const peak = (s) => { let k = 0; for (let i = 1; i < s.length; i++) if (s[i] > s[k]) k = i; return { slot: k, n: s[k] } }
const median = (s) => s.slice().sort((a, b) => a - b)[Math.floor(s.length / 2)]
const c = sw.counts, xc = xs.counts
Object.assign(c, {
  orchestrators: c.orchestrators + xc.orchestrators, shown: c.shown + xc.shown, attributedRuns: c.attributedRuns + xc.attributedRuns,
  peakOrch: peak(sw.orch), peakWork: peak(sw.work), orchHours: c.orchHours + xc.orchHours, workHours: c.workHours + xc.workHours, runs: sw.runs.length,
})

// ---- the statistics ------------------------------------------------------------------------------------------
const xv = x.stats
v.hosts = [...v.hosts, h].sort()
for (const [k, g] of [['orchestrators', sw.orch], ['subagents', sw.work]]) {
  const a = v[k], b = xv[k]
  if (k === 'orchestrators') { a.lanes1h[h] = b.lanes1h[h] || 0; a.lanes10h[h] = b.lanes10h[h] || 0 }
  a.sessions += b.sessions; a.sumH += b.sumH
  a.wallHosts ||= v.hosts.filter((y) => y !== h) // the union over machines cannot be rebuilt from sums: wall clock stays theirs
  for (const [rt, y] of Object.entries(b.byRuntime)) { const z = (a.byRuntime[rt] ||= { sessions: 0, sumH: 0 }); z.sessions += y.sessions; z.sumH += y.sumH }
  const p = peak(g)
  a.peak = { n: p.n, at: new Date(from + p.slot * SLOT).toISOString() }
  a.median = median(g)
}
v.runs.total += xv.runs.total; v.runs.other += xv.runs.total; v.runs.sumH += xv.runs.sumH
v.runs.byHost = { ...(v.runs.byHost || {}), [h]: xv.runs.total }

// people: prompts, their own 10-minute buckets, and the longest stretch with no person
const P = v.people, prompts = x.people.prompts.filter((t) => t >= from && t < to)
const buckets = new Set(prompts.map((t) => Math.floor((t - from) / 600e3))).size
const hrs = Math.round((buckets * 600e3) / H * 10) / 10
P.hoursBy = { ...(P.hoursBy || { others: P.hours }), [person]: [hrs, hrs] }
P.hours = Object.values(P.hoursBy).reduce((s, r) => [s[0] + r[0], s[1] + r[1]], [0, 0]).map((y) => Math.round(y * 10) / 10)
P.prompts += prompts.length; P.byHost[h] = prompts.length
P.perDay = Math.round(P.prompts / Math.round((to - from) / 86400e3))
const human = sw.human
const xb = xs.human.series
human.series = addSeries(human.series, xb); human.total += xs.human.total
human.who = 'люди' // demo 2 labels the row and the beat for more than one person
const g0 = Date.parse(P.longestGapFrom), g1 = g0 + P.longestGapH * H
if (prompts.some((t) => t > g0 && t < g1)) {
  // the old longest stretch is broken: recount it over every prompt we know to the second (or to the half hour)
  if (!one('--people-db')) fail(`${h}'s prompts fall inside the longest stretch with no person (${P.longestGapFrom}, ${P.longestGapH} h): pass --people-db with the database of a machine already in the files`)
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(one('--people-db'), { readOnly: true })
  const dbHosts = new Set(), all = []
  for (const r of db.prepare('SELECT s.host, p.ts_ms t FROM prompts p JOIN sessions s ON s.id = p.session_id WHERE p.ts_ms >= ? AND p.ts_ms < ?').all(from, to)) { dbHosts.add(r.host); all.push(r.t) }
  db.close()
  const bin = human.bin, left = human.series.map((y, i) => y - xb[i]) // the old machines' prompts per bin
  for (const t of all) left[Math.floor((t - from) / bin)]--
  for (const l of sw.lanes) if (l.host !== h && !dbHosts.has(l.host)) for (const s of l.h || []) { all.push(from + s * 1000); left[Math.floor((from + s * 1000 - from) / bin)]-- }
  left.forEach((m, k) => { if (m < 0) fail(`bin ${k}: the database does not match demo 2`); for (let i = 0; i < m; i++) all.push(from + k * bin + bin / 2) })
  all.push(...prompts); all.sort((a, b) => a - b)
  let gap = 0, at = 0
  for (let i = 1; i < all.length; i++) if (all[i] - all[i - 1] > gap) { gap = all[i] - all[i - 1]; at = all[i - 1] }
  P.longestGapH = Math.round((gap / H) * 10) / 10; P.longestGapFrom = new Date(at).toISOString()
  human.longestGapH = P.longestGapH
}

const summary = `${h}: orchestrators ${JSON.stringify(v.orchestrators.lanes1h)} (≥ 1 h), peak ${v.orchestrators.peak.n}; subagents ${v.subagents.sessions}, peak ${v.subagents.peak.n}; agent hours ${v.orchestrators.sumH + v.subagents.sumH}; runs ${v.runs.total}; people ${P.prompts} prompts, ${P.hours.join('–')} h ${JSON.stringify(P.hoursBy)}, longest stretch with no person ${P.longestGapH} h; demo 2 lanes ${sw.lanes.length} on ${sw.hosts.map((y) => y.id).join(', ')}`
if (argv.includes('--dry-run')) { console.log(`dry run, nothing written: ${summary}`); process.exit(0) }
fs.writeFileSync(statsFile, JSON.stringify(stats, null, 1))
fs.writeFileSync(swarmFile, JSON.stringify(sw))
console.log(`merged ${summary}`)
