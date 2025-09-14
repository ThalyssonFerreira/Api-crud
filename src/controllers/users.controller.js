import {
  createUserService,
  getUserService,
  listUsersService,
  updateUserService,
  deleteUserService
} from '../services/users.service.js';

export async function createUserCtrl(req, reply) {
  const user = await createUserService(req.body);
  reply.code(201).send(user);
}

export async function getUserCtrl(req, reply) {
  const user = await getUserService(req.params.id);
  reply.send(user);
}

export async function listUsersCtrl(req, reply) {
  const { page = 1, limit = 10, search } = req.query;
  const result = await listUsersService({ page, limit, search });
  reply.send(result);
}

export async function updateUserCtrl(req, reply) {
  const user = await updateUserService(req.params.id, req.body);
  reply.send(user);
}

export async function deleteUserCtrl(req, reply) {
  const res = await deleteUserService(req.params.id);
  reply.send({ deleted: true, id: res.id });
}
