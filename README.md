# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 1.1.4 · Last updated: 2026-11-10

A step-by-step decoder and encoder for the **Voyager Golden Record** (Voyager Interstellar Record). One HTML file (`index.html`), no external dependencies, no server, no trackers. It works offline: open the file in a browser.

The app is available in **8 languages** (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Pick the language with the buttons at the top of the page; the choice is remembered, and `index.html?lang=de` opens a given language directly.

## What it does

The app has 12 steps:

1. **The disc and its cover**: an interactive diagram with zones you can tap.
2. **Speed**: 16⅔ rpm compared with other speeds, and the effect on the duration of a line.
3. **The hydrogen clock**: the 1420.405751768 MHz transition (period ≈ 0.704 ns) and a binary → time converter.
4. **The pulsar map**: period in seconds → binary number of hydrogen units.
5. **The signal of an image**: 512 lines × 8 ms × 384 samples at 48 kHz; listen and export WAV.
6. **Calibration with the circle**: automatic estimate of the line length, refined by the roundness of the circle.
7. **Line-by-line decoding**: animation, adjustable speed, track noise.
8. **Colour**: three frames, R, G, B.
9. **Your own file**: load an audio recording and decode it locally (channel, start, L, vertical shift, colour mode, PNG export).
10. **Contribute**: anyone can send a written greeting, an image or a voice message (up to 15 s) as a `.json` package. Nothing leaves the browser by itself. The address `…/index.html#contribute` opens this step directly.
11. **Encoding 2026–2027**: build the disc of a probe launched now. Images (with a calibration circle and a text page) become a 48 kHz WAV; you import the public's contributions after moderation; you can add a music track, only with a completed rights sheet; you export the WAV, an index, the numbers for the cover and the pulsar periods at the launch date.
12. **The original disc (1977)**: the 27 pieces of music, the 55 languages, the images, the messages and the copyright situation.

## Copyright and music

The app **contains no** music and no protected recording. The music track in step 11 needs a file that you provide, plus the rights holders and a licence reference. A track with unclear rights cannot be added.

The example "Here Comes the Sun" (Beatles) is included as a starter sheet precisely because it shows the problem: the song is protected, and for the original Beatles recording you need a licence for both the composition and the recording. For your own performance you only need the composition licence. Details and sources are in step 12.

This is not legal advice.

## Known limitations

- **The images in steps 1–8 are schematic**, generated in the app; they are not the NASA images. For the real images use step 9 with an audio segment from a recording of the disc.
- **Decoding of a real recording has not been tested**, because there is no real file in the repository. The method is verified on synthetic signals; manual tuning (start, L, vertical shift) may be needed.
- **Automatic calibration** has two stages. The autocorrelation estimate gives L with a precision of ~1 sample, which means a visible tilt across 512 columns. Only the circle refinement reaches ~0.002. Periodic images (checkerboards, diagonal stripes) and pure tones are ambiguous by nature.
- **The pulsar periods** (step 11) are extrapolated linearly from approximate reference values. For a real disc use the measured periods of all 14 pulsars from the ATNF catalogue.
- **The "Sounds of Earth" list** in step 12 is from memory and must be checked against NASA sources. The rights classification (A–D) is indicative and is the author's own.
- **Memory**: a large encoding needs a lot of memory. The limit is 160 frames on desktop and 60 on touch devices.
- **Translations**: the Romanian text is the original; the other languages were produced by machine translation and have not been reviewed by native speakers.
- Tested only in **Chromium** (Playwright). Safari and Firefox were not tried; microphone recording was only tried with a simulated audio device.

## Tests

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

The browser test checks, at each size: all the steps, horizontal overflow, size of touch targets, JS errors, corrupt audio and image files, malicious contribution packages (XSS, WAV with frequency 0 or huge, truncated base64, prototype pollution), extreme field values, encoding with a PSNR check and the blocking of tracks without rights.

## Translating

The texts live in `i18n/<lang>.json` (the Romanian file is the source). After editing, run `python3 tools/build-i18n.py` to embed them in `index.html`; `npm run test:i18n` checks that every language has every key, with the same placeholders and the same inline markup.

## Security and privacy

Everything stays in the browser. The page has a CSP that forbids any network connection (`connect-src 'none'`). Contributions are files that the user sends on their own; the collection address is the `COLLECT_EMAIL` constant in `index.html`.

## Sources

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Official details about the disc: NASA/JPL.

## Support

If the project is useful to you: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licence

MIT. See `LICENSE`.
