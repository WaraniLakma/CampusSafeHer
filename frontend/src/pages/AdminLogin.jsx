
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.webp";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        background: "linear-gradient(135deg, #fff1f8, #fff7fd)",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "35px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 10px 35px rgba(31, 17, 71, 0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "25px" }}>
          <img
            src={logo}
            alt="CampusSafeHer logo"
            style={{ width: "65px", height: "65px", objectFit: "contain" }}
          />

          <h1 style={{ color: "#1f1147", marginBottom: "8px" }}>
            Administrator Login
          </h1>

          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Sign in to manage campus safety incident reports.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <label
            htmlFor="admin-email"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}
          >
            Email Address
          </label>

          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your administrator email"
            autoComplete="username"
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxSizing: "border-box",
            }}
          />

          <label
            htmlFor="admin-password"
            style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}
          >
            Password
          </label>

          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              padding: "13px",
              marginBottom: "25px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(90deg, #8b5cf6, #ec4899)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing In..." : "Sign In as Administrator"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "22px" }}>
          <Link
            to="/account-type"
            style={{ color: "#8b5cf6", textDecoration: "none" }}
          >
            ← Back to Account Selection
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
