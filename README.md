# Smart Streets

Aplicação web desenvolvida para a **Global Solution 2026.2 — FIAP**, no curso de Engenharia de Software, turma **1ESPX**, para as disciplinas de Front-end e Web Development.

O Smart Streets ajuda passageiros a entender ocorrências que afetam um trajeto e a comparar alternativas cadastradas. O projeto se relaciona ao **ODS 11 — Cidades e comunidades sustentáveis**, com foco na informação para a mobilidade urbana.

**Acesse o site:** [smartstreets-nfv2.vercel.app](https://smartstreets-nfv2.vercel.app/)

> Protótipo acadêmico com dados simulados. Os tempos, trajetos e ocorrências não representam informações de transporte em tempo real nem garantem a segurança de uma rota.

## Problema e proposta

A falta de informações claras sobre atrasos e interrupções dificulta o planejamento de quem utiliza transporte público. A proposta é reunir o motivo da ocorrência, seu impacto estimado no tempo de viagem e alternativas disponíveis em uma interface simples.

Nesta versão, o destino é **Bela Vista (FIAP Paulista)**. As origens cadastradas são **Tatuapé, Itaquera e São Mateus**, com dois trajetos simulados para cada origem.

## Funcionalidades

- Seleção de origem e trajeto habitual.
- Consulta do tempo estimado, incluindo caminhada, espera, viagem e atrasos simulados.
- Exibição dos motivos das ocorrências e identificação de trajetos bloqueados.
- Comparação de alternativas da mesma origem, desconsiderando rotas bloqueadas.
- Cadastro, consulta, edição e exclusão de ocorrências por uma API externa (CRUD).
- Inclusão de exemplos iniciais pela aba **Ocorrências**.
- Histórico das últimas 20 consultas no navegador, com opção de limpeza.
- Validação dos formulários e mensagens de carregamento, erro e confirmação.
- Seção **Sobre**, com contexto, limitações e integrantes.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| React | Componentes e gerenciamento de estado da interface |
| JavaScript | Regras de comparação, validações e interação |
| Vite | Desenvolvimento local e geração do build |
| Tailwind CSS 4 | Estilização da interface |
| Fetch API | Requisições HTTP à API de ocorrências |
| MockAPI | API externa para armazenar e gerenciar ocorrências simuladas |
| localStorage | Persistência do histórico no navegador |
| Vercel | Publicação da aplicação web |

## Organização do projeto

O aplicativo está na subpasta **`smart-streets`**. Os comandos npm devem ser executados nela, onde estão `package.json` e `vite.config.js`.

| Caminho | Responsabilidade |
| --- | --- |
| `smart-streets/src/components/` | Componentes da interface |
| `smart-streets/src/hooks/` | Estado e fluxos de consulta e ocorrências |
| `smart-streets/src/services/` | Comunicação com a API e armazenamento do histórico |
| `smart-streets/src/domain/` | Cálculo dos tempos, alternativas e validações |
| `smart-streets/src/data/` | Catálogo de rotas e exemplos simulados |
| `smart-streets/src/App.jsx` | Composição da aplicação |
| `smart-streets/src/index.css` | Importação do Tailwind e estilos complementares |
| `smart-streets/vite.config.js` | Configuração do Vite e dos plugins React e Tailwind |

## Como executar localmente

Tenha Node.js compatível com o Vite instalado e npm disponível. Para este projeto, utilize **Node.js 22.12 ou superior da linha 22**.

1. Baixe ou clone este repositório e abra a pasta raiz no terminal.
2. Entre na pasta do aplicativo e instale as dependências:

```bash
cd smart-streets
npm ci --include=dev
```

3. Crie um arquivo **`.env.local` dentro de `smart-streets`**, com:

```dotenv
VITE_API_URL=https://6afdc7282a9c141d36b9048b.mockapi.io/api/v1
```

4. Inicie a aplicação:

```bash
npm run dev
```

5. Abra o endereço exibido pelo Vite no terminal. O acesso à API requer internet. Após alterar a variável de ambiente, reinicie o servidor local.

### Build de produção

```bash
npm run build
npm run preview
```

O build é gerado em `smart-streets/dist`. O comando `preview` permite conferir esse build localmente. A variável `VITE_API_URL` deve estar definida antes de gerar o build.

## API externa

**URL base:** `https://6afdc7282a9c141d36b9048b.mockapi.io/api/v1`

**Recurso:** [ocorrencias](https://6afdc7282a9c141d36b9048b.mockapi.io/api/v1/ocorrencias)

| Método | Caminho | Operação |
| --- | --- | --- |
| GET | `/ocorrencias` | Listar ocorrências |
| POST | `/ocorrencias` | Criar uma ocorrência |
| PUT | `/ocorrencias/:id` | Atualizar uma ocorrência |
| DELETE | `/ocorrencias/:id` | Excluir uma ocorrência |

Exemplo do corpo enviado no cadastro:

```json
{
  "rota": "T1",
  "motivo": "Acidente simulado: atraso estimado de 20 minutos.",
  "minutos": 20,
  "bloqueada": false,
  "simulado": true
}
```

O identificador `id` é gerado pela API. A rota deve ser uma das cadastradas (`T1`, `T2`, `I1`, `I2`, `S1` ou `S2`); o motivo não pode estar vazio; os minutos devem ser um número inteiro não negativo. Os campos `bloqueada` e `simulado` são booleanos, e `simulado` deve ser `true`.

As ocorrências ficam no serviço externo e são compartilhadas entre os visitantes. O histórico fica apenas no navegador utilizado, não é sincronizado entre dispositivos e pode ser perdido ao limpar os dados do navegador. Utilize somente dados fictícios nos cadastros.

## Regras de comparação

O tempo estimado é calculado em minutos:

**Tempo total = caminhada + espera + viagem + soma dos atrasos da rota.**

Uma ocorrência com `bloqueada: true` torna a rota indisponível. As alternativas são selecionadas entre as rotas da mesma origem, excluindo a habitual e as bloqueadas. A interface diferencia alternativas mais rápidas, de tempo igual ou mais demoradas.

Com os exemplos iniciais, a rota T1 passa de 62 para 82 minutos por um atraso de 20 minutos. A T2 permanece em 68 minutos, resultando em uma diferença de 14 minutos. Esses valores dependem das ocorrências cadastradas no momento da consulta.

## Como utilizar e verificar

1. Abra o site e aguarde o carregamento das ocorrências.
2. Na aba **Ocorrências**, utilize **Adicionar exemplos iniciais** se desejar os cenários demonstrativos.
3. Em **Consultar trajeto**, selecione uma origem e um trajeto habitual.
4. Consulte os tempos, motivos e alternativas apresentados.
5. Cadastre uma ocorrência fictícia, edite seus dados e confira o resultado da consulta.
6. Recarregue a página para conferir a persistência da ocorrência na API.
7. Exclua o registro de teste e confira a atualização da lista.
8. Consulte a aba **Histórico** para visualizar as consultas realizadas nesse navegador.

Se a API estiver indisponível ou retornar dados inválidos, a aplicação informa o problema e suspende a consulta para evitar apresentar um resultado como válido. Use **Tentar novamente** após restabelecer a conexão.

## Publicação na Vercel

| Configuração | Valor |
| --- | --- |
| Root Directory | `smart-streets` |
| Framework Preset | `Vite` |
| Install Command | `npm ci --include=dev` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Variável de ambiente | `VITE_API_URL` |
| Valor da variável | `https://6afdc7282a9c141d36b9048b.mockapi.io/api/v1` |

Configure a variável nos ambientes **Production** e **Preview**. Não acrescente `/ocorrencias` à URL base: o código já inclui esse caminho. Depois de alterar a variável, gere uma nova publicação.

Mantenha `package.json`, `package-lock.json` e `vite.config.js` atualizados no repositório. O Tailwind exige os pacotes `tailwindcss` e `@tailwindcss/vite`, além do plugin `tailwindcss()` no Vite. Não é necessário enviar `node_modules` ou `dist` ao GitHub.

`VITE_API_URL` contém um endereço público, não uma credencial. Variáveis com prefixo `VITE_` são incorporadas ao código do navegador e não devem conter senhas ou tokens secretos.

## Limitações do protótipo

- As rotas, ocorrências e estimativas são simuladas e limitadas ao catálogo cadastrado.
- Não há GPS ao vivo, integração com a SPTrans, cálculo para qualquer endereço ou previsão real de acidentes.
- A aplicação não realiza pagamentos, venda de bilhetes ou recargas.
- O módulo de sensores e ThingsBoard do projeto acadêmico é separado desta aplicação; este site utiliza a API de ocorrências do MockAPI.
- O funcionamento das operações de ocorrências depende da disponibilidade do serviço externo.

## Equipe

| Integrante | RM |
| --- | --- |
| Vinicius Di Tulio Gomes Silva | 573019 |
| Lucas Zarantonelli Lourenço | 569164 |
| Felipe Romano de Paula Souza | 571653 |
| Nicole Barbosa Oliveira de Lima | 569505 |

**Curso:** Engenharia de Software — FIAP  
**Turma:** 1ESPX  
**Projeto:** Global Solution 2026.2 — Smart Streets

## Uso de inteligência artificial

Foram utilizadas ferramentas de IA como apoio ao desenvolvimento, à revisão e à documentação. O detalhamento das ferramentas, prompts, contribuições, verificações e limitações deve constar no arquivo **`AI.md`**, que acompanha a entrega. Este README não substitui esse registro.
