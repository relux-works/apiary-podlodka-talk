<script setup lang="ts">
// v4, глава 6, слайд 51 «Безопасность роя». Видение. Замена DiagP67SwarmSecurity для основного потока: угроза → защита.
// Источники: waggle spec/waggle.md DRAFT v5.2 §0 (воркеры никогда не шлют указаний оркестраторам), §5 (ростер ограничивает классы:
// ключ воркера не подпишет валидный coord или cmd ни через какой транспорт), §7 (эшелонированная защита от инъекций: полномочия вне
// модели, типизированные тела, рамка недоверенных данных, инспекторы, карантин по умолчанию для внешних отправителей), §15;
// apiary-docs v3.2.0, статья §8 п. 4 и §10 (ревьювер вычисляется из случайности после заморозки кандидатов; проверки гоняет третья нода),
// §13 (три оси независимости; репутация задаёт глубину проверки и вес при выборе в ревьюверы), §3, §6 (записи с QC кор-нод),
// §16 (P = q^k, q = p + (1 − p)(1 − d); p = 0,1, d = 0,7 → 0,37 / 0,14 / 0,05; «иллюстрация… а не оценка безопасности»);
// руководство §1.4 («ревьювер выбран так, что его нельзя подобрать»), §8.2 («два ревьювера на разных семействах моделей пропускают
// разное»), §9.7. v4.2: строка 1 — по контракту trust-and-isolation v1.3 §3, §6, §7 (задача письмом через брокера и ящик;
// у удалённого агента нет гранта командовать оркестратором). Донорский профиль (§8.4 руководства) убран: защита машины донора — открыто.
// reveal: три строки по кликам, затем иллюстрация.
defineProps<{ reveal?: boolean }>()
const rows = [
  { threat: 'вывод агента несёт инъекцию', head: 'Канал в одну сторону', text: 'задача уходит письмом, обратно — только работа как данные; гранта командовать оркестратором у агента нет' },
  { threat: 'агент подсадил уязвимость', head: 'Независимые циклы ревью', text: 'ревьюера выбирает случайность с весом по репутации; слияние в main подписывают доверенные узлы' },
  { threat: 'одна модель ошибается одинаково', head: 'Разные семейства моделей', text: 'и разные владельцы и тулчейны: против общих слепых зон и сговора' },
]
const odds = [['1 ревьюер', '0,37'], ['2 ревьюера', '0,14'], ['3 ревьюера', '0,05']]
</script>
<template>
  <div class="dg-sec">
    <div class="rows">
      <Step v-for="r in rows" :key="r.head" :on="reveal" as="div">
        <div class="row">
          <div class="threat">✕ {{ r.threat }}</div>
          <div class="head">{{ r.head }}</div>
          <div class="text">{{ r.text }}</div>
        </div>
      </Step>
    </div>
    <Step :on="reveal" as="div">
      <div class="odds">
        <div class="cap">ПОДСАЖЕННАЯ УЯЗВИМОСТЬ ПРОХОДИТ</div>
        <div v-for="o in odds" :key="o[0]" class="o"><span class="v">{{ o[1] }}</span><span class="k">{{ o[0] }}</span></div>
        <div class="foot">если 10 % агентов злонамеренны, а честный ревьюер ловит 70 %; иллюстрация, не оценка</div>
      </div>
    </Step>
  </div>
</template>
<style scoped>
.dg-sec { display: grid; grid-template-columns: 1fr 260px; gap: 16px; margin-bottom: 16px; }
.rows { display: grid; gap: 10px; }
.row { background: var(--rwb-card); border-radius: var(--rwb-radius); padding: 10px 16px 12px; }
.threat { font-family: var(--rwb-mono); font-size: 13px; color: var(--rwb-orange); letter-spacing: 0.02em; }
.head { font-size: 18px; font-weight: 500; color: var(--rwb-lilac); margin: 2px 0 2px; }
.text { font-size: 15px; line-height: 1.3; color: var(--rwb-sec-card); }
.odds { height: 100%; box-sizing: border-box; border: 1.25px solid var(--rwb-dim); border-radius: var(--rwb-radius); padding: 12px 16px; display: flex; flex-direction: column; gap: 6px; }
.cap { font-family: var(--rwb-mono); font-size: 13px; letter-spacing: 0.06em; color: var(--rwb-sec); line-height: 1.3; }
.o { display: flex; align-items: baseline; gap: 12px; }
.v { font-size: 30px; font-weight: 500; color: var(--rwb-lilac); min-width: 76px; }
.k { font-size: 15px; color: var(--rwb-sec); }
.foot { font-size: 13px; line-height: 1.35; color: var(--rwb-dim); margin-top: auto; }
</style>
