import pool from '../database/connection.js';

async function getAllProjects() {
  const result = await pool.query(
    `SELECT p.*, o.organization_name
     FROM projects p
     JOIN organizations o ON p.organization_id = o.organization_id
     ORDER BY p.project_name`
  );
  return result.rows;
}

async function getUpcomingProjects(limit = 5) {
  const result = await pool.query(
    `SELECT p.*, o.organization_id, o.organization_name
     FROM projects p
     JOIN organizations o ON p.organization_id = o.organization_id
     WHERE p.project_date >= CURRENT_DATE
     ORDER BY p.project_date ASC
     LIMIT $1`,
    [limit]
  );
  return result.rows;
}

async function getProjectById(projectId) {
  const result = await pool.query(
    `SELECT p.*, o.organization_id, o.organization_name
     FROM projects p
     JOIN organizations o ON p.organization_id = o.organization_id
     WHERE p.project_id = $1`,
    [projectId]
  );
  return result.rows[0];
}

async function getProjectsByOrganizationId(organizationId) {
  const result = await pool.query(
    'SELECT * FROM projects WHERE organization_id = $1 ORDER BY project_date',
    [organizationId]
  );
  return result.rows;
}

export default {
  getAllProjects,
  getUpcomingProjects,
  getProjectById,
  getProjectsByOrganizationId,
};