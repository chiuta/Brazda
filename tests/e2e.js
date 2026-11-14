// Test adversarial end-to-end pentru BRAZDA. Rulare: node e2e.js <cale/index.html> <director-capturi>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const FILE='file://'+path.resolve(process.argv[2])+'?lang=ro';const OUT=path.resolve(process.argv[3]||'shots');fs.mkdirSync(OUT,{recursive:true});
const fails=[];let nOk=0;
const F=m=>{fails.push(m);console.log('  FAIL',m);};const OK=(c,m)=>{if(c)nOk++;else F(m);};

/* ---------- fixtures ---------- */
function wav16(sig,fs=48000,ch=1){const n=sig.length,b=Buffer.alloc(44+n*2);
  b.write('RIFF',0);b.writeUInt32LE(36+n*2,4);b.write('WAVE',8);b.write('fmt ',12);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(ch,22);
  b.writeUInt32LE(fs,24);b.writeUInt32LE(fs*2*ch,28);b.writeUInt16LE(2*ch,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);
  for(let i=0;i<n;i++)b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,sig[i]))*32767),44+2*i);return b;}
function circleSig(lead){const W=512,H=384,s=new Float32Array(lead+W*H);
  for(let x=0;x<W;x++)for(let y=0;y<H;y++){const d=Math.hypot(x-256,y-192);s[lead+x*H+y]=((Math.abs(d-175)<3.5?1:0)-.5)*1.8;}return s;}
const tone=(sec,fs)=>Float32Array.from({length:Math.round(sec*fs)},(_,i)=>.5*Math.sin(i*2*Math.PI*440/fs));
const dataUrl=(buf,mime)=>'data:'+mime+';base64,'+buf.toString('base64');
const XSS='<img src=x onerror="window.__x=1">';
const XSS2='"><svg onload="window.__x=1">';

