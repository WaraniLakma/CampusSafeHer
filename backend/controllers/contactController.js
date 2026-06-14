const TrustedContact = require("../models/TrustedContact");

// Add Trusted Contact
const addTrustedContact = async (req, res) => {
  try {
    const { name, phone, relationship } = req.body;

    const contact = await TrustedContact.create({
      user: req.user.id,
      name,
      phone,
      relationship,
    });

    res.status(201).json({
      message: "Trusted contact added successfully",
      contact,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Trusted Contacts
const getTrustedContacts = async (req, res) => {
  try {
    const contacts = await TrustedContact.find({
      user: req.user.id,
    });

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addTrustedContact,
  getTrustedContacts,
};