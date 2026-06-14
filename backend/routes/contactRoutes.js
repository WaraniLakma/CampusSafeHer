const express = require("express");
const router = express.Router();

const {
  addTrustedContact,
  getTrustedContacts,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addTrustedContact);
router.get("/", protect, getTrustedContacts);

module.exports = router;