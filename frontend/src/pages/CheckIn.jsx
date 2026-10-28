import { useEffect, useState } from "react";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function getStatusBadge(status) {
  const configs = {
    Active: {
      bg: "#dcfce7",
      color: "#15803d",
      border: "#86efac",
      label: "🟢 Active Journey",
      desc: "Awaiting your safe arrival at expected time.",
    },
    "First Reminder Sent": {
      bg: "#fef9c3",
      color: "#a16207",
      border: "#fde047",
      label: "🟡 1st Reminder",
      desc: "Expected time passed. Confirm your safety if you have arrived.",
    },
    "Second Reminder Sent": {
      bg: "#fef9c3",
      color: "#a16207",
      border: "#fde047",
      label: "🟡 2nd Reminder",
      desc: "Please complete your check-in immediately.",
    },
    Overdue: {
      bg: "#ffedd5",
      color: "#c2410c",
      border: "#fdba74",
      label: "🟠 Urgent Reminder",
      desc: "Trusted contacts will be notified in 5 seconds if unconfirmed.",
    },
    "Alert Sent": {
      bg: "#fee2e2",
      color: "#b91c1c",
      border: "#fca5a5",
      label: "🔴 Emergency Alert Sent",
      desc: "Trusted contacts have been notified with your GPS coordinates.",
    },
    "Safe Confirmed": {
      bg: "#dcfce7",
      color: "#15803d",
      border: "#86efac",
      label: "✅ Safety Confirmed",
      desc: "Safe arrival confirmed. Trusted contacts have been updated.",
    },
  };
  return (
    configs[status] || {
      bg: "#f1f5f9",
      color: "#475569",
      border: "#cbd5e1",
      label: status,
      desc: "",
    }
  );
}

