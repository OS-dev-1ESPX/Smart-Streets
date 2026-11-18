import { DESTINO } from '../domain/trajetos'

const campo = 'mt-1 w-full rounded border border-gray-500 p-2'

export default function RouteSearchForm({ origens, origem, onOrigem, rotas, rotaId, onRota, onConsultar, erro, desabilitado }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onConsultar()
      }}
      className="space-y-4 rounded-lg border border-green-200 bg-white p-4"
    >
      <div>
        <label htmlFor="origem" className="font-semibold">Origem</label>
        <select id="origem" className={campo} value={origem} onChange={(e) => onOrigem(e.target.value)}>
          <option value="">Selecione</option>
          {origens.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="rota" className="font-semibold">Trajeto habitual</label>
        <select id="rota" className={campo} value={rotaId} onChange={(e) => onRota(e.target.value)} disabled={!origem}>
          <option value="">{origem ? 'Selecione' : 'Escolha a origem primeiro'}</option>
          {rotas.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
        </select>
      </div>
      <p><span className="font-semibold">Destino:</span> {DESTINO}</p>
      {erro && <p role="alert" className="font-semibold text-red-800">{erro}</p>}
      {desabilitado && <p id="consulta-status" role="status" className="text-sm text-gray-700">Consulta temporariamente indisponível: aguardando as ocorrências do serviço. Se houver erro, use “Tentar novamente” após restabelecer a conexão.</p>}
      <button type="submit" aria-describedby={desabilitado ? 'consulta-status' : undefined} disabled={desabilitado} className="rounded bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800 disabled:bg-gray-400">
        Consultar trajeto
      </button>
    </form>
  )
}
