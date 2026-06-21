import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

function AdminDashboard() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [anonymityFilter, setAnonymityFilter] = useState("All");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchAllIncidents();
  }, []);

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

  // Helper to format Date nicely
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

  // Calculate dynamic stats from all incidents
  const totalCount = incidents.length;
  const pendingCount = incidents.filter((i) => i.status === "Pending").length;
  const underReviewCount = incidents.filter((i) => i.status === "Under Review").length;
  const resolvedCount = incidents.filter((i) => i.status === "Resolved").length;

  // Filtered incidents logic
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
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(135deg,#fff1f8,#fff7fd)",
        fontFamily: "var(--sans)",
        color: "#1f1147",
        position: "relative",
      }}
    >
      {/* Dynamic styles insertion for CSS transitions and keyframes */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
        }
        .pulse-badge {
          animation: pulse 2s infinite;
        }
        .incident-card {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .incident-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(31, 17, 71, 0.08) !important;
        }
        .btn-action {
          transition: all 0.2s ease;
        }
        .btn-action:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }
        .btn-action:active {
          transform: translateY(0);
        }
        .tab-button {
          transition: all 0.2s ease;
        }
        .tab-button:hover {
          background-color: #fdf2f8;
        }
      `}</style>

      {/* TOAST MESSAGE */}
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
            transition: "all 0.3s ease",
          }}
        >
          <span>{toast.type === "success" ? "✅" : "❌"}</span>
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
        {/* LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "45px",
            cursor: "pointer",
            paddingBottom: "15px",
            borderBottom: "1px solid #fdf2f8",
          }}
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" style={{ width: "40px", height: "40px" }} />
          <h3 style={{ color: "#1f1147", margin: 0, fontWeight: "700", letterSpacing: "-0.5px" }}>
            CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
          </h3>
        </div>

        {/* NAVIGATION LINKS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flexGrow: 1 }}>
          <span
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#ec4899",
              fontWeight: "600",
              backgroundColor: "#fdf2f8",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            🛡️ Admin Control
          </span>

          <span
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "14px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              color: "#555",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fdf2f8";
              e.currentTarget.style.color = "#ec4899";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#555";
            }}
          >
            👤 User Dashboard
          </span>
        </div>

        {/* SIDEBAR LOGOUT */}
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
            🚪 Sign Out
          </span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
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
              style={{
                fontSize: "24px",
                cursor: "pointer",
                color: "#1f1147",
                padding: "5px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ☰
            </span>
            <h4 style={{ margin: 0, color: "#6b6375", fontWeight: "500" }}>
              Admin Portal / Dashboard
            </h4>
          </div>

          {/* ADMIN PROFILE */}
          <div style={{ display: "flex", alignItems: "center", gap: "15px", position: "relative" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: "600", color: "#1f1147", fontSize: "15px" }}>
                {user?.name || "System Admin"}
              </div>
              <div style={{ fontSize: "12px", color: "#ec4899", fontWeight: "600" }}>
                Campus Security
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
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
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
                <div
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#8b5cf6,#ec4899)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 10px",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <h3 style={{ margin: "0 0 5px", color: "#1f1147", fontSize: "16px" }}>
                  {user?.name}
                </h3>
                <p style={{ fontSize: "13px", color: "#666", margin: "0 0 15px" }}>
                  {user?.email}
                </p>
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

        {/* WELCOME BANNER */}
        <div style={{ marginBottom: "35px" }}>
          <h1
            style={{
              fontSize: "36px",
              color: "#1f1147",
              margin: "0 0 8px",
              fontWeight: "700",
              letterSpacing: "-1px",
              textAlign: "left",
            }}
          >
            Incident Center
          </h1>
          <p style={{ color: "#6b6375", fontSize: "16px", margin: 0, textAlign: "left" }}>
            Monitor reported campus safety issues, process reviews, and dispatch support status updates.
          </p>
        </div>

        {/* METRICS STATS CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          {/* TOTAL */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(31, 17, 71, 0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #f3d4e7",
            }}
          >
            <div>
              <span style={{ fontSize: "14px", color: "#6b6375", fontWeight: "600" }}>
                Total Reports
              </span>
              <h2 style={{ fontSize: "36px", margin: "5px 0 0", color: "#1f1147", fontWeight: "700" }}>
                {totalCount}
              </h2>
            </div>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
              }}
            >
              📋
            </div>
          </div>

          {/* PENDING */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(31, 17, 71, 0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #fde8e8",
            }}
          >
            <div>
              <span style={{ fontSize: "14px", color: "#ef4444", fontWeight: "600" }}>
                Pending Review
              </span>
              <h2 style={{ fontSize: "36px", margin: "5px 0 0", color: "#ef4444", fontWeight: "700" }}>
                {pendingCount}
              </h2>
            </div>
            <div
              className={pendingCount > 0 ? "pulse-badge" : ""}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                backgroundColor: "#fdf2f2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
                border: pendingCount > 0 ? "2px solid #f87171" : "none",
              }}
            >
              ⚠️
            </div>
          </div>

          {/* UNDER REVIEW */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(31, 17, 71, 0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #e0f2fe",
            }}
          >
            <div>
              <span style={{ fontSize: "14px", color: "#0284c7", fontWeight: "600" }}>
                In Progress
              </span>
              <h2 style={{ fontSize: "36px", margin: "5px 0 0", color: "#0284c7", fontWeight: "700" }}>
                {underReviewCount}
              </h2>
            </div>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                backgroundColor: "#f0f9ff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
              }}
            >
              🔍
            </div>
          </div>

          {/* RESOLVED */}
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(31, 17, 71, 0.02)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #d1fae5",
            }}
          >
            <div>
              <span style={{ fontSize: "14px", color: "#059669", fontWeight: "600" }}>
                Resolved Cases
              </span>
              <h2 style={{ fontSize: "36px", margin: "5px 0 0", color: "#059669", fontWeight: "700" }}>
                {resolvedCount}
              </h2>
            </div>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "12px",
                backgroundColor: "#ecfdf5",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "24px",
              }}
            >
              ✅
            </div>
          </div>
        </div>

        {/* FILTERS AND SEARCH PANEL */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "20px",
            padding: "25px",
            boxShadow: "0 4px 20px rgba(31, 17, 71, 0.02)",
            border: "1px solid #f3d4e7",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            {/* LEFT: STATUS TABS */}
            <div
              style={{
                display: "flex",
                backgroundColor: "#f8fafc",
                padding: "6px",
                borderRadius: "14px",
                gap: "5px",
                border: "1px solid #cbd5e1",
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
                    className="tab-button"
                    style={{
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "600",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: isActive ? "white" : "transparent",
                      color: isActive ? "#ec4899" : "#64748b",
                      boxShadow: isActive ? "0 2px 8px rgba(0, 0, 0, 0.05)" : "none",
                    }}
                  >
                    <span>{status}</span>
                    <span
                      style={{
                        backgroundColor: isActive ? "#fdf2f8" : "#e2e8f0",
                        color: isActive ? "#ec4899" : "#64748b",
                        padding: "2px 8px",
                        borderRadius: "20px",
                        fontSize: "12px",
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: SEARCH AND ANONYMITY FILTER */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", flexGrow: 1, justifyContent: "flex-end" }}>
              <div style={{ position: "relative", minWidth: "260px", flexGrow: 1, maxWidth: "400px" }}>
                <input
                  type="text"
                  placeholder="🔍 Search categories, description, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid #cbd5e1",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ec4899")}
                  onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
                />
              </div>

              <select
                value={anonymityFilter}
                onChange={(e) => setAnonymityFilter(e.target.value)}
                style={{
                  padding: "12px 16px",
                  borderRadius: "12px",
                  border: "1px solid #cbd5e1",
                  fontSize: "14px",
                  backgroundColor: "white",
                  outline: "none",
                  cursor: "pointer",
                  minWidth: "150px",
                }}
              >
                <option value="All">🛡️ All Disclosures</option>
                <option value="Anonymous">🕵️ Anonymous Only</option>
                <option value="Public">👥 Public Reports</option>
              </select>
            </div>
          </div>
        </div>

        {/* INCIDENT REPORTS LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredIncidents.length === 0 ? (
            /* EMPTY STATE */
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                padding: "60px 40px",
                textAlign: "center",
                boxShadow: "0 4px 25px rgba(31, 17, 71, 0.02)",
                border: "1px solid #f3d4e7",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "15px",
              }}
            >
              <div style={{ fontSize: "50px" }}>🛡️</div>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#1f1147" }}>
                All Clear!
              </h3>
              <p style={{ margin: 0, color: "#6b6375", maxWidth: "400px", fontSize: "15px" }}>
                No incident reports match your current filters. Make sure the spelling is correct or try changing your filters.
              </p>
            </div>
          ) : (
            filteredIncidents.map((incident) => {
              // Status Styling details
              let statusColor = "#f59e0b";
              let statusBg = "#fef3c7";
              let statusBorder = "#fde68a";

              if (incident.status === "Under Review") {
                statusColor = "#2563eb";
                statusBg = "#dbeafe";
                statusBorder = "#bfdbfe";
              } else if (incident.status === "Resolved") {
                statusColor = "#059669";
                statusBg = "#d1fae5";
                statusBorder = "#a7f3d0";
              }

              return (
                <div
                  key={incident._id}
                  className="incident-card"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "20px",
                    padding: "25px",
                    boxShadow: "0 4px 15px rgba(31, 17, 71, 0.02)",
                    border: "1px solid #f3d4e7",
                    borderLeft: `6px solid ${statusColor}`,
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    textAlign: "left",
                  }}
                >
                  {/* CARD HEADER */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      {/* CATEGORY TAG */}
                      <span
                        style={{
                          backgroundColor: "#fdf2f8",
                          color: "#ec4899",
                          fontWeight: "700",
                          fontSize: "13px",
                          padding: "6px 14px",
                          borderRadius: "20px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {incident.category}
                      </span>

                      {/* DATE */}
                      <span style={{ fontSize: "14px", color: "#6b6375", display: "flex", alignItems: "center", gap: "6px" }}>
                        📅 {formatDate(incident.createdAt)}
                      </span>
                    </div>

                    {/* STATUS PILL */}
                    <span
                      style={{
                        backgroundColor: statusBg,
                        color: statusColor,
                        border: `1px solid ${statusBorder}`,
                        fontWeight: "700",
                        fontSize: "12px",
                        padding: "6px 14px",
                        borderRadius: "20px",
                        textTransform: "uppercase",
                      }}
                    >
                      ● {incident.status}
                    </span>
                  </div>

                  {/* INCIDENT DETAILS */}
                  <div>
                    <h3
                      style={{
                        margin: "0 0 10px",
                        fontSize: "18px",
                        fontWeight: "600",
                        lineHeight: "1.4",
                        color: "#1f1147",
                      }}
                    >
                      {incident.description}
                    </h3>

                    <div style={{ fontSize: "14px", color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                      📍 <strong style={{ color: "#1f1147" }}>Location:</strong> {incident.location}
                    </div>
                  </div>

                  {/* REPORTER DETAILS & ACTION BUTTONS */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #f1f5f9",
                      paddingTop: "20px",
                      flexWrap: "wrap",
                      gap: "15px",
                    }}
                  >
                    {/* REPORTER BLOCK */}
                    <div>
                      {incident.isAnonymous ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#f1f5f9",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            color: "#475569",
                            fontWeight: "500",
                          }}
                        >
                          🕵️ <strong>Anonymous Report</strong> (Student Identity Shielded)
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "#f5f3ff",
                              color: "#8b5cf6",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              fontWeight: "bold",
                              fontSize: "13px",
                              border: "1px solid #ddd",
                            }}
                          >
                            {incident.user?.name ? incident.user.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div style={{ fontSize: "13px" }}>
                            <span style={{ color: "#6b6375" }}>Reported by:</span>{" "}
                            <strong style={{ color: "#1f1147" }}>
                              {incident.user?.name || "Student User"}
                            </strong>{" "}
                            <span style={{ color: "#6b6375" }}>({incident.user?.email || "No email"})</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* STATUS ACTION BUTTONS */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      {incident.status === "Pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(incident._id, "Under Review")}
                            className="btn-action"
                            style={{
                              padding: "10px 18px",
                              borderRadius: "10px",
                              border: "1px solid #3b82f6",
                              backgroundColor: "white",
                              color: "#2563eb",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            🔍 Review Incident
                          </button>
                          <button
                            onClick={() => updateStatus(incident._id, "Resolved")}
                            className="btn-action"
                            style={{
                              padding: "10px 18px",
                              borderRadius: "10px",
                              border: "none",
                              background: "linear-gradient(135deg,#059669,#10b981)",
                              color: "white",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "13px",
                              boxShadow: "0 2px 8px rgba(16,185,129,0.2)",
                            }}
                          >
                            ✅ Resolve Case
                          </button>
                        </>
                      )}

                      {incident.status === "Under Review" && (
                        <>
                          <button
                            onClick={() => updateStatus(incident._id, "Pending")}
                            className="btn-action"
                            style={{
                              padding: "10px 18px",
                              borderRadius: "10px",
                              border: "1px solid #cbd5e1",
                              backgroundColor: "white",
                              color: "#64748b",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "13px",
                            }}
                          >
                            ⚠️ Move to Pending
                          </button>
                          <button
                            onClick={() => updateStatus(incident._id, "Resolved")}
                            className="btn-action"
                            style={{
                              padding: "10px 18px",
                              borderRadius: "10px",
                              border: "none",
                              background: "linear-gradient(135deg,#059669,#10b981)",
                              color: "white",
                              fontWeight: "600",
                              cursor: "pointer",
                              fontSize: "13px",
                              boxShadow: "0 2px 8px rgba(16,185,129,0.2)",
                            }}
                          >
                            ✅ Mark Resolved
                          </button>
                        </>
                      )}

                      {incident.status === "Resolved" && (
                        <button
                          onClick={() => updateStatus(incident._id, "Under Review")}
                          className="btn-action"
                          style={{
                            padding: "10px 18px",
                            borderRadius: "10px",
                            border: "1px solid #8b5cf6",
                            backgroundColor: "white",
                            color: "#7c3aed",
                            fontWeight: "600",
                            cursor: "pointer",
                            fontSize: "13px",
                          }}
                        >
                          🔄 Re-open Case
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;