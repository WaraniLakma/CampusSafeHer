const express = require("express");
const router = express.Router();

const {
  createCheckIn,
  completeCheckIn,
  getMyCheckIns,
  deleteCheckIn,
  updateLocation
} = require("../controllers/checkInController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createCheckIn);
router.patch("/:id", protect, completeCheckIn);
router.get("/", protect, getMyCheckIns);
router.delete("/:id", protect, deleteCheckIn);
router.put("/:id/location", protect, updateLocation);
module.exports = router;