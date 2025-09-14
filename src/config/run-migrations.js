
import fs from 'fs';
import path from 'path';
import url from 'url';
import { Pool } from 'pg';
import 'dotenv/config';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      run_on TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function getAppliedMigrations(client) {
  const { rows } = await client.query('SELECT id FROM _migrations ORDER BY id ASC;');
  return new Set(rows.map(r => r.id));
}

async function applyMigration(client, file, sql) {
  await client.query('BEGIN');
  try {
    await client.query(sql);
    await client.query('INSERT INTO _migrations (id) VALUES ($1);', [file]);
    await client.query('COMMIT');
    return true;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  }
}

async function run() {
  const client = await pool.connect();
  try {
    await ensureMigrationsTable(client);

    const applied = await getAppliedMigrations(client);
    const files = fs
      .readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));

    if (files.length === 0) {
      console.log('Nenhuma migração encontrada em /migrations.');
      return;
    }

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`- já aplicada: ${file}`);
        continue;
      }

      const full = path.join(migrationsDir, file);
      const sql = fs.readFileSync(full, 'utf-8');

      process.stdout.write(`> aplicando: ${file} ... `);
      await applyMigration(client, file, sql);
      console.log('ok');
    }

    console.log('Migrações concluídas ✔');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('\nFalha nas migrações:', err.message);
  process.exit(1);
});
