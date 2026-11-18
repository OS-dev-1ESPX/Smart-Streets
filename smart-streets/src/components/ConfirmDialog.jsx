import { useEffect, useRef } from 'react'

export default function ConfirmDialog({ aberto, titulo, texto, onConfirmar, onCancelar, ocupado }) {
  const ref = useRef(null)
  useEffect(() => {
    const d = ref.current
    if (aberto && !d.open) d.showModal() // dialog nativo: foco preso, Escape e retorno do foco
    if (!aberto && d.open) d.close()
  }, [aberto])
  return (
    <dialog ref={ref} onCancel={(e) => { e.preventDefault(); if (!ocupado) onCancelar() }} aria-labelledby="dlg-titulo" className="m-auto rounded-lg p-5 backdrop:bg-black/50">
      <h2 id="dlg-titulo" className="text-lg font-bold">{titulo}</h2>
      <p className="my-3">{texto}</p>
      <div className="flex justify-end gap-2">
        <button type="button" disabled={ocupado} onClick={onCancelar} className="rounded border border-gray-600 px-3 py-1">Cancelar</button>
        <button type="button" onClick={onConfirmar} disabled={ocupado} className="rounded bg-red-700 px-3 py-1 font-semibold text-white disabled:bg-gray-400">
          {ocupado ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </dialog>
  )
}
