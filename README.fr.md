# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version : 1.1.0 · Dernière mise à jour : 2026-11-06

Un décodeur et codeur pas à pas du **Disque d'or Voyager** (Voyager Interstellar Record). Un seul fichier HTML (`index.html`), sans dépendances externes, sans serveur, sans traqueurs. Il fonctionne hors ligne : ouvre le fichier dans un navigateur.

L'application est disponible en **8 langues** (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Choisis la langue avec les boutons en haut de la page ; le choix est mémorisé, et `index.html?lang=de` ouvre directement une langue donnée.

## Ce qu'elle fait

L'application comporte 12 étapes :

1. **Le disque et sa pochette** : un schéma interactif avec des zones sur lesquelles tu peux appuyer.
2. **La vitesse** : 16⅔ tr/min comparé à d'autres vitesses, et l'effet sur la durée d'une ligne.
3. **L'horloge à hydrogène** : la transition à 1420,405751768 MHz (période ≈ 0,704 ns) et un convertisseur binaire → temps.
4. **La carte des pulsars** : période en secondes → nombre binaire d'unités d'hydrogène.
5. **Le signal d'une image** : 512 lignes × 8 ms × 384 échantillons à 48 kHz ; écoute et exporte en WAV.
6. **Calibrage avec le cercle** : estimation automatique de la longueur de ligne, affinée par la rondeur du cercle.
7. **Décodage ligne par ligne** : animation, vitesse réglable, bruit de piste.
8. **La couleur** : trois trames, R, G, B.
9. **Ton propre fichier** : charge un enregistrement audio et décode-le localement (canal, début, L, décalage vertical, mode couleur, export PNG).
10. **Contribuer** : tout le monde peut envoyer une salutation écrite, une image ou un message vocal (jusqu'à 15 s) sous forme de paquet `.json`. Rien ne quitte le navigateur de lui-même. L'adresse `…/index.html#contribute` ouvre directement cette étape.
11. **Codage 2026–2027** : construis le disque d'une sonde lancée maintenant. Les images (avec un cercle de calibrage et une page de texte) deviennent un WAV de 48 kHz ; tu importes les contributions du public après modération ; tu peux ajouter une piste musicale, uniquement avec une fiche de droits complétée ; tu exportes le WAV, un index, les nombres pour la pochette et les périodes des pulsars à la date de lancement.
12. **Le disque original (1977)** : les 27 morceaux de musique, les 55 langues, les images, les messages et la situation du droit d'auteur.

## Droit d'auteur et musique

L'application **ne contient aucune** musique ni aucun enregistrement protégé. La piste musicale de l'étape 11 nécessite un fichier que tu fournis, ainsi que les titulaires des droits et une référence de licence. Une piste dont les droits sont flous ne peut pas être ajoutée.

L'exemple « Here Comes the Sun » (Beatles) est inclus comme fiche de départ précisément parce qu'il illustre le problème : la chanson est protégée, et pour l'enregistrement original des Beatles il faut une licence à la fois pour la composition et pour l'enregistrement. Pour ta propre interprétation, seule la licence de la composition est nécessaire. Les détails et les sources se trouvent à l'étape 12.

Ceci n'est pas un conseil juridique.

## Limites connues

- **Les images des étapes 1–8 sont schématiques**, générées dans l'application ; ce ne sont pas les images de la NASA. Pour les vraies images, utilise l'étape 9 avec un segment audio tiré d'un enregistrement du disque.
- **Le décodage d'un enregistrement réel n'a pas été testé**, car il n'y a aucun fichier réel dans le dépôt. La méthode est vérifiée sur des signaux synthétiques ; un réglage manuel (début, L, décalage vertical) peut être nécessaire.
- **Le calibrage automatique** comporte deux étapes. L'estimation par autocorrélation donne L avec une précision d'environ 1 échantillon, ce qui provoque une inclinaison visible sur 512 colonnes. Seul l'affinage par le cercle atteint ~0,002. Les images périodiques (damiers, rayures diagonales) et les tons purs sont ambigus par nature.
- **Les périodes des pulsars** (étape 11) sont extrapolées linéairement à partir de valeurs de référence approximatives. Pour un disque réel, utilise les périodes mesurées des 14 pulsars du catalogue ATNF.
- **La liste des « Sons de la Terre »** de l'étape 12 est établie de mémoire et doit être vérifiée dans les sources de la NASA. La classification des droits (A–D) est indicative et propre à l'auteur.
- **Mémoire** : un gros codage demande beaucoup de mémoire. La limite est de 160 trames sur ordinateur et de 60 sur les appareils tactiles.
- **Traductions** : le texte roumain est l'original ; les autres langues ont été produites par traduction automatique et n'ont pas été relues par des locuteurs natifs.
- Testée uniquement dans **Chromium** (Playwright). Safari et Firefox n'ont pas été essayés ; l'enregistrement au microphone n'a été essayé qu'avec un périphérique audio simulé.

## Tests

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

Le test dans le navigateur vérifie, à chaque taille : toutes les étapes, le débordement horizontal, la taille des cibles tactiles, les erreurs JS, les fichiers audio et image corrompus, les paquets de contribution malveillants (XSS, WAV de fréquence 0 ou énorme, base64 tronqué, pollution de prototype), les valeurs extrêmes des champs, le codage avec contrôle du PSNR et le blocage des pistes sans droits.

## Traduire

Les textes se trouvent dans `i18n/<lang>.json` (le fichier roumain est la source). Après modification, exécute `python3 tools/build-i18n.py` pour les intégrer dans `index.html` ; `npm run test:i18n` vérifie que chaque langue a toutes les clés, avec les mêmes paramètres substituables et le même balisage en ligne.

## Sécurité et confidentialité

Tout reste dans le navigateur. La page a une CSP qui interdit toute connexion réseau (`connect-src 'none'`). Les contributions sont des fichiers que l'utilisateur envoie de lui-même ; l'adresse de collecte est la constante `COLLECT_EMAIL` dans `index.html`.

## Sources

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Détails officiels sur le disque : NASA/JPL.

## Soutien

Si le projet t'est utile : [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licence

MIT. Voir `LICENSE`.
