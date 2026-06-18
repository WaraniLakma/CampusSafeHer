const TrustedContact = require("../models/TrustedContact");
const User = require("../models/User");

// Add Trusted Contact
const addTrustedContact = async (req, res) => {
  try {
    const { email, relationship } = req.body;
    const currentUser =
  await User.findById(req.user.id);

    if (
    currentUser.email === email
    ) {
    return res.status(400).json({
        message:
        "You cannot add yourself as a trusted contact",
    });
    }

    const trustedUser = await User.findOne({
      email,
    });

    if (!trustedUser) {
      return res.status(404).json({
        message:
          "This email is not registered in CampusSafeHer",
      });
    }

    const existingContact =
      await TrustedContact.findOne({
        user: req.user.id,
        trustedUser: trustedUser._id,
      });

    if (existingContact) {
      return res.status(400).json({
        message:
          "Trusted contact already added",
      });
    }

    const contact =
      await TrustedContact.create({
        user: req.user.id,
        trustedUser: trustedUser._id,
        relationship,
      });

    res.status(201).json({
      message:
        "Trusted contact added successfully",
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
    const contacts =
      await TrustedContact.find({
        user: req.user.id,
      }).populate(
        "trustedUser",
        "name email"
      );

    res.status(200).json({
      contacts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteTrustedContact = async (
  req,
  res
) => {
  try {
    const contact =
      await TrustedContact.findById(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        message:
          "Trusted contact not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      message:
        "Trusted contact deleted successfully",
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
  deleteTrustedContact,
};