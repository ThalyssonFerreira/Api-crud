
import { buildApp } from './app.js';
import 'dotenv/config';

const PORT = Number(process.env.PORT ?? 3000);
const HOST = '0.0.0.0';

async function start() {
  try {
    const app = await buildApp();
    await app.listen({ port: PORT, host: HOST });
    app.log.info(`HTTP on http://localhost:${PORT}`);
    app.log.info(`Docs on http://localhost:${PORT}/docs`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
