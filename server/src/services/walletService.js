const pool = require("../config/db");

async function getWalletByUserId(userId) {
  const result = await pool.query(
    "SELECT * FROM wallets WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
}

async function createWalletForUser(userId) {
  const result = await pool.query(
    "INSERT INTO wallets (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  return result.rows[0];
}

module.exports = {
  getWalletByUserId,
  createWalletForUser,
};
