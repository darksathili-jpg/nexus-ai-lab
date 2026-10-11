const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.NEXUS_BASE_URL||'http://127.0.0.1:8765/';
const premiere='def tokeniser(texte):\n    return texte.split()';
const terminale=premiere+'\ndef encoder(tokens, vocabulaire):\n    return [vocabulaire.get(t, 0) for t in tokens]\ndef decoder(ids, vocabulaire):\n    inverse = {v:k for k,v in vocabulaire.items()}\n    return [inverse.get(i, "<UNK>") for i in ids]';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[],requests=[];page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>requests.push(r.url()+' '+(r.postData()||'')));
 const load=async()=>{await page.goto(base+'?quality=low');await page.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});await page.click('#openLearning');await page.waitForFunction(()=>document.getElementById('objective').textContent)};
 const run=async(code,level='premiere')=>page.evaluate(({code,level})=>new Promise(resolve=>window.nexusPython.run(code,m=>{if(m.kind==='done')resolve(m)},{missionId:'M03',level})),{code,level});
 const understand=async()=>{for(const [id,value] of [['word','1'],['subword','0'],['token','1'],['identifier','2']])await page.selectOption('#understanding-'+id,value);await page.click('#understand')};
 const experiment=async()=>{await page.fill('#predictSplit','2');await page.fill('#predictSubwords','3');await page.click('#savePrediction');await page.click('#experiment');await page.fill('#sample','chat !');await page.click('#experiment');await page.selectOption('#interpretation-difference','0');await page.selectOption('#interpretation-unknown','1');await page.click('#validateExperiment')};
 const executeUI=async code=>{await page.fill('#code',code);await page.click('#run');await page.waitForFunction(()=>!document.getElementById('run').disabled,null,{timeout:75000})};
 try{
  await load();assert(await page.locator('#run').isDisabled());
  const lessonURL=page.url();await page.focus('#understanding-word');await page.keyboard.press('p');await page.waitForTimeout(250);assert.equal(page.url(),lessonURL,'Quality shortcut must be inactive in the lesson');
  await page.locator('#close').focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'rubric-3');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.id),'close');
  await page.click('#understand');assert.match(await page.locator('#learningStatus').textContent(),/0\/5/);
  for(const [id,value] of [['word','1'],['subword','0'],['token','1'],['identifier','0']])await page.selectOption('#understanding-'+id,value);
  await page.click('#understand');assert.match(await page.locator('#learningStatus').textContent(),/0\/5/);assert.match(await page.locator('#understandingResult').textContent(),/revoir/);await understand();
  await page.click('#validateExperiment');assert(await page.locator('#run').isDisabled());
  await page.fill('#predictSplit','2');await page.fill('#predictSubwords','3');await page.click('#savePrediction');await page.click('#experiment');
  assert.match(await page.locator('#experimentResult').textContent(),/3 unités/);assert.match(await page.locator('#experimentResult').textContent(),/<UNK>/);assert(await page.locator('#run').isDisabled());
  await page.fill('#sample','chat !');await page.click('#experiment');await page.click('#validateExperiment');assert(await page.locator('#run').isDisabled());
  await page.selectOption('#interpretation-difference','0');await page.selectOption('#interpretation-unknown','1');await page.click('#validateExperiment');assert(await page.locator('#run').isEnabled());
  await page.fill('#code','# brouillon Première\n# NEVER_TRANSMIT_STUDENT_CODE_M03');await page.selectOption('#level','terminale');await page.fill('#code','# brouillon Terminale\n');
  await page.reload();await page.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});await page.click('#openLearning');await page.waitForFunction(()=>document.getElementById('code').value.includes('Première'));
  await page.selectOption('#level','terminale');assert.match(await page.locator('#code').inputValue(),/Terminale/);assert(await page.locator('#run').isDisabled());
  await page.click('#understand');assert.match(await page.locator('#learningStatus').textContent(),/0\/5/);
  await page.fill('#code','');await page.selectOption('#level','premiere');await page.selectOption('#level','terminale');assert.equal(await page.locator('#code').inputValue(),'');
  page.once('dialog',d=>d.dismiss());await page.click('#resetDraft');assert.equal(await page.locator('#code').inputValue(),'');
  page.once('dialog',d=>d.accept());await page.click('#resetDraft');assert.match(await page.locator('#code').inputValue(),/def encoder/);
  await understand();await experiment();
  await page.fill('#code','while True:\n    pass');await page.click('#run');await page.selectOption('#level','premiere');assert(await page.locator('#run').isEnabled());
  await executeUI('def broken(');assert.match(await page.locator('#result').textContent(),/syntaxe/);assert(await page.locator('#checkTransfer').isDisabled());
  await page.fill('#code','while True:\n    pass');await page.click('#run');await page.click('#close');await page.click('#openLearning');assert(await page.locator('#run').isEnabled());assert.match(await page.locator('#result').textContent(),/annulée/);
  await executeUI('while True:\n    pass');assert.match(await page.locator('#result').textContent(),/12 s/);assert(await page.locator('#run').isEnabled());
  await executeUI(premiere+'\n# NEVER_TRANSMIT_STUDENT_CODE_M03');assert(await page.locator('#checkTransfer').isEnabled());assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);
  await page.click('#checkTransfer');assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);
  await page.fill('#transferResponse','Un mot peut produire plusieurs tokens. Je vérifierais le tokenizer et le vocabulaire exacts de chaque modèle, avec le même texte. Notre <UNK> perd les unités inconnues ; les IDs ne mesurent pas leur sens.');
  await page.click('#checkTransfer');assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);
  for(let i=0;i<4;i++)await page.check('#rubric-'+i);await page.click('#checkTransfer');assert.match(await page.locator('#learningStatus').textContent(),/5\/5/);assert.match(await page.locator('#transferResult').textContent(),/ne certifie pas/);
  await page.fill('#sample','chats !');await page.click('#experiment');
  fs.mkdirSync('artifacts',{recursive:true});
  for(const [name,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){
   await page.setViewportSize({width,height});const box=await page.locator('#mission').boundingBox();assert(box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   for(const [suffix,section] of [['understand','stepUnderstand'],['experiment','stepExperiment'],['comparison','experimentResult'],['python','stepPython'],['transfer','stepTransfer'],['review','transferResult']]){
    await page.evaluate(id=>document.getElementById(id).scrollIntoView({block:'start'}),section);await page.screenshot({path:`artifacts/m03-1-${name}-${suffix}.png`});
   }
  }
  await page.keyboard.press('Escape');assert.equal(await page.locator('#mission').isVisible(),false);assert.equal(await page.evaluate(()=>document.activeElement.id),'openLearning');
  await page.reload();await page.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});await page.click('#openLearning');await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('5/5'));assert.match(await page.locator('#transferResponse').inputValue(),/tokenizer/);
  await page.selectOption('#level','terminale');await executeUI(terminale);assert.match(await page.locator('#result').textContent(),/Décodage/);assert(await page.locator('#checkTransfer').isEnabled());
  // Formal completeness is not semantic grading. Even a meaningless long response is labelled self-report only.
  await page.fill('#transferResponse','x'.repeat(100));for(let i=0;i<4;i++)await page.check('#rubric-'+i);await page.click('#checkTransfer');assert.match(await page.locator('#transferResult').textContent(),/ne certifie pas/);
  const good=await run(terminale,'terminale');assert.equal(good.ok,true,JSON.stringify(good));assert.equal(good.results.length,12);
  for(const code of ['def tokeniser(texte):\n    return texte.split(" ")','print("MISSION_VALIDEE")\ndef tokeniser(texte):\n    return []'])assert.equal((await run(code)).ok,false);
  const oversized=await run('x'.repeat(32769));assert.equal(oversized.ok,false);assert.match(oversized.error,/32 768/);
  const cancelled=await page.evaluate(()=>new Promise(resolve=>{let callback=false;window.nexusPython.run('while True: pass',()=>callback=true);window.nexusPython.cancel();setTimeout(()=>resolve(callback),300)}));assert.equal(cancelled,false);
  await page.route('**/src/python-worker.js',route=>route.fulfill({status:503,body:'Unavailable'}));assert.equal((await run(premiere)).ok,false);await page.unroute('**/src/python-worker.js');assert.equal((await run(premiere)).ok,true);
  await page.route('**/curriculum/missions/manifest.json',route=>route.fulfill({status:503,body:'Unavailable'}));await page.reload();await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('impossible'));assert(await page.locator('#run').isDisabled());
  await page.unroute('**/curriculum/missions/manifest.json');await page.click('#openLearning');await page.click('#retryContent');await page.waitForFunction(()=>document.getElementById('learningStatus').textContent.includes('/5 activités'));assert(await page.locator('#run').isEnabled());
  assert.equal(errors.length,0,errors.join('\n'));
  assert.equal(requests.some(r=>r.includes('NEVER_TRANSMIT_STUDENT_CODE_M03')),false,'Application must not send draft marker in requests');
  console.log('LEARNING BROWSER PASS: prediction/manipulation/interpretation gates, 4 distinctions, drafts/reload/levels/empty/reset, real Python 8/12 cases, syntax/timeout/recovery/cancel/level change, local free transfer and declared rubric, 3 resolutions, Worker/content failure recovery');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
