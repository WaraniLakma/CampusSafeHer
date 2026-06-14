const SOSAlert = require("../models/SOSAlert");

// Create SOS Alert
const createSOSAlert = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const sosAlert = await SOSAlert.create({
      user: req.user.id,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: "SOS Alert Created Successfully",
      sosAlert,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My SOS Alerts
const getMySOSAlerts = async (req, res) => {
  try {
    const alerts = await SOSAlert.find({
      user: req.user.id,
    });

    res.status(200).json({
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSOSAlert,
  getMySOSAlerts,
};