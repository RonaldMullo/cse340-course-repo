import pool from '../database/connection.js';

async function getAllOrganizations() {
  const result = await pool.query(`
    SELECT *
    FROM organizations
    ORDER BY organization_name
  `);

  return result.rows;
}

async function getOrganizationById(organizationId) {
  const result = await pool.query(
    `
      SELECT *
      FROM organizations
      WHERE organization_id = $1
    `,
    [organizationId]
  );

  return result.rows[0];
}

async function createOrganization(
  name,
  description,
  contactEmail,
  image
) {
  const result = await pool.query(
    `
      INSERT INTO organizations (
        organization_name,
        organization_description,
        organization_email,
        organization_image
      )
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `,
    [name, description, contactEmail, image]
  );

  if (result.rows.length === 0) {
    throw new Error('Failed to create organization.');
  }

  return result.rows[0].organization_id;
}

async function updateOrganization(
  organizationId,
  name,
  description,
  contactEmail
) {
  const result = await pool.query(
    `
      UPDATE organizations
      SET
        organization_name = $1,
        organization_description = $2,
        organization_email = $3
      WHERE organization_id = $4
      RETURNING organization_id
    `,
    [
      name,
      description,
      contactEmail,
      organizationId,
    ]
  );

  if (result.rows.length === 0) {
    throw new Error('Organization not found.');
  }

  return result.rows[0].organization_id;
}

export default {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
};