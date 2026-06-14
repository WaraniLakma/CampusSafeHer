const express = require("express");
const router = express.Router();

const {
  createIncident,
  getMyIncidents,
} = require("../controllers/incidentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createIncident);
router.get("/", protect, getMyIncidents);

module.exports = router;