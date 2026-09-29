<script setup lang="ts">
// Слайд 28, клип за 19 часов как плейбук. Схема процесса, без кадров и звука: кто владеет каким шагом.
// Источник: curator-playbook examples/music-video/ (README «How the process maps», music-video.playbook.json, project.Playbook.json)
// на 648dc54, DRAFT v4.8; копия в cases/music-video/. Числа агентов — README «The production in numbers».
// Спека: §4.2 (владельцы, слепые помощники), §6.11 (инструменты запускает ядро), §6.11.1 (выходы инструментов, предложено), §4.2/§6.4 (делегирование трат).
defineProps<{ reveal?: boolean }>()
const stages = ['Текст', 'Песня и герой', 'Раскадровка', 'Кадры и клипы', 'Главы и монтаж']
const lanes = [
  { h: 'РЕЖИССЁР', s: 'человек', cls: 'n-lime', cells: [['концепция', ''], ['дубль на слух', 'выбор героя'], ['одобрение', ''], ['потолок трат', 'на клип'], ['финальный', 'монтаж']] },
  { h: 'АГЕНТЫ', s: 'скиллы ролей', cls: 'n', cells: [['31 агент', '3 судьи вслепую'], ['канон героя', 'арт-директор'], ['7 агентов', 'судьи вслепую'], ['промпты', 'отбор кадров'], ['40 запусков', 'ревью кадров']] },
  { h: 'ИНСТРУМЕНТЫ', s: 'запускает ядро', cls: 'n-wait', cells: [null, ['песня', 'анализ звука'], ['проверка', 'раскадровки'], ['картинки, клипы', 'замер липсинка'], ['проверка', 'рендер']] },
]
const X0 = 150
const CW = 151.6
const ink = (c: string) => c === 'n-lime'
</script>
<template>
  <svg width="908" height="266" viewBox="0 0 908 266" aria-hidden="true">
    <text v-for="(s, i) in stages" :key="s" :x="X0 + i * CW + CW / 2 - 4" y="14" text-anchor="middle" class="t-head t-sec">{{ s.toUpperCase() }}</text>
    <line x1="150" y1="26" x2="900" y2="26" class="e-dash" />
    <path d="M896,22 L904,26 L896,30 z" class="m" />
    <template v-for="(l, r) in lanes" :key="l.h">
      <g v-if="reveal" v-click>
        <rect x="0.75" :y="36 + r * 76" width="906.5" height="68" rx="12" class="frame" />
        <text x="16" :y="64 + r * 76" class="t-head" :class="r === 0 ? 't-lime' : 't-lilac'">{{ l.h }}</text>
        <text x="16" :y="84 + r * 76" class="t-cap t-sec">{{ l.s }}</text>
        <template v-for="(c, i) in l.cells" :key="i">
          <g v-if="c">
            <rect :x="X0 + i * CW" :y="46 + r * 76" :width="CW - 10" height="48" rx="10" :class="l.cls" />
            <text :x="X0 + i * CW + (CW - 10) / 2" :y="(c[1] ? 66 : 75) + r * 76" text-anchor="middle" class="t-cap" :class="{ 't-ink': ink(l.cls) }">{{ c[0] }}</text>
            <text v-if="c[1]" :x="X0 + i * CW + (CW - 10) / 2" :y="84 + r * 76" text-anchor="middle" class="t-cap" :class="ink(l.cls) ? 't-ink-sec' : 't-sec'">{{ c[1] }}</text>
          </g>
        </template>
      </g>
      <g v-else>
        <rect x="0.75" :y="36 + r * 76" width="906.5" height="68" rx="12" class="frame" />
        <text x="16" :y="64 + r * 76" class="t-head" :class="r === 0 ? 't-lime' : 't-lilac'">{{ l.h }}</text>
        <text x="16" :y="84 + r * 76" class="t-cap t-sec">{{ l.s }}</text>
        <template v-for="(c, i) in l.cells" :key="i">
          <g v-if="c">
            <rect :x="X0 + i * CW" :y="46 + r * 76" :width="CW - 10" height="48" rx="10" :class="l.cls" />
            <text :x="X0 + i * CW + (CW - 10) / 2" :y="(c[1] ? 66 : 75) + r * 76" text-anchor="middle" class="t-cap" :class="{ 't-ink': ink(l.cls) }">{{ c[0] }}</text>
            <text v-if="c[1]" :x="X0 + i * CW + (CW - 10) / 2" :y="84 + r * 76" text-anchor="middle" class="t-cap" :class="ink(l.cls) ? 't-ink-sec' : 't-sec'">{{ c[1] }}</text>
          </g>
        </template>
      </g>
    </template>
  </svg>
</template>
