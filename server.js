import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

import staticRoute from './src/routes/staticRoute.js';
import organizationsRoute from './src/routes/organizationsRoute.js';
import projectsRoute from './src/routes/projectsRoute.js';
import categoriesRoute from './src/routes/categoriesRoute.js';
import { notFound, serverError } from './src/middleware/errorHandler.js';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', staticRoute);
app.use('/organizations', organizationsRoute);
app.use('/projects', projectsRoute);
app.use('/categories', categoriesRoute);

// 404 - invalid routes
app.use(notFound);

// 500 - error controls
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});