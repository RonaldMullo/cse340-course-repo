const requireLogin = (
  req,
  res,
  next
) => {
  if (!req.session || !req.session.user) {
    req.flash(
      'error',
      'You must be logged in to access that page.'
    );

    return res.redirect('/login');
  }

  next();
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash(
        'error',
        'You must be logged in to access that page.'
      );

      return res.redirect('/login');
    }

    if (
      !allowedRoles.includes(
        req.session.user.role_name
      )
    ) {
      req.flash(
        'error',
        'You do not have permission to access that page.'
      );

      return res.redirect('/dashboard');
    }

    next();
  };
};

export {
  requireLogin,
  requireRole,
};