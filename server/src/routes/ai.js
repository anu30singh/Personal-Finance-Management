const express = require("express");
const requireAuth = require("../middleware/auth");
const pool = require("../config/db");

const router = express.Router();

router.get("/insights", requireAuth, async (req, res) => {
  const userId = req.user.id;

  // 1️⃣ Income vs Expense
  const summaryResult = await pool.query(
    `
    SELECT
      SUM(CASE WHEN type='income' THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) AS expense
    FROM transactions
    WHERE user_id = $1
    `,
    [userId]
  );

  const income = Number(summaryResult.rows[0].income || 0);
  const expense = Number(summaryResult.rows[0].expense || 0);

  // 2️⃣ Category-wise expenses
  const categoryResult = await pool.query(
    `
    SELECT category, SUM(amount) AS total
    FROM transactions
    WHERE user_id = $1 AND type='expense'
    GROUP BY category
    ORDER BY total DESC
    `,
    [userId]
  );

  const insights = [];

  if (income === 0 && expense === 0) {
    return res.json({
      insights: ["Start adding transactions to see AI insights."],
    });
  }

  // Insight 1: Income vs Expense
  if (expense > income) {
    insights.push("Your expenses are higher than your income this month.");
  } else {
    insights.push("You are spending within your income this month.");
  }

  // Insight 2: Top spending category
  if (categoryResult.rows.length > 0) {
    const top = categoryResult.rows[0];
    const percent = ((top.total / expense) * 100).toFixed(1);

    insights.push(
      `${percent}% of your expenses are on ${top.category}.`
    );
  }

  // Insight 3: Savings behavior
  const savings = income - expense;
  if (savings > 0) {
    insights.push("You are saving money consistently. Good job!");
  }

  res.json({ insights });
});

module.exports = router;
