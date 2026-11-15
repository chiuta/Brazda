# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 1.8.0 · Letzte Aktualisierung: 2026-11-15

Ein Schritt-für-Schritt-Decoder und -Encoder für die **Voyager Golden Record** (Voyager Interstellar Record). Eine HTML-Datei (`index.html`), keine externen Abhängigkeiten, kein Server, keine Tracker. Sie funktioniert offline: Die Datei einfach im Browser öffnen.

Die App ist in **8 Sprachen** verfügbar (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Die Sprache wird über die Schaltflächen oben auf der Seite gewählt; die Wahl wird gespeichert, und `index.html?lang=de` öffnet direkt eine bestimmte Sprache.

## Was sie kann

Die App hat 12 nummerierte Schritte und einen Live-Einstiegsschritt:

1. **Die Platte und ihre Hülle**: ein interaktives Diagramm mit antippbaren Zonen.
2. **Geschwindigkeit**: 16⅔ rpm im Vergleich zu anderen Geschwindigkeiten und die Auswirkung auf die Dauer einer Zeile.
3. **Die Wasserstoffuhr**: der Übergang bei 1420,405751768 MHz (Periode ≈ 0,704 ns) und ein Umrechner binär → Zeit.
4. **Die Pulsarkarte**: Periode in Sekunden → Binärzahl in Wasserstoff-Einheiten.
5. **Das Signal eines Bildes**: 512 Zeilen × 8 ms × 384 Samples bei 48 kHz; anhören und als WAV exportieren.
6. **Kalibrierung mit dem Kreis**: automatische Schätzung der Zeilenlänge, verfeinert durch die Rundheit des Kreises.
7. **Zeile-für-Zeile-Dekodierung**: Animation, einstellbare Geschwindigkeit, Spurrauschen.
8. **Farbe**: drei Frames, R, G, B.
9. **Deine eigene Datei**: eine Audioaufnahme laden und lokal dekodieren (Kanal, Anfang, L, vertikale Verschiebung, Farbmodus, PNG-Export).
10. **Beitragen**: Jeder kann einen schriftlichen Gruß, ein Bild oder eine Sprachnachricht (bis zu 15 s) als `.json`-Paket senden. Nichts verlässt den Browser von selbst. Die Adresse `…/index.html#contribute` öffnet diesen Schritt direkt.
11. **Codierung 2026–2027**: die Platte einer Sonde bauen, die jetzt startet. Bilder (mit einem Kalibrierkreis und einer Textseite) werden zu einer WAV-Datei mit 48 kHz; die Beiträge der Öffentlichkeit werden nach der Moderation importiert; eine Musikspur kann hinzugefügt werden, aber nur mit einem ausgefüllten Rechteblatt; exportiert werden die WAV-Datei, ein Index, die Zahlen für die Hülle und die Pulsarperioden zum Startdatum.
12. **Die Originalplatte (1977)**: die 27 Musikstücke, die 55 Sprachen, die Bilder, die Botschaften und die urheberrechtliche Lage.

◉ **Voyager heute** (öffnet die App): die Entfernung von Voyager 1 zur Erde in Echtzeit, mit Countdown bis zur Schwelle von einem Lichttag (18. November 2026, 10:16:07 UTC), einem Zifferblatt mit 24 Lichtstunden, der Zeitleiste „Strahl einer Nachricht“ und Einheiten in km, AE, Lichttagen oder Lichtzeit. Die Berechnung läuft offline aus einem an veröffentlichten Eckdaten kalibrierten Modell; die Abweichung von JPL Horizons wurde nicht gemessen, und Voyager 2 ist eine gröbere Schätzung (±1 AE). Schritt 1 hat außerdem eine barrierefreie Legende für das Hüllendiagramm, und Schritt 11 kann eine **Postkarte als PNG** der kodierten Scheibe exportieren.

1.3.0 ergänzt: eine sich drehende Scheibe in Schritt 2 (eine Zeile nimmt immer 0,8° der Rille ein; ein Bild sind 1,14 Umdrehungen), hörbare Pulsare in Schritt 4 (Klicks in der echten Periode), eine „Grand Tour“-Skala im Live-Schritt (Planeten, der Pale Blue Dot von 1990, Termination Shocks und Heliopausen beider Sonden), eine Leiste mit vier Akten über der Schrittnavigation und eine PWA (Manifest, Service Worker, Icons), die sich installieren lässt und offline funktioniert, wenn die App über https ausgeliefert wird; als einzelne Datei geöffnet verhält sie sich wie bisher. Das neue `tools/csp-hash.py` berechnet die CSP-Hashes nach jeder Änderung des Inline-Skripts neu, und `npm run test:pwa` prüft den Service Worker offline.

1.4.0 ergänzt ansprechende Link-Vorschauen: Open-Graph- und Twitter-Card-Tags mit einem 1200×630-Bild (`og-image.jpg`), kanonischem Link und schema.org-Daten, damit der Link in WhatsApp, Telegram, Facebook, X, LinkedIn und anderen gut aussieht. Die Tags verweisen auf `https://brazda.chiuta.ro/` (siehe `CNAME`); die Vorschau funktioniert, sobald die Seite unter dieser Adresse ausgeliefert wird. `tools/fff-hash.py` aktualisiert nach Änderungen den kanonischen Hash und die Größe.

1.5.0 ergänzt Teilen-Schaltflächen am Ende jedes Schritts: WhatsApp, Telegram, Facebook, X, LinkedIn, Reddit, E-Mail, das native Teilen-Menü des Geräts (falls vorhanden) und „Link kopieren“. Jede öffnet nur die gewählte App oder Seite mit fertigem Link; BRAZDA sendet nichts selbst. Erscheint die Vorschau nicht, wird die Seite noch nicht unter `https://brazda.chiuta.ro/` ausgeliefert (GitHub Pages aktivieren: Settings → Pages → Branch `main`, Ordner Root) oder das Netzwerk hält noch eine alte Vorschau im Cache (mit dem Facebook Sharing Debugger auffrischen).

1.6.0 macht die Oberfläche auf Desktop, Tablet und Smartphone kompakter (schlankere Kopfzeile, engere Karten, zwei Spalten bei „Voyager heute“ auf breiten Bildschirmen) und ergänzt eine schwebende „Nach oben“-Schaltfläche, ein Barrierefreiheits-Panel (Textgröße 85–160 %, hoher Kontrast, keine Animationen, gut lesbarer Text mit weitem Abstand, unterstrichene Links mit starkem Fokus und Vorlesen des aktuellen Schritts über die Sprachausgabe des Browsers), einen Link „Zum Inhalt springen“ und die Beachtung der Systemeinstellungen für reduzierte Bewegung und hohen Kontrast. Die Auswahl bleibt nur auf deinem Gerät.

1.8.0 ergänzt „Die Geschichte der Schlüssel“ (sechs kurze Erklärungen nach dem Artikel „Citind în stele“ von Adrian Bănuță, Rubrik „Misiunea Voyager – 50 de ani“, in eigenen Worten), zwei offizielle NASA/JPL-Fotos der Scheibe und ihrer Hülle sowie die zwei Tage Verzögerung für ein „Hallo“ an Voyager 1.

## Urheberrecht und Musik

Die App **enthält keine** Musik und keine geschützte Aufnahme. Die Musikspur in Schritt 11 braucht eine Datei, die man selbst bereitstellt, dazu die Rechteinhaber und eine Lizenzreferenz. Ein Stück mit ungeklärten Rechten kann nicht hinzugefügt werden.

Das Beispiel „Here Comes the Sun“ (Beatles) liegt als Starterblatt bei, gerade weil es das Problem zeigt: Das Lied ist geschützt, und für die Originalaufnahme der Beatles braucht man eine Lizenz für die Komposition und für die Aufnahme. Für eine eigene Interpretation genügt die Lizenz der Komposition. Details und Quellen stehen in Schritt 12.

Dies ist keine Rechtsberatung.

## Bekannte Einschränkungen

- **Die Bilder in den Schritten 1–8 sind schematisch**, in der App erzeugt; es sind nicht die Bilder der NASA. Für die echten Bilder Schritt 9 mit einem Audioabschnitt aus einer Aufnahme der Platte verwenden.
- **Die Dekodierung einer echten Aufnahme wurde nicht getestet**, da im Repository keine echte Datei liegt. Die Methode ist an synthetischen Signalen überprüft; manuelles Feintuning (Anfang, L, vertikale Verschiebung) kann nötig sein.
- **Die automatische Kalibrierung** hat zwei Stufen. Die Schätzung per Autokorrelation liefert L mit einer Genauigkeit von ~1 Sample, was über 512 Spalten eine sichtbare Schräglage bedeutet. Erst die Verfeinerung am Kreis erreicht ~0,002. Periodische Bilder (Schachbretter, diagonale Streifen) und reine Töne sind von Natur aus mehrdeutig.
- **Die Pulsarperioden** (Schritt 11) werden linear aus ungefähren Referenzwerten extrapoliert. Für eine echte Platte die gemessenen Perioden aller 14 Pulsare aus dem ATNF-Katalog verwenden.
- **Die Liste „Klänge der Erde“** in Schritt 12 stammt aus dem Gedächtnis und muss anhand der NASA-Quellen überprüft werden. Die Einstufung der Rechte (A–D) ist nur ein Anhaltspunkt und stammt vom Autor selbst.
- **Speicher**: Eine große Codierung braucht viel Speicher. Das Limit liegt bei 160 Frames auf dem Desktop und 60 auf Touch-Geräten.
- **Übersetzungen**: Der rumänische Text ist das Original; die anderen Sprachen wurden maschinell übersetzt und nicht von Muttersprachlern geprüft.
- Nur in **Chromium** getestet (Playwright). Safari und Firefox wurden nicht ausprobiert; die Mikrofonaufnahme wurde nur mit einem simulierten Audiogerät ausprobiert.

## Tests

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

Der Browsertest prüft bei jeder Größe: alle Schritte, horizontalen Überlauf, Größe der Touch-Ziele, JS-Fehler, beschädigte Audio- und Bilddateien, bösartige Beitragspakete (XSS, WAV mit Frequenz 0 oder riesig, abgeschnittenes Base64, Prototype Pollution), extreme Feldwerte, Codierung mit PSNR-Prüfung und das Blockieren von Spuren ohne Rechte.

## Übersetzen

Die Texte liegen in `i18n/<lang>.json` (die rumänische Datei ist die Quelle). Nach dem Bearbeiten `python3 tools/build-i18n.py` ausführen, um sie in `index.html` einzubetten; `npm run test:i18n` prüft, dass jede Sprache jeden Schlüssel hat, mit denselben Platzhaltern und demselben Inline-Markup.

## Sicherheit und Datenschutz

Alles bleibt im Browser. Die Seite hat eine CSP, die jede Netzwerkverbindung verbietet (`connect-src 'none'`). Beiträge sind Dateien, die der Nutzer selbst versendet; die Sammeladresse ist die Konstante `COLLECT_EMAIL` in `index.html`.

## Quellen

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Offizielle Details zur Platte: NASA/JPL.

## Unterstützung

Wenn das Projekt nützlich ist: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Lizenz

MIT. Siehe `LICENSE`.
