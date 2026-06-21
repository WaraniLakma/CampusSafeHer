const cron = require("node-cron");
const CheckIn = require("../models/CheckIn");
const TrustedContact = require("../models/TrustedContact");
const CheckInNotification = require("../models/CheckInNotification");

const startCheckInMonitor = () => {
  // Runs every second
  cron.schedule("* * * * * *", async () => {
    try {
      const activeCheckIns = await CheckIn.find({
        checkedIn: false,
      });

      const now = new Date();

      for (const checkIn of activeCheckIns) {
        if (
          checkIn.status === "Completed" ||
          checkIn.status === "Alert Sent"
        ) {
          continue;
        }

        const arrivalTime = new Date(checkIn.expectedArrivalTime);

        // Time late in seconds
        const secondsLate = (now - arrivalTime) / 1000;

        // reminderInterval is now treated as seconds
        const interval = checkIn.reminderInterval || 10;

        if (secondsLate < 0) {
          continue;
        }

        // 1st Reminder
        if (
          secondsLate >= interval &&
          !checkIn.reminder10Sent
        ) {
          checkIn.reminder10Sent = true;
          checkIn.status = "First Reminder Sent";

          console.log(
            `1st reminder for ${checkIn.destination}`
          );
        }

        // 2nd Reminder
        if (
          secondsLate >= interval * 2 &&
          !checkIn.reminder20Sent
        ) {
          checkIn.reminder20Sent = true;
          checkIn.status = "Second Reminder Sent";

          console.log(
            `2nd reminder for ${checkIn.destination}`
          );
        }

        // Overdue / Last Reminder
        if (
          secondsLate >= interval * 3 &&
          checkIn.status !== "Overdue" &&
          !checkIn.alertSent
        ) {
          checkIn.status = "Overdue";

          console.log(
            `Check-In overdue for ${checkIn.destination}`
          );
        }

        // Alert Sent: 5 seconds after overdue
        if (
          secondsLate >= interval * 3 + 5 &&
          !checkIn.alertSent
        ) {
          checkIn.alertSent = true;
          checkIn.status = "Alert Sent";

          checkIn.alertMessage =
            "Trusted contacts have been notified. Last known location shared.";

          const trustedContacts = await TrustedContact.find({
            user: checkIn.user,
          });

          for (const contact of trustedContacts) {
            await CheckInNotification.create({
              sender: checkIn.user,
              receiver: contact.trustedUser,
              checkIn: checkIn._id,
              type: "Alert Sent",
            });
          }

          console.log(
            `ALERT SENT for ${checkIn.destination}`
          );
        }

        await checkIn.save();
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = startCheckInMonitor;