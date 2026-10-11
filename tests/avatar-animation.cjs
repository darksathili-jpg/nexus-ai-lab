const assert=require('node:assert/strict');require('../src/avatar-animation.js');
class Value{constructor(x){this.x=x}clone(){return new Value(this.x)}copyFrom(v){this.x=v.x}}
const B={Vector3:{Lerp:(a,b,t)=>new Value(a.x+(b.x-a.x)*t)},Quaternion:{Slerp:(a,b,t)=>new Value(a.x+(b.x-a.x)*t)}};
const target={position:new Value(0)},animation={targetProperty:'position'},group={starts:0,stops:0,targetedAnimations:[{target,animation}],start(){this.starts++},stop(){this.stops++}};
const controller=NexusAvatarAnimation.create([group],B);
assert.equal(controller.state(),'idle');assert.equal(group.starts,0);
for(let i=0;i<100;i++)controller.update(true,.016);assert.equal(group.starts,1);
target.position.x=10;controller.update(false,.05);assert.equal(controller.state(),'settling');assert(target.position.x>0&&target.position.x<10,'Return pose must interpolate, not snap');
for(let i=0;i<30;i++)controller.update(false,.016);assert.equal(controller.state(),'idle');assert.equal(target.position.x,0);assert.equal(group.stops,2);
controller.update(true,.016);assert.equal(group.starts,2);controller.rest();controller.rest();assert.equal(group.stops,3);controller.update(false,.2);assert.equal(controller.state(),'idle');
const fallback=NexusAvatarAnimation.create([],B);fallback.update(true,.01);fallback.update(false,.2);assert.equal(fallback.state(),'idle');
console.log('AVATAR ANIMATION PASS: initial idle, one start per transition, interpolated rest, repeated frames/reset, missing clips');
