const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusSafeHer API Working"
  });
});

module.exports = router;