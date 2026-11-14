// Teste unitare pentru partea de calcul din index.html (fără browser). Rulare: node tests/unit.js
const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const script=html.match(/<script>([\s\S]*)<\/script>/)[1];
new Function(script.replace(/\nconst PUB=[\s\S]*$/,'')); // sintaxă
const pure=script.split('//#PURE-START')[1].split('//#PURE-END')[0];
const T=new Function(pure+'return {W,H,FS,TL,decode,autoL,refineCircle,roundCost,buildTrack,quant16,psnr,interp,voyState,voyRate,LDKM,V1_THR,lightHMS,earthPos,AUKM};')();
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
// 4. Voyager azi: modelul trebuie să regăsească reperele publicate
{const {voyState,voyRate,LDKM,V1_THR,lightHMS,earthPos,AUKM}=T;
 ok(Math.abs(voyState(0,V1_THR).earth-LDKM)<10,'prag la momentul publicat');
 ok(voyState(0,V1_THR-86400000).earth<LDKM&&voyState(0,V1_THR+86400000).earth>LDKM,'prag: sub înainte, peste după');
 const D=864e5,t0=Date.UTC(2026,10,1);let mx=0,mxT=0,mn=9e99,mnT=0,cross=0,prev=voyState(0,t0).earth<LDKM;
 for(let ms=t0;ms<Date.UTC(2027,5,1);ms+=36e5){const d=voyState(0,ms).earth;if(d>mx&&ms<Date.UTC(2027,3,1)){mx=d;mxT=ms;}
   const c=d<LDKM;if(c!==prev){cross++;prev=c;}}
 for(let ms=mxT;ms<Date.UTC(2027,6,1);ms+=36e5){const d=voyState(0,ms).earth;if(d<mn){mn=d;mnT=ms;}}
 ok(Math.abs(mxT-Date.UTC(2027,0,21))<1.5*D,'maxim ~21 ian 2027: '+new Date(mxT).toISOString());
 ok(Math.abs(mnT-Date.UTC(2027,3,24))<1.5*D,'minim ~24 apr 2027: '+new Date(mnT).toISOString());
 ok(Math.abs(mn/LDKM-1.0010)<0.0002,'minim 1,0010 zile-lumină: '+(mn/LDKM));
 ok(cross===1,'trece o singură dată pragul: '+cross);
 let sc=0;for(let ms=Date.UTC(2027,0,1);ms<Date.UTC(2027,3,1);ms+=36e5)if(voyState(0,ms).sun>=LDKM){sc=ms;break;}
 ok(Math.abs(sc-Date.UTC(2027,1,3))<1.5*D,'o zi-lumină față de Soare ~3 feb 2027: '+new Date(sc).toISOString());
 let rmx=-9,rmn=9;for(let ms=t0;ms<t0+366*D;ms+=6*36e5){const r=voyRate(0,ms);rmx=Math.max(rmx,r);rmn=Math.min(rmn,r);}
 ok(Math.abs(rmx-41)<1.5&&Math.abs(rmn+7.6)<1.5,'viteza față de Pământ: '+rmn.toFixed(1)+'…'+rmx.toFixed(1));
 const e=earthPos((Date.UTC(2026,5,21)-Date.UTC(2000,0,1,12))/D);ok(Math.abs(Math.hypot(...e)/AUKM-1.016)<0.003,'Pământul la afeliu ~1,016 UA');
 const v2=voyState(1,Date.UTC(2026,10,14)).earth/AUKM;ok(v2>143&&v2<147,'V2 ~145 UA: '+v2.toFixed(2));
 ok(lightHMS(LDKM).join(':')==='24:0:0'||lightHMS(LDKM)[0]===24,'o zi-lumină = 24 h');}
console.log(n+' verificări unitare ok');
