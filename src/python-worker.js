/* NEXUS Python worker — isolated execution, recreated on timeout. */
let pyodidePromise=null;
async function getPython(){
 if(!pyodidePromise)pyodidePromise=(async()=>{
  importScripts('https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.js');
  return await loadPyodide({indexURL:'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/'});
 })();
 return pyodidePromise;
}
self.onmessage=async(event)=>{
 const {id,code}=event.data||{};
 try{
  const py=await getPython();
  py.setStdout({batched:s=>self.postMessage({id,kind:'stdout',value:s})});
  py.setStderr({batched:s=>self.postMessage({id,kind:'stderr',value:s})});
  const script=String(code||'')+'\n\n'+[
   'assert callable(tokeniser), "La fonction tokeniser est introuvable"',
   'assert tokeniser("bonjour monde") == ["bonjour", "monde"], "Échec du test simple"',
   'assert tokeniser("  bonjour   monde  ") == ["bonjour", "monde"], "Les espaces multiples doivent être ignorés"',
   'assert tokeniser("") == [], "Une chaîne vide doit produire une liste vide"',
   'print("MISSION_VALIDEE")'
  ].join('\n');
  await py.runPythonAsync(script);
  self.postMessage({id,kind:'done',ok:true});
 }catch(error){self.postMessage({id,kind:'done',ok:false,error:String(error)})}
};
