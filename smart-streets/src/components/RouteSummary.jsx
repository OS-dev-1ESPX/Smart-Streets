import { useState } from 'react'
import { formatarMinutos } from '../domain/trajetos'
import OccurrenceAlert from './OccurrenceAlert'
import RouteDetails from './RouteDetails'
import AlternativesList from './AlternativesList'

export default function RouteSummary({ resultado }) {
  const { habitual, busca } = resultado
  const [verAlternativas, setVerAlternativas] = useState(false)
  const [verDetalhes, setVerDetalhes] = useState(false)
  const temOcorrencia = habitual.ocorrencias.length > 0
  return (
    <section aria-labelledby="resultado" className="space-y-3 rounded-lg border border-green-200 bg-white p-4">
      <h2 id="resultado" className="text-xl font-bold">{habitual.nome}</h2>
      {habitual.bloqueada ? (
        <p className="text-lg font-semibold text-red-800">Rota indisponível: bloqueio registrado.</p>
      ) : (
        <p className="text-lg">Tempo estimado: <strong>{formatarMinutos(habitual.total)}</strong></p>
      )}
      <p className="text-sm text-gray-700">Dados simulados para fins acadêmicos.</p>
      {temOcorrencia ? (
        <OccurrenceAlert rota={habitual} onAlternativas={() => setVerAlternativas(true)} />
      ) : (
        <p>Nenhum problema registrado para este trajeto.</p>
      )}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setVerDetalhes((v) => !v)} className="rounded border border-green-700 px-3 py-1 font-semibold text-green-900">
          {verDetalhes ? 'Ocultar detalhes' : 'Ver detalhes'}
        </button>
        {temOcorrencia && (
          <button type="button" onClick={() => setVerAlternativas(true)} className="rounded bg-green-700 px-3 py-1 font-semibold text-white">Ver outros caminhos</button>
        )}
      </div>
      {verDetalhes && <RouteDetails rota={habitual} />}
      {verAlternativas && <AlternativesList habitual={habitual} busca={busca} />}
    </section>
  )
}
