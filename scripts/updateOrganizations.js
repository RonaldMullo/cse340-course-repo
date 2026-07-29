import pool from '../src/database/connection.js';

async function updateOrganizations() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(`
      ALTER TABLE organizations
      ADD COLUMN IF NOT EXISTS organization_description TEXT;
    `);

    await client.query(`
      UPDATE organizations
      SET organization_description = CASE organization_name
        WHEN 'BrightFuture Builders'
          THEN 'Supports community development and assistance projects.'
        WHEN 'GreenHarvest Growers'
          THEN 'Promotes environmental care and sustainable community activities.'
        WHEN 'UnityServe Volunteers'
          THEN 'Connects volunteers with education, health, and service opportunities.'
        ELSE 'Community service organization.'
      END
      WHERE organization_description IS NULL
         OR TRIM(organization_description) = '';
    `);

    await client.query(`
      ALTER TABLE organizations
      ALTER COLUMN organization_description SET NOT NULL;
    `);

    await client.query('COMMIT');

    console.log('Organizations table updated successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

updateOrganizations();