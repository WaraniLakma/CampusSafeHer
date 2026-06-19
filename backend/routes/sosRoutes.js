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
  resolveSOS,
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
router.patch(
  "/:id/resolve",
  protect,
  resolveSOS
);
module.exports = router;