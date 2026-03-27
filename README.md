# SmartControle

Sistema web completo, simples e responsivo para controle de produtos, estoque e vendas com múltiplos vendedores.

## Stack

- Frontend: React + Vite + TypeScript + TailwindCSS
- Backend: Node.js + TypeScript + Express
- Banco: PostgreSQL
- ORM: Prisma
- Autenticação: JWT
- Upload de imagens: armazenamento local em `apps/api/uploads`
- Orquestração local: Docker Compose

## Estrutura

- `apps/api`: API REST, autenticação, regras de negócio, Prisma e seed
- `apps/web`: interface web responsiva para admin e vendedores
- `docker-compose.yml`: sobe PostgreSQL, API e frontend

## Funcionalidades implementadas

- Login seguro com senha criptografada (bcrypt)
- Perfis e permissões (`ADMIN` e `SELLER`)
- Cadastro/edição/exclusão de produtos (admin)
- Upload e exibição de foto do produto
- Controle de estoque com entradas, ajustes e histórico de movimentações
- Registro de vendas com baixa automática de estoque
- Bloqueio de venda de produto inativo
- Bloqueio de estoque negativo
- Proteção contra inconsistência em venda simultânea (transação + `updateMany` condicional)
- Dashboard com indicadores, ranking e últimas vendas
- Relatórios (vendas, estoque baixo, movimentações)
- Exportação CSV de vendas por período
- Interface responsiva (cards mobile e tabela desktop no histórico)
- Toast de sucesso/erro e confirmação antes de exclusões

## Seed inicial

Cria automaticamente:

- 1 admin: `admin / admin123`
- 2 vendedores: `vendedor1 / vendedor123` e `vendedor2 / vendedor123`
- Produtos de exemplo com estoque inicial e movimentação `ENTRY`

## Rodando com Docker Compose

1. Na raiz do projeto:

```bash
docker compose up --build
```

2. Acesse:

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3333](http://localhost:3333)
- Healthcheck API: [http://localhost:3333/health](http://localhost:3333/health)

## Rodando local sem Docker

### Pré-requisitos

- Node.js 20+
- PostgreSQL 16+

### 1) Configurar ambiente API

```bash
cp apps/api/.env.example apps/api/.env
```

Ajuste `DATABASE_URL` se necessário.

### 2) Configurar ambiente Web

```bash
cp apps/web/.env.example apps/web/.env
```

### 3) Instalar dependências

```bash
npm install
```

### 4) Migrar banco + gerar client + seed

```bash
cd apps/api
npx prisma migrate dev --name init
npm run db:seed
```

### 5) Rodar API e Web

Em terminais separados:

```bash
npm run dev:api
npm run dev:web
```

## Rotas principais da API

- `POST /auth/login`
- `GET /auth/me`
- `GET/POST/PUT/DELETE /users` (admin)
- `GET/POST/PUT/DELETE /products`
- `GET/POST /sales`
- `POST /stock/entry` (admin)
- `POST /stock/adjust` (admin)
- `GET /stock/movements` (admin)
- `GET /dashboard`
- `GET /reports/sales` (`?format=csv`)
- `GET /reports/stock`
- `GET /reports/movements`

## Observações

- Imagens de produtos ficam em `apps/api/uploads`.
- Para produção, altere `JWT_SECRET`, CORS e credenciais do banco.
