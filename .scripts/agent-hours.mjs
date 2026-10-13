#!/usr/bin/env node
// Agent hours for the autonomy slide (speakers' call of 2026-10-12): how long orchestrators and workers
// were actually busy over a window, and how many landings reached main. Run it on every machine and merge
// the JSON files into one table, or load several machines into one SQLite database and report from it.
//
// Reads only timestamps and session metadata, never message content, and prints aggregates only.
//
// Sources on this machine (--no-local skips all of them):
//   Claude Code  ~/.claude/projects and Curator environments (claude_code/projects)
//   Codex        ~/.codex/sessions, Curator environments (codex_cli/sessions), and every session hosted by
//                tb-sessiond, each with its own CODEX_HOME:
//                ~/Library/Application Support/task-board/session-manager/*/sessions/*/codex-home/sessions
//   Muse         ~/.local/share/muse/sessions (session.jsonl per session, subagents under subagent/)
//   task board   run ledgers .temp/spawn-runs/RUN-*/ in every repository (exact start and end per run)
//   git          first-parent commits on the default branch of every repository
// Exports from another machine: --archive <file.tar.zst> (repeat it) with --archive-host <name>. Each archive
// is streamed through Node's zstd and read in memory, never extracted, so it needs no free disk:
//   …/claude-code-projects/…/*.jsonl    Claude Code      codex/…/rollout-*.jsonl    Codex
//   …/sessions/…/session.jsonl          Muse
//
// Cohorts:
//   orchestrators  interactive sessions: Claude Code with an entrypoint other than sdk-*, Codex with any source
//                  but "exec" and subagent threads (tb-sessiond hosts codex-tui sessions), Muse sessions that
//                  ran in a terminal (their route facts name a terminal or a tmux pane)
//   workers        headless sessions (Claude sdk-*, Codex exec, Muse without a terminal), Claude subagent
//                  transcripts, Codex subagent threads and Muse subagents; task-board runs are their own row
//   landings       first-parent commits on the default branch of every local git repository, deduplicated
//                  by commit hash across clones and worktrees (local refs, no fetch)
// --orch-cwd / --worker-cwd (regex on the session cwd) override the cohort.
//
// Active time: per session, consecutive events closer than --idle-min minutes form one busy interval; a
// longer gap is idle and does not count. "sum h" adds sessions up (parallel work counts in parallel),
// "wall h" is the union (hours when at least one session of the cohort was busy).
//
// Usage:
//   node .scripts/agent-hours.mjs [--days 14 | --since 2026-09-29] [--until 2026-10-13] [--idle-min 15]
//        [--claude-root DIR]... [--codex-root DIR]... [--muse-root DIR]... [--repos-root DIR]...
//        [--archive FILE.tar.zst]... [--archive-host NAME] [--no-local] [--orch-cwd RE] [--worker-cwd RE]
//        [--host NAME] [--json out.json] [--db FILE.sqlite] [--abort-load 12] [--abort-free-gib 46]
//   node .scripts/agent-hours.mjs --report FILE.sqlite [window] [--host NAME]... [--repo-filter RE] [--json out.json]
//   node .scripts/agent-hours.mjs --merge mini.json ivmbp.json:runs,landings m1max.json
//
//   --db           also write every session (with its busy intervals), run and commit into a SQLite database;
//                  files it creates are private (umask 077). The database keeps cwd and file paths: it never
//                  leaves the machine; only the aggregates do.
//   --report       the table from a database, for any window and hosts; --repo-filter keeps the commits of
//                  matching remotes only (for example relux-works/)
//   --merge        sum JSON files; a ":sections" suffix takes only those parts of a file: sessions, runs, landings
//   --abort-load / --abort-free-gib   stop at once (exit 3) when load5 stays above N for two samples a minute
//                  apart, or free disk under the home directory drops below M GiB
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import readline from 'node:readline'
import zlib from 'node:zlib'
import { StringDecoder } from 'node:string_decoder'
import { execFileSync } from 'node:child_process'

