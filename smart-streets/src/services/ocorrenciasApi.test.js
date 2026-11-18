import { afterEach, describe, expect, it, vi } from 'vitest'
import { normalizar, listarOcorrencias, criarOcorrencia, atualizarOcorrencia, excluirOcorrencia } from './ocorrenciasApi'
const item = { id: 1, rota: 'T1', motivo: ' Obra ', minutos: 20, bloqueada: false, simulado: true }
afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers() })
describe('contrato e HTTP', () => {
  it('normaliza ID sem esconder dados inválidos', () => { expect(normalizar(item)).toEqual({ ...item, id: '1', motivo: 'Obra' }) })
  it.each([{ minutos: -1 }, { minutos: '20' }, { bloqueada: 'false' }, { rota: 'X' }, { simulado: false }, { motivo: ' ' }, { id: null }])('recusa contrato inválido %j', (campos) => { expect(() => normalizar({ ...item, ...campos })).toThrow('malformada') })
  it('lista valida itens e recusa ID repetido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([item, item]))))
    await expect(listarOcorrencias()).rejects.toThrow('repetidos')
  })
  it('não converte erro de rede em ausência de ocorrências', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
    await expect(listarOcorrencias()).rejects.toThrow('conectar')
  })
  it('trata status HTTP e resposta não JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('', { status: 503 })).mockResolvedValueOnce(new Response('<html>')))
    await expect(listarOcorrencias()).rejects.toThrow('503')
    await expect(listarOcorrencias()).rejects.toThrow('inválida')
  })
  it('POST e PUT serializam boolean/número e escapam ID; DELETE aceita 204', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(item))).mockResolvedValueOnce(new Response(JSON.stringify(item))).mockResolvedValueOnce(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)
    await criarOcorrencia({ ...item, minutos: '20' })
    await atualizarOcorrencia('a/b', item)
    await excluirOcorrencia('a/b')
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).minutos).toBe(20)
    expect(fetchMock.mock.calls[1][0]).toBe('/api/ocorrencias/a%2Fb')
    expect(fetchMock.mock.calls[2][1].method).toBe('DELETE')
  })
  it('não envia formulário inválido', async () => {
    vi.stubGlobal('fetch', vi.fn())
    await expect(criarOcorrencia({ ...item, minutos: ' ' })).rejects.toThrow('Revise')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('interrompe requisição pendurada após 10 segundos', async () => {
    vi.useFakeTimers()
    vi.stubGlobal('fetch', vi.fn((_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Timeout', 'AbortError'))))))
    const result = expect(listarOcorrencias()).rejects.toThrow('demorou')
    await vi.advanceTimersByTimeAsync(10000)
    await result
  })
})
