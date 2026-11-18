const ABAS = [
  ['consulta', 'Consultar trajeto'],
  ['ocorrencias', 'Ocorrências'],
  ['historico', 'Histórico'],
  ['sobre', 'Sobre'],
]

export default function MainNavigation({ ativa, onChange }) {
  return (
    <nav aria-label="Principal" className="border-b border-green-200 bg-white">
      <ul className="mx-auto flex max-w-4xl flex-wrap gap-1 px-2">
        {ABAS.map(([id, rotulo]) => (
          <li key={id}>
            <button
              type="button"
              aria-current={ativa === id ? 'page' : undefined}
              onClick={() => onChange(id)}
              className={`px-3 py-3 font-semibold ${ativa === id ? 'border-b-4 border-green-700 text-green-900' : 'text-gray-700'}`}
            >
              {rotulo}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
