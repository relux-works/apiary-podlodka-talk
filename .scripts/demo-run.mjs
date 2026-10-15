#!/usr/bin/env node
// Data for demo 1 «Разработка по логам» (slides/components/DemoRun.vue): one epic of a task board, replayed.
// Reads the board's activity streams (.task-board/.activity/*/events.ndjson), its run ledgers
// (.temp/spawn-runs/RUN-*/manifest.json and state.json) and the orchestrator's session transcript, and writes
// one JSON with anonymous task ids, status changes, runs (role, model, start, end, outcome), the times the human
// wrote to the orchestrator and the times the orchestrator woke up on its own. No names, no message text.
//
//   node .scripts/demo-run.mjs --repo <repository with the board> --epic <EPIC-…[,EPIC-…]> --session <orchestrator .jsonl>
//        [--gap-min 40] [--skip-human <ISO timestamp>,…] [--out slides/demo/run.json]
//
// --skip-human drops the person's entries at those exact transcript timestamps: messages about something else than
// the epic (in tetris, 11.09: the board's own goal and worktree bugs, fixed in the task-board skill meanwhile).
//
// The orchestrator transcript is a Claude Code session: a user entry with typed text is the human, a
// <task-notification> entry is the orchestrator waking on its own (a run finished, a message arrived).
// Quiet stretches longer than --gap-min (no run, no status change) are squeezed on the replay clock.
import fs from 'node:fs'
import path from 'node:path'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const repo = one('--repo'), epic = one('--epic'), sessionFile = one('--session')
const epics = new Set(String(epic || '').split(',').filter(Boolean)) // several epics of one orchestrator replay together
const out = one('--out', 'slides/demo/run.json')
const gapMs = Number(one('--gap-min', '40')) * 60e3
if (!repo || !epic || !sessionFile) { console.error('usage: --repo DIR --epic EPIC-… --session FILE.jsonl [--out FILE]'); process.exit(2) }
const ms = (s) => Date.parse(s)

// ---- the board: elements, parents, status changes ---------------------------------------------------
const el = new Map(), parent = new Map(), statuses = new Map()
const actDir = path.join(repo, '.task-board/.activity')
for (const id of fs.readdirSync(actDir)) {
  const f = path.join(actDir, id, 'events.ndjson')
  if (!fs.existsSync(f)) continue
  for (const l of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!l) continue
    let e; try { e = JSON.parse(l) } catch { continue }
    for (const c of e.changes || []) {
      const a = c.after || {}, b = c.before || {}
      if (e.operation === 'create' && a.kind === 'element') { el.set(a.element.id, a.element); parent.set(a.element.id, a.element.parent_id) }
      else if (e.operation === 'move' && c.field === 'parent_id') parent.set(id, a.element_id)
      // a status moves by hand (progress) and on landing (aggregation: worktree.integrate takes integrating to done)
      else if ((e.operation === 'progress' || e.operation === 'aggregation') && c.field === 'status' && a.status) {
        if (!statuses.has(id)) statuses.set(id, [])
        statuses.get(id).push([ms(e.timestamp), b.status || null, a.status])
      }
    }
  }
}
const epicOf = (i) => { for (let n = 0; i && n < 20; n++, i = parent.get(i)) if (el.get(i)?.type === 'epic') return i; return null }

// ---- runs of the epic ---------------------------------------------------------------------------------
const runsDir = path.join(repo, '.temp/spawn-runs')
const runs = []
for (const name of fs.readdirSync(runsDir)) {
  if (!name.startsWith('RUN-')) continue
  let m, st
  try { m = JSON.parse(fs.readFileSync(path.join(runsDir, name, 'manifest.json'), 'utf8')); st = JSON.parse(fs.readFileSync(path.join(runsDir, name, 'state.json'), 'utf8')) } catch { continue }
  if (!epics.has(epicOf(st.task_id))) continue
  const a = ms(st.started_at), b = ms(st.completed_at || st.last_heartbeat_at || '')
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) continue
  runs.push({ task: st.task_id, role: m.role_archetype || m.role, model: m.model, start: a, end: b, outcome: st.status, caller: st.caller_session_id })
}
if (!runs.length) { console.error(`no runs of ${epic} in ${repo}`); process.exit(1) }
runs.sort((p, q) => p.start - q.start)
const t0 = runs[0].start, t1 = Math.max(...runs.map((r) => r.end))

