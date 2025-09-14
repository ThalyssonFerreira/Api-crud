// src/schemas/user.schema.js
export const userEntity = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nome: { type: 'string' },
    email: { type: 'string', format: 'email' },
    created_at: { type: 'string' },
    updated_at: { type: 'string' }
  }
};

export const createUserBody = {
  type: 'object',
  required: ['nome', 'email'],
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' }
  },
  additionalProperties: false
};

export const updateUserBody = {
  type: 'object',
  properties: {
    nome: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' }
  },
  additionalProperties: false
};

export const userIdParams = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', format: 'uuid' }
  }
};

export const listQuery = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, default: 1 },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
    search: { type: 'string' }
  }
};
