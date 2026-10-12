#!/usr/bin/env node
// Agent hours for the autonomy slide (speakers' call of 2026-10-12): how long orchestrators and workers
// were actually busy over a window, and how many landings reached main, on THIS machine. Run it on every
// machine, then merge the JSON files to get one table (orchestrators and main orchestrators are one cohort).
//
// Reads only timestamps and session metadata, never message content, and prints aggregates only.
//
//   orchestrators  interactive sessions: Claude Code with entrypoint "cli", Codex with any source but "exec"
//                  and subagent threads. Override with --orch-cwd / --worker-cwd (regex on the session cwd).
//   workers        headless sessions (Claude "sdk-cli", Codex "exec"), Claude subagent transcripts and Codex
//                  subagent threads; task-board run ledgers (.temp/spawn-runs/RUN-*/state.json) are reported
//                  as their own row because they carry exact start and end times.
//   landings       first-parent commits on the default branch of every local git repository, deduplicated
//                  by commit hash across clones and worktrees (local refs, no fetch).
//
// Active time: per session, consecutive events closer than --idle-min minutes form one busy interval;
// a longer gap is idle and does not count. "sum h" adds sessions up (parallel work counts in parallel),
// "wall h" is the union (hours when at least one session of the cohort was busy).
//
// Usage:
//   node .scripts/agent-hours.mjs [--days 14 | --since 2026-09-29] [--until 2026-10-13] [--idle-min 15]
//        [--claude-root DIR]... [--codex-root DIR]... [--repos-root DIR]... [--orch-cwd RE] [--worker-cwd RE]
//        [--host NAME] [--json out.json]
//   node .scripts/agent-hours.mjs --merge mini.json mbp.json m1max.json
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import readline from 'node:readline'
import { execFileSync } from 'node:child_process'

const argv = process.argv.slice(2)
const multi = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] ? [argv[i + 1]] : []))
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const HOME = os.homedir()

function unionHours(intervals) {
  const xs = intervals.map(([a, b]) => [a, b]).sort((p, q) => p[0] - q[0])
  let total = 0, cur = null
  for (const [a, b] of xs) {
    if (!cur || a > cur[1]) { if (cur) total += cur[1] - cur[0]; cur = [a, b] } else if (b > cur[1]) cur[1] = b
  }
  if (cur) total += cur[1] - cur[0]
  return total / 3600e3
}
const sumHours = (intervals) => intervals.reduce((s, [a, b]) => s + (b - a), 0) / 3600e3
const fmt = (h) => h.toFixed(1).padStart(9)

function printTable(r) {
  console.log(`agent-hours · ${r.hosts.join(', ')} · ${r.since.slice(0, 10)} … ${r.until.slice(0, 10)} · idle gap ${r.idleMin} min`)
  console.log(`${'cohort'.padEnd(34)} ${'count'.padStart(7)} ${'sum h'.padStart(9)} ${'wall h'.padStart(9)}`)
  for (const [name, label] of [['orchestrators', 'orchestrators (interactive)'], ['workers', 'workers (headless, subagents)'], ['runs', '  of them task-board runs']]) {
    const c = r.cohorts[name]
    console.log(`${label.padEnd(34)} ${String(c.count).padStart(7)} ${fmt(sumHours(c.intervals))} ${fmt(unionHours(c.intervals))}`)
  }
  console.log(`${'landings on main (git)'.padEnd(34)} ${String(r.landings.commits.length).padStart(7)}  commits in ${r.landings.repos.length} repositories`)
  if (r.notes.length) console.log('notes: ' + r.notes.join('; '))
}

