#!/usr/bin/env python3
"""Set the canonical fff hash (data-fff-hash + fff-info sha256) and sizeBytes in index.html, and mirror them into app.json.
Run LAST, after all other edits (tools/csp-hash.py first). `--check` only verifies."""
import re,hashlib,json,os,sys
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..')
P=os.path.join(R,'index.html')
def canon(b):
    b=re.sub(rb'data-fff-hash="[0-9a-f]*"',b'data-fff-hash=""',b);return re.sub(rb'"sha256":"[0-9a-f]*"',b'"sha256":""',b)
def hsh(b):return hashlib.sha256(canon(b)).hexdigest()
b=open(P,'rb').read()
if '--check' in sys.argv:
    cur=re.search(rb'data-fff-hash="([0-9a-f]*)"',b).group(1).decode();h=hsh(b)
    ok=cur==h and int(re.search(rb'"sizeBytes":(\d+)',b).group(1))==len(b);print('OK' if ok else 'MISMATCH');sys.exit(0 if ok else 1)
sz=len(b)
for _ in range(6):  # the size field is itself part of the file: iterate to a fixpoint
    b2=re.sub(rb'"sizeBytes":\d+',b'"sizeBytes":%d'%sz,b)
    if len(b2)==sz:break
    sz=len(b2)
b=b2;h=hsh(b)
b=re.sub(rb'data-fff-hash="[0-9a-f]*"',b'data-fff-hash="%s"'%h.encode(),b)
b=re.sub(rb'"sha256":"[0-9a-f]*"',b'"sha256":"%s"'%h.encode(),b)
open(P,'wb').write(b)
A=os.path.join(R,'app.json');a=json.load(open(A,encoding='utf-8'));a['sizeBytes']=len(b);a['sha256']=h
json.dump(a,open(A,'w',encoding='utf-8'),ensure_ascii=False,indent=2);open(A,'a').write('\n')
print('hash',h[:12],'size',len(b))
