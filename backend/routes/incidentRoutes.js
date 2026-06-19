const express = require("express");
const router = express.Router();

const {
  createIncident,
  getMyIncidents,
  deleteIncident,
} = require("../controllers/incidentController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createIncident);
router.get("/", protect, getMyIncidents);
router.delete("/:id", protect, deleteIncident);
module.exports = router;