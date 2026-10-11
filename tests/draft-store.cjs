const assert=require('node:assert/strict');require('../src/draft-store.js');
let raw=null;const storage={getItem:()=>raw,setItem:(_,value)=>raw=value};
let store=NexusDraftStore.create(storage);store.set('premiere','');store.set('terminale','# terminale');store=NexusDraftStore.create(storage);
assert.equal(store.get('premiere'),'');assert.equal(store.get('terminale'),'# terminale');
assert.equal(store.reset('terminale',false),false);assert.equal(store.get('terminale'),'# terminale');store.reset('terminale',true);assert.equal(store.get('terminale'),undefined);assert.equal(store.get('premiere'),'');
raw='{broken';store=NexusDraftStore.create(storage);assert(store.warning());store.set('premiere','recover');assert.equal(raw,'{broken');assert.equal(store.get('premiere'),'recover');store.reset('terminale',true);assert.doesNotThrow(()=>JSON.parse(raw));assert.equal(store.get('premiere'),'recover');
store=NexusDraftStore.create({getItem(){throw Error('denied')},setItem(){throw Error('quota')}});store.set('premiere','pass');assert.equal(store.get('premiere'),'pass');assert(store.warning());
console.log('DRAFT STORE PASS: persistence, empty code, levels, confirmed reset, denied/corrupt storage and explicit repair');
