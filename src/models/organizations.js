import pool from '../database/connection.js';

async function getAllOrganizations() {
  const result = await pool.query('SELECT * FROM organizations ORDER BY organization_name');
  return result.rows;
}

async function getOrganizationById(organizationId) {
  const result = await pool.query(
    'SELECT * FROM organizations WHERE organization_id = $1',
    [organizationId]
  );
  return result.rows[0];
}

export default { getAllOrganizations, getOrganizationById };