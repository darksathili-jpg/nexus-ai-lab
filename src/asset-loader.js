/* Real authored GLB asset loader. Existing procedural reactor is retained only as
   an explicit temporary fallback until the generated binary is present. */
window.NexusAssets={
 async loadReactor(scene,B){
  const url='./public/assets/nexus-core-sculpture.glb';
  try{
   const response=await fetch(url,{method:'HEAD'});
   if(!response.ok)throw new Error('GLB not yet published (HTTP '+response.status+')');
   const result=await B.SceneLoader.ImportMeshAsync('',url,'',scene);
   if(!result.meshes.length)throw new Error('GLB contains no meshes');
   for(const m of scene.meshes){
    if(m.name.startsWith('floating core ring')||m.name.startsWith('neural node')||m.name.startsWith('synapse')||m.name.startsWith('support_spine'))m.setEnabled(false);
   }
   const status=document.getElementById('status');
   if(status)status.textContent+=' · GLB REACTEUR CHARGÉ';
   console.info('NEXUS: actual GLB reactor loaded',result.meshes.length,'meshes');
   return {loaded:true,meshes:result.meshes.length};
  }catch(error){
   console.warn('NEXUS: fallback reactor (not final art):',error);
   return {loaded:false,error:String(error)};
  }
 }
};
