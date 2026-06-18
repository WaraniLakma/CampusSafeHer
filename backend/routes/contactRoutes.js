const express = require("express");
const router = express.Router();

const {
  addTrustedContact,
  getTrustedContacts,
  deleteTrustedContact,
} = require("../controllers/contactController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, addTrustedContact);
router.get("/", protect, getTrustedContacts);
router.delete("/:id", protect, deleteTrustedContact);

module.exports = router;