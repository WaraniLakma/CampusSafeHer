const mongoose = require("mongoose");


const checkInNotificationSchema =
  new mongoose.Schema(
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      checkIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CheckIn",
        required: true,
      },

      type: {
        type: String,
        enum: [
          "Alert Sent",
          "Safe Confirmed",
        ],
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model(
  "CheckInNotification",
  checkInNotificationSchema
);