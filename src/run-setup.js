import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './database/connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Base de datos configurada correctamente.');
  } catch (err) {
    console.error('❌ Error al ejecutar setup.sql:');
    console.error(err);
  } finally {
    await pool.end();
  }
}

runSetup();