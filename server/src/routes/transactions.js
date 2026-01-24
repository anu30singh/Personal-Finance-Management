const express = require("express");
const requireAuth = require("../middleware/auth");
const transactionService = require("../services/transactionService");
const walletService = require("../services/walletService");

const router = express.Router();


router.post("/", requireAuth, async (req, res) => {
  const { type, amount, description, category } = req.body;

  if (!type || !amount) {
    return res.status(400).json({
      message: "Type and amount are required",
    });
  }

  try {
    let wallet = await walletService.getWalletByUserId(req.user.id);

        if (!wallet) {
             wallet = await walletService.createWalletForUser(req.user.id);
        }


    const result = await transactionService.createTransaction({
      userId: req.user.id,
      walletId: wallet.id,
      type,
      amount: Number(amount),
      description,
      category,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

/**
 * GET /transactions
 */
router.get("/", requireAuth, async (req, res) => {
  const transactions = await transactionService.getTransactionsByUser(
    req.user.id
  );
  res.json(transactions);
});

module.exports = router;