const argv = process.argv.slice(2)
const multi = (k) => argv.flatMap((a, i) => (a === k && argv[i + 1] ? [argv[i + 1]] : []))
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const has = (k) => argv.includes(k)
const HOME = os.homedir()
const SECTIONS = ['sessions', 'runs', 'landings']

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
const emptyResult = () => ({ hosts: [], since: '', until: '', idleMin: 0, cohorts: { orchestrators: { count: 0, intervals: [] }, workers: { count: 0, intervals: [] }, runs: { count: 0, intervals: [] } }, byRuntime: {}, landings: { commits: [], repos: [] }, notes: [] })

function printTable(r) {
  console.log(`agent-hours · ${r.hosts.join(', ')} · ${r.since.slice(0, 10)} … ${r.until.slice(0, 10)} · idle gap ${r.idleMin} min`)
  console.log(`${'cohort'.padEnd(34)} ${'count'.padStart(7)} ${'sum h'.padStart(9)} ${'wall h'.padStart(9)}`)
  const row = (label, c) => console.log(`${label.padEnd(34)} ${String(c.count).padStart(7)} ${fmt(sumHours(c.intervals))} ${fmt(unionHours(c.intervals))}`)
  for (const [name, label] of [['orchestrators', 'orchestrators (interactive)'], ['workers', 'workers (headless, subagents)'], ['runs', '  of them task-board runs']]) row(label, r.cohorts[name])
  for (const [k, c] of Object.entries(r.byRuntime || {}).sort()) row(`  ${k.replace(':', ' · ')}`, c)
  console.log(`${'landings on main (git)'.padEnd(34)} ${String(r.landings.commits.length).padStart(7)}  commits in ${r.landings.repos.length} repositories`)
  if (r.notes.length) console.log('notes: ' + r.notes.join('; '))
}

// ---- merge mode -------------------------------------------------------------------------------------
if (argv[0] === '--merge') {
  const out = emptyResult()
  const seen = new Set(), seenRepos = new Set()
  for (const spec of argv.slice(1)) {
    const [f, part] = spec.split(/:(?=[a-z,]+$)/)
    const take = part ? part.split(',') : SECTIONS
    if (take.some((s) => !SECTIONS.includes(s))) { console.error(`${spec}: sections are ${SECTIONS.join(', ')}`); process.exit(2) }
    const j = JSON.parse(fs.readFileSync(f, 'utf8'))
    for (const r of Array.isArray(j) ? j : [j]) {
      for (const h of r.hosts) if (!out.hosts.includes(h)) out.hosts.push(h)
      out.since = !out.since || r.since < out.since ? r.since : out.since
      out.until = !out.until || r.until > out.until ? r.until : out.until
      out.idleMin = r.idleMin
      const add = (k) => { out.cohorts[k].count += r.cohorts[k].count; out.cohorts[k].intervals.push(...r.cohorts[k].intervals) }
      if (take.includes('sessions')) {
        add('orchestrators'); add('workers')
        for (const [k, c] of Object.entries(r.byRuntime || {})) {
          const o = (out.byRuntime[k] ||= { count: 0, intervals: [] })
          o.count += c.count; o.intervals.push(...c.intervals)
        }
      }
      if (take.includes('runs')) add('runs')
      if (take.includes('landings')) { for (const h of r.landings.commits) seen.add(h); for (const u of r.landings.repos) seenRepos.add(u) }
      out.notes.push(...r.notes.map((n) => `${r.hosts[0]}${part ? ` (${part})` : ''}: ${n}`))
    }
  }
  out.landings.commits = [...seen]
  out.landings.repos = [...seenRepos]
  printTable(out)
  process.exit(0)
}

// ---- window and options -----------------------------------------------------------------------------
const until = one('--until') ? new Date(one('--until') + 'T23:59:59Z').getTime() : Date.now()
const since = one('--since') ? new Date(one('--since') + 'T00:00:00Z').getTime() : until - Number(one('--days', '14')) * 86400e3
const idleMs = Number(one('--idle-min', '15')) * 60e3
const clip = (iv) => iv.flatMap(([a, b]) => { const lo = Math.max(a, since), hi = Math.min(b, until); return hi > lo ? [[lo, hi]] : [] })

