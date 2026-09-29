<script setup lang="ts">
// Слайд 35, waggle: подпись важнее канала. Новая схема части 6.
// Источник: waggle spec/waggle.md DRAFT v5.2 (2026-09-27): §3 ростер allowed_signers, §4.1–4.3 конверт и проверка,
// §5 классы, §6 пример мультиподписи (Альфа останавливает исполнителя Боба с одобрением Алисы), §9 провайдеры, §9.3 carrier.
// Техническая записка, глава 11. Ничего из этого не реализовано.
import { useId } from 'vue'
const id = useId()
const pipes = ['NATS JetStream', 'IRC · XMPP', 'Telegram · Slack', 'почта']
</script>
<template>
  <svg width="908" height="330" viewBox="0 0 908 330" aria-hidden="true">
    <defs><marker :id="id" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" class="m" /></marker></defs>
    <!-- 1. кто подписывает и сам конверт -->
    <g>
      <rect x="0" y="40" width="184" height="54" rx="10" class="n-purple" />
      <text x="92" y="62" text-anchor="middle" class="t-big">Оркестратор Альфа</text>
      <text x="92" y="81" text-anchor="middle" class="t-on">orch:alpha</text>
      <rect x="0" y="166" width="184" height="54" rx="10" class="n-lime" />
      <text x="92" y="188" text-anchor="middle" class="t-big t-ink">Оператор Алиса</text>
      <text x="92" y="207" text-anchor="middle" class="t-ink-sec">op:alice · FIDO-ключ</text>
      <text x="0" y="122" class="t-cap t-sec">ключ сессии держит</text>
      <text x="0" y="140" class="t-cap t-sec">хост, не модель</text>
      <rect x="220.75" y="0.75" width="236" height="262" rx="14" class="frame-hive" />
      <text x="236" y="22" class="t-head t-lilac">КОНВЕРТ WAGGLE</text>
      <rect x="236" y="36" width="206" height="62" rx="10" class="n" />
      <text x="339" y="60" text-anchor="middle" class="t-big">точные байты</text>
      <text x="339" y="81" text-anchor="middle" class="t-sec">cmd.halt → worker Боба</text>
      <rect x="236" y="110" width="206" height="54" rx="10" class="n" />
      <text x="339" y="132" text-anchor="middle" class="t-big">SSHSIG · author</text>
      <text x="339" y="151" text-anchor="middle" class="t-sec">orch:alpha</text>
      <rect x="236" y="176" width="206" height="72" rx="10" class="n-lilac" />
      <text x="339" y="198" text-anchor="middle" class="t-big t-ink">SSHSIG · approver</text>
      <text x="339" y="217" text-anchor="middle" class="t-ink-sec">op:alice</text>
      <text x="339" y="235" text-anchor="middle" class="t-ink-sec">касание: присутствие ✓</text>
      <path d="M184,67 C206,67 210,137 233,137" class="e" :marker-end="`url(#${id})`" />
      <path d="M184,193 C206,193 212,212 233,212" class="e" :marker-end="`url(#${id})`" />
    </g>
    <!-- 2. провайдеры: недоверенные трубы -->
    <g>
      <text x="496" y="22" class="t-head t-sec">ПРОВАЙДЕРЫ</text>
      <rect v-for="(p, i) in pipes" :key="p" x="496" :y="36 + i * 52" width="148" height="40" rx="10" class="n-wait" />
      <text v-for="(p, i) in pipes" :key="p + 't'" x="570" :y="61 + i * 52" text-anchor="middle" class="t-cap">{{ p }}</text>
      <text x="496" y="264" class="t-cap t-sec">возят байты,</text>
      <text x="496" y="282" class="t-cap t-sec">полномочий не дают</text>
      <line x1="457" y1="134" x2="493" y2="134" class="e" :marker-end="`url(#${id})`" />
      <line x1="644" y1="134" x2="679" y2="134" class="e" :marker-end="`url(#${id})`" />
    </g>
    <!-- 3. приёмная сторона: проверка и супервизор -->
    <g>
      <rect x="682.75" y="0.75" width="224.5" height="262" rx="14" class="frame" />
      <text x="698" y="22" class="t-head t-sec">ТОЧКА БОБА</text>
      <rect x="698" y="36" width="194" height="98" rx="10" class="n-lilac" />
      <text x="795" y="59" text-anchor="middle" class="t-big t-ink">Проверка хоста</text>
      <text x="795" y="80" text-anchor="middle" class="t-ink-sec">подписи по ростеру</text>
      <text x="795" y="99" text-anchor="middle" class="t-ink-sec">политика подписей</text>
      <text x="795" y="118" text-anchor="middle" class="t-ink-sec">аренда · срок · дубли</text>
      <line x1="795" y1="134" x2="795" y2="161" class="e" :marker-end="`url(#${id})`" />
      <rect x="698" y="164" width="194" height="54" rx="10" class="n" />
      <text x="795" y="186" text-anchor="middle" class="t-big">Супервизор</text>
      <text x="795" y="205" text-anchor="middle" class="t-sec">стоп исполнителя</text>
      <text x="698" y="244" class="t-cap t-sec">квитанция → отправителю</text>
    </g>
    <!-- 4. главное правило -->
    <g>
      <rect x="0.75" y="292" width="906.5" height="36" rx="10" class="n-wait" />
      <text x="18" y="315" class="t-cap">Изменённый байт ломает все подписи. Ключ исполнителя не подпишет coord или cmd ни через одну трубу.</text>
    </g>
  </svg>
</template>
