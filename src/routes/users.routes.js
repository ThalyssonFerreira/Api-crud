// src/routes/users.routes.js
import {
  userEntity,
  createUserBody,
  updateUserBody,
  userIdParams,
  listQuery
} from '../schemas/user.schema.js';

import {
  createUserCtrl,
  getUserCtrl,
  listUsersCtrl,
  updateUserCtrl,
  deleteUserCtrl
} from '../controllers/users.controller.js';

export default async function usersRoutes(app) {
  // LIST
  app.get('/users', {
    schema: {
      tags: ['Users'],
      summary: 'Lista usuários com paginação e busca',
      querystring: listQuery,
      response: {
        200: {
          type: 'object',
          properties: {
            data: { type: 'array', items: userEntity },
            meta: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' }
              }
            }
          }
        }
      }
    }
  }, listUsersCtrl);

  // GET by ID
  app.get('/users/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Busca usuário por ID',
      params: userIdParams,
      response: { 200: userEntity }
    }
  }, getUserCtrl);

  // CREATE
  app.post('/users', {
    schema: {
      tags: ['Users'],
      summary: 'Cria usuário',
      body: createUserBody,
      response: { 201: userEntity }
    }
  }, createUserCtrl);

  // UPDATE
  app.put('/users/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Atualiza usuário',
      params: userIdParams,
      body: updateUserBody,
      response: { 200: userEntity }
    }
  }, updateUserCtrl);

  // DELETE
  app.delete('/users/:id', {
    schema: {
      tags: ['Users'],
      summary: 'Exclui usuário',
      params: userIdParams,
      response: {
        200: {
          type: 'object',
          properties: {
            deleted: { type: 'boolean' },
            id: { type: 'string', format: 'uuid' }
          }
        }
      }
    }
  }, deleteUserCtrl);
}
