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

function getStatusBadge(status) {
  const configs = {
    Active: { bg: "#dcfce7", color: "#15803d", label: "🟢 Active", desc: "Awaiting expected arrival time." },
    "First Reminder Sent": { bg: "#fef9c3", color: "#a16207", label: "🟡 1st Reminder", desc: "Please complete your check-in if you have arrived safely." },
    "Second Reminder Sent": { bg: "#fef9c3", color: "#a16207", label: "🟡 2nd Reminder", desc: "Please complete your check-in if you have arrived safely." },
    Overdue: { bg: "#ffedd5", color: "#c2410c", label: "🟠 Last Reminder", desc: "After 5 seconds, trusted contacts will be notified." },
    "Alert Sent": { bg: "#fee2e2", color: "#b91c1c", label: "🔴 Alert Sent", desc: "Trusted contacts have been notified." },
    "Safe Confirmed": { bg: "#dcfce7", color: "#15803d", label: "✅ Safety Confirmed", desc: "Trusted contacts will be notified that you arrived safely." },
  };
  return configs[status] || { bg: "#f1f5f9", color: "#475569", label: status, desc: "" };
}

function CheckIn() {
  const navigate = useNavigate();
  const [checkIns, setCheckIns] = useState([]);
  const [destination, setDestination] = useState("");
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
  const [reminderInterval, setReminderInterval] = useState(10);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);

  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();

    if ("Notification" in window) {
      Notification.requestPermission();
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
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
        if (!checkIn.checkedIn && checkIn.status !== "Alert Sent") {
          updateLocation(checkIn._id);
        }
      });
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(locationInterval);
    };
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

  const showNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const fetchCheckIns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/checkins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCheckIns(res.data.checkIns);

      res.data.checkIns.forEach((checkIn) => {
        const notificationKey = `${checkIn._id}-${checkIn.status}`;

        if (localStorage.getItem(notificationKey)) {
          return;
        }

        if (checkIn.status === "First Reminder Sent") {
          showNotification("🟡 CampusSafeHer 1st Reminder", "Your expected arrival time has passed.");
          localStorage.setItem(notificationKey, "shown");
        }
        if (checkIn.status === "Second Reminder Sent") {
          showNotification("🟡 CampusSafeHer 2nd Reminder", "You still have not completed your safety check-in.");
          localStorage.setItem(notificationKey, "shown");
        }
        if (checkIn.status === "Overdue") {
          showNotification("🟠 CampusSafeHer Last Reminder", "Please confirm your safety immediately.");
          localStorage.setItem(notificationKey, "shown");
        }
        if (checkIn.status === "Alert Sent") {
          setShowAlertBanner(true);
          if (!localStorage.getItem(notificationKey)) {
            showNotification("🔴 CampusSafeHer Alert", "Trusted contacts have been notified.");
            localStorage.setItem(notificationKey, "shown");
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLocation = async (checkInId) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const token = localStorage.getItem("token");
        await API.patch(
          `/checkins/location/${checkInId}`,
          {
            lastKnownLatitude: position.coords.latitude,
            lastKnownLongitude: position.coords.longitude,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
      }
    });
  };

  const createCheckIn = async (e) => {
    e.preventDefault();

    if (!destination.trim() || !expectedArrivalTime) {
      showToast("Please fill in destination and expected arrival time.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/checkins",
        { destination, expectedArrivalTime, reminderInterval, currentLatitude, currentLongitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDestination("");
      setExpectedArrivalTime("");
      showToast("Check-in created successfully!", "success");
      fetchCheckIns();
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to create check-in.", "error");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeCheckIn = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(`/checkins/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      showNotification("✅ Safety Confirmed", "Trusted contacts will be notified that you arrived safely.");
      showToast("Safety confirmed! Trusted contacts have been notified.", "success");
      fetchCheckIns();
    } catch (error) {
      showToast("Failed to complete check-in.", "error");
      console.log(error);
    }
  };

  const deleteCheckIn = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/checkins/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      showToast("Check-in removed successfully.", "success");
      fetchCheckIns();
    } catch (error) {
      showToast("Failed to delete check-in.", "error");
      console.log(error);
    }
  };

  const sortedCheckIns = [...checkIns].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

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
        .checkin-grid-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .checkin-grid-card:hover {
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
        .input-field {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .input-field:focus {
          border-color: #ec4899 !important;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
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
            { path: "/checkins", icon: "📍", label: "Check-Ins", active: true },
            { path: "/alerts", icon: "🔔", label: "Safety Alerts" },
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
              Safety Check-In Center
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

        {showAlertBanner && (
          <div
            style={{
              backgroundColor: "white",
              border: "2px solid #ec4899",
              padding: "25px 30px",
              marginBottom: "30px",
              borderRadius: "20px",
              boxShadow: "0 8px 20px rgba(236,72,153,0.15)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "20px",
            }}
          >
            <div>
              <h2 style={{ margin: "0 0 10px", color: "#b91c1c", fontSize: "20px" }}>🚨 Safety Alert</h2>
              <p style={{ margin: "0 0 6px", color: "#1f1147" }}>Trusted contacts have been notified.</p>
              <p style={{ margin: "0 0 6px", color: "#6b6375", fontSize: "14px" }}>Last known location shared.</p>
              <p style={{ margin: 0, color: "#6b6375", fontSize: "14px" }}>
                If you have arrived safely, please complete your check-in.
              </p>
            </div>
            <button
              onClick={() => setShowAlertBanner(false)}
              className="btn-interact"
              style={{
                border: "none",
                backgroundColor: "#fdf2f8",
                color: "#ec4899",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: "16px",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "35px",
            alignItems: "start",
          }}
        >
          {/* FORM CARD */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              boxShadow: "0 4px 25px rgba(31, 17, 71, 0.02)",
              border: "1px solid #f3d4e7",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "25px" }}>
              <span style={{ fontSize: "28px" }}>📍</span>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                New Check-In
              </h2>
            </div>
            <p style={{ fontSize: "14px", color: "#6b6375", margin: "0 0 25px" }}>
              Set your destination and expected arrival time. We'll remind you to confirm your safety, and alert trusted contacts if you don't check in.
            </p>

            <form onSubmit={createCheckIn} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Library, Dorm Room B"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="input-field"
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Expected Arrival Time
                </label>
                <input
                  type="datetime-local"
                  value={expectedArrivalTime}
                  onChange={(e) => setExpectedArrivalTime(e.target.value)}
                  className="input-field"
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    outline: "none",
                  }}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#475569" }}>
                  Reminder Interval (seconds)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={reminderInterval}
                  onChange={(e) => setReminderInterval(Number(e.target.value))}
                  className="input-field"
                  style={{
                    padding: "14px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "15px",
                    outline: "none",
                  }}
                />
                <p style={{ margin: 0, fontSize: "13px", color: "#6b6375" }}>
                  Reminders every {reminderInterval} second(s)
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-interact"
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 15px rgba(236,72,153,0.25)",
                  marginTop: "10px",
                }}
              >
                {isSubmitting ? "Creating..." : "📍 Create Check-In"}
              </button>
            </form>
          </div>

          {/* CHECK-IN HISTORY */}
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <div>
              <h2 style={{ margin: "0 0 5px", fontSize: "22px", fontWeight: "700", color: "#1f1147" }}>
                Your Check-Ins ({sortedCheckIns.length})
              </h2>
              <p style={{ margin: 0, color: "#6b6375", fontSize: "14px" }}>
                Track active and past safety check-ins.
              </p>
            </div>

            {sortedCheckIns.length === 0 ? (
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "20px",
                  padding: "60px 40px",
                  textAlign: "center",
                  border: "1px solid #f3d4e7",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div style={{ fontSize: "50px" }}>📍</div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#1f1147" }}>
                  No check-ins yet
                </h3>
                <p style={{ margin: 0, color: "#6b6375", maxWidth: "320px", fontSize: "14px" }}>
                  Create a check-in when heading somewhere so your trusted contacts know you're safe.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {sortedCheckIns.map((checkIn) => {
                  const badge = getStatusBadge(checkIn.status);
                  return (
                    <div
                      key={checkIn._id}
                      className="checkin-grid-card"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "20px",
                        padding: "24px",
                        boxShadow: "0 4px 15px rgba(31, 17, 71, 0.01)",
                        border: "1px solid #f3d4e7",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                        <h3 style={{ margin: 0, fontSize: "17px", fontWeight: "700", color: "#1f1147" }}>
                          {checkIn.destination}
                        </h3>
                        <span
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <p style={{ margin: "0 0 6px", fontSize: "14px", color: "#64748b" }}>
                        🕐 Expected: {new Date(checkIn.expectedArrivalTime).toLocaleString("en-LK", {
                            timeZone: "Asia/Colombo",
                            })}
                      </p>
                      {badge.desc && (
                        <p style={{ margin: "0 0 12px", fontSize: "13px", color: "#6b6375" }}>{badge.desc}</p>
                      )}
                      <p style={{ margin: "0 0 16px", fontSize: "13px", color: "#94a3b8" }}>
                        Checked in: {checkIn.checkedIn ? "Yes ✅" : "No"}
                      </p>

                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {!checkIn.checkedIn && (
                          <button
                            onClick={() => completeCheckIn(checkIn._id)}
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
                            ✅ Complete Check-In
                          </button>
                        )}
                        <button
                          onClick={() => deleteCheckIn(checkIn._id)}
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
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckIn;
