const express = require("express");
const requireAuth = require("../middleware/auth");
const walletService = require("../services/walletService");

const router = express.Router();

/**
 * GET /wallet
 * Get current user's wallet
 */
router.get("/", requireAuth, async (req, res) => {
  let wallet = await walletService.getWalletByUserId(req.user.id);

  if (!wallet) {
    wallet = await walletService.createWalletForUser(req.user.id);
  }

  res.json(wallet);
});

module.exports = router;
