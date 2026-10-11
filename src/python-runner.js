/* NEXUS Python mission runner — hard timeout by terminating the worker. */
(()=>{let active=null,serial=0;
window.nexusPython={
 run(code,onMessage,options={missionId:'M03',level:'premiere'}){
  window.nexusPython.cancel();
  const id=++serial;let worker;
  try{worker=new Worker('./src/python-worker.js')}catch(e){active=null;onMessage({kind:'done',ok:false,error:'Impossible de créer le Worker Python : '+String(e)});return}
  const current=()=>active?.id===id;
  const finish=(data)=>{if(!current())return;clearTimeout(active.timeout);worker.terminate();active=null;onMessage(data)};
  const timeout=setTimeout(()=>finish({kind:'done',ok:false,error:'Chargement de Python trop long (60 s). Vérifie la connexion puis réessaie.'}),60000);
  active={id,worker,timeout,ready:false};
  worker.onmessage=e=>{
   if(!current()||e.data?.id!==id)return;
   if(e.data.kind==='ready'&&!active.ready){active.ready=true;clearTimeout(active.timeout);active.timeout=setTimeout(()=>finish({kind:'done',ok:false,error:'Temps maximal dépassé (12 s). Le moteur Python a été arrêté.'}),12000)}
   if(e.data.kind==='done')finish(e.data);else onMessage(e.data);
  };
  worker.onerror=e=>{e.preventDefault?.();finish({kind:'done',ok:false,error:'Impossible de charger Python : vérifie la connexion réseau puis réessaie.'})};
  try{worker.postMessage({id,code,missionId:options.missionId,level:options.level})}catch(e){finish({kind:'done',ok:false,error:'Envoi à Python impossible : '+String(e)})}
 },
 cancel(){if(active){clearTimeout(active.timeout);active.worker.terminate();active=null}}
};
})();
