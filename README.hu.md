# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Verzió: 1.8.0 · Utolsó frissítés: 2026-11-15

Lépésről lépésre működő dekóder és kódoló a **Voyager Aranylemezhez** (Voyager Interstellar Record). Egyetlen HTML-fájl (`index.html`), külső függőségek, szerver és követők nélkül. Offline működik: elég megnyitni a fájlt egy böngészőben.

Az alkalmazás **8 nyelven** érhető el (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). A nyelvet az oldal tetején lévő gombokkal választhatod ki; a választás megmarad, az `index.html?lang=de` pedig közvetlenül az adott nyelven nyitja meg az oldalt.

## Mit tud

Az alkalmazásnak 12 számozott lépése és egy élő nyitólépése van:

1. **A lemez és a borító**: interaktív ábra, érinthető területekkel.
2. **Sebesség**: a 16⅔ rpm összevetése más sebességekkel, és a hatás egy sor időtartamára.
3. **A hidrogénóra**: az 1420,405751768 MHz-es átmenet (periódus ≈ 0,704 ns) és egy bináris → idő átváltó.
4. **A pulzártérkép**: periódus másodpercben → a hidrogénegységek bináris száma.
5. **Egy kép jele**: 512 sor × 8 ms × 384 minta 48 kHz-en; meghallgatás és WAV-export.
6. **Kalibrálás a körrel**: a sorhossz automatikus becslése, a kör kerekségével finomítva.
7. **Dekódolás soronként**: animáció, állítható sebesség, sávzaj.
8. **Szín**: három kocka, R, G, B.
9. **Saját fájl**: hangfelvétel betöltése és helyi dekódolása (csatorna, kezdet, L, függőleges eltolás, színmód, PNG-export).
10. **Közreműködés**: bárki küldhet írott üdvözletet, képet vagy hangüzenetet (legfeljebb 15 mp) `.json` csomagként. A böngészőből magától semmi sem távozik. A `…/index.html#contribute` cím közvetlenül erre a lépésre nyílik.
11. **Kódolás 2026–2027**: egy most indított szonda lemezének elkészítése. A képekből (kalibráló körrel és szövegoldallal) 48 kHz-es WAV lesz; moderálás után importálhatod a közönség hozzájárulásait; zenei sávot csak kitöltött jogi adatlappal adhatsz hozzá; exportálhatod a WAV-ot, egy indexet, a borítóra szánt számokat és a pulzárok periódusait az indítás dátumán.
12. **Az eredeti lemez (1977)**: a 27 zeneszám, az 55 nyelv, a képek, az üzenetek és a szerzői jogi helyzet.

◉ **Voyager ma** (ezzel nyílik meg az alkalmazás): a Voyager 1 Földtől mért távolsága valós időben, visszaszámlálással az egy fénynapos küszöbig (2026. november 18., 10:16:07 UTC), 24 fényórás számlappal, az „üzenet sugara” idővonallal, és km, CSE, fénynap vagy fényidő egységekkel. Hálózat nélkül számolja egy közzétett támpontokra kalibrált modell; a JPL Horizonstól való eltérését nem mértük meg, a Voyager 2 pedig durvább becslés (±1 CSE). Az 1. lépésben hozzáférhető jelmagyarázat is van a borítódiagramhoz, a 11. lépés pedig **PNG képeslapot** exportálhat a kódolt lemezről.

Az 1.3.0 újdonságai: forgó lemez a 2. lépésben (egy sor mindig a barázda 0,8°-át foglalja; egy kép 1,14 fordulat), hallható pulzárok a 4. lépésben (kattanások a valódi periódussal), „Grand Tour” skála az élő lépésben (bolygók, az 1990-es Pale Blue Dot, a két szonda lökéshullám-határa és heliopauzája), négy felvonásból álló sáv a lépésnavigáció fölött, valamint PWA (manifeszt, service worker, ikonok), amely https-en kiszolgálva telepíthető és offline is működik; egyetlen fájlként megnyitva pontosan úgy viselkedik, mint korábban. Az új `tools/csp-hash.py` újraszámolja a CSP-hash-eket a beágyazott szkript bármilyen módosítása után, az `npm run test:pwa` pedig offline ellenőrzi a service workert.

Az 1.4.0 látványos linkelőnézeteket ad: Open Graph és Twitter Card címkék 1200×630-as képpel (`og-image.jpg`), kanonikus hivatkozás és schema.org adatok, hogy a link jól mutasson WhatsAppon, Telegramon, Facebookon, X-en, LinkedInen és máshol. A címkék a `https://brazda.chiuta.ro/` címre mutatnak (lásd `CNAME`); az előnézet akkor működik, ha az oldalt erről a címről szolgálják ki. A `tools/fff-hash.py` módosítások után frissíti a kanonikus hash-t és a méretet.

Az 1.5.0 megosztás gombokat ad minden lépés aljára: WhatsApp, Telegram, Facebook, X, LinkedIn, Reddit, e-mail, az eszköz natív megosztómenüje (ahol van) és „Link másolása”. Mindegyik csak a kiválasztott alkalmazást vagy oldalt nyitja meg kész linkkel; a BRAZDA magától nem küld semmit. Ha az előnézet nem jelenik meg, az oldalt még nem a `https://brazda.chiuta.ro/` címről szolgálják ki (kapcsold be a GitHub Pagest: Settings → Pages → `main` ág, gyökérmappa), vagy a hálózat még régi előnézetet tart a gyorsítótárban (frissítsd a Facebook Sharing Debuggerrel).

