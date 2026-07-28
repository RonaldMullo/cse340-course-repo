import {
  body,
  validationResult,
} from 'express-validator';

import categoriesModel from '../models/categories.js';

const categoryValidation = [
  body('categoryName')
    .trim()
    .notEmpty()
    .withMessage('Category name is required.')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(
      'Category name must be between 3 and 100 characters.'
    ),
];

async function buildCategories(req, res, next) {
  try {
    const categories =
      await categoriesModel.getAllCategories();

    res.render('categories', {
      title: 'Categories',
      categories,
    });
  } catch (error) {
    next(error);
  }
}

async function buildCategoryDetail(req, res, next) {
  try {
    const categoryId =
      Number.parseInt(req.params.categoryId, 10);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const category =
      await categoriesModel.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const projects =
      await categoriesModel.getProjectsByCategoryId(
        categoryId
      );

    return res.render('category', {
      title: category.category_name,
      category,
      projects,
    });
  } catch (error) {
    return next(error);
  }
}

function showNewCategoryForm(req, res) {
  res.render('new-category', {
    title: 'Add New Category',
    categoryName: '',
  });
}

async function processNewCategoryForm(req, res, next) {
  const results = validationResult(req);
  const categoryName = req.body.categoryName || '';

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.status(400).render('new-category', {
      title: 'Add New Category',
      categoryName,
    });
  }

  try {
    const categoryId =
      await categoriesModel.createCategory(categoryName);

    req.flash(
      'success',
      'Category created successfully!'
    );

    return res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    // PostgreSQL unique constraint violation.
    if (error.code === '23505') {
      req.flash(
        'error',
        'A category with that name already exists.'
      );

      return res.status(400).render('new-category', {
        title: 'Add New Category',
        categoryName,
      });
    }

    return next(error);
  }
}

async function showEditCategoryForm(req, res, next) {
  try {
    const categoryId =
      Number.parseInt(req.params.id, 10);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const category =
      await categoriesModel.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    return res.render('edit-category', {
      title: 'Edit Category',
      category,
    });
  } catch (error) {
    return next(error);
  }
}

async function processEditCategoryForm(req, res, next) {
  const categoryId =
    Number.parseInt(req.params.id, 10);

  const categoryName = req.body.categoryName || '';
  const results = validationResult(req);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return res.status(404).render('errors/404', {
      title: 'Page Not Found',
    });
  }

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.status(400).render('edit-category', {
      title: 'Edit Category',
      category: {
        category_id: categoryId,
        category_name: categoryName,
      },
    });
  }

  try {
    await categoriesModel.updateCategory(
      categoryId,
      categoryName
    );

    req.flash(
      'success',
      'Category updated successfully!'
    );

    return res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    if (error.code === '23505') {
      req.flash(
        'error',
        'A category with that name already exists.'
      );

      return res.status(400).render('edit-category', {
        title: 'Edit Category',
        category: {
          category_id: categoryId,
          category_name: categoryName,
        },
      });
    }

    return next(error);
  }
}

export default {
  categoryValidation,
  buildCategories,
  buildCategoryDetail,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
};