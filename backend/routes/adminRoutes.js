const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getAllIncidents,
} = require("../controllers/incidentController");

router.get(
  "/incidents",
  protect,
  adminOnly,
  getAllIncidents
);

module.exports = router;