import pool from '../src/database/connection.js';

async function updateProjectLocations() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Add the column if the database still has the old structure.
    await client.query(`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS project_location VARCHAR(150);
    `);

    // Add a location to every existing project.
    await client.query(`
      UPDATE projects
      SET project_location = CASE project_name
        WHEN 'Park Cleanup' THEN 'Central City Park'
        WHEN 'Food Drive' THEN 'Community Center'
        WHEN 'Community Tutoring' THEN 'Downtown Library'
        WHEN 'Health Fair' THEN 'Civic Hall'
        WHEN 'Senior Meal Delivery' THEN 'Northside Neighborhood'
        WHEN 'Beach Cleanup' THEN 'Riverside Beach'
        ELSE 'Location to be confirmed'
      END
      WHERE project_location IS NULL
         OR TRIM(project_location) = '';
    `);

    // Require every project to have a location.
    await client.query(`
      ALTER TABLE projects
      ALTER COLUMN project_location SET NOT NULL;
    `);

    const result = await client.query(`
      SELECT
        project_id,
        project_name,
        project_location
      FROM projects
      ORDER BY project_id;
    `);

    await client.query('COMMIT');

    console.log('Project locations updated successfully:');
    console.table(result.rows);
  } catch (error) {
    await client.query('ROLLBACK');

    console.error(
      'Unable to update project locations:',
      error.message
    );

    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

updateProjectLocations();