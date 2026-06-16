const Incident = require("../models/Incident");

// Create Incident Report
const createIncident = async (e) => {
  e.preventDefault();


  console.log("Button clicked");  
  try {
    const {
      category,
      description,
      location,
      isAnonymous,
    } = req.body;

    const incident = await Incident.create({
      user: req.user.id,
      category,
      description,
      location,
      isAnonymous,
    });

    res.status(201).json({
      message: "Incident reported successfully",
      incident,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Incident Reports
const getMyIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find({
      user: req.user.id,
    });

    res.status(200).json({
      incidents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Admin - Get All Incidents
const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find()
      .populate("user", "name email");

    res.status(200).json({
      incidents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createIncident,
  getMyIncidents,
  getAllIncidents,
};