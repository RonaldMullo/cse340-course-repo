import categoriesModel from '../models/categories.js';

async function buildCategories(req, res, next) {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render('categories', { title: 'Categories', categories });
  } catch (err) {
    next(err);
  }
}

async function buildCategoryDetail(req, res, next) {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoriesModel.getCategoryById(categoryId);

    if (!category) {
      return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    const projects = await categoriesModel.getProjectsByCategoryId(categoryId);
    res.render('category', { title: category.category_name, category, projects });
  } catch (err) {
    next(err);
  }
}

export default { buildCategories, buildCategoryDetail };