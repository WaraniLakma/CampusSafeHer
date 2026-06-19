const mongoose = require("mongoose");

const sosSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    status: {
    type: String,
    default: "Emergency",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SOS",
  sosSchema
);