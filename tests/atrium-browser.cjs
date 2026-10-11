const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
 await page.goto('http://127.0.0.1:8765/?quality=low',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(18000);
 fs.mkdirSync('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/atrium-desktop.png',fullPage:true});
 const result=await page.evaluate(()=>({
  canvas:!!document.querySelector('#game'),
  loaded:!document.querySelector('#loading'),
  mission:!!document.querySelector('#mission'),
  meshes:window.BABYLON?.Engine?.LastCreatedEngine?.scenes?.[0]?.meshes?.length||0,
  diagnostics:document.querySelector('#nexus-diagnostics')?.textContent||'',
  webgl:!!document.querySelector('#game')?.getContext('webgl2')
 }));
 fs.writeFileSync('artifacts/diagnostics.json',JSON.stringify({result,errors},null,2));
 console.log(JSON.stringify({result,errors},null,2));
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'artifacts/atrium-mobile.png',fullPage:true});
 await browser.close();
 if(!result.loaded||!result.meshes||errors.some(e=>/uncaught|syntaxerror|referenceerror/i.test(e)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
