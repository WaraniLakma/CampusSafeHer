import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();
  const [showSOSPopup, setShowSOSPopup] = useState(false);
  const [activeSOSId, setActiveSOSId] = useState(null);
  const [user, setUser] = useState(null);
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [stats, setStats] = useState({
    contacts: 0,
    incidents: 0,
    checkins: 0,
    alerts: 0,
  });

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [
        contactsRes,
        incidentsRes,
        checkinsRes,
        sosAlertsRes,
        checkinAlertsRes,
      ] = await Promise.all([
        API.get("/contacts", { headers }).catch(() => ({ data: { contacts: [] } })),
        API.get("/incidents", { headers }).catch(() => ({ data: { incidents: [] } })),
        API.get("/checkins", { headers }).catch(() => ({ data: { checkIns: [] } })),
        API.get("/sos/notifications", { headers }).catch(() => ({ data: { notifications: [] } })),
        API.get("/checkins/notifications", { headers }).catch(() => ({ data: { notifications: [] } })),
      ]);

      setStats({
        contacts: contactsRes.data.contacts?.length || 0,
        incidents: incidentsRes.data.incidents?.length || 0,
        checkins: checkinsRes.data.checkIns?.length || 0,
        alerts:
          (sosAlertsRes.data.notifications?.length || 0) +
          (checkinAlertsRes.data.notifications?.length || 0),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchDashboardStats();
  }, []);

  const handleSOS = () => {
    setIsSendingSOS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const token = localStorage.getItem("token");

          if (position.coords.accuracy > 1000) {
            alert(
              "Location accuracy is too low. Please move to an open area and try again."
            );
            setIsSendingSOS(false);
            return;
          }

          const res = await API.post(
            "/sos",
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setActiveSOSId(res.data.sos._id);
          alert(
            "🚨 SOS Alert Sent Successfully!\n\nYour current location has been shared with your trusted contacts."
          );
          setShowSOSPopup(false);
          fetchDashboardStats();
        } catch (error) {
          console.log(error);
          alert("Failed to send SOS alert. Please try again.");
        } finally {
          setIsSendingSOS(false);
        }
      },
      (error) => {
        console.log(error);
        setIsSendingSOS(false);
        alert("Unable to get your location. Please check your browser location permissions.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleSafeConfirm = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.patch(
        `/sos/${activeSOSId}/resolve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "✅ Safety confirmed. Trusted contacts can now see that you are safe."
      );
      setActiveSOSId(null);
      fetchDashboardStats();
    } catch (error) {
      console.log(error);
      alert("Failed to confirm safety status.");
    }
  };

  const userFirstName = user?.name
    ? user.name.split(" ")[0].charAt(0).toUpperCase() +
      user.name.split(" ")[0].slice(1).toLowerCase()
    : "Student";

  return (
    <DashboardLayout
      activeKey="dashboard"
      pageTitle="Personal Safety Hub"
      pageSubtitle="CampusSafeHer Command Center"
      user={user}
    >
      <style>{`
        .sos-beacon-btn {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sos-beacon-btn:hover {
          transform: scale(1.03);
        }
        .sos-beacon-btn:active {
          transform: scale(0.98);
        }
        .dashboard-stat-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .dashboard-stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 32px rgba(31, 17, 71, 0.08) !important;
        }
        .dashboard-quick-action {
          transition: all 0.2s ease;
        }
        .dashboard-quick-action:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(31, 17, 71, 0.08);
          border-color: #ec4899 !important;
        }
      `}</style>

      {/* SOS CONFIRMATION MODAL OVERLAY */}
      {showSOSPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 9, 38, 0.65)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
            animation: "modalBackdropFade 0.2s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "28px",
              padding: "36px 32px",
              maxWidth: "460px",
              width: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              border: "2px solid #fecaca",
              textAlign: "center",
              animation: "modalContentPop 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "24px",
                backgroundColor: "#fef2f2",
                color: "#dc2626",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
                margin: "0 auto 20px",
                boxShadow: "0 8px 20px rgba(239, 68, 68, 0.2)",
              }}
            >
              🚨
            </div>

            <h3
              style={{
                fontFamily: "var(--font-display)",
                color: "#991b1b",
                fontSize: "24px",
                fontWeight: "800",
                margin: "0 0 12px",
              }}
            >
              Trigger Emergency SOS?
            </h3>

            <p
              style={{
                color: "#475569",
                fontSize: "15px",
                lineHeight: "1.6",
                margin: "0 0 28px",
              }}
            >
              Your live GPS coordinates will be immediately broadcast to all your registered trusted contacts.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setShowSOSPopup(false)}
                disabled={isSendingSOS}
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1.5px solid #cbd5e1",
                  backgroundColor: "white",
                  color: "#475569",
                  fontWeight: "600",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSOS}
                disabled={isSendingSOS}
                style={{
                  flex: 1.4,
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "15px",
                  cursor: isSendingSOS ? "wait" : "pointer",
                  boxShadow: "0 6px 20px rgba(220, 38, 38, 0.35)",
                  opacity: isSendingSOS ? 0.75 : 1,
                }}
              >
                {isSendingSOS ? "Locating..." : "Confirm & Send SOS 🚨"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WELCOME BANNER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem, 3.5vw, 2.4rem)",
              color: "#1f1147",
              fontWeight: "800",
              margin: "0 0 6px",
            }}
          >
            Welcome Back, {userFirstName} 👋
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            Your personal campus safety center. Stay connected, protected, and vigilant.
          </p>
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: "white",
            padding: "8px 18px",
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(31, 17, 71, 0.04)",
            border: "1px solid #f3d4e7",
          }}
        >
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.25)",
            }}
          />
          <span style={{ fontSize: "13px", fontWeight: "700", color: "#1f1147" }}>
            Circle Active & Monitored
          </span>
        </div>
      </div>

      {/* MAIN TWO-PART GRID: SOS BEACON (HERO) + STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "28px",
          marginBottom: "36px",
          alignItems: "stretch",
        }}
      >
        {/* EMERGENCY SOS INTERACTIVE BEACON CARD */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "28px",
            padding: "40px 30px",
            boxShadow: "0 10px 30px rgba(31, 17, 71, 0.05)",
            border: activeSOSId ? "2px solid #86efac" : "1px solid #f3d4e7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              background: activeSOSId
                ? "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: activeSOSId ? "#15803d" : "#be185d",
              backgroundColor: activeSOSId ? "#f0fdf4" : "#fdf2f8",
              padding: "4px 12px",
              borderRadius: "20px",
              marginBottom: "24px",
              border: activeSOSId ? "1px solid #bbf7d0" : "1px solid #fbcfe8",
            }}
          >
            {activeSOSId ? "🚨 Active SOS Alerting" : "Instant Emergency Help"}
          </span>

          {/* THE TACTILE RADAR SOS BUTTON */}
          <button
            onClick={() => {
              if (activeSOSId) {
                handleSafeConfirm();
              } else {
                setShowSOSPopup(true);
              }
            }}
            className="sos-beacon-btn"
            style={{
              width: "190px",
              height: "190px",
              borderRadius: "50%",
              border: "none",
              background: activeSOSId
                ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                : "linear-gradient(135deg, #ef4444 0%, #ec4899 50%, #8b5cf6 100%)",
              color: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: activeSOSId
                ? "0 0 0 10px rgba(16, 185, 129, 0.2), 0 14px 35px rgba(16, 185, 129, 0.4)"
                : "0 0 0 12px rgba(239, 68, 68, 0.15), 0 16px 40px rgba(236, 72, 153, 0.45)",
              animation: activeSOSId ? "pulseGlow 2s infinite" : "sosWave 2.5s infinite",
              marginBottom: "24px",
            }}
          >
            <span style={{ fontSize: "52px", lineHeight: "1", marginBottom: "4px" }}>
              {activeSOSId ? "✅" : "🚨"}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "22px",
                fontWeight: "900",
                letterSpacing: "1px",
              }}
            >
              {activeSOSId ? "I'M SAFE" : "SEND SOS"}
            </span>
            <span style={{ fontSize: "11px", fontWeight: "600", opacity: 0.9 }}>
              {activeSOSId ? "Confirm Safety" : "Press for Alert"}
            </span>
          </button>

          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              maxWidth: "300px",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            {activeSOSId
              ? "Your SOS is currently broadcasting. Click 'I'm Safe' once you have reached safety."
              : "Tap the button to instantly transmit your live coordinates to registered emergency contacts."}
          </p>
        </div>

        {/* 4 STATS KPI CARDS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {/* CHECK-INS */}
          <div
            onClick={() => navigate("/checkins")}
            className="dashboard-stat-card"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
              color: "white",
              padding: "26px",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(124, 58, 237, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "28px" }}>📍</span>
              <span style={{ fontSize: "18px", opacity: 0.8 }}>➜</span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "44px",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  margin: "12px 0 2px",
                }}
              >
                {stats.checkins}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.92 }}>
                Safety Check-Ins
              </div>
            </div>
          </div>

          {/* INCOMING ALERTS */}
          <div
            onClick={() => navigate("/alerts")}
            className="dashboard-stat-card"
            style={{
              background: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
              color: "white",
              padding: "26px",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(236, 72, 153, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "28px" }}>🔔</span>
              <span style={{ fontSize: "18px", opacity: 0.8 }}>➜</span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "44px",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  margin: "12px 0 2px",
                }}
              >
                {stats.alerts}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.92 }}>
                Safety Alerts
              </div>
            </div>
          </div>

          {/* INCIDENT REPORTS */}
          <div
            onClick={() => navigate("/incidents")}
            className="dashboard-stat-card"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              color: "white",
              padding: "26px",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "28px" }}>📝</span>
              <span style={{ fontSize: "18px", opacity: 0.8 }}>➜</span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "44px",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  margin: "12px 0 2px",
                }}
              >
                {stats.incidents}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.92 }}>
                Incident Reports
              </div>
            </div>
          </div>

          {/* TRUSTED CONTACTS */}
          <div
            onClick={() => navigate("/contacts")}
            className="dashboard-stat-card"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
              color: "white",
              padding: "26px",
              borderRadius: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 10px 25px rgba(14, 165, 233, 0.25)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "28px" }}>👥</span>
              <span style={{ fontSize: "18px", opacity: 0.8 }}>➜</span>
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "44px",
                  fontWeight: "800",
                  lineHeight: "1.1",
                  margin: "12px 0 2px",
                }}
              >
                {stats.contacts}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.92 }}>
                Trusted Contacts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACCESS ACTION SHORTCUTS */}
      <div style={{ marginTop: "10px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "20px",
            fontWeight: "700",
            color: "#1f1147",
            marginBottom: "16px",
          }}
        >
          Quick Safety Actions
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "18px",
          }}
        >
          {/* ACTION 1: CONTACTS */}
          <button
            onClick={() => navigate("/contacts")}
            className="dashboard-quick-action"
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              border: "1.5px solid #f3d4e7",
              backgroundColor: "white",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              👥
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#1f1147", fontSize: "16px" }}>
                Manage Contacts
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Add or edit trusted circle
              </div>
            </div>
          </button>

          {/* ACTION 2: INCIDENTS */}
          <button
            onClick={() => navigate("/incidents")}
            className="dashboard-quick-action"
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              border: "1.5px solid #f3d4e7",
              backgroundColor: "white",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#f5f3ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              📝
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#1f1147", fontSize: "16px" }}>
                Report Incident
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                File confidential report
              </div>
            </div>
          </button>

          {/* ACTION 3: CHECKIN */}
          <button
            onClick={() => navigate("/checkins")}
            className="dashboard-quick-action"
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              border: "1.5px solid #f3d4e7",
              backgroundColor: "white",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              📍
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#1f1147", fontSize: "16px" }}>
                Journey Check-In
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                Set destination timer
              </div>
            </div>
          </button>

          {/* ACTION 4: AI */}
          <button
            onClick={() => navigate("/ai")}
            className="dashboard-quick-action"
            style={{
              padding: "20px 24px",
              borderRadius: "20px",
              border: "1.5px solid #f3d4e7",
              backgroundColor: "white",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              boxShadow: "0 4px 15px rgba(31, 17, 71, 0.03)",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "14px",
                backgroundColor: "#fff7ed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ fontWeight: "700", color: "#1f1147", fontSize: "16px" }}>
                Ask AI Assistant
              </div>
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                24/7 Safety guidance
              </div>
            </div>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
