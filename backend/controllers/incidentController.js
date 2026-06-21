const Incident = require("../models/Incident");

// Create Incident Report
const createIncident = async (req, res) => {
  try {
    const {
      category,
      description,
      location,
      isAnonymous,
      attachment,
      attachmentName,
    } = req.body;

    const incident = await Incident.create({
      user: req.user.id,
      category,
      description,
      location,
      isAnonymous,
      attachment,
      attachmentName,
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
    }).sort({ createdAt: -1 });

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
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      incidents,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Admin - Update Incident Status
const updateIncidentStatus = async (req, res) => {
  try {


    console.log("Status:", req.body.status);
    console.log("ID:", req.params.id);

    const { status } = req.body;

    const incident = await Incident.findById(
      req.params.id
    );

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    incident.status = status;

    await incident.save();

    res.status(200).json({
      message: "Status updated successfully",
      incident,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(
      req.params.id
    );

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    await incident.deleteOne();

    res.status(200).json({
      message:
        "Incident deleted successfully",
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
  updateIncidentStatus,
  deleteIncident,
};