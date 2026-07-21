import organizationsModel from '../models/organizations.js';
import projectsModel from '../models/projects.js';

async function buildOrganizations(req, res, next) {
  try {
    const organizations = await organizationsModel.getAllOrganizations();
    res.render('organizations', { title: 'Organizations', organizations });
  } catch (err) {
    next(err);
  }
}

async function buildOrganizationDetail(req, res, next) {
  try {
    const organizationId = req.params.organizationId;
    const organization = await organizationsModel.getOrganizationById(organizationId);

    if (!organization) {
      return res.status(404).render('errors/404', { title: 'Page Not Found' });
    }

    const projects = await projectsModel.getProjectsByOrganizationId(organizationId);
    res.render('organization', { title: organization.organization_name, organization, projects });
  } catch (err) {
    next(err);
  }
}

export default { buildOrganizations, buildOrganizationDetail };