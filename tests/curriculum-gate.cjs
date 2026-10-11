/* Curriculum contract: fails CI when the educational backbone is weakened. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const c=JSON.parse(fs.readFileSync('curriculum/llm-nsi.json','utf8'));
const loop=['comprendre','experimenter','programmer','tester','transferer'];
assert.equal(c.schemaVersion,1);
assert.equal(c.locale,'fr-FR');
assert.deepEqual(c.pedagogy.sequence,loop);
assert(c.modules.length>=12,'Complete academy needs at least twelve designed modules');
const ids=new Set(),slugs=new Set();
for(const [i,m] of c.modules.entries()){
 assert.equal(m.id,'M'+String(i+1).padStart(2,'0'));
 assert(!ids.has(m.id)&&!slugs.has(m.slug),'Module IDs and slugs must be unique');
 ids.add(m.id);slugs.add(m.slug);
 assert(['premiere','terminale'].includes(m.level),m.id+' must target NSI level');
 for(const key of ['title','objective','pythonLab','assessment','scientificCaution','implementation'])assert(typeof m[key]==='string'&&m[key].length>=12,m.id+' missing '+key);
 assert(Array.isArray(m.prerequisites)&&m.prerequisites.length>0,m.id+' needs prerequisites');
 assert.deepEqual(m.learningLoop,loop,m.id+' must have the full learning loop');
}
for(const slug of ['tokenisation','vecteurs','neurones','attention','transformers','entrainement','generation','rag','fiabilite'])assert(slugs.has(slug),'Missing LLM concept '+slug);
const partial=c.modules.filter(m=>m.implementation==='prototype-partiel');
assert.equal(partial.length,1,'Only tokenisation is currently a playable partial prototype');
assert.equal(partial[0].slug,'tokenisation');
console.log('CURRICULUM GATE PASS:',c.modules.length,'modules; NSI levels, prerequisites, learning loop and scientific caveats');
