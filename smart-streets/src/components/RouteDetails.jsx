import { formatarMinutos } from '../domain/trajetos'

export default function RouteDetails({ rota }) {
  const linhas = [['Caminhada', rota.caminhada], ['Espera', rota.espera], ['Viagem', rota.viagem], ['Atrasos registrados', rota.atraso]]
  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4">
      <h3 className="font-semibold">Detalhes de {rota.id}</h3>
      <p className="text-sm text-gray-700">Tempos agregados simulados, sem itinerário completo.</p>
      <dl className="mt-2 space-y-1">
        {linhas.map(([nome, valor]) => (
          <div key={nome} className="flex justify-between border-b border-gray-200 py-1">
            <dt>{nome}</dt>
            <dd>{formatarMinutos(valor)}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
