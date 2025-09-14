
import { Pool } from 'pg';
import 'dotenv/config';


const useSSL = (() => {
  const flag = (process.env.DATABASE_SSL || '').toLowerCase();
  if (flag === 'true' || flag === '1') return true;

  const url = process.env.DATABASE_URL || '';
  
  return /sslmode=require|ssl=true/i.test(url);
})();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : undefined
});

export function query(text, params) {
  return pool.query(text, params);
}

export async function dbHealth() {
  try {
    const res = await query('SELECT 1 AS ok');
    return res.rows[0]?.ok === 1;
  } catch {
    return false;
  }
}
