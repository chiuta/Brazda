# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 1.2.0 · Ultimo aggiornamento: 2026-11-14

Un decodificatore e codificatore passo dopo passo per il **Voyager Golden Record** (Voyager Interstellar Record, il Disco d'Oro). Un unico file HTML (`index.html`), senza dipendenze esterne, senza server, senza tracciamento. Funziona offline: apri il file in un browser.

L'app è disponibile in **8 lingue** (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Scegli la lingua con i pulsanti in cima alla pagina; la scelta viene ricordata, e `index.html?lang=de` apre direttamente una data lingua.

## Che cosa fa

L'app ha 12 passi numerati e un passo iniziale dal vivo:

1. **Il disco e la copertina**: un diagramma interattivo con zone che puoi toccare.
2. **La velocità**: 16⅔ rpm a confronto con altre velocità, e l'effetto sulla durata di una riga.
3. **L'orologio dell'idrogeno**: la transizione a 1420,405751768 MHz (periodo ≈ 0,704 ns) e un convertitore binario → tempo.
4. **La mappa dei pulsar**: periodo in secondi → numero binario di unità-idrogeno.
5. **Il segnale di un'immagine**: 512 righe × 8 ms × 384 campioni a 48 kHz; ascolta ed esporta in WAV.
6. **Calibrazione con il cerchio**: stima automatica della lunghezza della riga, affinata in base alla rotondità del cerchio.
7. **Decodifica riga per riga**: animazione, velocità regolabile, rumore di traccia.
8. **Il colore**: tre fotogrammi, R, G, B.
9. **Il tuo file**: carica una registrazione audio e decodificala in locale (canale, inizio, L, spostamento verticale, modalità colore, esportazione PNG).
10. **Contribuisci**: chiunque può inviare un saluto scritto, un'immagine o un messaggio vocale (fino a 15 s) come pacchetto `.json`. Nulla lascia il browser da solo. L'indirizzo `…/index.html#contribute` apre direttamente questo passo.
11. **Codifica 2026–2027**: costruisci il disco di una sonda lanciata ora. Le immagini (con un cerchio di calibrazione e una pagina di testo) diventano un WAV a 48 kHz; importi i contributi del pubblico dopo la moderazione; puoi aggiungere una traccia musicale, solo con una scheda dei diritti compilata; esporti il WAV, un indice, i numeri per la copertina e i periodi dei pulsar alla data di lancio.
12. **Il disco originale (1977)**: i 27 brani musicali, le 55 lingue, le immagini, i messaggi e la situazione del diritto d'autore.

◉ **Voyager oggi** (apre l’app): la distanza di Voyager 1 dalla Terra in tempo reale, con conto alla rovescia fino alla soglia di un giorno-luce (18 novembre 2026, 10:16:07 UTC), un quadrante di 24 ore-luce, la linea del «raggio di un messaggio» e unità in km, UA, giorni-luce o tempo-luce. Il calcolo è offline, da un modello calibrato su riferimenti pubblicati; lo scarto da JPL Horizons non è stato misurato e Voyager 2 è una stima più grossolana (±1 UA). Il passo 1 ha anche una legenda accessibile per il diagramma della copertina, e il passo 11 può esportare una **cartolina PNG** del disco codificato.

## Diritto d'autore e musica

L'app **non contiene** musica né registrazioni protette. La traccia musicale del passo 11 richiede un file che fornisci tu, insieme ai titolari dei diritti e a un riferimento della licenza. Un brano con diritti non chiari non può essere aggiunto.

L'esempio «Here Comes the Sun» (Beatles) è incluso come scheda di partenza proprio perché mostra il problema: il brano è protetto, e per la registrazione originale dei Beatles serve una licenza sia per la composizione sia per la registrazione. Per un'interpretazione propria serve solo la licenza della composizione. Dettagli e fonti sono nel passo 12.

Questa non è una consulenza legale.

## Limiti noti

- **Le immagini dei passi 1–8 sono schematiche**, generate nell'app; non sono le immagini della NASA. Per le immagini reali usa il passo 9 con un segmento audio tratto da una registrazione del disco.
- **La decodifica di una registrazione reale non è stata testata**, perché nel repository non c'è alcun file reale. Il metodo è verificato su segnali sintetici; può servire una regolazione manuale (inizio, L, spostamento verticale).
- **La calibrazione automatica** ha due stadi. La stima per autocorrelazione dà L con una precisione di ~1 campione, il che significa un'inclinazione visibile su 512 colonne. Solo l'affinamento sul cerchio raggiunge ~0,002. Le immagini periodiche (scacchiere, strisce diagonali) e i toni puri sono ambigui per natura.
- **I periodi dei pulsar** (passo 11) sono estrapolati linearmente da valori di riferimento approssimativi. Per un disco reale usa i periodi misurati di tutti e 14 i pulsar dal catalogo ATNF.
- **L'elenco dei «Suoni della Terra»** nel passo 12 è a memoria e va verificato sulle fonti NASA. La classificazione dei diritti (A–D) è indicativa ed è dell'autore.
- **Memoria**: una codifica grande richiede molta memoria. Il limite è 160 fotogrammi su desktop e 60 sui dispositivi touch.
- **Traduzioni**: il testo rumeno è l'originale; le altre lingue sono state prodotte con traduzione automatica e non sono state riviste da madrelingua.
- Testata solo in **Chromium** (Playwright). Safari e Firefox non sono stati provati; la registrazione dal microfono è stata provata solo con un dispositivo audio simulato.

## Test

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

Il test nel browser verifica, a ogni dimensione: tutti i passi, l'overflow orizzontale, la dimensione delle aree touch, gli errori JS, i file audio e immagine corrotti, i pacchetti di contributo malevoli (XSS, WAV con frequenza 0 o enorme, base64 troncato, prototype pollution), valori estremi nei campi, la codifica con verifica del PSNR e il blocco delle tracce senza diritti.

## Traduzione

I testi si trovano in `i18n/<lang>.json` (il file rumeno è la fonte). Dopo la modifica, esegui `python3 tools/build-i18n.py` per incorporarli in `index.html`; `npm run test:i18n` verifica che ogni lingua abbia ogni chiave, con gli stessi segnaposto e lo stesso markup inline.

## Sicurezza e privacy

Tutto resta nel browser. La pagina ha una CSP che vieta qualsiasi connessione di rete (`connect-src 'none'`). I contributi sono file che l'utente invia di propria iniziativa; l'indirizzo di raccolta è la costante `COLLECT_EMAIL` in `index.html`.

## Fonti

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Dettagli ufficiali sul disco: NASA/JPL.

## Sostegno

Se il progetto ti è utile: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licenza

MIT. Vedi `LICENSE`.
