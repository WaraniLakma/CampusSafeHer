import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h1>CampusSafeHer Dashboard</h1>

      <hr />

      <h2>Emergency</h2>

      <button onClick={() => navigate("/sos")}>
        SOS Alert
      </button>

      <hr />

      <h2>Safety Features</h2>

      <button onClick={() => navigate("/contacts")}>
        Trusted Contacts
      </button>

      <br /><br />

      <button onClick={() => navigate("/incidents")}>
        Incident Reports
      </button>

      <br /><br />

      <button onClick={() => navigate("/checkins")}>
        Safety Check-In
      </button>

      <br /><br />

      <button onClick={() => navigate("/ai")}>
        AI Safety Assistant
      </button>
    </div>
  );
}

export default Dashboard;