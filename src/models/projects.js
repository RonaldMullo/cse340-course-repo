import pool from '../database/connection.js';

async function getAllProjects() {
  const result = await pool.query(`
    SELECT
      p.*,
      o.organization_name
    FROM projects AS p
    JOIN organizations AS o
      ON p.organization_id = o.organization_id
    ORDER BY p.project_name
  `);

  return result.rows;
}

async function getUpcomingProjects(limit = 5) {
  const result = await pool.query(
    `
      SELECT
        p.*,
        o.organization_name
      FROM projects AS p
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      WHERE p.project_date >= CURRENT_DATE
      ORDER BY p.project_date ASC
      LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}

async function getProjectById(projectId) {
  const result = await pool.query(
    `
      SELECT
        p.*,
        o.organization_name
      FROM projects AS p
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      WHERE p.project_id = $1
    `,
    [projectId]
  );

  return result.rows[0];
}

async function getProjectsByOrganizationId(organizationId) {
  const result = await pool.query(
    `
      SELECT *
      FROM projects
      WHERE organization_id = $1
      ORDER BY project_date
    `,
    [organizationId]
  );

  return result.rows;
}

async function createProject(
  title,
  description,
  location,
  date,
  organizationId
) {
  const result = await pool.query(
    `
      INSERT INTO projects (
        project_name,
        project_description,
        project_location,
        project_date,
        organization_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id
    `,
    [
      title,
      description,
      location,
      date,
      organizationId,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error('Failed to create project.');
  }

  return result.rows[0].project_id;
}

async function updateProject(
  projectId,
  title,
  description,
  location,
  date,
  organizationId
) {
  const result = await pool.query(
    `
      UPDATE projects
      SET
        project_name = $1,
        project_description = $2,
        project_location = $3,
        project_date = $4,
        organization_id = $5
      WHERE project_id = $6
      RETURNING project_id
    `,
    [
      title,
      description,
      location,
      date,
      organizationId,
      projectId,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error('Project not found.');
  }

  return result.rows[0].project_id;
}

export default {
  getAllProjects,
  getUpcomingProjects,
  getProjectById,
  getProjectsByOrganizationId,
  createProject,
  updateProject,
};