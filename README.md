# API CRUD – Usuários (Node.js + Fastify + PostgreSQL)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Projeto de portfólio (Dev Júnior/Estágio): API REST de **Usuários** com CRUD, validação, migrações SQL, Swagger e Docker.

**Live:** https://api-crud-8m6y.onrender.com  
> Plano Free do Render: a 1ª request após inatividade pode demorar ~50s (cold start).

---

## ✨ Principais recursos
- Fastify 5 com schemas de validação
- PostgreSQL 16 usando **SQL puro** (`pg`)
- Migrações idempotentes (runner em Node)
- Swagger/OpenAPI 3 em `/docs` e `/openapi.json`
- Dockerfile + docker-compose (API + DB)
- Seed opcional com 10 usuários
- Arquitetura em camadas (routes → controllers → services → repositories)

---

## 🧱 Estrutura do projeto
```text
src/
  config/
    db.js
    run-migrations.js
    seed.js
  controllers/
    users.controller.js
  repositories/
    users.repo.js
  routes/
    health.routes.js
    users.routes.js
  schemas/
    user.schema.js
  app.js
  server.js
migrations/
  0001_init.sql
docker-compose.yml
Dockerfile
.env (local)
```

---

## ⚙️ Variáveis de ambiente

**Local (`.env`):**
```ini
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/api_crud
DATABASE_SSL=false
DOCS=true
```

**Render (Service → Environment):**
```text
NODE_ENV=production
DATABASE_URL=postgresql://<user>:<pass>@<host>:5432/<db>   # Internal Database URL
DATABASE_SSL=true
DOCS=true            # opcional (expor /docs)
# RUN_SEED=true      # opcional (ver Dockerfile abaixo)
```
> SSL também pode ser ativado por flags na URL (`sslmode=require`/`ssl=true`).

---

## ▶️ Rodando **sem Docker** (local)
```bash
npm ci
docker compose up -d db
npm run db:migrate
npm run db:seed   # opcional
npm run dev
# http://localhost:3000/docs
```

## 🐳 Rodando **com Docker Compose** (API + DB)
```bash
docker compose up -d --build
docker compose exec api node ./src/config/run-migrations.js
docker compose exec api node ./src/config/seed.js   # opcional
# http://localhost:3000/docs
```
> No compose a API usa `DATABASE_URL=postgresql://postgres:postgres@db:5432/api_crud` e `DATABASE_SSL=false`.

---

## 📚 Documentação da API
- Swagger UI: **`/docs`**
- Spec JSON: **`/openapi.json`**

### Endpoints
- `GET /db/health` – status do banco  
- `GET /users?page=1&limit=10&search=` – listar  
- `GET /users/:id` – detalhar  
- `POST /users` – criar `{ nome, email }`  
- `PUT /users/:id` – atualizar `{ nome?, email? }`  
- `DELETE /users/:id` – excluir

### Exemplos (curl)
```bash
# criar (use e-mail único)
curl -X POST https://api-crud-8m6y.onrender.com/users   -H "Content-Type: application/json"   -d '{"nome":"João Deploy","email":"joao123@example.com"}'

# listar
curl "https://api-crud-8m6y.onrender.com/users?limit=5"

# atualizar
curl -X PUT https://api-crud-8m6y.onrender.com/users/<ID>   -H "Content-Type: application/json"   -d '{"nome":"João Silva"}'

# excluir
curl -X DELETE https://api-crud-8m6y.onrender.com/users/<ID>
```

---

## 🚀 Deploy no Render (Docker)
1. Crie um **Postgres** (mesma região do Web Service).  
2. No Web Service (Dockerfile na raiz):
   - Health Check Path: `/db/health`
   - Docker Context: `.`
   - Dockerfile Path: `Dockerfile`
   - Environment: `NODE_ENV`, `DATABASE_URL` (Internal URL), `DATABASE_SSL=true`, `DOCS=true`
3. Sem shell (plano Free), use **Pre-Deploy Command**:
```bash
node ./src/config/run-migrations.js && node ./src/config/seed.js
```
*(Depois de popular, deixe só o `run-migrations.js`.)*

### Alternativa via Dockerfile (migra no start)
```dockerfile
# trecho final do Dockerfile
ENV RUN_SEED=false
CMD ["sh","-lc","node ./src/config/run-migrations.js && ( [ "$RUN_SEED" = "true" ] && node ./src/config/seed.js || true ) && node src/server.js"]
```
- Ligue `RUN_SEED=true` uma vez (Environment) para popular e depois volte para `false`.

---

## 🛠️ Troubleshooting
- **“The server does not support SSL connections”** → `DATABASE_SSL=false` no local/compose; no Render, geralmente `true`.  
- **Swagger UI: “Unable to render this definition”** → garanta `openapi: "3.0.0"` e que o UI carrega `"/openapi.json"`.  
- **`docker compose`: `version` obsoleta** → remova a linha `version:` do topo do YAML.  
- **Porta 5432 ocupada** → use `"5433:5432"` e ajuste a `DATABASE_URL`.  
- **409 E-mail já cadastrado** → índice único funcionando :)  
- **Cold start (Render Free)** → 1ª request pode demorar ~50s.

---

## 📄 Licença
MIT — sinta-se à vontade para usar/estudar.

Feito por **ThalyssonFerreira** • Repo: `Api-crud`
