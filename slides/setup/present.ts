import type { Router } from 'vue-router'
import { sharedState, useNav } from '@slidev/client'
import { useHead } from '@unhead/vue'
import { computed } from 'vue'

// Present mode: `npm run present` (.scripts/present.sh) sets VITE_PRESENT=1 for the deck's dev server on the presenting
// host, which both speakers reach through SSH tunnels (.scripts/join.sh, docs/shared-clicker.md). Off everywhere else:
// `npm run dev`, the build, the PDF export and the audit behave as plain Slidev.
export const presentMode = !!import.meta.env.VITE_PRESENT

interface Position {
  page: number
  clicks: number
  lastUpdate?: { id: string, type: string, time: number }
}
// sharedState is the `nav` object of vite-plugin-vue-server-ref: $syncUp gates what this window sends to the server,
// $onSet and $onPatch report what the server sends. Slidev 52.19.1, pinned in package-lock.json.
type ServerNav = typeof sharedState & {
  $syncUp: boolean
  $onSet: (fn: (data: Partial<Position>) => void) => void
  $onPatch: (fn: (patch: Partial<Position>) => void) => void
}
const SLIDE_ROUTE = /^\/(presenter\/)?(\d+)$/

// A window that opens or reloads joins the live slide and click. Slidev sends a window's position after every route
// change, its first one included, so a window opened at its own URL pulls every other window to that slide. Probe on
// the mini, 13.10: a presenter window opened at /presenter/1 sent the shared screen from slide 10 back to slide 1, and
// a reload that had missed moves and a second viewer window did the same. Here the window sends nothing until it has
// taken the live position; after that it syncs as before. Runs in the app setup, before the first navigation can send.
export function joinLive(router: Router) {
  if (!presentMode)
    return
  const nav = sharedState as ServerNav
  if (!('$syncUp' in nav)) {
    console.warn('[present] the shared state has no $syncUp: a new window opens at its own slide')
    return
  }
  const pick = (s: Partial<Position>, base: Position): Position => ({
    page: +(s.page ?? base.page) || 0,
    clicks: +(s.clicks ?? base.clicks) || 0,
    lastUpdate: s.lastUpdate ?? base.lastUpdate,
  })
  let live = pick(nav, { page: 0, clicks: 0 })
  const take = (s: Partial<Position>) => {
    if (s?.lastUpdate)
      live = pick(s, live)
  }
  nav.$onSet(take)
  nav.$onPatch(take)
  nav.$syncUp = false

  router.isReady().then(() => setTimeout(async () => {
    const route = router.currentRoute.value
    const slide = SLIDE_ROUTE.exec(route.path)
    if (!slide || 'print' in route.query) {
      done() // overview, notes, export: plain Slidev
      return
    }
    if (!live.lastUpdate || !live.page) {
      // Nobody has moved yet: this window leads, as in plain Slidev. Send the position it held back.
      done()
      if (nav.lastUpdate)
        nav.lastUpdate = { ...nav.lastUpdate, time: Date.now() }
      return
    }
    // The local copy holds this window's own start position, which never left it: put the live one back, then go there.
    nav.page = live.page
    nav.clicks = live.clicks
    nav.lastUpdate = live.lastUpdate
    if (+slide[2] !== live.page || +(route.query.clicks ?? 0) !== live.clicks)
      await router.replace({ path: `/${slide[1] ?? ''}${live.page}`, query: { ...route.query, clicks: live.clicks } })
    setTimeout(done, 0)
  }, 0))
  // From here the window sends its moves; .scripts/sync-check.mjs waits for the mark.
  function done() {
    nav.$syncUp = true
    document.documentElement.dataset.present = 'joined'
  }
}

// Window titles say which window to share: «ЭКРАН» is the viewer, «ЗАМЕТКИ» a presenter or notes window.
export function presentTitles() {
  if (!presentMode)
    return
  const { isPresenter, isNotesViewer } = useNav()
  useHead({ titleTemplate: computed(() => `${isPresenter.value || isNotesViewer.value ? 'ЗАМЕТКИ' : 'ЭКРАН'} · %s`) })
}