// ---- report mode: the table from a database ---------------------------------------------------------
if (argv[0] === '--report') {
  const { DatabaseSync } = await import('node:sqlite')
  const db = new DatabaseSync(argv[1], { readOnly: true })
  const hosts = multi('--host')
  const repoRe = one('--repo-filter') ? new RegExp(one('--repo-filter')) : null
  const hostSql = hosts.length ? ` AND host IN (${hosts.map(() => '?').join(',')})` : ''
  const r = emptyResult()
  r.hosts = hosts.length ? hosts : db.prepare('SELECT DISTINCT host FROM sessions UNION SELECT DISTINCT host FROM runs ORDER BY 1').all().map((x) => x.host)
  r.since = new Date(since).toISOString(); r.until = new Date(until).toISOString(); r.idleMin = idleMs / 60e3
  const ivs = db.prepare('SELECT start_ms, end_ms FROM intervals WHERE session_id = ?')
  for (const s of db.prepare(`SELECT id, runtime, cohort FROM sessions WHERE last_ms >= ? AND first_ms <= ?${hostSql}`).all(since, until, ...hosts)) {
    const iv = clip(ivs.all(s.id).map((x) => [x.start_ms, x.end_ms]))
    if (!iv.length) continue
    r.cohorts[s.cohort].count++; r.cohorts[s.cohort].intervals.push(...iv)
    const o = (r.byRuntime[`${s.cohort}:${s.runtime}`] ||= { count: 0, intervals: [] })
    o.count++; o.intervals.push(...iv)
  }
  for (const x of db.prepare(`SELECT started_ms, ended_ms FROM runs WHERE ended_ms >= ? AND started_ms <= ?${hostSql}`).all(since, until, ...hosts)) {
    const iv = clip([[x.started_ms, x.ended_ms]])
    if (iv.length) { r.cohorts.runs.count++; r.cohorts.runs.intervals.push(...iv) }
  }
  const repos = new Set()
  for (const c of db.prepare(`SELECT hash, repo FROM commits WHERE committed_ms >= ? AND committed_ms <= ?${hostSql}`).all(since, until, ...hosts)) {
    if (repoRe && !repoRe.test(c.repo || '')) continue
    r.landings.commits.push(c.hash); repos.add(c.repo)
  }
  r.landings.repos = [...repos]
  if (repoRe) r.notes.push(`commits of remotes matching ${repoRe.source} only`)
  printTable(r)
  if (one('--json')) { fs.writeFileSync(one('--json'), JSON.stringify(r)); console.log(`wrote ${one('--json')} (timestamps and commit hashes only)`) }
  process.exit(0)
}

// ---- collect mode -----------------------------------------------------------------------------------
const orchRe = one('--orch-cwd') ? new RegExp(one('--orch-cwd')) : null
const workerRe = one('--worker-cwd') ? new RegExp(one('--worker-cwd')) : null
const host = one('--host', os.hostname().split('.')[0])
const archiveHost = one('--archive-host')
const archives = multi('--archive')
const local = !has('--no-local')
if (archives.length && !archiveHost) { console.error('--archive needs --archive-host <the machine the export came from>'); process.exit(2) }

// Self-abort for long runs on a shared host: two samples of load5 over the line, a minute apart, or low disk.
const abortLoad = Number(one('--abort-load', '0')), abortFreeGiB = Number(one('--abort-free-gib', '0'))
if (abortLoad || abortFreeGiB) {
  let over = 0
  setInterval(() => {
    const l5 = os.loadavg()[1]
    over = abortLoad && l5 > abortLoad ? over + 1 : 0
    let free = Infinity
    try { const st = fs.statfsSync(HOME); free = (st.bavail * st.bsize) / 2 ** 30 } catch {}
    if (over >= 2 || (abortFreeGiB && free < abortFreeGiB)) {
      console.error(`ABORT ${new Date().toISOString()}: load5 ${l5.toFixed(1)} (line ${abortLoad || '-'}), free disk ${free.toFixed(1)} GiB (line ${abortFreeGiB || '-'})`)
      process.exit(3)
    }
  }, 60e3).unref()
}

