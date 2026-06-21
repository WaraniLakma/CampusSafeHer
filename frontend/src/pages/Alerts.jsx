import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

const navLinkStyle = {
  padding: "14px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  color: "#555",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "all 0.2s ease",
};

const activeNavStyle = {
  ...navLinkStyle,
  color: "#ec4899",
  fontWeight: "600",
  backgroundColor: "#fdf2f8",
};

function Alerts() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [checkInNotifications, setCheckInNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchNotifications();
    fetchCheckInNotifications();
  }, []);

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

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
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
    const badgeLabel = isEmergency
      ? type === "checkin"
        ? "🟠 Check-In Alert"
        : "🚨 Emergency SOS"
      : "✅ Safety Confirmed";

    const message = isEmergency
      ? type === "checkin"
        ? `${senderName} has not confirmed that she arrived at her expected destination. Please check on her and contact her if necessary.`
        : `${senderName} is in an emergency. Please contact her immediately.`
      : type === "checkin"
        ? `${senderName} confirmed that she arrived safely at her destination. No further action is required.`
        : `${senderName} has confirmed her safety. No further action is required.`;

    const onDelete =
      type === "checkin"
        ? () => deleteCheckInAlert(notification._id)
        : () => deleteAlert(notification._id);

    return (
      <div
        key={notification._id}
        className="alert-grid-card"
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "24px",
          boxShadow: "0 4px 15px rgba(31, 17, 71, 0.01)",
          border: isEmergency ? "1px solid #fecaca" : "1px solid #f3d4e7",
        }}
      >
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: isEmergency
                ? "linear-gradient(135deg, #f472b6, #ef4444)"
                : "linear-gradient(135deg, #34d399, #6ee7b7)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
              fontWeight: "bold",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
              <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#1f1147" }}>
                {senderName}
              </h3>
              <span
                style={{
                  backgroundColor: badgeBg,
                  color: badgeColor,
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                }}
              >
                {badgeLabel}
              </span>
            </div>

            <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#64748b" }}>
              ✉️ {notification.sender?.email}
            </p>
            <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#94a3b8" }}>
              🕐 {new Date(notification.createdAt).toLocaleString()}
            </p>

            <p
              style={{
                margin: "0 0 16px",
                fontSize: "14px",
                color: isEmergency ? "#991b1b" : "#166534",
                lineHeight: "1.5",
                backgroundColor: isEmergency ? "#fef2f2" : "#f0fdf4",
                padding: "12px 14px",
                borderRadius: "12px",
              }}
            >
              {message}
            </p>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {lat && lng && (
                <button
                  onClick={() =>
                    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank")
                  }
                  className="btn-interact"
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  📍 Open Location
                </button>
              )}
              <button
                onClick={onDelete}
                className="btn-interact"
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  border: "1px solid #fecaca",
                  backgroundColor: "#fef2f2",
                  color: "#ef4444",
                  fontWeight: "600",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                🗑 Delete Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff1f8,#fff7fd)",
        fontFamily: "var(--sans)",
        color: "#1f1147",
        position: "relative",
      }}
    >
      <style>{`
        .alert-grid-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .alert-grid-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(31, 17, 71, 0.08) !important;
        }
        .btn-interact {
          transition: all 0.2s ease;
        }
        .btn-interact:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .btn-interact:active {
          transform: translateY(0);
        }
      `}</style>

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: toast.type === "success" ? "#10b981" : "#ef4444",
            color: "white",
            padding: "16px 24px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: "bold",
          }}
        >
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* SIDEBAR */}
      <div
        style={{
          width: showSidebar ? "260px" : "0",
          backgroundColor: "white",
          borderRight: showSidebar ? "1px solid #f3d4e7" : "none",
          padding: showSidebar ? "25px" : "0",
          overflow: "hidden",
          transition: "width 0.3s ease, padding 0.3s ease",
          boxShadow: showSidebar ? "4px 0 20px rgba(31, 17, 71, 0.04)" : "none",
          display: "flex",
          flexDirection: "column",
          zIndex: 100,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
            cursor: "pointer",
            paddingBottom: "15px",
            borderBottom: "1px solid #fdf2f8",
          }}
          onClick={() => navigate("/dashboard")}
        >
          <img src={logo} alt="logo" style={{ width: "40px", height: "40px" }} />
          <h3 style={{ color: "#1f1147", margin: 0, fontWeight: "700", letterSpacing: "-0.5px" }}>
            CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
          {[
            { path: "/dashboard", icon: "🏠", label: "Dashboard" },
            { path: "/contacts", icon: "👥", label: "Trusted Contacts" },
            { path: "/incidents", icon: "📝", label: "Report Incident" },
            { path: "/checkins", icon: "📍", label: "Check-Ins" },
            { path: "/alerts", icon: "🔔", label: "Safety Alerts", active: true },
            { path: "/ai", icon: "🤖", label: "AI Safety Chat" },
          ].map((item) => (
            <span
              key={item.path}
              onClick={() => !item.active && navigate(item.path)}
              style={item.active ? activeNavStyle : navLinkStyle}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "#fdf2f8";
                  e.currentTarget.style.color = "#ec4899";
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#555";
                }
              }}
            >
              {item.icon} {item.label}
            </span>
          ))}
        </div>

        <div style={{ paddingTop: "20px", borderTop: "1px solid #f3d4e7" }}>
          <span
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#ef4444",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#fef2f2")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            🚪 Logout
          </span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "15px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
            marginBottom: "35px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span
              onClick={() => setShowSidebar(!showSidebar)}
              style={{ fontSize: "24px", cursor: "pointer", color: "#1f1147", padding: "5px" }}
            >
              ☰
            </span>
            <h4 style={{ margin: 0, color: "#6b6375", fontWeight: "500" }}>
              Incoming Safety Alerts
            </h4>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "600", color: "#1f1147", fontSize: "15px" }}>
                {user?.name || "Student User"}
              </div>
              <div style={{ fontSize: "12px", color: "#ec4899", fontWeight: "600" }}>
                Active Profile
              </div>
            </div>
            <div
              onClick={() => setShowProfile(!showProfile)}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(236,72,153,0.2)",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            {showProfile && (
              <div
                style={{
                  position: "absolute",
                  top: "60px",
                  right: "0",
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "15px",
                  boxShadow: "0 10px 25px rgba(31, 17, 71, 0.12)",
                  minWidth: "220px",
                  textAlign: "center",
                  zIndex: 1000,
                  border: "1px solid #f3d4e7",
                }}
              >
                <h3 style={{ margin: "0 0 5px", color: "#1f1147", fontSize: "16px" }}>{user?.name}</h3>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 15px" }}>{user?.email}</p>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "none",
                    background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {totalAlerts === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "80px 40px",
              textAlign: "center",
              border: "1px solid #f3d4e7",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <div style={{ fontSize: "60px" }}>🔔</div>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#1f1147" }}>
              No alerts received
            </h3>
            <p style={{ margin: 0, color: "#6b6375", maxWidth: "400px", fontSize: "14px" }}>
              When someone in your trusted circle sends an SOS or misses a check-in, their alerts will appear here.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
            {checkInNotifications.length > 0 && (
              <section>
                <div style={{ marginBottom: "20px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                    Check-In Alerts ({checkInNotifications.length})
                  </h2>
                  <p style={{ margin: 0, color: "#6b6375", fontSize: "14px" }}>
                    Notifications from missed or completed safety check-ins.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {checkInNotifications.map((n) => renderAlertCard(n, "checkin"))}
                </div>
              </section>
            )}

            {notifications.length > 0 && (
              <section>
                <div style={{ marginBottom: "20px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                    SOS Alerts ({notifications.length})
                  </h2>
                  <p style={{ margin: 0, color: "#6b6375", fontSize: "14px" }}>
                    Emergency SOS notifications from your trusted contacts.
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {notifications.map((n) => renderAlertCard(n, "sos"))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Alerts;
