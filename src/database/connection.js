import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is not defined. Check your .env file.'
  );
}

const isLocalDatabase =
  databaseUrl.includes('localhost') ||
  databaseUrl.includes('127.0.0.1');

const pool = new Pool({
  connectionString: databaseUrl,

  // A Render database requires SSL, even when Node runs locally.
  ssl: isLocalDatabase
    ? false
    : {
        rejectUnauthorized: false,
      },

  connectionTimeoutMillis: 10000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error.message);
});

export default pool;