DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
  role_id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) UNIQUE NOT NULL,
  role_description TEXT
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role_id INTEGER NOT NULL REFERENCES roles(role_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 1. Crear organizaciones
CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(100) NOT NULL,
  organization_description TEXT NOT NULL,
  organization_email VARCHAR(100) NOT NULL,
  organization_image VARCHAR(255) NOT NULL
);

-- 2. Crear proyectos
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(100) NOT NULL,
  project_description TEXT,
  project_location VARCHAR(150) NOT NULL,
  project_date DATE NOT NULL,
  organization_id INT NOT NULL,
  FOREIGN KEY (organization_id)
    REFERENCES organizations(organization_id)
    ON DELETE CASCADE
);

-- 3. Crear categorías
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Crear tabla de relación
CREATE TABLE project_categories (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,
  FOREIGN KEY (category_id)
    REFERENCES categories(category_id)
    ON DELETE CASCADE
);

INSERT INTO roles (
  role_name,
  role_description
) VALUES
(
  'user',
  'Standard user with basic access'
),
(
  'admin',
  'Administrator with full system access'
);

-- 5. Insertar organizaciones
INSERT INTO organizations (
  organization_name,
  organization_description,
  organization_email,
  organization_image
) VALUES
(
  'BrightFuture Builders',
  'Supports community development and assistance projects.',
  'info@brightfuture.org',
  '/images/brightfuture.png'
),
(
  'GreenHarvest Growers',
  'Promotes environmental care and sustainable community activities.',
  'contact@greenharvest.org',
  '/images/greenharvest.png'
),
(
  'UnityServe Volunteers',
  'Connects volunteers with education, health, and service opportunities.',
  'hello@unityserve.org',
  '/images/unityserve.png'
);

-- 6. Insertar proyectos
INSERT INTO projects (
  project_name,
  project_description,
  project_location,
  project_date,
  organization_id
) VALUES
(
  'Community Center Renovation',
  'Renovation of a community center for local families.',
  'Quito, Ecuador',
  '2026-08-15',
  1
),
(
  'Neighborhood Food Drive',
  'Collection and distribution of food for families in need.',
  'Loja, Ecuador',
  '2026-08-20',
  1
),
(
  'Community Garden',
  'Creation of a sustainable garden for the community.',
  'Cuenca, Ecuador',
  '2026-09-05',
  2
),
(
  'Environmental Workshop',
  'Workshop about recycling and environmental protection.',
  'Ambato, Ecuador',
  '2026-09-12',
  2
),
(
  'School Supply Campaign',
  'Collection of school supplies for local students.',
  'Riobamba, Ecuador',
  '2026-09-20',
  3
),
(
  'Health Awareness Day',
  'Community event promoting healthy habits and wellness.',
  'Ibarra, Ecuador',
  '2026-09-28',
  3
);

-- 7. Insertar categorías
INSERT INTO categories (category_name) VALUES
('Environmental'),
('Education'),
('Community Support'),
('Health & Wellness');

-- 8. Relacionar proyectos y categorías
INSERT INTO project_categories (
  project_id,
  category_id
) VALUES
(1, 1),
(2, 3),
(3, 2),
(4, 4),
(5, 3),
(6, 1);