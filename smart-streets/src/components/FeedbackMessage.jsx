const estilos = {
  erro: 'border-red-700 bg-red-50 text-red-900',
  sucesso: 'border-green-700 bg-green-50 text-green-900',
  info: 'border-gray-400 bg-gray-50 text-gray-800',
}
const rotulos = { erro: 'Erro', sucesso: 'Sucesso', info: 'Aviso' }

export default function FeedbackMessage({ tipo = 'info', children, onRetry }) {
  return (
    <div role={tipo === 'erro' ? 'alert' : 'status'} className={`rounded-lg border-l-4 p-3 ${estilos[tipo]}`}>
      <strong>{rotulos[tipo]}: </strong>
      {children}
      {onRetry && (
        <button type="button" onClick={onRetry} className="ml-3 rounded border border-current px-2 py-1 text-sm font-semibold">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
