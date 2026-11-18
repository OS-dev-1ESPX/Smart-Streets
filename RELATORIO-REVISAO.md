# Revisão de Front-end e Web Dev — Smart Streets
Revisão do ZIP fornecido e da captura enviada pelo grupo em17/11/2026. Referência: enunciado FIAP, Front-end pp.40–42 e Web Dev pp.59–61. Não houve acesso ao computador do aluno nem a site publicado.

## Parecer
A base está alinhada ao tema e às tecnologias exigidas. Não estava pronta para uma entrega integralmente comprovada: inicialização local pouco clara, problemas adicionais de confiabilidade, documentação de IA incompleta e API externa/deploy pendentes. A versão corrigida preserva o produto e a stack, melhora o funcionamento local e inclui testes. Ainda não comprova todos os requisitos externos.
Não há limite máximo de linhas/componentes nessas seções do enunciado; há mínimos e responsabilidades. Treze componentes e dois hooks não excedem um limite informado. Testes, services, useMemo/useCallback/useRef não são proibidos pelo enunciado consultado. A equipe precisa compreender e explicar o código.

## 1. Os dois problemas da captura têm a mesma origem
- src/services/ocorrenciasApi.js original: BASE=VITE_API_URL ou http://localhost:3001. GET /ocorrencias.
- package.json original: dev=vite e api=json-server são comandos separados.
- useOcorrencias: GET falha, define erro, pronto=false.
- App envia desabilitado={!oc.pronto} ao RouteSearchForm; o botão usa disabled.
Assim, o botão não estava sem onClick: ele estava propositalmente bloqueado para não consultar sem os dados de ocorrências. A captura confirma a falha de conexão do fetch e o bloqueio, mas não revela se no computador do usuário a API estava desligada, em outra URL/porta ou bloqueada por CORS/HTTP. Ausência de .env, sozinha, não explica tudo: havia fallback local.
Em produção, localhost aponta ao computador de quem visita. Hospedar somente a interface não disponibiliza a API local.

Correção: npm run dev inicia API+Vite; padrão /api com proxy; mensagem junto ao botão; timeout10s e tratamento de respostas. Mantido bloqueio quando o serviço realmente falha. Não adicionado fallback silencioso para JSON local, pois isso mascararia a falha e não cumpriria CRUD externo.

## 2. Matriz dos requisitos
| Critério | Evidência no código | Situação |
|---|---|---|
| React com Next.js ou Vite | package.json, vite.config.js | Atendido: Vite |
| Tailwind | plugin @tailwindcss/vite e index.css | Atendido, build passou |
| Pelo menos8 componentes | 13 arquivos JSX em src/components | Atendido |
| useState e useEffect | componentes e hooks | Atendido |
| Pelo menos2 custom hooks | useOcorrencias/useConsultaTrajeto | Atendido |
| Separar negócio/dados/visual | domain, services, hooks, components | Atendido |
| Funcionalidades ligadas ao tema | consulta, alternativas, ocorrências, histórico | Implementadas; testes de DOM e regras passaram |
| CRUD em API externa | services com GET/POST/PUT/DELETE; json-server local | Parcial: CRUD local verificado; serviço externo hospedado não configurado/comprovado |
| Aplicação compartilhada | único projeto | Compatível com as duas disciplinas |
| Repositório privado | ZIP não prova configuração GitHub | Não verificado |
| Pelo menos15 commits significativos | Sem pasta.git/histórico no ZIP | Não verificado; não criados artificialmente |
| Acesso de escrita dos professores | Depende da conta GitHub | Não verificado |
| ZIP executável/README | ZIP limpo, lockfile e instruções corrigidas | Preparado |
| AI.md completo e verdadeiro | Primeira versão tinha placeholders e pouco exemplo de respostas | Ampliado com revisão real; grupo deve completar detalhes das interações iniciais que não foram fornecidos |
| Link de deploy | README original: pendente | Pendente |
| Envio separado no Teams | Ação fora do código | Pendente de confirmação pelo grupo |

