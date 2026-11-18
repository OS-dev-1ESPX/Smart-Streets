import RouteDetails from './RouteDetails'
import { formatarMinutos } from '../domain/trajetos'

export default function AlternativesList({ habitual, busca }) {
  const { alternativas, situacao, diferenca } = busca
  if (situacao === 'nenhuma')
    return <p className="rounded border border-gray-400 bg-gray-50 p-3">Não há outro caminho disponível para esta origem.</p>
  const plural = alternativas.length > 1
  const mensagens = {
    'mais-rapida': `${plural ? 'Opções mais rápidas' : 'Opção mais rápida'}: economia de ${formatarMinutos(diferenca)} em relação ao seu trajeto.`,
    igual: 'As alternativas têm o mesmo tempo do seu trajeto.',
    'mais-longa': `As alternativas não são melhores: levam ${formatarMinutos(-diferenca)} a mais.`,
    'habitual-bloqueada': 'Seu trajeto está bloqueado. Esta é uma alternativa disponível, sem comparação de economia.',
  }
  return (
    <div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-3">
      <h3 className="font-semibold">Outros caminhos para {habitual.id}</h3>
      <p>{mensagens[situacao]}</p>
      <ul className="space-y-1">
        {alternativas.map((a) => (
          <li key={a.id} className="rounded border border-green-300 bg-white p-2">
            {a.nome} — <strong>{formatarMinutos(a.total)}</strong>
            {a.atraso > 0 && ` (inclui atraso de ${formatarMinutos(a.atraso)})`}
            <details className="mt-2"><summary className="cursor-pointer font-semibold">Ver detalhes de {a.id}</summary><RouteDetails rota={a} /></details>
          </li>
        ))}
      </ul>
    </div>
  )
}
