import rotas from '../data/rotas.json'

export const DESTINO = 'Bela Vista (FIAP Paulista)'
export const ROTAS = rotas
export const ORIGENS = [...new Set(rotas.map((r) => r.origem))]

export function formatarMinutos(total) {
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

// total = caminhada + espera + viagem + soma dos atrasos; qualquer bloqueio torna a rota indisponível
export function avaliarRota(rota, ocorrencias) {
  const doTrajeto = ocorrencias.filter((o) => o.rota === rota.id)
  const atraso = doTrajeto.reduce((soma, o) => soma + o.minutos, 0)
  return {
    ...rota,
    ocorrencias: doTrajeto,
    atraso,
    bloqueada: doTrajeto.some((o) => o.bloqueada === true),
    total: rota.caminhada + rota.espera + rota.viagem + atraso,
  }
}

// mesma origem, exclui a habitual e as bloqueadas, mantém empates no menor total
export function buscarAlternativas(habitual, ocorrencias, catalogo = ROTAS) {
  const candidatas = catalogo
    .filter((r) => r.origem === habitual.origem && r.id !== habitual.id)
    .map((r) => avaliarRota(r, ocorrencias))
    .filter((r) => !r.bloqueada)
  if (candidatas.length === 0) return { alternativas: [], situacao: 'nenhuma' }
  const menor = Math.min(...candidatas.map((r) => r.total))
  const alternativas = candidatas.filter((r) => r.total === menor)
  if (habitual.bloqueada) return { alternativas, situacao: 'habitual-bloqueada', diferenca: null }
  const diferenca = habitual.total - menor
  const situacao = diferenca > 0 ? 'mais-rapida' : diferenca === 0 ? 'igual' : 'mais-longa'
  return { alternativas, situacao, diferenca }
}

export function validarOcorrencia({ rota, motivo, minutos, bloqueada }, catalogo = ROTAS) {
  const erros = {}
  if (!catalogo.some((r) => r.id === rota)) erros.rota = 'Escolha uma rota válida.'
  if (typeof motivo !== 'string' || !motivo.trim()) erros.motivo = 'Informe o motivo.'
  const n = Number(minutos)
  if (!['string', 'number'].includes(typeof minutos) || String(minutos).trim() === '' || !Number.isSafeInteger(n) || n < 0)
    erros.minutos = 'Informe um número inteiro de minutos, 0 ou maior.'
  if (typeof bloqueada !== 'boolean') erros.bloqueada = 'Valor inválido.'
  return erros
}