Az 1.6.0 kompaktabbá teszi a felületet asztali gépen, tableten és telefonon (vékonyabb fejléc, szorosabb kártyák, széles képernyőn két oszlop a „Voyager ma” lépésben), és hozzáad egy lebegő „vissza a tetejére” gombot, egy hozzáférhetőségi panelt (szövegméret 85–160 %, magas kontraszt, animációk nélkül, olvasható szöveg tágabb térközzel, aláhúzott linkek erős fókusszal, valamint az aktuális lépés felolvasása a böngésző beszédszintézisével), egy „Ugrás a tartalomra” linket, és figyelembe veszi a rendszer csökkentett mozgás és magas kontraszt beállításait. A választások csak az eszközödön maradnak.

Az 1.8.0 hozzáadja „A kulcsok története” részt (hat rövid magyarázat Adrian Bănuță „Citind în stele” cikke alapján, „Misiunea Voyager – 50 de ani” rovat, saját szavainkkal), két hivatalos NASA/JPL fényképet a lemezről és borítójáról, valamint a Voyager 1-nek küldött „halló” kétnapos késését.

## Szerzői jog és zene

Az alkalmazás **nem tartalmaz** zenét és védett felvételt. A 11. lépés zenei sávjához általad megadott fájl, a jogtulajdonosok és egy licenc-hivatkozás szükséges. Tisztázatlan jogú szám nem adható hozzá.

A „Here Comes the Sun” (Beatles) példa éppen azért szerepel kezdő adatlapként, mert jól mutatja a problémát: a szám védett, és a Beatles eredeti felvételéhez licenc kell mind a szerzeményre, mind a felvételre. Saját előadáshoz elég a szerzemény licence. A részletek és a források a 12. lépésben találhatók.

Ez nem jogi tanácsadás.

## Ismert korlátok

- **Az 1–8. lépés képei sematikusak**, az alkalmazásban készülnek; nem a NASA képei. A valódi képekhez használd a 9. lépést a lemez egy felvételének hangszakaszával.
- **Valódi felvétel dekódolását nem teszteltük**, mert a tárolóban nincs valódi fájl. A módszer szintetikus jeleken igazolt; szükség lehet kézi hangolásra (kezdet, L, függőleges eltolás).
- Az **automatikus kalibrálás** két szakaszból áll. Az autokorrelációs becslés kb. 1 minta pontossággal adja meg L-t, ami 512 oszlopon látható dőlést jelent. Csak a kör szerinti finomítás éri el a kb. 0,002-t. A periodikus képek (sakktábla, átlós csíkok) és a tiszta hangok természetüknél fogva kétértelműek.
- **A pulzárok periódusai** (11. lépés) hozzávetőleges referenciaértékekből vannak lineárisan extrapolálva. Valódi lemezhez használd mind a 14 pulzár ATNF-katalógusban szereplő mért periódusait.
- **A „Föld hangjai” lista** a 12. lépésben emlékezetből készült, és a NASA forrásaival ellenőrizni kell. A jogi besorolás (A–D) tájékoztató jellegű, a szerző saját besorolása.
- **Memória**: egy nagy kódolás sok memóriát igényel. A határ asztali gépen 160, érintőképernyős eszközön 60 kocka.
- **Fordítások**: a román szöveg az eredeti; a többi nyelv gépi fordítással készült, anyanyelvi beszélők nem ellenőrizték.
- Csak **Chromiumban** tesztelve (Playwright). A Safarit és a Firefoxot nem próbáltuk; a mikrofonos felvételt csak szimulált hangeszközzel próbáltuk ki.

## Tesztek

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

A böngészős teszt minden méretnél ellenőrzi: az összes lépést, a vízszintes túlcsordulást, az érintési célpontok méretét, a JS-hibákat, a sérült hang- és képfájlokat, a rosszindulatú hozzájárulási csomagokat (XSS, 0 vagy hatalmas frekvenciájú WAV, csonkolt base64, prototípus-szennyezés), a szélsőséges mezőértékeket, a kódolást PSNR-ellenőrzéssel és a jogok nélküli sávok blokkolását.

## Fordítás

A szövegek az `i18n/<lang>.json` fájlokban vannak (a román fájl a forrás). Szerkesztés után futtasd a `python3 tools/build-i18n.py` parancsot, hogy beágyazza őket az `index.html` fájlba; az `npm run test:i18n` ellenőrzi, hogy minden nyelvben megvan minden kulcs, azonos helyőrzőkkel és azonos beágyazott jelöléssel.

## Biztonság és adatvédelem

Minden a böngészőben marad. Az oldal CSP-je tilt minden hálózati kapcsolatot (`connect-src 'none'`). A hozzájárulások olyan fájlok, amelyeket a felhasználó maga küld el; a gyűjtési cím az `index.html` fájlban lévő `COLLECT_EMAIL` konstans.

## Források

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Hivatalos részletek a lemezről: NASA/JPL.

## Támogatás

Ha hasznos számodra a projekt: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licenc

MIT. Lásd a `LICENSE` fájlt.
