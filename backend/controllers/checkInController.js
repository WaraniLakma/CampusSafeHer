const CheckIn = require("../models/CheckIn");

const TrustedContact =
  require("../models/TrustedContact");

const CheckInNotification =
  require("../models/CheckInNotification");

// Create Check-In
const createCheckIn = async (req, res) => {
  try {
    const {
      destination,
      expectedArrivalTime,
      reminderInterval,
      currentLatitude,
      currentLongitude,
    } = req.body;

    const checkIn = await CheckIn.create({
      user: req.user.id,
      destination,
      expectedArrivalTime,
      reminderInterval,
      currentLatitude,
      currentLongitude,

      lastKnownLatitude: currentLatitude,
      lastKnownLongitude: currentLongitude,


    });

    res.status(201).json({
      message: "Check-In created successfully",
      checkIn,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Complete Check-In
const completeCheckIn = async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(req.params.id);

    if (!checkIn) {
      return res.status(404).json({
        message: "Check-In not found",
      });
    }

    checkIn.checkedIn = true;
    checkIn.status = "Safe Confirmed";

    await checkIn.save();

    const trustedContacts =
    await TrustedContact.find({
        user: req.user.id,
    });

    for (const contact of trustedContacts) {
    await CheckInNotification.create({
        sender: req.user.id,
        receiver: contact.trustedUser,
        checkIn: checkIn._id,
        type: "Safe Confirmed",
    });
    }

    res.status(200).json({
      message: "Check-In completed successfully",
      checkIn,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Check-Ins
const getMyCheckIns = async (req, res) => {
  try {
    const checkIns = await CheckIn.find({
      user: req.user.id,
    });

    res.status(200).json({
      checkIns,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteCheckIn = async (req, res) => {
  try {
    const checkIn = await CheckIn.findById(
      req.params.id
    );

    if (!checkIn) {
      return res.status(404).json({
        message: "Check-In not found",
      });
    }

    await checkIn.deleteOne();

    res.status(200).json({
      message: "Check-In deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const updateLocation = async (req, res) => {
  try {
    const {
      lastKnownLatitude,
      lastKnownLongitude,
    } = req.body;

    const checkIn =
      await CheckIn.findById(
        req.params.id
      );

    if (!checkIn) {
      return res.status(404).json({
        message: "Check-In not found",
      });
    }

    checkIn.lastKnownLatitude =
      lastKnownLatitude;

    checkIn.lastKnownLongitude =
      lastKnownLongitude;

    await checkIn.save();

    res.status(200).json({
      message:
        "Location updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getMyCheckInNotifications =
  async (req, res) => {
    try {
      const notifications =
        await CheckInNotification.find({
          receiver: req.user.id,
        })
          .sort({ createdAt: -1 })
          .populate(
            "sender",
            "name email"
          )
          .populate("checkIn");

      res.status(200).json({
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
};
const deleteCheckInNotification =
  async (req, res) => {
    try {
      const notification =
        await CheckInNotification.findById(
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
  createCheckIn,
  completeCheckIn,
  getMyCheckIns,
  deleteCheckIn,
  updateLocation,
  getMyCheckInNotifications,
  deleteCheckInNotification,
};
