
import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({ logger: true });

  // rota de saúde temporária
  app.get('/ping', async () => ({ pong: 'ok' }));


  return app;
}
