DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(100) NOT NULL,
  organization_description TEXT NOT NULL,
  organization_email VARCHAR(100) NOT NULL,
  organization_image VARCHAR(255) NOT NULL
);

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

CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE project_categories (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

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

INSERT INTO categories (category_name) VALUES
('Environmental'),
('Education'),
('Community Support'),
('Health & Wellness');

INSERT INTO project_categories (project_id, category_id) VALUES
(1, 1),
(2, 3),
(3, 2),
(4, 4),
(5, 3),
(6, 1);