/* Only browser localStorage; no network, no automatic deletion of corrupt data. */
(function(root){
 function create(storage){
  const key='nexus.m03.drafts.v1';const allowed=['premiere','terminale'];
  let drafts={},warning='',blocked=false;
  try{
   const raw=storage.getItem(key);
   if(raw!==null){const data=JSON.parse(raw);if(data?.version!==1||!data.drafts||Array.isArray(data.drafts)||typeof data.drafts!=='object')throw Error('Format inconnu');
    for(const level of allowed)if(Object.hasOwn(data.drafts,level)){if(typeof data.drafts[level]!=='string'||data.drafts[level].length>32768)throw Error('Brouillon invalide');drafts[level]=data.drafts[level]}
   }
  }catch(e){warning='Brouillons non restaurés : stockage indisponible ou corrompu. Les données existantes ne seront pas écrasées ; copie ton code avant de quitter.';blocked=true;drafts={}}
  function persist(){if(blocked)return false;try{storage.setItem(key,JSON.stringify({version:1,drafts}));warning='';return true}catch(e){warning='Sauvegarde des brouillons impossible. Code conservé en mémoire seulement : copie-le avant de quitter.';return false}}
  return {get:level=>drafts[level],warning:()=>warning,
   set(level,code){if(!allowed.includes(level)||typeof code!=='string'||code.length>32768)throw Error('Brouillon invalide');drafts[level]=code;return persist()},
   reset(level,confirmed){if(!confirmed)return false;if(!allowed.includes(level))throw Error('Niveau invalide');delete drafts[level];
    // Explicit consent repairs the drafts envelope only; progress is a separate key.
    blocked=false;return persist()}};
 }
 root.NexusDraftStore={create};
})(typeof window==='undefined'?globalThis:window);
