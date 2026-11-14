#!/usr/bin/env python3
"""Recompute the script-src hashes in index.html's CSP meta (run after any inline-script edit)."""
import re,hashlib,base64,os
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','index.html')
s=open(p,encoding='utf-8').read()
sc=[b for a,b in re.findall(r'<script([^>]*)>(.*?)</script>',s,re.S) if 'application/json' not in a]
h=' '.join("'sha256-%s'"%base64.b64encode(hashlib.sha256(b.encode()).digest()).decode() for b in sc)
s=re.sub(r"script-src [^;]*","script-src "+h,s,count=1)
open(p,'w',encoding='utf-8').write(s);print('script-src',len(sc),'hashes')
