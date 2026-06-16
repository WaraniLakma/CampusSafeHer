const cron = require("node-cron");
const CheckIn = require("../models/CheckIn");

const startCheckInMonitor = () => {
  cron.schedule("* * * * *", async () => {
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

        const minutesLate = (now - arrivalTime) / (1000 * 60);

        const interval = checkIn.reminderInterval || 10;

        if (minutesLate < 0) {
          continue;
        }

        // 1st Reminder
        if (minutesLate >= interval && !checkIn.reminder10Sent) {
          checkIn.reminder10Sent = true;
          checkIn.status = "Reminder Sent";

          console.log(`1st reminder for ${checkIn.destination}`);
        }

        // 2nd Reminder
        if (minutesLate >= interval * 2 && !checkIn.reminder20Sent) {
          checkIn.reminder20Sent = true;
          checkIn.status = "Reminder Sent";

          console.log(`2nd reminder for ${checkIn.destination}`);
        }

        // Overdue / Last Reminder
        if (
          minutesLate >= interval * 3 &&
          checkIn.status !== "Overdue" &&
          !checkIn.alertSent
        ) {
          checkIn.status = "Overdue";

          console.log(`Check-In overdue for ${checkIn.destination}`);
        }

        // Alert Sent: 5 minutes after overdue
        if (minutesLate >= interval * 3 + 5 && !checkIn.alertSent) {
          checkIn.alertSent = true;
          checkIn.status = "Alert Sent";

          checkIn.alertMessage =
            "Trusted contacts have been notified. Last known location shared.";

          console.log(`ALERT SENT for ${checkIn.destination}`);
        }

        await checkIn.save();
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = startCheckInMonitor;