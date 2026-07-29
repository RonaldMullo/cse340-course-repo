import {
  body,
  validationResult,
} from 'express-validator';

import projectsModel from '../models/projects.js';
import categoriesModel from '../models/categories.js';
import organizationsModel from '../models/organizations.js';

const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required.')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(
      'Project title must be between 3 and 100 characters.'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.')
    .bail()
    .isLength({ max: 1000 })
    .withMessage(
      'Description cannot exceed 1000 characters.'
    ),

  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required.')
    .bail()
    .isLength({ max: 150 })
    .withMessage(
      'Location cannot exceed 150 characters.'
    ),

  body('date')
    .notEmpty()
    .withMessage('Date is required.')
    .bail()
    .isISO8601()
    .withMessage('Please enter a valid date.'),

  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required.')
    .bail()
    .isInt({ min: 1 })
    .withMessage(
      'Please select a valid organization.'
    ),
];

function formatDateForInput(date) {
  if (!date) {
    return '';
  }

  return new Date(date).toISOString().slice(0, 10);
}

async function buildProjects(req, res, next) {
  try {
    const projects =
      await projectsModel.getAllProjects();

    return res.render('projects', {
      title: 'Projects',
      projects,
    });
  } catch (error) {
    return next(error);
  }
}

async function buildProjectDetail(req, res, next) {
  try {
    const projectId = Number.parseInt(
      req.params.projectId,
      10
    );

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const project =
      await projectsModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const categories =
      await categoriesModel.getCategoriesByProjectId(
        projectId
      );

    return res.render('project', {
      title: project.project_name,
      project,
      categories,
    });
  } catch (error) {
    return next(error);
  }
}

async function showNewProjectForm(req, res, next) {
  try {
    const organizations =
      await organizationsModel.getAllOrganizations();

    return res.render('new-project', {
      title: 'Add New Service Project',
      organizations,
      formData: {
        title: '',
        description: '',
        location: '',
        date: '',
        organizationId: '',
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function processNewProjectForm(
  req,
  res,
  next
) {
  const results = validationResult(req);

  const formData = {
    title: req.body.title || '',
    description: req.body.description || '',
    location: req.body.location || '',
    date: req.body.date || '',
    organizationId: req.body.organizationId || '',
  };

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    try {
      const organizations =
        await organizationsModel.getAllOrganizations();

      return res.status(400).render('new-project', {
        title: 'Add New Service Project',
        organizations,
        formData,
      });
    } catch (error) {
      return next(error);
    }
  }

  try {
    const projectId =
      await projectsModel.createProject(
        formData.title,
        formData.description,
        formData.location,
        formData.date,
        Number.parseInt(formData.organizationId, 10)
      );

    req.flash(
      'success',
      'Service project created successfully!'
    );

    return res.redirect(`/projects/${projectId}`);
  } catch (error) {
    return next(error);
  }
}

async function showEditProjectForm(
  req,
  res,
  next
) {
  try {
    const projectId = Number.parseInt(
      req.params.id,
      10
    );

    if (
      !Number.isInteger(projectId) ||
      projectId <= 0
    ) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const project =
      await projectsModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const organizations =
      await organizationsModel.getAllOrganizations();

    return res.render('edit-project', {
      title: 'Edit Service Project',
      projectId,
      organizations,
      formData: {
        title: project.project_name,
        description: project.project_description,
        location: project.project_location,
        date: formatDateForInput(
          project.project_date
        ),
        organizationId: project.organization_id,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function processEditProjectForm(
  req,
  res,
  next
) {
  const projectId = Number.parseInt(
    req.params.id,
    10
  );

  if (
    !Number.isInteger(projectId) ||
    projectId <= 0
  ) {
    return res.status(404).render('errors/404', {
      title: 'Page Not Found',
    });
  }

  const results = validationResult(req);

  const formData = {
    title: req.body.title || '',
    description: req.body.description || '',
    location: req.body.location || '',
    date: req.body.date || '',
    organizationId: req.body.organizationId || '',
  };

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    try {
      const organizations =
        await organizationsModel.getAllOrganizations();

      return res.status(400).render('edit-project', {
        title: 'Edit Service Project',
        projectId,
        organizations,
        formData,
      });
    } catch (error) {
      return next(error);
    }
  }

  try {
    await projectsModel.updateProject(
      projectId,
      formData.title,
      formData.description,
      formData.location,
      formData.date,
      Number.parseInt(formData.organizationId, 10)
    );

    req.flash(
      'success',
      'Service project updated successfully!'
    );

    return res.redirect(`/projects/${projectId}`);
  } catch (error) {
    return next(error);
  }
}

export default {
  projectValidation,
  buildProjects,
  buildProjectDetail,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
};