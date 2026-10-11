/* M03 adapter. Science, tests and rubric are content; Babylon only opens the panel. */
(()=>{
 const $=id=>document.getElementById(id);
 let engine,definition,store,level='premiere',hint=0,callbacks={},ready=false,busy=false,runSerial=0,loadSerial=0;
 let loading=Promise.resolve(),dossier={};
 const message=text=>{$('learningStatus').textContent=text};
 const checklist=document.createElement('ul');checklist.id='experimentChecklist';checklist.setAttribute('aria-label','Conditions de validation de l’expérience');$('validateExperiment').before(checklist);
 const diagnostics=document.createElement('p');diagnostics.id='experimentDiagnostics';diagnostics.className='help';$('experimentStatus').after(diagnostics);
 const lock=document.createElement('p');lock.id='pythonLock';lock.setAttribute('role','status');
 const jump=document.createElement('a');jump.id='pythonUnlockLink';jump.textContent='Aller à l’étape manquante';jump.style.color='#7fe6e8';$('run').after(lock,jump);$('run').setAttribute('aria-describedby','pythonLock');
 jump.onclick=e=>{e.preventDefault();const target=$(jump.dataset.target);target?.scrollIntoView({block:'start'});if(target){target.tabIndex=-1;target.focus({preventScroll:true})}};
 function observations(values){const unique=[...new Set((Array.isArray(values)?values:[]).filter(s=>typeof s==='string'&&s.length<=1000))];const initial=definition.experiment.initial;return unique.includes(initial)?[initial,...unique.filter(s=>s!==initial).slice(-9)]:unique.slice(-10)}
 function experimentConditions(){return [!!dossier.prediction,dossier.observations.includes(definition.experiment.initial),dossier.observations.some(s=>s!==definition.experiment.initial),definition.experiment.interpretation.every(q=>$('interpretation-'+q.id).value===q.answer)]}
 const conditionLabels=['Prédiction enregistrée','Premier texte comparé (« chats ! »)','Deuxième texte distinct comparé','Deux réponses d’interprétation correctes'];
 function showExperiment(){
  if(!ready)return;
  const flags=experimentConditions();checklist.replaceChildren();flags.forEach((ok,i)=>{const item=document.createElement('li');item.dataset.complete=String(ok);item.textContent=(ok?'✓ ':'À compléter : ')+conditionLabels[i];checklist.append(item)});
  const r=engine.record('M03',level);diagnostics.textContent='État local · '+(level==='premiere'?'Première':'Terminale')+' · '+new Set(dossier.observations).size+' texte(s) distinct(s) conservé(s) · réponses renseignées : '+definition.experiment.interpretation.filter(q=>$('interpretation-'+q.id).value!=='').length+'/2 · expérience '+(r.steps.includes('experimenter')?'validée':'à valider')+' · '+(engine.persistent()?'sauvegarde disponible':'sauvegarde indisponible, état en mémoire');
 }
 function showLock(){
  let reason,target;
  if(!ready){reason='Python indisponible : le contenu pédagogique doit être chargé.';target='retryContent'}
  else if(busy){reason='Python occupé : chargement ou exécution en cours. Fermer l’atelier annule l’exécution.';target=null}
  else{const r=engine.record('M03',level);if(!r.steps.includes('comprendre')){reason='Python verrouillé : valider la compréhension.';target='stepUnderstand'}else if(!r.steps.includes('experimenter')){const flags=experimentConditions(),missing=conditionLabels.filter((_,i)=>!flags[i]);reason='Python verrouillé : '+(missing.length?'compléter '+missing.join(' ; '):'les quatre conditions sont remplies ; cliquer sur « Interpréter et terminer l’expérience »')+'.';target='stepExperiment'}else reason='Python prêt : les prérequis sont validés.'}
  lock.textContent=reason;jump.hidden=!target;jump.dataset.target=target||'';jump.href='#'+(target||'stepPython');
 }
 const questions=(container,items,prefix)=>{
  $(container).replaceChildren();
  for(const q of items){const block=document.createElement('div');block.className='question';
   const label=document.createElement('label');label.htmlFor=prefix+q.id;label.textContent=q.prompt;
   const select=document.createElement('select');select.id=prefix+q.id;select.append(new Option('Choisir une réponse',''),...q.choices.map((c,i)=>new Option(c,String(i))));block.append(label,select);$(container).append(block)}
 };
 function saveDossier(){engine.evidence('M03',level,dossier)}
 function draftStatus(){
  $('draftStatus').textContent=store.warning()||(store.get(level)===undefined?'Brouillon initial : sauvegarde locale dès ta première modification.':'Brouillon sauvegardé localement pour '+(level==='premiere'?'Première':'Terminale')+'.');
 }
 function refresh(){
  if(!ready)return;
  const r=engine.record('M03',level),understood=r.steps.includes('comprendre');
  $('run').disabled=busy||!r.steps.includes('experimenter');
  $('checkTransfer').disabled=busy||!r.steps.includes('tester');
  $('savePrediction').disabled=!understood||!!dossier.prediction;
  $('predictSplit').disabled=!!dossier.prediction;$('predictSubwords').disabled=!!dossier.prediction;
  $('experiment').disabled=!understood||!dossier.prediction;
  message(r.steps.length+'/5 activités réalisées · '+r.attempts+' tentative'+(r.attempts===1?'':'s')+' Python'+(engine.persistent()?' · dossier local':' · sauvegarde du dossier indisponible, copie tes réponses')+(r.steps.includes('transferer')?' · autoévaluation déclarée, maîtrise à relire par enseignant':''));
  callbacks.onProgress?.();
  showExperiment();showLock();
 }
 function mark(step){try{engine.mark('M03',level,step);refresh();return true}catch(e){message(e.message);return false}}
 function restoreDossier(){
  const e=engine.record('M03',level).evidence||{};
  dossier={};
  if(e.prediction&&[e.prediction.split,e.prediction.simulation].every(n=>Number.isSafeInteger(n)&&n>=0&&n<=1000))dossier.prediction={...e.prediction};
  dossier.observations=observations(e.observations);
  dossier.interpretation={};for(const q of definition.experiment.interpretation){const value=e.interpretation?.[q.id];if(typeof value==='string'&&q.choices.some((_,i)=>String(i)===value)){dossier.interpretation[q.id]=value;$('interpretation-'+q.id).value=value}}
  dossier.response=typeof e.response==='string'?e.response.slice(0,4000):'';
  dossier.rubric=Array.isArray(e.rubric)?e.rubric.filter(n=>Number.isInteger(n)&&n>=0&&n<4):[];
  if(e.review==='auto-evaluation-declaree')dossier.review=e.review;
  $('predictSplit').value=dossier.prediction?.split??'';$('predictSubwords').value=dossier.prediction?.simulation??'';
  $('predictionStatus').textContent=dossier.prediction?'Prédiction conservée : '+dossier.prediction.split+' unités split(), '+dossier.prediction.simulation+' unités simulées.':'';
  $('sample').value=definition.experiment.initial;$('experimentResult').textContent='';
  $('transferResponse').value=dossier.response;
  definition.transfer.rubric.forEach((_,i)=>$('rubric-'+i).checked=dossier.rubric.includes(i));
 }
 function render(){
  const content=definition.levels[level];
  $('task').textContent=content.task;$('code').value=store.get(level)??content.starter;
  $('publicTests').textContent=content.tests.map(t=>t.label+': '+t.fn+'('+t.args.map(a=>JSON.stringify(a)).join(', ')+') → '+JSON.stringify(t.expected)).join('\n');
  questions('understandingQuestions',definition.understanding,'understanding-');questions('interpretationQuestions',definition.experiment.interpretation,'interpretation-');
  hint=0;$('help').disabled=false;$('help').textContent='Indice 1';$('helpText').textContent='';
  for(const id of ['result','transferResult','understandingResult','experimentStatus'])$(id).textContent='';
  restoreDossier();draftStatus();refresh();
  for(const q of definition.experiment.interpretation)$('interpretation-'+q.id).onchange=()=>{dossier.interpretation[q.id]=$('interpretation-'+q.id).value;saveDossier();showExperiment();showLock();$('experimentStatus').textContent='Réponses enregistrées. '+(experimentConditions().every(Boolean)?'Les quatre conditions sont remplies : valide l’expérience.':'Conditions restantes : '+conditionLabels.filter((_,i)=>!experimentConditions()[i]).join(' ; ')+'.')};
 }
 async function load(){
  const serial=++loadSerial,controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
  ready=false;$('retryContent').hidden=true;message('Chargement du référentiel…');
  checklist.textContent='Chargement des conditions…';showLock();
  $('code').disabled=true;$('transferResponse').disabled=true;
  for(const id of ['run','understand','savePrediction','experiment','validateExperiment','checkTransfer','resetDraft','help'])$(id).disabled=true;
  try{
   const get=async url=>{const r=await fetch(url,{signal:controller.signal});if(!r.ok)throw Error('Contenu indisponible ('+r.status+')');return r.json()};
   const [curriculum,manifest]=await Promise.all([get('./curriculum/llm-nsi.json'),get('./curriculum/missions/manifest.json')]);
   if(!Array.isArray(manifest.missions)||manifest.missions.some(m=>!m.id||!/^[a-z0-9-]+\.json$/.test(m.path)))throw Error('Catalogue incompatible');
   const definitions=await Promise.all(manifest.missions.map(m=>get('./curriculum/missions/'+m.path)));
   if(serial!==loadSerial)return;
   definition=window.NexusTokenisation.validate(definitions.find(m=>m.id==='M03'));
   let storage;try{storage=localStorage}catch(e){storage={getItem(){throw e},setItem(){throw e}}}
   engine=window.NexusMissionEngine.create(curriculum,definitions,storage);store=window.NexusDraftStore.create(storage);
   $('objective').textContent=definition.objective;
   const module=curriculum.modules.find(m=>m.id===definition.id);if(!module)throw Error('Module absent du référentiel');
   $('prerequisites').textContent='Prérequis NSI : '+module.prerequisites.join(', ')+'. Atelier autonome.';
   const text={explanation:definition.explanation,experimentPrompt:definition.experiment.prompt,simulationRule:definition.experiment.rule,transferPrompt:definition.transfer.prompt,transferNotice:definition.transfer.notice};
   for(const [id,value] of Object.entries(text))$(id).textContent=value;
   $('transferRubric').replaceChildren();const legend=document.createElement('legend');legend.textContent='Grille d’autoévaluation — coche les critères argumentés dans ta note';$('transferRubric').append(legend);
   definition.transfer.rubric.forEach((text,i)=>{const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.id='rubric-'+i;input.onchange=saveTransfer;label.append(input,document.createTextNode(text));$('transferRubric').append(label)});
   ready=true;$('code').disabled=false;$('transferResponse').disabled=false;for(const id of ['understand','validateExperiment','resetDraft','help'])$(id).disabled=false;render();
  }catch(e){if(serial===loadSerial){message('Chargement pédagogique impossible : '+(e.name==='AbortError'?'délai de 15 s dépassé':e.message)+'. Le jeu reste accessible ; réessaie le chargement.');$('retryContent').hidden=false;showLock()}}
  finally{clearTimeout(timeout)}
 }
 $('retryContent').onclick=()=>{loading=load()};loading=load();
 function pause(){const wasBusy=busy;runSerial++;window.nexusPython?.cancel();busy=false;if(ready){if(wasBusy)$('result').textContent='Exécution annulée. Brouillon conservé ; tu peux relancer les tests.';draftStatus();refresh()}}
 $('level').onchange=()=>{pause();if(ready)store.set(level,$('code').value);level=$('level').value;if(ready)render()};
 $('code').oninput=()=>{if(ready){store.set(level,$('code').value);draftStatus()}};
 $('resetDraft').onclick=()=>{
  if(!ready)return;
  if(!window.confirm('Réinitialiser volontairement le brouillon '+level+' ? Le code actuel sera remplacé ; la progression et le brouillon de l’autre niveau seront conservés. Si le stockage est corrompu, cette confirmation autorise la réparation du fichier local des brouillons.'))return;
  pause();store.reset(level,true);$('code').value=definition.levels[level].starter;store.set(level,$('code').value);draftStatus();
 };
 $('understand').onclick=()=>{
  if(!ready)return;const wrong=definition.understanding.filter(q=>$('understanding-'+q.id).value!==q.answer);
  for(const q of definition.understanding)$('understanding-'+q.id).setAttribute('aria-invalid',String(wrong.includes(q)));
  if(wrong.length){$('understandingResult').textContent=wrong.length+' réponse(s) à revoir : distingue unité de langue, unité de découpage et étiquette du vocabulaire.';return}
  if(mark('comprendre'))$('understandingResult').textContent='Distinctions correctes. Prédis maintenant les deux découpages.';
 };
 $('savePrediction').onclick=()=>{
  if(!ready||dossier.prediction||!engine.record('M03',level).steps.includes('comprendre'))return;
  const values=[$('predictSplit').value,$('predictSubwords').value];
  if(values.some(v=>v===''||!Number.isInteger(Number(v))||Number(v)<0||Number(v)>1000)){$('predictionStatus').textContent='Saisis deux nombres entiers entre 0 et 1000 avant de comparer.';return}
  dossier.prediction={split:Number(values[0]),simulation:Number(values[1])};saveDossier();$('predictionStatus').textContent='Prédiction enregistrée avant observation. Une prédiction incorrecte peut être discutée et révisée dans ton interprétation.';refresh();
 };
 $('experiment').onclick=()=>{
  if(!ready||!dossier.prediction||!engine.record('M03',level).steps.includes('comprendre'))return;
  const text=$('sample').value,result=window.NexusTokenisation.compare(text,definition.experiment);
  const rows=[['split() — blancs',result.split],['Sous-mots — simulation manuelle',result.simulation]];
  $('experimentResult').textContent='Texte : '+JSON.stringify(text)+'\nVocabulaire jouet : '+JSON.stringify(definition.experiment.vocabulary)+'\n'+rows.map(([label,r])=>label+' : '+r.units.length+' unités\nUnités : '+JSON.stringify(r.units)+'\nIDs : '+JSON.stringify(r.ids)+'\nDécodage des unités : '+JSON.stringify(r.decoded)+'\nInconnues : '+r.unknowns).join('\n\n')+'\n\nLes blancs sont omis : même sans <UNK>, les listes ne reconstruisent pas la mise en forme originale. Ceci n’est pas un tokenizer industriel.';
  dossier.observations=observations([...dossier.observations,text]);saveDossier();showExperiment();showLock();
  $('experimentStatus').textContent=dossier.observations.length+' texte(s) distinct(s) observé(s). Comparer ne valide pas l’étape : interprète les résultats.';
 };
 $('validateExperiment').onclick=()=>{
  if(!ready){$('experimentStatus').textContent='Contenu pédagogique indisponible : recharge le contenu.';return}
  const flags=experimentConditions();showExperiment();showLock();
  if(!engine.record('M03',level).steps.includes('comprendre')){$('experimentStatus').textContent='Valide d’abord la compréhension.';return}
  if(!flags.every(Boolean)){$('experimentStatus').textContent='Validation impossible. À compléter : '+conditionLabels.filter((_,i)=>!flags[i]).join(' ; ')+'.';return}
  if(mark('experimenter')){
   $('experimentStatus').textContent='Prédiction, manipulation et interprétation enregistrées.';
   if(engine.record('M03',level).pythonValidated){mark('programmer');mark('tester');$('result').textContent='Réussite Python antérieure conservée : contrat de tests inchangé. Tu peux néanmoins refaire les tests.'}
  }else $('experimentStatus').textContent='Validation impossible : '+$('learningStatus').textContent;
 };
 $('help').onclick=()=>{if(!ready)return;$('helpText').textContent=definition.hints[hint++];$('help').textContent='Indice '+Math.min(hint+1,3);$('help').disabled=hint>=definition.hints.length};
 function feedback(msg){
  if(msg.error){const error=msg.error;
   const advice=/SyntaxError|IndentationError/.test(error)?'Vérifie la syntaxe, les deux-points et l’indentation.':/NameError/.test(error)?'Vérifie les noms et les variables définies.':/TypeError/.test(error)?'Vérifie le type des paramètres et de la valeur renvoyée.':/12 s/.test(error)?'Vérifie que tes boucles peuvent terminer, puis relance.':/charg|Catalogue|indisponible|importScripts|loadPyodide|NetworkError|Failed to fetch|failed to load/i.test(error)?'Vérifie la connexion et réessaie ; ton brouillon est conservé.':'Consulte le détail et corrige une cause à la fois.';
   return advice+'\nDétail Python : '+error;
  }
  if(!Array.isArray(msg.results))return 'Réponse Python incomplète. Réessaie ; aucun progrès n’est accordé.';
  return msg.results.map(r=>(r.ok?'✓ ':'✗ ')+r.label+(r.ok?'':r.error?' — Vérifie le nom de la fonction, ses paramètres et son type de retour.\n'+r.error:' — Résultat différent du contrat public ; vérifie les cas limites dans la liste de tests.')).join('\n');
 }
 $('run').onclick=()=>{
  if(!ready||busy||!engine.record('M03',level).steps.includes('experimenter'))return;
  const serial=++runSerial,submittedLevel=level;engine.attempt('M03',level);store.set(level,$('code').value);draftStatus();busy=true;refresh();
  $('result').textContent='Chargement Python (60 s max), puis exécution (12 s max)…';
  window.nexusPython.run($('code').value,msg=>{
   if(serial!==runSerial||level!==submittedLevel)return;
   if(['stdout','stderr'].includes(msg.kind))$('result').textContent=($('result').textContent+'\n'+msg.value).slice(-16384);
   if(msg.kind==='done'){
    busy=false;$('result').textContent=feedback(msg);
    if(msg.ok&&Array.isArray(msg.results)&&msg.results.length===definition.levels[level].tests.length&&msg.results.every(r=>r.ok)){mark('programmer');mark('tester');$('result').textContent+='\nTests réussis. Rédige et autoévalue ton transfert.'}
    refresh();
   }
  },{missionId:definition.id,level});
 };
 function saveTransfer(){if(!ready)return;dossier.response=$('transferResponse').value;dossier.rubric=definition.transfer.rubric.flatMap((_,i)=>$('rubric-'+i).checked?[i]:[]);saveDossier()}
 $('transferResponse').oninput=saveTransfer;
 $('checkTransfer').onclick=()=>{
  if(!ready||busy||!engine.record('M03',level).steps.includes('tester'))return;saveTransfer();
  if(dossier.response.trim().length<80||dossier.rubric.length!==definition.transfer.rubric.length){$('transferResult').textContent='Prépare une note d’au moins 80 caractères et compare-la aux quatre critères. Cette condition vérifie seulement la présence du dossier, pas la qualité de ton raisonnement.';return}
  dossier.review='auto-evaluation-declaree';saveDossier();
  if(mark('transferer')){$('transferResult').textContent='Justification et autoévaluation enregistrées localement. À présenter à l’enseignant : le logiciel ne certifie pas la qualité sémantique.';const reward=$('reward');reward.textContent='M03 · PARCOURS RÉALISÉ · AUTOÉVALUATION À RELIRE';reward.style.display='block';setTimeout(()=>reward.style.display='none',4200)}
 };
 $('close').onclick=()=>callbacks.onClose?.();
 $('mission').addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();callbacks.onClose?.()}
  if(e.key==='Tab'){
   const nodes=[...$('mission').querySelectorAll('button:not(:disabled),textarea,input:not(:disabled),select:not(:disabled),summary,a[href]')].filter(n=>n.getClientRects().length);
   const first=nodes[0],last=nodes.at(-1);
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
  }
 });
 window.NexusLearning={bind(c){callbacks=c;refresh()},open(){loading.then(()=>{refresh();if($('mission').style.display==='block')$('close').focus()})},pause,completed(){return ready&&engine.status('M03',level)==='completed'}};
})();
