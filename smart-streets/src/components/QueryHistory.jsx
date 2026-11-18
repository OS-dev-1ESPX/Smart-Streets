import { formatarMinutos } from '../domain/trajetos'

export default function QueryHistory({ historico, aviso, onLimpar }) {
  return (
    <section aria-labelledby="hist" className="space-y-3">
      <h2 id="hist" className="text-xl font-bold">Histórico de consultas</h2>
      <p className="rounded border border-gray-400 bg-gray-50 p-2 text-sm">
        O histórico mostra consultas anteriores e não representa as condições atuais. Faça uma nova consulta antes de sair.
      </p>
      {aviso && <p role="alert" className="text-red-800">{aviso}</p>}
      {historico.length === 0 ? (
        <p>Nenhuma consulta feita ainda.</p>
      ) : (
        <>
          <ul className="space-y-2">
            {historico.map((h) => (
              <li key={h.data} className="rounded border border-gray-300 bg-white p-3">
                <p className="font-semibold">{h.nome}</p>
                <p>{new Date(h.data).toLocaleString('pt-BR')} — {h.bloqueada ? 'rota bloqueada' : formatarMinutos(h.total)}</p>
                {h.motivos.length > 0 && <p className="text-sm">Ocorrências: {h.motivos.join('; ')}</p>}
              </li>
            ))}
          </ul>
          <button type="button" onClick={onLimpar} className="rounded border border-gray-600 px-3 py-1">Limpar histórico</button>
        </>
      )}
    </section>
  )
}
