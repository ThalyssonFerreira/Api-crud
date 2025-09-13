// src/server.js
import { buildApp } from './app.js';
import 'dotenv/config';

const app = buildApp();

const PORT = Number(process.env.PORT ?? 3000);
const HOST = '0.0.0.0';

async function start() {
  try {
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`HTTP on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
