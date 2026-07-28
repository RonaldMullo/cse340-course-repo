import express from 'express';

import staticRoute from './staticRoute.js';
import organizationsRoute from './organizationsRoute.js';
import projectsRoute from './projectsRoute.js';
import categoriesRoute from './categoriesRoute.js';

import categoriesController from
  '../controllers/categoriesController.js';

const router = express.Router();

// W04 category form routes
router.get(
  '/new-category',
  categoriesController.showNewCategoryForm
);

router.post(
  '/new-category',
  categoriesController.categoryValidation,
  categoriesController.processNewCategoryForm
);

router.get(
  '/edit-category/:id',
  categoriesController.showEditCategoryForm
);

router.post(
  '/edit-category/:id',
  categoriesController.categoryValidation,
  categoriesController.processEditCategoryForm
);

// Resource routes
router.use('/organizations', organizationsRoute);
router.use('/projects', projectsRoute);
router.use('/categories', categoriesRoute);

// Home route
router.use('/', staticRoute);

export default router;  