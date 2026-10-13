// The clock of an in-slide demo (docs/demos.md): one start, then it plays by itself to the end. Any window can
// pause it for an explanation, resume it and rewind it by a beat, and every window shows the same moment: the
// state lives in the dev server (server-reactive:demo, slides/vite.config.ts), as Slidev's own position does.
//
// Keys on the demo's slide, the clicker's two buttons included:
//   → Space PageDown   start; then pause and resume; after the end, the next slide as usual
//   ← PageUp           back to the start of the current beat, or of the previous one within its first 2 seconds;
//                      before the start, the previous slide as usual
//   R                  restart from the beginning
// The build and the PDF have no server: the demo shows its last frame there.
// @ts-expect-error virtual module of vite-plugin-vue-server-ref
import demoState from 'server-reactive:demo'
import { useNav, useSlideContext } from '@slidev/client'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface DemoState {
  id: string
  status: 'idle' | 'playing' | 'paused'
  at: number // demo time when the last command was given, ms
  stamp: number // Date.now() of the window that gave it
  rev: number
}
const state = demoState as DemoState
const live = !!import.meta.hot
// .scripts/demo-frames.mjs renders fixed moments: ?demo-t=<ms> before the hash holds the clock there
const pinned = Number(new URLSearchParams(location.search).get('demo-t') ?? Number.NaN)

export function useDemoClock(id: string, duration: number, beats: number[]) {
  const { $page, $renderContext } = useSlideContext()
  const nav = useNav()
  const now = ref(Date.now())
  // Each window counts from the moment it learned of the last command, not from the sender's clock, so two
  // laptops whose clocks differ still show the same frame. A window that opens mid-play uses the sender's stamp.
  let base = { at: state.at, local: state.stamp || Date.now() }
  watch(() => state.rev, () => { base = { at: state.at, local: Date.now() } })

  const status = computed(() => (state.id === id ? state.status : 'idle'))
  const t = computed(() => {
    if (!Number.isNaN(pinned))
      return Math.min(pinned, duration)
    if (!live || nav.isPrintMode.value)
      return duration
    if (status.value === 'idle')
      return 0
    const at = status.value === 'paused' ? state.at : base.at + (now.value - base.local)
    return Math.max(0, Math.min(at, duration))
  })
  const ended = computed(() => t.value >= duration)

  function command(status: DemoState['status'], at: number) {
    base = { at, local: Date.now() }
    Object.assign(state, { id, status, at, stamp: Date.now(), rev: (state.rev || 0) + 1 })
  }
  const start = () => command('playing', 0)
  const pause = () => command('paused', t.value)
  const resume = () => command('playing', t.value)
  function back() {
    let i = beats.length - 1
    while (i > 0 && beats[i] > t.value) i--
    if (i > 0 && t.value - beats[i] < 2000)
      i--
    command(status.value === 'paused' ? 'paused' : 'playing', beats[i])
  }

  // Only the window's own copy of the demo's slide listens: not the next-slide preview, not the overview.
  const active = () => nav.currentSlideNo.value === $page.value && ['slide', 'presenter'].includes($renderContext.value)
  function onKey(e: KeyboardEvent) {
    if (!live || !active() || e.metaKey || e.ctrlKey || e.altKey)
      return
    const target = e.target as HTMLElement | null
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable))
      return
    const next = e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)
    const prev = e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)
    if (e.key === 'r' || e.key === 'R') start()
    else if (next && status.value === 'idle') start()
    else if (next && !ended.value) (status.value === 'playing' ? pause : resume)()
    else if (prev && status.value !== 'idle') back()
    else return
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  let raf = 0
  const tick = () => {
    now.value = Date.now()
    raf = requestAnimationFrame(tick)
  }
  onMounted(() => {
    window.addEventListener('keydown', onKey, { capture: true })
    if (live)
      raf = requestAnimationFrame(tick)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey, { capture: true })
    cancelAnimationFrame(raf)
  })
  return { t, status, ended }
}
