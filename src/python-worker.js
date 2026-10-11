/* Disposable Pyodide worker. Mission data owns evaluation, not student stdout. */
self.onmessage=async({data})=>{
 const {id,code,missionId,level}=data||{};
 try{
  if(!['premiere','terminale'].includes(level))throw Error('Niveau indisponible');
  const manifestResponse=await fetch('../curriculum/missions/manifest.json');
  if(!manifestResponse.ok)throw Error('Catalogue indisponible');
  const manifest=await manifestResponse.json();
  const entry=manifest.missions.find(m=>m.id===missionId);
  if(!entry||!/^[a-z0-9-]+\.json$/.test(entry.path))throw Error('Évaluation indisponible');
  if(typeof code!=='string'||code.length>32768)throw Error('Code trop long (32 768 caractères maximum)');
  const response=await fetch('../curriculum/missions/'+entry.path);
  if(!response.ok)throw Error('Tests de mission indisponibles');
  const definition=await response.json();
  if(!definition.levels[level])throw Error('Parcours indisponible');
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
  const py=await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
  let output=0;
  const emit=kind=>value=>{if(output<16384){output+=value.length;self.postMessage({id,kind,value:value.slice(0,2048)})}};
  py.setStdout({batched:emit('stdout')});py.setStderr({batched:emit('stderr')});
  self.postMessage({id,kind:'ready'});
  const namespace=py.toPy({});
  try{
   await py.runPythonAsync(code,{globals:namespace});
   const results=[];
   for(const test of definition.levels[level].tests){
    let fn,args,value;
    try{
     fn=namespace.get(test.fn);if(typeof fn!=='function')throw Error('Fonction '+test.fn+' introuvable');
     args=test.args.map(arg=>py.toPy(arg));value=fn(...args);
     const actual=value?.toJs?value.toJs({dict_converter:Object.fromEntries}):value;
     results.push({label:test.label,ok:JSON.stringify(actual)===JSON.stringify(test.expected)});
    }catch(e){results.push({label:test.label,ok:false,error:String(e).slice(0,1500)})}
    finally{value?.destroy?.();fn?.destroy?.();for(const arg of args||[])arg?.destroy?.()}
   }
   self.postMessage({id,kind:'done',ok:results.every(r=>r.ok),results});
  }finally{namespace.destroy()}
 }catch(error){self.postMessage({id,kind:'done',ok:false,error:String(error).slice(0,3000)})}
};
