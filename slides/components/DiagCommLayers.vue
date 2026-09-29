<script setup lang="ts">
// Запасной слайд «Четыре уровня общения» (план, слайд 35). Сценическая версия communication-layers; содержание сверено с
// process-configuration.md DRAFT v4.8 §6.5, §15 (передача между досками — PC3 и поправка waggle, то есть CM2 / PC3),
// keeper.md DRAFT v0.5.1 §10.4 и waggle DRAFT v5.2 §3, §5, §9.3, §10, §12, A1 §19.4. Вехи на слайде названы словами, коды — в заметках.
defineProps<{ reveal?: boolean }>()
const rows = [
  { h: 'Одна доска', chain: ['offer', 'accept', 'result'], note: 'записи доски, waggle не нужен · первая версия ядра процессов' },
  { h: 'Между досками и машинами', chain: ['coord.handoff-offer', 'accept', 'result'], note: 'подписанные сообщения waggle; результат подписан ключом хоста принимающей доски · когда waggle заработает между операторами' },
  { h: 'Кипер и оркестраторы', chain: ['ящик', 'звонок в дверь', 'pull'], note: 'запрос приходит как недоверенные данные; ран-ребёнок пишет только report.v1' },
  { h: 'Между машинами', chain: ['NATS JetStream', 'аренда скоупа', 'кворум'], note: 'tailnet операторов; аренда — compare-and-set, второй получает scope_owned_by' },
]
</script>
<template>
  <div class="dg-comm">
    <template v-for="(r, i) in rows" :key="r.h">
      <div v-if="reveal" v-click class="row"><div class="h">{{ r.h }}</div><div class="chain"><template v-for="(c, k) in r.chain" :key="c"><span v-if="k" class="arr">→</span><span class="pill" :class="{ lilac: i === 1 }">{{ c }}</span></template></div><div class="n">{{ r.note }}</div></div>
      <div v-else class="row"><div class="h">{{ r.h }}</div><div class="chain"><template v-for="(c, k) in r.chain" :key="c"><span v-if="k" class="arr">→</span><span class="pill" :class="{ lilac: i === 1 }">{{ c }}</span></template></div><div class="n">{{ r.note }}</div></div>
    </template>
  </div>
</template>
<style scoped>
.dg-comm { display: grid; gap: 12px; margin-bottom: 16px; }
.row { display: grid; grid-template-columns: 210px 1fr; grid-template-rows: auto auto; column-gap: 20px; row-gap: 6px; background: var(--rwb-card); border-radius: var(--rwb-radius); padding: 14px 18px; }
.h { grid-row: 1 / 3; align-self: center; font-size: 17px; font-weight: 500; color: var(--rwb-lilac); }
.chain { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.pill { font-family: var(--rwb-mono); font-size: 14px; background: var(--rwb-card-dark); border-radius: 8px; padding: 4px 10px; }
.pill.lilac { background: var(--rwb-lilac); color: var(--rwb-ink); }
.arr { color: var(--rwb-sec); }
.n { font-size: 14px; color: var(--rwb-sec-card); line-height: 1.35; }
</style>
