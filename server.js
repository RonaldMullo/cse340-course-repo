import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import organizationsModel from './src/models/organizations.js';
import projectsModel from './src/models/projects.js';
import categoriesModel from './src/models/categories.js';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
  try {
    const organizations = await organizationsModel.getAllOrganizations();
    res.render('organizations', { title: 'Organizations', organizations });
  } catch (err) {
    console.error('Error fetching organizations:', err);
    res.status(500).send('Server error');
  }
});

app.get('/projects', async (req, res) => {
  try {
    const projects = await projectsModel.getAllProjects();
    res.render('projects', { title: 'Projects', projects });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Server error');
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await categoriesModel.getAllCategories();
    res.render('categories', { title: 'Categories', categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});