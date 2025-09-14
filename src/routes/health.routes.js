
import { dbHealth } from '../config/db.js';

export default async function healthRoutes(app) {
  app.get('/db/health', {
    schema: {
      tags: ['Health'],
      summary: 'Verifica conexão com o banco',
      response: {
        200: {
          type: 'object',
          properties: { database: { type: 'string' } }
        }
      }
    }
  }, async () => {
    const ok = await dbHealth();
    return { database: ok ? 'ok' : 'down' };
  });
}
