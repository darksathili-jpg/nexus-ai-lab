/* Lightweight XZ collision model for the ground-floor playable area.
 * Obstacles are authored explicitly; no visual mesh geometry is trusted as a collider.
 * A swept movement is subdivided to prevent tunnelling during frame drops.
 */
window.NexusCollision={
 create(){
  const blocks=[
   // Station 01 console and pedestal, with margin for the player's body.
   {x:12,z:-10,hx:1.55,hz:.78,angle:-.35},
   // Research bays at both sides of the atrium.
   ...[-1,1].flatMap(s=>Array.from({length:5},(_,i)=>({x:s*30,z:-26+i*13,hx:3.2,hz:3.7})))
  ];
  const circles=[
   // Raised central reactor platform.
   {x:0,z:0,r:8.6},
   // Ground-floor architectural columns.
   ...[-1,1].flatMap(s=>Array.from({length:11},(_,i)=>({x:s*35,z:-34+i*7,r:1.2})))
  ];
  const radius=.5;
  function blocked(x,z){
   if(x < -20+radius||x > 20-radius||z < -34+radius||z > 34-radius)return true;
   for(const o of blocks){
    const angle=o.angle||0,co=Math.cos(angle),si=Math.sin(angle),rx=x-o.x,rz=z-o.z;
    const localX=rx*co-rz*si,localZ=rx*si+rz*co;
    const dx=Math.max(Math.abs(localX)-o.hx,0),dz=Math.max(Math.abs(localZ)-o.hz,0);
    if(dx*dx+dz*dz<radius*radius)return true;
   }
   for(const o of circles)if((x-o.x)**2+(z-o.z)**2<(o.r+radius)**2)return true;
   return false;
  }
  function move(pos,dx,dz){
   const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.2));
   let x=pos.x,z=pos.z;
   for(let i=0;i<steps;i++){
    const sx=dx/steps,sz=dz/steps;
    if(!blocked(x+sx,z+sz)){x+=sx;z+=sz;continue}
    if(!blocked(x+sx,z))x+=sx;
    if(!blocked(x,z+sz))z+=sz;
   }
   return {x,z};
  }
  return {blocked,move,obstacles:{blocks,circles}};
 }
};
