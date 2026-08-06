import express from 'express';
import projectsController from '../controllers/projectsController.js';


const router = express.Router();

router.get('/', projectsController.buildProjects);
router.get('/:projectId', projectsController.buildProjectDetail);

export default router;