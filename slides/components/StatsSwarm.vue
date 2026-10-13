<script setup lang="ts">
// Статистика после демо 2 (Иван, 13.10: «…и один после второго»): рой за две недели в цифрах. Карточки: оркестраторы и
// их пик, сообщения агентов в Matrix (нижняя граница), переписка между агентами Ивана и Алексея, вмешательства людей;
// ниже — сколько агенты пишут друг другу против того, сколько люди пишут оркестраторам. Цифры — slides/demo/stats.json
// (.scripts/swarm-stats.mjs); определения и оговорки — docs/swarm-stats.md.
import stats from '../demo/stats.json'

const v = stats.twoWeeks
const m = v.messages!
const p = v.people!
const num = (n: number) => n.toLocaleString('ru-RU')
const plural = (n: number, f: [string, string, string]) => f[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2]
const orch = (v.orchestrators.lanes1h.mini || 0) + (v.orchestrators.lanes1h.ivmbp || 0) + ((v.orchestrators.lanes1h as Record<string, number>).m1max || 0)
const ratio = Math.floor(m.total / Math.max(1, p.prompts))
const WORDS: Record<number, string> = { 2: 'два', 3: 'три', 4: 'четыре', 5: 'пять', 6: 'шесть', 7: 'семь', 8: 'восемь', 9: 'девять' }
const BAR = 640
const kinds = m.byKind as Record<string, number>
</script>

<template>
  <div class="cards cols-4">
    <BigNum :value="num(orch)" :caption="`${plural(orch, ['оркестратор', 'оркестратора', 'оркестраторов'])} за две недели, в пике ${v.orchestrators.peak.n} одновременно`" />
    <BigNum :value="`${num(m.total)}+`" :caption="`${plural(m.total, ['сообщение', 'сообщения', 'сообщений'])} агентов в Matrix от ${m.agents.ivan + m.agents.alexey} агентов`" />
    <BigNum :value="num(m.cross)" :caption="`между агентами Ивана и Алексея, поровну в обе стороны`" tone="neutral" />
    <BigNum :value="num(p.prompts)" :caption="`${plural(p.prompts, ['раз', 'раза', 'раз'])} человек писал оркестраторам; самый долгий перерыв ${p.longestGapH} ${plural(p.longestGapH, ['час', 'часа', 'часов'])}`" tone="neutral" />
  </div>
  <svg v-click class="stats-swarm" width="908" height="112" viewBox="0 0 908 112" aria-hidden="true">
    <text x="0" y="14" class="t-head t-sec">КТО КОМУ ПИШЕТ ЗА ДВЕ НЕДЕЛИ</text>
    <text x="0" y="44" class="t-sec">Агенты — друг другу</text>
    <rect x="200" y="31" :width="BAR" height="18" rx="3" class="n-purple" />
    <text :x="208 + BAR" y="44" class="v">{{ num(m.total) }}+</text>
    <text x="0" y="76" class="t-sec">Люди — оркестраторам</text>
    <rect x="200" y="63" :width="Math.max(3, (p.prompts / m.total) * BAR)" height="18" rx="3" class="n-lime" />
    <text :x="208 + Math.max(3, (p.prompts / m.total) * BAR)" y="76" class="v">{{ num(p.prompts) }}</text>
    <text x="200" y="106" class="t-sec small">из сообщений агентов: решений {{ num(kinds.decision || 0) }} · вопросов {{ num(kinds.question || 0) }} · вопросов людям {{ num(kinds['owner-needed'] || 0) }}</text>
  </svg>
  <p v-click class="lead lime">Агенты пишут друг другу в {{ WORDS[ratio] ?? ratio }} {{ plural(ratio, ['раз', 'раза', 'раз']) }} чаще, чем люди — оркестраторам.</p>
</template>

<style scoped>
.stats-swarm { display: block; margin: 18px 0 0 0; }
.stats-swarm text.v { fill: var(--rwb-txt); }
.stats-swarm text.small { font-size: 12px; }
</style>