// tasks: every element of the epic that had a run, in order of their first run
const firstRun = new Map()
for (const r of runs) if (!firstRun.has(r.task)) firstRun.set(r.task, r.start)
const order = [...firstRun.keys()]
const anon = new Map(order.map((id, i) => [id, `t${String(i + 1).padStart(2, '0')}`]))
const tasks = order.map((id) => {
  const ch = (statuses.get(id) || []).filter(([t]) => t >= t0 - 3600e3 && t <= t1).sort((p, q) => p[0] - q[0])
  const before = (statuses.get(id) || []).filter(([t]) => t < t0 - 3600e3).pop()
  // a return: review sent the task back to development
  const back = ([, from, to]) => (from === 'to-review' && to === 'development') || (from === 'reviewing' && to === 'to-dev')
  return { id: anon.get(id), type: el.get(id)?.type || 'task', start: before ? before[2] : (ch[0]?.[1] || 'backlog'), changes: ch.map((x) => (back(x) ? [x[0], x[2], 1] : [x[0], x[2]])) }
})

// ---- the orchestrator's session: the human writes, the orchestrator wakes ------------------------------
const skipHuman = new Set(String(one('--skip-human', '')).split(',').filter(Boolean).map(ms))
const human = [], wakes = []
for (const l of fs.readFileSync(sessionFile, 'utf8').split('\n')) {
  if (!l) continue
  let d; try { d = JSON.parse(l) } catch { continue }
  if (d.type !== 'user' || d.isMeta || d.isCompactSummary) continue
  const t = ms(d.timestamp)
  if (Number.isNaN(t) || t < t0 - 3600e3 || t > t1) continue
  const c = d.message?.content
  if (Array.isArray(c) && c.some((x) => x?.type === 'tool_result')) continue
  const text = (Array.isArray(c) ? c.filter((x) => x?.type === 'text').map((x) => x.text).join(' ') : String(c || '')).trimStart()
  // older boards (09.2026) wake the orchestrator with a plain «task-board run RUN-…» notice instead of <task-notification>
  if (text.startsWith('<task-notification') || text.startsWith('task-board run RUN-') || text.slice(0, 200).includes('[SYSTEM NOTIFICATION')) wakes.push(t)
  else if (skipHuman.has(t)) continue
  else if (!text.startsWith('<command-') && !text.startsWith('<local-command') && !text.startsWith('Caveat:') && !text.startsWith('<system-reminder')) human.push(t)
}

// ---- the replay clock: busy stretches at one speed, quiet stretches squeezed ------------------------------
const marks = [...runs.flatMap((r) => [r.start, r.end]), ...tasks.flatMap((t) => t.changes.map(([x]) => x)), ...human].filter((x) => x >= t0 && x <= t1).sort((a, b) => a - b)
const quiet = []
let busyUntil = t0
for (const r of runs) {
  if (r.start - busyUntil > gapMs) {
    const inside = marks.filter((x) => x > busyUntil && x < r.start)
    let a = busyUntil
    for (const x of [...inside, r.start]) { if (x - a > gapMs) quiet.push([a, x]); a = x }
  }
  busyUntil = Math.max(busyUntil, r.end)
}

const data = {
  about: 'Demo 1 «Разработка по логам»: one epic of the task board, replayed from its logs. Built by .scripts/demo-run.mjs; anonymous ids, no names, no message text.',
  window: [t0, t1],
  quiet,
  tasks,
  runs: runs.map((r) => ({ task: anon.get(r.task), role: r.role, model: r.model, start: r.start, end: r.end, outcome: r.outcome })),
  human,
  wakes,
  counts: {
    tasks: tasks.length,
    runs: runs.length,
    returns: tasks.reduce((n, t) => n + t.changes.filter((c) => c[2]).length, 0),
    failed: runs.filter((r) => r.outcome === 'failed').length,
    cancelled: runs.filter((r) => r.outcome === 'cancelled').length,
    done: tasks.filter((t) => t.changes.some(([, s]) => s === 'done')).length,
    models: [...new Set(runs.map((r) => r.model))].length,
    human: human.length,
    wakes: wakes.length,
    callers: [...new Set(runs.map((r) => r.caller))].length,
  },
}
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, JSON.stringify(data))
const h = (x) => (x / 3600e3).toFixed(1)
console.log(`${out}: ${data.counts.tasks} tasks, ${data.counts.runs} runs over ${h(t1 - t0)} h, ${quiet.length} quiet stretches (${h(quiet.reduce((s, [a, b]) => s + b - a, 0))} h squeezed)`)
console.log(JSON.stringify(data.counts))
