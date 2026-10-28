import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import registerImage from "../assets/register.png";
import logo from "../assets/logo.webp";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match. Please verify your password confirmation.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: `${firstName} ${lastName}`.trim(),
        email,
        password,
      });

      alert("Registration Successful! Please sign in to continue.");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration Failed. Please verify your details."
      );
    } finally {
      setLoading(false);
    }
  };

  // Password validation checks
  const isLenValid = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNum = /[0-9]/.test(password);

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
      {/* LEFT SIDE: REGISTRATION FORM */}
      <div
        style={{
          flex: "1 1 540px",
          backgroundColor: "white",
          padding: "50px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "720px",
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
            marginBottom: "30px",
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
        <div style={{ textAlign: "left", marginBottom: "28px" }}>
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
            New Student Registration
          </span>
          <h1
            style={{
              color: "#1f1147",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.9rem, 3.2vw, 2.5rem)",
              fontWeight: "800",
              margin: "0 0 10px",
              lineHeight: "1.2",
            }}
          >
            Create Your Account
          </h1>
          <p style={{ color: "#64748b", fontSize: "15px", margin: 0, lineHeight: "1.6" }}>
            Join CampusSafeHer to connect with trusted peers and enjoy safety protection across your university.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* NAME ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Jane"
                required
                className="modern-input"
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                required
                className="modern-input"
              />
            </div>
          </div>

          {/* UNIVERSITY DROPDOWN */}
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>
              University / Campus Institution
            </label>
            <select
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="modern-input"
              style={{ cursor: "pointer" }}
              required
            >
              <option value="">Select your university</option>
              <option value="University of Ruhuna">University of Ruhuna</option>
              <option value="University of Moratuwa">University of Moratuwa</option>
              <option value="University of Colombo">University of Colombo</option>
              <option value="University of Peradeniya">University of Peradeniya</option>
              <option value="University of Kelaniya">University of Kelaniya</option>
              <option value="Other">Other University</option>
            </select>
          </div>

          {/* EMAIL */}
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. student@university.edu"
              required
              className="modern-input"
            />
          </div>

          {/* PASSWORDS ROW */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <label style={{ fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>
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
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                required
                className="modern-input"
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "13.5px", fontWeight: "600", color: "#334155" }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                required
                className="modern-input"
              />
            </div>
          </div>

          {/* PASSWORD REQUIREMENT CHECKLIST */}
          <div
            style={{
              backgroundColor: "#fdf4f9",
              borderRadius: "16px",
              padding: "16px 20px",
              border: "1px solid #fce7f3",
              textAlign: "left",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#831843", marginBottom: "8px", textTransform: "uppercase" }}>
              Password Requirements:
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px" }}>
              <div style={{ fontSize: "13px", color: isLenValid ? "#15803d" : "#64748b", fontWeight: isLenValid ? "700" : "500" }}>
                {isLenValid ? "✅" : "○"} At least 8 characters
              </div>
              <div style={{ fontSize: "13px", color: hasUpper ? "#15803d" : "#64748b", fontWeight: hasUpper ? "700" : "500" }}>
                {hasUpper ? "✅" : "○"} One uppercase (A-Z)
              </div>
              <div style={{ fontSize: "13px", color: hasLower ? "#15803d" : "#64748b", fontWeight: hasLower ? "700" : "500" }}>
                {hasLower ? "✅" : "○"} One lowercase (a-z)
              </div>
              <div style={{ fontSize: "13px", color: hasNum ? "#15803d" : "#64748b", fontWeight: hasNum ? "700" : "500" }}>
                {hasNum ? "✅" : "○"} One number (0-9)
              </div>
            </div>
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
              marginTop: "4px",
              boxShadow: "0 8px 24px rgba(236, 72, 153, 0.28)",
            }}
          >
            {loading ? "Creating Account..." : "Create Account ➜"}
          </button>

          {/* FOOTER SWITCH */}
          <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", margin: "8px 0 0" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#ec4899",
                cursor: "pointer",
                fontWeight: "700",
                textDecoration: "underline",
              }}
            >
              Sign In
            </span>
          </p>
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
              Rapid Protection
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
            "A safe campus begins with connected students and immediate emergency response."
          </h3>

          <p style={{ margin: 0, fontSize: "14px", color: "rgba(255, 255, 255, 0.85)" }}>
            Join thousands of university peers using CampusSafeHer daily.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
