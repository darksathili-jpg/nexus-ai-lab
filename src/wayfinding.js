/* NEXUS — legible, physical station wayfinding in the Babylon scene. */
window.NexusWayfinding={
 install(scene,B){
  const V=B.Vector3,C=B.Color3;
  const surface=new B.StandardMaterial('station hologram substrate',scene);
  surface.diffuseColor=new C(.015,.07,.105);surface.emissiveColor=new C(.015,.13,.18);
  surface.alpha=.92;surface.backFaceCulling=false;
  const metal=new B.PBRMaterial('wayfinding brushed metal',scene);
  metal.albedoColor=C.FromHexString('#647988');metal.metallic=.8;metal.roughness=.29;
  const textTexture=new B.DynamicTexture('station 01 typography',{width:1024,height:512},scene,false);
  textTexture.hasAlpha=true;
  const ctx=textTexture.getContext();
  ctx.clearRect(0,0,1024,512);
  ctx.fillStyle='rgba(5,19,33,.94)';ctx.fillRect(12,12,1000,488);
  ctx.strokeStyle='#3ac8df';ctx.lineWidth=5;ctx.strokeRect(17,17,990,478);
  ctx.fillStyle='#77dce9';ctx.font='600 34px Arial';ctx.fillText('NEXUS  /  RESEARCH STATION',60,100);
  ctx.fillStyle='#ffffff';ctx.font='bold 78px Arial';ctx.fillText('01  TOKENISATION',60,225);
  ctx.fillStyle='#b3d8e4';ctx.font='40px Arial';ctx.fillText('PYTHON  •  ANALYSE DU TEXTE',60,320);
  ctx.fillStyle='#ffca83';ctx.font='bold 40px Arial';ctx.fillText('APPROCHER POUR INTERAGIR',60,413);
  textTexture.update();
  // Keep texture unmirrored; place the plane on the visible +Z face of the frame.
  textTexture.uScale=1;
  textTexture.uOffset=0;
  const screen=new B.StandardMaterial('station 01 actual sign',scene);
  screen.diffuseTexture=textTexture;screen.emissiveTexture=textTexture;screen.disableLighting=true;screen.backFaceCulling=true;
  const frame=B.MeshBuilder.CreateBox('station 01 sign physical frame',{width:7.6,height:3.8,depth:.18},scene);
  frame.position.set(12,5,-10);frame.material=metal;
  const panel=B.MeshBuilder.CreatePlane('station 01 readable signage',{width:7.35,height:3.55,sideOrientation:B.Mesh.FRONTSIDE},scene);
  panel.position.set(12,5,-9.87);panel.rotation.y=0;panel.material=screen;
  // Independent reverse graphic: the front texture must never be visible mirrored.
  const reverseTexture=new B.DynamicTexture('station 01 reverse identity',{width:1024,height:512},scene,false);
  const rc=reverseTexture.getContext();
  rc.fillStyle='#071624';rc.fillRect(0,0,1024,512);
  rc.strokeStyle='#39c8de';rc.lineWidth=5;rc.strokeRect(18,18,988,476);
  rc.textAlign='center';rc.fillStyle='#e6f7ff';rc.font='bold 72px Arial';
  rc.fillText('NEXUS / AI LAB',512,225);
  rc.fillStyle='#84dce8';rc.font='38px Arial';rc.fillText('STATION 01  /  PYTHON',512,325);
  reverseTexture.update();
  const reverseMaterial=new B.StandardMaterial('station 01 reverse face',scene);
  reverseMaterial.diffuseTexture=reverseTexture;reverseMaterial.emissiveTexture=reverseTexture;
  reverseMaterial.disableLighting=true;reverseMaterial.backFaceCulling=true;
  const reversePanel=B.MeshBuilder.CreatePlane('station 01 reverse face panel',{width:7.35,height:3.55,sideOrientation:B.Mesh.FRONTSIDE},scene);
  reversePanel.position.set(12,5,-10.13);reversePanel.rotation.y=Math.PI;reversePanel.material=reverseMaterial;
  // Highlight only the implemented educational station; no fake clickable labs.
  const beacon=new B.PointLight('station 01 cyan navigation beacon',new V(12,4.5,-10),scene);
  beacon.diffuse=C.FromHexString('#37d5ef');beacon.intensity=22;beacon.range=9;beacon.setEnabled(false); // Emissive sign remains visible without adding a shader light
  return {signs:1,implementedMissions:1};
 }
};
