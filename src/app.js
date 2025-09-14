import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import healthRoutes from './routes/health.routes.js';
import usersRoutes from './routes/users.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  app.setErrorHandler((err, req, reply) => {
    reply.code(err.statusCode || 500).send({ error: err.message });
  });

  
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: { title: 'API CRUD - Usuários', description: 'Node.js + Fastify + PostgreSQL', version: '1.0.0' },
      servers: [{ url: 'http://localhost:3000' }],
      tags: [{ name: 'Health' }, { name: 'Users' }]
    }
  });

  
  app.get('/openapi.json', async () => app.swagger());


  await app.register(swaggerUi, {
    routePrefix: '/docs',
    staticCSP: true,
    transformSpecification: (spec) => spec,
    transformSpecificationClone: true,
    uiConfig: {
      url: '/openapi.json',        
      docExpansion: 'list',
      deepLinking: true
    }
  });
    app.route({
    method: ['GET', 'HEAD'],
    url: '/',
    handler: async (req, reply) => {
        const docsEnabled = (process.env.DOCS ?? 'true') !== 'false';
        if (docsEnabled) return reply.redirect(302, '/docs');
        return reply.send({ name: 'API CRUD - Usuários', docs: false, health: '/db/health' });
    }
    });

  app.get('/ping', async () => ({ pong: 'ok' }));
  await app.register(healthRoutes);
  await app.register(usersRoutes);

  return app;
}
