import { useEffect, useState } from "react";
import API from "../services/api";

function CheckIn() {
  const [checkIns, setCheckIns] = useState([]);
  const [destination, setDestination] = useState("");
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
  const [reminderInterval, setReminderInterval] = useState(10);
  const [showAlertBanner, setShowAlertBanner] =useState(false);
  const [currentLatitude, setCurrentLatitude] =useState(null);
  const [currentLongitude, setCurrentLongitude] =useState(null);

  useEffect(() => {
        if ("Notification" in window) {
            Notification.requestPermission();
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
            console.log(
                "Latitude:",
                position.coords.latitude
            );

            console.log(
                "Longitude:",
                position.coords.longitude
            );

            setCurrentLatitude(
                position.coords.latitude
            );

            setCurrentLongitude(
                position.coords.longitude
            );
            },
            (error) => {
            console.log(error);
            }
        );

        fetchCheckIns();

        const interval = setInterval(() => {
            fetchCheckIns();
        }, 5000);

        const locationInterval = setInterval(() => {
            checkIns.forEach((checkIn) => {
            if (
                !checkIn.checkedIn &&
                checkIn.status !== "Alert Sent"
            ) {
                updateLocation(checkIn._id);
            }
            });
        }, 30000);

        return () => {
            clearInterval(interval);
            clearInterval(locationInterval);
        };
  }, []);

  const showNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const fetchCheckIns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/checkins", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCheckIns(res.data.checkIns);

      res.data.checkIns.forEach((checkIn) => {
        const notificationKey = `${checkIn._id}-${checkIn.status}`;

        if (localStorage.getItem(notificationKey)) {
          return;
        }

        if (checkIn.status === "First Reminder Sent") {
          showNotification(
            "🟡 CampusSafeHer 1st Reminder",
            "Your expected arrival time has passed.",
          );

          localStorage.setItem(notificationKey, "shown");
        }
        if (checkIn.status === "Second Reminder Sent") {
            showNotification(
                "🟡 CampusSafeHer 2nd Reminder",
                "You still have not completed your safety check-in."
            );

            localStorage.setItem(notificationKey, "shown");
        }

        if (checkIn.status === "Overdue") {
          showNotification(
            "🟠 CampusSafeHer Last Reminder",
            "Please confirm your safety immediately.",
            "After 5 minutes, your trusted contacts will be notified.", 
            
          );

          localStorage.setItem(notificationKey, "shown");
        }

        if (checkIn.status === "Alert Sent") {
            setShowAlertBanner(true);

            if (!localStorage.getItem(notificationKey)) {
                showNotification(
                "🔴 CampusSafeHer Alert",
                "Trusted contacts have been notified."
                );

                localStorage.setItem(
                notificationKey,
                "shown"
                );
            }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updateLocation = async (
    checkInId
    ) => {
    navigator.geolocation.getCurrentPosition(
        async (position) => {
        try {
            const token =
            localStorage.getItem("token");

            await API.patch(
            `/checkins/location/${checkInId}`,
            {
                lastKnownLatitude:
                position.coords.latitude,

                lastKnownLongitude:
                position.coords.longitude,
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
        } catch (error) {
            console.log(error);
        }
        }
    );
  };

  const createCheckIn = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/checkins",
        {
          destination,
          expectedArrivalTime,
          reminderInterval,
          currentLatitude,
          currentLongitude
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDestination("");
      setExpectedArrivalTime("");

      fetchCheckIns();
    } catch (error) {
      console.log(error);
    }
  };

  const completeCheckIn = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/checkins/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showNotification(
        "✅ Safety Confirmed",
        "Trusted contacts will be notified that you arrived safely."
     );

      fetchCheckIns();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteCheckIn = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(
            `/checkins/${id}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            fetchCheckIns();

            showNotification(
            "🗑 Check-In Deleted",
            "Check-In removed successfully."
            );
        } catch (error) {
            console.log(error);
        }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Safety Check-In</h1>
      {showAlertBanner && (
            <div
                style={{
                background: "#ffdddd",
                border: "2px solid red",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "8px",
                }}
            >
                <h2>🚨 SAFETY ALERT</h2>

                <p>
                Trusted contacts have been notified.
                </p>

                <p>
                Last known location shared.
                </p>

                <p>
                If you have arrived safely,
                please complete your check-in.
                </p>

                <button
                onClick={() =>
                    setShowAlertBanner(false)
                }
                >
                ✕ Close
                </button>
            </div>
        )}




      <form onSubmit={createCheckIn}>
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />

        <br />
        <br />

        <input
          type="datetime-local"
          value={expectedArrivalTime}
          onChange={(e) => setExpectedArrivalTime(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          min="1"
          max="60"
          value={reminderInterval}
          onChange={(e) =>
            setReminderInterval(Number(e.target.value))
          }
        />

        <p>
          Reminder Interval: {reminderInterval} minute(s)
        </p>

        <br />

        <button type="submit">Create Check-In</button>
      </form>

      <hr />

      {[...checkIns]
        .sort(
            (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
        .map((checkIn) => (
        <div key={checkIn._id}>
          <h3>Destination: {checkIn.destination}</h3>

          <p>
            Expected Arrival:{" "}
            {new Date(checkIn.expectedArrivalTime).toLocaleString()}
          </p>

          

          {checkIn.status === "Active" && (
            <p>
              Status: 🟢 Active: Awaiting expected arrival time.
            </p>
          )}

          {checkIn.status === "First Reminder Sent" && (
            <div>
            <p>
              Status: 🟡 Reminder: You have not completed your safety check-in.
            </p>

            <p>
                Please complete your check-in if you have arrived safely.
            </p>
            </div>
          )}
          {checkIn.status === "Second Reminder Sent" && (
            <div>
            <p>
              Status: 🟡 Reminder: You have not completed your safety check-in.
            </p>

            <p>
                Please complete your check-in if you have arrived safely.
            </p>
            </div>
          )}

          {checkIn.status === "Overdue" && (
            <div>
            <p>
              Status: 🟠 Last Reminder: After 5 minutes, trusted contacts will be notified.
            </p>

            <p>
                Please complete your check-in if you have arrived safely.
            </p>
            </div>
          )}

          {checkIn.status === "Alert Sent" && (
            <div>
                <p>
                Status: 🔴 ALERT SENT
                </p>
            </div>
          )}
          {checkIn.status === "Safe Confirmed" && (
            <div>
                <p>
                Status: ✅ Safety Confirmed
                </p>

                <p>
                You have marked yourself safe.
                </p>

                <p>
                Trusted contacts will be notified
                that you arrived safely.
                </p>
            </div>
          )}

          <p>
            Checked In: {checkIn.checkedIn ? "Yes" : "No"}
          </p>

          {!checkIn.checkedIn && (
            <button onClick={() => completeCheckIn(checkIn._id)}>
              Complete Check-In
            </button>
          )}
          <button
            style={{ marginLeft: "10px" }}
            onClick={() =>
                deleteCheckIn(checkIn._id)
            }
            >
            🗑 Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default CheckIn;