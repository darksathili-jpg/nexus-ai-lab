/* NEXUS Atrium environment detailing — actual 3D meshes and physically based materials.
   Architectural detailing pass, NOT a replacement for final authored GLB assets. */
window.NexusEnvironment={
 enhance(scene,B,V,C){
 const pbr=(name,color,metallic,roughness,emissive)=>{const m=new B.PBRMaterial(name,scene);m.albedoColor=C.FromHexString(color);m.metallic=metallic;m.roughness=roughness;if(emissive)m.emissiveColor=C.FromHexString(color).scale(emissive);return m};
 const ivory=pbr('ceramic limestone cladding','#b5c0c6',.1,.43,0),gold=pbr('brushed champagne metal','#ba8b58',.72,.26,0),graphite=pbr('graphite structure','#1c2d3c',.65,.31,0),glow=pbr('architectural amber lighting','#ffc37d',.15,.22,1.2),leaf=pbr('foliage emerald','#235a49',.02,.72,0),leaf2=pbr('foliage deep','#1b463d',.02,.78,0),soil=pbr('planting soil','#151d1a',.02,.94,0);
 const box=(n,w,h,d,x,y,z,m)=>{const o=B.MeshBuilder.CreateBox(n,{width:w,height:h,depth:d},scene);o.position.set(x,y,z);o.material=m;return o};
 const tube=(n,points,r,m)=>{const o=B.MeshBuilder.CreateTube(n,{path:points,radius:r,tessellation:8,cap:B.Mesh.CAP_ALL},scene);o.material=m;return o};
 const cylinder=(n,d,h,x,y,z,m,t=16)=>{const o=B.MeshBuilder.CreateCylinder(n,{diameter:d,height:h,tessellation:t},scene);o.position.set(x,y,z);o.material=m;return o};
 // Radial layered reactor dais: stairs, ring lighting and segmented metal panels.
 for(let k=0;k<4;k++){const o=cylinder('reactor concentric platform '+k,18+k*1.8,.3,0,.1+k*.08,0,k%2?ivory:graphite,96);o.scaling.y=1}
 for(let a=0;a<64;a++){const ang=a*Math.PI/32;const x=Math.cos(ang)*11.8,z=Math.sin(ang)*11.8;const m=box('radial floor inset '+a,.1,.022,1.3,x,.05,z,a%4===0?glow:gold);m.rotation.y=-ang-Math.PI/2}
 // Fluted columns, fine trims and decorative floor edge at each gallery.
 for(const s of [-1,1])for(let z=-34;z<=34;z+=7){
   const x=s*35;
   for(let i=0;i<10;i++){const a=i*Math.PI/5;const rod=cylinder('fluted column shaft',.12,17.8,x+Math.cos(a)*.79,9,z+Math.sin(a)*.79,ivory,8)}
   for(const y of [1.2,17.1]){box('column brass collar',2,.16,2,x,y,z,gold)}
   box('column up-light',.35,.1,.35,x,1.4,z,glow)
 }
 for(const s of [-1,1]){
  for(const y of [8.72,9.08,9.32])box('gallery layered cornice',15,.1,75,s*29,y,0,y===9.08?gold:ivory);
  for(let z=-34;z<=34;z+=3.4){
    box('balcony vertical baluster',.08,1.55,.09,s*22.45,10.2,z,gold);
    const b=box('balcony warm strip',.08,.06,3.3,s*22.38,9.42,z,glow);
  }
 }
 // Suspended light fixtures and overhead architecture.
 for(const z of [-30,-18,-6,6,18,30])for(const x of [-16,16]){
   cylinder('suspended pendant',.75,.18,x,18.2,z,gold,24);
   cylinder('pendant diffuser',.56,.12,x,18.06,z,glow,24);
   tube('pendant cable',[new V(x,18.2,z),new V(x,21.6,z)],.018,graphite)
 }
 // Real 3D planter geometry and foliage clusters (not flat SVG sprites).
 let seed=10391;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 for(const s of [-1,1])for(const z of [-30,-19,-8,8,19,30]){
  const x=s*18.6;
  cylinder('architectural planter base',2.4,.9,x,.45,z,ivory,16);
  cylinder('soil insert',2.13,.06,x,.93,z,soil,16);
  for(let j=0;j<24;j++){
   const a=rnd()*Math.PI*2,h=1.15+rnd()*2.5,rr=.15+rnd()*.72;
   const p0=new V(x,.94,z),p1=new V(x+Math.cos(a)*rr,h*.64,z+Math.sin(a)*rr),p2=new V(x+Math.cos(a)*(rr+.3),h,z+Math.sin(a)*(rr+.3));
   tube('branch', [p0,p1,p2],.012,leaf2);
   const o=B.MeshBuilder.CreateSphere('botanical leaf cluster',{diameter:.28+rnd()*.28,segments:5},scene);o.position=p2;o.scaling.set(.6,1.8,.45);o.rotation.y=a;o.material=rnd()>.45?leaf:leaf2;
  }
 }
 // Three dimensional stair flights on either side of the atrium, step lights.
 for(const s of [-1,1])for(let step=0;step<17;step++){
   const y=.19+step*.24,z=17.5+step*.38;
   box('atrium grand staircase step',6,.23,.41,s*12.7,y,z,ivory);
   box('stair nosing luminaire',6,.045,.07,s*12.7,y+.13,z-.19,glow);
 }
 // Merge static, same-material mesh groups to reduce render draw calls.
 // Preserve emissive and PBR material identities, and never merge interactive objects.
 const groups=new Map();
 for(const m of scene.meshes){
  if(!m.material || !m.name || !m.getTotalVertices || !m.getTotalVertices())continue;
  if(!/^(fluted column shaft|column brass collar|column up-light|gallery layered cornice|balcony vertical baluster|balcony warm strip|suspended pendant|pendant diffuser|pendant cable|architectural planter base|soil insert|branch|botanical leaf cluster|atrium grand staircase step|stair nosing luminaire|radial floor inset)/.test(m.name))continue;
  const id=m.material.uniqueId;
  if(!groups.has(id))groups.set(id,[]);
  groups.get(id).push(m);
 }
 for(const [id,meshes] of groups){
  if(meshes.length<3)continue;
  const merged=B.Mesh.MergeMeshes(meshes,true,true,undefined,false,true);
  if(merged){merged.name='static environment batch '+id;merged.isPickable=false;merged.freezeWorldMatrix()}
 }
 return {status:'architectural-detailing-pass',note:'Detailed geometry and PBR materials are real 3D; final authored environment assets and visual validation are still pending.'};
 }
};
