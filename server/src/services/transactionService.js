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

async function updateTransaction({
  transactionId,
  userId,
  type,
  amount,
  description,
  category,
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    
    const txResult = await client.query(
      `
      SELECT * FROM transactions
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [transactionId, userId]
    );

    if (txResult.rowCount === 0) {
      throw new Error("Transaction not found");
    }

    const oldTx = txResult.rows[0];

    
    const walletResult = await client.query(
      `
      SELECT * FROM wallets
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [oldTx.wallet_id, userId]
    );

    if (walletResult.rowCount === 0) {
      throw new Error("Wallet not found");
    }

    let balance = Number(walletResult.rows[0].balance);

    
    if (oldTx.type === "income") {
      balance -= Number(oldTx.amount);
    } else {
      balance += Number(oldTx.amount);
    }

    
    if (type === "income") {
      balance += amount;
    } else {
      if (balance < amount) {
        throw new Error("Insufficient balance");
      }
      balance -= amount;
    }

  
    const updatedTx = await client.query(
      `
      UPDATE transactions
      SET type = $1,
          amount = $2,
          description = $3,
          category = $4
      WHERE id = $5 AND user_id = $6
      RETURNING *
      `,
      [type, amount, description, category, transactionId, userId]
    );

    
    await client.query(
      `
      UPDATE wallets
      SET balance = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [balance, oldTx.wallet_id]
    );

    await client.query("COMMIT");

    return {
      transaction: updatedTx.rows[0],
      balance,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function deleteTransaction({ transactionId, userId }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

  
    const txResult = await client.query(
      `
      SELECT * FROM transactions
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [transactionId, userId]
    );

    if (txResult.rowCount === 0) {
      throw new Error("Transaction not found");
    }

    const tx = txResult.rows[0];

    
    const walletResult = await client.query(
      `
      SELECT * FROM wallets
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [tx.wallet_id, userId]
    );

    let balance = Number(walletResult.rows[0].balance);

    
    if (tx.type === "income") {
      balance -= Number(tx.amount);
    } else {
      balance += Number(tx.amount);
    }

    // 4️⃣ Delete transaction
    await client.query(
      `
      DELETE FROM transactions
      WHERE id = $1 AND user_id = $2
      `,
      [transactionId, userId]
    );

    // 5️⃣ Update wallet
    await client.query(
      `
      UPDATE wallets
      SET balance = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [balance, tx.wallet_id]
    );

    await client.query("COMMIT");

    return { balance };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}



module.exports = {
  createTransaction,
  getTransactionsByUser,
  updateTransaction,
  deleteTransaction,
};
