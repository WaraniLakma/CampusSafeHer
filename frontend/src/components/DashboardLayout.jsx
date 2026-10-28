import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import logo from "../assets/logo.webp";
import dashboardBg from "../assets/dashboard-bg.png";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "🏠", label: "Dashboard", key: "dashboard" },
  { path: "/contacts", icon: "👥", label: "Trusted Contacts", key: "contacts" },
  { path: "/incidents", icon: "📝", label: "Report Incident", key: "incidents" },
  { path: "/checkins", icon: "📍", label: "Safety Check-Ins", key: "checkins" },
  { path: "/alerts", icon: "🔔", label: "Safety Alerts", key: "alerts" },
  { path: "/ai", icon: "🤖", label: "AI Safety Chat", key: "ai" },
];

function DashboardLayout({
  children,
  activeKey,
  pageTitle,
  pageSubtitle,
  user,
  toast,
  onDismissToast,
  headerActions,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Close profile dropdown on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest("#user-profile-menu-container")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userInitial = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  const formattedName = user?.name
    ? user.name
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ")
    : "Student";

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#fff7fb",
        fontFamily: "var(--font-main)",
        color: "var(--dark-800)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "28px",
            right: "28px",
            backgroundColor: toast.type === "success" ? "#065f46" : "#991b1b",
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
            animation: "fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            maxWidth: "420px",
          }}
        >
          <span style={{ fontSize: "18px" }}>
            {toast.type === "success" ? "✅" : "⚠️"}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          {onDismissToast && (
            <button
              onClick={onDismissToast}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                cursor: "pointer",
                padding: "2px 6px",
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(31, 17, 71, 0.45)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          }}
        />
      )}

      {/* DESKTOP & MOBILE SIDEBAR */}
      <aside
        style={{
          width: sidebarOpen ? "270px" : "0",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #f3d4e7",
          padding: sidebarOpen ? "24px 20px" : "0",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          boxShadow: sidebarOpen ? "4px 0 25px rgba(31, 17, 71, 0.03)" : "none",
          display: "flex",
          flexDirection: "column",
          zIndex: 1010,
          position: mobileDrawerOpen ? "fixed" : "sticky",
          top: 0,
          height: "100vh",
          flexShrink: 0,
          ...(mobileDrawerOpen
            ? {
                left: 0,
                width: "280px",
                padding: "24px 20px",
                boxShadow: "10px 0 35px rgba(0,0,0,0.15)",
              }
            : {}),
        }}
      >
        {/* BRAND LOGO */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "36px",
            paddingBottom: "16px",
            borderBottom: "1px solid #fce7f3",
          }}
        >
          <Link
            to="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 10px rgba(236, 72, 153, 0.15)",
              }}
            >
              <img
                src={logo}
                alt="CampusSafeHer"
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: "19px",
                  fontWeight: "800",
                  color: "#1f1147",
                  lineHeight: "1.2",
                  fontFamily: "var(--font-display)",
                }}
              >
                CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "#94a3b8",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                Student Safety Hub
              </div>
            </div>
          </Link>

          {/* Close drawer on mobile */}
          {mobileDrawerOpen && (
            <button
              onClick={() => setMobileDrawerOpen(false)}
              style={{
                border: "none",
                background: "#f1f5f9",
                borderRadius: "8px",
                width: "30px",
                height: "30px",
                cursor: "pointer",
                color: "#64748b",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* NAVIGATION LINKS */}
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              padding: "0 14px 6px",
            }}
          >
            Safety Navigation
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive =
              activeKey === item.key || location.pathname === item.path;

            return (
              <button
                key={item.key}
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate(item.path);
                }}
                style={{
                  padding: "13px 16px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  color: isActive ? "#ffffff" : "#475569",
                  background: isActive
                    ? "linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)"
                    : "transparent",
                  fontWeight: isActive ? "700" : "500",
                  fontSize: "14.5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  textAlign: "left",
                  boxShadow: isActive
                    ? "0 4px 16px rgba(236, 72, 153, 0.25)"
                    : "none",
                  position: "relative",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#fdf2f8";
                    e.currentTarget.style.color = "#ec4899";
                    e.currentTarget.style.transform = "translateX(4px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#475569";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && (
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM UTILITY / LOGOUT */}
        <div
          style={{
            paddingTop: "16px",
            marginTop: "auto",
            borderTop: "1px solid #fce7f3",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Link
            to="/"
            style={{
              padding: "11px 16px",
              borderRadius: "12px",
              color: "#64748b",
              textDecoration: "none",
              fontSize: "13.5px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.color = "#1f1147";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <span>🌐</span>
            <span>Back to Public Site</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              padding: "11px 16px",
              borderRadius: "12px",
              border: "1px solid #fee2e2",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              fontSize: "13.5px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              transition: "all 0.2s ease",
              width: "100%",
              textAlign: "left",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#fee2e2";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          backgroundImage: `url(${dashboardBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        {/* TOP NAVIGATION BAR */}
        <header
          style={{
            margin: "20px 24px 0",
            backgroundColor: "rgba(255, 255, 255, 0.94)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderRadius: "20px",
            padding: "14px 26px",
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
          {/* LEFT: TOGGLE & TITLE */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => {
                if (window.innerWidth <= 768) {
                  setMobileDrawerOpen(true);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              aria-label="Toggle sidebar"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#ffffff",
                color: "#1f1147",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ec4899";
                e.currentTarget.style.color = "#ec4899";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.color = "#1f1147";
              }}
            >
              ☰
            </button>

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1f1147",
                  fontFamily: "var(--font-display)",
                }}
              >
                {pageTitle || "Dashboard"}
              </h1>
              {pageSubtitle && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* RIGHT: STATUS PILL, CUSTOM ACTIONS & USER PROFILE */}
          <div
            id="user-profile-menu-container"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              position: "relative",
            }}
          >
            {/* Live system monitoring pill */}
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
                  animation: "pulseBadge 2s infinite ease-in-out",
                }}
              />
              <span>Campus Protection Active</span>
            </div>

            {headerActions}

            {/* USER PROFILE BUTTON */}
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              role="button"
              tabIndex={0}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 8px 4px 4px",
                borderRadius: "30px",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#f472b6";
                e.currentTarget.style.backgroundColor = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#f8fafc";
              }}
            >
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                  color: "white",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "700",
                  fontSize: "15px",
                  boxShadow: "0 2px 8px rgba(236, 72, 153, 0.25)",
                }}
              >
                {userInitial}
              </div>

              <div style={{ textAlign: "left", paddingRight: "6px" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#1f1147",
                    lineHeight: "1.2",
                  }}
                >
                  {formattedName.split(" ")[0]}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#ec4899",
                    fontWeight: "600",
                  }}
                >
                  Student
                </div>
              </div>
            </div>

            {/* PROFILE DROPDOWN MENU */}
            {showProfileMenu && (
              <div
                style={{
                  position: "absolute",
                  top: "54px",
                  right: "0",
                  backgroundColor: "white",
                  padding: "22px",
                  borderRadius: "20px",
                  boxShadow: "0 18px 40px rgba(31, 17, 71, 0.12)",
                  minWidth: "250px",
                  textAlign: "center",
                  zIndex: 1000,
                  border: "1px solid #f3d4e7",
                  animation: "fadeIn 0.2s ease-out",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    margin: "0 auto 12px",
                    fontWeight: "bold",
                    fontSize: "22px",
                    boxShadow: "0 4px 14px rgba(236, 72, 153, 0.25)",
                  }}
                >
                  {userInitial}
                </div>

                <h3
                  style={{
                    margin: "0 0 4px",
                    color: "#1f1147",
                    fontSize: "16px",
                    fontWeight: "700",
                  }}
                >
                  {formattedName}
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    margin: "0 0 16px",
                    wordBreak: "break-all",
                  }}
                >
                  {user?.email || "student@university.edu"}
                </p>

                <div
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    backgroundColor: "#fdf2f8",
                    color: "#ec4899",
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  🛡️ Emergency SOS & Tracking Enabled
                </div>

                <button
                  onClick={handleLogout}
                  style={{
                    width: "100%",
                    padding: "11px",
                    borderRadius: "12px",
                    border: "none",
                    background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
                    color: "white",
                    fontWeight: "700",
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(236, 72, 153, 0.25)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* BODY PAGE CONTENT */}
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
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
