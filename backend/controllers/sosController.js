const SOS = require("../models/SOSAlert");

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

module.exports = {
  createSOS,
};