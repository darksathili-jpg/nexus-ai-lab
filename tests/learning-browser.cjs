const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const run=async(code,level='premiere')=>page.evaluate(({code,level})=>new Promise(resolve=>window.nexusPython.run(code,m=>{if(m.kind==='done')resolve(m)},{missionId:'M03',level})),{code,level});
 try{
  await page.goto((process.env.NEXUS_BASE_URL||'http://127.0.0.1:8765/')+'?quality=low');
  await page.waitForFunction(()=>!document.getElementById('loading'),{timeout:60000});
  await page.locator('#openLearning').click();await page.waitForFunction(()=>document.getElementById('objective').textContent.length>0);
  await page.locator('#close').focus();await page.keyboard.press('Shift+Tab');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'transfer');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'close');
  assert(await page.locator('#run').isDisabled());
  await page.selectOption('#understanding','no');await page.click('#understand');
  await page.click('#experiment');assert(await page.locator('#run').isEnabled());
  await page.fill('#code','def tokeniser(texte):\n    return texte.split()');await page.click('#run');
  await page.waitForFunction(()=>document.getElementById('checkTransfer').disabled===false,{timeout:75000});
  assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);
  await page.selectOption('#transfer','0');await page.click('#checkTransfer');assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);
  await page.selectOption('#transfer','1');await page.click('#checkTransfer');assert.match(await page.locator('#learningStatus').textContent(),/5\/5/);
  fs.mkdirSync('artifacts',{recursive:true});
  for(const [name,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
   await page.setViewportSize({width,height});
   const box=await page.locator('#mission').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.evaluate(()=>document.getElementById('mission').scrollTop=0);
   await page.screenshot({path:'artifacts/tokenisation-'+name+'.png'});
   await page.evaluate(()=>document.getElementById('mission').scrollTop=document.getElementById('mission').scrollHeight);
   await page.screenshot({path:'artifacts/tokenisation-'+name+'-transfer.png'});
  }
  await page.keyboard.press('Escape');assert.equal(await page.locator('#mission').isVisible(),false);
  await page.reload();await page.waitForFunction(()=>!document.getElementById('loading'),{timeout:60000});await page.click('#openLearning');
  await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('5/5'));
  await page.selectOption('#level','terminale');assert(await page.locator('#run').isDisabled());
  const solution='def tokeniser(texte):\n    return texte.split()\ndef encoder(tokens, vocabulaire):\n    return [vocabulaire.get(t, 0) for t in tokens]\ndef decoder(ids, vocabulaire):\n    inverse = {v:k for k,v in vocabulaire.items()}\n    return [inverse.get(i, "<UNK>") for i in ids]';
  await page.selectOption('#understanding','no');await page.click('#understand');await page.click('#experiment');
  await page.fill('#code',solution);await page.click('#run');
  await page.waitForFunction(()=>!document.getElementById('checkTransfer').disabled,{timeout:75000});
  await page.selectOption('#transfer','1');await page.click('#checkTransfer');assert.match(await page.locator('#learningStatus').textContent(),/5\/5/);
  const terminale=await run(solution,'terminale');
  assert.equal(terminale.ok,true,JSON.stringify(terminale));assert.equal(terminale.results.length,12);
  const wrong=await run('def tokeniser(texte):\n    return texte.split(" ")');assert.equal(wrong.ok,false);
  const fake=await run('print("MISSION_VALIDEE")\ndef tokeniser(texte):\n    return []');assert.equal(fake.ok,false);
  const syntax=await run('def broken(');assert.equal(syntax.ok,false);assert.match(syntax.error,/SyntaxError/);
  const timeout=await run('while True:\n    pass');assert.equal(timeout.ok,false);assert.match(timeout.error,/12 s/);
  const recovery=await run('def tokeniser(texte):\n    return texte.split()');assert.equal(recovery.ok,true);
  const cancelled=await page.evaluate(()=>new Promise(resolve=>{let callback=false;window.nexusPython.run('while True: pass',()=>callback=true);window.nexusPython.cancel();setTimeout(()=>resolve(callback),300)}));assert.equal(cancelled,false);
  await page.route('**/curriculum/missions/manifest.json',route=>route.fulfill({status:503,body:'Unavailable'}));
  await page.reload();await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('impossible'));
  assert(await page.locator('#run').isDisabled());
  assert.equal(errors.length,0,errors.join('\n'));
  console.log('LEARNING BROWSER PASS: five activities, persistence, level separation, 3 resolutions, real Python 8/12 cases, failure, syntax, timeout, recovery, cancellation');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