const curatorEnvs = (() => { try { return fs.readdirSync(path.join(HOME, '.curator/environments')).map((e) => path.join(HOME, '.curator/environments', e)) } catch { return [] } })()
const tbSessiond = (() => {
  const root = path.join(HOME, 'Library/Application Support/task-board/session-manager')
  const out = []
  for (const h of (() => { try { return fs.readdirSync(root) } catch { return [] } })()) {
    let ses; try { ses = fs.readdirSync(path.join(root, h, 'sessions')) } catch { continue }
    for (const s of ses) { const p = path.join(root, h, 'sessions', s, 'codex-home/sessions'); if (fs.existsSync(p)) out.push(p) }
  }
  return out
})()
const roots = {
  claude: multi('--claude-root').length ? multi('--claude-root') : [path.join(HOME, '.claude/projects'), ...curatorEnvs.map((e) => path.join(e, 'claude_code/projects'))],
  codex: multi('--codex-root').length ? multi('--codex-root') : [path.join(HOME, '.codex/sessions'), ...curatorEnvs.map((e) => path.join(e, 'codex_cli/sessions')), ...tbSessiond],
  muse: multi('--muse-root').length ? multi('--muse-root') : [path.join(HOME, '.local/share/muse/sessions')],
}
const repoRoots = multi('--repos-root').length ? multi('--repos-root') : [path.join(HOME, 'Developer'), path.join(HOME, 'src')]
const isSession = {
  claude: (p) => p.endsWith('.jsonl'),
  codex: (p) => /rollout-[^/]*\.jsonl$/.test(p),
  muse: (p) => p.endsWith('/session.jsonl') && !p.includes('/.msp-view'),
}
const depth = { claude: 3, codex: 4, muse: 6 }

// files under root, at most `d` levels down, modified inside the window
function walk(root, d, pred) {
  const out = []
  const go = (dir, k) => {
    let ents; try { ents = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const e of ents) {
      const p = path.join(dir, e.name)
      if (e.isDirectory()) { if (k > 0 && e.name !== 'node_modules' && !e.name.startsWith('.msp-view')) go(p, k - 1) } else if (pred(p)) {
        try { if (fs.statSync(p).mtimeMs >= since) out.push(p) } catch {}
      }
    }
  }
  go(root, d)
  return out
}

function intervalsOf(times) {
  const ts = times.sort((a, b) => a - b)
  const out = []
  let a = null, b = null
  for (const t of ts) {
    if (a === null) { a = b = t; continue }
    if (t - b <= idleMs) b = t; else { if (b > a) out.push([a, b]); a = b = t }
  }
  if (a !== null && b > a) out.push([a, b])
  return out
}

