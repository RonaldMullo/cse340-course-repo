import express from 'express';



import usersRoute from './usersRoute.js';
import staticRoute from './staticRoute.js';
import organizationsRoute from './organizationsRoute.js';
import projectsRoute from './projectsRoute.js';
import categoriesRoute from './categoriesRoute.js';
import {
  requireRole,
} from '../middleware/auth.js';
import organizationsController from
  '../controllers/organizationsController.js';

import categoriesController from
  '../controllers/categoriesController.js';
import projectsController from
  '../controllers/projectsController.js';

const router = express.Router();

// W04 category form routes
router.get(
  '/new-category',
  requireRole('admin'),
  categoriesController.showNewCategoryForm
);

router.post(
  '/new-category',
  requireRole('admin'),
  categoriesController.categoryValidation,
  categoriesController.processNewCategoryForm
);

router.get(
  '/edit-category/:id',
  requireRole('admin'),
  categoriesController.showEditCategoryForm
);

router.post(
  '/edit-category/:id',
  requireRole('admin'),
  categoriesController.categoryValidation,
  categoriesController.processEditCategoryForm
);

router.get(
  '/new-organization',
  requireRole('admin'),
  organizationsController.showNewOrganizationForm
);

router.post(
  '/new-organization',
  requireRole('admin'),
  organizationsController.organizationValidation,
  organizationsController.processNewOrganizationForm
);

router.get(
  '/edit-organization/:id',
  requireRole('admin'),
  organizationsController.showEditOrganizationForm
);

router.post(
  '/edit-organization/:id',
  requireRole('admin'),
  organizationsController.organizationValidation,
  organizationsController.processEditOrganizationForm
);

router.get(
  '/new-project',
  requireRole('admin'),
  projectsController.showNewProjectForm
);

router.post(
  '/new-project',
  requireRole('admin'),
  projectsController.projectValidation,
  projectsController.processNewProjectForm
);

router.get(
  '/edit-project/:id',
  requireRole('admin'),
  projectsController.showEditProjectForm
);

router.post(
  '/edit-project/:id',
  requireRole('admin'),
  projectsController.projectValidation,
  projectsController.processEditProjectForm
);
  router.get(
  '/assign-categories/:projectId',
  requireRole('admin'),
  categoriesController.showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  requireRole('admin'),
  categoriesController.processAssignCategoriesForm
);



// Resource routes
router.use('/organizations', organizationsRoute);
router.use('/projects', projectsRoute);
router.use('/categories', categoriesRoute);

// User routes
router.use('/', usersRoute);

// Home route
router.use('/', staticRoute);

export default router;