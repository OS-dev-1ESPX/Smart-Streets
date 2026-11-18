import { describe, it, expect } from 'vitest'
import { ROTAS, avaliarRota, buscarAlternativas, formatarMinutos, validarOcorrencia } from './trajetos'

const oc = [
  { id: '1', rota: 'T1', motivo: 'Acidente', minutos: 20, bloqueada: false, simulado: true },
  { id: '2', rota: 'S1', motivo: 'Interdição', minutos: 0, bloqueada: true, simulado: true },
  { id: '3', rota: 'S2', motivo: 'Obra', minutos: 5, bloqueada: false, simulado: true },
]
const r = (id) => ROTAS.find((x) => x.id === id)

describe('formatarMinutos', () => {
  it('formata', () => {
    expect(formatarMinutos(45)).toBe('45 min')
    expect(formatarMinutos(60)).toBe('1 h')
    expect(formatarMinutos(68)).toBe('1 h 8 min')
    expect(formatarMinutos(82)).toBe('1 h 22 min')
  })
})

describe('avaliarRota e alternativas', () => {
  it('T1 = 82 e T2 = 68, diferença 14', () => {
    const t1 = avaliarRota(r('T1'), oc)
    expect(t1.total).toBe(82)
    const a = buscarAlternativas(t1, oc)
    expect(a.alternativas.map((x) => x.id)).toEqual(['T2'])
    expect(a.alternativas[0].total).toBe(68)
    expect(a.diferenca).toBe(14)
  })
  it('I1 = 85 sem ocorrência', () => {
    const i1 = avaliarRota(r('I1'), oc)
    expect(i1.total).toBe(85)
    expect(i1.ocorrencias).toHaveLength(0)
  })
  it('S1 bloqueada oferece S2 = 100 sem economia', () => {
    const s1 = avaliarRota(r('S1'), oc)
    expect(s1.bloqueada).toBe(true)
    const a = buscarAlternativas(s1, oc)
    expect(a.alternativas[0].id).toBe('S2')
    expect(a.alternativas[0].total).toBe(100)
    expect(a.situacao).toBe('habitual-bloqueada')
    expect(a.diferenca).toBeNull()
  })
  it('S2 com S1 bloqueada não tem alternativa', () => {
    const a = buscarAlternativas(avaliarRota(r('S2'), oc), oc)
    expect(a.situacao).toBe('nenhuma')
  })
  it('soma várias ocorrências e bloqueio prevalece', () => {
    const extra = [...oc, { id: '4', rota: 'T2', motivo: 'Chuva', minutos: 10, bloqueada: false }, { id: '5', rota: 'T2', motivo: 'Greve', minutos: 0, bloqueada: true }]
    const t2 = avaliarRota(r('T2'), extra)
    expect(t2.atraso).toBe(10)
    expect(t2.bloqueada).toBe(true)
  })
  it('empate não é "mais rápida"', () => {
    const empate = [{ id: '9', rota: 'T1', motivo: 'x', minutos: 6, bloqueada: false }]
    const a = buscarAlternativas(avaliarRota(r('T1'), empate), empate)
    expect(a.diferenca).toBe(0)
    expect(a.situacao).toBe('igual')
  })
})

describe('validarOcorrencia', () => {
  it('aceita dados válidos', () => {
    expect(validarOcorrencia({ rota: 'T1', motivo: ' obra ', minutos: '5', bloqueada: false })).toEqual({})
  })
  it('rejeita inválidos', () => {
    const e = validarOcorrencia({ rota: 'X9', motivo: '  ', minutos: '-1', bloqueada: 'false' })
    expect(Object.keys(e).sort()).toEqual(['bloqueada', 'minutos', 'motivo', 'rota'])
  })
})
