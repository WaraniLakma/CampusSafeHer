import { useLocation, useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.webp";

function AccountType() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended action from the homepage ("login" or "register").
  const action = location.state?.action || "login";

  const handleSelection = (role) => {
    if (role === "student") {
      if (action === "register") {
        navigate("/register");
      } else {
        navigate("/login");
      }
    } else {
      navigate("/admin-login");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--grad-hero-bg)",
        padding: "30px 20px",
        fontFamily: "var(--font-main)",
        position: "relative",
      }}
    >
      <style>{`
        .portal-option-card {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .portal-option-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 30px rgba(31, 17, 71, 0.08) !important;
          border-color: #ec4899 !important;
        }
        .portal-option-card:hover .portal-arrow {
          transform: translateX(4px);
          color: #ec4899 !important;
        }
        .portal-arrow {
          transition: all 0.2s ease;
        }
      `}</style>

      {/* AMBIENT GLOW */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "540px",
          backgroundColor: "white",
          borderRadius: "28px",
          padding: "40px",
          boxShadow: "0 20px 45px rgba(31, 17, 71, 0.06)",
          border: "1px solid #f3d4e7",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* BACK LINK & LOGO */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <Link
            to="/"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 12px",
              borderRadius: "10px",
              backgroundColor: "#f5f3ff",
              transition: "background 0.2s ease",
            }}
          >
            ← Back to Home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img src={logo} alt="CampusSafeHer" style={{ width: "28px", height: "28px", objectFit: "contain" }} />
            <span style={{ fontWeight: "800", color: "#1f1147", fontSize: "15px", fontFamily: "var(--font-display)" }}>
              CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
            </span>
          </div>
        </div>

        {/* HEADER */}
        <div style={{ textAlign: "left", marginBottom: "30px" }}>
          <span
            style={{
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              color: "#ec4899",
              backgroundColor: "#fdf2f8",
              padding: "4px 10px",
              borderRadius: "12px",
            }}
          >
            Access Gateway
          </span>
          <h1
            style={{
              color: "#1f1147",
              fontSize: "28px",
              fontWeight: "800",
              fontFamily: "var(--font-display)",
              margin: "10px 0 8px",
              lineHeight: "1.25",
            }}
          >
            Choose Your Portal
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0 }}>
            Select whether you want to access the Student Safety Suite or the Administrator Response Console.
          </p>
        </div>

        {/* PORTAL SELECTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* STUDENT PORTAL */}
          <button
            onClick={() => handleSelection("student")}
            className="portal-option-card"
            style={{
              width: "100%",
              padding: "24px",
              borderRadius: "20px",
              border: "2px solid #ddd6fe",
              backgroundColor: "#faf5ff",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.05)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                flexShrink: 0,
                boxShadow: "0 6px 16px rgba(139, 92, 246, 0.25)",
              }}
            >
              🎓
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <strong style={{ fontSize: "18px", color: "#1f1147", fontWeight: "700" }}>
                  Student Safety Portal
                </strong>
                <span
                  style={{
                    backgroundColor: "#ede9fe",
                    color: "#6d28d9",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  {action === "register" ? "Register" : "Sign In"}
                </span>
              </div>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
                Send emergency SOS alerts, set journey check-ins, manage trusted contacts & consult safety AI.
              </p>
            </div>

            <span className="portal-arrow" style={{ fontSize: "20px", color: "#8b5cf6", fontWeight: "bold" }}>
              →
            </span>
          </button>

          {/* ADMINISTRATOR PORTAL */}
          <button
            onClick={() => handleSelection("admin")}
            className="portal-option-card"
            style={{
              width: "100%",
              padding: "24px",
              borderRadius: "20px",
              border: "2px solid #fbcfe8",
              backgroundColor: "#fff5f9",
              textAlign: "left",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "20px",
              boxShadow: "0 4px 12px rgba(236, 72, 153, 0.05)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                flexShrink: 0,
                boxShadow: "0 6px 16px rgba(236, 72, 153, 0.25)",
              }}
            >
              🛡️
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <strong style={{ fontSize: "18px", color: "#1f1147", fontWeight: "700" }}>
                  Administrator Portal
                </strong>
                <span
                  style={{
                    backgroundColor: "#fce7f3",
                    color: "#be185d",
                    padding: "2px 8px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                >
                  Campus Security
                </span>
              </div>
              <p style={{ color: "#64748b", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>
                Review filed campus incident reports, update resolution states, and monitor safety alerts.
              </p>
            </div>

            <span className="portal-arrow" style={{ fontSize: "20px", color: "#ec4899", fontWeight: "bold" }}>
              →
            </span>
          </button>
        </div>

        {/* SECURITY FOOTER NOTE */}
        <div
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #fce7f3",
            textAlign: "center",
            fontSize: "13px",
            color: "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span>🔒</span> End-to-end encrypted connection & privacy protection
        </div>
      </div>
    </div>
  );
}

export default AccountType;
