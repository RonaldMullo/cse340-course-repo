import express from 'express';

import staticRoute from './staticRoute.js';
import organizationsRoute from './organizationsRoute.js';
import projectsRoute from './projectsRoute.js';
import categoriesRoute from './categoriesRoute.js';
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
// W04 organization form routes
router.get(
  '/new-organization',
  organizationsController.showNewOrganizationForm
);

router.post(
  '/new-organization',
  organizationsController.organizationValidation,
  organizationsController.processNewOrganizationForm
);

router.get(
  '/edit-organization/:id',
  organizationsController.showEditOrganizationForm
);

router.post(
  '/edit-organization/:id',
  organizationsController.organizationValidation,
  organizationsController.processEditOrganizationForm
);
// W04 project form routes
router.get(
  '/new-project',
  projectsController.showNewProjectForm
);

router.post(
  '/new-project',
  projectsController.projectValidation,
  projectsController.processNewProjectForm
);

router.get(
  '/edit-project/:id',
  projectsController.showEditProjectForm
);

router.post(
  '/edit-project/:id',
  projectsController.projectValidation,
  projectsController.processEditProjectForm
);
// Assign and update project categories
router.get(
  '/assign-categories/:projectId',
  categoriesController.showAssignCategoriesForm
);

router.post(
  '/assign-categories/:projectId',
  categoriesController.processAssignCategoriesForm
);

// Resource routes
router.use('/organizations', organizationsRoute);
router.use('/projects', projectsRoute);
router.use('/categories', categoriesRoute);

// Home route
router.use('/', staticRoute);

export default router;  