import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('../', import.meta.url))
const children = []
let stopping = false
function stop(code = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill('SIGTERM')
  process.exitCode = code
}
function run(file, args) {
  const child = spawn(process.execPath, [file, ...args], { cwd: root, stdio: 'inherit' })
  children.push(child)
  child.on('error', (e) => { console.error(e.message); stop(1) })
  child.on('exit', (code) => { if (!stopping) stop(code || 1) })
  return child
}
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
// Inicia o processo que este comando controla; não reutiliza silenciosamente outra API.
run('node_modules/json-server/lib/cli/bin.js', ['--watch', 'server/db.json', '--port', '3001', '--host', '127.0.0.1'])
await new Promise((resolve) => setTimeout(resolve, 500))
for (let attempt = 0; attempt < 40 && !stopping; attempt++) {
  try {
    const response = await fetch('http://127.0.0.1:3001/ocorrencias', { signal: AbortSignal.timeout(500) })
    if (response.ok && Array.isArray(await response.json())) {
      console.log('\nAPI pronta. Iniciando a interface. Ctrl+C encerra os dois processos.\n')
      run('node_modules/vite/bin/vite.js', process.argv.slice(2))
      break
    }
  } catch { /* A API ainda está iniciando. */ }
  if (attempt === 39) { console.error('A API não iniciou. Verifique a porta 3001 e server/db.json.'); stop(1) }
  else await new Promise((resolve) => setTimeout(resolve, 200))
}
