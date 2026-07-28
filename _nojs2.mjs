import { chromium } from '@playwright/test';
const b=await chromium.launch();
const p=await (await b.newContext({viewport:{width:1440,height:1200},colorScheme:'dark',javaScriptEnabled:false})).newPage();
for (const u of ['/about','/projects','/contact','/']) {
  await p.goto('http://localhost:3311'+u,{waitUntil:'load'}); await p.waitForTimeout(1000);
  const r=await p.evaluate(()=>{
    const vis=el=>{const c=getComputedStyle(el),bb=el.getBoundingClientRect();
      return bb.height>0 && c.opacity!=='0' && c.visibility!=='hidden';};
    const rises=[...document.querySelectorAll('.rise')], revs=[...document.querySelectorAll('.reveal')];
    return {rise:`${rises.filter(vis).length}/${rises.length}`,
            reveal:`${revs.filter(vis).length}/${revs.length}`,
            hiddenSample:(revs.find(e=>!vis(e))?.textContent||'').replace(/\s+/g,' ').trim().slice(0,38),
            chars:document.body.innerText.replace(/\s+/g,' ').trim().length};
  });
  console.log(`${u.padEnd(11)} .rise ${r.rise} visible | .reveal ${r.reveal} visible | ${r.chars} chars of text`);
  if(r.hiddenSample) console.log(`            still hidden: "${r.hiddenSample}"`);
}
await b.close();
