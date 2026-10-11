/* NEXUS — genuine GLB reactor, safely replacing procedural fallback only on success. */
window.NexusAssets={
 async loadReactor(scene,B){
  const url='./public/assets/nexus-core-sculpture.glb';
  try{
   const result=await B.SceneLoader.ImportMeshAsync('',url,'',scene);
   const imported=result.meshes.filter(m=>m.getTotalVertices?.()>0);
   if(!imported.length)throw new Error('GLB loaded but no renderable geometry found');
   // The authored GLB uses metre-scale Y coordinates matching the atrium floor.
   // Disable the entire previous neural sculpture, including child synapse lines.
   const brain=scene.getTransformNodeByName('holographic brain core');
   if(brain)brain.setEnabled(false);
   for(const m of scene.meshes){
    if(m.name.startsWith('floating core ring'))m.setEnabled(false);
   }
   document.body.dataset.reactor='glb';
   console.info('NEXUS reactor GLB verified in scene:',imported.length,'renderable meshes');
   return {loaded:true,meshes:imported.length};
  }catch(error){
   document.body.dataset.reactor='fallback';
   console.warn('NEXUS reactor GLB unavailable: procedural fallback active',error);
   return {loaded:false,error:String(error)};
  }
 }
};
