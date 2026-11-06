// Teste unitare pentru partea de calcul din index.html (fără browser). Rulare: node tests/unit.js
const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*)<\/script>/)[1];
new Function(script.replace(/\nconst PUB=[\s\S]*$/,'')); // sintaxă
const pure=script.split('//#PURE-START')[1].split('//#PURE-END')[0];
const T=new Function(pure+'return {W,H,FS,TL,decode,autoL,refineCircle,roundCost,buildTrack,quant16,psnr,interp};')();
const {W,H,FS,decode,autoL,refineCircle,roundCost,buildTrack,quant16,psnr}=T;
let n=0;const ok=(c,m)=>{assert(c,m);n++;};
const ring=(R,th)=>{const s=new Float32Array(W*H);for(let x=0;x<W;x++)for(let y=0;y<H;y++)s[x*H+y]=((Math.abs(Math.hypot(x-256,y-192)-R)<th?1:0)-.5)*1.8;return s;};
const rnd=(()=>{let q=3;return()=>(q=(q*16807)%2147483647)/2147483647;})();

// 1. calibrare: estimare grosieră + rafinare pe cerc
for(const [R,th] of [[175,3.5],[120,2],[160,9]])for(const [L0,noise,lead] of [[352.8,0,0],[383.76,0,24000],[384.4,.3,12345],[360,.3,0]]){
  const base=ring(R,th),full=new Float32Array(lead+base.length+5000);full.set(base,lead);
  const sig=noise?full.map(v=>v+(rnd()+rnd()+rnd()-1.5)*noise):full;
  const a=autoL(sig,lead,L0,.25,150),q=refineCircle(sig,lead,a.L,1.5,W,H,0,false);
  ok(Math.abs(a.L-384)<1,'autoL grosier '+a.L);ok(Math.abs(q.L-384)<0.01,'refineCircle '+q.L);}
// 2. semnale degenerate nu produc NaN și nu blochează
const len=300000;
for(const [nm,s] of [['liniște',new Float32Array(len)],['dc',new Float32Array(len).fill(.5)],['zgomot',Float32Array.from({length:len},()=>rnd()-.5)],['scurt',new Float32Array(500).fill(.1)],['gol',new Float32Array(0)],['nan',Float32Array.from({length:len},(_,i)=>i%7?NaN:1)]]){
  const r=autoL(s,0,384,.15,100);ok(Number.isFinite(r.L)&&Number.isFinite(r.score),'degenerat '+nm);}
ok(roundCost(new Float32Array(W*H),W,H,0,false)===Infinity,'roundCost pe imagine goală');
// 3. codare → cuantizare 16 biți → decodare
const g1=new Float32Array(W*H),r=new Float32Array(W*H),gg=new Float32Array(W*H),b=new Float32Array(W*H);
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=y*W+x;g1[i]=Math.hypot(x-256,y-192)<150?1:0;r[i]=x/W;gg[i]=y/H;b[i]=((x>>5)+(y>>5))%2;}
const parts=[{fr:[g1]},{fr:[r,gg,b]},{fr:[g1]}],sep=4800,tr=buildTrack(parts,sep),sq=quant16(tr.sig);
ok(tr.sig.length===5*W*H+4*sep,'lungime pistă');
parts.forEach((p,i)=>p.fr.forEach((a,k)=>{const d=decode(sq,tr.starts[i]+k*W*H,H,W,H,0);ok(psnr(d,a)>100,'PSNR '+i+'.'+k);}));
console.log(n+' verificări unitare ok');
