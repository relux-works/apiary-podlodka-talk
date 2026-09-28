// Logo source for the theme chrome, overridable per deck through the headmatter:
//   themeConfig:
//     logo: false                # no logo anywhere
//     logo: /brand/logo.svg      # a file from the deck's public/ folder
//     logoAlt: Relux Works
// Without themeConfig.logo the theme's bundled RWB logo is used.
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import { withBase } from './base'
import bundled from '../assets/rwb-logo-white.png'

export function useThemeLogo() {
  const { $slidev } = useSlideContext()
  const cfg = computed(() => ($slidev.themeConfigs || {}) as Record<string, unknown>)
  const src = computed<string | null>(() => {
    const v = cfg.value.logo
    if (v === false || v === 'none') return null
    if (typeof v === 'string' && v) return withBase(v)
    return bundled
  })
  const alt = computed(() => String(cfg.value.logoAlt || 'RWB'))
  return { src, alt }
}
