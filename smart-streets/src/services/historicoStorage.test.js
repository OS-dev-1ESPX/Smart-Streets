import { afterEach, expect, it, vi } from 'vitest'
import { lerHistorico, gravarHistorico } from './historicoStorage'
afterEach(() => vi.unstubAllGlobals())
it('histórico malformado não chega ao componente', () => {
  const good = { rota: 'T1', nome: 'T1', data: '2026-11-17T12:00:00Z', total: 82, bloqueada: false, motivos: [] }
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify([null, {}, good]) })
  expect(lerHistorico()).toEqual([good])
})
it('JSON corrompido ou armazenamento negado não derruba consulta', () => {
  vi.stubGlobal('localStorage', { getItem: () => '{', setItem: () => { throw new Error('Quota') } })
  expect(lerHistorico()).toEqual([])
  expect(gravarHistorico([])).toBe(false)
})