## 3. Outras falhas corrigidas
- Normalização de resposta convertia atraso inválido para0 e boolean em string parafalse. Isso podia esconder bloqueio ou subestimar tempo. Agora o contrato inválido é recusado, incluindo rota desconhecida/ID duplicado.
- PUT/POST seguido de falha no GET deixava oc.erro sem atualização e dados antigos utilizáveis. Agora marca estado indisponível, explica se a escrita foi aceita e exige atualização antes de repetir.
- Leituras concorrentes podiam sobrescrever estados mais novos. Um contador de versões ignora respostas antigas após nova leitura/mutação.
- Alterar o trajeto selecionado mantinha o resultado da consulta anterior. Agora limpa o resultado até nova consulta.
- Histórico aceitava qualquer array, inclusive null e objetos sem motivos, provocando erro em QueryHistory. Agora filtra registros e trata JSON corrompido/armazenamento negado.
- Limpar histórico ignorava falha de gravação. Agora informa que o navegador não conseguiu persistir a limpeza.
- Importação parcial de semente era difícil de retomar e repetir podia duplicar registros. Agora só cria exemplos ausentes, por comparação dos campos; pode ser retomada explicitamente. Não é garantia de idempotência entre vários usuários simultâneos de uma futura API: o servidor externo deve impor unicidade se necessária.
- Falha antiga no formulário persistia após sucesso. Agora é limpa a cada tentativa.
- Formulário não deve permitir novas mutações enquanto leitura falhou ou outra mutação está ativa. Agora o botão fica indisponível nesse estado.
- Cancelamento do diálogo durante exclusão podia interferir na ação em andamento. Cancelar/Escape bloqueados enquanto envia.
- Alternativas não tinham acesso aos próprios detalhes. Adicionado details/summary com dados agregados da alternativa.
- Aplicados foco visível, quebra de linha em ações e limite de largura do diálogo; inspeção visual real ainda necessária.
- README dizia12 componentes embora existissem13; corrigido.
- Node20+ era impreciso para as versões instaladas (Vitest requer22.12+ ou versões compatíveis especificadas pelo pacote). Documentado22.12+ e validado com24.22.1.

## 4. Validação realizada
- Instalação npm ci e build do original, com9 testes originais aprovados.
- Versão final:30 testes em4 arquivos. Regras do domínio; respostas inválidas; falha de rede/HTTP; timeout; POST/PUT/DELETE; histórico inválido; consulta/botão/retry; formulário; importação; falha de revalidação.
- Teste HTTP separado inicia os dois serviços, usa proxy Vite, faz POST/GET/PUT/DELETE e verifica registro atualizado em server/db.json. Banco original restaurado ao finalizar.
- App.test.jsx testa componentes e hooks em jsdom com API mockada. O teste HTTP usa API local real. Não confundir as duas evidências com um teste ponta a ponta no navegador.
- A tentativa de iniciar Chromium foi impedida por restrição do ambiente; não há validação visual de desktop/celular, teclado real ou leitor de tela nesta revisão. Não há teste de API externa/deploy.

## 5. Conferência manual antes de entregar
1. npm ci e npm run dev em pasta limpa. Abrir o endereço exibido.
2. Ocorrências → Adicionar exemplos iniciais. Consultar T1:1h22; alternativaT2:1h08; diferença14min.
3. I1:1h25 e sem ocorrência; S1 bloqueada ofereceS2:1h40; S2 não recomendaS1 bloqueada.
4. Criar, editar e excluir ocorrência; recarregar e confirmar persistência. Dados de teste não são ocorrência real.
5. Parar a API: consulta fica desabilitada e apresenta erro. Reiniciar e usar Tentar novamente.
6. Testar teclado, Escape/cancelar, foco, celular e ausência de rolagem horizontal. Validar leitura das mensagens.
7. Hospedar API persistente e front, definir VITE_API_URL de produção e reconstruir. Confirmar CORS, HTTPS, consulta e CRUD no domínio publicado.
8. Conferir AI.md, README, links, commits reais, privacidade do repo e escrita para os dois professores. Enviar em ambas as disciplinas.

O código original não integra Python/ThingsBoard e não afirma fazê-lo. Isso foi mantido. O produto não garante ausência de problemas, viagem real ou previsão de alagamentos.
