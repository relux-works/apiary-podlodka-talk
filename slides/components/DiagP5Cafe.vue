<script setup lang="ts">
// Слайд 27, не только код. Заказ поставщику в кафе: четыре вида владельцев на одной машинке.
// Источник: curator-playbook examples/cafe/cafe.playbook.json (воркфлоу purchase: draft → approval → sending → awaiting-confirmation
// → confirmed → receiving → invoiced → paid; таймер PT15M → escalated; handoff в accounting) и spec/process-configuration.md DRAFT v4.8
// §4.2 (виды владельцев), §6.5 (передача между процессами), §6.9 (таймеры, подписанные события), §11 (векторы общности).
// Ниже — зависимости плейбука (Иван, 13.10: «отдельные агенты устанавливаются как зависимости плейбука — по сути скиллы со своим
// тулчейном вроде mcp/cli доступа в crm / внутренние чаты малого бизнеса»): роли cafe-ops — скиллы cafe-orchestrator, cafe-buyer,
// cafe-stock-keeper, инструмент supplier.send-order — команда cafe-send-order пакета cafe-supplier-portal (cafe.playbook.json roles,
// tools); проект включает только проверенные скиллы (project.Playbook.json policy.enable.skills: "audited"). MCP к CRM, CLI учёта и
// чат с менеджерами — иллюстрация к примеру, в спеке их нет. ВНЖ убран 13.10 (Иван).
// reveal: заголовок сразу; состояния по порядку — черновик, одобрение, отправка, ожидание и подтверждение; приёмка, счёт и оплата;
// затем зависимости плейбука.
import { useId } from 'vue'
defineProps<{ reveal?: boolean }>()
const id = useId()
// in — стрелка в состояние из предыдущего: [x1, y1, x2, y2]
const states = [
  { x: 0, y: 26, t: 'Черновик', s: 'закупщик · агент', cls: 'n' },
  { x: 236, y: 26, t: 'Одобрение', s: 'менеджер · человек', cls: 'n-lime', in: [200, 51, 233, 51] },
  { x: 472, y: 26, t: 'Отправка', s: 'портал · инструмент', cls: 'n-wait', in: [436, 51, 469, 51] },
  { x: 708, y: 26, t: 'Ждём ответа', s: 'оркестратор', cls: 'n', in: [672, 51, 705, 51] },
  { x: 708, y: 124, t: 'Подтверждён', s: 'оркестратор', cls: 'n', in: [808, 76, 808, 121] },
  { x: 472, y: 124, t: 'Приёмка', s: 'менеджер · человек', cls: 'n-lime', in: [708, 149, 675, 149] },
  { x: 236, y: 124, t: 'Счёт', s: 'бухгалтерия · процесс', cls: 'n-purple', in: [472, 149, 439, 149] },
  { x: 0, y: 124, t: 'Оплачен', s: '', cls: 'n', in: [236, 149, 203, 149] },
]
// клики по речи: черновик · одобрение · отправка · ответ поставщика · приёмка, счёт и оплата
const groups = [[0, 1, 2, 3, 4], [5, 6, 7]] // the order and the wait, then acceptance, invoice and payment (13.10: per state was too small)
// зависимости плейбука: роль, пакет, её инструменты
const DW = 218, DG = 12
const deps = [
  { t: 'Оркестратор кафе', pkg: 'cafe-orchestrator', tool: 'MCP: чат с менеджерами', cls: 'n' },
  { t: 'Закупщик', pkg: 'cafe-buyer', tool: 'MCP: CRM поставщиков', cls: 'n' },
  { t: 'Кладовщик', pkg: 'cafe-stock-keeper', tool: 'CLI: учёт остатков', cls: 'n' },
  { t: 'Портал поставщика', pkg: 'cafe-supplier-portal', tool: 'CLI: отправка заказа', cls: 'n-wait' },
].map((d, i) => ({ ...d, x: i * (DW + DG) + 0.75 }))
const ink = (c: string) => c === 'n-lime'
const sub = (c: string) => ink(c) ? 't-ink-sec' : (c === 'n-purple' ? 't-on' : 't-sec')
</script>
<template>
  <svg width="908" height="304" viewBox="0 0 908 304" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <text x="0" y="13" class="t-head t-sec">КАФЕ · ЗАКАЗ ПОСТАВЩИКУ · ВОРКФЛОУ PURCHASE</text>
    <Step v-for="(g, gi) in groups" :key="gi" :on="reveal">
      <g v-for="i in g" :key="states[i].t">
        <line v-if="states[i].in" :x1="states[i].in[0]" :y1="states[i].in[1]" :x2="states[i].in[2]" :y2="states[i].in[3]" class="e" :marker-end="`url(#${id})`" />
        <rect :x="states[i].x" :y="states[i].y" width="200" height="50" rx="10" :class="states[i].cls" />
        <text :x="states[i].x + 100" :y="states[i].y + (states[i].s ? 21 : 30)" text-anchor="middle" class="t-big" :class="{ 't-ink': ink(states[i].cls) }">{{ states[i].t }}</text>
        <text v-if="states[i].s" :x="states[i].x + 100" :y="states[i].y + 40" text-anchor="middle" :class="sub(states[i].cls)">{{ states[i].s }}</text>
      </g>
      <template v-if="gi === 0">
        <text x="796" y="96" text-anchor="end" class="t-cap t-sec">подписанное событие поставщика</text>
        <text x="796" y="115" text-anchor="end" class="t-cap t-sec">иначе через 15 минут — эскалация менеджеру</text>
      </template>
    </Step>
    <!-- зависимости плейбука: агенты — скиллы со своими инструментами -->
    <Step :on="reveal">
      <text x="0" y="206" class="t-head t-sec">ЗАВИСИМОСТИ ПЛЕЙБУКА CAFE-OPS · СКИЛЛЫ СО СВОИМИ ИНСТРУМЕНТАМИ · СТАВИТ И ПРОВЕРЯЕТ CURATOR</text>
      <g v-for="d in deps" :key="d.pkg">
        <rect :x="d.x" y="218" :width="DW - 1.5" height="84" rx="10" :class="d.cls" />
        <text :x="d.x + 14" y="243" class="t-big">{{ d.t }}</text>
        <text :x="d.x + 14" y="264" class="pkg t-sec">{{ d.pkg }}</text>
        <text :x="d.x + 14" y="287" class="t-cap">{{ d.tool }}</text>
      </g>
    </Step>
  </svg>
</template>

<style scoped>
.pkg { font-family: var(--rwb-mono); font-size: 12px; }
</style>
