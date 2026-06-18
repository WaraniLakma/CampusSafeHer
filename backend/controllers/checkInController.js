const CheckIn = require("../models/CheckIn");

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

module.exports = {
  createCheckIn,
  completeCheckIn,
  getMyCheckIns,
  deleteCheckIn,
  updateLocation,
};
