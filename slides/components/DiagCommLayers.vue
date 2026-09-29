<script setup lang="ts">
// Слайд 35, waggle. Сценическая версия communication-layers (process configuration draft v3.3 §6.5, §7.2; waggle §3, §5, §9.3, §10, §12, A1 §19.4).
defineProps<{ reveal?: boolean }>()
const rows = [
  { h: 'Одна доска', chain: ['offer', 'accept', 'result'], note: 'записи доски, waggle не нужен · PC1' },
  { h: 'Между досками и машинами', chain: ['coord.handoff-offer', 'accept', 'result'], note: 'подписанные сообщения waggle; результат подписан ключом хоста доски, а не словами модели · CM2' },
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
