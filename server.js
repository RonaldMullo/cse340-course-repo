import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import { fileURLToPath } from 'url';
import path from 'path';

import router from './src/routes/index.js';
import flash from './src/middleware/flash.js';
import {
  notFound,
  serverError,
} from './src/middleware/errorHandler.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET is not defined. Check your .env file.'
  );
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Required when secure cookies are used behind Render's proxy.
app.set('trust proxy', 1);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session middleware
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    },
  })
);

// Flash messages must run after the session.
app.use(flash);

// Request body middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Application routes
app.use(router);

// Error middleware must remain last.
app.use(notFound);
app.use(serverError);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});