// ---- merge mode -------------------------------------------------------------------------------------
if (argv[0] === '--merge') {
  const files = argv.slice(1)
  const out = { hosts: [], since: '', until: '', idleMin: 0, cohorts: { orchestrators: { count: 0, intervals: [] }, workers: { count: 0, intervals: [] }, runs: { count: 0, intervals: [] } }, landings: { commits: [], repos: [] }, notes: [] }
  const seen = new Set(), seenRepos = new Set()
  for (const f of files) {
    const r = JSON.parse(fs.readFileSync(f, 'utf8'))
    out.hosts.push(...r.hosts)
    out.since = !out.since || r.since < out.since ? r.since : out.since
    out.until = !out.until || r.until > out.until ? r.until : out.until
    out.idleMin = r.idleMin
    for (const k of Object.keys(out.cohorts)) { out.cohorts[k].count += r.cohorts[k].count; out.cohorts[k].intervals.push(...r.cohorts[k].intervals) }
    for (const h of r.landings.commits) seen.add(h)
    for (const u of r.landings.repos) seenRepos.add(u)
    out.notes.push(...r.notes.map((n) => `${r.hosts[0]}: ${n}`))
  }
  out.landings.commits = [...seen]
  out.landings.repos = [...seenRepos]
  printTable(out)
  process.exit(0)
}

// ---- collect mode -----------------------------------------------------------------------------------
const until = one('--until') ? new Date(one('--until') + 'T23:59:59Z').getTime() : Date.now()
const since = one('--since') ? new Date(one('--since') + 'T00:00:00Z').getTime() : until - Number(one('--days', '14')) * 86400e3
const idleMs = Number(one('--idle-min', '15')) * 60e3
const orchRe = one('--orch-cwd') ? new RegExp(one('--orch-cwd')) : null
const workerRe = one('--worker-cwd') ? new RegExp(one('--worker-cwd')) : null
const host = one('--host', os.hostname().split('.')[0])
const notes = []

const curatorEnvs = (() => { try { return fs.readdirSync(path.join(HOME, '.curator/environments')).map((e) => path.join(HOME, '.curator/environments', e)) } catch { return [] } })()
const claudeRoots = multi('--claude-root').length ? multi('--claude-root') : [path.join(HOME, '.claude/projects'), ...curatorEnvs.map((e) => path.join(e, 'claude_code/projects'))]
const codexRoots = multi('--codex-root').length ? multi('--codex-root') : [path.join(HOME, '.codex/sessions'), ...curatorEnvs.map((e) => path.join(e, 'codex_cli/sessions'))]
const repoRoots = multi('--repos-root').length ? multi('--repos-root') : [path.join(HOME, 'Developer'), path.join(HOME, 'src')]

// files under root, at most `depth` levels down, modified inside the window
function walk(root, depth, pred) {
  const out = []
  const go = (dir, d) => {
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of ents) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) { if (d > 0 && e.name !== 'node_modules') go(p, d - 1) } else if (pred(p)) {
        try { if (fs.statSync(p).mtimeMs >= since) out.push(p) } catch {}
      }
    }
  }
  go(root, depth)
  return out
}

function intervalsOf(times) {
  const ts = times.filter((t) => t >= since && t <= until).sort((a, b) => a - b)
  const out = []
  let a = null, b = null
  for (const t of ts) {
    if (a === null) { a = b = t; continue }
    if (t - b <= idleMs) b = t; else { if (b > a) out.push([a, b]); a = b = t }
  }
  if (a !== null && b > a) out.push([a, b])
  return out
}

async function readSession(file, kind) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity })
  const times = []
  let entry = null, cwd = null, source = null, sidechain = false
  for await (const line of rl) {
    if (!line) continue
    let d; try { d = JSON.parse(line) } catch { continue }
    if (kind === 'claude') {
      if (entry === null && typeof d.entrypoint === 'string') entry = d.entrypoint
      if (cwd === null && typeof d.cwd === 'string') cwd = d.cwd
      if (d.isSidechain === true) sidechain = true
    } else if (d.type === 'session_meta' && d.payload) {
      source = d.payload.source
      if (typeof d.payload.cwd === 'string') cwd = d.payload.cwd
    }
    const t = Date.parse(d.timestamp)
    if (!Number.isNaN(t)) times.push(t)
  }
  return { times, entry, cwd, source, sidechain }
}

function cohortOf(s, file, kind) {
  if (s.cwd && orchRe && orchRe.test(s.cwd)) return 'orchestrators'
  if (s.cwd && workerRe && workerRe.test(s.cwd)) return 'workers'
  if (kind === 'claude') return file.includes(`${path.sep}subagents${path.sep}`) || s.sidechain || (s.entry && s.entry !== 'cli') ? 'workers' : 'orchestrators'
  return s.source === 'exec' || (s.source && typeof s.source === 'object') ? 'workers' : 'orchestrators'
}

