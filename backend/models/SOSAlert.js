const mongoose = require("mongoose");

const sosAlertSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "Emergency SOS Alert",
    },

    latitude: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SOSAlert", sosAlertSchema);