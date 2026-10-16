#!/usr/bin/env node
// A synthetic ending for a demo 1 dataset whose epic stopped half way (Alexey, 16.10: no pile in review that bursts into
// integration and done at the end; «+- равномерно уходило в интеграцию и в дан»). Every task that is not done when the
// log ends gets reviewing → integrating → done, and the done moments are spread evenly over the run's busy time (quiet
// stretches left out, as the replay squeezes them). A task never finishes before the log shows it ready: a blocked task
// first goes back to development and to review. The log's own events are untouched, and the file says what was added.
//
// With --opening N (minutes), the run starts N minutes earlier with one task on the board: the spec's decomposition, in
// analysis with one analyst run; when it is done it leaves the board, and the epic's tasks appear in the queue (Alexey,
// 16.10: «должна быть задача в работе одна — по декомпозиции спеки, и потом уже весь поток задач»). Tasks that the log
// shows past the queue at its start (carried over from before the window) start in the queue.
//
// With --human-like OTHER.json, the person's messages follow that run's pattern instead (Alexey, 16.10: talk to the
// model at the start, then almost nothing, «как в тетрисе»): the messages in its first 5 % of busy time go into the
// opening, keeping their spacing in proportion; the rest land at the same fraction of this run's busy time.
//
//   node .scripts/demo-smooth.mjs --in slides/demo/demo-1/infra-exit.json --out slides/demo/demo-1/infra-exit-smoothed.json [--opening 180] [--review-hours 1.5] [--human-like slides/demo/demo-1/tetris.json]
import fs from 'node:fs'

const argv = process.argv.slice(2)
const one = (k, d) => { const i = argv.indexOf(k); return i >= 0 && argv[i + 1] ? argv[i + 1] : d }
const inp = one('--in'), out = one('--out')
if (!inp || !out) { console.error('usage: node .scripts/demo-smooth.mjs --in FILE --out FILE'); process.exit(2) }
const data = JSON.parse(fs.readFileSync(inp, 'utf8'))
const [T0, T1] = data.window
const quiet = data.quiet

// busy time: real time with the quiet stretches taken out, and back
const toBusy = (t) => t - T0 - quiet.reduce((s, [a, b]) => s + Math.max(0, Math.min(t, b) - a), 0)
const fromBusy = (x) => {
  let t = T0 + x
  for (const [a, b] of quiet) if (t > a) t += b - a
  return Math.min(t, T1)
}
const MIN = 60e3
const last = (t) => (t.changes.length ? t.changes[t.changes.length - 1] : [T0, t.start])

// late analysis: an analysis task that starts in the second half of the run's busy time moves, with its runs, right
// after the last earlier analyst run (Alexey, 16.10: no analyst at work in the tail, when the work is over)
const moved = []
{
  const half = fromBusy(toBusy(T1) / 2)
  const inQuiet = (t) => quiet.find(([a, b]) => t > a && t < b)
  const firstOf = (t) => t.changes.find((c) => c[1] === 'analysis')?.[0]
  const late = data.tasks.filter((t) => firstOf(t) > half).sort((a, b) => firstOf(a) - firstOf(b))
  let after = Math.max(...data.runs.filter((r) => r.role === 'analyst' && r.start < half).map((r) => r.end))
  for (const t of late) {
    let to = after + 10 * MIN
    const q = inQuiet(to); if (q) to = q[1] + 5 * MIN
    const d = to - firstOf(t)
    for (const c of t.changes) c[0] += d
    for (const r of data.runs) if (r.task === t.id) { r.start += d; r.end += d; after = Math.max(after, r.end) }
    moved.push(t.id)
  }
}

// what each open task still needs, and the moment it is ready for review
const open = []
for (const t of data.tasks) {
  const [at, s] = last(t)
  if (s === 'done' || s === 'closed') continue
  const pre = [] // [ms after `at`, status]
  if (s === 'blocked' || s === 'backlog' || s === 'to-dev' || s === 'analysis' || s === 'development') pre.push([40 * MIN, 'development'], [160 * MIN, 'to-review'])
  const ready = Math.min(at + (pre.length ? pre[pre.length - 1][0] : 0), T1 - 6 * MIN)
  open.push({ t, at, s, pre, ready, steps: s === 'integrating' ? ['done'] : ['reviewing', 'integrating', 'done'] })
}

