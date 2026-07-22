import express from 'express';
import staticRoute from './staticRoute.js';
import organizationsRoute from './organizationsRoute.js';
import projectsRoute from './projectsRoute.js';
import categoriesRoute from './categoriesRoute.js';

const router = express.Router();

router.use('/organizations', organizationsRoute);
router.use('/projects', projectsRoute);
router.use('/categories', categoriesRoute);
router.use('/', staticRoute);

export default router;