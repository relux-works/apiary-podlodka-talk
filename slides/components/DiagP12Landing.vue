<script setup lang="ts">
// Слайд 10, Change Request и приземление. Worktree на story → Change Request (неизменяемая ревизия) → проверки
// на точном дереве кандидата → ревьюер → интеграция в trunk подписанными коммитами → публикация.
// Внизу справа — общий на машину лимит тяжёлых прогонов проверки.
// Источник: skill-project-management references/tracked-background-spawn.md («Story Worktree Isolation», «Scheduling»,
// «Change Requests, review, rework», «Landing a Story», «Validation binds to the tree that lands»);
// .specs/validation-binding.md; README «Isolated Story delivery», «Cross-repository landing flow»;
// wiki research/call-digest-2026-09-28.md §1; text/from-buckets-to-apiary.ru.md §2.
//   reveal — ряд доставки одним кликом, возврат, интеграция и публикация, машина
//   brief — v6 (12.10), основной поток «Изоляция и приземление»: без блока машины, публикация — «PR и CI, потом main»
//   (разговор спикеров 12.10: перегрузку CI и fast-forward обсуждаем вне доклада)
import { computed, useId } from 'vue'
const props = withDefaults(defineProps<{ reveal?: boolean, brief?: boolean }>(), { reveal: false, brief: false })
const id = useId()
const click = computed(() => props.reveal ? '+1' : false)
const BW = 200, GAP = 36, Y = 40, BH = 60, Y2 = 176
const bx = (i: number) => i * (BW + GAP)
const row = [
  { t: 'Продюсер', s: 'worktree своей story', f: 'n-purple', st: 't-on', tt: '' },
  { t: 'Change Request', s: 'ревизия: деревья, патч', f: 'n', st: 't-sec', tt: '' },
  { t: 'Проверки', s: 'на точном дереве', f: 'n-lime', st: 't-ink-sec', tt: 't-ink' },
  { t: 'Ревьюер', s: 'принять или вернуть', f: 'n-lilac', st: 't-ink-sec', tt: 't-ink' },
]
</script>
<template>
  <svg width="908" height="276" viewBox="0 0 908 276" aria-hidden="true">
    <defs>
      <marker :id="`${id}-a`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker>
      <marker :id="`${id}-l`" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m-lime" /></marker>
    </defs>
    <!-- ряд доставки -->
    <g v-click="click">
      <g v-for="(b, i) in row" :key="b.t">
        <line v-if="i > 0" :x1="bx(i) - GAP" :x2="bx(i) - 3" :y1="Y + BH / 2" :y2="Y + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
        <rect :x="bx(i)" :y="Y" :width="BW" :height="BH" rx="10" :class="b.f" />
        <text :x="bx(i) + BW / 2" :y="Y + 26" text-anchor="middle" class="t-big" :class="b.tt">{{ b.t }}</text>
        <text :x="bx(i) + BW / 2" :y="Y + 45" text-anchor="middle" :class="b.st">{{ b.s }}</text>
      </g>
    </g>
    <!-- возврат -->
    <g v-click="click">
      <path :d="`M${bx(3) + BW / 2},${Y} V${Y - 26} H${bx(0) + BW / 2} V${Y - 3}`" class="e-dash" :marker-end="`url(#${id}-a)`" />
      <rect x="318" :y="Y - 38" width="272" height="22" class="knock" />
      <text x="454" :y="Y - 22" text-anchor="middle" class="t-cap">доработка: ревизия N+1, та же ветка</text>
    </g>
    <!-- интеграция и публикация -->
    <g v-click="click">
      <path :d="`M${bx(3) + BW / 2},${Y + BH} V${Y + BH + 22} H${BW / 2} V${Y2 - 3}`" class="e-lime" :marker-end="`url(#${id}-l)`" />
      <rect x="360" :y="Y + BH + 12" width="188" height="20" class="knock" />
      <text x="454" :y="Y + BH + 27" text-anchor="middle" class="t-cap t-lime">принято → integrating</text>
      <rect x="0" :y="Y2" width="260" :height="BH" rx="10" class="n-purple" />
      <text x="130" :y="Y2 + 26" text-anchor="middle" class="t-big">Интеграция в trunk</text>
      <text x="130" :y="Y2 + 45" text-anchor="middle" class="t-on">подписанный squash + доска</text>
      <line x1="260" x2="293" :y1="Y2 + BH / 2" :y2="Y2 + BH / 2" class="e" :marker-end="`url(#${id}-a)`" />
      <rect x="296" :y="Y2" width="260" :height="BH" rx="10" class="n" />
      <text x="426" :y="Y2 + 26" text-anchor="middle" class="t-big">Публикация</text>
      <text x="426" :y="Y2 + 45" text-anchor="middle" class="t-sec">{{ brief ? 'PR и CI, потом main' : 'PR, ревью, fast-forward' }}</text>
      <text x="0" :y="Y2 + BH + 26" class="t-cap t-sec">в trunk попадает только целая принятая story</text>
    </g>
    <!-- машина -->
    <g v-if="!brief" v-click="click">
      <rect x="592.75" :y="Y2 - 14" width="314.5" height="112" rx="14" class="frame" />
      <text x="608" :y="Y2 + 8" class="t-head t-orange">МАШИНА · ТЯЖЁЛЫЕ ПРОГОНЫ</text>
      <rect x="608" :y="Y2 + 22" width="64" height="34" rx="8" class="n-lime" />
      <text x="640" :y="Y2 + 44" text-anchor="middle" class="t-cap t-ink">набор</text>
      <rect x="680" :y="Y2 + 22" width="64" height="34" rx="8" class="n-lime" />
      <text x="712" :y="Y2 + 44" text-anchor="middle" class="t-cap t-ink">набор</text>
      <rect x="760" :y="Y2 + 22" width="40" height="34" rx="8" class="n-wait" />
      <rect x="808" :y="Y2 + 22" width="40" height="34" rx="8" class="n-wait" />
      <rect x="856" :y="Y2 + 22" width="36" height="34" rx="8" class="n-wait" />
      <text x="608" :y="Y2 + 80" class="t-cap t-sec">2 слота на машину, остальные ждут</text>
      <path :d="`M${bx(2) + BW / 2},${Y + BH} C${bx(2) + BW / 2},${Y + BH + 40} 700,${Y2 - 40} 700,${Y2 - 17}`" class="e-dash" :marker-end="`url(#${id}-a)`" />
    </g>
  </svg>
</template>
