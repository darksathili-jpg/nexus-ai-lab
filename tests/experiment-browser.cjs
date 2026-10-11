const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');
const base=process.env.NEXUS_BASE_URL||'http://127.0.0.1:8765/';const definition=require('../curriculum/missions/tokenisation.json');
const code='def tokeniser(texte):\n    return texte.split()\ndef encoder(tokens, vocabulaire):\n    return [vocabulaire.get(t, 0) for t in tokens]\ndef decoder(ids, vocabulaire):\n    inverse = {v:k for k,v in vocabulaire.items()}\n    return [inverse.get(i, "<UNK>") for i in ids]';
(async()=>{const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
try{
 for(const level of ['premiere','terminale'])for(const partial of [false,true]){
  const context=await browser.newContext({viewport:{width:1440,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  if(partial)await page.addInitScript(({level})=>{if(!localStorage.getItem('nexus.progress.v2'))localStorage.setItem('nexus.progress.v2',JSON.stringify({version:2,records:{['M03:'+level]:{version:1,pedagogyRevision:2,steps:['comprendre'],attempts:0,evidence:{prediction:{split:2,simulation:3},observations:['chats !',...Array.from({length:12},(_,i)=>'example'+i)],interpretation:{difference:'0',unknown:'0'}}}}}))},{level});
  const open=async()=>{await page.waitForFunction(()=>!document.getElementById('loading'),null,{timeout:60000});await page.click('#openLearning');await page.waitForFunction(()=>document.getElementById('objective').textContent);await page.selectOption('#level',level)};
  await page.goto(base+'?quality=low');await open();
  if(!partial){for(const q of definition.understanding)await page.selectOption('#understanding-'+q.id,q.answer);await page.click('#understand')}
  assert.match(await page.locator('#learningStatus').textContent(),/1\/5/);assert(await page.locator('#run').isDisabled());assert.match(await page.locator('#pythonLock').textContent(),/verrouillé/);
  await page.click('#pythonUnlockLink');assert.equal(await page.evaluate(()=>document.activeElement.id),'stepExperiment');
  if(!partial){await page.click('#validateExperiment');assert.match(await page.locator('#experimentStatus').textContent(),/Prédiction enregistrée/);await page.fill('#predictSplit','2');await page.fill('#predictSubwords','3');await page.click('#savePrediction');await page.click('#experiment');await page.click('#experiment');assert.equal(await page.locator('#experimentChecklist li[data-complete="true"]').count(),2);await page.click('#validateExperiment');assert.match(await page.locator('#experimentStatus').textContent(),/Deuxième texte distinct/);for(let i=0;i<12;i++){await page.fill('#sample','example'+i);await page.click('#experiment')}}
  assert.equal(await page.locator('#experimentChecklist li[data-complete="true"]').count(),3);assert(await page.locator('#run').isDisabled());
  for(const q of definition.experiment.interpretation)await page.selectOption('#interpretation-'+q.id,q.answer);
  assert.equal(await page.locator('#experimentChecklist li[data-complete="true"]').count(),4);
  // A partial dossier must preserve observations AND answers before validation.
  await page.reload();await open();assert.match(await page.locator('#learningStatus').textContent(),/1\/5/);assert.equal(await page.locator('#experimentChecklist li[data-complete="true"]').count(),4);
  const state=await page.evaluate(level=>JSON.parse(localStorage.getItem('nexus.progress.v2')).records['M03:'+level],level);assert(state.evidence.observations.includes('chats !'));assert.equal(new Set(state.evidence.observations).size,state.evidence.observations.length);assert(state.evidence.observations.length<=10);assert.deepEqual(state.steps,['comprendre']);
  await page.click('#validateExperiment');assert.match(await page.locator('#learningStatus').textContent(),/2\/5/);assert(await page.locator('#run').isEnabled());assert.match(await page.locator('#pythonLock').textContent(),/Python prêt/);
  fs.mkdirSync('artifacts',{recursive:true});
  if(level==='premiere'&&!partial){for(const [name,width,height] of [['desktop',1440,900],['portrait',390,844],['landscape',844,390]]){await page.setViewportSize({width,height});await page.locator('#experimentChecklist').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/experiment-unlocked-'+name+'.png'});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}await page.setViewportSize({width:1440,height:900})}
  await page.reload();await open();assert.match(await page.locator('#learningStatus').textContent(),/2\/5/);assert(await page.locator('#run').isEnabled());
  if(level==='premiere'&&!partial){await page.locator('#run').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/experiment-python-ready.png'})}
  await page.fill('#code',code);await page.click('#run');await page.waitForFunction(()=>!document.getElementById('run').disabled,null,{timeout:75000});assert.match(await page.locator('#result').textContent(),/Tests réussis/);assert.match(await page.locator('#learningStatus').textContent(),/4\/5/);assert.equal(errors.length,0,errors.join('\n'));
  console.log('EXPERIMENT PASS',level,partial?'partial dossier':'fresh storage','1/5 -> 2/5, indicators, answers/reload, >10 comparisons, Python, no JS errors');await context.close();
 }
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
