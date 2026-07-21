import pool from '../database/connection.js';

async function getAllCategories() {
  const result = await pool.query('SELECT * FROM categories ORDER BY category_name');
  return result.rows;
}

async function getCategoryById(categoryId) {
  const result = await pool.query(
    'SELECT * FROM categories WHERE category_id = $1',
    [categoryId]
  );
  return result.rows[0];
}

async function getCategoriesByProjectId(projectId) {
  const result = await pool.query(
    `SELECT c.*
     FROM categories c
     JOIN project_categories pc ON c.category_id = pc.category_id
     WHERE pc.project_id = $1
     ORDER BY c.category_name`,
    [projectId]
  );
  return result.rows;
}

async function getProjectsByCategoryId(categoryId) {
  const result = await pool.query(
    `SELECT p.*, o.organization_name
     FROM projects p
     JOIN project_categories pc ON p.project_id = pc.project_id
     JOIN organizations o ON p.organization_id = o.organization_id
     WHERE pc.category_id = $1
     ORDER BY p.project_date`,
    [categoryId]
  );
  return result.rows;
}

export default {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getProjectsByCategoryId,
};