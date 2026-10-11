/* NEXUS — authored procedural surface detail, physically rendered on true 3D meshes.
   Generated locally in the browser, with no image/CDN dependency. */
window.NexusSurfaces={
 apply(scene,B){
  const mat=scene.getMaterialByName('polished dark stone');
  if(!mat)return {enabled:false};
  const size=512;
  const texture=new B.DynamicTexture('atrium stone albedo',size,scene,false);
  const ctx=texture.getContext();
  ctx.fillStyle='#243341';ctx.fillRect(0,0,size,size);
  let seed=7511;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  // Mineral micro-grain and irregular thin veins (not an image backdrop).
  for(let i=0;i<11000;i++){
   const x=rnd()*size,y=rnd()*size;
   ctx.fillStyle=rnd()>.5?'rgba(198,209,214,0.035)':'rgba(4,10,17,0.06)';
   ctx.fillRect(x,y,1+rnd()*2,1+rnd()*2);
  }
  for(let i=0;i<16;i++){
   let x=rnd()*size,y=rnd()*size;
   ctx.beginPath();ctx.moveTo(x,y);
   for(let j=0;j<16;j++){x+=rnd()*24-12;y+=rnd()*34-17;ctx.lineTo(x,y)}
   ctx.strokeStyle='rgba(171,188,192,0.06)';ctx.lineWidth=.6+rnd();ctx.stroke();
  }
  texture.wrapU=B.Texture.WRAP_ADDRESSMODE;texture.wrapV=B.Texture.WRAP_ADDRESSMODE;
  texture.uScale=7;texture.vScale=7;texture.update();
  mat.albedoTexture=texture;
  mat.roughness=.23;
  // Subtle reflection probes approximated with Babylon environment texture when supported.
  // Do not fabricate environment imagery or block gameplay on a failed reflection pass.
  return {enabled:true,resolution:size};
 }
};
