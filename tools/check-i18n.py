#!/usr/bin/env python3
"""Validates i18n/*.json against ro.json: keys, placeholders, inline markup, newlines, list sizes, leakage.
Usage: check-i18n.py [lang ...]   (default: every language file present, plus the embedded copy in index.html)"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LANGS = ['en', 'ro', 'fr', 'it', 'es', 'pt', 'de', 'hu']
def jl(l): return json.load(open(os.path.join(ROOT, 'i18n', l + '.json'), encoding='utf-8'))
def tags(s): return sorted(re.sub(r'\s+', ' ', t) for t in re.findall(r'<[^>]+>', s))
def phs(s): return sorted(re.findall(r'\{\d+\}', s))
def check(lang, ref):
    errs = []; warn = []
    d = jl(lang)
    for k in ref:
        if k not in d: errs.append('missing ' + k); continue
        v, r = d[k], ref[k]
        if not isinstance(v, str) or not v.strip(): errs.append('empty ' + k); continue
        if phs(v) != phs(r): errs.append('placeholders %s: %s vs %s' % (k, phs(v), phs(r)))
        if tags(v) != tags(r): errs.append('markup %s: %s vs %s' % (k, tags(v), tags(r)))
        if v.count('\n') != r.count('\n'): errs.append('newlines ' + k)
        if v != v.strip() and r == r.strip(): errs.append('whitespace ' + k)
        if lang != 'ro' and re.search('[ășțşţĂȘȚŞŢ]', v) and k != 'o.langs': errs.append('romanian leakage ' + k + ': ' + v[:50])
        if len(r) > 12 and len(v) > 2.2 * len(r) + 20: warn.append('long ' + k)
        if k.startswith(('e.th.', 'e.dl.', 'e.t.', 'o.h.', 'o.l.')) and '"' in v: errs.append('quote in attr value ' + k)
        if k.startswith('n.') and len(v) > 18: warn.append('nav label long ' + k + ' ' + v)
    for k in d:
        if k not in ref: errs.append('extra ' + k)
    if 'o.langs' in d and len(d['o.langs'].split(', ')) != 55: errs.append('o.langs count %d' % len(d['o.langs'].split(', ')))
    return errs, warn
def main():
    langs = sys.argv[1:] or [l for l in LANGS if os.path.exists(os.path.join(ROOT, 'i18n', l + '.json'))]
    ref = jl('ro'); bad = 0
    for l in langs:
        if l == 'ro': continue
        e, w = check(l, ref)
        print('%s: %d errors, %d warnings' % (l, len(e), len(w)))
        for x in e[:40]: print('  ERR', x)
        for x in w[:15]: print('  warn', x)
        bad += len(e)
    if not sys.argv[1:]:
        s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
        m = re.search(r'/\*I18N-START\*/const I18N=(.*?);/\*I18N-END\*/', s, re.S)
        emb = json.loads(m.group(1).replace('<\\/', '</'))
        for l in langs:
            if emb.get(l) != jl(l): print('  ERR embedded copy of', l, 'differs: run tools/build-i18n.py'); bad += 1
        # every data-i / data-ia key and every t('...') literal exists in ro
        s = re.sub(r'<script id="fff-kit">.*?</script>', '', s, flags=re.S)
        keys = set(re.findall(r'data-i="([^"]+)"', s))
        for x in re.findall(r'data-ia="([^"]+)"', s):
            keys |= {p.split(':', 1)[1] for p in x.split(';')}
        keys |= {k for k in re.findall(r"\bt\('([a-z0-9_.]+)'", s) if not k.endswith('.')}
        miss = sorted(k for k in keys if k not in ref and not any(r.startswith(k) for r in ref))
        if miss: print('  ERR keys used but undefined:', miss); bad += len(miss)
        print('keys used:', len(keys), 'defined:', len(ref))
    print('OK' if not bad else 'FAILED')
    sys.exit(1 if bad else 0)
main()
