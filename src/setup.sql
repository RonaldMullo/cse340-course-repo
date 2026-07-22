DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(100) NOT NULL,
  organization_email VARCHAR(100),
  organization_image VARCHAR(255)
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

INSERT INTO organizations (organization_name, organization_email, organization_image) VALUES
('BrightFuture Builders', 'info@brightfuture.org', '/images/brightfuture.png'),
('GreenHarvest Growers', 'contact@greenharvest.org', '/images/greenharvest.png'),
('UnityServe Volunteers', 'hello@unityserve.org', '/images/unityserve.png');

INSERT INTO projects (
  project_name,
  project_description,
  project_location,
  project_date,
  organization_id
) VALUES
(
  'Park Cleanup',
  'Join us to clean up local parks and make them beautiful!',
  'Central City Park',
  '2026-08-15',
  2
),
(
  'Food Drive',
  'Help collect and distribute food to those in need.',
  'Community Center',
  '2026-08-01',
  1
),
(
  'Community Tutoring',
  'Volunteer to tutor students in various subjects.',
  'Downtown Library',
  '2026-09-10',
  3
),
(
  'Health Fair',
  'Free health screenings and wellness resources for the community.',
  'Civic Hall',
  '2026-07-25',
  3
),
(
  'Senior Meal Delivery',
  'Deliver warm meals to elderly residents in the area.',
  'Northside Neighborhood',
  '2026-10-01',
  1
),
(
  'Beach Cleanup',
  'Help clean the beach and protect the local environment.',
  'Riverside Beach',
  '2025-05-01',
  2
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