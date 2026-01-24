const pool = require("../config/db");

/**
 * Create transaction + update wallet balance atomically
 */
async function createTransaction({
  userId,
  walletId,
  type,
  amount,
  description,
  category,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    
    const walletResult = await client.query(
      "SELECT balance FROM wallets WHERE id = $1 AND user_id = $2 FOR UPDATE",
      [walletId, userId]
    );

    if (walletResult.rowCount === 0) {
      throw new Error("Wallet not found");
    }

    const currentBalance = Number(walletResult.rows[0].balance);

    
    let newBalance;
    if (type === "income") {
      newBalance = currentBalance + amount;
    } else {
      if (currentBalance < amount) {
        throw new Error("Insufficient balance");
      }
      newBalance = currentBalance - amount;
    }

    
    const transactionResult = await client.query(
      `
      INSERT INTO transactions
      (user_id, wallet_id, type, amount, description, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [userId, walletId, type, amount, description, category]
    );

    
    await client.query(
      "UPDATE wallets SET balance = $1, updated_at = NOW() WHERE id = $2",
      [newBalance, walletId]
    );

    await client.query("COMMIT");

    return {
      transaction: transactionResult.rows[0],
      balance: newBalance,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function getTransactionsByUser(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

module.exports = {
  createTransaction,
  getTransactionsByUser,
};
