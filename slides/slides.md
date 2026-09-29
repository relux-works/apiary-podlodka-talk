---
routerMode: hash
theme: ../themes/rwb-tech
title: 'От чат-ботов к пасеке'
info: 'Podlodka · Relux Works · Алексей Григорьев и Иван Опарин'
transition: fade
# Slidev preloads slide images by their source path; for ../diagrams/… that
# path 404s in the built deck. The images still load as bundled assets.
preloadImages: false
# v4: corporate logos only on the title slide (see logos below)
themeConfig:
  logo: false
layout: cover
event: 'PODLODKA · RELUX WORKS'
speakers:
  - name: 'Алексей Григорьев'
    role: "Технический руководитель RnD‑разработки (Tech Lead)\nМТС"
  - name: 'Иван Опарин'
    role: "Старший программный инженер\nRWB"
about: 'Вместе представляем проект нашей открытой агентской инфраструктуры Relux Works'
logos:
  - src: /brand/rwb.png
    alt: RWB
    height: 26
  - alt: 'МТС · логотип'
  - src: /brand/relux-works.svg
    alt: Relux Works
    height: 30
---

# От чат-ботов к пасеке: оркестраторы поверх любых агентских сред

<!--
[Для себя] Название под вопросом (бриф v4, 29.09): текущее — плейсхолдер. Три альтернативы на выбор спикерам: (1) «Оркестрация агентов без привязки к вендору». (2) «Как мы вынесли процесс разработки в конфигурацию и отдали его агентам». (3) «Один оркестратор, любые агенты — от одной машины до роя».

[Для себя] Логотип МТС — место под файл: официальный логотип нужен от Алексея, правила стиля для спикеров из разных компаний — у ведущих.

Представляемся оба: Алексей — технический руководитель RnD-разработки (Tech Lead) в МТС, Иван — старший программный инженер в RWB. Вместе мы делаем открытую агентскую инфраструктуру Relux Works, и сегодня показываем её проект.

[Для себя] Тема — rwb-tech, фиолетово-чёрная палитра; с v4 логотипы RWB, МТС и Relux Works только на этом слайде, остальные нейтральные.
-->

---
src: ./parts/0-opening.md
---

---
src: ./parts/1-epochs.md
---

---
src: ./parts/2-board.md
---

---
src: ./parts/3-no-lock-in.md
---

---
src: ./parts/4-context.md
---

---
src: ./parts/5-apiary.md
---

---
src: ./parts/6-swarm.md
---

---
src: ./parts/7-where-we-are.md
---

---
src: ./parts/8-backup.md
---

---
src: ./parts/8a-backup-board.md
---

---
src: ./parts/8b-backup-mechanics.md
---

---
src: ./parts/8c-backup-apiary.md
---

---
src: ./parts/8d-backup-swarm.md
---
