/* Learning UI is independent of Babylon. All content comes from versioned data. */
(()=>{
 const $=id=>document.getElementById(id);let engine,definition,level='premiere',hint=0,callbacks={},ready=false;
 const drafts={};
 const message=text=>{$('learningStatus').textContent=text};
 function refresh(){
  if(!ready)return;
  const record=engine.record('M03',level);
  $('run').disabled=!record.steps.includes('experimenter');
  $('checkTransfer').disabled=!record.steps.includes('tester');
  message(record.steps.length+'/5 activités validées · '+record.attempts+' tentatives Python'+(engine.persistent()?' · sauvegarde locale':' · sauvegarde indisponible, progression en mémoire'));
  callbacks.onProgress?.();
 }
 function mark(step){try{engine.mark('M03',level,step);refresh();return true}catch(e){message(e.message);return false}}
 function render(){
  const content=definition.levels[level];
  $('task').textContent=content.task;$('code').value=drafts[level]||content.starter;
  $('publicTests').textContent=content.tests.map(t=>t.label+': '+t.fn+'('+t.args.map(a=>JSON.stringify(a)).join(', ')+') → '+JSON.stringify(t.expected)).join('\n');
  hint=0;$('help').disabled=false;$('help').textContent='Indice 1';$('helpText').textContent='';$('result').textContent='';$('transferResult').textContent='';refresh();
 }
 const loading=(async()=>{
  try{
   const get=async url=>{const r=await fetch(url);if(!r.ok)throw Error('Contenu indisponible ('+r.status+')');return r.json()};
   const [curriculum,manifest]=await Promise.all([get('./curriculum/llm-nsi.json'),get('./curriculum/missions/manifest.json')]);
   const definitions=await Promise.all(manifest.missions.map(m=>get('./curriculum/missions/'+m.path)));
   const mission=definitions.find(m=>m.id==='M03');definition=mission;let storage;try{storage=localStorage}catch(e){storage={getItem(){throw e},setItem(){throw e}}}
   engine=window.NexusMissionEngine.create(curriculum,definitions,storage);
   $('objective').textContent=mission.objective;
   $('prerequisites').textContent='Prérequis NSI : '+curriculum.modules.find(m=>m.id===mission.id).prerequisites.join(', ')+'. Atelier autonome ; aucune station prévue ne bloque cet accès.';
   for(const id of ['explanation','experimentPrompt','transferPrompt'])$(id).textContent=id==='explanation'?mission.explanation:id==='experimentPrompt'?mission.experiment.prompt:mission.transfer.prompt;
   $('transfer').append(new Option('Choisir une conclusion',''),...mission.transfer.choices.map((c,i)=>new Option(c,String(i))));
   ready=true;render();
  }catch(e){message('Chargement pédagogique impossible : '+e.message);$('run').disabled=true}
 })();
 $('level').onchange=()=>{window.nexusPython.cancel();drafts[level]=$('code').value;level=$('level').value;if(ready)render()};
 $('understand').onclick=()=>{if(!ready)return;if($('understanding').value==='no')mark('comprendre');else message('Un token peut être un sous-mot, un signe ou une unité liée aux octets. Relis puis réessaie.')};
 $('experiment').onclick=()=>{
  if(!ready)return;const text=$('sample').value,tokens=text.split(/[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/u).filter(Boolean);
  const ids=tokens.map(t=>definition.experiment.vocabulary[t]??0);
  $('experimentResult').textContent='Vocabulaire jouet : '+JSON.stringify(definition.experiment.vocabulary)+'\nMots : '+JSON.stringify(tokens)+'\nIDs : '+JSON.stringify(ids)+'\nCe découpage n’est pas celui d’un LLM ; 0 = inconnu, information perdue au décodage.';
  mark('experimenter');
 };
 $('help').onclick=()=>{if(!ready)return;$('helpText').textContent=definition.hints[hint++];$('help').textContent='Indice '+Math.min(hint+1,3);$('help').disabled=hint>=definition.hints.length};
 $('run').onclick=()=>{
  if(!ready||!engine.record('M03',level).steps.includes('experimenter'))return;
  const submittedLevel=level;engine.attempt('M03',level);$('run').disabled=true;$('result').textContent='Chargement Python (60 s max), puis exécution (12 s max)…';
  window.nexusPython.run($('code').value,msg=>{
   if(level!==submittedLevel)return;
   if(['stdout','stderr'].includes(msg.kind))$('result').textContent=($('result').textContent+'\n'+msg.value).slice(-16384);
   if(msg.kind==='done'){
    $('result').textContent=msg.error||msg.results.map(r=>(r.ok?'✓ ':'✗ ')+r.label+(r.error?' : '+r.error:'')).join('\n');
    if(msg.ok){mark('programmer');mark('tester');$('result').textContent+='\nTests réussis. Termine le transfert pour valider la mission.'}refresh();
   }
  },{missionId:definition.id,level});
 };
 $('checkTransfer').onclick=()=>{
  if(!ready||!engine.record('M03',level).steps.includes('tester'))return;
  if($('transfer').value===String(definition.transfer.answer)){
   if(mark('transferer')){$('transferResult').textContent=definition.transfer.feedback;const reward=$('reward');reward.textContent='TOKENISATION · '+level.toUpperCase()+' · 5 ACTIVITÉS VALIDÉES';reward.style.display='block';setTimeout(()=>reward.style.display='none',4200)}
  }else $('transferResult').textContent='Cette conclusion ne tient pas compte du vocabulaire et des règles du modèle. Reprends l’expérience puis justifie ton choix.';
 };
 $('close').onclick=()=>callbacks.onClose?.();
 $('mission').addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();callbacks.onClose?.()}
  if(e.key==='Tab'){
   const nodes=[...$('mission').querySelectorAll('button:not(:disabled),textarea,input,select,summary')].filter(n=>n.getClientRects().length);
   const first=nodes[0],last=nodes.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
 });
 window.NexusLearning={bind(c){callbacks=c;refresh()},open(){loading.then(()=>{refresh();$('close').focus()})},completed(){return ready&&engine.status('M03',level)==='completed'}};
})();