// One session file, fed line by line. Codex lines start with their timestamp and Muse lines carry
// recorded_at near the front, so only the metadata lines of those two are parsed as JSON.
function sessionParser(runtime) {
  const s = { times: [], entry: null, cwd: null, source: null, sidechain: false, terminal: false }
  const museRecord = (r) => {
    const t = Number(r.recorded_at)
    if (t) s.times.push(t > 1e14 ? Math.floor(t / 1000) : t)
    if (r.payload_type === 'runtime.session.route_facts') {
      const f = r.payload?.record || {}
      if (f.tmux_pane || f.terminal_title_identity) s.terminal = true
      if (typeof f.cwd === 'string') s.cwd = f.cwd
    } else if (r.payload_type === 'runtime.session.metadata' && !s.cwd && typeof r.payload?.record?.workspace_root === 'string') s.cwd = r.payload.record.workspace_root
  }
  const line = {
    claude(l) {
      let d; try { d = JSON.parse(l) } catch { return }
      if (s.entry === null && typeof d.entrypoint === 'string') s.entry = d.entrypoint
      if (s.cwd === null && typeof d.cwd === 'string') s.cwd = d.cwd
      if (d.isSidechain === true) s.sidechain = true
      const t = Date.parse(d.timestamp)
      if (!Number.isNaN(t)) s.times.push(t)
    },
    codex(l) {
      let t = l.startsWith('{"timestamp":"') ? Date.parse(l.slice(14, l.indexOf('"', 14))) : NaN
      if (Number.isNaN(t) || l.slice(0, 120).includes('"type":"session_meta"')) {
        let d; try { d = JSON.parse(l) } catch { return }
        if (Number.isNaN(t)) t = Date.parse(d.timestamp)
        if (d.type === 'session_meta' && d.payload) { s.source = d.payload.source; if (typeof d.payload.cwd === 'string') s.cwd = d.payload.cwd }
      }
      if (!Number.isNaN(t)) s.times.push(t)
    },
    muse(l) {
      const head = l.slice(0, 600)
      if (head.includes('"children"') || head.includes('"payload_type":"runtime.session.route_facts"') || (!s.cwd && head.includes('"payload_type":"runtime.session.metadata"'))) {
        let d; try { d = JSON.parse(l) } catch { return }
        if (Array.isArray(d.children)) for (const c of d.children) { try { museRecord(JSON.parse(c.record_json)) } catch {} }
        else museRecord(d)
        return
      }
      const m = /"recorded_at":(\d{12,17})/.exec(head)
      if (m) { const t = Number(m[1]); s.times.push(t > 1e14 ? Math.floor(t / 1000) : t) }
    },
  }[runtime]
  return { line, s }
}

function cohortOf(s, file, runtime) {
  if (s.cwd && orchRe && orchRe.test(s.cwd)) return 'orchestrators'
  if (s.cwd && workerRe && workerRe.test(s.cwd)) return 'workers'
  if (runtime === 'claude') return file.includes('/subagents/') || s.sidechain || /^sdk/.test(s.entry || '') ? 'workers' : 'orchestrators'
  if (runtime === 'muse') return file.includes('/subagent/') || !s.terminal ? 'workers' : 'orchestrators'
  return s.source === 'exec' || (s.source && typeof s.source === 'object') ? 'workers' : 'orchestrators'
}
const kindOf = (s, runtime) => runtime === 'claude' ? s.entry : runtime === 'codex' ? (typeof s.source === 'object' && s.source ? 'subagent' : s.source) : (s.terminal ? 'terminal' : 'headless')