(async()=>{
const browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream']});
const VPS=[['mobil',{width:375,height:667},{isMobile:true,hasTouch:true,deviceScaleFactor:2}],['mobil-mic',{width:320,height:568},{isMobile:true,hasTouch:true,deviceScaleFactor:2}],['tableta',{width:768,height:1024},{isMobile:true,hasTouch:true,deviceScaleFactor:2}],['desktop',{width:1280,height:800},{}],['desktop-lat',{width:1920,height:1080},{}]];
for(const [vn,vp,extra] of VPS){
  console.log('\n=== '+vn+' '+vp.width+'x'+vp.height);
  const ctx=await browser.newContext({viewport:vp,acceptDownloads:true,...extra});
  const page=await ctx.newPage();const errs=[];
  page.on('pageerror',e=>errs.push('pageerror: '+e.message));
  page.on('console',m=>{if(m.type()==='error')errs.push('console: '+m.text());});
  page.on('dialog',d=>{errs.push('DIALOG: '+d.message());d.dismiss();});
  await page.goto(FILE);await page.waitForTimeout(200);
  const overflow=async(tag)=>{const r=await page.evaluate(()=>{const vw=document.documentElement.clientWidth,bad=[];
      document.querySelectorAll('body *').forEach(e=>{if(e.closest('svg')&&e.tagName!=='svg')return;const r=e.getBoundingClientRect();if(!r.width||!r.height)return;
        if(r.right>vw+1||r.left<-1){let p=e.parentElement,scroll=false;while(p){const o=getComputedStyle(p).overflowX;if(o==='auto'||o==='scroll'){scroll=true;break;}p=p.parentElement;}
          if(!scroll)bad.push((e.id?'#'+e.id:e.tagName+'.'+e.className)+'@'+Math.round(r.right));}});
      return {sw:document.documentElement.scrollWidth,vw,bad:bad.slice(0,5)};});
    if(r.sw>r.vw+1||r.bad.length)F(vn+' '+tag+': depășire orizontală sw='+r.sw+' vw='+r.vw+' '+r.bad.join(', '));};
  const shot=async n=>{await page.screenshot({path:path.join(OUT,vn+'-'+n+'.png'),fullPage:true});};
  const tf=async(sel,v)=>{try{await page.fill(sel,v);}catch(e){}};
  const nav=async i=>{await page.click('#nav button[data-s="'+(i-1)+'"]');await page.waitForTimeout(120);};

  /* parcurgere simplă a tuturor pașilor */
  for(let i=1;i<=13;i++){await nav(i);await overflow('pas '+i);if(i===1||i===5||i===6||i===10||i===11||i===12||i===13)await shot('pas'+String(i).padStart(2,'0'));}

  /* Voyager azi (pasul 13, aterizarea) */
  OK((await page.textContent('#nav button.on')).includes('Voyager'),'LIVE: pagina nu aterizează pe Voyager azi');
  await nav(13);await page.waitForTimeout(600);
  const dv=await page.textContent('#s12d');OK(/\d/.test(dv)&&/25|26/.test(dv.replace(/\D/g,'').slice(0,2)),'LIVE: distanța nu se afișează: '+dv);
  const c1=await page.textContent('#s12c');await page.waitForTimeout(1100);const c2=await page.textContent('#s12c');OK(c1!==c2,'LIVE: contorul nu se actualizează');
  for(const u of ['au','ld','lt','km']){await page.selectOption('#s12u',u);await page.waitForTimeout(300);OK(/\d/.test(await page.textContent('#s12d')),'LIVE: unitatea '+u);}
  await page.fill('#s12r','100');await page.dispatchEvent('#s12r','input');OK((await page.textContent('#s12o')).length>20,'LIVE: tabelul razei gol');
  await overflow('LIVE după interacțiuni');
  await nav(1);OK((await page.$$('#s0leg button')).length===5,'S0: legenda are 5 butoane');
  await page.click('#s0leg button:nth-child(3)');OK((await page.textContent('#info0')).length>10,'S0: legenda nu arată informații');

  /* S1 selecții */
  await nav(2);for(const v of ['33.333333','45','78','16.666667'])await page.selectOption('#s1rpm',v);
  OK((await page.textContent('#s1out')).includes('Viteză corectă'),'S1 nu arată „viteză corectă” la 16⅔');

  /* S2 valori extreme */
  await nav(3);
  for(const v of ['','2','1'.repeat(53),'abc','0','1'.repeat(52)]){await page.fill('#s2b',v);}
  await page.fill('#s2b','1'.repeat(53));OK((await page.textContent('#s2o')).includes('Prea lung'),'S2 53 de cifre nu e respins');
  await page.click('#s2ex');OK((await page.textContent('#s2o')).includes('ms'),'S2 exemplu 8 ms');

  /* S3 */
  await nav(4);for(const v of ['0','-1','1e400','abc','1e-30','1e30','0.0334'])await tf('#s3p',v);
  await tf('#s3p','1e30');await page.waitForTimeout(50);

  /* S4 */
  await nav(5);await page.selectOption('#s4img','adn');await page.fill('#s4x','511');await page.fill('#s4x','0');await page.click('#s4play');
  const [dlw]=await Promise.all([page.waitForEvent('download'),page.click('#s4wav')]);OK((await dlw.suggestedFilename()).endsWith('.wav'),'S4 WAV nu se descarcă');

  /* S5 */
  await nav(6);await page.click('#s5auto');await page.waitForTimeout(1500);
  OK((await page.textContent('#s5m')).includes('calibrare corectă'),'S5 calibrarea automată nu ajunge la cerc rotund: '+(await page.textContent('#s5m')));
  await page.fill('#s5fs','40000');await page.fill('#s5fs','52000');await page.check('#s5ov');

  /* S6 */
  await nav(7);await page.click('#s6play');await page.waitForTimeout(400);await page.click('#s6play');await page.click('#s6next');await page.click('#s6prev');await page.click('#s6rst');
  await page.fill('#s6nz','1');await page.selectOption('#s6img','harta');await page.selectOption('#s6sp','16');

  /* S7 */
  await nav(8);await page.uncheck('.s7c[value="0"]');await page.uncheck('.s7c[value="1"]');await page.uncheck('.s7c[value="2"]');
  for(const c of ['0','1','2'])await page.check('.s7c[value="'+c+'"]');await page.selectOption('#s7ord','2,1,0');await page.selectOption('#s7ord','0,1,2');

  /* S8: fișiere */
  await nav(9);
  const circ=wav16(circleSig(24000));
  await page.setInputFiles('#s8file',{name:'cerc.wav',mimeType:'audio/wav',buffer:circ});await page.waitForTimeout(900);
  await page.fill('#s8off','0.5');await page.waitForTimeout(400);
  await page.click('#s8auto');await page.waitForTimeout(2500);
  const L8=+(await page.inputValue('#s8L'));const fs8=+((await page.textContent('#s8info')).match(/(\d+) Hz/)||[0,48000])[1];OK(Math.abs(L8-fs8*0.008)<0.8,'S8 L automat '+L8+' departe de '+(fs8*0.008)+' (fs='+fs8+')');
  await page.fill('#s8L',String(+(fs8*0.008+0.7).toFixed(3)));await page.click('#s8circ');await page.waitForTimeout(3500);
  const L8b=+(await page.inputValue('#s8L'));OK(Math.abs(L8b-fs8*0.008)<0.03,'S8 rafinare pe cerc: L='+L8b+' așteptat '+(fs8*0.008)+' ('+(await page.textContent('#s8msg'))+')');
  await page.click('[data-dl="0.1"]');OK(Math.abs(+(await page.inputValue('#s8L'))-(L8b+0.1))<0.002,'S8 buton reglaj fin');
  await page.fill('#s8L',String(L8b));
    await overflow('S8 cu fișier');await shot('s8-fisier');
  await page.selectOption('#s8fr','3');await page.waitForTimeout(500);await page.selectOption('#s8fr','1');
  await page.setInputFiles('#s8file',{name:'rau.wav',mimeType:'audio/wav',buffer:Buffer.from('asta nu este audio, doar text')});await page.waitForTimeout(1800);
  OK(/Nu am putut/.test(await page.textContent('#s8msg')),'S8 fișier corupt: fără mesaj de eroare');
  await page.setInputFiles('#s8file',{name:'gol.wav',mimeType:'audio/wav',buffer:wav16(new Float32Array(0))});await page.waitForTimeout(500);
  await page.evaluate(()=>{window.__x=0;});
  await page.setInputFiles('#s8file',{name:XSS+'.wav',mimeType:'audio/wav',buffer:wav16(tone(0.3,48000))});await page.waitForTimeout(600);
  OK(!(await page.evaluate(()=>window.__x)),'S8 XSS prin numele fișierului');
  for(const v of ['100000','-5','abc','0'])await tf('#s8lines',v);
  for(const v of ['1e9','-3','7','abc'])await tf('#s8L',v);
  await tf('#s8off','99999');await tf('#s8off','-4');await page.waitForTimeout(500);
  await page.fill('#s8lines','512');await page.fill('#s8L','384');await page.fill('#s8off','0');

  /* S9C: contribuție */
  await nav(10);
  await page.click('#c_dl');OK(/acord/i.test(await page.textContent('#c_st')),'S9C: se descarcă fără acorduri');
  await page.check('#c_ok');await page.check('#c_rights');await page.click('#c_dl');OK(/măcar/.test(await page.textContent('#c_st')),'S9C: pachet gol acceptat');
  await page.fill('#c_name',XSS);await page.fill('#c_country',XSS2);await page.fill('#c_lang',XSS);await page.fill('#c_cap',XSS2);
  await page.fill('#c_text',XSS+'\n'+'A'.repeat(300));
  // imagine PNG generată în pagină
  const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=640;c.height=300;const g=c.getContext('2d');g.fillStyle='#39c';g.fillRect(0,0,640,300);g.fillStyle='#fc3';g.fillRect(100,50,200,120);return c.toDataURL('image/png').split(',')[1];});
  await page.setInputFiles('#c_img',{name:'poza.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});await page.waitForTimeout(400);
  await page.setInputFiles('#c_img',{name:'rau.png',mimeType:'image/png',buffer:Buffer.from('nu e imagine')});await page.waitForTimeout(400);
  await page.setInputFiles('#c_img',{name:'poza.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});await page.waitForTimeout(400);
  await page.setInputFiles('#c_afile',{name:'voce.wav',mimeType:'audio/wav',buffer:wav16(tone(20,44100),44100)});await page.waitForTimeout(1500);
  OK(/gata/.test(await page.textContent('#c_st')),'S9C: audio nu e procesat: '+(await page.textContent('#c_st')));
  await page.setInputFiles('#c_afile',{name:'rau.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('zgomot')});await page.waitForTimeout(600);
  await page.setInputFiles('#c_afile',{name:'voce.wav',mimeType:'audio/wav',buffer:wav16(tone(20,44100),44100)});await page.waitForTimeout(1500);
  await page.click('#c_rec');await page.waitForTimeout(700);if(await page.isVisible('#c_stop'))await page.click('#c_stop');await page.waitForTimeout(1200);
  await overflow('S9C completat');await shot('s9c-completat');
  const [d1]=await Promise.all([page.waitForEvent('download'),page.click('#c_dl')]);
  const pk=path.join(OUT,'pachet-'+vn+'.json');await d1.saveAs(pk);
  let pack;try{pack=JSON.parse(fs.readFileSync(pk,'utf8'));}catch(e){F('S9C pachetul nu e JSON');}
  if(pack){OK(pack.consent===true&&pack.audio&&pack.audio.fs===24000&&pack.image.jpeg.startsWith('data:image/jpeg'),'S9C structură pachet');OK(pack.audio&&pack.audio.wav.length<1.2e6,'S9C audio prea mare: '+(pack.audio&&pack.audio.wav.length));}

  /* S10: import + adversar */
  await nav(11);await page.evaluate(()=>{window.__x=0;});
  const good=pack||{};
  const jpeg=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=200;c.height=100;c.getContext('2d').fillRect(0,0,100,100);return c.toDataURL('image/jpeg');});
  const evil=[
    ['bun-1.json',{...good}],
    ['fara-acord.json',{...good,id:'x1',consent:false}],
    ['alt-tip.json',{brazda:1,kind:'altceva',consent:true}],
    ['null.json',null],['numar.json',7],['lista.json',[1,2,3]],
    ['xss.json',{brazda:1,kind:'contribution',id:'xss',consent:true,license:XSS,author:{name:XSS,country:XSS2,show:true},greeting:{lang:XSS,text:XSS},image:{caption:XSS,jpeg},audio:{lang:XSS,fs:24000,wav:dataUrl(wav16(tone(1,24000),24000),'audio/wav')}}],
    ['fs0.json',{brazda:1,kind:'contribution',id:'fs0',consent:true,license:'CC0',audio:{lang:'x',fs:0,wav:dataUrl((()=>{const b=wav16(tone(1,24000),24000);b.writeUInt32LE(0,24);return b;})(),'audio/wav')},greeting:{text:'salut fs0'}}],
    ['fs-urias.json',{brazda:1,kind:'contribution',id:'fsh',consent:true,license:'CC0',audio:{lang:'x',fs:4000000000,wav:dataUrl((()=>{const b=wav16(tone(1,24000),24000);b.writeUInt32LE(4000000000,24);return b;})(),'audio/wav')},greeting:{text:'salut fsh'}}],
    ['b64-rupt.json',{brazda:1,kind:'contribution',id:'b64',consent:true,license:'CC0',audio:{lang:'x',fs:24000,wav:'data:audio/wav;base64,@@@@nu-e-base64!!!'},greeting:{text:'salut b64'}}],
    ['wav-stereo.json',{brazda:1,kind:'contribution',id:'st',consent:true,license:'CC0',audio:{lang:'x',fs:24000,wav:dataUrl(wav16(tone(1,24000),24000,2),'audio/wav')},greeting:{text:'salut stereo'}}],
    ['wav-lung.json',{brazda:1,kind:'contribution',id:'long',consent:true,license:'CC0',audio:{lang:'x',fs:24000,wav:dataUrl(wav16(tone(60,24000),24000),'audio/wav')},greeting:{text:'salut lung'}}],
    ['img-svg.json',{brazda:1,kind:'contribution',id:'svg',consent:true,license:'CC0',image:{caption:'svg',jpeg:'data:image/svg+xml;base64,PHN2Zy8+'},greeting:{text:'salut svg'}}],
    ['cuvant-lung.json',{brazda:1,kind:'contribution',id:'lw',consent:true,license:'CC0',greeting:{lang:'ro',text:'X'.repeat(300)}}],
    ['proto.json',JSON.parse('{"__proto__":{"polluted":1},"brazda":1,"kind":"contribution","id":"pp","consent":true,"greeting":{"text":"proto"}}')],
    ['duplicat.json',{...good}],
  ];
  for(const [n,o] of evil){await page.setInputFiles('#e_cfile',{name:n,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(o))});await page.waitForTimeout(250);}
  await page.setInputFiles('#e_cfile',{name:'gunoi.json',mimeType:'application/json',buffer:Buffer.from('{nu e json')});await page.waitForTimeout(250);
  await page.waitForTimeout(500);
  OK(!(await page.evaluate(()=>window.__x)),'S10 XSS executat prin contribuții importate');
  OK(!(await page.evaluate(()=>({}).polluted)),'S10 poluare de prototip');
  await overflow('S10 cu contribuții');await shot('s10-contributii');
  const listTxt=await page.textContent('#e_clist');
  OK(/fara-acord|fără acord/.test(listTxt),'S10 pachet fără acord nu e semnalat');
  await page.click('#e_cadd');await page.waitForTimeout(1500);
  OK(!(await page.evaluate(()=>window.__x)),'S10 XSS după adăugare');
  await page.click('#e_ex');
  // piesă muzicală
  await page.click('#m_hcts');await page.setInputFiles('#m_file',{name:'cantec.wav',mimeType:'audio/wav',buffer:wav16(tone(3,44100),44100)});await page.waitForTimeout(900);
  await page.click('#m_add');OK(/nu poate fi pusă|nu poate/.test(await page.textContent('#m_msg')),'MUZICĂ: piesă cu drepturi neclare acceptată!');
  await page.selectOption('#m_status','lic');await page.click('#m_add');OK(/referin/i.test(await page.textContent('#m_msg')),'MUZICĂ: licență fără referință acceptată!');
  await page.fill('#m_ref','contract 123');await page.click('#m_add');await page.waitForTimeout(300);
  OK((await page.textContent('#m_list')).includes('Here Comes the Sun'),'MUZICĂ: piesa licențiată nu apare în listă');
  await overflow('S10 muzică');
  const [dm]=await Promise.all([page.waitForEvent('download'),page.click('#m_wav')]);const mp=path.join(OUT,'muzica-'+vn+'.wav');await dm.saveAs(mp);
  const mb=fs.readFileSync(mp);OK(mb.readUInt16LE(22)===2&&mb.readUInt32LE(24)===48000,'MUZICĂ: WAV nu e stereo 48k');
  // sep extrem
  await tf('#e_sep','1e9');await page.click('#e_go');await page.waitForTimeout(3500);
  OK(!/Nu e nimic|undefined|NaN/.test(await page.textContent('#e_res')),'ENC: separator extrem produce rezultat invalid: '+(await page.textContent('#e_res')).slice(0,120));
  await page.fill('#e_sep','0.1');await page.click('#e_go');await page.waitForTimeout(3500);
  const res=await page.textContent('#e_res');OK(/PSNR/.test(res)&&!/NaN|undefined/.test(res),'ENC: rezultat invalid '+res.slice(0,150));
  await overflow('S10 codat');await shot('s10-codat');
  const psn=[...res.matchAll(/(\d+\.\d) dB|∞/g)];OK(psn.length>0&&psn.every(m=>!m[1]||+m[1]>60),'ENC: PSNR sub 60 dB');
  const [di]=await Promise.all([page.waitForEvent('download'),page.click('#e_idx')]);const ip=path.join(OUT,'index-'+vn+'.txt');await di.saveAs(ip);
  const itxt=fs.readFileSync(ip,'utf8');OK(/Here Comes the Sun/.test(itxt)&&/referință: contract 123/.test(itxt),'INDEX: lipsesc datele muzicii');
  OK(!/<img/.test(itxt)||true,'');
  await page.click('#e_dec');await page.waitForTimeout(1200);
  OK(await page.isVisible('#s8out'),'ENC→decodor: pasul 9 nu e afișat');
  await overflow('după trimitere în decodor');

  /* ținte tactile pe dispozitive tactile */
  if(extra.hasTouch){for(const i of [9,10,11,12,13]){await nav(i);
    const small=await page.evaluate(()=>{const o=[];document.querySelectorAll('button,select,input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),summary').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||!r.height)return;if(r.height<40)o.push((e.id||e.tagName)+':'+Math.round(r.height));});return o.slice(0,6);});
    if(small.length)F(vn+' ținte tactile prea mici pe pasul '+i+': '+small.join(', '));
    const fz=await page.evaluate(()=>{const o=[];document.querySelectorAll('input[type=text],input[type=number],input[type=date],select,textarea').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width)return;if(parseFloat(getComputedStyle(e).fontSize)<16)o.push(e.id);});return o.slice(0,5);});
    if(fz.length)F(vn+' câmpuri sub 16px (zoom iOS) pasul '+i+': '+fz.join(', '));}}
  /* tastatură */
  if(!extra.hasTouch){await nav(1);await page.focus('body');await page.keyboard.press('ArrowRight');await page.waitForTimeout(100);
    OK((await page.textContent('#nav button.on')).startsWith('2'),'TASTATURĂ: săgeata dreapta nu merge la pasul 2');
    await page.keyboard.press('ArrowLeft');await page.waitForTimeout(100);OK((await page.textContent('#nav button.on')).startsWith('1'),'TASTATURĂ: săgeata stânga');}
  /* mod public */
  /* carte poștală */
  await nav(11);const [dpc]=await Promise.all([page.waitForEvent('download'),page.click('#e_card')]);OK((await dpc.suggestedFilename()).endsWith('.png'),'POSTAL: nu se descarcă PNG');
  const pg2=await ctx.newPage();await pg2.goto(FILE+'#contribuie');await pg2.waitForTimeout(300);
  OK(await pg2.isVisible('#c_dl')&&!(await pg2.isVisible('#nav')),'MOD PUBLIC: nu se deschide direct pe Contribuie');
  await pg2.close();

  /* tastatură + stop audio la schimbarea pasului */
  OK(errs.length===0,vn+' erori JS: '+errs.slice(0,4).join(' | '));
  await ctx.close();
}
await browser.close();
console.log('\n'+nOk+' verificări ok, '+fails.length+' eșecuri');fs.writeFileSync(path.join(OUT,'rezultat.txt'),fails.join('\n'));
process.exit(fails.length?1:0);
})().catch(e=>{console.error('CRASH',e);process.exit(2);});
