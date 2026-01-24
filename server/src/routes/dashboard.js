const express = require("express");
const requireAuth = require("../middleware/auth");
const pool = require("../config/db");

const router = express.Router();

/**
 * GET /dashboard
 * Returns wallet + recent transactions
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const walletResult = await pool.query(
      "SELECT balance, currency FROM wallets WHERE user_id = $1",
      [req.user.id]
    );

    const transactionsResult = await pool.query(
      `
      SELECT type, amount, description, category, created_at
      FROM transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.id]
    );

    res.json({
      wallet: walletResult.rows[0],
      recentTransactions: transactionsResult.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to load dashboard",
    });
  }
});

module.exports = router;
