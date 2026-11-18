# AI.md

## Ferramentas e finalidade
- Claude (Anthropic): gerou a primeira versão do código da aplicação (React/Vite/Tailwind), dos testes e do README, a partir do pacote de prompts do grupo (`00-CONTEXTO-COMUM.md`, `01-PROMPT-FRONT-END.md`, `02-PROMPT-WEB-DEV.md`).

## Prompts representativos
- Pedido do Lucas: implementar o trabalho de Front-end e Web Dev anexando o pacote Smart Streets.
- Prompts do pacote: ver arquivos acima (contexto comum, interface, lógica/API).
- _O grupo deve acrescentar as demais interações reais com IA._

## Aplicação no código
Todo o código em `src/`, `README.md` e os testes partiram da saída do Claude e precisam ser lidos, entendidos e ajustados pelo grupo.

## Validação feita
- `npm test`: 9 testes de regras passaram.
- `vite build`: concluído sem erro.
- CRUD (POST, GET, PUT, DELETE) testado com curl em json-server local.
- NÃO verificado: uso da interface em navegador/celular, acessibilidade com leitor de tela, serviço externo hospedado, deploy.

## Análise crítica
_A preencher pelo grupo após revisar o código: o que foi alterado, o que a IA errou ou simplificou, limitações._

## Revisão com ChatGPT/Codex
Pedido real: analisar o ZIP diante dos requisitos de Front-end/Web Dev, explicar o aviso de conexão e o botão Consultar trajeto desabilitado, e corrigir as falhas possíveis.
Resposta aplicada: diagnóstico do GET à API local não disponível; inicialização conjunta; proxy; validação estrita de respostas; recuperação após escrita; histórico seguro; limpeza de resultados ao trocar rota; detalhes de alternativas; testes e instruções atualizados. O bloqueio sem dados foi preservado para não gerar resultados falsos.
Arquivos alterados: package.json/lockfile, vite.config.js, .env.example, scripts, services, hooks, App e componentes afetados, testes, README e relatório.
Validação desta revisão:30 testes aprovados, build concluído e CRUD local via HTTP/proxy com persistência em disco. Testes de interface usam jsdom e API mockada. Chromium não iniciou neste ambiente, portanto não se afirma teste visual ou de acessibilidade em navegador real. Nenhuma API externa/deploy foi configurada nem foram confirmados GitHub/Teams.
Análise crítica da revisão: a IA ajudou a rastrear a dependência entre consulta e API e a criar regressões verificáveis. A primeira versão não automatizava a inicialização e normalizava dados inválidos de modo enganoso. Testes unitários aprovados não garantem integração hospedada ou layout correto. A equipe deve entender o código e completar os testes manuais.
As afirmações iniciais sobre Claude/curl foram preservadas como documentação do autor original, não como testes independentes feitos nesta revisão. Os exemplos concretos de respostas da interação inicial e a avaliação pessoal do grupo ainda precisam ser acrescentados, pois não foram fornecidos.
