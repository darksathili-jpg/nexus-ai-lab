/* Deterministic gameplay collision contract, runs without Babylon or browser. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const sandbox={window:{}};
vm.runInNewContext(fs.readFileSync('src/collision.js','utf8'),sandbox,{filename:'src/collision.js'});
const world=sandbox.window.NexusCollision.create();
const point=(x,z)=>({x,z});
const eps=1e-7;
function safeMove(label,start,dx,dz){
 assert.equal(world.blocked(start.x,start.z),false,label+' starts in free space');
 const end=world.move(start,dx,dz);
 assert.equal(world.blocked(end.x,end.z),false,label+' must end in free space');
 assert(Number.isFinite(end.x)&&Number.isFinite(end.z),label+' must remain finite');
 return end;
}
assert(world.blocked(12,-10),'console center is solid');
assert(world.blocked(0,0),'reactor is solid');
assert(world.blocked(30,-26),'research bay is solid');
assert(world.blocked(20.1,-20),'outer boundary is solid');
assert.equal(world.blocked(0,-30),false,'spawn is traversable');
const front=safeMove('console approach',point(12,-15),0,10);
assert(front.z < -10.78,'cannot walk through the console from front');
const back=safeMove('console reverse',point(12,-5),0,-10);
assert(back.z > -9.22,'cannot walk through the console from rear');
const core=safeMove('reactor high-speed sweep',point(0,-30),0,60);
assert(core.z < -8.6,'cannot tunnel through reactor at low FPS');
const wall=safeMove('outer wall',point(0,-30),0,-20);
assert(wall.z >= -33.5-eps,'cannot escape outer wall');
const slide=safeMove('diagonal slide',point(10,-15),7,10);
assert(slide.x>=10&&slide.z>=-15,'diagonal collision permits non-reversing slide');
for(let i=0;i<200;i++){
 const angle=i*Math.PI*2/200;
 safeMove('radial sweep '+i,point(0,-30),Math.cos(angle)*90,Math.sin(angle)*90);
}
console.log('COLLISION GATE PASS: station both sides, reactor sweep, boundary, diagonal slide, 200 radial sweeps');