function CheckIn() {
  const [checkIns, setCheckIns] = useState([]);
  const [destination, setDestination] = useState("");
  const [expectedArrivalTime, setExpectedArrivalTime] = useState("");
  const [reminderInterval, setReminderInterval] = useState(10);
  const [showAlertBanner, setShowAlertBanner] = useState(false);
  const [currentLatitude, setCurrentLatitude] = useState(null);
  const [currentLongitude, setCurrentLongitude] = useState(null);

  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const showNotification = (title, body) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

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

  const fetchCheckIns = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/checkins", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCheckIns(res.data.checkIns || []);

      res.data.checkIns?.forEach((checkIn) => {
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
        {
          destination,
          expectedArrivalTime: new Date(expectedArrivalTime),
          reminderInterval,
          currentLatitude,
          currentLongitude,
        },
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
      showNotification("✅ Safety Confirmed", "Trusted contacts have been notified that you arrived safely.");
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
    <DashboardLayout
      activeKey="checkins"
      pageTitle="Safety Check-Ins"
      pageSubtitle="Automated arrival timers & alerts"
      user={user}
      toast={toast}
      onDismissToast={() => setToast(null)}
    >
      <style>{`
        .checkin-card-modern {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .checkin-card-modern:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(31, 17, 71, 0.08) !important;
        }
      `}</style>

      {/* EMERGENCY HIGH-PRIORITY ALERT BANNER */}
      {showAlertBanner && (
        <div
          style={{
            backgroundColor: "#fef2f2",
            border: "2px solid #ef4444",
            padding: "20px 24px",
            marginBottom: "28px",
            borderRadius: "20px",
            boxShadow: "0 10px 25px rgba(239, 68, 68, 0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <span style={{ fontSize: "32px", lineHeight: "1" }}>🚨</span>
            <div>
              <h2
                style={{
                  margin: "0 0 6px",
                  color: "#991b1b",
                  fontSize: "19px",
                  fontWeight: "800",
                  fontFamily: "var(--font-display)",
                }}
              >
                Overdue Check-In Alert Broadcasted
              </h2>
              <p style={{ margin: "0 0 4px", color: "#b91c1c", fontWeight: "600", fontSize: "14px" }}>
                Trusted contacts have received an alert with your last reported GPS coordinates.
              </p>
              <p style={{ margin: 0, color: "#64748b", fontSize: "13.5px" }}>
                If you have arrived safely, click <strong>"Complete Check-In"</strong> below immediately to notify them of your safety.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAlertBanner(false)}
            style={{
              border: "none",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      )}

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
          Journey Safety Check-Ins
        </h1>
        <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
          Heading to the library, returning to your hostel, or walking across campus at night? Set a safety timer.
          If you don't check in by your expected arrival, your trusted circle is notified automatically.
        </p>
      </div>

      {/* TWO-COLUMN GRID: FORM LEFT, CHECK-IN HISTORY RIGHT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "32px",
          alignItems: "start",
        }}
      >
        {/* LEFT: CREATE NEW CHECK-IN FORM */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.04)",
            border: "1px solid #f3d4e7",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              📍
            </div>
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                Start New Check-In
              </h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                Active GPS coordinates will accompany your trip
              </p>
            </div>
          </div>

          <form onSubmit={createCheckIn} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* DESTINATION */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Destination
              </label>
              <input
                type="text"
                placeholder="e.g. Science Library, Dormitory 4B, Main Campus Gate"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            {/* EXPECTED ARRIVAL TIME */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                Expected Arrival Time
              </label>
              <input
                type="datetime-local"
                value={expectedArrivalTime}
                onChange={(e) => setExpectedArrivalTime(e.target.value)}
                required
                className="modern-input"
              />
            </div>

            {/* REMINDER INTERVAL */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                  Reminder Interval (Seconds)
                </label>
                <span style={{ fontSize: "12.5px", color: "#7c3aed", fontWeight: "700" }}>
                  Every {reminderInterval}s
                </span>
              </div>

              {/* QUICK INTERVAL PRESET PILLS */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                {[5, 10, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setReminderInterval(sec)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "10px",
                      border: reminderInterval === sec ? "2px solid #8b5cf6" : "1px solid #cbd5e1",
                      backgroundColor: reminderInterval === sec ? "#f5f3ff" : "white",
                      color: reminderInterval === sec ? "#7c3aed" : "#475569",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <input
                type="number"
                min="1"
                max="60"
                value={reminderInterval}
                onChange={(e) => setReminderInterval(Number(e.target.value))}
                className="modern-input"
              />
            </div>

            {/* GPS STATUS CALLOUT */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "12px",
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                fontSize: "13px",
                color: "#166534",
              }}
            >
              <span>🛰️</span>
              <span>
                {currentLatitude && currentLongitude
                  ? `GPS coordinates tracked (${currentLatitude.toFixed(3)}, ${currentLongitude.toFixed(3)})`
                  : "GPS location active & monitored"}
              </span>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "14px",
                fontSize: "15.5px",
                fontWeight: "700",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.75 : 1,
              }}
            >
              {isSubmitting ? "Activating Check-In..." : "📍 Activate Check-In"}
            </button>
          </form>
        </div>

        {/* RIGHT: CHECK-INS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                margin: "0 0 4px",
                fontSize: "20px",
                fontWeight: "700",
                color: "#1f1147",
              }}
            >
              Your Safety Check-Ins ({sortedCheckIns.length})
            </h2>
            <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
              Monitor active timers and completed safe arrivals
            </p>
          </div>

          {sortedCheckIns.length === 0 ? (
            /* EMPTY STATE */
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "24px",
                padding: "60px 30px",
                textAlign: "center",
                border: "1px solid #f3d4e7",
                boxShadow: "0 10px 30px rgba(31, 17, 71, 0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "24px",
                  backgroundColor: "#fdf2f8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "36px",
                }}
              >
                📍
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1f1147",
                }}
              >
                No active check-ins
              </h3>
              <p style={{ margin: 0, color: "#64748b", maxWidth: "340px", fontSize: "14px", lineHeight: "1.6" }}>
                Create a check-in when heading somewhere on campus. Your trusted contacts will know you arrived safely.
              </p>
            </div>
          ) : (
            /* LIST OF CHECK-IN CARDS */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {sortedCheckIns.map((checkIn) => {
                const badge = getStatusBadge(checkIn.status);
                const isOverdueOrAlert =
                  checkIn.status === "Overdue" || checkIn.status === "Alert Sent";

                return (
                  <div
                    key={checkIn._id}
                    className="checkin-card-modern"
                    style={{
                      backgroundColor: "white",
                      borderRadius: "22px",
                      padding: "24px",
                      boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
                      border: `1.5px solid ${badge.border || "#f3d4e7"}`,
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      position: "relative",
                    }}
                  >
                    {/* CARD HEADER */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "22px" }}>📍</span>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            fontWeight: "800",
                            color: "#1f1147",
                            fontFamily: "var(--font-display)",
                          }}
                        >
                          {checkIn.destination}
                        </h3>
                      </div>

                      <span
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "700",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* EXPECTED TIME & STATUS DESC */}
                    <div style={{ fontSize: "13.5px", color: "#475569" }}>
                      🕐 <strong>Expected:</strong>{" "}
                      {new Date(checkIn.expectedArrivalTime).toLocaleString()}
                    </div>

                    {badge.desc && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: isOverdueOrAlert ? "#991b1b" : "#475569",
                          backgroundColor: isOverdueOrAlert ? "#fef2f2" : "#f8fafc",
                          padding: "8px 14px",
                          borderRadius: "10px",
                          lineHeight: "1.5",
                        }}
                      >
                        {badge.desc}
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginTop: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      {!checkIn.checkedIn && (
                        <button
                          onClick={() => completeCheckIn(checkIn._id)}
                          style={{
                            padding: "10px 20px",
                            borderRadius: "12px",
                            border: "none",
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            color: "white",
                            fontWeight: "700",
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.28)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span>✅ I've Arrived Safely</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteCheckIn(checkIn._id)}
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
                        <span>🗑 Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CheckIn;
