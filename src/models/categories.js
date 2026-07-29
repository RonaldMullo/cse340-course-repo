import pool from '../database/connection.js';

async function getAllCategories() {
  const result = await pool.query(`
    SELECT *
    FROM categories
    ORDER BY category_name
  `);

  return result.rows;
}

async function getCategoryById(categoryId) {
  const result = await pool.query(
    `
      SELECT *
      FROM categories
      WHERE category_id = $1
    `,
    [categoryId]
  );

  return result.rows[0];
}

async function createCategory(categoryName) {
  const result = await pool.query(
    `
      INSERT INTO categories (category_name)
      VALUES ($1)
      RETURNING category_id
    `,
    [categoryName]
  );

  if (result.rows.length === 0) {
    throw new Error('Failed to create category.');
  }

  return result.rows[0].category_id;
}

async function updateCategory(categoryId, categoryName) {
  const result = await pool.query(
    `
      UPDATE categories
      SET category_name = $1
      WHERE category_id = $2
      RETURNING category_id
    `,
    [categoryName, categoryId]
  );

  if (result.rows.length === 0) {
    throw new Error('Category not found.');
  }

  return result.rows[0].category_id;
}

async function getCategoriesByProjectId(projectId) {
  const result = await pool.query(
    `
      SELECT c.*
      FROM categories AS c
      JOIN project_categories AS pc
        ON c.category_id = pc.category_id
      WHERE pc.project_id = $1
      ORDER BY c.category_name
    `,
    [projectId]
  );

  return result.rows;
}

async function getProjectsByCategoryId(categoryId) {
  const result = await pool.query(
    `
      SELECT
        p.*,
        o.organization_name
      FROM projects AS p
      JOIN project_categories AS pc
        ON p.project_id = pc.project_id
      JOIN organizations AS o
        ON p.organization_id = o.organization_id
      WHERE pc.category_id = $1
      ORDER BY p.project_date
    `,
    [categoryId]
  );

  return result.rows;
}

async function assignCategoryToProject(
  client,
  projectId,
  categoryId
) {
  await client.query(
    `
      INSERT INTO project_categories (
        project_id,
        category_id
      )
      VALUES ($1, $2)
    `,
    [projectId, categoryId]
  );
}

async function updateCategoryAssignments(
  projectId,
  categoryIds
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Remove the project's previous category assignments.
    await client.query(
      `
        DELETE FROM project_categories
        WHERE project_id = $1
      `,
      [projectId]
    );

    // Insert the categories currently selected.
    for (const categoryId of categoryIds) {
      await assignCategoryToProject(
        client,
        projectId,
        categoryId
      );
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
  updateCategoryAssignments,
};