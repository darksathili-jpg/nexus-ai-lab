/* Regression gate: real Babylon scene + mobile DOM, no screenshot-only assertions. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist']});
 const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,hasTouch:true,isMobile:true});
 const failures=[];
 page.on('pageerror',e=>failures.push(String(e)));
 try{
  await page.goto('http://127.0.0.1:8765/?quality=low',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#loading')?.style.display==='none'||getComputedStyle(document.querySelector('#loading')).opacity==='0',{timeout:40000});
  await page.waitForFunction(()=>!!window.BABYLON?.Engine?.LastCreatedEngine?.scenes?.[0]?.getMeshByName('station 01 reverse face panel'),{timeout:15000});
  const scene=await page.evaluate(()=>{
   const s=window.BABYLON.Engine.LastCreatedEngine.scenes[0];
   const front=s.getMeshByName('station 01 readable signage'),rear=s.getMeshByName('station 01 reverse face panel');
   return {front:!!front,rear:!!rear,differentMaterials:front?.material!==rear?.material,
    frontCull:front?.material?.backFaceCulling,rearCull:rear?.material?.backFaceCulling,
    facingOpposite:Math.abs(Math.abs(front?.rotation.y-rear?.rotation.y)-Math.PI)<.01};
  });
  assert.deepEqual(scene,{front:true,rear:true,differentMaterials:true,frontCull:true,rearCull:true,facingOpposite:true},'Station sign must have separate single-sided opposite faces');
  await page.evaluate(()=>{document.getElementById('reward').style.display='block'});
  const toast=await page.locator('#reward').boundingBox();
  const viewport=page.viewportSize();
  assert(toast&&toast.width<=Math.min(320,viewport.width*.8)+2&&toast.height<=75,'Reward toast must remain compact on mobile');
  assert(toast.x>=0&&toast.y>=0&&toast.x+toast.width<=viewport.width+1&&toast.y+toast.height<=viewport.height+1,'Reward toast must stay within viewport');
  await page.evaluate(()=>{document.getElementById('reward').style.display='none';document.getElementById('mission').style.display='block';document.body.classList.add('inMission')});
  const mission=await page.locator('#mission').boundingBox();
  assert(mission&&mission.x>=0&&mission.x+mission.width<=viewport.width+1,'Mission must fit mobile viewport horizontally');
  assert(mission.y>=0&&mission.y+mission.height<=viewport.height+1,'Mission must fit mobile viewport vertically');
  assert(await page.locator('#run').isVisible(),'Python validation action must be visible');
  assert(await page.locator('#close').isVisible(),'Mission exit must be visible');
  console.log('QUALITY GATE PASS: sign front/rear, mobile reward, mission viewport, controls');
 }finally{await browser.close()}
 assert.equal(failures.length,0,'Browser runtime errors: '+failures.slice(0,5).join(' | '));
})().catch(e=>{console.error('QUALITY GATE FAILED:',e);process.exitCode=1});
