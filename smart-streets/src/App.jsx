import { useState } from 'react'
import AppHeader from './components/AppHeader'
import MainNavigation from './components/MainNavigation'
import RouteSearchForm from './components/RouteSearchForm'
import RouteSummary from './components/RouteSummary'
import OccurrenceForm from './components/OccurrenceForm'
import OccurrenceList from './components/OccurrenceList'
import ConfirmDialog from './components/ConfirmDialog'
import QueryHistory from './components/QueryHistory'
import AboutSection from './components/AboutSection'
import FeedbackMessage from './components/FeedbackMessage'
import { useOcorrencias } from './hooks/useOcorrencias'
import { useConsultaTrajeto } from './hooks/useConsultaTrajeto'

export default function App() {
  const [aba, setAba] = useState('consulta')
  const [editando, setEditando] = useState(null)
  const [excluindo, setExcluindo] = useState(null)
  const [mensagem, setMensagem] = useState(null)
  const oc = useOcorrencias()
  const c = useConsultaTrajeto(oc.ocorrencias, oc.pronto)

  async function salvar(dados) {
    const r = editando ? await oc.atualizar(editando.id, dados) : await oc.criar(dados)
    if (r.ok) {
      setMensagem(editando ? 'Ocorrência atualizada.' : 'Ocorrência registrada.')
      setEditando(null)
    }
    return r
  }

  async function confirmarExclusao() {
    const r = await oc.excluir(excluindo.id)
    setMensagem(r.ok ? 'Ocorrência excluída.' : null)
    if (!r.ok) setMensagem(`Falha ao excluir: ${r.mensagem}`)
    setExcluindo(null)
  }

  return (
    <div className="min-h-screen bg-green-50 text-gray-900">
      <AppHeader />
      <MainNavigation ativa={aba} onChange={setAba} />
      <main className="mx-auto max-w-4xl space-y-4 px-4 py-6">
        {oc.erro && <FeedbackMessage tipo="erro" onRetry={oc.carregar}>{oc.erro} Não é possível consultar os trajetos até atualizar as ocorrências.</FeedbackMessage>}
        {oc.carregando && <FeedbackMessage>Carregando ocorrências...</FeedbackMessage>}

        {aba === 'consulta' && (
          <>
            <RouteSearchForm origens={c.origens} origem={c.origem} onOrigem={c.setOrigem} rotas={c.rotasDaOrigem} rotaId={c.rotaId} onRota={c.setRotaId} onConsultar={c.consultar} erro={c.erro} desabilitado={!oc.pronto} />
            {c.resultado && <RouteSummary key={c.resultado.habitual.id} resultado={c.resultado} />}
          </>
        )}

        {aba === 'ocorrencias' && (
          <>
            {mensagem && <FeedbackMessage tipo={mensagem.startsWith('Falha') ? 'erro' : 'sucesso'}>{mensagem}</FeedbackMessage>}
            <OccurrenceForm editando={editando} onSalvar={salvar} onCancelar={() => setEditando(null)} salvando={oc.salvando} desabilitado={!oc.pronto} />
            {oc.pronto && (
              <OccurrenceList ocorrencias={oc.ocorrencias} onEditar={setEditando} onExcluir={setExcluindo} onImportar={async () => {
                const r = await oc.importarSemente()
                setMensagem(r.ok ? 'Ocorrências iniciais importadas.' : `Falha ao importar: ${r.mensagem}`)
              }} salvando={oc.salvando} />
            )}
          </>
        )}

        {aba === 'historico' && <QueryHistory historico={c.historico} aviso={c.avisoHistorico} onLimpar={c.limparHistorico} />}
        {aba === 'sobre' && <AboutSection />}
      </main>
      <ConfirmDialog aberto={!!excluindo} titulo="Excluir ocorrência" texto={excluindo ? `Excluir a ocorrência de ${excluindo.rota}: "${excluindo.motivo}"?` : ''} onConfirmar={confirmarExclusao} onCancelar={() => setExcluindo(null)} ocupado={oc.salvando} />
    </div>
  )
}
