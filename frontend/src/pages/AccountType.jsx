import { useLocation, useNavigate, Link } from "react-router-dom";

function AccountType() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get the intended action from the homepage.
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
        background: "#fff7fb",
        padding: "24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <Link
          to="/"
          style={{
            color: "#8b5cf6",
            textDecoration: "none",
          }}
        >
          ← Back to Home
        </Link>

        <div style={{ marginTop: "32px" }}>
          <h1 style={{ color: "#1f1147", fontSize: "30px" }}>
            Choose Your Account Type
          </h1>

          <p style={{ color: "#666", lineHeight: 1.6 }}>
            Select the portal you want to access.
          </p>
        </div>

        <button
          onClick={() => handleSelection("student")}
          style={{
            width: "100%",
            padding: "24px",
            marginTop: "24px",
            borderRadius: "16px",
            border: "2px solid #8b5cf6",
            background: "#f3e8ff",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <strong style={{ fontSize: "19px", color: "#1f1147" }}>
            🎓 Student Portal
          </strong>

          <p style={{ color: "#555", marginBottom: 0 }}>
            Register or log in to access student safety features.
          </p>
        </button>

        <button
          onClick={() => handleSelection("admin")}
          style={{
            width: "100%",
            padding: "24px",
            marginTop: "16px",
            borderRadius: "16px",
            border: "2px solid #ec4899",
            background: "#fce7f3",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <strong style={{ fontSize: "19px", color: "#1f1147" }}>
            🛡️ Administrator Portal
          </strong>

          <p style={{ color: "#555", marginBottom: 0 }}>
            Log in to manage and review incident reports.
          </p>
        </button>
      </div>
    </div>
  );
}

export default AccountType;