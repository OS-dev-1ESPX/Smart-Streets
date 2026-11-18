import { useState } from 'react'
import { ROTAS, formatarMinutos } from '../domain/trajetos'

export default function OccurrenceList({ ocorrencias, onEditar, onExcluir, onImportar, salvando }) {
  const [filtro, setFiltro] = useState('')
  const lista = filtro ? ocorrencias.filter((o) => o.rota === filtro) : ocorrencias
  return (
    <section aria-labelledby="lista-oc" className="space-y-3">
      <h3 id="lista-oc" className="text-lg font-bold">Ocorrências simuladas</h3>
      <div>
        <label htmlFor="filtro" className="font-semibold">Filtrar por rota </label>
        <select id="filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)} className="rounded border border-gray-500 p-1">
          <option value="">Todas</option>
          {ROTAS.map((r) => <option key={r.id} value={r.id}>{r.id}</option>)}
        </select>
      </div>
      {(
        <div className="rounded border border-gray-400 bg-gray-50 p-3">
          <p>{ocorrencias.length === 0 ? 'Nenhuma ocorrência registrada no serviço.' : 'Adicionar os exemplos que estiverem faltando não apaga seus registros. Exemplos excluídos serão recriados se você usar esta ação.'}</p>
          <button type="button" onClick={onImportar} disabled={salvando} className="mt-2 rounded border border-green-700 px-3 py-1 font-semibold text-green-900 disabled:opacity-50">
            Adicionar exemplos iniciais
          </button>
        </div>
      )}
      {ocorrencias.length > 0 && lista.length === 0 && <p>Nenhuma ocorrência para esta rota.</p>}
      <ul className="space-y-2">
        {lista.map((o) => (
          <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-300 bg-white p-3">
            <span>
              <strong>{o.rota}</strong> — {o.motivo}{' '}
              <em>({o.bloqueada ? 'rota bloqueada' : `atraso de ${formatarMinutos(o.minutos)}`})</em>
            </span>
            <span className="flex gap-2">
              <button type="button" disabled={salvando} onClick={() => onEditar(o)} className="rounded border border-green-700 px-2 py-1">Editar</button>
              <button type="button" disabled={salvando} onClick={() => onExcluir(o)} className="rounded border border-red-700 px-2 py-1 text-red-800">Excluir</button>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
