# Smart Streets
Aplicação acadêmica FIAP, Engenharia de Software, 1ESPX, Global Solution 2026.2. Mesma aplicação para Front-end Design e Web Development, com entregas separadas. Dados simulados, destino fixo Bela Vista/FIAP Paulista. Sem GPS, pagamento, previsão de acidentes ou trânsito ao vivo.

## Equipe
- Vinicius Di Tulio Gomes Silva — RM 573019
- Lucas Zarantonelli Lourenço — RM 569164
- Felipe Romano de Paula Souza — RM 571653
- Nicole Barbosa Oliveira de Lima — RM 569505

## Início rápido (Windows, Linux ou macOS)
Requer Node.js **22.12 ou superior** e npm, compatível com as versões instaladas e testes. A versão usada nesta revisão foi Node 24.22.1. Consulte `node -v`.

Extraia o ZIP e abra um terminal na pasta que contém package.json:

```bash
npm ci
npm run dev
```

Este comando inicia **API local e interface juntas**. Abra a URL que o Vite mostrar no terminal e mantenha-o aberto. Ctrl+C encerra os dois serviços. Não abra index.html diretamente nem use apenas Live Server.

Para uso local não é necessário criar .env: o padrão é `/api`, encaminhado pelo Vite à API em `127.0.0.1:3001`. Se você copiou um .env antigo com outra URL, remova essa configuração ou deixe `VITE_API_URL=` vazio e reinicie. Uma URL explícita tem prioridade sobre o proxy.

O banco começa vazio, como no original. Na aba **Ocorrências**, clique **Adicionar exemplos iniciais** para os cenários T1=82, T2=68, S1 bloqueada e S2=100. A ação é explícita, não roda ao abrir a página e não duplica exemplos idênticos. Se a importação falhar no meio, atualize a lista e repita para completar. Se você excluir um exemplo e clicar novamente, ele será recriado. Os dados são persistidos em server/db.json.

## Por que o botão estava desabilitado?
A versão original iniciava apenas Vite com npm run dev, enquanto a API precisava de npm run api em outro terminal. O front fazia GET em localhost:3001. Com falha na leitura, oc.pronto era false e o botão ficava desabilitado deliberadamente. O erro pode também ocorrer com URL errada, porta ocupada, CORS ou bloqueio HTTP/HTTPS.
A proteção permanece: sem os registros, não é correto dizer que não há ocorrências. A correção inicia ambos localmente e informa a indisponibilidade. Após restabelecer o serviço, use Tentar novamente.

## Scripts
- `npm run dev`: API + interface, comando recomendado para testar localmente.
- `npm run api`: somente json-server, porta3001.
- `npm run dev:web`: somente Vite, para quem já iniciou a API ou usa serviço externo.
- `npm test`: 30 testes de regras, services e componentes/hooks em jsdom.
- `npm run test:api`: integração HTTP local via proxy, CRUD e persistência em disco. Execute sem outros servidores nestas portas e sem editar o banco durante o teste. Usa portas3001/5179 e restaura o banco original ao terminar.
- `npm run build`: gera dist.
- `npm run preview`: serve o build para conferir localmente. Inicie npm run api em outro terminal se o build usar /api; preview não inicia a API sozinho.

## Estrutura e critérios técnicos
React19, Vite8, Tailwind4 e json-server0.17.4, com lockfile para reprodução. Não há migração para outra stack.
- `src/components`: **13 componentes** de apresentação.
- `src/hooks/useOcorrencias.js`: estado, leitura, CRUD, revalidação e importação explícita.
- `src/hooks/useConsultaTrajeto.js`: seleção, resultado e histórico.
- `src/domain/trajetos.js`: cálculo, bloqueio, alternativas e validação.
- `src/services`: transporte HTTP e armazenamento de histórico.
- `scripts/dev.mjs`: inicialização local dos dois processos.

## API
Base: VITE_API_URL, sem /ocorrencias no fim; padrão local /api. GET e POST /ocorrencias; PUT e DELETE /ocorrencias/:id.
Registro: id string ou número convertido para string; rota cadastrada; motivo não vazio; minutos número inteiro >=0; bloqueada boolean; simulado=true. Dados fora desse contrato são rejeitados para evitar resultados enganosos. Formulário converte o número digitado antes de enviar.
O fetch limita a espera a10s. A API precisa permitir os métodos/CORS necessários. A URL do serviço não é segredo; tokens e senhas não devem ir para VITE_*, pois essas variáveis são incorporadas ao JavaScript entregue ao navegador.

## Deploy e API externa — pendentes
O serviço local funciona, mas **não é uma API externa hospedada** comprovada. O ZIP não contém URL de serviço público nem link de deploy. Publicar apenas dist não publica json-server. Confirmem o atendimento à exigência de API externa do professor e usem um serviço persistente acessível pelo avaliador.

Para deploy estático: hospedar/configurar a API HTTPS, garantir armazenamento persistente e CORS, definir VITE_API_URL no ambiente de build e gerar/publicar o build novamente. Alternativamente, configurar no host um proxy de produção para /api. O proxy de vite.config.js é para dev/preview e não acompanha os arquivos estáticos.
Nunca usar localhost como API de um site publicado: no navegador do professor, localhost é o computador dele. Testar GET/POST/PUT/DELETE pelo site publicado e recarregar para confirmar persistência.
Links do deploy e da API: **pendentes de configuração pelo grupo**. Nenhum serviço externo foi criado ou publicado nesta revisão.

## Entrega
Consultar RELATORIO-REVISAO.md. Entregar separadamente aos dois professores: repositório privado, ZIP, README, AI.md e link do deploy (explicitamente listado em Front-end). Confirmar acesso de escrita para ambos. Pelo menos15 commits significativos reais; não há histórico Git no ZIP para conferir.

## Validação e limites desta revisão
- npm ci executado; testes originais9 passaram.
- Após correções:30 testes passaram e build concluído.
- CRUD real local via proxy verificado, com leitura do banco em disco.
- Componentes testados em DOM simulado com a API mockada; isso não é teste de layout em navegador real.
- Navegador gráfico/headless não pôde ser iniciado neste ambiente. Responsividade visual, teclado real, leitor de tela, produção e acesso dos professores precisam de conferência manual.
- Não confundir dados simulados com dados atuais da cidade. Histórico é consulta antiga.

## Referências
- Enunciado do grupo: Front-end pp.40–42; Web Dev pp.59–61.
- Vite: https://vite.dev/guide/env-and-mode
- JSON Server: https://github.com/typicode/json-server/tree/v0.17.4
