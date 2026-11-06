// i18n e2e: every language, two viewports: no raw keys, no horizontal overflow, no JS errors, no Romanian leakage, language switch mid-session.
// Run: NODE_PATH=$(npm root -g) node tests/i18n-e2e.js index.html
const {chromium}=require('playwright');const path=require('path');
const FILE='file://'+path.resolve(process.argv[2]||'index.html');
const LANGS=['en','ro','fr','it','es','pt','de','hu'];
const fails=[];let nOk=0;const F=m=>{fails.push(m);console.log('  FAIL',m);};const OK=(c,m)=>{if(c)nOk++;else F(m);};
(async()=>{
  const br=await chromium.launch();
  for(const [vw,vh,touch] of [[320,640,true],[1280,800,false]]){
    const ctx=await br.newContext({viewport:{width:vw,height:vh},hasTouch:touch,isMobile:touch,locale:'en-US'});
    for(const L of LANGS){
      const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
      await page.goto(FILE+'?lang='+L);await page.waitForTimeout(150);
      const tag=`[${L} ${vw}]`;
      OK(await page.evaluate(()=>document.documentElement.lang)===L,tag+' html lang');
      for(let i=0;i<12;i++){
        await page.evaluate(i=>document.querySelectorAll('#nav button')[i].click(),i);await page.waitForTimeout(60);
        if(i===10){await page.click('#e_ex');await page.click('#e_go');await page.waitForSelector('#e_res table',{timeout:20000});
          await page.click('#m_hcts');}
        if(i===5){await page.click('#s5auto');await page.waitForTimeout(500);}
        const r=await page.evaluate(()=>{
          const sec=document.querySelector('main section.on');const txt=sec.innerText;
          const raw=[...sec.querySelectorAll('*')].filter(e=>!e.children.length&&/^[a-z][a-z0-9]*(?:\.[a-z0-9_]+){1,2}$/.test((e.textContent||'').trim())).map(e=>e.textContent.trim());
          return {sw:document.documentElement.scrollWidth,vw:innerWidth,raw,txt,nav:[...document.querySelectorAll('#nav button')].map(b=>b.textContent)};});
        OK(r.sw<=r.vw+1,`${tag} step ${i+1} horizontal overflow ${r.sw}>${r.vw}`);
        OK(!r.raw.length,`${tag} step ${i+1} raw keys: ${r.raw.slice(0,3)}`);
        if(L!=='ro')OK(!/[ășțşţĂȘȚ]/.test(r.txt.replace(/Română|română/g,'')),`${tag} step ${i+1} Romanian leakage: ${(r.txt.match(/.{0,25}[ășț].{0,15}/)||[''])[0]}`);
        OK(r.nav.every(x=>x.length>3),tag+' nav labels');
      }
      // switch language mid-session (after encode) to a different one and back
      const other=L==='en'?'de':'en';
      await page.click(`#lang button[data-l="${other}"]`);await page.waitForTimeout(400);
      OK(await page.evaluate(()=>document.documentElement.lang)===other,tag+' switch lang');
      const t1=await page.evaluate(()=>document.querySelector('#e_res').innerText);
      OK(/PSNR/.test(t1),tag+' encode result re-rendered after switch');
      OK(await page.evaluate(()=>document.querySelectorAll('#e_th figure').length>0),tag+' thumbnails kept after switch');
      await page.click(`#lang button[data-l="${L}"]`);await page.waitForTimeout(300);
      // persistence
      await page.goto(FILE);await page.waitForTimeout(150);
      OK(await page.evaluate(()=>document.documentElement.lang)===L,tag+' persistence (localStorage)');
      OK(!errs.length,`${tag} JS errors: ${errs.slice(0,2)}`);
      await page.close();
    }
    await ctx.close();
  }
  await br.close();
  console.log('\n'+nOk+' checks ok, '+fails.length+' failures');process.exit(fails.length?1:0);
})();
