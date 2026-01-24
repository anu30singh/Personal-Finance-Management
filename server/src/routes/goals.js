const express = require("express");
const requireAuth = require("../middleware/auth");
const goalService = require("../services/goalService");

const router = express.Router();

/**
 * POST /goals
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, targetAmount } = req.body;

  if (!name || !targetAmount) {
    return res.status(400).json({
      message: "Name and target amount are required",
    });
  }

  try {
    const goal = await goalService.createGoal(
      req.user.id,
      name,
      Number(targetAmount)
    );

    res.status(201).json(goal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * POST /goals/:id/allocate
 */
router.post("/:id/allocate", requireAuth, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Valid amount required",
    });
  }

  try {
    const result = await goalService.allocateToGoal(
      req.user.id,
      req.params.id,
      Number(amount)
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * GET /goals
 */
router.get("/", requireAuth, async (req, res) => {
  const goals = await goalService.getGoalsByUser(req.user.id);
  res.json(goals);
});

module.exports = router;
