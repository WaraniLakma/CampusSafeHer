const mongoose = require("mongoose");

const checkInSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    expectedArrivalTime: {
      type: Date,
      required: true,
    },
    reminderInterval: {
        type: Number,
        default: 10,
        min: 1,
        max: 60,
    },

    checkedIn: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Reminder Sent", "Overdue", "Alert Sent", "Completed"],
      default: "Active",
    },

    reminder10Sent: {
      type: Boolean,
      default: false,
    },

    reminder20Sent: {
      type: Boolean,
      default: false,
    },

    alertSent: {
      type: Boolean,
      default: false,
    },

    alertMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CheckIn", checkInSchema);