#!/usr/bin/env node
// One machine's share of the talk's statistics and of demo 2, in one file to send (Ivan, 15.10: «скрипт под ключ, который
// можно передать Алексею»). It runs the same scripts as the slides on this machine only:
//   1. .scripts/agent-hours.mjs --db: a private sessions database of this machine (stays here, under .temp/host-export/);
//   2. .scripts/swarm-stats.mjs: the two weeks' aggregates (orchestrators, subagents, runs, people);
//   3. .scripts/demo-swarm.mjs: demo 2's anonymous lanes and the busy counts per 10 minutes;
// and writes .temp/host-export/<host>-export.json: numbers and timestamps only. No project names, paths, session ids,
// prompts or message text leave the machine; the database and the intermediate files stay in .temp/host-export/.
//
//   npm run host-export -- --host m1max            (Alexey's MacBook)
//   node .scripts/host-export.mjs --host NAME [--from 2026-09-29] [--to 2026-10-13] [--abort-load 12]
//
// --from / --to are Moscow dates, the window of «Работа агентов за две недели» and demo 2. Send the printed file to
// Ivan; on his side .scripts/merge-host.mjs folds it into slides/demo/stats.json and slides/demo/swarm.json.
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const host = one('--host')
if (!host || !/^[a-z0-9-]+$/.test(host)) { console.error('usage: node .scripts/host-export.mjs --host NAME (lowercase letters, digits, dashes: m1max)'); process.exit(2) }
const fromDay = one('--from', '2026-09-29'), toDay = one('--to', '2026-10-13')
const MSK = 3 * 3600e3
const day = (s) => Date.parse(`${s}T00:00:00Z`) - MSK
const from = day(fromDay), to = day(toDay)
const utcDay = (t) => new Date(t).toISOString().slice(0, 10)
const dir = path.resolve('.temp/host-export')
process.umask(0o077)
fs.mkdirSync(dir, { recursive: true })
const db = path.join(dir, `${host}.sqlite`), statsFile = path.join(dir, `${host}-stats.json`), swarmFile = path.join(dir, `${host}-swarm.json`)
const out = path.join(dir, `${host}-export.json`)

const run = (label, args) => {
  console.log(`\n== ${label}`)
  const r = spawnSync(process.execPath, ['--no-warnings', ...args], { stdio: 'inherit' })
  if (r.status !== 0) { console.error(`${label} failed (exit ${r.status}); nothing was written to ${out}`); process.exit(r.status || 1) }
}
fs.rmSync(db, { force: true }) // a fresh database: agent-hours appends
// agent-hours takes UTC dates and covers whole days: this spans the Moscow window with a few hours to spare
run('sessions database (private, stays on this machine)', ['.scripts/agent-hours.mjs', '--since', utcDay(from), '--until', utcDay(to - 1), '--host', host, '--db', db, '--abort-load', one('--abort-load', '12')])
run('two weeks in numbers', ['.scripts/swarm-stats.mjs', '--db', db, '--from', fromDay, '--to', toDay, '--out', statsFile])
run('demo 2 lanes', ['.scripts/demo-swarm.mjs', '--db', db, '--from', fromDay, '--to', toDay, '--out', swarmFile])

const { DatabaseSync } = await import('node:sqlite')
const d = new DatabaseSync(db, { readOnly: true })
const prompts = d.prepare('SELECT p.ts_ms t FROM prompts p JOIN sessions s ON s.id = p.session_id WHERE p.ts_ms >= ? AND p.ts_ms < ? ORDER BY p.ts_ms').all(from, to).map((x) => x.t)
d.close()

const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8')).twoWeeks
delete stats.messages // a2a messages come from the room export, not from a machine
const swarm = JSON.parse(fs.readFileSync(swarmFile, 'utf8'))
delete swarm.matrix
const data = {
  about: `Talk statistics of one machine for the window ${fromDay} … ${toDay} (Moscow): aggregates, anonymous demo 2 lanes and the times a person wrote into an orchestrator. No names, paths, session ids or text. .scripts/host-export.mjs`,
  host,
  made: new Date().toISOString(),
  window: [from, to],
  stats,
  swarm,
  people: { prompts },
}
const body = JSON.stringify(data)
for (const bad of [process.env.HOME, '/Users/', '.jsonl', 'session.jsonl']) if (bad && body.includes(bad)) { console.error(`refusing to write: the export contains «${bad}»`); process.exit(1) }
fs.writeFileSync(out, body)
const sha = crypto.createHash('sha256').update(body).digest('hex')
const o = stats.orchestrators, s = stats.subagents
console.log(`\n== ${out}`)
console.log(`orchestrators: ${JSON.stringify(o.lanes1h)} with ≥ 1 h, ${o.sessions} sessions, ${o.sumH} h; subagents: ${s.sessions} sessions, ${s.sumH} h`)
console.log(`board runs: ${stats.runs.total}; demo 2 lanes: ${swarm.lanes.length}; a person wrote into an orchestrator ${prompts.length} times`)
console.log(`${(body.length / 1024).toFixed(0)} KiB, sha256 ${sha}`)
console.log(`Send this file to Ivan (not over a2a while Matrix is down). The database ${db} stays here; delete .temp/host-export/ afterwards if you like.`)
