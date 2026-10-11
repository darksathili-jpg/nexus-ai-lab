const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
 const errors=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text())});
 await page.goto('http://127.0.0.1:8765/?quality=low',{waitUntil:'domcontentloaded'});
 await page.waitForTimeout(18000);
 await page.waitForFunction(()=>['glb','fallback'].includes(document.body.dataset.reactor),{timeout:10000}).catch(()=>{});
 fs.mkdirSync('artifacts',{recursive:true});
 await page.screenshot({path:'artifacts/atrium-desktop.png',fullPage:true});
 const result=await page.evaluate(()=>({
  fps: Number((document.querySelector('#nexus-diagnostics')?.textContent||'').match(/(\\d+) FPS/)?.[1]||0),
  renderedFrames:window.BABYLON?.Engine?.LastCreatedEngine?.getFps?.()||0,
  floorTexture:!!window.BABYLON?.Engine?.LastCreatedEngine?.scenes?.[0]?.getMaterialByName('polished dark stone')?.albedoTexture,
  canvas:!!document.querySelector('#game'),
  loaded:!document.querySelector('#loading'),
  mission:!!document.querySelector('#mission'),
  meshes:window.BABYLON?.Engine?.LastCreatedEngine?.scenes?.[0]?.meshes?.length||0,
  diagnostics:document.querySelector('#nexus-diagnostics')?.textContent||'',
  reactor:document.body.dataset.reactor||'pending',
  webgl:!!document.querySelector('canvas')
 }));
 const desktopPng=fs.readFileSync('artifacts/atrium-desktop.png');
 const imageHash=crypto.createHash('sha256').update(desktopPng).digest('hex');
 fs.writeFileSync('artifacts/diagnostics.json',JSON.stringify({result,errors,imageHash},null,2));
 console.log(JSON.stringify({result,errors},null,2));
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'artifacts/atrium-mobile.png',fullPage:true});
 const beforeVisibility=await page.evaluate(()=>window.BABYLON?.Engine?.LastCreatedEngine?.getFps?.()||0);
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 await page.waitForTimeout(500);
 const afterVisibility=await page.evaluate(()=>window.BABYLON?.Engine?.LastCreatedEngine?.getFps?.()||0);
 if(!Number.isFinite(beforeVisibility)||!Number.isFinite(afterVisibility))throw Error('Invalid FPS after visibility restoration');
 await browser.close();
 if(!result.loaded||!result.meshes||result.reactor!=='glb'||!result.floorTexture||errors.some(e=>/uncaught|syntaxerror|referenceerror|shader|uniform block|webgl|compilation/i.test(e)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
