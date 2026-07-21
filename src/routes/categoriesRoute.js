import express from 'express';
import categoriesController from '../controllers/categoriesController.js';

const router = express.Router();

router.get('/', categoriesController.buildCategories);
router.get('/:categoryId', categoriesController.buildCategoryDetail);

export default router;