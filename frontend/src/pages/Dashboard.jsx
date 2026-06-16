import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "30px" }}>
      <h1>🛡️ CampusSafeHer</h1>

      <p>
        Your personal campus safety companion for emergency support,
        trusted contacts, incident reporting, and safe travel.
      </p>

      <hr />

      <h2>🚨 Emergency</h2>

      <button
        onClick={() => navigate("/sos")}
        style={{
          padding: "12px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        SOS Alert
      </button>

      <hr />

      <h2>🧭 Safety Features</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <button onClick={() => navigate("/contacts")}>
          👨‍👩‍👧 Trusted Contacts
        </button>

        <button onClick={() => navigate("/incidents")}>
          📝 Incident Reports
        </button>

        <button onClick={() => navigate("/checkins")}>
          📍 Safety Check-In
        </button>

        <button onClick={() => navigate("/ai")}>
          🤖 AI Safety Assistant
        </button>
      </div>
    </div>
  );
}

export default Dashboard;