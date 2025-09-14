// src/repositories/users.repo.js
import { query } from '../config/db.js';

export async function createUserRepo({ nome, email }) {
  const sql = `
    INSERT INTO users (nome, email)
    VALUES ($1, $2)
    RETURNING id, nome, email, created_at, updated_at;
  `;
  const { rows } = await query(sql, [nome, email]);
  return rows[0];
}

export async function getUserByIdRepo(id) {
  const { rows } = await query(
    'SELECT id, nome, email, created_at, updated_at FROM users WHERE id = $1;',
    [id]
  );
  return rows[0] || null;
}

export async function getUserByEmailRepo(email) {
  const { rows } = await query(
    'SELECT id FROM users WHERE LOWER(email) = LOWER($1);',
    [email]
  );
  return rows[0] || null;
}

export async function updateUserRepo(id, { nome, email }) {
  const fields = [];
  const params = [];
  let i = 1;

  if (nome !== undefined) { fields.push(`nome = $${i++}`); params.push(nome); }
  if (email !== undefined) { fields.push(`email = $${i++}`); params.push(email); }

  params.push(id);

  const sql = `
    UPDATE users
    SET ${fields.join(', ')}
    WHERE id = $${i}
    RETURNING id, nome, email, created_at, updated_at;
  `;
  const { rows } = await query(sql, params);
  return rows[0] || null;
}

export async function deleteUserRepo(id) {
  const { rows } = await query(
    'DELETE FROM users WHERE id = $1 RETURNING id;',
    [id]
  );
  return rows[0]?.id || null;
}

export async function listUsersRepo({ page = 1, limit = 10, search }) {
  const offset = (page - 1) * limit;

  const where = search ? 'WHERE nome ILIKE $1 OR email ILIKE $2' : '';
  const whereParams = search ? [`%${search}%`, `%${search}%`] : [];

  const dataSql = `
    SELECT id, nome, email, created_at, updated_at
    FROM users
    ${where}
    ORDER BY created_at DESC
    LIMIT $${whereParams.length + 1} OFFSET $${whereParams.length + 2};
  `;
  const dataParams = [...whereParams, limit, offset];

  const countSql = `SELECT COUNT(*)::int AS total FROM users ${where};`;

  const [{ rows: data }, { rows: [count] }] = await Promise.all([
    query(dataSql, dataParams),
    query(countSql, whereParams)
  ]);

  return { data, total: count.total, page, limit };
}
