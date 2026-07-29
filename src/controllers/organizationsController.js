import {
  body,
  validationResult,
} from 'express-validator';

import organizationsModel from '../models/organizations.js';
import projectsModel from '../models/projects.js';

const organizationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required.')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage(
      'Organization name must be between 3 and 100 characters.'
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.')
    .bail()
    .isLength({ max: 500 })
    .withMessage(
      'Description cannot exceed 500 characters.'
    ),

  body('contactEmail')
    .trim()
    .notEmpty()
    .withMessage('Contact email is required.')
    .bail()
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),
];

async function buildOrganizations(req, res, next) {
  try {
    const organizations =
      await organizationsModel.getAllOrganizations();

    return res.render('organizations', {
      title: 'Organizations',
      organizations,
    });
  } catch (error) {
    return next(error);
  }
}

async function buildOrganizationDetail(req, res, next) {
  try {
    const organizationId = Number.parseInt(
      req.params.organizationId,
      10
    );

    if (
      !Number.isInteger(organizationId) ||
      organizationId <= 0
    ) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const organization =
      await organizationsModel.getOrganizationById(
        organizationId
      );

    if (!organization) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const projects =
      await projectsModel.getProjectsByOrganizationId(
        organizationId
      );

    return res.render('organization', {
      title: organization.organization_name,
      organization,
      projects,
    });
  } catch (error) {
    return next(error);
  }
}

function showNewOrganizationForm(req, res) {
  return res.render('new-organization', {
    title: 'Add New Organization',
    formData: {
      name: '',
      description: '',
      contactEmail: '',
    },
  });
}

async function processNewOrganizationForm(
  req,
  res,
  next
) {
  const results = validationResult(req);

  const formData = {
    name: req.body.name || '',
    description: req.body.description || '',
    contactEmail: req.body.contactEmail || '',
  };

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.status(400).render('new-organization', {
      title: 'Add New Organization',
      formData,
    });
  }

  try {
    const placeholderImage =
      '/images/placeholder-logo.png';

    const organizationId =
      await organizationsModel.createOrganization(
        formData.name,
        formData.description,
        formData.contactEmail,
        placeholderImage
      );

    req.flash(
      'success',
      'Organization created successfully!'
    );

    return res.redirect(
      `/organizations/${organizationId}`
    );
  } catch (error) {
    return next(error);
  }
}

async function showEditOrganizationForm(
  req,
  res,
  next
) {
  try {
    const organizationId = Number.parseInt(
      req.params.id,
      10
    );

    if (
      !Number.isInteger(organizationId) ||
      organizationId <= 0
    ) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    const organization =
      await organizationsModel.getOrganizationById(
        organizationId
      );

    if (!organization) {
      return res.status(404).render('errors/404', {
        title: 'Page Not Found',
      });
    }

    return res.render('edit-organization', {
      title: 'Edit Organization',
      organization,
    });
  } catch (error) {
    return next(error);
  }
}

async function processEditOrganizationForm(
  req,
  res,
  next
) {
  const organizationId = Number.parseInt(
    req.params.id,
    10
  );

  const results = validationResult(req);

  const organization = {
    organization_id: organizationId,
    organization_name: req.body.name || '',
    organization_description:
      req.body.description || '',
    organization_email:
      req.body.contactEmail || '',
  };

  if (
    !Number.isInteger(organizationId) ||
    organizationId <= 0
  ) {
    return res.status(404).render('errors/404', {
      title: 'Page Not Found',
    });
  }

  if (!results.isEmpty()) {
    results.array().forEach((error) => {
      req.flash('error', error.msg);
    });

    return res.status(400).render(
      'edit-organization',
      {
        title: 'Edit Organization',
        organization,
      }
    );
  }

  try {
    await organizationsModel.updateOrganization(
      organizationId,
      organization.organization_name,
      organization.organization_description,
      organization.organization_email
    );

    req.flash(
      'success',
      'Organization updated successfully!'
    );

    return res.redirect(
      `/organizations/${organizationId}`
    );
  } catch (error) {
    return next(error);
  }
}

export default {
  organizationValidation,
  buildOrganizations,
  buildOrganizationDetail,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
};