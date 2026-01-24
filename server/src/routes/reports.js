const express = require("express");
const requireAuth = require("../middleware/auth");
const pool = require("../config/db");

const router = express.Router();

const PDFDocument = require("pdfkit");

router.get("/pdf", requireAuth, async (req, res) => {
  const userId = req.user.id;

  // Fetch data
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

  const income = Number(summaryResult.rows[0].income || 0);
  const expense = Number(summaryResult.rows[0].expense || 0);
  const savings = income - expense;

  // Create PDF
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=flexiwallet-report.pdf"
  );

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("Flexiwallet Financial Report", { align: "center" });
  doc.moveDown();

  // Summary
  doc.fontSize(14).text("Summary");
  doc.moveDown(0.5);

  doc.fontSize(12).text(`Total Income: ₹${income}`);
  doc.text(`Total Expense: ₹${expense}`);
  doc.text(`Net Savings: ₹${savings}`);
  doc.moveDown();

  // Category breakdown
  doc.fontSize(14).text("Expenses by Category");
  doc.moveDown(0.5);

  if (categoryResult.rows.length === 0) {
    doc.fontSize(12).text("No expense data available.");
  } else {
    categoryResult.rows.forEach((row) => {
      doc.fontSize(12).text(`${row.category}: ₹${row.total}`);
    });
  }

  doc.end();
});


router.get("/", requireAuth, async (req, res) => {
  const userId = req.user.id;

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

  res.json({
    summary: summaryResult.rows[0],
    byCategory: categoryResult.rows,
  });
});

module.exports = router;
