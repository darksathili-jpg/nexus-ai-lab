/* NEXUS — performance budget, diagnostics and classroom quality scaling.
   Does not claim artistic compliance. */
window.NexusPerformance={
 setup(scene,engine){
  const B=window.BABYLON;
  const params=new URLSearchParams(location.search);
  const requested=params.get('quality');
  const mobile=/Android|iPhone|iPad/i.test(navigator.userAgent);
  const quality=['low','medium','high'].includes(requested)?requested:(mobile?'low':'medium');
  const ratio=quality==='high'?1:quality==='medium'?1.35:1.8;
  engine.setHardwareScalingLevel(ratio);
  scene.skipPointerMovePicking=true;
  const stats=document.createElement('div');
  stats.id='nexus-diagnostics';
  stats.style.cssText='position:fixed;bottom:8px;left:12px;color:#a4d6df;font:11px monospace;z-index:5;pointer-events:none;text-shadow:0 1px 2px #000';
  stats.setAttribute('aria-live','off');
  document.body.appendChild(stats);
  let ticks=0,elapsed=0,fps=0;
  scene.onAfterRenderObservable.add(()=>{
   elapsed+=engine.getDeltaTime();ticks++;
   if(elapsed>1000){fps=Math.round(ticks*1000/elapsed);elapsed=0;ticks=0;
    stats.textContent='QUALITÉ '+quality.toUpperCase()+' · '+fps+' FPS · '+scene.meshes.length+' MAILLAGES';
   }
  });
  // Babylon owns its render loop; don't register another loop on tab visibility changes.
  window.addEventListener('keydown',e=>{
   if(e.target instanceof HTMLElement&&['TEXTAREA','INPUT'].includes(e.target.tagName))return;
   if(e.key.toLowerCase()==='p'){
    const q=quality==='high'?'low':quality==='medium'?'high':'medium';
    const url=new URL(location.href);url.searchParams.set('quality',q);location.href=url.toString();
   }
  });
  return {quality,ratio,dispose(){stats.remove()}};
 }
};
