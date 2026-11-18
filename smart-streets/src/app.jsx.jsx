// @vitest-environment jsdom
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import App from './App'
import * as api from './services/ocorrenciasApi'
import seed from './data/ocorrencias-seed.json'
vi.mock('./services/ocorrenciasApi',()=>({listarOcorrencias:vi.fn(),criarOcorrencia:vi.fn(),atualizarOcorrencia:vi.fn(),excluirOcorrencia:vi.fn()}))
let records
const submit=()=>screen.getAllByRole('button',{name:'Consultar trajeto',exact:true}).at(-1)
const nav=(name)=>fireEvent.click(screen.getAllByRole('button',{name,exact:true})[0])
async function ready(){await waitFor(()=>expect(submit().disabled).toBe(false))}
beforeEach(()=>{
 vi.resetAllMocks(); localStorage.clear()
 records=seed.map((o,i)=>({...o,id:String(i+1)}))
 api.listarOcorrencias.mockImplementation(async()=>structuredClone(records))
 api.criarOcorrencia.mockImplementation(async d=>{const o={...d,minutos:Number(d.minutos),id:String(Date.now())};records.push(o);return o})
 api.atualizarOcorrencia.mockImplementation(async(id,d)=>{const o={...d,minutos:Number(d.minutos),id};records=records.map(x=>x.id===id?o:x);return o})
 api.excluirOcorrencia.mockImplementation(async id=>{records=records.filter(x=>x.id!==id)})
 HTMLDialogElement.prototype.showModal=function(){this.open=true}
 HTMLDialogElement.prototype.close=function(){this.open=false}
})
afterEach(cleanup)
function selectT1(){fireEvent.change(screen.getByLabelText('Origem'),{target:{value:'Tatuapé — ponto público simulado'}});fireEvent.change(screen.getByLabelText('Trajeto habitual'),{target:{value:'T1'}})}
describe('interface e hooks (DOM simulado)',()=>{
 it('falha na API bloqueia consulta e retry recupera',async()=>{
  api.listarOcorrencias.mockRejectedValueOnce(new Error('Falha simulada'))
  render(<App/>);await screen.findByText(/Falha simulada/);expect(submit().disabled).toBe(true)
  fireEvent.click(screen.getByRole('button',{name:'Tentar novamente'}));await ready()
  selectT1();fireEvent.click(submit());await screen.findByText('1 h 22 min')
  fireEvent.click(screen.getAllByRole('button',{name:'Ver outros caminhos'})[0]);await screen.findByText('1 h 8 min')
  expect(screen.getByText('Ver detalhes de T2')).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Trajeto habitual'),{target:{value:'T2'}})
  expect(screen.queryByText('1 h 22 min')).toBeNull()
 })
 it('grava, edita e exclui pelo formulário',async()=>{
  render(<App/>);await ready();nav('Ocorrências')
  fireEvent.change(screen.getByLabelText('Rota'),{target:{value:'I1'}})
  fireEvent.change(screen.getByLabelText('Motivo'),{target:{value:'Teste UI'}})
  fireEvent.change(screen.getByLabelText('Atraso (minutos)'),{target:{value:'7'}})
  fireEvent.click(screen.getByRole('button',{name:'Registrar ocorrência',exact:true}))
  await screen.findByText('Ocorrência registrada.')
  let row=screen.getByText(/Teste UI/).closest('li')
  fireEvent.click([...row.querySelectorAll('button')].find(x=>x.textContent==='Editar'))
  fireEvent.change(screen.getByLabelText('Atraso (minutos)'),{target:{value:'9'}})
  fireEvent.click(screen.getByRole('button',{name:'Salvar alterações'}));await screen.findByText('Ocorrência atualizada.')
  expect(records.find(x=>x.motivo==='Teste UI').minutos).toBe(9)
  row=screen.getByText(/Teste UI/).closest('li');fireEvent.click([...row.querySelectorAll('button')].find(x=>x.textContent==='Excluir'))
  const dialog=screen.getByRole('dialog');fireEvent.click([...dialog.querySelectorAll('button')].find(x=>x.textContent==='Excluir'))
  await screen.findByText('Ocorrência excluída.');expect(records.some(x=>x.motivo==='Teste UI')).toBe(false)
 })
 it('escrita aceita e revalidação falha bloqueia os dados antigos',async()=>{
  render(<App/>);await ready();nav('Ocorrências')
  fireEvent.change(screen.getByLabelText('Rota'),{target:{value:'I1'}})
  fireEvent.change(screen.getByLabelText('Motivo'),{target:{value:'Teste revalidar'}})
  api.listarOcorrencias.mockRejectedValueOnce(new Error('GET indisponível'))
  fireEvent.click(screen.getByRole('button',{name:'Registrar ocorrência',exact:true}))
  await waitFor(()=>expect(screen.getAllByText(/A alteração foi aceita/).length).toBeGreaterThan(0))
  nav('Consultar trajeto');expect(submit().disabled).toBe(true)
  fireEvent.click(screen.getByRole('button',{name:'Tentar novamente'}));await ready()
  expect(records.filter(x=>x.motivo==='Teste revalidar')).toHaveLength(1)
 })
 it('importar novamente não duplica a semente existente',async()=>{
  render(<App/>);await ready();nav('Ocorrências')
  fireEvent.click(screen.getByRole('button',{name:'Adicionar exemplos iniciais'}))
  await screen.findByText('Ocorrências iniciais importadas.');expect(api.criarOcorrencia).not.toHaveBeenCalled()
 })
 it('ignora registros inválidos no histórico',async()=>{
  localStorage.setItem('smart-streets:historico','[null,{}]');render(<App/>);await ready();nav('Histórico')
  expect(screen.getByText('Nenhuma consulta feita ainda.')).toBeTruthy()
 })
})
