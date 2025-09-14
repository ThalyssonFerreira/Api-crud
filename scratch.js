// scratch.js
import { query, pool } from './src/config/db.js';

try {
  const { rows } = await query(
    'INSERT INTO users (nome, email) VALUES ($1, $2) RETURNING id, nome, email, created_at',
    ['Alice Teste', 'alice@example.com']
  );
  console.log(rows[0]);
} catch (e) {
  console.error(e);
} finally {
  await pool.end();
}