// ---- results and the database -----------------------------------------------------------------------
const results = new Map() // host -> result
const resultOf = (h) => {
  if (!results.has(h)) { const r = emptyResult(); r.hosts = [h]; r.since = new Date(since).toISOString(); r.until = new Date(until).toISOString(); r.idleMin = idleMs / 60e3; results.set(h, r) }
  return results.get(h)
}
let db = null, put = null
if (one('--db')) {
  process.umask(0o077)
  fs.mkdirSync(path.dirname(path.resolve(one('--db'))), { recursive: true, mode: 0o700 })
  const { DatabaseSync } = await import('node:sqlite')
  db = new DatabaseSync(one('--db'))
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, host TEXT NOT NULL, runtime TEXT NOT NULL, cohort TEXT NOT NULL,
      kind TEXT, project TEXT, file TEXT NOT NULL, first_ms INTEGER, last_ms INTEGER, busy_ms INTEGER, events INTEGER, UNIQUE (host, runtime, file));
    CREATE TABLE IF NOT EXISTS intervals (session_id INTEGER NOT NULL, start_ms INTEGER NOT NULL, end_ms INTEGER NOT NULL);
    CREATE INDEX IF NOT EXISTS intervals_session ON intervals (session_id);
    CREATE TABLE IF NOT EXISTS runs (host TEXT NOT NULL, run_id TEXT NOT NULL, repo TEXT, task_id TEXT, role TEXT, model TEXT, effort TEXT,
      runtime TEXT, started_ms INTEGER, ended_ms INTEGER, status TEXT, caller TEXT, PRIMARY KEY (host, run_id));
    CREATE TABLE IF NOT EXISTS commits (hash TEXT PRIMARY KEY, repo TEXT, host TEXT, committed_ms INTEGER);
    CREATE TABLE IF NOT EXISTS loads (host TEXT, source TEXT, since_ms INTEGER, until_ms INTEGER, loaded_at TEXT, notes TEXT);`)
  const delIv = db.prepare('DELETE FROM intervals WHERE session_id = (SELECT id FROM sessions WHERE host = ? AND runtime = ? AND file = ?)')
  const upS = db.prepare(`INSERT INTO sessions (host, runtime, cohort, kind, project, file, first_ms, last_ms, busy_ms, events) VALUES (?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT (host, runtime, file) DO UPDATE SET cohort = excluded.cohort, kind = excluded.kind, project = excluded.project,
    first_ms = excluded.first_ms, last_ms = excluded.last_ms, busy_ms = excluded.busy_ms, events = excluded.events RETURNING id`)
  const insIv = db.prepare('INSERT INTO intervals (session_id, start_ms, end_ms) VALUES (?,?,?)')
  let pending = 0
  db.exec('BEGIN')
  put = (h, runtime, file, s, cohort, iv) => {
    delIv.run(h, runtime, file)
    const { id } = upS.get(h, runtime, cohort, kindOf(s, runtime) ?? null, s.cwd ? path.basename(s.cwd) : null, file, iv[0][0], iv[iv.length - 1][1], iv.reduce((x, [a, b]) => x + b - a, 0), s.times.length)
    for (const [a, b] of iv) insIv.run(id, a, b)
    if (++pending >= 500) { db.exec('COMMIT'); db.exec('BEGIN'); pending = 0 }
  }
}

function addSession(h, runtime, file, s) {
  const all = intervalsOf(s.times.filter((t) => t >= since - 86400e3 && t <= until))
  const iv = clip(all)
  if (!iv.length) return
  const c = cohortOf(s, file, runtime)
  const r = resultOf(h)
  r.cohorts[c].count++; r.cohorts[c].intervals.push(...iv)
  const o = (r.byRuntime[`${c}:${runtime}`] ||= { count: 0, intervals: [] })
  o.count++; o.intervals.push(...iv)
  put?.(h, runtime, file, s, c, iv)
}

let progressAt = Date.now()
const progress = (msg) => { if (Date.now() - progressAt > 30e3) { progressAt = Date.now(); console.error(`[${new Date().toISOString().slice(11, 19)}] ${msg}`) } }

// ---- this machine's sessions --------------------------------------------------------------------------
if (local) {
  for (const runtime of ['claude', 'codex', 'muse']) {
    let n = 0
    for (const root of roots[runtime]) {
      if (!fs.existsSync(root)) continue
      for (const f of walk(root, depth[runtime], isSession[runtime])) {
        const { line, s } = sessionParser(runtime)
        const rl = readline.createInterface({ input: fs.createReadStream(f, { encoding: 'utf8' }), crlfDelay: Infinity })
        for await (const l of rl) if (l) line(l)
        addSession(host, runtime, f, s)
        progress(`${host} ${runtime}: ${++n} files`)
      }
    }
  }
  if (tbSessiond.length) resultOf(host).notes.push(`${tbSessiond.length} tb-sessiond Codex homes`)
}

// ---- exported sessions: tar.zst streamed, never extracted ---------------------------------------------
function runtimeOfEntry(p) {
  if (p.includes('/._') || p.startsWith('._')) return null
  if (p.includes('/claude-code-projects/') && p.endsWith('.jsonl')) return 'claude'
  if (/(^|\/)codex\//.test(p) && isSession.codex(p)) return 'codex'
  if (isSession.muse('/' + p)) return 'muse'
  return null
}
async function readArchive(file, onFile) {
  const z = fs.createReadStream(file).pipe(zlib.createZstdDecompress())
  let buf = Buffer.alloc(0), state = 'header', remain = 0, padding = 0, sink = null, pax = null, longName = null, meta = null, bytes = 0
  const str = (b, a, n) => { const s = b.subarray(a, a + n); const z0 = s.indexOf(0); return s.subarray(0, z0 < 0 ? n : z0).toString('utf8') }
  const num = (b, a, n) => (b[a] & 0x80) ? Number(b.readBigUInt64BE(a + n - 8)) : parseInt(str(b, a, n).trim() || '0', 8)
  for await (const chunk of z) {
    bytes += chunk.length
    buf = buf.length ? Buffer.concat([buf, chunk]) : chunk
    let off = 0
    for (;;) {
      if (state === 'header') {
        if (buf.length - off < 512) break
        const h = buf.subarray(off, off + 512); off += 512
        if (h[0] === 0 && h.every((x) => x === 0)) continue
        const type = String.fromCharCode(h[156] || 48)
        let name = str(h, 0, 100)
        const prefix = h.subarray(257, 263).toString('latin1') === 'ustar\0' ? str(h, 345, 155) : ''
        if (prefix) name = `${prefix}/${name}`
        const size = num(h, 124, 12), mtime = num(h, 136, 12) * 1000
        meta = { type, name: longName || pax?.path || name, size: pax?.size ? Number(pax.size) : size, mtime: pax?.mtime ? Number(pax.mtime) * 1000 : mtime }
        longName = null
        if (type !== 'x' && type !== 'g' && type !== 'L') pax = null
        remain = meta.size; padding = (512 - (remain % 512)) % 512
        sink = null
        if (type === 'x' || type === 'g' || type === 'L') sink = { parts: [], write(b) { this.parts.push(Buffer.from(b)) }, end() {} }
        else if ((type === '0' || type === '\0' || type === '7') && meta.mtime >= since) sink = onFile(meta.name)
        state = remain ? 'body' : 'pad'
      } else if (state === 'body') {
        const n = Math.min(remain, buf.length - off)
        if (n > 0) { sink?.write(buf.subarray(off, off + n)); off += n; remain -= n }
        if (remain > 0) break
        if (meta.type === 'x' || meta.type === 'g') {
          if (meta.type === 'x') {
            pax = {}
            const b = Buffer.concat(sink.parts) // records "LEN key=value\n", LEN in bytes
            for (let i = 0; i < b.length;) {
              const sp = b.indexOf(0x20, i), len = parseInt(b.subarray(i, sp).toString('latin1'), 10)
              if (!(len > 0)) break
              const rec = b.subarray(sp + 1, i + len - 1), eq = rec.indexOf(0x3d)
              pax[rec.subarray(0, eq).toString('utf8')] = rec.subarray(eq + 1).toString('utf8')
              i += len
            }
          }
        } else if (meta.type === 'L') longName = Buffer.concat(sink.parts).toString('utf8').replace(/\0+$/, '')
        else sink?.end()
        state = 'pad'
      } else {
        const n = Math.min(padding, buf.length - off)
        off += n; padding -= n
        if (padding > 0) break
        state = 'header'
      }
    }
    buf = off < buf.length ? Buffer.from(buf.subarray(off)) : Buffer.alloc(0)
    progress(`${path.basename(file)}: ${(bytes / 2 ** 30).toFixed(1)} GiB read`)
  }
  return bytes
}
for (const file of archives) {
  const t0 = Date.now()
  let n = 0
  const bytes = await readArchive(file, (name) => {
    const runtime = runtimeOfEntry(name)
    if (!runtime) return null
    const { line, s } = sessionParser(runtime)
    const dec = new StringDecoder('utf8')
    let parts = [] // the unfinished line, in pieces: a long line is joined once
    return {
      write(b) {
        const t = dec.write(b)
        let i = 0, j
        while ((j = t.indexOf('\n', i)) >= 0) {
          const l = parts.length ? parts.join('') + t.slice(i, j) : t.slice(i, j)
          parts = []
          if (l) line(l)
          i = j + 1
        }
        if (i < t.length) parts.push(t.slice(i))
      },
      end() { const tail = parts.join('') + dec.end(); if (tail) line(tail); addSession(archiveHost, runtime, `${path.basename(file)}:${name}`, s); n++ },
    }
  })
  resultOf(archiveHost).notes.push(`${path.basename(file)}: ${n} sessions, ${(bytes / 2 ** 30).toFixed(1)} GiB streamed in ${Math.round((Date.now() - t0) / 1000)} s, not extracted`)
}

// ---- this machine's repositories: run ledgers and landings ---------------------------------------------
if (local) {
  const r = resultOf(host)
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
  const insRun = db?.prepare(`INSERT OR REPLACE INTO runs (host, run_id, repo, task_id, role, model, effort, runtime, started_ms, ended_ms, status, caller) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
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
      const iv = clip([[a, b]])
      if (!iv.length) continue
      runIds.add(id)
      r.cohorts.runs.count++
      r.cohorts.runs.intervals.push(...iv)
      if (insRun) {
        let m = {}; try { m = JSON.parse(fs.readFileSync(path.join(runsDir, name, 'manifest.json'), 'utf8')) } catch {}
        insRun.run(host, id, path.basename(dir), st.task_id ?? null, m.role_archetype || m.role || null, m.model ?? null, m.reasoning_effort ?? null, m.runtime_provenance?.runtime || st.agent_type || null, a, b, st.status ?? null, st.caller_session_id ?? null)
      }
    }
  }

  // landings: first-parent commits on the default branch, deduplicated by hash; repositories by remote URL
  const commits = new Set()
  const landedRepos = new Set()
  const insCommit = db?.prepare('INSERT OR IGNORE INTO commits (hash, repo, host, committed_ms) VALUES (?,?,?,?)')
  const sinceIso = new Date(since).toISOString(), untilIso = new Date(until).toISOString()
  for (const dir of gitDirs) {
    const git = (...a) => execFileSync('git', ['-C', dir, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 20000 }).trim()
    let ref = null
    for (const x of ['origin/main', 'origin/master', 'main', 'master']) { try { git('rev-parse', '--verify', '--quiet', x); ref = x; break } catch {} }
    if (!ref) continue
    let out = ''
    try { out = git('log', '--first-parent', `--since=${sinceIso}`, `--until=${untilIso}`, '--format=%H %ct', ref) } catch { continue }
    const rows = out ? out.split('\n').map((x) => x.split(' ')) : []
    if (!rows.length) continue
    let remote = dir
    try { remote = git('config', '--get', 'remote.origin.url') || dir } catch {}
    remote = remote.replace(/\.git$/, '')
    landedRepos.add(remote)
    for (const [h, ct] of rows) { commits.add(h); insCommit?.run(h, remote, host, Number(ct) * 1000) }
  }
  r.landings = { commits: [...commits], repos: [...landedRepos] }
  r.notes.push(`${gitDirs.length} local repositories scanned, local refs only (no fetch)`)
}

if (db) {
  db.exec('COMMIT')
  const ins = db.prepare('INSERT INTO loads (host, source, since_ms, until_ms, loaded_at, notes) VALUES (?,?,?,?,?,?)')
  for (const [h, r] of results) ins.run(h, h === archiveHost ? archives.map((a) => path.basename(a)).join(',') : 'local', since, until, new Date().toISOString(), r.notes.join('; '))
  db.close()
}
for (const r of results.values()) printTable(r)
const out = one('--json')
if (out) {
  const all = [...results.values()]
  fs.writeFileSync(out, JSON.stringify(all.length === 1 ? all[0] : all))
  console.log(`wrote ${out} (timestamps and commit hashes only)`)
}
if (db) console.log(`database ${one('--db')}: ${(fs.statSync(one('--db')).size / 2 ** 20).toFixed(1)} MiB`)
