import projectsModel from '../models/projects.js';
import categoriesModel from '../models/categories.js';

/**
 * Display the list of all projects.
 */
async function buildProjects(req, res, next) {
  try {
    const projects = await projectsModel.getAllProjects();

    res.render('projects', {
      title: 'Projects',
      projects,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Display the details for one project.
 */
async function buildProjectDetail(req, res, next) {
  try {
    const projectId = Number.parseInt(req.params.projectId, 10);

    // Validate the route parameter.
    if (!Number.isInteger(projectId) || projectId <= 0) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const project = await projectsModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const categories =
      await categoriesModel.getCategoriesByProjectId(projectId);

    return res.render('project', {
      title: project.project_name,
      project,
      categories,
    });
  } catch (error) {
    return next(error);
  }
}

export default {
  buildProjects,
  buildProjectDetail,
};