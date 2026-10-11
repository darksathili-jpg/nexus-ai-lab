/* Content-independent local progression. No success through visits alone. */
(function(root){
 const steps=['comprendre','experimenter','programmer','tester','transferer'];
 function create(curriculum,definitions,storage){
  const key='nexus.progress.v2';let state={};let persistent=true;
  try{const saved=JSON.parse(storage.getItem(key)||'{}');if(saved?.version===2&&saved.records&&typeof saved.records==='object'&&!Array.isArray(saved.records))state=saved.records}catch(e){persistent=false}
  const defs=new Map(definitions.map(d=>[d.id,d]));
  const modules=new Map(curriculum.modules.map(m=>[m.id,m]));
  for(const d of definitions){
   if(!modules.has(d.id)||!Number.isInteger(d.version))throw Error('Mission hors référentiel');
   for(const dep of d.moduleDependencies||[])if(!modules.has(dep)||dep===d.id)throw Error('Prérequis de module invalide');
  }
  const visiting=new Set(),visited=new Set();
  function visit(id){if(visiting.has(id))throw Error('Cycle de prérequis');if(visited.has(id))return;visiting.add(id);for(const dep of defs.get(id)?.moduleDependencies||[])visit(dep);visiting.delete(id);visited.add(id)}
  for(const d of definitions)visit(d.id);
  function record(id,level){
   const d=defs.get(id);if(!d||!d.levels[level])throw Error('Mission ou niveau indisponible');
   const k=id+':'+level,r=state[k];
   if(!r||r.version!==d.version||!Array.isArray(r.steps))state[k]={version:d.version,steps:[],attempts:0};
   const current=state[k];let count=0;
   while(count<steps.length&&current.steps.includes(steps[count]))count++;
   current.steps=steps.slice(0,count);
   current.attempts=Number.isSafeInteger(current.attempts)&&current.attempts>=0?current.attempts:0;
   return state[k];
  }
  function status(id,level){
   const d=defs.get(id);if(!d||!d.levels[level])return 'unimplemented';
   if((d.moduleDependencies||[]).some(dep=>status(dep,level)!=='completed'))return 'locked';
   const r=record(id,level);return steps.every(s=>r.steps.includes(s))?'completed':r.steps.length?'in_progress':'available';
  }
  function save(){try{storage.setItem(key,JSON.stringify({version:2,records:state}));persistent=true}catch(e){persistent=false}}
  return {status,record,persistent:()=>persistent,
   mark(id,level,step){if(!steps.includes(step))throw Error('Étape invalide');if(status(id,level)==='locked')throw Error('Mission verrouillée');const r=record(id,level);const preceding=steps.slice(0,steps.indexOf(step));if(!preceding.every(s=>r.steps.includes(s)))throw Error('Terminer les étapes précédentes');if(!r.steps.includes(step))r.steps.push(step);save();return status(id,level)},
   attempt(id,level){const r=record(id,level);r.attempts++;save()},
   modules:()=>curriculum.modules.map(m=>({...m,status:status(m.id,'premiere')}))};
 }
 root.NexusMissionEngine={create,steps};
})(typeof window==='undefined'?globalThis:window);
