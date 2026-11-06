#!/usr/bin/env python3
"""Embeds i18n/<lang>.json into index.html between the I18N-START/END markers."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu']
def load():
    d = {}
    for l in LANGS:
        p = os.path.join(ROOT, 'i18n', l + '.json')
        if os.path.exists(p):
            d[l] = json.load(open(p, encoding='utf-8'))
    return d
def main():
    d = load()
    blob = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    p = os.path.join(ROOT, 'index.html')
    s = open(p, encoding='utf-8').read()
    a = s.index('/*I18N-START*/'); b = s.index('/*I18N-END*/') + len('/*I18N-END*/')
    s = s[:a] + '/*I18N-START*/const I18N=' + blob + ';/*I18N-END*/' + s[b:]
    open(p, 'w', encoding='utf-8').write(s)
    print('embedded', ', '.join(d), '-', len(blob) // 1024, 'KB')
if __name__ == '__main__':
    main()
