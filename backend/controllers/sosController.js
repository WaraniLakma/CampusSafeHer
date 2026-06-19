const SOS = require("../models/SOSAlert");
const TrustedContact = require("../models/TrustedContact");
const SOSNotification = require("../models/SOSNotification");

const createSOS = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
    } = req.body;

    const sos = await SOS.create({
      user: req.user.id,
      latitude,
      longitude,
    });

    const trustedContacts =
      await TrustedContact.find({
        user: req.user.id,
      });

    for (const contact of trustedContacts) {
      await SOSNotification.create({
        sender: req.user.id,
        receiver: contact.trustedUser,
        sos: sos._id,
      });
    }

    res.status(201).json({
      message: "SOS Alert Sent",
      sos,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMySOSNotifications =
  async (req, res) => {
    try {
      const notifications =
        await SOSNotification.find({
          receiver: req.user.id,
        })
          .populate(
            "sender",
            "name email"
          )
          .populate("sos");

      res.status(200).json({
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
};
const deleteNotification =
  async (req, res) => {
    try {
      const notification =
        await SOSNotification.findById(
          req.params.id
        );

      if (!notification) {
        return res.status(404).json({
          message:
            "Notification not found",
        });
      }

      await notification.deleteOne();

      res.status(200).json({
        message:
          "Notification deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };


module.exports = {
  createSOS,
  getMySOSNotifications,
  deleteNotification,
};