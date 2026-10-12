import { defineRootSetup } from '@slidev/types'
import { presentTitles } from './present'

// Present mode only (VITE_PRESENT, set by `npm run present`): window titles «ЭКРАН» and «ЗАМЕТКИ».
export default defineRootSetup(() => {
  presentTitles()
})
