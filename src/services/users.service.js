
import {
  createUserRepo,
  getUserByEmailRepo,
  getUserByIdRepo,
  updateUserRepo,
  deleteUserRepo,
  listUsersRepo
} from '../repositories/users.repo.js';

function httpError(statusCode, message) {
  const e = new Error(message);
  e.statusCode = statusCode;
  return e;
}

export async function createUserService({ nome, email }) {

  const nomeTrim = nome.trim();
  const emailTrim = email.trim();

 
  const exists = await getUserByEmailRepo(emailTrim);
  if (exists) throw httpError(409, 'E-mail já cadastrado');

  try {
    return await createUserRepo({ nome: nomeTrim, email: emailTrim });
  } catch (err) {
   
    if (err.code === '23505') throw httpError(409, 'E-mail já cadastrado');
    throw err;
  }
}

export async function getUserService(id) {
  const user = await getUserByIdRepo(id);
  if (!user) throw httpError(404, 'Usuário não encontrado');
  return user;
}

export async function listUsersService({ page, limit, search }) {
  const { data, total } = await listUsersRepo({ page, limit, search });
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    data,
    meta: { page, limit, total, totalPages }
  };
}

export async function updateUserService(id, data) {

  const current = await getUserByIdRepo(id);
  if (!current) throw httpError(404, 'Usuário não encontrado');


  if (data.email && data.email.trim().toLowerCase() !== current.email.toLowerCase()) {
    const dup = await getUserByEmailRepo(data.email.trim());
    if (dup) throw httpError(409, 'E-mail já cadastrado');
  }

  const updated = await updateUserRepo(id, {
    nome: data.nome?.trim(),
    email: data.email?.trim()
  });
  return updated;
}

export async function deleteUserService(id) {
  const deletedId = await deleteUserRepo(id);
  if (!deletedId) throw httpError(404, 'Usuário não encontrado');
  return { id: deletedId };
}
