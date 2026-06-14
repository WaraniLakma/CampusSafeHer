const express = require("express");
const router = express.Router();

const {
  createSOSAlert,
  getMySOSAlerts,
} = require("../controllers/sosController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSOSAlert);
router.get("/", protect, getMySOSAlerts);

module.exports = router;