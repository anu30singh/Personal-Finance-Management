const pool = require("../config/db");

async function createGoal(userId, name, targetAmount) {
  const result = await pool.query(
    `
    INSERT INTO savings_goals (user_id, name, target_amount)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [userId, name, targetAmount]
  );

  return result.rows[0];
}

/**
 * Allocate money from wallet to goal (ATOMIC)
 */
async function allocateToGoal(userId, goalId, amount) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    
    const walletResult = await client.query(
      `
      SELECT id, balance
      FROM wallets
      WHERE user_id = $1
      FOR UPDATE
      `,
      [userId]
    );

    if (walletResult.rowCount === 0) {
      throw new Error("Wallet not found");
    }

    const wallet = walletResult.rows[0];

    if (Number(wallet.balance) < amount) {
      throw new Error("Insufficient wallet balance");
    }

    //  Lock goal
    const goalResult = await client.query(
      `
      SELECT id, saved_amount, target_amount
      FROM savings_goals
      WHERE id = $1 AND user_id = $2
      FOR UPDATE
      `,
      [goalId, userId]
    );

    if (goalResult.rowCount === 0) {
      throw new Error("Goal not found");
    }

    const goal = goalResult.rows[0];
    const newSavedAmount = Number(goal.saved_amount) + amount;

    if (newSavedAmount > Number(goal.target_amount)) {
      throw new Error("Allocation exceeds goal target");
    }

    
    await client.query(
      `
      UPDATE wallets
      SET balance = balance - $1, updated_at = NOW()
      WHERE id = $2
      `,
      [amount, wallet.id]
    );


    await client.query(
      `
      UPDATE savings_goals
      SET saved_amount = $1, updated_at = NOW()
      WHERE id = $2
      `,
      [newSavedAmount, goal.id]
    );

    await client.query("COMMIT");

    return {
      goalId: goal.id,
      savedAmount: newSavedAmount,
      remaining: Number(goal.target_amount) - newSavedAmount,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function getGoalsByUser(userId) {
  const result = await pool.query(
    `
    SELECT *,
    ROUND((saved_amount / target_amount) * 100, 2) AS progress_percent
    FROM savings_goals
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

module.exports = {
  createGoal,
  allocateToGoal,
  getGoalsByUser,
};
