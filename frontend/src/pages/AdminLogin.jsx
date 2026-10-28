import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      // Verify the logged-in user's actual role.
      const profileRes = await API.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileRes.data.user?.role !== "admin") {
        alert("Access denied. This account is not an administrator.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/admin");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at 50% 20%, #2d1863 0%, #160e33 70%, #0f0926 100%)",
        padding: "30px 20px",
        fontFamily: "var(--font-main)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* AMBIENT GLOW ORBS */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "40px",
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          borderRadius: "28px",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* LOGO & BADGE */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "68px",
              height: "68px",
              borderRadius: "20px",
              backgroundColor: "#fdf2f8",
              border: "1px solid #fbcfe8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 20px rgba(236, 72, 153, 0.2)",
            }}
          >
            <img
              src={logo}
              alt="CampusSafeHer logo"
              style={{ width: "46px", height: "46px", objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: "#fef2f2",
              color: "#dc2626",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "10px",
            }}
          >
            🛡️ Security Operations Center
          </div>

          <h1
            style={{
              color: "#1f1147",
              fontFamily: "var(--font-display)",
              fontSize: "26px",
              fontWeight: "800",
              margin: "0 0 8px",
            }}
          >
            Administrator Console
          </h1>

          <p style={{ color: "#64748b", fontSize: "14.5px", margin: 0, lineHeight: "1.5" }}>
            Sign in with authorized staff credentials to monitor campus incidents and safety status.
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ textAlign: "left" }}>
            <label
              htmlFor="admin-email"
              style={{ display: "block", marginBottom: "8px", fontSize: "13.5px", fontWeight: "600", color: "#334155" }}
            >
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@campus-security.edu"
              autoComplete="username"
              required
              className="modern-input"
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label
                htmlFor="admin-password"
                style={{ fontSize: "13.5px", fontWeight: "600", color: "#334155" }}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ec4899",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter administrator password"
              autoComplete="current-password"
              required
              className="modern-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "15.5px",
              borderRadius: "14px",
              fontWeight: "700",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.75 : 1,
              marginTop: "8px",
              boxShadow: "0 8px 24px rgba(236, 72, 153, 0.3)",
            }}
          >
            {loading ? "Authenticating..." : "Sign In to Admin Console ➜"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #f1f5f9" }}>
          <Link
            to="/account-type"
            style={{ color: "#7c3aed", textDecoration: "none", fontSize: "13.5px", fontWeight: "600" }}
          >
            ← Back to Portal Selection
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
