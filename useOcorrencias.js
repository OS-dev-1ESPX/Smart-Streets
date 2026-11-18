import { useCallback, useEffect, useRef, useState } from 'react'
import * as api from '../services/ocorrenciasApi'
import semente from '../data/ocorrencias-seed.json'

export function useOcorrencias() {
  const [ocorrencias, setOcorrencias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const ocupado = useRef(false)
  const versao = useRef(0)

  const carregar = useCallback(async () => {
    if (ocupado.current) return
    const atual = ++versao.current
    setCarregando(true)
    setErro(null)
    try {
      const dados = await api.listarOcorrencias()
      if (atual === versao.current) setOcorrencias(dados)
    } catch (e) {
      if (atual === versao.current) setErro(e.message)
    } finally {
      if (atual === versao.current) setCarregando(false)
    }
  }, [])
  useEffect(() => { carregar(); return () => { versao.current++ } }, [carregar])

  const mutar = useCallback(async (operacao) => {
    if (ocupado.current) return { ok: false, mensagem: 'Aguarde a operação anterior terminar.' }
    ocupado.current = true
    versao.current++ // Uma resposta de GET antiga não pode sobrescrever uma mutação.
    setSalvando(true)
    setCarregando(false)
    let concluida = false
    try {
      await operacao()
      concluida = true
      setOcorrencias(await api.listarOcorrencias())
      setErro(null)
      return { ok: true }
    } catch (e) {
      const mensagem = concluida
        ? `A alteração foi aceita, mas não foi possível atualizar a lista. Use Tentar novamente antes de repetir a alteração. ${e.message}`
        : `Não foi possível confirmar a operação. Atualize a lista antes de tentar novamente, pois a alteração pode ter sido recebida. ${e.message}`
      setErro(mensagem) // Nunca manter consultas habilitadas com dados anteriores à escrita.
      return { ok: false, mensagem }
    } finally {
      ocupado.current = false
      setSalvando(false)
    }
  }, [])
  const criar = (dados) => mutar(() => api.criarOcorrencia(dados))
  const atualizar = (id, dados) => mutar(() => api.atualizarOcorrencia(id, dados))
  const excluir = (id) => mutar(() => api.excluirOcorrencia(id))
  const importarSemente = () => mutar(async () => {
    const existentes = await api.listarOcorrencias()
    for (const item of semente) {
      const existe = existentes.some((o) => o.rota === item.rota && o.motivo === item.motivo
        && o.minutos === item.minutos && o.bloqueada === item.bloqueada)
      if (!existe) existentes.push(await api.criarOcorrencia(item))
    }
  })
  return { ocorrencias, carregando, erro, salvando, pronto: !carregando && !erro && !salvando, carregar, criar, atualizar, excluir, importarSemente }
}
