import pool from '../database/connection.js';

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY category_name');
  return result.rows;
}

export default { getAllCategories };