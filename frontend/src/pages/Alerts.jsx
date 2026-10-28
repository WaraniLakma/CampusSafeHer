import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Alerts() {
  const [notifications, setNotifications] = useState([]);
  const [checkInNotifications, setCheckInNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/sos/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCheckInNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/checkins/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCheckInNotifications(res.data.notifications || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchNotifications();
    fetchCheckInNotifications();
  }, []);

  const deleteAlert = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/sos/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Alert deleted successfully.", "success");
      fetchNotifications();
    } catch (error) {
      showToast("Failed to delete alert.", "error");
      console.log(error);
    }
  };

  const deleteCheckInAlert = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/checkins/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showToast("Alert deleted successfully.", "success");
      fetchCheckInNotifications();
    } catch (error) {
      showToast("Failed to delete alert.", "error");
      console.log(error);
    }
  };

  const totalAlerts = checkInNotifications.length + notifications.length;

  const renderAlertCard = (notification, type) => {
    const isEmergency =
      type === "checkin"
        ? notification.type === "Alert Sent"
        : notification.sos?.status === "Emergency";

    const senderName = notification.sender?.name || "Unknown";
    const initial = senderName.charAt(0).toUpperCase();
    const lat =
      type === "checkin"
        ? notification.checkIn?.lastKnownLatitude
        : notification.sos?.latitude;
    const lng =
      type === "checkin"
        ? notification.checkIn?.lastKnownLongitude
        : notification.sos?.longitude;

    const badgeBg = isEmergency ? "#fee2e2" : "#dcfce7";
    const badgeColor = isEmergency ? "#b91c1c" : "#15803d";
    const badgeBorder = isEmergency ? "#fca5a5" : "#86efac";
    const badgeLabel = isEmergency
      ? type === "checkin"
        ? "🟠 Check-In Overdue Alert"
        : "🚨 Urgent SOS Emergency"
      : "✅ Safe Arrival Confirmed";

    const message = isEmergency
      ? type === "checkin"
        ? `${senderName} has not confirmed that she arrived at her expected destination. Please check on her immediately.`
        : `${senderName} has triggered an Emergency SOS alert! Please contact her immediately or notify campus responders.`
      : type === "checkin"
        ? `${senderName} has arrived safely at her destination. No further action is required.`
        : `${senderName} has confirmed her safety. The emergency status has been resolved.`;

    const onDelete =
      type === "checkin"
        ? () => deleteCheckInAlert(notification._id)
        : () => deleteAlert(notification._id);

    return (
      <div
        key={notification._id}
        className="alert-card-modern"
        style={{
          backgroundColor: "white",
          borderRadius: "22px",
          padding: "26px",
          boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
          border: `1.5px solid ${isEmergency ? "#fecaca" : "#bbf7d0"}`,
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* AVATAR */}
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: isEmergency
              ? "linear-gradient(135deg, #f472b6, #ef4444)"
              : "linear-gradient(135deg, #34d399, #059669)",
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "22px",
            fontWeight: "800",
            flexShrink: 0,
            boxShadow: isEmergency
              ? "0 6px 18px rgba(239, 68, 68, 0.3)"
              : "0 6px 18px rgba(16, 185, 129, 0.25)",
          }}
        >
          {initial}
        </div>

        {/* DETAILS */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              marginBottom: "8px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 2px",
                  fontSize: "18px",
                  fontWeight: "800",
                  color: "#1f1147",
                  fontFamily: "var(--font-display)",
                }}
              >
                {senderName}
              </h3>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                ✉️ {notification.sender?.email || "Email undisclosed"}
              </div>
            </div>

            <span
              style={{
                backgroundColor: badgeBg,
                color: badgeColor,
                border: `1px solid ${badgeBorder}`,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                whiteSpace: "nowrap",
              }}
            >
              {badgeLabel}
            </span>
          </div>

          <div style={{ fontSize: "12.5px", color: "#94a3b8", marginBottom: "14px" }}>
            🕐 Received on {new Date(notification.createdAt).toLocaleString()}
          </div>

          {/* MESSAGE BOX */}
          <div
            style={{
              marginBottom: "18px",
              fontSize: "14.5px",
              color: isEmergency ? "#991b1b" : "#166534",
              lineHeight: "1.6",
              backgroundColor: isEmergency ? "#fff1f2" : "#f0fdf4",
              border: `1px solid ${isEmergency ? "#fecdd3" : "#bbf7d0"}`,
              padding: "14px 18px",
              borderRadius: "14px",
              fontWeight: isEmergency ? "600" : "500",
            }}
          >
            {message}
          </div>

          {/* ACTIONS */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {lat && lng && (
              <button
                onClick={() =>
                  window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank")
                }
                style={{
                  padding: "10px 20px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "13.5px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 14px rgba(236, 72, 153, 0.25)",
                }}
              >
                <span>📍 View Live Location (Maps)</span>
              </button>
            )}

            <button
              onClick={onDelete}
              style={{
                padding: "10px 18px",
                borderRadius: "12px",
                border: "1px solid #fecaca",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                fontWeight: "600",
                fontSize: "13.5px",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🗑 Dismiss Alert</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout
      activeKey="alerts"
      pageTitle="Safety Alerts"
      pageSubtitle="Incoming peer & circle notifications"
      user={user}
      toast={toast}
      onDismissToast={() => setToast(null)}
    >
      <style>{`
        .alert-card-modern {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .alert-card-modern:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 30px rgba(31, 17, 71, 0.08) !important;
        }
      `}</style>

      {/* HEADER HERO */}
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 3.2vw, 2.3rem)",
            color: "#1f1147",
            fontWeight: "800",
            margin: "0 0 6px",
          }}
        >
          Safety Alerts Inbox
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Notifications from friends, roommates, and trusted contacts who have requested help or triggered overdue check-in timers.
        </p>
      </div>

      {/* FILTER TABS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "26px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => setActiveFilter("all")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: activeFilter === "all" ? "2px solid #8b5cf6" : "1px solid #cbd5e1",
            backgroundColor: activeFilter === "all" ? "#f5f3ff" : "white",
            color: activeFilter === "all" ? "#7c3aed" : "#475569",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          All Alerts ({totalAlerts})
        </button>

        <button
          onClick={() => setActiveFilter("sos")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: activeFilter === "sos" ? "2px solid #ec4899" : "1px solid #cbd5e1",
            backgroundColor: activeFilter === "sos" ? "#fdf2f8" : "white",
            color: activeFilter === "sos" ? "#be185d" : "#475569",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          🚨 SOS Alerts ({notifications.length})
        </button>

        <button
          onClick={() => setActiveFilter("checkin")}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
            border: activeFilter === "checkin" ? "2px solid #0ea5e9" : "1px solid #cbd5e1",
            backgroundColor: activeFilter === "checkin" ? "#f0f9ff" : "white",
            color: activeFilter === "checkin" ? "#0369a1" : "#475569",
            fontWeight: "700",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          📍 Check-In Alerts ({checkInNotifications.length})
        </button>
      </div>

      {/* CONTENT FEED */}
      {totalAlerts === 0 ? (
        /* ALL CLEAR EMPTY STATE */
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "70px 30px",
            textAlign: "center",
            border: "1px solid #f3d4e7",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.03)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              borderRadius: "24px",
              backgroundColor: "#fdf2f8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "38px",
            }}
          >
            🔔
          </div>
          <h3
            style={{
              fontFamily: "var(--font-display)",
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "#1f1147",
            }}
          >
            No active safety alerts
          </h3>
          <p style={{ margin: 0, color: "#64748b", maxWidth: "380px", fontSize: "15px", lineHeight: "1.6" }}>
            All clear! When a member of your trusted circle triggers an emergency or is overdue, their real-time alert will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {/* SOS NOTIFICATIONS */}
          {(activeFilter === "all" || activeFilter === "sos") && notifications.length > 0 && (
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  margin: "0 0 14px",
                  fontSize: "19px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                Emergency SOS Broadcasts ({notifications.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {notifications.map((n) => renderAlertCard(n, "sos"))}
              </div>
            </div>
          )}

          {/* CHECK-IN NOTIFICATIONS */}
          {(activeFilter === "all" || activeFilter === "checkin") && checkInNotifications.length > 0 && (
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  margin: "0 0 14px",
                  fontSize: "19px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                Journey Check-In Notifications ({checkInNotifications.length})
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {checkInNotifications.map((n) => renderAlertCard(n, "checkin"))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Alerts;
