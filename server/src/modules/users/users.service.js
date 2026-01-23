const pool = require('../../config/db');

/**
 * Create a new user
 * @param {Object} params
 * @param {string} params.email
 * @param {string} params.name
 * @param {string|null} params.passwordHash
 * @param {'local'|'google'} params.authProvider
 */
async function createUser({ email, name, passwordHash, authProvider }) {
  const query = `
    INSERT INTO users (email, name, password_hash, auth_provider)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, name, auth_provider, created_at
  `;

  const values = [email, name, passwordHash, authProvider];

  const result = await pool.query(query, values);
  return result.rows[0];
}

/**
 * Find user by email
 */
async function findUserByEmail(email) {
  const query = `
    SELECT id, email, name, password_hash, auth_provider
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findUserByEmail,
};
