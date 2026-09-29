<script setup lang="ts">
// Слайд плана 24, главный тезис: карта в три слоя — что строим поверх, наши контракты, среды вендоров. Новая схема.
// Можно переиспользовать на слайде «где мы» (план 40): prop highlight приглушает остальные слои.
// Цвет — статус по источникам: лайм — работает сегодня, сирень — решено, пунктир — в спеке, предложено.
// Источники: text/from-buckets-to-apiary.ru.md гл. 3 (таблица сред), гл. 4 (таблица плоскостей), 4.6 (свой цикл отложен);
// wiki README «Map by plane» (Curator — rc; agents-management — shipped; session-host module — planned, первый приоритет
// с 24.09; curator-model-router — draft design; curator-playbook — planned; waggle — draft v5);
// curator-model-router spec/model-routing.md («decided design, pre-implementation»; техзаписка гл. 04, веха M8 — решено);
// agent-session-host spec/session-host.md §3 (вынос как есть — решено 24.09); curator-playbook spec DRAFT v4.8;
// waggle spec DRAFT v5.2; wiki decisions.md 2026-09-28 (свой агентский цикл отложен; keeper §7.7);
// wiki decisions.md 2026-09-25 (профиль роли у каждого запуска). Статусы на 29.09.
// reveal: поверх (1), контракты (2), среды (3).
const props = withDefaults(defineProps<{ reveal?: boolean, highlight?: 'top' | 'contracts' | 'vendors' }>(), { reveal: false })
type Box = { h: string, s?: string, st: 'today' | 'decided' | 'proposed' }
const fill = { today: 'n-lime', decided: 'n-lilac', proposed: 'n-wait' }
const light = (b: Box) => b.st !== 'proposed'
const top: Box[] = [
  { h: 'Профили ролей', s: 'у каждого запуска свой', st: 'decided' },
  { h: 'Процессы', s: 'Playbook.json, v4.8', st: 'proposed' },
  { h: 'Связь оркестраторов', s: 'waggle, v5.2', st: 'proposed' },
]
const mid: Box[] = [
  { h: 'Контекст · Curator', s: 'кандидат в релиз', st: 'today' },
  { h: 'Сборка запуска', s: 'agents-management', st: 'today' },
  { h: 'Хост сессий', s: 'вынос решён 24.09', st: 'decided' },
  { h: 'Роутер', s: 'решено, не построен', st: 'decided' },
]
const envs: Box[] = [
  { h: 'Claude Code', st: 'today' }, { h: 'Codex', st: 'today' }, { h: 'Muse', st: 'proposed' },
  { h: 'agy', st: 'proposed' }, { h: 'Pi', st: 'proposed' }, { h: 'Qwen', st: 'proposed' },
]
const TW = 284, MW = 210, EW = 138
// Приглушение через style: атрибут opacity на <g> UnoCSS attributify читает как утилиту.
const dim = (layer: string) => ({ opacity: props.highlight && props.highlight !== layer ? 0.28 : 1 })
</script>
<template>
  <svg width="908" height="264" viewBox="0 0 908 264" aria-hidden="true">
    <g v-click="reveal ? 1 : false"><g :style="dim('top')">
      <rect x="0.75" y="0.75" width="906.5" height="80" rx="14" class="frame" />
      <text x="16" y="21" class="t-head t-lilac">ЧТО МЫ СТРОИМ ПОВЕРХ</text>
      <g v-for="(b, i) in top" :key="b.h">
        <rect :x="16 + i * (TW + 12)" y="28" :width="TW" height="44" rx="8" :class="fill[b.st]" />
        <text :x="16 + i * (TW + 12) + TW / 2" y="46" text-anchor="middle" class="t-big" :class="light(b) ? 't-ink' : ''">{{ b.h }}</text>
        <text :x="16 + i * (TW + 12) + TW / 2" y="64" text-anchor="middle" :class="light(b) ? 't-ink-sec' : 't-sec'">{{ b.s }}</text>
      </g>
    </g></g>
    <g v-click="reveal ? 2 : false"><g :style="dim('contracts')">
      <rect x="0.75" y="90" width="906.5" height="80" rx="14" class="frame-hive" />
      <text x="16" y="111" class="t-head t-lilac">НАШИ КОНТРАКТЫ · ВСЁ ВЕНДОРСКОЕ СПРЯТАНО ЗДЕСЬ</text>
      <g v-for="(b, i) in mid" :key="b.h">
        <rect :x="16 + i * (MW + 12)" y="118" :width="MW" height="44" rx="8" :class="fill[b.st]" />
        <text :x="16 + i * (MW + 12) + MW / 2" y="136" text-anchor="middle" class="t-big" :class="light(b) ? 't-ink' : ''">{{ b.h }}</text>
        <text :x="16 + i * (MW + 12) + MW / 2" y="154" text-anchor="middle" :class="light(b) ? 't-ink-sec' : 't-sec'">{{ b.s }}</text>
      </g>
    </g></g>
    <g v-click="reveal ? 3 : false"><g :style="dim('vendors')">
      <rect x="0.75" y="180" width="906.5" height="82" rx="14" class="frame" />
      <text x="16" y="201" class="t-head t-sec">СРЕДЫ ВЕНДОРОВ · ПОДПИСКИ УЖЕ ОПЛАЧЕНЫ</text>
      <rect x="592" y="186" width="300" height="22" rx="11" class="n-lilac" />
      <text x="742" y="201" text-anchor="middle" class="t-head t-ink">СВОЕГО ЦИКЛА НЕТ · РЕШЕНО 28.09</text>
      <g v-for="(b, i) in envs" :key="b.h">
        <rect :x="16 + i * (EW + 9.6)" y="214" :width="EW" height="40" rx="8" :class="fill[b.st]" />
        <text :x="16 + i * (EW + 9.6) + EW / 2" y="239" text-anchor="middle" class="t-big" :class="light(b) ? 't-ink' : ''">{{ b.h }}</text>
      </g>
    </g></g>
  </svg>
</template>
