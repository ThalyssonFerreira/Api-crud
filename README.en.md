# Users CRUD API (Node.js + Fastify + PostgreSQL)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
Portfolio project for **Junior Developer/Intern** positions: a Users REST API with full CRUD, validation, SQL migrations, OpenAPI (Swagger) docs, and Docker.

**Live:** https://api-crud-8m6y.onrender.com  
> On Render’s Free plan, the first request after inactivity may take ~50s (cold start).

---

## ✨ Highlights
- Fastify 5 with schema-based validation
- PostgreSQL 16 using **plain SQL** (`pg`)
- Idempotent SQL migrations (Node runner)
- Swagger/OpenAPI 3 at `/docs` and `/openapi.json`
- Dockerfile + docker-compose (API + DB)
- Optional seed with 10 users
- Layered architecture (routes → controllers → services → repositories)

> **Português?** Veja [README.md](./README.md).

---

## 🧱 Project structure
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

## ⚙️ Environment variables

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
DOCS=true            # optional (expose /docs)
# RUN_SEED=true      # optional (see Dockerfile below)
```
> You can also enable SSL via URL flags (`sslmode=require`/`ssl=true`).

---

## ▶️ Run **without Docker** (local)
```bash
npm ci
docker compose up -d db
npm run db:migrate
npm run db:seed   # optional
npm run dev
# http://localhost:3000/docs
```

## 🐳 Run **with Docker Compose** (API + DB)
```bash
docker compose up -d --build
docker compose exec api node ./src/config/run-migrations.js
docker compose exec api node ./src/config/seed.js   # optional
# http://localhost:3000/docs
```
> In compose the API uses `DATABASE_URL=postgresql://postgres:postgres@db:5432/api_crud` and `DATABASE_SSL=false`.

---

## 📚 API Docs
- Swagger UI: **`/docs`**
- Spec JSON: **`/openapi.json`**

### Endpoints
- `GET /db/health` – database status  
- `GET /users?page=1&limit=10&search=` – list  
- `GET /users/:id` – detail  
- `POST /users` – create `{ nome, email }`  
- `PUT /users/:id` – update `{ nome?, email? }`  
- `DELETE /users/:id` – delete

### Examples (curl)
```bash
# create (use a unique email)
curl -X POST https://api-crud-8m6y.onrender.com/users   -H "Content-Type: application/json"   -d '{"nome":"João Deploy","email":"joao123@example.com"}'

# list
curl "https://api-crud-8m6y.onrender.com/users?limit=5"

# update
curl -X PUT https://api-crud-8m6y.onrender.com/users/<ID>   -H "Content-Type: application/json"   -d '{"nome":"João Silva"}'

# delete
curl -X DELETE https://api-crud-8m6y.onrender.com/users/<ID>
```

---

## 🚀 Deploy on Render (Docker)
1. Create a **Postgres** instance (same region as the Web Service).  
2. On the Web Service (Dockerfile at repo root):
   - Health Check Path: `/db/health`
   - Docker Context: `.`
   - Dockerfile Path: `Dockerfile`
   - Environment: `NODE_ENV`, `DATABASE_URL` (Internal URL), `DATABASE_SSL=true`, `DOCS=true`
3. Without shell (Free plan), use **Pre-Deploy Command**:
```bash
node ./src/config/run-migrations.js && node ./src/config/seed.js
```
*(After seeding once, keep only `run-migrations.js`.)*

### Alternative via Dockerfile (migrate on start)
```dockerfile
# Dockerfile (tail)
ENV RUN_SEED=false
CMD ["sh","-lc","node ./src/config/run-migrations.js && ( [ "$RUN_SEED" = "true" ] && node ./src/config/seed.js || true ) && node src/server.js"]
```
- Turn `RUN_SEED=true` once to seed, then back to `false`.

---

## 🛠️ Troubleshooting
- **“The server does not support SSL connections”** → `DATABASE_SSL=false` for local/compose; `true` on Render in most cases.  
- **Swagger UI: “Unable to render this definition”** → ensure `openapi: "3.0.0"` and the UI loads `"/openapi.json"`.  
- **`docker compose`: `version` deprecated** → remove the top-level `version:` key.  
- **Port 5432 already in use** → use `"5433:5432"` and update `DATABASE_URL`.  
- **409 Email already registered** → unique index working :)  
- **Cold start (Render Free)** → first request may take ~50s.

---

## 📄 License
MIT — feel free to use/learn.

Made by **ThalyssonFerreira** • Repo: `Api-crud`
