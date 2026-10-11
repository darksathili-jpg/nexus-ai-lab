const fs=require('node:fs'),vm=require('node:vm');
for(const file of fs.readdirSync('src').filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync('src/'+file,'utf8'),{filename:'src/'+file});
for(const file of ['index.html','academy.html']){
 const html=fs.readFileSync(file,'utf8');
 for(const [,attributes,code] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g))if(!attributes.includes('src='))new vm.Script(code,{filename:file});
}
console.log('SYNTAX PASS: all source scripts and inline game/academy scripts');
