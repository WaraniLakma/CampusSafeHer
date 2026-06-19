const express = require("express");
const router = express.Router();

const {
  createCheckIn,
  completeCheckIn,
  getMyCheckIns,
  deleteCheckIn,
  updateLocation,
  getMyCheckInNotifications,
  deleteCheckInNotification,
} = require("../controllers/checkInController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createCheckIn);
router.patch("/:id", protect, completeCheckIn);

router.get("/", protect, getMyCheckIns);
router.get("/notifications", protect, getMyCheckInNotifications);
router.delete(
  "/notifications/:id",
  protect,
  deleteCheckInNotification
);
router.delete("/:id", protect, deleteCheckIn);
router.put("/:id/location", protect, updateLocation);

module.exports = router;