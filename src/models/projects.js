import pool from '../database/connection.js';

async function getAllProjects() {
  const result = await pool.query('SELECT * FROM projects ORDER BY project_name');
  return result.rows;
}

export default { getAllProjects };