import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";
import registerImage from "../assets/register.png";

function Login() {
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

      localStorage.setItem("token", res.data.token);
      alert("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#fff7fb",
        fontFamily: "var(--font-main)",
        flexWrap: "wrap",
      }}
    >
      {/* LEFT SIDE: AUTH FORM */}
      <div
        style={{
          flex: "1 1 480px",
          backgroundColor: "white",
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "680px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* LOGO & BACK LINK */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                backgroundColor: "#fdf2f8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(236,72,153,0.15)",
              }}
            >
              <img
                src={logo}
                alt="CampusSafeHer Logo"
                style={{ width: "28px", height: "28px", objectFit: "contain" }}
              />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                color: "#1f1147",
                fontSize: "19px",
                fontWeight: "800",
              }}
            >
              CampusSafe<span style={{ color: "#ec4899" }}>Her</span>
            </span>
          </Link>

          <Link
            to="/"
            style={{
              color: "#64748b",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* HEADER */}
        <div style={{ textAlign: "left", marginBottom: "32px" }}>
          <span
            style={{
              backgroundColor: "#fdf2f8",
              color: "#be185d",
              padding: "4px 12px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              display: "inline-block",
              marginBottom: "10px",
            }}
          >
            Student Access
          </span>
          <h1
            style={{
              color: "#1f1147",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 3.5vw, 2.6rem)",
              fontWeight: "800",
              margin: "0 0 10px",
              lineHeight: "1.2",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0, lineHeight: "1.6" }}>
            Sign in to access your personal safety hub, view real-time alerts, and stay connected with your circle.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* EMAIL */}
          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#334155",
              }}
            >
              University or Personal Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. name@university.edu"
              required
              className="modern-input"
              style={{
                padding: "14px 16px",
                fontSize: "15px",
                borderRadius: "14px",
                border: "1.5px solid #cbd5e1",
              }}
            />
          </div>

          {/* PASSWORD */}
          <div style={{ textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#334155",
                }}
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
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              required
              className="modern-input"
              style={{
                padding: "14px 16px",
                fontSize: "15px",
                borderRadius: "14px",
                border: "1.5px solid #cbd5e1",
              }}
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "16px",
              borderRadius: "14px",
              fontWeight: "700",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.75 : 1,
              marginTop: "10px",
              boxShadow: "0 8px 24px rgba(236, 72, 153, 0.28)",
            }}
          >
            {loading ? "Signing in..." : "Sign In to Safety Hub ➜"}
          </button>

          {/* FOOTER LINKS */}
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 10px" }}>
              Don't have an account yet?{" "}
              <span
                onClick={() => navigate("/register")}
                style={{
                  color: "#ec4899",
                  cursor: "pointer",
                  fontWeight: "700",
                  textDecoration: "underline",
                }}
              >
                Create Account
              </span>
            </p>

            <Link
              to="/admin-login"
              style={{
                color: "#7c3aed",
                fontSize: "13px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              🛡️ Are you a campus administrator? Sign in here
            </Link>
          </div>
        </form>
      </div>

      {/* RIGHT SIDE: HERO BRANDING BANNER */}
      <div
        style={{
          flex: "1 1 500px",
          minHeight: "450px",
          backgroundImage: `linear-gradient(
            135deg,
            rgba(31, 17, 71, 0.78),
            rgba(236, 72, 153, 0.75)
          ),
          url(${registerImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          color: "white",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.14)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.25)",
            padding: "32px",
            borderRadius: "24px",
            maxWidth: "520px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "24px" }}>🛡️</span>
            <span
              style={{
                fontSize: "13px",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "#fbcfe8",
              }}
            >
              Always Protected
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "22px",
              fontWeight: "700",
              margin: "0 0 10px",
              lineHeight: "1.3",
            }}
          >
            "Instant SOS alerts and journey check-ins gave me the safety reassurance I needed on campus."
          </h3>

          <p style={{ margin: 0, fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
            Trusted by female students across universities nationwide.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
