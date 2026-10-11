const {chromium}=require('playwright');const assert=require('node:assert/strict');
const base=process.env.NEXUS_BASE_URL||'http://127.0.0.1:8765/';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader']});
 const open=async page=>{await page.goto(base+'?quality=low');await page.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});await page.click('#openLearning');await page.waitForFunction(()=>document.getElementById('objective').textContent)};
 try{
  for(const mode of ['corrupt','quota','denied','migration']){
   const context=await browser.newContext();const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
   await page.addInitScript(mode=>{
    if(mode==='denied'){Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError')}});return}
    if(mode==='quota')Storage.prototype.setItem=function(){throw new DOMException('Quota','QuotaExceededError')};
    if(mode==='corrupt')localStorage.setItem('nexus.m03.drafts.v1','{corrupt');
    if(mode==='migration'&&!localStorage.getItem('nexus.progress.v2'))localStorage.setItem('nexus.progress.v2',JSON.stringify({version:2,records:{'M03:premiere':{version:1,steps:['comprendre','experimenter','programmer','tester','transferer'],attempts:3}}}));
   },mode);
   await open(page);
   if(mode==='migration'){
    assert.match(await page.locator('#learningStatus').textContent(),/0\/5/);assert.match(await page.locator('#learningStatus').textContent(),/3 tentatives/);
    for(const [id,v] of [['word','1'],['subword','0'],['token','1'],['identifier','2']])await page.selectOption('#understanding-'+id,v);await page.click('#understand');
    await page.fill('#predictSplit','2');await page.fill('#predictSubwords','3');await page.click('#savePrediction');await page.click('#experiment');await page.fill('#sample','chat !');await page.click('#experiment');await page.selectOption('#interpretation-difference','0');await page.selectOption('#interpretation-unknown','1');await page.click('#validateExperiment');
    assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);assert.match(await page.locator('#result').textContent(),/antérieure conservée/);
   }else{
    await page.fill('#code','# local draft '+mode);assert.match(await page.locator('#draftStatus').textContent(),/impossible|corrompu|indisponible/);
    await page.selectOption('#level','terminale');await page.selectOption('#level','premiere');assert.equal(await page.locator('#code').inputValue(),'# local draft '+mode);
    if(mode==='corrupt')assert.equal(await page.evaluate(()=>localStorage.getItem('nexus.m03.drafts.v1')),'{corrupt');
   }
   assert.equal(errors.length,0,errors.join('\n'));await context.close();
  }
  const page=await browser.newPage();let block=true;
  await page.route('**/curriculum/missions/tokenisation.json',r=>block?r.fulfill({status:200,contentType:'application/json',body:'{"id":"M03"}'}):r.continue());
  await page.goto(base+'?quality=low');await page.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});await page.click('#openLearning');await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('impossible'));assert(await page.locator('#run').isDisabled());
  block=false;await page.click('#retryContent');await page.waitForFunction(()=>document.getElementById('objective').textContent);
  await page.unroute('**/curriculum/missions/tokenisation.json');
  await page.route('**/curriculum/missions/manifest.json',r=>new Promise(resolve=>setTimeout(()=>resolve(r.abort().catch(()=>{})),17000)));
  await page.reload();await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('15 s'),null,{timeout:20000});assert(await page.locator('#run').isDisabled());
  await page.unroute('**/curriculum/missions/manifest.json');await page.click('#openLearning');await page.click('#retryContent');await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('/5 activités'));
  console.log('STORAGE/LOAD BROWSER PASS: corrupt/quota/denied memory fallback, per-level drafts, historical migration, malformed mission, 15s loading timeout and retry');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
