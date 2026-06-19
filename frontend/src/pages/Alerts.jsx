import { useEffect, useState } from "react";
import API from "../services/api";

function Alerts() {
  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {
    fetchNotifications();
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>🚨 Incoming Alerts</h1>

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