const CHAVE = 'smart-streets:historico'
function valido(h) {
  return h && typeof h.rota === 'string' && typeof h.nome === 'string'
    && typeof h.data === 'string' && Number.isFinite(Date.parse(h.data))
    && Number.isFinite(h.total) && h.total >= 0 && typeof h.bloqueada === 'boolean'
    && Array.isArray(h.motivos) && h.motivos.every((m) => typeof m === 'string')
}
export function lerHistorico() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) ?? '[]')
    return Array.isArray(dados) ? dados.filter(valido).slice(0, 20) : []
  } catch { return [] }
}
export function gravarHistorico(lista) {
  try { localStorage.setItem(CHAVE, JSON.stringify(lista)); return true }
  catch { return false }
}
