#!/usr/bin/env node
// A synthetic ending for a demo 1 dataset whose epic stopped half way (Alexey, 16.10: no pile in review that bursts into
// integration and done at the end; «+- равномерно уходило в интеграцию и в дан»). Every task that is not done when the
// log ends gets reviewing → integrating → done, and the done moments are spread evenly over the run's busy time (quiet
// stretches left out, as the replay squeezes them). A task never finishes before the log shows it ready: a blocked task
// first goes back to development and to review. The log's own events are untouched, and the file says what was added.
//
//   node .scripts/demo-smooth.mjs --in slides/demo/demo-1/infra-exit.json --out slides/demo/demo-1/infra-exit-smoothed.json
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
  // review and integration take the stretch before done, at most an hour and a half of it
  const span = Math.min(done - start, 90 * MIN)
  const at = { reviewing: done - span * 0.9, integrating: done - span * 0.4, done }
  for (const s of o.steps) o.t.changes.push([Math.round(at[s]), s, 0, 1])
  o.t.changes.sort((a, b) => a[0] - b[0])
})

// the 4th element of a change marks it synthetic; DemoRun reads [time, status, back]
data.counts.done = data.tasks.filter((t) => last(t)[1] === 'done').length
data.synthetic = {
  by: '.scripts/demo-smooth.mjs',
  note: 'Alexey, 16.10: every task the log leaves open reaches done; done moments are spread evenly over busy time. Changes with a 4th element 1 are not in the logs.',
  tasks: open.length,
}
fs.writeFileSync(out, JSON.stringify(data))
const doneAt = data.tasks.map((t) => toBusy(last(t)[0]) / toBusy(T1))
console.log(`${out}: ${open.length} open tasks finished synthetically; done moments over busy time (0–1): ${doneAt.sort((a, b) => a - b).map((x) => x.toFixed(2)).join(' ')}`)
