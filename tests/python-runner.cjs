const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const workers=[],timers=new Map();let timerSerial=0,constructorFailure=false,sendFailure=false;
class Worker{constructor(){if(constructorFailure)throw Error('denied');workers.push(this)}terminate(){this.terminated=true}postMessage(data){if(sendFailure)throw Error('clone');this.data=data}}
const context={window:{},Worker,setTimeout(fn,delay){timers.set(++timerSerial,{fn,delay});return timerSerial},clearTimeout(id){timers.delete(id)}};
vm.runInNewContext(fs.readFileSync('src/python-runner.js','utf8'),context);
const runner=context.window.nexusPython,events=[];
const start=()=>{runner.run('pass',m=>events.push(m));return workers.at(-1)};
const emit=(w,kind)=>w.onmessage({data:{id:w.data.id,kind}});
let first=start();runner.cancel();emit(first,'ready');emit(first,'stdout');emit(first,'done');assert.equal(events.length,0);assert.equal(timers.size,0);
first=start();const second=start();assert(first.terminated);emit(first,'ready');emit(first,'stdout');assert.equal(events.length,0);
assert.equal([...timers.values()][0].delay,60000);emit(second,'ready');assert.equal([...timers.values()][0].delay,12000);
const timerId=[...timers.keys()][0];emit(second,'ready');assert.equal([...timers.keys()][0],timerId,'duplicate ready must not extend timeout');
[...timers.values()][0].fn();assert.equal(events.at(-1).ok,false);assert.equal(timers.size,0);emit(second,'ready');
const third=start();third.onerror({preventDefault(){}});assert.equal(events.at(-1).ok,false);assert.equal(timers.size,0);
sendFailure=true;start();assert.match(events.at(-1).error,/Envoi/);assert.equal(timers.size,0);sendFailure=false;
constructorFailure=true;runner.run('pass',m=>events.push(m));assert.match(events.at(-1).error,/créer/);constructorFailure=false;
const recovery=start();emit(recovery,'done');assert(recovery.terminated);assert.equal(timers.size,0);
console.log('PYTHON RUNNER PASS: stale events, replacement, duplicate ready, timers, errors, send/constructor failures, recovery');
