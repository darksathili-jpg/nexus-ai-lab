/* NEXUS Python mission runner — hard timeout by terminating the worker. */
(()=>{let active=null,serial=0;
window.nexusPython={
 run(code,onMessage){
  if(active){active.worker.terminate();clearTimeout(active.timeout)}
  const id=++serial,worker=new Worker('./src/python-worker.js');
  const finish=(data)=>{if(!active||active.id!==id)return;clearTimeout(active.timeout);worker.terminate();active=null;onMessage(data)};
  const timeout=setTimeout(()=>finish({kind:'done',ok:false,error:'Temps maximal dépassé (12 s). Le moteur Python a été arrêté.'}),12000);
  active={id,worker,timeout};
  worker.onmessage=e=>{if(e.data?.id!==id)return;if(e.data.kind==='done')finish(e.data);else onMessage(e.data)};
  worker.onerror=e=>finish({kind:'done',ok:false,error:'Impossible de charger Python : vérifie la connexion réseau et la console.'});
  worker.postMessage({id,code});
 },
 cancel(){if(active){clearTimeout(active.timeout);active.worker.terminate();active=null}}
};
})();
