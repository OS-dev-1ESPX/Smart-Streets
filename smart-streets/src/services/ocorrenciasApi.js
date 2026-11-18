import { ROTAS, validarOcorrencia } from '../domain/trajetos'

const BASE = (import.meta.env.VITE_API_URL?.trim() || '/api').replace(/\/+$/, '')

async function requisicao(caminho, opcoes = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10000)
  try {
    const resposta = await fetch(`${BASE}${caminho}`, {
      ...opcoes,
      headers: opcoes.body ? { 'Content-Type': 'application/json' } : {},
      signal: controller.signal,
    })
    if (!resposta.ok) throw new Error(`O serviço respondeu com erro ${resposta.status}.`)
    const texto = await resposta.text()
    if (!texto) return null
    try { return JSON.parse(texto) }
    catch { throw new Error('O serviço devolveu uma resposta inválida. Verifique a configuração da API.') }
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('O serviço demorou demais para responder. Tente novamente.')
    if (e instanceof TypeError) throw new Error('Não foi possível conectar ao serviço de ocorrências. A consulta depende desse serviço.')
    throw e
  } finally { clearTimeout(timer) }
}

export function normalizar(o) {
  if (!o || !['string', 'number'].includes(typeof o.id) || !String(o.id).trim()
    || !ROTAS.some((r) => r.id === o.rota) || typeof o.motivo !== 'string' || !o.motivo.trim()
    || typeof o.minutos !== 'number' || !Number.isSafeInteger(o.minutos) || o.minutos < 0
    || typeof o.bloqueada !== 'boolean' || o.simulado !== true) {
    throw new Error('O serviço devolveu uma ocorrência malformada. A consulta foi suspensa para evitar resultados incorretos.')
  }
  return { id: String(o.id), rota: o.rota, motivo: o.motivo.trim(), minutos: o.minutos, bloqueada: o.bloqueada, simulado: true }
}
function corpo(d) {
  if (Object.keys(validarOcorrencia(d)).length) throw new Error('Revise os dados da ocorrência.')
  return { rota: d.rota, motivo: d.motivo.trim(), minutos: Number(d.minutos), bloqueada: d.bloqueada, simulado: true }
}
export async function listarOcorrencias() {
  const dados = await requisicao('/ocorrencias')
  if (!Array.isArray(dados)) throw new Error('O serviço devolveu uma lista inválida.')
  const lista = dados.map(normalizar)
  if (new Set(lista.map((o) => o.id)).size !== lista.length) throw new Error('O serviço devolveu identificadores repetidos.')
  return lista
}
export async function criarOcorrencia(d) {
  return normalizar(await requisicao('/ocorrencias', { method: 'POST', body: JSON.stringify(corpo(d)) }))
}
export async function atualizarOcorrencia(id, d) {
  return normalizar(await requisicao(`/ocorrencias/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(corpo(d)) }))
}
export async function excluirOcorrencia(id) {
  await requisicao(`/ocorrencias/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
