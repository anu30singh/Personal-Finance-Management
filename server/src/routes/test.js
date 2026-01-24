const express = require("express");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/protected", requireAuth, (req, res) => {
  res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

module.exports = router;
