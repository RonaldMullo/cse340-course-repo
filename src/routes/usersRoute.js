import express from 'express';

import {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  showUsers,
} from '../controllers/users.js';

import {
  requireLogin,
  requireRole,
} from '../middleware/auth.js';

const router = express.Router();

router.get(
  '/register',
  showUserRegistrationForm
);

router.post(
  '/register',
  processUserRegistrationForm
);

router.get(
  '/login',
  showLoginForm
);

router.post(
  '/login',
  processLoginForm
);

router.get(
  '/dashboard',
  requireLogin,
  showDashboard
);

router.get(
  '/users',
  requireLogin,
  requireRole('admin'),
  showUsers
);

router.get(
  '/logout',
  processLogout
);

export default router;