const cohorts = { orchestrators: { count: 0, intervals: [] }, workers: { count: 0, intervals: [] }, runs: { count: 0, intervals: [] } }

for (const root of claudeRoots) {
  if (!fs.existsSync(root)) continue
  for (const f of walk(root, 3, (p) => p.endsWith('.jsonl'))) {
    const s = await readSession(f, 'claude')
    const iv = intervalsOf(s.times)
    if (!iv.length) continue
    const c = cohortOf(s, f, 'claude')
    cohorts[c].count++
    cohorts[c].intervals.push(...iv)
  }
}
for (const root of codexRoots) {
  if (!fs.existsSync(root)) continue
  for (const f of walk(root, 4, (p) => /rollout-.*\.jsonl$/.test(p))) {
    const s = await readSession(f, 'codex')
    const iv = intervalsOf(s.times)
    if (!iv.length) continue
    const c = cohortOf(s, f, 'codex')
    cohorts[c].count++
    cohorts[c].intervals.push(...iv)
  }
}

// local git repositories (a directory with .git), at most three levels under each repos root
const gitDirs = []
for (const root of repoRoots) {
  if (!fs.existsSync(root)) continue
  const go = (dir, d) => {
    if (fs.existsSync(path.join(dir, '.git'))) { gitDirs.push(dir); return }
    if (d === 0) return
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of ents) if (e.isDirectory() && !e.name.startsWith('.') && e.name !== 'node_modules') go(path.join(dir, e.name), d - 1)
  }
  go(root, 3)
}

// task-board run ledgers in each repository: exact start and end per run
const runIds = new Set()
for (const dir of gitDirs) {
  const runsDir = path.join(dir, '.temp', 'spawn-runs')
  let ents; try { ents = fs.readdirSync(runsDir) } catch { continue }
  for (const name of ents) {
    if (!name.startsWith('RUN-')) continue
    const f = path.join(runsDir, name, 'state.json')
    let st; try { if (fs.statSync(f).mtimeMs < since) continue; st = JSON.parse(fs.readFileSync(f, 'utf8')) } catch { continue }
    const id = st.id || name
    if (runIds.has(id)) continue
    const a = Date.parse(st.started_at), b = Date.parse(st.completed_at || st.last_heartbeat_at || '')
    if (Number.isNaN(a) || Number.isNaN(b) || b <= a) continue
    const lo = Math.max(a, since), hi = Math.min(b, until)
    if (hi <= lo) continue
    runIds.add(id)
    cohorts.runs.count++
    cohorts.runs.intervals.push([lo, hi])
  }
}

// landings: first-parent commits on the default branch, deduplicated by hash; repositories by remote URL
const commits = new Set()
const landedRepos = new Set()
const sinceIso = new Date(since).toISOString(), untilIso = new Date(until).toISOString()
for (const dir of gitDirs) {
  const git = (...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 }).trim()
  let ref = null
  for (const r of ['origin/main', 'origin/master', 'main', 'master']) { try { git('rev-parse', '--verify', '--quiet', r); ref = r; break } catch {} }
  if (!ref) continue
  let out = ''
  try { out = git('log', '--first-parent', `--since=${sinceIso}`, `--until=${untilIso}`, '--format=%H', ref) } catch { continue }
  const hs = out ? out.split('\n') : []
  if (!hs.length) continue
  let remote = dir
  try { remote = git('config', '--get', 'remote.origin.url') || dir } catch {}
  landedRepos.add(remote.replace(/\.git$/, ''))
  for (const h of hs) commits.add(h)
}
notes.push(`${gitDirs.length} local repositories scanned, local refs only (no fetch)`)

const result = { hosts: [host], since: new Date(since).toISOString(), until: new Date(until).toISOString(), idleMin: idleMs / 60e3, cohorts, landings: { commits: [...commits], repos: [...landedRepos] }, notes }
printTable(result)
const out = one('--json')
if (out) { fs.writeFileSync(out, JSON.stringify(result)); console.log(`wrote ${out} (timestamps and commit hashes only)`) }
