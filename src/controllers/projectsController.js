import projectsModel from '../models/projects.js';
import categoriesModel from '../models/categories.js';

async function buildProjects(req, res, next) {
  try {
    const projects = await projectsModel.getUpcomingProjects(5);
    res.render('projects', { title: 'Projects', projects });
  } catch (err) {
    next(err);
  }
}

async function buildProjectDetail(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const project = await projectsModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    const categories = await categoriesModel.getCategoriesByProjectId(projectId);
    res.render('project', { title: project.project_name, project, categories });
  } catch (err) {
    next(err);
  }
}

export default { buildProjects, buildProjectDetail };