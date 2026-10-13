import { defineConfig } from 'vite'

// The in-slide demos' shared clock (slides/demo/clock.ts) lives in the dev server next to Slidev's own position,
// so the shared screen and both speakers' windows start, pause and rewind a demo together. Any key added here is
// synced the same way; the build and the PDF read the initial value only.
export default defineConfig({
  slidev: {
    serverRef: {
      state: {
        demo: { id: '', status: 'idle', at: 0, stamp: 0, rev: 0 },
      },
    },
  },
})
