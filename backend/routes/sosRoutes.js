const express = require("express");

const router = express.Router();

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const {
  createSOS,
  getMySOSNotifications,
  deleteNotification,
} = require("../controllers/sosController");

router.post(
  "/",
  protect,
  createSOS
);
router.get(
  "/notifications",
  protect,
  getMySOSNotifications
);
router.delete(
  "/notifications/:id",
  protect,
  deleteNotification
);

module.exports = router;