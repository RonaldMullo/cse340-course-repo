import bcrypt from 'bcrypt';

import {
  createUser,
  authenticateUser,
  getAllUsers,
} from '../models/users.js';


const showLoginForm = (req, res) => {
  res.render('login', {
    title: 'Log In',
  });
};

const processLoginForm = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email?.trim() || !password) {
      req.flash(
        'error',
        'Email and password are required.'
      );

      return res.redirect('/login');
    }

    const user = await authenticateUser(
      email,
      password
    );

    if (!user) {
      req.flash(
        'error',
        'Invalid email or password.'
      );

      return res.redirect('/login');
    }

    req.session.user = user;

    req.flash(
      'success',
      `Welcome, ${user.name}!`
    );

    return res.redirect('/dashboard');
  } catch (error) {
    console.error(
      'Error during login:',
      error
    );

    req.flash(
      'error',
      'An error occurred during login. Please try again.'
    );

    return res.redirect('/login');
  }
};

const processLogout = (req, res) => {
  if (req.session.user) {
    delete req.session.user;
  }

  req.flash(
    'success',
    'Logout successful!'
  );

  return res.redirect('/login');
};

const showUserRegistrationForm = (req, res) => {
  res.render('register', {
    title: 'Register',
  });
};

const processUserRegistrationForm = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name?.trim() || !email?.trim() || !password) {
      req.flash(
        'error',
        'All fields are required.'
      );

      return res.redirect('/register');
    }

    if (password.length < 7) {
      req.flash(
        'error',
        'Password must be at least 7 characters long.'
      );

      return res.redirect('/register');
    }

    const passwordHash = await bcrypt.hash(
      password,
      10
    );

    await createUser(
      name,
      email,
      passwordHash
    );

    req.flash(
      'success',
      'Registration successful. Please log in.'
    );

    return res.redirect('/login');
  } catch (error) {
    console.error(
      'Error registering user:',
      error
    );

    if (error.code === '23505') {
      req.flash(
        'error',
        'An account with that email already exists.'
      );
    } else {
      req.flash(
        'error',
        'An error occurred while creating the account.'
      );
    }

    return res.redirect('/register');
  }
};

const showDashboard = (req, res) => {
  const user = req.session.user;

  res.render('dashboard', {
    title: 'Dashboard',
    name: user.name,
    email: user.email,
    role: user.role_name,
  });
};
const showUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    return res.render('users', {
      title: 'Users',
      users,
    });
  } catch (error) {
    console.error(
      'Error retrieving users:',
      error
    );

    req.flash(
      'error',
      'Unable to retrieve users.'
    );

    return res.redirect('/dashboard');
  }
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  showLoginForm,
  processLoginForm,
  processLogout,
  showDashboard,
  showUsers,
};