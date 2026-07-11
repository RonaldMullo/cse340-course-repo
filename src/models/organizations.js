import pool from '../database/connection.js';

async function getAllOrganizations() {
  const result = await pool.query('SELECT * FROM organizations ORDER BY organization_name');
  return result.rows;
}

export default { getAllOrganizations };