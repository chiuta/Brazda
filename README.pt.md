# BRAZDA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versão: 1.1.4 · Última atualização: 2026-11-10

Um descodificador e codificador passo a passo do **Disco de Ouro da Voyager** (Voyager Interstellar Record). Um único ficheiro HTML (`index.html`), sem dependências externas, sem servidor, sem rastreadores. Funciona offline: basta abrir o ficheiro num navegador.

A aplicação está disponível em **8 idiomas** (English, Română, Français, Italiano, Español, Português, Deutsch, Magyar). Escolha o idioma com os botões no topo da página; a escolha fica memorizada, e `index.html?lang=de` abre diretamente um determinado idioma.

## O que faz

A aplicação tem 12 passos:

1. **O disco e a sua capa**: um diagrama interativo com zonas em que pode tocar.
2. **Velocidade**: 16⅔ rpm comparadas com outras velocidades, e o efeito na duração de uma linha.
3. **O relógio do hidrogénio**: a transição de 1420,405751768 MHz (período ≈ 0,704 ns) e um conversor binário → tempo.
4. **O mapa dos pulsares**: período em segundos → número binário de unidades de hidrogénio.
5. **O sinal de uma imagem**: 512 linhas × 8 ms × 384 amostras a 48 kHz; ouvir e exportar WAV.
6. **Calibração com o círculo**: estimativa automática do comprimento da linha, refinada pela redondeza do círculo.
7. **Descodificação linha a linha**: animação, velocidade ajustável, ruído de pista.
8. **Cor**: três fotogramas, R, G, B.
9. **O seu próprio ficheiro**: carregar uma gravação áudio e descodificá-la localmente (canal, início, L, deslocamento vertical, modo de cor, exportação PNG).
10. **Contribuir**: qualquer pessoa pode enviar uma saudação escrita, uma imagem ou uma mensagem de voz (até 15 s) como pacote `.json`. Nada sai do navegador por si só. O endereço `…/index.html#contribute` abre diretamente este passo.
11. **Codificação 2026–2027**: construir o disco de uma sonda lançada agora. As imagens (com um círculo de calibração e uma página de texto) tornam-se um WAV de 48 kHz; importa as contribuições do público após moderação; pode adicionar uma faixa musical, apenas com uma ficha de direitos preenchida; exporta o WAV, um índice, os números para a capa e os períodos dos pulsares à data de lançamento.
12. **O disco original (1977)**: as 27 peças de música, as 55 línguas, as imagens, as mensagens e a situação dos direitos de autor.

## Direitos de autor e música

A aplicação **não contém** música nem qualquer gravação protegida. A faixa musical do passo 11 exige um ficheiro fornecido por si, além dos titulares dos direitos e de uma referência de licença. Uma faixa com direitos pouco claros não pode ser adicionada.

O exemplo «Here Comes the Sun» (Beatles) está incluído como ficha de partida precisamente porque mostra o problema: a canção está protegida e, para a gravação original dos Beatles, é necessária uma licença tanto para a composição como para a gravação. Para uma interpretação própria, só é necessária a licença da composição. Os pormenores e as fontes estão no passo 12.

Isto não é aconselhamento jurídico.

## Limitações conhecidas

- **As imagens dos passos 1–8 são esquemáticas**, geradas na aplicação; não são as imagens da NASA. Para as imagens reais, use o passo 9 com um segmento áudio de uma gravação do disco.
- **A descodificação de uma gravação real não foi testada**, porque não existe nenhum ficheiro real no repositório. O método está verificado com sinais sintéticos; pode ser necessário um ajuste manual (início, L, deslocamento vertical).
- **A calibração automática** tem duas fases. A estimativa por autocorrelação dá L com uma precisão de ~1 amostra, o que significa uma inclinação visível ao longo de 512 colunas. Só o refinamento pelo círculo atinge ~0,002. As imagens periódicas (tabuleiros de xadrez, riscas diagonais) e os tons puros são ambíguos por natureza.
- **Os períodos dos pulsares** (passo 11) são extrapolados linearmente a partir de valores de referência aproximados. Para um disco real, use os períodos medidos dos 14 pulsares do catálogo ATNF.
- **A lista de «Sons da Terra»** no passo 12 é de memória e tem de ser verificada nas fontes da NASA. A classificação dos direitos (A–D) é indicativa e é da autoria do autor da aplicação.
- **Memória**: uma codificação grande exige muita memória. O limite é de 160 fotogramas em computador e 60 em dispositivos táteis.
- **Traduções**: o texto romeno é o original; os outros idiomas foram produzidos por tradução automática e não foram revistos por falantes nativos.
- Testado apenas em **Chromium** (Playwright). O Safari e o Firefox não foram experimentados; a gravação com microfone só foi experimentada com um dispositivo de áudio simulado.

## Testes

```bash
npm install            # only for the browser tests
npm run test:unit      # checks without a browser
npm run test:e2e       # Playwright, 5 screen sizes (320 px – 1920 px)
npm run test:i18n      # key, placeholder and markup parity across the 8 languages
npm run test:e2e-i18n   # all 8 languages × 2 viewports: overflow, raw keys, Romanian leakage, live language switch
```

O teste no navegador verifica, em cada tamanho: todos os passos, o excesso horizontal, o tamanho das áreas de toque, erros de JS, ficheiros de áudio e de imagem corrompidos, pacotes de contribuição maliciosos (XSS, WAV com frequência 0 ou enorme, base64 truncado, poluição de protótipos), valores extremos nos campos, a codificação com verificação de PSNR e o bloqueio de faixas sem direitos.

## Traduzir

Os textos estão em `i18n/<lang>.json` (o ficheiro romeno é a fonte). Depois de editar, execute `python3 tools/build-i18n.py` para os incorporar em `index.html`; `npm run test:i18n` verifica se cada idioma tem todas as chaves, com os mesmos marcadores de posição e a mesma marcação em linha.

## Segurança e privacidade

Tudo fica no navegador. A página tem uma CSP que proíbe qualquer ligação à rede (`connect-src 'none'`). As contribuições são ficheiros que o utilizador envia por iniciativa própria; o endereço de receção é a constante `COLLECT_EMAIL` em `index.html`.

## Fontes

- [Contents of the Voyager Golden Record](https://en.wikipedia.org/wiki/Contents_of_the_Voyager_Golden_Record)
- [Voyager Golden Record](https://en.wikipedia.org/wiki/Voyager_Record)
- [Here Comes the Sun](https://en.wikipedia.org/wiki/Here_Comes_the_Sun)
- [Ozma Records, Voyager](https://ozmarecords.com/pages/voyager)

Detalhes oficiais sobre o disco: NASA/JPL.

## Apoio

Se o projeto lhe for útil: [Buy Me a Coffee](https://www.buymeacoffee.com/echo.of.the.strings).

## Licença

MIT. Ver `LICENSE`.
