# ---- build deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci   # <-- sem --omit=dev

# ---- runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
ENV RUN_SEED=false
CMD ["sh","-lc","node ./src/config/run-migrations.js && ( [ \"$RUN_SEED\" = \"true\" ] && node ./src/config/seed.js || true ) && node src/server.js"]

