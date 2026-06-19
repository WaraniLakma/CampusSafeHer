import { useEffect, useState } from "react";
import API from "../services/api";

function Alerts() {
  const [notifications, setNotifications] =
    useState([]);

    const [checkInNotifications,
  setCheckInNotifications] =
  useState([]);

  useEffect(() => {
    fetchNotifications();
    fetchCheckInNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/sos/notifications",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );
            console.log(
        "CHECKIN RESPONSE",
        res.data
        );

        console.log(
        "CHECKIN COUNT",
        res.data.notifications?.length
        );

      setNotifications(
        res.data.notifications
      );
    } catch (error) {
      console.log(error);
    }
  };
  const deleteAlert = async (id) => {
    try {
        const token =
        localStorage.getItem("token");

        await API.delete(
        `/sos/notifications/${id}`,
        {
            headers: {
            Authorization:
                `Bearer ${token}`,
            },
        }
        );

        alert("Alert deleted");

        fetchNotifications();
    } catch (error) {
        console.log(error);
    }
  };
  const deleteCheckInAlert =
    async (id) => {
        try {
        const token =
            localStorage.getItem("token");

        await API.delete(
            `/checkins/notifications/${id}`,
            {
            headers: {
                Authorization:
                `Bearer ${token}`,
            },
            }
        );

        alert("Alert deleted");

        fetchCheckInNotifications();
        } catch (error) {
        console.log(error);
        }
  };
  const fetchCheckInNotifications =
  async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await API.get(
        "/checkins/notifications",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "CHECKIN RESPONSE",
        res.data
      );

      console.log(
        "CHECKIN COUNT",
        res.data.notifications?.length
      );

      setCheckInNotifications(
        res.data.notifications
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>🚨 Incoming Alerts</h1>
      

      {checkInNotifications.map(
        (notification) => (
            <div key={notification._id}>
            <h3>
                {notification.sender?.name}
            </h3>

            <p>
                Email:{" "}
                {notification.sender?.email}
            </p>

            <p>
                Time:{" "}
                {new Date(
                notification.createdAt
                ).toLocaleString()}
            </p>

            {
                notification.type ===
                "Alert Sent" ? (
                    <p
                    style={{
                        color: "red",
                        fontWeight: "bold",
                    }}
                    >
                    🟠 {
                        notification.sender?.name
                    } has not confirmed that
                    she arrived at her expected
                    destination.

                    Please check on her and
                    contact her if necessary.
                    </p>
                ) : (
                    <p
                    style={{
                        color: "green",
                        fontWeight: "bold",
                    }}
                    >
                    ✅ {
                        notification.sender?.name
                    } confirmed that she
                    arrived safely at her
                    destination.

                    No further action is
                    required.
                    </p>
                )
            }
            <button
                onClick={() =>
                    window.open(
                    `https://maps.google.com/?q=${notification.checkIn?.lastKnownLatitude},${notification.checkIn?.lastKnownLongitude}`,
                    "_blank"
                    )
                }
                >
                📍 Open Location
                </button>

                {" "}

                <button
                onClick={() =>
                    deleteCheckInAlert(
                    notification._id
                    )
                }
                >
                🗑 Delete Alert
            </button>

            <hr />
            </div>
        )
      )}

      {notifications.length === 0 ? (
        <p>No alerts received.</p>
      ) : (
        notifications.map(
          (notification) => (
            <div
              key={notification._id}
            >
              <h3>
                {notification.sender?.name}
              </h3>

              <p>
                Email:{" "}
                {
                  notification.sender
                    ?.email
                }
              </p>
              <p>
                Time:{" "}
                {new Date(
                    notification.createdAt
                ).toLocaleString()}
              </p>

              

              {
                notification.sos?.status ===
                "Emergency" ? (
                    <p
                    style={{
                        color: "red",
                        fontWeight: "bold",
                    }}
                    >
                    🚨 {notification.sender?.name} is in
                    an emergency. Please contact her
                    immediately.
                    </p>
                ) : (
                    <p
                    style={{
                        color: "green",
                        fontWeight: "bold",
                    }}
                    >
                    ✅ {notification.sender?.name} has
                    confirmed her safety. No further
                    action is required.
                    </p>
                )
              }
              <button
                onClick={() =>
                    window.open(
                    `https://maps.google.com/?q=${notification.sos?.latitude},${notification.sos?.longitude}`,
                    "_blank"
                    )
                }
                >
                📍 Open Location
                </button>

                {" "}

                <button
                onClick={() =>
                    deleteAlert(notification._id)
                }
                >
                🗑 Delete Alert
                </button>

              <hr />
            </div>
          )
        )
      )}
    </div>
  );
}

export default Alerts;