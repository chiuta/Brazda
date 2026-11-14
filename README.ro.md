# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 1.3.0 · Ultima actualizare: 2026-11-14

Decodor și codor, pas cu pas, pentru **Discul de Aur Voyager** (Voyager Interstellar Record). Un singur fișier HTML (`index.html`), fără dependențe externe, fără server, fără urmăritoare. Funcționează offline: deschide fișierul într-un browser.

Aplicația există în **8 limbi** (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Alege limba din butoanele de sus; alegerea se ține minte, iar `index.html?lang=de` deschide direct o anumită limbă.

## Ce face

Aplicația are 12 pași numerotați și un pas viu de deschidere:

1. **Discul și capacul**: schemă interactivă cu zone pe care le atingi.
2. **Viteza**: 16⅔ rpm față de alte viteze, cu efectul asupra duratei unei linii.
3. **Ceasul hidrogenului**: tranziția de 1420,405751768 MHz (perioadă ≈ 0,704 ns) și convertor binar → timp.
4. **Harta pulsarilor**: perioadă în secunde → număr binar de unități-hidrogen.
5. **Semnalul unei imagini**: 512 linii × 8 ms × 384 eșantioane la 48 kHz; ascultare și export WAV.
6. **Calibrarea cu cercul**: estimare automată a lungimii liniei, rafinată după rotunjimea cercului.
7. **Decodare linie cu linie**: animație, viteză reglabilă, zgomot de pistă.
8. **Culoarea**: trei cadre R, G, B.
9. **Fișierul tău**: încarci o înregistrare audio și o decodezi local (canal, început, L, deplasare verticală, mod color, export PNG).
10. **Contribuie**: oricine poate trimite o salutare scrisă, o imagine sau un mesaj vocal (până la 15 s), ca pachet `.json`. Nimic nu pleacă singur din browser. Adresa `…/index.html#contribuie` deschide direct acest pas.
11. **Codare 2026–2027**: construiești discul unei sonde lansate acum. Imaginile (cu cerc de calibrare și pagină de text) devin un WAV de 48 kHz; importi contribuțiile publicului după moderare; poți adăuga o pistă muzicală, doar cu fișa drepturilor completată; exporți WAV, index, numere pentru capac și perioadele pulsarilor la data lansării.
12. **Discul original (1977)**: cele 27 de piese, cele 55 de limbi, imaginile, mesajele și situația drepturilor de autor.

◉ **Voyager azi** (deschide aplicația): distanța lui Voyager 1 față de Pământ în timp real, cu numărătoare inversă până la pragul de o zi-lumină (18 noiembrie 2026, 10:16:07 UTC), cadran de 24 de ore-lumină, axa „razei unui mesaj” și unități în km, UA, zile-lumină sau timp-lumină. E calculată offline dintr-un model calibrat pe repere publicate; abaterea față de JPL Horizons nu a fost măsurată, iar Voyager 2 e o estimare mai grosieră (±1 UA). Pasul 1 are și o legendă accesibilă pentru diagrama capacului, iar pasul 11 poate exporta o **carte poștală PNG** a discului codat.

1.3.0 adaugă: un disc rotitor în pasul 2 (o linie ocupă mereu 0,8° din șanț; o imagine înseamnă 1,14 rotații), pulsari audibili în pasul 4 (pocnituri la perioada reală), o scară „Marele Tur” în pasul viu (planete, Pale Blue Dot din 1990, șocurile terminale și heliopauzele celor două sonde), o bară de patru acte deasupra navigării pe pași și un PWA (manifest, service worker, icoane) care se instalează și merge offline când aplicația e servită prin https; deschisă ca fișier unic se comportă exact ca înainte. Noul `tools/csp-hash.py` recalculează hash-urile CSP după orice modificare a scriptului inline, iar `npm run test:pwa` verifică service worker-ul offline.

## Drepturi de autor și muzică

Aplicația **nu conține** nicio piesă muzicală și nicio înregistrare protejată. Pista muzicală din pasul 11 cere un fișier pe care îl furnizezi tu, plus titularii drepturilor și o referință la licență. O piesă cu drepturi neclare nu poate fi adăugată.

Exemplul „Here Comes the Sun” (Beatles) e inclus ca fișă de pornire, tocmai pentru că arată problema: piesa e protejată, iar pentru originalul Beatles trebuie licență atât pentru compoziție, cât și pentru înregistrare. Pentru o interpretare proprie e nevoie doar de licența compoziției. Detaliile și sursele sunt în pasul 12.

Nu e consultanță juridică.

## Limite cunoscute

- **Imaginile din pașii 1–8 sunt schematice**, generate în aplicație; nu sunt imaginile NASA. Pentru imaginile reale folosește pasul 9 cu un segment audio din înregistrarea discului.
- **Decodarea pe o înregistrare reală nu a fost testată**, pentru că nu există un fișier real în depozit. Metoda e verificată pe semnale sintetice; poate fi nevoie de reglaj manual (început, L, deplasare verticală).
- **Calibrarea automată** are două trepte. Estimarea din autocorelație dă L cu precizie de ~1 eșantion, ceea ce înseamnă o înclinare vizibilă pe 512 de coloane. Doar rafinarea după cerc ajunge la ~0,002. Imaginile periodice (șah, dungi diagonale) și tonurile pure sunt ambigue prin natura lor.
- **Perioadele pulsarilor** (pasul 11) sunt extrapolate liniar din valori aproximative de referință. Pentru un disc real folosește perioadele măsurate pentru toți cei 14 pulsari din catalogul ATNF.
- **Lista „Sunetele Pământului”** din pasul 12 e după memorie, de verificat în sursele NASA. Clasificarea drepturilor (A–D) e orientativă și aparține autorului aplicației.
- **Memorie**: o codare mare cere multă memorie. Limita e 160 de cadre pe desktop și 60 pe dispozitive tactile.
- **Traduceri**: textul în română e cel original; celelalte limbi au fost produse prin traducere automată și nu au fost revizuite de vorbitori nativi.
- Testat doar în **Chromium** (Playwright). Safari și Firefox nu au fost încercate; înregistrarea cu microfonul a fost încercată doar cu un dispozitiv audio simulat.

## Teste

```bash
npm install            # doar pentru testele cu browser
npm run test:unit      # verificări fără browser
npm run test:e2e       # Playwright, 5 dimensiuni de ecran (320 px – 1920 px)
npm run test:i18n      # chei, substituenți și marcaje identice în cele 8 limbi
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

Testul cu browser verifică, pe fiecare dimensiune: toți pașii, depășirile orizontale, mărimea țintelor tactile, erorile JS, fișiere audio și imagini corupte, pachete de contribuție rău-intenționate (XSS, WAV cu frecvență 0 sau uriașă, base64 trunchiat, poluare de prototip), valori extreme în câmpuri, codarea cu verificare PSNR și blocarea pistelor fără drepturi.

## Traducere

Textele sunt în `i18n/<limbă>.json` (fișierul românesc e sursa). După modificări, rulează `python3 tools/build-i18n.py` ca să le înglobezi în `index.html`; `npm run test:i18n` verifică ca fiecare limbă să aibă toate cheile, cu aceiași substituenți și același marcaj.

## Securitate și confidențialitate

Tot procesul rămâne în browser. Pagina are o politică CSP care interzice orice conexiune de rețea (`connect-src 'none'`). Contribuțiile sunt fișiere pe care utilizatorul le trimite singur; adresa de colectare e constanta `COLLECT_EMAIL` din `index.html`.

## Surse

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Detalii oficiale despre disc: NASA/JPL.

## Susținere

Dacă proiectul îți e util: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licență

MIT. Vezi `LICENSE`.
