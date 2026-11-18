import { spawn } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root=fileURLToPath(new URL('../',import.meta.url))
const original=await readFile(root+'server/db.json','utf8')
const child=spawn(process.execPath,['scripts/dev.mjs','--port','5179','--host','127.0.0.1'],{cwd:root,stdio:['ignore','pipe','pipe']})
let log='';child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b)
try {
 const base='http://127.0.0.1:5179/api/ocorrencias'
 let ready=false
 for(let i=0;i<50;i++){try{const r=await fetch(base);if(r.ok){ready=true;break}}catch{}await new Promise(r=>setTimeout(r,200))}
 assert(ready,log)
 const payload={rota:'T1',motivo:'Teste técnico temporário',minutos:7,bloqueada:false,simulado:true}
 const created=await fetch(base,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
 assert.equal(created.status,201);const item=await created.json();const id=encodeURIComponent(item.id)
 const get=async()=>await(await fetch(base)).json()
 assert((await get()).some(x=>x.id===item.id))
 assert((await fetch(base+'/'+id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,minutos:9})})).ok)
 assert.equal((await get()).find(x=>x.id===item.id).minutos,9)
 const disk=JSON.parse(await readFile(root+'server/db.json','utf8'));assert.equal(disk.ocorrencias.find(x=>x.id===item.id).minutos,9)
 assert((await fetch(base+'/'+id,{method:'DELETE'})).ok);assert(!(await get()).some(x=>x.id===item.id))
 console.log('PASS: comando único inicia serviços; proxy GET/POST/PUT/DELETE; persistência confirmada no disco; exclusão confirmada.')
} finally {
 child.kill('SIGTERM')
 await new Promise(resolve=>child.exitCode!==null?resolve():child.once('exit',resolve))
 await writeFile(root+'server/db.json',original)
}
