/* Explicit teaching simulation, not BPE/WordPiece or a model-specific tokenizer. */
(function(root){
 const blanks=/[\u0009-\u000d\u001c-\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]+/u;
 const split=text=>text.split(blanks).filter(Boolean);
 const encode=(units,vocab)=>units.map(unit=>Object.hasOwn(vocab,unit)?vocab[unit]:0);
 const decode=(ids,vocab)=>{const inverse=new Map(Object.entries(vocab).map(([unit,id])=>[id,unit]));return ids.map(id=>inverse.get(id)??'<UNK>')};
 function simulate(text,pieces){
  const ordered=[...pieces].sort((a,b)=>b.length-a.length);const units=[];
  for(const chunk of split(text))for(const segment of chunk.match(/[\p{L}\p{M}\p{N}]+|[^\p{L}\p{M}\p{N}]/gu)||[]){
   let rest=segment;
   while(rest){const piece=ordered.find(p=>rest.startsWith(p))||Array.from(rest)[0];units.push(piece);rest=rest.slice(piece.length)}
  }
  return units;
 }
 function compare(text,experiment){
  const words=split(text),subwords=simulate(text,experiment.pieces);
  const row=units=>{const ids=encode(units,experiment.vocabulary);return {units,ids,decoded:decode(ids,experiment.vocabulary),unknowns:ids.filter(id=>id===0).length}};
  return {split:row(words),simulation:row(subwords)};
 }
 function validate(m){
  if(m?.id!=='M03'||!Number.isInteger(m.version)||m.pedagogyRevision!==2)throw Error('Définition M03 incompatible');
  if(!Array.isArray(m.understanding)||m.understanding.length!==4||!Array.isArray(m.experiment?.interpretation)||m.experiment.interpretation.length!==2)throw Error('Questions pédagogiques incomplètes');
  for(const q of [...m.understanding,...m.experiment.interpretation])if(!q.id||typeof q.prompt!=='string'||!Array.isArray(q.choices)||!q.choices[Number(q.answer)])throw Error('Question invalide');
  const vocab=m.experiment.vocabulary;
  if(!vocab||vocab['<UNK>']!==0||!Array.isArray(m.experiment.pieces)||m.experiment.pieces.some(p=>typeof p!=='string'||!p.length||!Object.hasOwn(vocab,p)))throw Error('Vocabulaire invalide');
  const values=Object.values(vocab);if(values.some(v=>!Number.isSafeInteger(v)||v<0)||new Set(values).size!==values.length)throw Error('IDs non injectifs');
  for(const level of ['premiere','terminale']){const c=m.levels?.[level];if(typeof c?.starter!=='string'||!Array.isArray(c.tests)||!c.tests.length||c.tests.some(t=>!['tokeniser','encoder','decoder'].includes(t.fn)||!Array.isArray(t.args)||!Array.isArray(t.expected)))throw Error('Évaluation Python incomplète')}
  if(!Array.isArray(m.transfer?.rubric)||m.transfer.rubric.length!==4)throw Error('Grille de transfert incomplète');
  return m;
 }
 root.NexusTokenisation={split,simulate,encode,decode,compare,validate};
})(typeof window==='undefined'?globalThis:window);
