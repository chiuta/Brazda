# Jurnal de modificări — BRAZDA

## 1.8.2 — 2026-11-19

- Butoanele de navigare ale pașilor (pe ecrane late, ≥ 900 px) au acum cel puțin 24 px înălțime, față de 22 px, conform dimensiunii minime a țintei din WCAG 2.2 (criteriul 2.5.8) (constatat de bateria adversarială din 19 noiembrie 2026)

## 1.8.1 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.