// done slots evenly over busy time, from the first open task's ready moment to the end; earliest-ready first
open.sort((a, b) => a.ready - b.ready)
const b0 = toBusy(open.length ? open[0].ready : T0) + 30 * MIN, b1 = toBusy(T1) - 2 * MIN
open.forEach((o, i) => {
  const slot = fromBusy(b0 + ((b1 - b0) * (i + 0.5)) / open.length)
  for (const [d, s] of o.pre) o.t.changes.push([Math.min(o.at + d, T1 - 5 * MIN), s, 0, 1])
  const start = Math.max(o.ready, ...o.t.changes.map((c) => c[0]))
  const done = Math.min(Math.max(slot, start + 3 * MIN), T1)
  // review and integration take the stretch before done, at most --review-hours of it (default 1.5)
  const span = Math.min(done - start, Number(one('--review-hours', 1.5)) * 60 * MIN)
  const at = { reviewing: done - span * 0.9, integrating: done - span * 0.4, done }
  for (const s of o.steps) o.t.changes.push([Math.round(at[s]), s, 0, 1])
  o.t.changes.sort((a, b) => a[0] - b[0])
})

// the opening: the spec's decomposition before the epic's tasks exist
const opening = Number(one('--opening', 0)) * MIN
const carried = []
if (opening) {
  const analyst = data.runs.find((r) => r.role === 'analyst')
  const S = T0 - opening
  data.window = [S, T1]
  for (const t of data.tasks) { if (t.start !== 'backlog') { carried.push(t.id); t.start = 'backlog' } t.from = T0 }
  data.tasks.unshift({ id: 't00', type: 'task', start: 'backlog', from: S, until: T0, changes: [[S + 2 * MIN, 'analysis', 0, 1], [T0 - 6 * MIN, 'to-review', 0, 1], [T0 - 4 * MIN, 'reviewing', 0, 1], [T0 - 1 * MIN, 'done', 0, 1]] })
  data.runs.unshift({ task: 't00', role: 'analyst', model: analyst ? analyst.model : 'gpt-6.1-sol', start: S + 2 * MIN, end: T0 - 7 * MIN, outcome: 'completed', synthetic: 1 })
}

// the person's messages after another run's pattern
const like = one('--human-like')
let humanFrom = null
if (like) {
  const o = JSON.parse(fs.readFileSync(like, 'utf8'))
  const [o0, o1] = o.window
  const oBusy = (t) => t - o0 - o.quiet.reduce((s, [a, b]) => s + Math.max(0, Math.min(t, b) - a), 0)
  const fr = o.human.map((t) => Math.max(0, oBusy(t) / oBusy(o1)))
  const early = fr.filter((f) => f < 0.05), late = fr.filter((f) => f >= 0.05)
  const [S] = data.window, total = toBusy(T1) + (T0 - S)
  const fromBusyAll = (x) => (x < T0 - S ? S + x : fromBusy(x - (T0 - S)))
  // early ones: across the first 60 % of the opening (or of the run's first 5 % without one), spacing kept
  const span = (opening || 0.05 * total) * 0.6, e1 = Math.max(...early, 1e-9)
  humanFrom = data.human.length
  data.human = [...early.map((f) => Math.round(S + 3 * MIN + (f / e1) * span)), ...late.map((f) => Math.round(fromBusyAll(f * total)))].sort((a, b) => a - b)
  data.counts.human = data.human.length
}

// the 4th element of a change marks it synthetic; DemoRun reads [time, status, back]
data.counts.done = data.tasks.filter((t) => t.id !== 't00' && last(t)[1] === 'done').length
data.synthetic = {
  by: '.scripts/demo-smooth.mjs',
  note: 'Alexey, 16.10: every task the log leaves open reaches done; done moments are spread evenly over busy time. Changes with a 4th element 1 are not in the logs.',
  tasks: open.length,
  ...(moved.length ? { movedAnalysis: moved } : {}),
  ...(like ? { human: { like, was: humanFrom, now: data.human.length } } : {}),
  ...(opening ? { opening: { minutes: opening / MIN, task: 't00', run: 'the first analyst run', carriedToQueue: carried } } : {}),
}
fs.writeFileSync(out, JSON.stringify(data))
const doneAt = data.tasks.map((t) => toBusy(last(t)[0]) / toBusy(T1))
console.log(`${out}: ${open.length} open tasks finished synthetically; done moments over busy time (0–1): ${doneAt.sort((a, b) => a - b).map((x) => x.toFixed(2)).join(' ')}`)
