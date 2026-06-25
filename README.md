# Desafio QA — Estratégia de Testes (Pesquisa de Clima)

Olá! Este é o desafio prático para a vaga de **QA**. O repositório contém uma aplicação funcional e **sem nenhum teste,** escrever a estratégia de testes é exatamente o seu trabalho aqui.

## O app

Um CRUD de **pesquisa de clima**: um admin cria pesquisas com perguntas de vários tipos, publica um link público, e respondentes preenchem esse link. **Não há autenticação**, as rotas são abertas. É composto por:

- **API** (NestJS + Prisma) em `apps/api`
- **Web** (React + Vite) em `apps/web`, organizada em camadas **view / service / container**
- **Banco** MySQL 8

As operações principais são: **criar** e **listar** pesquisas, e **responder** uma pesquisa pelo link público.

Tudo sobe junto com `docker compose up`. O banco já vem **seedado** com dados em estados variados, prontos para você apontar seus testes.

## A tarefa

Você foi contratado(a) para definir **a estratégia de testes que adotaria como padrão do time** para um app como este. Queremos ver o seu critério, não só código. Entregue:

1. **A pirâmide de testes completa** — unitário, integração e e2e. Você decide a proporção.
2. **A infraestrutura dos testes de integração** — como você garante isolamento e
  reprodutibilidade dos dados entre execuções (setup/teardown, banco, fixtures, etc.).
3. **O pipeline de CI** — como esses testes rodariam de forma confiável no GitLab CI.

### Orçamento: **30 testes no total**

Esse é o limite. Distribua os 30 entre as camadas (unitário / integração / e2e) **como você julgar melhor** para um app deste porte. Parte do que avaliamos é justamente *onde* você escolhe gastar o orçamento, e por quê.

### Entregável escrito

Junto do código, escreva um **README curto** (pode ser um `TESTING.md`) com o **motivo das suas escolhas e os trade-offs**, incluindo **como você gastou o orçamento de 30 testes** entre as camadas. Seja direto; queremos entender o seu raciocínio.

> Não estamos te dizendo o que testar nem quais regras existem, descobrir o que importa faz parte do desafio. Explore o app e o seed.

## O que já está pronto pra você

- **Pasta única de testes** em `tests/`, já dividida em `unit/`, `integration/` e `e2e/`. É onde **todos** os seus testes devem ficar.
- **Vitest** já configurado na raiz (`vitest.workspace.ts`) com dois projetos: **api** (Node) e **web** (jsdom). Coloque os specs da API em `tests/unit/api/` e `tests/integration/`, e os da web em `tests/unit/web/`.
- **Playwright** já está instalado.
- Esqueleto de **CI** em `.gitlab-ci.yml` com um job `test` marcado como `PLACEHOLDER` pra você preencher.
- Você é **livre para adicionar as dependências que quiser** (testing-library, supertest, testcontainers, etc.).

## Subir o ambiente

```bash
docker compose up
```

- **API:** [http://localhost:3000](http://localhost:3000)
- **Web:** [http://localhost:5173](http://localhost:5173)
- **MySQL:** `localhost:3306` (db `survey_db`, usuário `root`, senha `root`)

A API aplica o schema no banco ao subir e o seed popula os dados iniciais.

## Rodar os testes

```bash
# Unitário + integração (Vitest, na raiz)
npm test

# E2E (Playwright) — na raiz, com a aplicação no ar (docker compose up)
npx playwright install   # uma vez, baixa os browsers
npm run test:e2e
```

## Estrutura

```
apps/
  api/   # NestJS + Prisma (domínio + regras)
  web/   # React + Vite (view / service / container)
tests/
  unit/        # unitários (api/ e web/)
  integration/ # integração da API (HTTP + banco)
  e2e/         # Playwright (com exemplo/template)
vitest.workspace.ts
playwright.config.ts
docker-compose.yml
.gitlab-ci.yml
```

Boa sorte! 🚀