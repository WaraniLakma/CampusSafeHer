import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

function AdminDashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [anonymityFilter, setAnonymityFilter] = useState("All");
  const [toast, setToast] = useState(null);

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

  const fetchAllIncidents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/incidents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncidents(res.data.incidents || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchAllIncidents();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await API.patch(
        `/admin/incidents/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      showToast(`Incident status updated to "${status}"!`, "success");
      fetchAllIncidents();
    } catch (error) {
      console.log(error);
      showToast("Failed to update status. Please try again.", "error");
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const formatDate = (dateStr) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  // Stats calculation
  const totalCount = incidents.length;
  const pendingCount = incidents.filter((i) => i.status === "Pending").length;
  const underReviewCount = incidents.filter((i) => i.status === "Under Review").length;
  const resolvedCount = incidents.filter((i) => i.status === "Resolved").length;

  // Filtering
  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus = statusFilter === "All" || incident.status === statusFilter;
    const matchesAnonymity =
      anonymityFilter === "All" ||
      (anonymityFilter === "Anonymous" && incident.isAnonymous) ||
      (anonymityFilter === "Public" && !incident.isAnonymous);

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      incident.category?.toLowerCase().includes(searchLower) ||
      incident.description?.toLowerCase().includes(searchLower) ||
      incident.location?.toLowerCase().includes(searchLower) ||
      (!incident.isAnonymous && incident.user?.name?.toLowerCase().includes(searchLower)) ||
      (!incident.isAnonymous && incident.user?.email?.toLowerCase().includes(searchLower));

    return matchesStatus && matchesAnonymity && matchesSearch;
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#fff7fb",
        fontFamily: "var(--font-main)",
        color: "#1f1147",
        position: "relative",
        backgroundImage: `url(${dashboardBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{`
        .admin-incident-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .admin-incident-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(31, 17, 71, 0.08) !important;
        }
        .status-btn-choice {
          transition: all 0.2s ease;
        }
        .status-btn-choice:hover:not(:disabled) {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
      `}</style>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            background:
              toast.type === "success"
                ? "linear-gradient(135deg, #059669, #10b981)"
                : "linear-gradient(135deg, #dc2626, #ef4444)",
            color: "white",
            padding: "14px 22px",
            borderRadius: "14px",
            boxShadow: "0 14px 35px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          <span>{toast.type === "success" ? "✅" : "⚠️"}</span>
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP NAVIGATION BAR */}
      <header
        style={{
          margin: "20px 24px 0",
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderRadius: "20px",
          padding: "14px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 6px 20px rgba(31, 17, 71, 0.04)",
          border: "1px solid rgba(243, 212, 231, 0.8)",
          position: "sticky",
          top: "20px",
          zIndex: 100,
        }}
      >
        {/* LOGO & TITLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(236, 72, 153, 0.15)",
              }}
            >
              <img
                src={logo}
                alt="CampusSafeHer logo"
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  color: "#1f1147",
                  fontFamily: "var(--font-display)",
                }}
              >
                CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
              </div>
              <div style={{ fontSize: "11px", color: "#ec4899", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                🛡️ Security Administration Console
              </div>
            </div>
          </Link>
        </div>

        {/* ADMIN PROFILE & LOGOUT */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", position: "relative" }}>
          <div
            style={{
              display: "none",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              fontSize: "12.5px",
              fontWeight: "600",
              color: "#15803d",
            }}
            className="desktop-live-pill"
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                display: "inline-block",
                boxShadow: "0 0 0 3px rgba(34, 197, 94, 0.25)",
              }}
            />
            <span>Incident Dispatch Online</span>
          </div>

          <div
            onClick={() => setShowProfile(!showProfile)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "4px 10px 4px 4px",
              borderRadius: "30px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1f1147, #3b207e)",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "800",
                fontSize: "15px",
                boxShadow: "0 2px 8px rgba(31, 17, 71, 0.25)",
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "13px", fontWeight: "700", color: "#1f1147" }}>
                {user?.name || "Security Admin"}
              </div>
              <div style={{ fontSize: "11px", color: "#ec4899", fontWeight: "600" }}>
                Campus Officer
              </div>
            </div>
          </div>

          {/* PROFILE DROPDOWN */}
          {showProfile && (
            <div
              style={{
                position: "absolute",
                top: "54px",
                right: "0",
                backgroundColor: "white",
                padding: "22px",
                borderRadius: "20px",
                boxShadow: "0 18px 40px rgba(31, 17, 71, 0.12)",
                minWidth: "240px",
                textAlign: "center",
                zIndex: 1000,
                border: "1px solid #f3d4e7",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1f1147, #3b207e)",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto 12px",
                  fontWeight: "bold",
                  fontSize: "22px",
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>

              <h3 style={{ margin: "0 0 4px", color: "#1f1147", fontSize: "16px", fontWeight: "700" }}>
                {user?.name || "System Admin"}
              </h3>

              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px" }}>
                {user?.email || "admin@campussafeher.edu"}
              </p>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/admin-login", { replace: true });
                }}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "13.5px",
                }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main
        style={{
          flex: 1,
          padding: "24px",
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* WELCOME BANNER */}
        <div style={{ marginBottom: "32px", textAlign: "left" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.6vw, 2.6rem)",
              color: "#1f1147",
              fontWeight: "800",
              margin: "0 0 6px",
            }}
          >
            Incident Command Center
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            Monitor reported campus safety issues, process incident investigations, and update resolution states in real time.
          </p>
        </div>

        {/* METRICS STATS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "32px",
          }}
        >
          {/* TOTAL */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
              border: "1px solid #f3d4e7",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Reports
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "38px", fontWeight: "800", color: "#1f1147", margin: "4px 0 0" }}>
                {totalCount}
              </div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#fdf2f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
              📋
            </div>
          </div>

          {/* PENDING */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
              border: "1.5px solid #fecaca",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "13px", color: "#dc2626", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Pending Review
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "38px", fontWeight: "800", color: "#dc2626", margin: "4px 0 0" }}>
                {pendingCount}
              </div>
            </div>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "16px",
                backgroundColor: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                boxShadow: pendingCount > 0 ? "0 0 0 4px rgba(239, 68, 68, 0.2)" : "none",
              }}
            >
              ⚠️
            </div>
          </div>

          {/* UNDER REVIEW */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
              border: "1.5px solid #bae6fd",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "13px", color: "#0284c7", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                In Progress
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "38px", fontWeight: "800", color: "#0284c7", margin: "4px 0 0" }}>
                {underReviewCount}
              </div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#f0f9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
              🔍
            </div>
          </div>

          {/* RESOLVED */}
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "22px",
              padding: "24px",
              boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
              border: "1.5px solid #bbf7d0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span style={{ fontSize: "13px", color: "#16a34a", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Resolved Cases
              </span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "38px", fontWeight: "800", color: "#16a34a", margin: "4px 0 0" }}>
                {resolvedCount}
              </div>
            </div>
            <div style={{ width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
              ✅
            </div>
          </div>
        </div>

        {/* FILTERS AND SEARCH TOOLBAR */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "24px",
            padding: "20px 24px",
            boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
            border: "1px solid #f3d4e7",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "18px",
          }}
        >
          {/* STATUS TABS */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#f8fafc",
              padding: "5px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              gap: "4px",
            }}
          >
            {["All", "Pending", "Under Review", "Resolved"].map((status) => {
              const count =
                status === "All"
                  ? totalCount
                  : status === "Pending"
                  ? pendingCount
                  : status === "Under Review"
                  ? underReviewCount
                  : resolvedCount;

              const isActive = statusFilter === status;

              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  style={{
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "13.5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: isActive ? "#ffffff" : "transparent",
                    color: isActive ? "#ec4899" : "#64748b",
                    boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>{status}</span>
                  <span
                    style={{
                      backgroundColor: isActive ? "#fdf2f8" : "#e2e8f0",
                      color: isActive ? "#ec4899" : "#64748b",
                      padding: "2px 8px",
                      borderRadius: "20px",
                      fontSize: "11px",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH & ANONYMITY CONTROLS */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexGrow: 1, justifyContent: "flex-end" }}>
            <div style={{ position: "relative", minWidth: "260px", maxWidth: "380px", flexGrow: 1 }}>
              <input
                type="text"
                placeholder="🔍 Search category, description, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input"
                style={{ padding: "10px 14px", fontSize: "14px" }}
              />
            </div>

            <select
              value={anonymityFilter}
              onChange={(e) => setAnonymityFilter(e.target.value)}
              className="modern-input"
              style={{ width: "auto", minWidth: "160px", padding: "10px 14px", fontSize: "14px", cursor: "pointer" }}
            >
              <option value="All">🛡️ All Reports</option>
              <option value="Anonymous">🕵️ Anonymous Only</option>
              <option value="Public">👤 Public Submissions</option>
            </select>
          </div>
        </div>

        {/* INCIDENT CARDS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredIncidents.length === 0 ? (
            /* EMPTY FILTER STATE */
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "24px",
                padding: "60px 30px",
                textAlign: "center",
                border: "1px solid #f3d4e7",
                boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <div style={{ fontSize: "40px" }}>🛡️</div>
              <h3 style={{ margin: 0, fontSize: "19px", fontWeight: "700", color: "#1f1147" }}>
                No incident reports found
              </h3>
              <p style={{ margin: 0, color: "#64748b", maxWidth: "360px", fontSize: "14px" }}>
                No reports match your current filter settings. Try clearing your search keyword or switching status tabs.
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              let statusBorder = "#f59e0b";
              let statusBg = "#fef3c7";
              let statusColor = "#b45309";

              if (incident.status === "Under Review") {
                statusBorder = "#3b82f6";
                statusBg = "#dbeafe";
                statusColor = "#1d4ed8";
              } else if (incident.status === "Resolved") {
                statusBorder = "#10b981";
                statusBg = "#d1fae5";
                statusColor = "#047857";
              }

              return (
                <div
                  key={incident._id}
                  className="admin-incident-card"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "24px",
                    padding: "28px",
                    boxShadow: "0 6px 20px rgba(31, 17, 71, 0.03)",
                    border: "1px solid #f3d4e7",
                    borderLeft: `6px solid ${statusBorder}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                    textAlign: "left",
                  }}
                >
                  {/* CARD HEADER */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                      <span
                        style={{
                          backgroundColor: "#fdf2f8",
                          color: "#be185d",
                          fontWeight: "800",
                          fontSize: "12.5px",
                          padding: "5px 14px",
                          borderRadius: "20px",
                          letterSpacing: "0.5px",
                          textTransform: "uppercase",
                        }}
                      >
                        {incident.category}
                      </span>

                      <span style={{ fontSize: "13.5px", color: "#64748b" }}>
                        📅 Reported on {formatDate(incident.createdAt)}
                      </span>
                    </div>

                    <span
                      style={{
                        backgroundColor: statusBg,
                        color: statusColor,
                        padding: "5px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "800",
                        textTransform: "uppercase",
                        letterSpacing: "0.4px",
                      }}
                    >
                      ● {incident.status}
                    </span>
                  </div>

                  {/* INCIDENT DETAILS */}
                  <div>
                    <h3
                      style={{
                        margin: "0 0 8px",
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "#1f1147",
                        lineHeight: "1.5",
                      }}
                    >
                      {incident.description}
                    </h3>

                    <div style={{ fontSize: "14px", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                      📍 <strong>Location:</strong> {incident.location}
                    </div>
                  </div>

                  {/* ATTACHMENT DISPLAY */}
                  {incident.attachment && (
                    <div
                      style={{
                        padding: "14px 18px",
                        borderRadius: "14px",
                        backgroundColor: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        width: "fit-content",
                        maxWidth: "100%",
                      }}
                    >
                      {incident.attachment.startsWith("data:image") ? (
                        <a href={incident.attachment} target="_blank" rel="noopener noreferrer">
                          <img
                            src={incident.attachment}
                            alt="Attachment evidence"
                            style={{
                              width: "48px",
                              height: "48px",
                              borderRadius: "10px",
                              objectFit: "cover",
                              cursor: "pointer",
                              border: "1px solid #cbd5e1",
                            }}
                          />
                        </a>
                      ) : (
                        <span style={{ fontSize: "28px" }}>📄</span>
                      )}
                      <div>
                        <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#1f1147" }}>
                          {incident.attachmentName || "Attached File Evidence"}
                        </div>
                        <a
                          href={incident.attachment}
                          download={incident.attachmentName || "incident-file"}
                          style={{
                            fontSize: "12.5px",
                            color: "#ec4899",
                            textDecoration: "underline",
                            fontWeight: "600",
                          }}
                        >
                          View / Download Evidence
                        </a>
                      </div>
                    </div>
                  )}

                  {/* FOOTER: REPORTER DETAILS + STATUS ACTION CHANGER */}
                  <div
                    style={{
                      paddingTop: "16px",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "16px",
                    }}
                  >
                    {/* REPORTER INFO */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "#64748b" }}>
                      {incident.isAnonymous ? (
                        <span
                          style={{
                            backgroundColor: "#f1f5f9",
                            color: "#475569",
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontWeight: "700",
                          }}
                        >
                          🕵️ Anonymous Submission (Identity Protected)
                        </span>
                      ) : (
                        <span>
                          👤 Reported by: <strong>{incident.user?.name || "Student"}</strong> ({incident.user?.email || "Email undisclosed"})
                        </span>
                      )}
                    </div>

                    {/* STATUS CHANGER BUTTON GROUP */}
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <span style={{ fontSize: "12.5px", color: "#64748b", fontWeight: "600", marginRight: "4px" }}>
                        Update State:
                      </span>

                      {["Pending", "Under Review", "Resolved"].map((stat) => {
                        const isCurrent = incident.status === stat;
                        let activeBg = "#f59e0b";
                        if (stat === "Under Review") activeBg = "#3b82f6";
                        if (stat === "Resolved") activeBg = "#10b981";

                        return (
                          <button
                            key={stat}
                            onClick={() => updateStatus(incident._id, stat)}
                            disabled={isCurrent}
                            className="status-btn-choice"
                            style={{
                              padding: "7px 14px",
                              borderRadius: "10px",
                              border: isCurrent ? "none" : "1px solid #cbd5e1",
                              backgroundColor: isCurrent ? activeBg : "white",
                              color: isCurrent ? "white" : "#475569",
                              fontWeight: "700",
                              fontSize: "12px",
                              cursor: isCurrent ? "default" : "pointer",
                              boxShadow: isCurrent ? "0 2px 8px rgba(0,0,0,0.12)" : "none",
                            }}
                          >
                            {stat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
