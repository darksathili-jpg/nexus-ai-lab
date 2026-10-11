/* Locomotion clips follow actual displacement; no idle clip uses the authored pose. */
(function(root){
 function create(groups,B){
  const pose=[];
  for(const group of groups){
   group.stop();
   for(const {target,animation} of group.targetedAnimations){
    const path=animation.targetProperty.split('.');let owner=target;
    for(const part of path.slice(0,-1))owner=owner?.[part];
    const property=path.at(-1),value=owner?.[property];
    if(value?.clone&&!pose.some(p=>p.owner===owner&&p.property===property)){
     // CesiumMan's bind pose has spread arms. Keep its straight legs and use
     // the clip's authored arm rotations for a relaxed, stationary stance.
     const arm=property==='rotationQuaternion'&&/^Skeleton_arm_joint/.test(target.name);
     const rest=(arm?animation.getKeys()[0]?.value:value)?.clone();
     if(rest){value.copyFrom(rest);pose.push({owner,property,rest})}
    }
    animation.enableBlending=true;animation.blendingSpeed=.15;
   }
  }
  let state='idle',elapsed=0,from=[];
  function rest(){
   if(state!=='walk')return;
   for(const group of groups)group.stop();
   from=pose.map(p=>p.owner[p.property].clone());elapsed=0;state='settling';
  }
  return {rest,state:()=>state,
   update(moving,dt){
    if(moving){if(state!=='walk'){for(const group of groups)group.start(true);state='walk'}return}
    rest();if(state!=='settling')return;
    elapsed+=Math.max(0,dt);const t=Math.min(1,elapsed/.2),weight=t*t*(3-2*t);
    pose.forEach((p,i)=>{const value=p.owner[p.property];const mix='w' in p.rest?B.Quaternion.Slerp:B.Vector3.Lerp;value.copyFrom(mix(from[i],p.rest,weight))});
    if(t===1)state='idle';
   }
  };
 }
 root.NexusAvatarAnimation={create};
})(typeof window==='undefined'?globalThis:window);
