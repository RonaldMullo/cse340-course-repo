import bcrypt from 'bcrypt';

import db from '../database/connection.js';

const createUser = async (
  name,
  email,
  passwordHash
) => {
  const query = `
    INSERT INTO users (
      name,
      email,
      password_hash,
      role_id
    )
    VALUES (
      $1,
      LOWER($2),
      $3,
      (
        SELECT role_id
        FROM roles
        WHERE role_name = 'user'
      )
    )
    RETURNING user_id
  `;

  const result = await db.query(
    query,
    [
      name.trim(),
      email.trim(),
      passwordHash,
    ]
  );

  return result.rows[0].user_id;
};

const findUserByEmail = async (email) => {
  const query = `
    SELECT
      users.user_id,
      users.name,
      users.email,
      users.password_hash,
      users.role_id,
      roles.role_name
    FROM users
    JOIN roles
      ON users.role_id = roles.role_id
    WHERE LOWER(users.email) = LOWER($1)
  `;

  const result = await db.query(
    query,
    [email.trim()]
  );

  return result.rows[0] || null;
};

const verifyPassword = async (
  password,
  passwordHash
) => {
  return bcrypt.compare(
    password,
    passwordHash
  );
};

const authenticateUser = async (
  email,
  password
) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const passwordMatches =
    await verifyPassword(
      password,
      user.password_hash
    );

  if (!passwordMatches) {
    return null;
  }

  delete user.password_hash;

  return user;
};
const getAllUsers = async () => {
  const query = `
    SELECT
      users.user_id,
      users.name,
      users.email,
      roles.role_name,
      users.created_at
    FROM users
    JOIN roles
      ON users.role_id = roles.role_id
    ORDER BY users.name
  `;

  const result = await db.query(query);

  return result.rows;
};
export {
  createUser,
  authenticateUser,
  getAllUsers,
};