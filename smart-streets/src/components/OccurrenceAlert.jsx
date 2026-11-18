import { useState } from 'react'
import { formatarMinutos } from '../domain/trajetos'

export default function OccurrenceAlert({ rota, onAlternativas }) {
  const [aberto, setAberto] = useState(true)
  return (
    <section aria-label="Ocorrências registradas" className="space-y-2">
      {aberto && (
        <div role="alert" className="rounded-lg border-l-4 border-yellow-600 bg-yellow-50 p-3 text-yellow-900">
          <p className="font-semibold">Atenção: ocorreu um imprevisto no seu caminho. Deseja procurar uma alternativa?</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={onAlternativas} className="rounded bg-green-700 px-3 py-1 font-semibold text-white">Ver outros caminhos</button>
            <button type="button" onClick={() => setAberto(false)} className="rounded border border-yellow-800 px-3 py-1">Manter meu caminho</button>
          </div>
        </div>
      )}
      <ul className="space-y-1">
        {rota.ocorrencias.map((o) => (
          <li key={o.id} className={`rounded border p-2 ${o.bloqueada ? 'border-red-700 bg-red-50 text-red-900' : 'border-yellow-600 bg-yellow-50 text-yellow-900'}`}>
            <strong>{o.bloqueada ? 'Crítico — rota bloqueada: ' : `Atenção — atraso de ${formatarMinutos(o.minutos)}: `}</strong>
            {o.motivo}
          </li>
        ))}
      </ul>
    </section>
  )
}
