
import { query, pool } from './db.js';

const samples = Array.from({ length: 10 }).map((_, i) => ({
  nome: `Usuário ${i + 1}`,
  email: `user${i + 1}@example.com`
}));

async function run() {
  let ok = 0;
  for (const u of samples) {
    try {
      const { rows } = await query(
        'INSERT INTO users (nome, email) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id;',
        [u.nome, u.email]
      );
      if (rows[0]?.id) ok++;
    } catch (e) {
     
      if (e.code !== '23505') console.error('Falha ao inserir:', u.email, e.message);
    }
  }
  console.log(`Seed concluído. Inseridos: ${ok}/${samples.length}`);
  await pool.end();
}

run().catch((e) => {
  console.error('Seed falhou:', e);
  process.exit(1);
});
