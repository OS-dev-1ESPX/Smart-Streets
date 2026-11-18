import { useEffect, useState } from 'react'
import { ROTAS, validarOcorrencia } from '../domain/trajetos'

const vazio = { rota: '', motivo: '', minutos: '0', bloqueada: false }
const campo = 'mt-1 w-full rounded border border-gray-500 p-2'

export default function OccurrenceForm({ editando, onSalvar, onCancelar, salvando, desabilitado = false }) {
  const [dados, setDados] = useState(vazio)
  const [erros, setErros] = useState({})
  const [falha, setFalha] = useState('')

  useEffect(() => {
    setDados(editando ? { rota: editando.rota, motivo: editando.motivo, minutos: String(editando.minutos), bloqueada: editando.bloqueada } : vazio)
    setErros({})
    setFalha('')
  }, [editando])

  const mudar = (k, v) => setDados((d) => ({ ...d, [k]: v }))

  async function enviar(e) {
    e.preventDefault()
    setFalha('')
    const e2 = validarOcorrencia(dados)
    setErros(e2)
    if (Object.keys(e2).length) return
    const r = await onSalvar(dados)
    if (r.ok) setDados(vazio)
    else setFalha(r.mensagem) // mantém os dados digitados
  }

  return (
    <form onSubmit={enviar} className="space-y-3 rounded-lg border border-green-200 bg-white p-4">
      <h3 className="font-semibold">{editando ? 'Editar ocorrência simulada' : 'Registrar ocorrência simulada'}</h3>
      <div>
        <label htmlFor="oc-rota" className="font-semibold">Rota</label>
        <select id="oc-rota" className={campo} value={dados.rota} onChange={(e) => mudar('rota', e.target.value)}>
          <option value="">Selecione</option>
          {ROTAS.map((r) => <option key={r.id} value={r.id}>{r.nome}</option>)}
        </select>
        {erros.rota && <p role="alert" className="text-red-800">{erros.rota}</p>}
      </div>
      <div>
        <label htmlFor="oc-motivo" className="font-semibold">Motivo</label>
        <input id="oc-motivo" className={campo} value={dados.motivo} onChange={(e) => mudar('motivo', e.target.value)} />
        {erros.motivo && <p role="alert" className="text-red-800">{erros.motivo}</p>}
      </div>
      <div>
        <label htmlFor="oc-min" className="font-semibold">Atraso (minutos)</label>
        <input id="oc-min" type="number" min="0" step="1" className={campo} value={dados.minutos} onChange={(e) => mudar('minutos', e.target.value)} />
        {erros.minutos && <p role="alert" className="text-red-800">{erros.minutos}</p>}
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={dados.bloqueada} onChange={(e) => mudar('bloqueada', e.target.checked)} />
        Rota totalmente bloqueada
      </label>
      {falha && <p role="alert" className="font-semibold text-red-800">{falha} Seus dados foram mantidos; tente novamente.</p>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={salvando || desabilitado} className="rounded bg-green-700 px-4 py-2 font-semibold text-white disabled:bg-gray-400">
          {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Registrar ocorrência'}
        </button>
        {editando && <button type="button" disabled={salvando} onClick={onCancelar} className="rounded border border-gray-600 px-4 py-2">Cancelar</button>}
      </div>
    </form>
  )
}
