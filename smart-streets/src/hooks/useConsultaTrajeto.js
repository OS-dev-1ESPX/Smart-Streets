import { useMemo, useState } from 'react'
import { ORIGENS, ROTAS, avaliarRota, buscarAlternativas } from '../domain/trajetos'
import { gravarHistorico, lerHistorico } from '../services/historicoStorage'

export function useConsultaTrajeto(ocorrencias, pronto) {
  const [origem, setOrigemState] = useState('')
  const [rotaId, setRotaIdState] = useState('')
  const [consultada, setConsultada] = useState(null) // id da rota consultada
  const [erro, setErro] = useState('')
  const [historico, setHistorico] = useState(lerHistorico)
  const [avisoHistorico, setAvisoHistorico] = useState('')

  const rotasDaOrigem = useMemo(() => ROTAS.filter((r) => r.origem === origem), [origem])

  // resultado é derivado: se as ocorrências mudam, o total e as alternativas são recalculados
  const resultado = useMemo(() => {
    if (!consultada || !pronto) return null
    const rota = ROTAS.find((r) => r.id === consultada)
    const habitual = avaliarRota(rota, ocorrencias)
    return { habitual, busca: buscarAlternativas(habitual, ocorrencias) }
  }, [consultada, ocorrencias, pronto])

  function setOrigem(valor) {
    setOrigemState(valor)
    setRotaId('')
    setConsultada(null)
    setErro('')
  }

  function setRotaId(valor) {
    setRotaIdState(valor)
    setConsultada(null)
    setErro('')
  }

  function consultar() {
    if (!pronto) return setErro('As ocorrências ainda não foram carregadas. Tente novamente.')
    if (!origem) return setErro('Escolha uma origem.')
    if (!rotasDaOrigem.some((r) => r.id === rotaId)) return setErro('Escolha um trajeto válido para a origem.')
    setErro('')
    setConsultada(rotaId)
    const h = avaliarRota(ROTAS.find((r) => r.id === rotaId), ocorrencias)
    const registro = {
      data: new Date().toISOString(),
      rota: h.id,
      nome: h.nome,
      total: h.total,
      bloqueada: h.bloqueada,
      motivos: h.ocorrencias.map((o) => o.motivo),
    }
    const novo = [registro, ...historico].slice(0, 20)
    setHistorico(novo)
    setAvisoHistorico(gravarHistorico(novo) ? '' : 'Não foi possível salvar o histórico neste navegador.')
  }

  function limparHistorico() {
    setHistorico([])
    setAvisoHistorico(gravarHistorico([]) ? '' : 'O histórico foi limpo da tela, mas não foi possível remover os dados salvos neste navegador.')
  }

  return { origens: ORIGENS, origem, setOrigem, rotaId, setRotaId, rotasDaOrigem, consultar, resultado, erro, historico, avisoHistorico, limparHistorico }
}
