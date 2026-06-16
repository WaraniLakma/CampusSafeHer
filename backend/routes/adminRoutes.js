const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getAllIncidents,
  updateIncidentStatus,
} = require("../controllers/incidentController");

router.get(
  "/incidents",
  protect,
  adminOnly,
  getAllIncidents
);

router.patch(
  "/incidents/:id",
  protect,
  adminOnly,
  updateIncidentStatus
);

module.exports = router;